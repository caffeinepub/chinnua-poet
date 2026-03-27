import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LoginGate } from "../components/LoginGate";
import { POEMS } from "../poems-data";

interface User {
  username: string;
  bio: string;
  createdAt: string;
}

interface Reply {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: string;
  username: string;
  title: string;
  preview: string;
  fullContent: string;
  category: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
}

interface FeedSlideProps {
  currentUser: User | null;
  onJoin: () => void;
  onLogin: (user: User) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function buildFeedPosts(): Post[] {
  const base = new Date("2024-01-01").getTime();
  return POEMS.map((p, i) => ({
    id: `poem_${p.id}`,
    username: "CHINNUA_POET",
    title: p.title,
    preview: p.full.split("\n").filter(Boolean).slice(0, 3).join("\n"),
    fullContent: p.full,
    category: p.theme || "Poetry",
    timestamp: new Date(base + i * 172800000).toISOString(),
    likes: 0,
    replies: [],
  }));
}

function PostCard({
  post,
  liked,
  onLike,
  onExpand,
  onReply,
  idx,
}: {
  post: Post;
  liked: boolean;
  onLike: (id: string) => void;
  onExpand: (post: Post) => void;
  onReply: (post: Post) => void;
  idx: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(idx * 0.03, 0.5), duration: 0.5 }}
      data-ocid={`feed.item.${idx + 1}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onExpand(post);
      }}
      style={{
        flexShrink: 0,
        width: "clamp(280px, 33vw, 360px)",
        height: 400,
        background: "rgba(16,24,38,0.85)",
        border: "1px solid rgba(200,169,106,0.15)",
        borderRadius: 14,
        padding: "1.4rem",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "border-color 0.25s, box-shadow 0.25s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(200,169,106,0.4)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 4px 30px rgba(0,0,0,0.5), 0 0 20px rgba(200,169,106,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(200,169,106,0.15)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 4px 20px rgba(0,0,0,0.35)";
      }}
      onClick={() => onExpand(post)}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background:
              post.username === "CHINNUA_POET"
                ? "rgba(200,169,106,0.3)"
                : "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#F5E6D3",
            border:
              post.username === "CHINNUA_POET"
                ? "1px solid rgba(200,169,106,0.5)"
                : "1px solid rgba(255,255,255,0.15)",
            flexShrink: 0,
          }}
        >
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              color:
                post.username === "CHINNUA_POET"
                  ? "rgba(200,169,106,0.9)"
                  : "#F5E6D3",
              fontWeight: 600,
              fontSize: "0.8rem",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            {post.username === "CHINNUA_POET"
              ? "❆ CHINNUA_POET"
              : post.username}
          </p>
          <p
            style={{
              color: "rgba(229,231,235,0.4)",
              fontSize: "0.7rem",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              margin: 0,
            }}
          >
            {timeAgo(post.timestamp)}
          </p>
        </div>
        {post.category && post.category !== "Community" && (
          <span
            style={{
              padding: "2px 8px",
              background: "rgba(200,169,106,0.1)",
              borderRadius: 4,
              fontSize: "0.65rem",
              color: "rgba(200,169,106,0.8)",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              flexShrink: 0,
            }}
          >
            {post.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {post.title && (
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#F5E6D3",
              lineHeight: 1.4,
              margin: "0 0 0.5rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.title}
          </h3>
        )}
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            color: "rgba(229,231,235,0.72)",
            fontSize: "0.88rem",
            lineHeight: 1.85,
            whiteSpace: "pre-line",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 6,
            WebkitBoxOrient: "vertical",
            margin: 0,
          }}
        >
          {post.preview}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid rgba(200,169,106,0.1)",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: "rgba(200,169,106,0.7)",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            flex: 1,
          }}
        >
          Click to read
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLike(post.id);
          }}
          data-ocid="feed.toggle"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: liked ? "#f43f5e" : "rgba(229,231,235,0.5)",
            fontSize: "0.8rem",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            display: "flex",
            alignItems: "center",
            gap: 3,
            transition: "color 0.2s",
          }}
        >
          ❤️ {post.likes}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReply(post);
          }}
          data-ocid="feed.secondary_button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(229,231,235,0.5)",
            fontSize: "0.8rem",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          💬 {post.replies.length}
        </button>
      </div>
    </motion.button>
  );
}

export default function FeedSlide({
  currentUser,
  onJoin,
  onLogin,
}: FeedSlideProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);
  const [replyPost, setReplyPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const poemPosts = buildFeedPosts();
    const stored: Post[] = JSON.parse(
      localStorage.getItem("chinnua_posts") || "[]",
    );
    const deletedIds = new Set<string>(
      JSON.parse(localStorage.getItem("chinnua_deleted_posts") || "[]"),
    );
    const likesMap: Record<string, number> = JSON.parse(
      localStorage.getItem("chinnua_likes") || "{}",
    );
    const repliesMap: Record<string, Reply[]> = JSON.parse(
      localStorage.getItem("chinnua_replies") || "{}",
    );
    const liked: string[] = JSON.parse(
      localStorage.getItem("chinnua_liked_ids") || "[]",
    );
    setLikedPosts(new Set(liked));
    const all = [...stored, ...poemPosts]
      .filter((p) => !deletedIds.has(p.id))
      .map((p) => ({
        ...p,
        likes: likesMap[p.id] ?? p.likes,
        replies: repliesMap[p.id] ?? p.replies,
      }))
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    setPosts(all);
  }, []);

  const handlePost = () => {
    if (!currentUser || !newPost.trim()) return;
    const post: Post = {
      id: `user_${Date.now()}`,
      username: currentUser.username,
      title: "",
      preview: newPost.trim(),
      fullContent: newPost.trim(),
      category: "Community",
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    const stored: Post[] = JSON.parse(
      localStorage.getItem("chinnua_posts") || "[]",
    );
    stored.unshift(post);
    localStorage.setItem("chinnua_posts", JSON.stringify(stored));
    setPosts((prev) => [post, ...prev]);
    setNewPost("");
  };

  const handleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    const likesMap: Record<string, number> = JSON.parse(
      localStorage.getItem("chinnua_likes") || "{}",
    );
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
      likesMap[postId] = Math.max(0, (likesMap[postId] ?? 1) - 1);
    } else {
      newLiked.add(postId);
      likesMap[postId] = (likesMap[postId] ?? 0) + 1;
    }
    localStorage.setItem("chinnua_likes", JSON.stringify(likesMap));
    localStorage.setItem("chinnua_liked_ids", JSON.stringify([...newLiked]));
    setLikedPosts(newLiked);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: likesMap[postId] } : p,
      ),
    );
  };

  const handleReply = (postId: string) => {
    if (!currentUser || !replyText.trim()) return;
    const reply: Reply = {
      id: `reply_${Date.now()}`,
      username: currentUser.username,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    };
    const repliesMap: Record<string, Reply[]> = JSON.parse(
      localStorage.getItem("chinnua_replies") || "{}",
    );
    repliesMap[postId] = [reply, ...(repliesMap[postId] ?? [])];
    localStorage.setItem("chinnua_replies", JSON.stringify(repliesMap));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, replies: repliesMap[postId] } : p,
      ),
    );
    setReplyText("");
    setReplyPost(null);
  };

  const scrollFeed = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="slide-container"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1rem 0",
          maxWidth: "100%",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.6rem",
              color: "#F5E6D3",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Poetry Feed
          </h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => scrollFeed("left")}
              data-ocid="feed.pagination_prev"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(200,169,106,0.1)",
                border: "1px solid rgba(200,169,106,0.25)",
                color: "rgba(229,231,235,0.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollFeed("right")}
              data-ocid="feed.pagination_next"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(200,169,106,0.1)",
                border: "1px solid rgba(200,169,106,0.25)",
                color: "rgba(229,231,235,0.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Create post card */}
        <div
          className="feed-card"
          style={{
            marginBottom: "1.25rem",
            padding: "1rem",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        >
          {currentUser ? (
            <>
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Write your poetry..."
                data-ocid="feed.textarea"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(200,169,106,0.2)",
                  color: "#F5E6D3",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "0.95rem",
                  resize: "none",
                  minHeight: 60,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "0.6rem",
                }}
              >
                <Button
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  data-ocid="feed.submit_button"
                  style={{
                    background: "rgba(200,169,106,0.85)",
                    border: "none",
                    color: "#fff",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                  }}
                >
                  Share
                </Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "0.75rem 0" }}>
              <p
                style={{
                  color: "rgba(229,231,235,0.6)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  marginBottom: "0.75rem",
                  fontSize: "0.9rem",
                }}
              >
                Join to share your poetry
              </p>
              <Button
                onClick={onJoin}
                data-ocid="feed.primary_button"
                style={{
                  background: "rgba(200,169,106,0.85)",
                  border: "none",
                  color: "#fff",
                }}
              >
                Join the Community
              </Button>
            </div>
          )}
        </div>

        {/* Horizontal scroll feed */}
        <div style={{ position: "relative", flex: 1 }}>
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              gap: "1rem",
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: "1.5rem",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(200,169,106,0.25) transparent",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {posts.map((post, idx) => (
              <PostCard
                key={post.id}
                post={post}
                liked={likedPosts.has(post.id)}
                onLike={handleLike}
                onExpand={setExpandedPost}
                onReply={setReplyPost}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Expand dialog */}
      <Dialog open={!!expandedPost} onOpenChange={() => setExpandedPost(null)}>
        <DialogContent
          style={{
            background: "#1A1410",
            border: "1px solid rgba(200,169,106,0.2)",
            maxWidth: 600,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          data-ocid="feed.dialog"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F5E6D3",
                fontSize: "1.3rem",
              }}
            >
              {expandedPost?.title || "Poem"}
            </DialogTitle>
          </DialogHeader>
          {currentUser ? (
            <pre
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "rgba(229,231,235,0.85)",
                fontSize: "0.95rem",
                lineHeight: 2,
                whiteSpace: "pre-wrap",
                marginTop: "1rem",
              }}
            >
              {expandedPost?.fullContent}
            </pre>
          ) : (
            <LoginGate
              onLogin={(u) => {
                const user: User = {
                  username: u.username,
                  bio: "",
                  createdAt: u.createdAt,
                };
                onLogin(user);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reply dialog */}
      <AnimatePresence>
        {replyPost && (
          <Dialog open={!!replyPost} onOpenChange={() => setReplyPost(null)}>
            <DialogContent
              style={{
                background: "#1A1410",
                border: "1px solid rgba(200,169,106,0.2)",
                maxWidth: 480,
              }}
              data-ocid="feed.dialog"
            >
              <DialogHeader>
                <DialogTitle
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#F5E6D3",
                    fontSize: "1.1rem",
                  }}
                >
                  Reply to {replyPost.title || replyPost.username}
                </DialogTitle>
              </DialogHeader>
              {currentUser ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      data-ocid="feed.input"
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(200,169,106,0.2)",
                        borderRadius: 6,
                        padding: "0.5rem 0.75rem",
                        color: "#F5E6D3",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleReply(replyPost.id);
                      }}
                    />
                    <Button
                      onClick={() => handleReply(replyPost.id)}
                      data-ocid="feed.submit_button"
                      style={{
                        background: "rgba(200,169,106,0.8)",
                        border: "none",
                        color: "#fff",
                      }}
                    >
                      Reply
                    </Button>
                  </div>
                  {posts
                    .find((p) => p.id === replyPost.id)
                    ?.replies.slice(0, 5)
                    .map((r) => (
                      <div
                        key={r.id}
                        style={{
                          marginTop: "0.5rem",
                          paddingLeft: "0.75rem",
                          borderLeft: "2px solid rgba(200,169,106,0.2)",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            color: "rgba(229,231,235,0.8)",
                            fontSize: "0.8rem",
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                          }}
                        >
                          {r.username}
                        </span>
                        <span
                          style={{
                            color: "rgba(229,231,235,0.6)",
                            fontSize: "0.8rem",
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            marginLeft: 8,
                          }}
                        >
                          {r.text}
                        </span>
                      </div>
                    ))}
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                  <p
                    style={{
                      color: "rgba(229,231,235,0.6)",
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Join to reply to poems
                  </p>
                  <Button
                    onClick={() => {
                      setReplyPost(null);
                      onJoin();
                    }}
                    data-ocid="feed.primary_button"
                    style={{
                      background: "rgba(200,169,106,0.85)",
                      border: "none",
                      color: "#fff",
                    }}
                  >
                    Join
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
