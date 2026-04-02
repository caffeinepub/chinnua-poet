import { Search, UserCheck, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { AI_BOTS, seedBotData } from "../data/ai-bots";

interface User {
  username: string;
  bio: string;
  createdAt: string;
}

interface Post {
  id: string;
  username: string;
  title: string;
  preview: string;
  likes: number;
  timestamp: string;
  category?: string;
}

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_BROWN = "#8B6F47";
const WARM_MOCHA = "#5C3D2E";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";

function getBotAvatar(username: string): string | null {
  const bot = AI_BOTS.find((b) => b.username === username);
  return bot ? bot.photo : null;
}

function getUserAvatar(username: string): string | null {
  const botPhoto = getBotAvatar(username);
  if (botPhoto) return botPhoto;
  try {
    const p = localStorage.getItem(`chinnua_profile_${username}`);
    if (p) return JSON.parse(p)?.photo ?? null;
  } catch {}
  return null;
}

function AvatarBubble({
  username,
  size = 40,
}: { username: string; size?: number }) {
  const photo = getUserAvatar(username);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(139,111,71,0.15)",
        border: `1px solid ${WARM_BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 700,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt={username}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ color: WARM_BROWN }}>
          {username.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function ExploreSlide({
  currentUser,
}: { currentUser: User | null }) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ username: string; bio?: string }[]>([]);
  const [follows, setFollows] = useState<
    Record<string, { following: string[]; followers: string[] }>
  >({});

  useEffect(() => {
    seedBotData();
    try {
      const storedPosts: Post[] = JSON.parse(
        localStorage.getItem("chinnua_posts") || "[]",
      );
      // Add bot posts to explore
      const botPostsRaw: Post[] = JSON.parse(
        localStorage.getItem("chinnua_bot_posts") || "[]",
      );
      setPosts([...botPostsRaw, ...storedPosts]);
      const storedUsers: { username: string; bio?: string }[] = JSON.parse(
        localStorage.getItem("chinnua_users") || "[]",
      );
      // Merge with bot users
      const allBots = AI_BOTS.map((b) => ({
        username: b.username,
        bio: b.bio,
      }));
      const realUsernames = new Set(storedUsers.map((u) => u.username));
      const merged = [
        ...storedUsers,
        ...allBots.filter((b) => !realUsernames.has(b.username)),
      ];
      setUsers(merged);
      setFollows(JSON.parse(localStorage.getItem("chinnua_follows") || "{}"));
    } catch {}
  }, []);

  const myFollowing = currentUser
    ? (follows[currentUser.username]?.following ?? [])
    : [];

  const handleFollow = (username: string) => {
    if (!currentUser) return;
    const updated = { ...follows };
    if (!updated[currentUser.username])
      updated[currentUser.username] = { following: [], followers: [] };
    if (!updated[username])
      updated[username] = { following: [], followers: [] };
    const alreadyFollowing =
      updated[currentUser.username].following.includes(username);
    if (alreadyFollowing) {
      updated[currentUser.username].following = updated[
        currentUser.username
      ].following.filter((u) => u !== username);
      updated[username].followers = updated[username].followers.filter(
        (u) => u !== currentUser.username,
      );
    } else {
      updated[currentUser.username].following.push(username);
      updated[username].followers.push(currentUser.username);
    }
    localStorage.setItem("chinnua_follows", JSON.stringify(updated));
    setFollows(updated);
  };

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts.slice(0, 20);
    const q = query.toLowerCase();
    return posts
      .filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.preview?.toLowerCase().includes(q) ||
          p.username?.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [query, posts]);

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users.slice(0, 8);
    const q = query.toLowerCase();
    return users
      .filter((u) => u.username.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, users]);

  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
      .slice(0, 12);
  }, [posts]);

  const discoverUsers = useMemo(() => {
    if (query.trim()) return filteredUsers;
    // Show all bot users + real users, up to 12
    const botUsers = AI_BOTS.map((b) => ({ username: b.username, bio: b.bio }));
    const realUsers = users.filter(
      (u) => !AI_BOTS.find((b) => b.username === u.username),
    );
    return [...botUsers, ...realUsers].slice(0, 12);
  }, [query, filteredUsers, users]);

  const displayPosts = query.trim() ? filteredPosts : trendingPosts;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: WARM_BG,
        padding: "2rem 1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: 780, margin: "0 auto" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.3rem",
            }}
          >
            <Search size={18} color={WARM_GOLD} />
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.6rem",
                color: WARM_MOCHA,
                margin: 0,
                fontWeight: 700,
              }}
            >
              Explore
            </h1>
          </div>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.85rem",
              color: WARM_BROWN,
              margin: 0,
            }}
          >
            Discover voices that resonate with yours
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <Search
            size={16}
            color={WARM_BROWN}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            placeholder="Search poems, poets, titles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-ocid="explore.search_input"
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.8rem",
              background: WARM_PAPER,
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 12,
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.9rem",
              color: WARM_TEXT,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Discover Users section */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.1rem",
              color: WARM_MOCHA,
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            {query.trim() ? "Matching Poets" : "Discover Poets"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {discoverUsers.map((u) => {
              const isFollowing = myFollowing.includes(u.username);
              const followerCount = (follows[u.username]?.followers ?? [])
                .length;
              const bot = AI_BOTS.find((b) => b.username === u.username);
              return (
                <motion.div
                  key={u.username}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: WARM_PAPER,
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 14,
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.6rem",
                    textAlign: "center",
                  }}
                >
                  <AvatarBubble username={u.username} size={56} />
                  <div>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: WARM_MOCHA,
                      }}
                    >
                      {bot?.displayName ?? u.username}
                    </div>
                    {u.bio && (
                      <div
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontStyle: "italic",
                          fontSize: "0.72rem",
                          color: WARM_BROWN,
                          marginTop: 2,
                          lineHeight: 1.4,
                        }}
                      >
                        {u.bio.length > 50 ? `${u.bio.slice(0, 50)}…` : u.bio}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: WARM_BROWN,
                        marginTop: 4,
                      }}
                    >
                      {followerCount}{" "}
                      {followerCount === 1 ? "follower" : "followers"}
                    </div>
                  </div>
                  {currentUser && u.username !== currentUser.username && (
                    <button
                      type="button"
                      onClick={() => handleFollow(u.username)}
                      data-ocid="explore.button"
                      style={{
                        background: isFollowing
                          ? "rgba(139,111,71,0.1)"
                          : "rgba(212,168,83,0.15)",
                        border: `1px solid ${isFollowing ? WARM_BORDER : "rgba(212,168,83,0.4)"}`,
                        borderRadius: 20,
                        padding: "0.3rem 0.9rem",
                        cursor: "pointer",
                        fontFamily: "'Lora', Georgia, serif",
                        fontSize: "0.7rem",
                        color: isFollowing ? WARM_BROWN : WARM_MOCHA,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        transition: "all 0.2s",
                      }}
                    >
                      {isFollowing ? (
                        <UserCheck size={12} />
                      ) : (
                        <UserPlus size={12} />
                      )}
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Trending / Search Posts */}
        <section>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.1rem",
              color: WARM_MOCHA,
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            {query.trim() ? "Matching Posts" : "Trending Poems"}
          </h2>
          {displayPosts.length === 0 ? (
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                color: WARM_BROWN,
                textAlign: "center",
                padding: "2rem",
              }}
              data-ocid="explore.empty_state"
            >
              No poems found yet. Be the first to share.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1rem",
              }}
              data-ocid="explore.list"
            >
              {displayPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  data-ocid={`explore.item.${idx + 1}`}
                  style={{
                    background: WARM_PAPER,
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 14,
                    padding: "1.1rem",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: WARM_MOCHA,
                      marginBottom: "0.4rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.75rem",
                      color: WARM_BROWN,
                      fontStyle: "italic",
                      whiteSpace: "pre-line",
                      lineHeight: 1.5,
                      marginBottom: "0.6rem",
                    }}
                  >
                    {`${(post.preview ?? "").slice(0, 80)}${(post.preview?.length ?? 0) > 80 ? "…" : ""}`}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontSize: "0.68rem",
                        color: WARM_BROWN,
                      }}
                    >
                      @{post.username}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontSize: "0.68rem",
                        color: WARM_GOLD,
                        fontWeight: 600,
                      }}
                    >
                      {post.likes ?? 0} likes
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}
