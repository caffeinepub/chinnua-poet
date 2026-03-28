import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CommentThread, {
  type Comment,
  type CommentReply,
} from "../components/CommentThread";
import { LoginGate } from "../components/LoginGate";
import { useActor } from "../hooks/useActor";
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
  onViewProfile?: (username: string) => void;
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

function getPoetsNotePost(): Post | null {
  const note = localStorage.getItem("chinnua_poets_note") || "";
  const savedAtStr = localStorage.getItem("chinnua_poets_note_saved_at");
  const alreadyPosted =
    localStorage.getItem("chinnua_poets_note_feed_posted") === "true";
  if (!note || !savedAtStr || alreadyPosted) return null;
  const savedAt = Number.parseInt(savedAtStr, 10);
  const elapsed = Date.now() - savedAt;
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (elapsed < twentyFourHours) return null;
  localStorage.setItem("chinnua_poets_note_feed_posted", "true");
  return {
    id: `poets_note_${savedAt}`,
    username: "CHINNUA_POET",
    title: "A Note from the Poet",
    preview: note.slice(0, 200),
    fullContent: note,
    category: "Poet's Note",
    timestamp: new Date(savedAt + twentyFourHours).toISOString(),
    likes: 0,
    replies: [],
  };
}

function getUserAvatar(username: string): string | null {
  try {
    const p = localStorage.getItem(`chinnua_profile_${username}`);
    if (p) return JSON.parse(p)?.photo ?? null;
  } catch {}
  return null;
}

