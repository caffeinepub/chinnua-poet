import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  username: string;
  title: string;
  preview: string;
  category: string;
  timestamp: string;
  likes: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface CommunityUser {
  username: string;
  bio?: string;
  createdAt: string;
}

interface CommunitySlideProps {
  onJoin: () => void;
  onLogin?: (user: CommunityUser) => void;
  currentUser: { username: string } | null;
}

export default function CommunitySlide({
  onJoin,
  onLogin,
  currentUser,
}: CommunitySlideProps) {
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [joinUsername, setJoinUsername] = useState("");
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    try {
      const stored: Post[] = JSON.parse(
        localStorage.getItem("chinnua_posts") || "[]",
      );
      setCommunityPosts(
        stored.filter((p) => p.username !== "CHINNUA_POET").slice(0, 20),
      );
    } catch {}
  }, []);

  const handleUsernameJoin = () => {
    const uname = joinUsername.trim();
    if (!uname) {
      setJoinError("Please enter a username.");
      return;
    }
    if (uname.length < 3) {
      setJoinError("Username must be at least 3 characters.");
      return;
    }
    setJoinError("");

    // Look up existing users
    let users: Array<
      CommunityUser & { emailOrPhone?: string; password?: string }
    > = [];
    try {
      users = JSON.parse(localStorage.getItem("chinnua_users") || "[]");
    } catch {}

    const existing = users.find(
      (u) => u.username.toLowerCase() === uname.toLowerCase(),
    );

    let user: CommunityUser;
    if (existing) {
      user = {
        username: existing.username,
        bio: existing.bio,
        createdAt: existing.createdAt,
      };
    } else {
      user = { username: uname, bio: "", createdAt: new Date().toISOString() };
      users.push({ ...user, emailOrPhone: "", password: "" });
      localStorage.setItem("chinnua_users", JSON.stringify(users));
    }

    localStorage.setItem("chinnua_user", JSON.stringify(user));
    if (onLogin) {
      onLogin(user);
    } else {
      onJoin();
    }
  };

  return (
    <div
      className="slide-container"
      style={{ overflowY: "auto", paddingBottom: "2rem" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.5rem" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "#3D2B1F",
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            Community
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              height: 1,
              background: "rgba(200,169,106,0.5)",
              margin: "0 auto 1.5rem",
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "1.05rem",
              color: "#8B6F47",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            A quiet space for poets. Share your words, feel understood.
          </motion.p>
        </div>

        {/* Join banner — username only */}
        {!currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: "#FFF8EE",
              border: "1px solid rgba(200,169,106,0.3)",
              borderRadius: 14,
              padding: "2rem",
              marginBottom: "2.5rem",
              color: "#3D2B1F",
            }}
            data-ocid="community.card"
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "1.1rem",
                color: "#3D2B1F",
                marginBottom: "1.25rem",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              Every poet has a voice.
              <br />
              Yours is waiting to be heard.
            </p>

            {/* Username-only join form */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(200,169,106,0.25)",
                borderRadius: 10,
                padding: "1.25rem",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.85rem",
                  color: "#3D2B1F",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                }}
              >
                Join with your username
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={joinUsername}
                  onChange={(e) => {
                    setJoinUsername(e.target.value);
                    setJoinError("");
                  }}
                  placeholder="Enter your username"
                  data-ocid="community.input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUsernameJoin();
                  }}
                  style={{
                    flex: 1,
                    background: "#FFFFFF",
                    border: "1px solid rgba(200,169,106,0.35)",
                    borderRadius: 7,
                    padding: "0.55rem 0.85rem",
                    color: "#3D2B1F",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
                <Button
                  onClick={handleUsernameJoin}
                  data-ocid="community.primary_button"
                  style={{
                    background: "rgba(200,169,106,0.85)",
                    border: "none",
                    color: "#3D2B1F",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontWeight: 700,
                    padding: "0.55rem 1.25rem",
                  }}
                >
                  Join
                </Button>
              </div>
              {joinError && (
                <p
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.78rem",
                    color: "#e53e3e",
                    marginTop: "0.4rem",
                  }}
                  data-ocid="community.error_state"
                >
                  {joinError}
                </p>
              )}
            </div>

            {/* Full signup fallback */}
            <p style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={onJoin}
                data-ocid="community.secondary_button"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.8rem",
                  color: "rgba(139,111,71,0.7)",
                  textDecoration: "underline",
                }}
              >
                Or sign up with full account →
              </button>
            </p>
          </motion.div>
        )}

        {currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              background: "rgba(200,169,106,0.08)",
              border: "1px solid rgba(139,111,71,0.3)",
              borderRadius: 10,
              padding: "1rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(200,169,106,0.3)",
                border: "1px solid rgba(200,169,106,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#3D2B1F",
                flexShrink: 0,
              }}
            >
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p
                style={{
                  color: "#D4A853",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  margin: 0,
                }}
              >
                Welcome, {currentUser.username}
              </p>
              <p
                style={{
                  color: "rgba(92,61,46,0.5)",
                  fontSize: "0.78rem",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  margin: 0,
                }}
              >
                You're part of this community.
              </p>
            </div>
          </motion.div>
        )}

        {/* Community guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.2rem",
              color: "#3D2B1F",
              marginBottom: "1rem",
              fontWeight: 700,
            }}
          >
            Community Values
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              {
                icon: "🖋️",
                title: "Authentic Voice",
                desc: "Share your true self through words",
              },
              {
                icon: "🤝",
                title: "Respect",
                desc: "Every poet deserves to be heard",
              },
              {
                icon: "🔒",
                title: "Safe Space",
                desc: "Vulnerability is strength here",
              },
              {
                icon: "✨",
                title: "Inspire",
                desc: "Let your words light a path",
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                style={{
                  background: "#FFF0F3",
                  border: "1px solid rgba(200,169,106,0.12)",
                  borderRadius: 10,
                  padding: "1.1rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1.4rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  {v.icon}
                </span>
                <p
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#3D2B1F",
                    margin: "0 0 0.25rem",
                  }}
                >
                  {v.title}
                </p>
                <p
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.78rem",
                    color: "rgba(92,61,46,0.5)",
                    margin: 0,
                  }}
                >
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent community posts */}
        {communityPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.2rem",
                color: "#3D2B1F",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              Recent Posts
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {communityPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.05 }}
                  data-ocid={`community.item.${i + 1}`}
                  style={{
                    background: "#FFF0F3",
                    border: "1px solid rgba(200,169,106,0.12)",
                    borderRadius: 10,
                    padding: "1rem 1.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(245,236,215,0.8)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#3D2B1F",
                        flexShrink: 0,
                      }}
                    >
                      {post.username.charAt(0).toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#3D2B1F",
                      }}
                    >
                      {post.username}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.72rem",
                        color: "rgba(92,61,46,0.5)",
                        marginLeft: "auto",
                      }}
                    >
                      {timeAgo(post.timestamp)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: "italic",
                      color: "#8B6F47",
                      fontSize: "0.88rem",
                      lineHeight: 1.75,
                      whiteSpace: "pre-line",
                      margin: 0,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {post.preview}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {communityPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            data-ocid="community.empty_state"
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              background: "rgba(245,236,215,0.7)",
              border: "1px solid rgba(200,169,106,0.1)",
              borderRadius: 14,
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "rgba(92,61,46,0.5)",
                lineHeight: 1.8,
              }}
            >
              No community posts yet.
              <br />
              Be the first to share your words.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
