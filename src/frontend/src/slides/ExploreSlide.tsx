import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

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

export default function ExploreSlide({
  currentUser,
}: { currentUser: User | null }) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    try {
      const storedPosts: Post[] = JSON.parse(
        localStorage.getItem("chinnua_posts") || "[]",
      );
      setPosts(storedPosts);
      const storedUsers: User[] = JSON.parse(
        localStorage.getItem("chinnua_users") || "[]",
      );
      setUsers(storedUsers);
    } catch {}
  }, []);

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
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return users
      .filter((u) => u.username.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, users]);

  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
      .slice(0, 12);
  }, [posts]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: WARM_BG,
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "2rem" }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "2rem",
              color: WARM_MOCHA,
              marginBottom: "0.35rem",
              fontWeight: 700,
            }}
          >
            Explore
          </h1>
          <p
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(92,61,46,0.65)",
              fontSize: "0.88rem",
            }}
          >
            Discover poems and voices from the community
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ marginBottom: "2rem" }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: WARM_BROWN,
                fontSize: "1rem",
              }}
            >
              🔍
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search poems, users, topics..."
              data-ocid="explore.search_input"
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                borderRadius: 12,
                border: `1px solid ${WARM_BORDER}`,
                background: WARM_PAPER,
                color: WARM_TEXT,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.9rem",
                outline: "none",
                boxShadow: "0 2px 8px rgba(92,61,46,0.06)",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,168,83,0.6)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = WARM_BORDER;
              }}
            />
          </div>
        </motion.div>

        {/* User results */}
        {filteredUsers.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ marginBottom: "1.75rem" }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.75rem",
                color: WARM_GOLD,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Users
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {filteredUsers.map((u) => (
                <div
                  key={u.username}
                  style={{
                    background: WARM_PAPER,
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 10,
                    padding: "0.5rem 0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(212,168,83,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.85rem",
                      color: WARM_MOCHA,
                      fontWeight: 700,
                    }}
                  >
                    {u.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.82rem",
                        color: WARM_TEXT,
                        margin: 0,
                      }}
                    >
                      {u.username}
                    </p>
                    {u.bio && (
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.68rem",
                          color: "rgba(61,43,31,0.55)",
                          margin: 0,
                        }}
                      >
                        {u.bio.slice(0, 40)}
                        {u.bio.length > 40 ? "…" : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Search results or trending */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "0.75rem",
              color: WARM_GOLD,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            {query.trim() ? `Results for "${query}"` : "Trending"}
          </h2>

          {(query.trim() ? filteredPosts : trendingPosts).length === 0 ? (
            <div
              data-ocid="explore.empty_state"
              style={{ textAlign: "center", padding: "3rem 1rem" }}
            >
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontStyle: "italic",
                  color: "rgba(61,43,31,0.55)",
                }}
              >
                No results found
              </p>
            </div>
          ) : (
            <div style={{ columns: "2 280px", columnGap: "1rem" }}>
              {(query.trim() ? filteredPosts : trendingPosts).map(
                (post, idx) => (
                  <motion.div
                    key={post.id}
                    data-ocid={`explore.item.${idx + 1}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.4 }}
                    style={{
                      background: WARM_PAPER,
                      border: `1px solid ${WARM_BORDER}`,
                      borderRadius: 12,
                      padding: "1rem 1.1rem",
                      marginBottom: "1rem",
                      breakInside: "avoid",
                      boxShadow: "0 2px 8px rgba(92,61,46,0.06)",
                      transition: "box-shadow 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 4px 16px rgba(92,61,46,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 2px 8px rgba(92,61,46,0.06)";
                    }}
                  >
                    {post.category && (
                      <span
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "0.6rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: WARM_GOLD,
                          marginBottom: "0.4rem",
                          display: "block",
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                    {post.title && (
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "0.95rem",
                          color: WARM_MOCHA,
                          marginBottom: "0.4rem",
                          fontWeight: 700,
                          lineHeight: 1.4,
                        }}
                      >
                        {post.title}
                      </h3>
                    )}
                    <p
                      style={{
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.82rem",
                        color: "rgba(61,43,31,0.75)",
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {post.preview?.slice(0, 120)}
                      {(post.preview?.length ?? 0) > 120 ? "…" : ""}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.68rem",
                          color: "rgba(61,43,31,0.55)",
                        }}
                      >
                        @{post.username}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.68rem",
                          color: WARM_BROWN,
                        }}
                      >
                        ❤️ {post.likes ?? 0}
                      </span>
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          )}
        </motion.section>

        {!currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              textAlign: "center",
              padding: "1.5rem",
              marginTop: "1.5rem",
              background: WARM_PAPER,
              borderRadius: 12,
              border: `1px solid ${WARM_BORDER}`,
            }}
          >
            <p
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontStyle: "italic",
                color: "rgba(61,43,31,0.65)",
                fontSize: "0.85rem",
              }}
            >
              Sign in to share your poetry with the community
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