function PostCard({
  post,
  liked,
  onLike,
  onExpand,
  onReply,
  currentUser,
  onViewProfile,
  idx,
}: {
  post: Post;
  liked: boolean;
  onLike: (id: string) => void;
  onExpand: (post: Post) => void;
  onReply: (post: Post) => void;
  currentUser: User | null;
  onViewProfile?: (username: string) => void;
  idx: number;
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setCommentsState] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const { actor } = useActor();

  const loadComments = async (postId: string) => {
    if (!actor || commentsLoaded) return;
    try {
      const backendComments = await actor.getCommentsForPost(postId);
      const mapped: Comment[] = await Promise.all(
        backendComments.map(async (bc) => {
          let replies: CommentReply[] = [];
          try {
            const backendReplies = await actor.getRepliesForComment(bc.id);
            replies = backendReplies.map((br) => ({
              id: br.id.toString(),
              userId: br.author.toText(),
              username: br.authorName,
              text: br.text,
              timestamp: Number(br.timestamp / 1_000_000n),
            }));
          } catch {}
          return {
            id: bc.id.toString(),
            postId: bc.postId,
            userId: bc.author.toText(),
            username: bc.authorName,
            text: bc.text,
            timestamp: Number(bc.timestamp / 1_000_000n),
            replies,
          };
        }),
      );
      setCommentsState(mapped);
      setCommentsLoaded(true);
    } catch {}
  };

  const handleAddComment = async (postId: string, text: string) => {
    if (!currentUser || !actor) return;
    try {
      const result = await actor.addComment(postId, text, currentUser.username);
      if (result.__kind__ === "success") {
        const bc = result.success;
        const newComment: Comment = {
          id: bc.id.toString(),
          postId: bc.postId,
          userId: bc.author.toText(),
          username: bc.authorName,
          text: bc.text,
          timestamp: Number(bc.timestamp / 1_000_000n),
          replies: [],
        };
        setCommentsState((prev) => [...prev, newComment]);
      } else {
        const kind = (result as { __kind__: string }).__kind__;
        if (kind === "pendingReview") {
          toast(
            "Your post is under review. It will be published once approved.",
            { icon: "🛡️" },
          );
        } else if (kind === "moderationRejected") {
          toast(
            "Your post could not be published. Please review our community guidelines.",
            { icon: "🖤" },
          );
        }
      }
    } catch {}
  };

  const handleAddReply = async (
    postId: string,
    commentId: string,
    text: string,
  ) => {
    if (!currentUser || !actor) return;
    try {
      const result = await actor.addReply(
        BigInt(commentId),
        postId,
        text,
        currentUser.username,
      );
      if (result.__kind__ === "success") {
        const br = result.success;
        const reply: CommentReply = {
          id: br.id.toString(),
          userId: br.author.toText(),
          username: br.authorName,
          text: br.text,
          timestamp: Number(br.timestamp / 1_000_000n),
        };
        setCommentsState((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c,
          ),
        );
      }
    } catch {}
  };

  const handleDeleteComment = async (_postId: string, commentId: string) => {
    if (!actor) return;
    try {
      await actor.deleteComment(BigInt(commentId));
    } catch {}
    setCommentsState((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleDeleteReply = async (
    _postId: string,
    commentId: string,
    replyId: string,
  ) => {
    if (!actor) return;
    try {
      await actor.deleteReply(BigInt(replyId));
    } catch {}
    setCommentsState((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
          : c,
      ),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(idx * 0.03, 0.5), duration: 0.5 }}
      data-ocid={`feed.item.${idx + 1}`}
      style={{
        width: "100%",
        background:
          post.category === "Poet's Note"
            ? "rgba(200,169,106,0.07)"
            : "rgba(16,24,38,0.85)",
        border:
          post.category === "Poet's Note"
            ? "1px solid rgba(200,169,106,0.35)"
            : "1px solid rgba(200,169,106,0.15)",
        borderRadius: 14,
        padding: "1.4rem",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.25s, box-shadow 0.25s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(200,169,106,0.4)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 30px rgba(0,0,0,0.5), 0 0 20px rgba(200,169,106,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          post.category === "Poet's Note"
            ? "rgba(200,169,106,0.35)"
            : "rgba(200,169,106,0.15)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 20px rgba(0,0,0,0.35)";
      }}
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
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile?.(post.username);
          }}
          title={`View ${post.username}'s profile`}
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
            cursor: "pointer",
            overflow: "hidden",
            padding: 0,
            transition: "opacity 0.15s",
          }}
        >
          {(() => {
            const photo = getUserAvatar(post.username);
            return photo ? (
              <img
                src={photo}
                alt={post.username}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              post.username.charAt(0).toUpperCase()
            );
          })()}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile?.(post.username);
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
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
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLParagraphElement).style.opacity = "0.7";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLParagraphElement).style.opacity = "1";
              }}
            >
              {post.username === "CHINNUA_POET"
                ? "\u2746 CHINNUA_POET"
                : post.username}
            </p>
          </button>
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
              background:
                post.category === "Poet's Note"
                  ? "rgba(200,169,106,0.2)"
                  : "rgba(200,169,106,0.1)",
              borderRadius: 4,
              fontSize: "0.65rem",
              color: "rgba(200,169,106,0.9)",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              flexShrink: 0,
            }}
          >
            {post.category}
          </span>
        )}
      </div>

      {/* Content (clickable area) */}
      <button
        type="button"
        onClick={() => onExpand(post)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
          flex: 1,
        }}
      >
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
      </button>

      {/* Footer actions */}
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
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: "0.72rem",
            color: "rgba(200,169,106,0.7)",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            flex: 1,
            cursor: "pointer",
            padding: 0,
          }}
          onClick={() => onExpand(post)}
        >
          Click to read
        </button>
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
        {/* Comments toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowComments((v) => {
              if (!v) loadComments(post.id);
              return !v;
            });
          }}
          data-ocid="feed.toggle"
          style={{
            background: showComments ? "rgba(200,169,106,0.1)" : "none",
            border: "none",
            cursor: "pointer",
            color: showComments ? "#C8A96A" : "rgba(229,231,235,0.4)",
            fontSize: "0.75rem",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            display: "flex",
            alignItems: "center",
            gap: 3,
            borderRadius: 4,
            padding: "2px 6px",
            transition: "all 0.2s",
          }}
        >
          🗨 {comments.length}
        </button>
      </div>

      {/* Inline comment thread */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <CommentThread
              postId={post.id}
              currentUser={currentUser}
              comments={comments}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
              onDeleteComment={handleDeleteComment}
              onDeleteReply={handleDeleteReply}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FeedSlide({
  currentUser,
  onJoin,
  onLogin,
  onViewProfile,
}: FeedSlideProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);
  const [replyPost, setReplyPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState("");

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

    const notePost = getPoetsNotePost();
    const extraPosts = notePost ? [notePost] : [];

    const all = [...extraPosts, ...stored, ...poemPosts]
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
          overflow: "hidden",
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
          {currentUser && onViewProfile && (
            <button
              type="button"
              onClick={() => onViewProfile(currentUser.username)}
              data-ocid="feed.primary_button"
              style={{
                background: "rgba(200,169,106,0.08)",
                border: "1px solid rgba(200,169,106,0.22)",
                borderRadius: 20,
                padding: "0.3rem 0.8rem",
                color: "rgba(200,169,106,0.75)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.68rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(200,169,106,0.45)";
                (e.currentTarget as HTMLButtonElement).style.color = "#C8A96A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(200,169,106,0.22)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(200,169,106,0.75)";
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "rgba(200,169,106,0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                }}
              >
                {currentUser.username[0]?.toUpperCase()}
              </span>
              {currentUser.username}
            </button>
          )}
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

        {/* Vertical scroll feed */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            overflowY: "auto",
            overflowX: "hidden",
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
              currentUser={currentUser}
              onViewProfile={onViewProfile}
              idx={idx}
            />
          ))}
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
