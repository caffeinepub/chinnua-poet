import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { POEMS } from "../poems-data";

const FEED_KEY = "chinnua_feed_v2";
const LIKES_KEY = "chinnua_likes_v2";
const REPLIES_KEY = "chinnua_replies_v2";
const SEEDED_KEY = "chinnua_seeded_v2";

export interface FeedPost {
  id: string;
  author: string;
  authorPrincipal: string;
  content: string;
  timestamp: number;
}

export interface FeedReply {
  id: string;
  postId: string;
  author: string;
  authorPrincipal: string;
  content: string;
  timestamp: number;
}

function loadPosts(): FeedPost[] {
  try {
    return JSON.parse(localStorage.getItem(FEED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function savePosts(posts: FeedPost[]) {
  localStorage.setItem(FEED_KEY, JSON.stringify(posts));
}

function loadLikes(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveLikes(likes: Record<string, string[]>) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
}

function loadReplies(): FeedReply[] {
  try {
    return JSON.parse(localStorage.getItem(REPLIES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveReplies(replies: FeedReply[]) {
  localStorage.setItem(REPLIES_KEY, JSON.stringify(replies));
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function seedIfNeeded() {
  if (localStorage.getItem(SEEDED_KEY) === "1") return;
  const existing = loadPosts();
  if (existing.length > 0) {
    localStorage.setItem(SEEDED_KEY, "1");
    return;
  }
  const now = Date.now();
  const seeded: FeedPost[] = POEMS.slice(0, 50).map((poem, i) => ({
    id: `seed_${i}`,
    author: "CHINNUA_POET",
    authorPrincipal: "owner",
    content: poem.full,
    timestamp: now - (50 - i) * 60 * 60 * 1000,
  }));
  savePosts(seeded);
  localStorage.setItem(SEEDED_KEY, "1");
}

function TrashIcon({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function PostReply({
  reply,
  onDelete,
}: {
  reply: FeedReply;
  onDelete: (id: string) => void;
}) {
  const { identity } = useInternetIdentity();
  const [isAdmin, setIsAdmin] = useState(false);
  const { actor } = useActor();

  useEffect(() => {
    if (actor && identity) {
      actor
        .isCallerAdmin()
        .then(setIsAdmin)
        .catch(() => {});
    }
  }, [actor, identity]);

  return (
    <div className="flex gap-3 pl-4 border-l border-[oklch(0.22_0.02_60/0.4)]">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-cinzel text-xs text-gold tracking-wider">
            {reply.author}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-lora text-[10px] text-muted-foreground">
              {timeAgo(reply.timestamp)}
            </span>
            {(isAdmin ||
              (identity &&
                identity.getPrincipal().toString() ===
                  reply.authorPrincipal)) && (
              <button
                type="button"
                onClick={() => onDelete(reply.id)}
                className="text-muted-foreground hover:text-red-400 transition-colors"
                data-ocid="feed.delete_button"
                aria-label="Delete reply"
              >
                <TrashIcon size={12} />
              </button>
            )}
          </div>
        </div>
        <p className="font-lora text-sm text-foreground/80 leading-relaxed mt-1 whitespace-pre-wrap">
          {reply.content}
        </p>
      </div>
    </div>
  );
}

function PostCard({
  post,
  onDelete,
  onViewProfile,
}: {
  post: FeedPost;
  onDelete: (id: string) => void;
  onViewProfile: (author: string, principal: string) => void;
}) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const isLoggedIn = !!identity;
  const principalStr = identity?.getPrincipal().toString() ?? "";

  const [likes, setLikes] = useState<Record<string, string[]>>(loadLikes);
  const [replies, setReplies] = useState<FeedReply[]>(loadReplies);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (actor && identity) {
      actor
        .isCallerAdmin()
        .then(setIsAdmin)
        .catch(() => {});
    }
  }, [actor, identity]);

  const postLikes = likes[post.id] ?? [];
  const liked = principalStr ? postLikes.includes(principalStr) : false;
  const postReplies = replies.filter((r) => r.postId === post.id);

  const handleLike = () => {
    if (!isLoggedIn || !principalStr) return;
    const current = loadLikes();
    const arr = current[post.id] ?? [];
    const updated = arr.includes(principalStr)
      ? arr.filter((p) => p !== principalStr)
      : [...arr, principalStr];
    current[post.id] = updated;
    saveLikes(current);
    setLikes({ ...current });
  };

  const handleReply = () => {
    if (!replyText.trim() || !isLoggedIn || !principalStr) return;
    const displayName =
      localStorage.getItem(`chinnua_displayname_${principalStr}`) ??
      principalStr.slice(0, 8);
    const newReply: FeedReply = {
      id: `reply_${Date.now()}_${Math.random()}`,
      postId: post.id,
      author: displayName,
      authorPrincipal: principalStr,
      content: replyText.trim(),
      timestamp: Date.now(),
    };
    const current = loadReplies();
    const updated = [newReply, ...current];
    saveReplies(updated);
    setReplies(updated);
    setReplyText("");
  };

  const handleDeleteReply = (replyId: string) => {
    const current = loadReplies();
    const updated = current.filter((r) => r.id !== replyId);
    saveReplies(updated);
    setReplies(updated);
  };

  const canDelete =
    isAdmin || (principalStr && principalStr === post.authorPrincipal);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="border-b border-[oklch(0.22_0.02_60/0.35)] py-6 px-0"
      data-ocid="feed.item.1"
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-none bg-[oklch(0.13_0.008_55)] border border-[oklch(0.22_0.02_60/0.6)] flex items-center justify-center flex-shrink-0">
            <span className="font-cinzel text-xs text-gold">
              {post.author[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          {showReplies && postReplies.length > 0 && (
            <div className="w-px flex-1 bg-[oklch(0.22_0.02_60/0.4)] mt-2" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              onClick={() => onViewProfile(post.author, post.authorPrincipal)}
              className="font-cinzel text-sm text-gold hover:opacity-80 transition-opacity tracking-wide"
              data-ocid="feed.link"
            >
              {post.author}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-lora text-[11px] text-muted-foreground">
                {timeAgo(post.timestamp)}
              </span>
              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(post.id)}
                  className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                  data-ocid="feed.delete_button"
                  aria-label="Delete post"
                >
                  <TrashIcon size={14} />
                </button>
              )}
            </div>
          </div>
          <p className="font-lora text-[15px] leading-[1.85] text-foreground/90 whitespace-pre-wrap tracking-wide">
            {post.content}
          </p>
          <div className="flex items-center gap-6 mt-4">
            <button
              type="button"
              onClick={handleLike}
              disabled={!isLoggedIn}
              className={`flex items-center gap-1.5 transition-all ${
                liked
                  ? "text-[oklch(0.72_0.09_75)] drop-shadow-[0_0_8px_oklch(0.72_0.09_75/0.8)]"
                  : "text-muted-foreground hover:text-[oklch(0.72_0.09_75/0.7)]"
              } disabled:cursor-default`}
              data-ocid="feed.toggle"
            >
              <span className="text-base">{liked ? "❤️" : "🤍"}</span>
              <span className="font-cinzel text-[11px] tracking-widest">
                {postLikes.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowReplies((s) => !s)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="feed.toggle"
            >
              <span className="text-base">💬</span>
              <span className="font-cinzel text-[11px] tracking-widest">
                {postReplies.length}
              </span>
            </button>
          </div>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4"
              >
                {isLoggedIn && (
                  <div className="flex gap-2 mb-4">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply…"
                      rows={2}
                      className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.09_0.008_55)] font-lora text-sm resize-none focus-visible:ring-[oklch(0.72_0.09_75/0.4)] text-foreground placeholder:text-muted-foreground"
                      data-ocid="feed.textarea"
                    />
                    <button
                      type="button"
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="px-4 bg-[oklch(0.72_0.09_75/0.15)] border border-[oklch(0.72_0.09_75/0.4)] text-gold hover:bg-[oklch(0.72_0.09_75/0.25)] transition-all font-cinzel text-xs tracking-widest uppercase disabled:opacity-40 self-end py-2"
                      data-ocid="feed.submit_button"
                    >
                      Reply
                    </button>
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  {postReplies.length === 0 ? (
                    <p
                      className="font-lora text-xs text-muted-foreground italic"
                      data-ocid="feed.empty_state"
                    >
                      No replies yet.
                    </p>
                  ) : (
                    postReplies.map((reply) => (
                      <PostReply
                        key={reply.id}
                        reply={reply}
                        onDelete={handleDeleteReply}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}

export function FeedSection({
  onViewProfile,
}: {
  onViewProfile: (author: string, principal: string) => void;
}) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const isLoggedIn = !!identity;
  const principalStr = identity?.getPrincipal().toString() ?? "";

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    seedIfNeeded();
    setPosts(loadPosts());
  }, []);

  const handlePost = async () => {
    if (!postText.trim() || !isLoggedIn || !principalStr) return;
    setPosting(true);
    const displayName =
      localStorage.getItem(`chinnua_displayname_${principalStr}`) ??
      principalStr.slice(0, 8);
    const newPost: FeedPost = {
      id: `post_${Date.now()}_${Math.random()}`,
      author: displayName,
      authorPrincipal: principalStr,
      content: postText.trim(),
      timestamp: Date.now(),
    };
    const current = loadPosts();
    const updated = [newPost, ...current];
    savePosts(updated);
    setPosts(updated);
    setPostText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (actor) {
      try {
        await actor.setDisplayName(displayName);
      } catch {
        // ignore
      }
    }
    setPosting(false);
  };

  const handleDelete = (postId: string) => {
    const current = loadPosts();
    const updated = current.filter((p) => p.id !== postId);
    savePosts(updated);
    setPosts(updated);
  };

  return (
    <section
      id="feed"
      className="py-20 px-4 sm:px-8"
      style={{
        background: "linear-gradient(180deg, #0D0D0D 0%, #0f0b08 100%)",
        borderTop: "1px solid rgba(200,169,106,0.15)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-gold uppercase">
            Community
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-semibold text-foreground mt-3 tracking-wide uppercase">
            The Feed
          </h2>
          <div className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)] mx-auto mt-5" />
          <p className="font-lora text-sm text-muted-foreground italic mt-4">
            Where poetry breathes between souls.
          </p>
        </motion.div>

        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 border border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.095_0.008_55)] hover:border-[oklch(0.72_0.09_75/0.3)] transition-all"
            data-ocid="feed.panel"
          >
            <Textarea
              ref={textareaRef}
              value={postText}
              onChange={(e) => {
                setPostText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handlePost();
                }
              }}
              placeholder="Write your thoughts…"
              rows={3}
              className="rounded-none border-0 bg-transparent font-lora text-base resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/60 p-0 leading-relaxed"
              data-ocid="feed.textarea"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[oklch(0.22_0.02_60/0.4)]">
              <span className="font-lora text-xs text-muted-foreground italic">
                Ctrl+Enter to post
              </span>
              <button
                type="button"
                onClick={handlePost}
                disabled={!postText.trim() || posting}
                className="px-6 py-2 bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] transition-all font-cinzel text-xs tracking-[0.15em] uppercase disabled:opacity-40"
                data-ocid="feed.submit_button"
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </motion.div>
        )}

        {!isLoggedIn && (
          <div className="mb-8 p-5 border border-dashed border-[oklch(0.22_0.02_60/0.4)] text-center">
            <p className="font-lora text-sm text-muted-foreground italic">
              Login to share your poetry with the world.
            </p>
          </div>
        )}

        <div data-ocid="feed.list">
          {posts.length === 0 ? (
            <div className="py-16 text-center" data-ocid="feed.empty_state">
              <p className="font-lora text-muted-foreground italic">
                The feed is empty. Be the first to share.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                onViewProfile={onViewProfile}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
