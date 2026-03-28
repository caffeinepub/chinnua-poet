import { useState } from "react";

export interface CommentReply {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  replies: CommentReply[];
}

interface CommentThreadProps {
  postId: string;
  currentUser: { username: string } | null;
  comments: Comment[];
  onAddComment: (postId: string, text: string) => void;
  onAddReply: (postId: string, commentId: string, text: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onDeleteReply: (postId: string, commentId: string, replyId: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const inputSx: React.CSSProperties = {
  background: "#1A1410",
  border: "1px solid rgba(200,169,106,0.2)",
  borderRadius: 6,
  padding: "0.38rem 0.65rem",
  color: "#F5E6D3",
  fontFamily: "'Libre Baskerville', Georgia, serif",
  fontSize: "0.8rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  flex: 1,
};

const avatarSx = (size: number, gold = 0.15): React.CSSProperties => ({
  width: size,
  height: size,
  borderRadius: "50%",
  background: `rgba(200,169,106,${gold})`,
  border: "1px solid rgba(200,169,106,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: size * 0.35,
  color: "#C8A96A",
  flexShrink: 0,
  fontFamily: "'Playfair Display', Georgia, serif",
  fontWeight: 700,
});

export default function CommentThread({
  postId,
  currentUser,
  comments,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onDeleteReply,
}: CommentThreadProps) {
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const submitComment = () => {
    if (!text.trim() || !currentUser) return;
    onAddComment(postId, text.trim());
    setText("");
  };

  const submitReply = (commentId: string) => {
    if (!replyText.trim() || !currentUser) return;
    onAddReply(postId, commentId, replyText.trim());
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div
      style={{
        borderTop: "1px solid rgba(200,169,106,0.13)",
        paddingTop: "0.85rem",
        marginTop: "0.5rem",
      }}
      data-ocid="comment.panel"
    >
      <p
        style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: "0.66rem",
          color: "rgba(200,169,106,0.5)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "0.7rem",
        }}
      >
        {comments.length > 0
          ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`
          : "Comments"}
      </p>

      {/* Input */}
      {currentUser ? (
        <div
          style={{
            display: "flex",
            gap: "0.45rem",
            marginBottom: "0.9rem",
            alignItems: "center",
          }}
        >
          <div style={avatarSx(26)}>
            {currentUser.username[0]?.toUpperCase()}
          </div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Leave a comment…"
            data-ocid="comment.input"
            onKeyDown={(e) => {
              if (e.key === "Enter") submitComment();
            }}
            style={inputSx}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(200,169,106,0.45)";
              e.target.style.boxShadow = "0 0 8px rgba(200,169,106,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(200,169,106,0.2)";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            type="button"
            onClick={submitComment}
            disabled={!text.trim()}
            data-ocid="comment.submit_button"
            style={{
              background: "rgba(200,169,106,0.12)",
              border: "1px solid rgba(200,169,106,0.28)",
              borderRadius: 6,
              padding: "0.38rem 0.7rem",
              color: "#C8A96A",
              cursor: text.trim() ? "pointer" : "default",
              opacity: text.trim() ? 1 : 0.4,
              fontSize: "0.72rem",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            Post
          </button>
        </div>
      ) : (
        <p
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.76rem",
            color: "rgba(245,230,211,0.35)",
            fontStyle: "italic",
            marginBottom: "0.7rem",
          }}
        >
          Sign in to leave a comment.
        </p>
      )}

      {/* Comments list */}
      {comments.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
          }}
        >
          {comments.map((c, idx) => (
            <div key={c.id} data-ocid={`comment.item.${idx + 1}`}>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                <div style={avatarSx(26)}>{c.username[0]?.toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.4rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        color:
                          c.username === "CHINNUA_POET" ? "#C8A96A" : "#F5E6D3",
                      }}
                    >
                      {c.username}
                    </span>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        color: "rgba(245,230,211,0.3)",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                      }}
                    >
                      {timeAgo(c.timestamp)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.8rem",
                      color: "rgba(245,230,211,0.72)",
                      lineHeight: 1.55,
                      margin: "0.18rem 0 0.3rem",
                    }}
                  >
                    {c.text}
                  </p>
                  <div style={{ display: "flex", gap: "0.7rem" }}>
                    {currentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          if (replyingTo === c.id) {
                            setReplyingTo(null);
                          } else {
                            setReplyingTo(c.id);
                            setReplyText("");
                          }
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "rgba(200,169,106,0.45)",
                          fontSize: "0.68rem",
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          padding: 0,
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#C8A96A";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(200,169,106,0.45)";
                        }}
                      >
                        Reply
                      </button>
                    )}
                    {currentUser && c.username === currentUser.username && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(postId, c.id)}
                        data-ocid="comment.delete_button"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "rgba(239,68,68,0.35)",
                          fontSize: "0.65rem",
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          padding: 0,
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(239,68,68,0.7)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "rgba(239,68,68,0.35)";
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Reply input */}
                  {replyingTo === c.id && currentUser && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.35rem",
                        marginTop: "0.45rem",
                        alignItems: "center",
                      }}
                    >
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${c.username}…`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitReply(c.id);
                        }}
                        style={{ ...inputSx, fontSize: "0.75rem" }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(200,169,106,0.45)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(200,169,106,0.2)";
                        }}
                        // biome-ignore lint: auto focus reply input
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => submitReply(c.id)}
                        style={{
                          background: "rgba(200,169,106,0.1)",
                          border: "1px solid rgba(200,169,106,0.22)",
                          borderRadius: 5,
                          padding: "0.35rem 0.55rem",
                          color: "#C8A96A",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                        }}
                      >
                        ↵
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "rgba(245,230,211,0.3)",
                          fontSize: "0.8rem",
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* Nested replies */}
                  {c.replies.length > 0 && (
                    <div
                      style={{
                        paddingLeft: "0.7rem",
                        borderLeft: "1px solid rgba(200,169,106,0.13)",
                        marginTop: "0.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.4rem",
                      }}
                    >
                      {c.replies.map((r, ri) => (
                        <div
                          key={r.id}
                          data-ocid={`comment.reply.${ri + 1}`}
                          style={{
                            display: "flex",
                            gap: "0.4rem",
                            alignItems: "flex-start",
                          }}
                        >
                          <div style={avatarSx(20, 0.08)}>
                            {r.username[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: "flex",
                                gap: "0.35rem",
                                alignItems: "baseline",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  color:
                                    r.username === "CHINNUA_POET"
                                      ? "#C8A96A"
                                      : "#F5E6D3",
                                }}
                              >
                                {r.username}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.58rem",
                                  color: "rgba(245,230,211,0.28)",
                                }}
                              >
                                {timeAgo(r.timestamp)}
                              </span>
                            </div>
                            <p
                              style={{
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                                fontSize: "0.76rem",
                                color: "rgba(245,230,211,0.6)",
                                lineHeight: 1.45,
                                marginTop: "0.12rem",
                              }}
                            >
                              {r.text}
                            </p>
                          </div>
                          {currentUser &&
                            r.username === currentUser.username && (
                              <button
                                type="button"
                                onClick={() =>
                                  onDeleteReply(postId, c.id, r.id)
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "rgba(239,68,68,0.3)",
                                  fontSize: "0.75rem",
                                  padding: 0,
                                  flexShrink: 0,
                                  lineHeight: 1,
                                }}
                              >
                                ×
                              </button>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
