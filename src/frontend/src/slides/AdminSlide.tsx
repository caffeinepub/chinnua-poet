import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { POEMS } from "../poems-data";

interface UserEntry {
  username: string;
  bio: string;
  createdAt: string;
}
interface Post {
  id: string;
  username: string;
  title: string;
  preview: string;
  timestamp: string;
}
interface GalleryPhoto {
  id: string;
  src: string;
  uploader: string;
  timestamp: string;
}

export default function AdminSlide() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [deletedPoems, setDeletedPoems] = useState<Set<number>>(new Set());
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [rules, setRules] = useState(
    "1. Be respectful to all community members.\n2. No hate speech or harassment.\n3. Share only original content or give proper credit.\n4. Keep discussions poetry-related.\n5. No spam or promotional content.\n6. Respect privacy of others.",
  );

  // Guardian moderation
  const { actor } = useActor();
  interface ModerationEntry {
    id: bigint;
    contentType: string;
    content: string;
    authorName: string;
    status: { __kind__: string };
    reason: string;
    riskLevel: string;
    timestamp: bigint;
  }
  interface ModerationStats {
    pendingCount: bigint;
    approvedCount: bigint;
    rejectedCount: bigint;
  }
  const [moderationQueue, setModerationQueue] = useState<ModerationEntry[]>([]);
  const [moderationStats, setModerationStats] =
    useState<ModerationStats | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<
    Record<string, boolean>
  >({});
  const [guardianLoading, setGuardianLoading] = useState(false);

  const loadGuardianData = async () => {
    if (!actor) return;
    setGuardianLoading(true);
    try {
      const [queue, stats] = await Promise.all([
        (actor as any).getModerationQueue(),
        (actor as any).getModerationStats(),
      ]);
      setModerationQueue(queue as ModerationEntry[]);
      setModerationStats(stats as ModerationStats);
    } catch {}
    setGuardianLoading(false);
  };

  const handleApprove = async (id: bigint) => {
    if (!actor) return;
    try {
      await (actor as any).approveModeratedContent(id);
      toast.success("Content approved");
      loadGuardianData();
    } catch {
      toast.error("Failed");
    }
  };

  const handleReject = async (id: bigint, idStr: string) => {
    if (!actor) return;
    try {
      await (actor as any).rejectModeratedContent(
        id,
        rejectReason[idStr] || "Violates community guidelines",
      );
      toast.success("Content rejected");
      setShowRejectInput((p) => ({ ...p, [idStr]: false }));
      loadGuardianData();
    } catch {
      toast.error("Failed");
    }
  };

  useEffect(() => {
    setDeletedPoems(
      new Set(
        JSON.parse(localStorage.getItem("chinnua_deleted_poems") || "[]"),
      ),
    );
    setFeedPosts(JSON.parse(localStorage.getItem("chinnua_posts") || "[]"));
    setUsers(JSON.parse(localStorage.getItem("chinnua_users") || "[]"));
    setGallery(JSON.parse(localStorage.getItem("chinnua_gallery") || "[]"));
    setAnnouncement(localStorage.getItem("chinnua_announcement") || "");
    const storedRules = localStorage.getItem("chinnua_rules");
    if (storedRules) setRules(storedRules);
  }, []);

  const checkPassword = async () => {
    try {
      if (actor) {
        const ok = await (actor as any).checkAdminPassword(password);
        if (ok) {
          setAuthed(true);
          localStorage.setItem("chinnua_admin_authed", "true");
        } else {
          toast.error("Incorrect password");
        }
        return;
      }
    } catch {}
    // Fallback: always use default password, never stale localStorage
    if (password === "chinnua2025") {
      setAuthed(true);
      localStorage.setItem("chinnua_admin_authed", "true");
    } else {
      toast.error("Incorrect password");
    }
  };

  const emergencyReset = () => {
    localStorage.removeItem("chinnua_admin_password");
    toast.success("Password reset to chinnua2025 — try logging in now");
  };

  const lockAdmin = () => {
    setAuthed(false);
    localStorage.removeItem("chinnua_admin_authed");
  };

  const deletePoem = (id: number) => {
    const updated = new Set(deletedPoems);
    updated.add(id);
    localStorage.setItem("chinnua_deleted_poems", JSON.stringify([...updated]));
    setDeletedPoems(updated);
    toast.success("Poem hidden");
  };

  const restorePoem = (id: number) => {
    const updated = new Set(deletedPoems);
    updated.delete(id);
    localStorage.setItem("chinnua_deleted_poems", JSON.stringify([...updated]));
    setDeletedPoems(updated);
    toast.success("Poem restored");
  };

  const deleteFeedPost = (id: string) => {
    const deletedIds: string[] = JSON.parse(
      localStorage.getItem("chinnua_deleted_posts") || "[]",
    );
    deletedIds.push(id);
    localStorage.setItem("chinnua_deleted_posts", JSON.stringify(deletedIds));
    const updated = feedPosts.filter((p) => p.id !== id);
    localStorage.setItem("chinnua_posts", JSON.stringify(updated));
    setFeedPosts(updated);
    toast.success("Post deleted");
  };

  const deleteUser = (username: string) => {
    const updated = users.filter((u) => u.username !== username);
    localStorage.setItem("chinnua_users", JSON.stringify(updated));
    setUsers(updated);
    toast.success("User removed");
  };

  const deleteGalleryPhoto = (id: string) => {
    const updated = gallery.filter((p) => p.id !== id);
    localStorage.setItem("chinnua_gallery", JSON.stringify(updated));
    setGallery(updated);
    toast.success("Photo deleted");
  };

  const savePassword = () => {
    if (!newPassword.trim()) return;
    localStorage.setItem("chinnua_admin_password", newPassword.trim());
    setNewPassword("");
    toast.success("Password updated");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(200,169,106,0.2)",
    borderRadius: 8,
    padding: "0.6rem 0.9rem",
    color: "#F5E6D3",
    fontFamily: "'Libre Baskerville', Georgia, serif",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  };
  const deleteBtn = {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "rgba(239,68,68,0.9)",
    fontFamily: "'Libre Baskerville', Georgia, serif",
    fontSize: "0.78rem",
    padding: "0.25rem 0.75rem",
    height: "auto" as const,
  };

  if (!authed) {
    return (
      <div
        className="slide-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="feed-card"
          style={{
            padding: "2.5rem",
            width: "100%",
            maxWidth: 380,
            textAlign: "center",
          }}
          data-ocid="admin.panel"
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.4rem",
              color: "#F5E6D3",
              marginBottom: "0.5rem",
            }}
          >
            Admin Panel
          </h2>
          <p
            style={{
              color: "rgba(229,231,235,0.4)",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            Enter password to continue
          </p>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              data-ocid="admin.input"
              onKeyDown={(e) => {
                if (e.key === "Enter") checkPassword();
              }}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(229,231,235,0.5)",
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button
            onClick={checkPassword}
            data-ocid="admin.submit_button"
            style={{
              width: "100%",
              background: "rgba(200,169,106,0.85)",
              border: "none",
              color: "#fff",
            }}
          >
            Enter
          </Button>
          <button
            type="button"
            onClick={emergencyReset}
            style={{
              marginTop: "0.5rem",
              background: "none",
              border: "none",
              color: "rgba(200,169,106,0.6)",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              textDecoration: "underline",
            }}
          >
            Forgot password? Reset to default
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="slide-container"
      style={{ overflowY: "auto", paddingBottom: "2rem" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.6rem",
              color: "#F5E6D3",
              fontWeight: 700,
            }}
          >
            Admin Panel
          </h2>
          <Button
            onClick={lockAdmin}
            data-ocid="admin.secondary_button"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(229,231,235,0.7)",
              fontSize: "0.82rem",
            }}
          >
            Lock
          </Button>
        </div>
        <Tabs defaultValue="poems">
          <TabsList
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(200,169,106,0.15)",
              marginBottom: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              height: "auto",
              gap: "0.25rem",
            }}
          >
            {[
              "poems",
              "feed",
              "users",
              "gallery",
              "settings",
              "rules",
              "guardian",
            ].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                data-ocid="admin.tab"
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.82rem",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="poems">
            <p
              style={{
                color: "rgba(229,231,235,0.4)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.82rem",
                marginBottom: "1rem",
              }}
            >
              {POEMS.length} poems · {deletedPoems.size} hidden
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              {POEMS.slice(0, 100).map((poem) => (
                <div
                  key={poem.id}
                  className="feed-card"
                  style={{
                    padding: "0.75rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: deletedPoems.has(poem.id) ? 0.4 : 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.88rem",
                      color: "#F5E6D3",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginRight: "0.75rem",
                    }}
                  >
                    {poem.title}
                  </span>
                  {deletedPoems.has(poem.id) ? (
                    <Button
                      onClick={() => restorePoem(poem.id)}
                      style={{
                        background: "rgba(34,197,94,0.2)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        color: "rgba(34,197,94,0.9)",
                        fontSize: "0.78rem",
                        padding: "0.25rem 0.75rem",
                        height: "auto",
                      }}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      onClick={() => deletePoem(poem.id)}
                      data-ocid="admin.delete_button"
                      style={deleteBtn}
                    >
                      Hide
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feed">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {feedPosts.length === 0 ? (
                <p
                  style={{
                    color: "rgba(229,231,235,0.4)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                  }}
                  data-ocid="admin.empty_state"
                >
                  No user posts yet
                </p>
              ) : (
                feedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="feed-card"
                    style={{
                      padding: "0.75rem 1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <span
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.82rem",
                          color: "rgba(200,169,106,0.8)",
                          marginRight: "0.5rem",
                        }}
                      >
                        @{post.username}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.85rem",
                          color: "rgba(229,231,235,0.7)",
                        }}
                      >
                        {(post.preview || "").slice(0, 60)}
                      </span>
                    </div>
                    <Button
                      onClick={() => deleteFeedPost(post.id)}
                      data-ocid="admin.delete_button"
                      style={{ ...deleteBtn, flexShrink: 0 }}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {users.length === 0 ? (
                <p
                  style={{
                    color: "rgba(229,231,235,0.4)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                  }}
                  data-ocid="admin.empty_state"
                >
                  No registered users
                </p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.username}
                    className="feed-card"
                    style={{
                      padding: "0.75rem 1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.9rem",
                          color: "#F5E6D3",
                          fontWeight: 600,
                        }}
                      >
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p
                          style={{
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: "0.78rem",
                            color: "rgba(229,231,235,0.4)",
                          }}
                        >
                          {user.bio.slice(0, 60)}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => deleteUser(user.username)}
                      data-ocid="admin.delete_button"
                      style={deleteBtn}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            {gallery.length === 0 ? (
              <p
                style={{
                  color: "rgba(229,231,235,0.4)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                }}
                data-ocid="admin.empty_state"
              >
                No gallery photos
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="feed-card"
                    style={{ padding: 0, overflow: "hidden" }}
                  >
                    <img
                      src={photo.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div style={{ padding: "0.5rem" }}>
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.75rem",
                          color: "rgba(229,231,235,0.5)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {photo.uploader}
                      </p>
                      <Button
                        onClick={() => deleteGalleryPhoto(photo.id)}
                        data-ocid="admin.delete_button"
                        style={{
                          ...deleteBtn,
                          width: "100%",
                          padding: "0.2rem",
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                maxWidth: 480,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#F5E6D3",
                    marginBottom: "0.75rem",
                  }}
                >
                  Change Password
                </h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    data-ocid="admin.input"
                    style={{ ...inputStyle, flex: 1, width: "auto" }}
                  />
                  <Button
                    onClick={savePassword}
                    data-ocid="admin.save_button"
                    style={{
                      background: "rgba(200,169,106,0.85)",
                      border: "none",
                      color: "#fff",
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#F5E6D3",
                    marginBottom: "0.75rem",
                  }}
                >
                  Site Announcement
                </h3>
                <Textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Announcement visible to all users..."
                  data-ocid="admin.textarea"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(200,169,106,0.2)",
                    color: "#F5E6D3",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    minHeight: 80,
                  }}
                />
                <Button
                  onClick={() => {
                    localStorage.setItem("chinnua_announcement", announcement);
                    toast.success("Saved");
                  }}
                  data-ocid="admin.save_button"
                  style={{
                    marginTop: "0.5rem",
                    background: "rgba(200,169,106,0.85)",
                    border: "none",
                    color: "#fff",
                  }}
                >
                  Save Announcement
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules">
            <div style={{ maxWidth: 600 }}>
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#F5E6D3",
                  marginBottom: "0.75rem",
                }}
              >
                Community Rules
              </h3>
              <Textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                data-ocid="admin.textarea"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(200,169,106,0.2)",
                  color: "#F5E6D3",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  minHeight: 200,
                }}
              />
              <Button
                onClick={() => {
                  localStorage.setItem("chinnua_rules", rules);
                  toast.success("Rules saved");
                }}
                data-ocid="admin.save_button"
                style={{
                  marginTop: "0.75rem",
                  background: "rgba(200,169,106,0.85)",
                  border: "none",
                  color: "#fff",
                }}
              >
                Save Rules
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="guardian">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>🛡️</span>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#C8A96A",
                      margin: 0,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    The Silent Guardian
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      color: "rgba(229,231,235,0.45)",
                      fontSize: "0.78rem",
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    Watching quietly. Protecting the space.
                  </p>
                </div>
                <Button
                  onClick={loadGuardianData}
                  data-ocid="admin.secondary_button"
                  style={{
                    marginLeft: "auto",
                    background: "rgba(200,169,106,0.12)",
                    border: "1px solid rgba(200,169,106,0.25)",
                    color: "#C8A96A",
                    fontSize: "0.78rem",
                  }}
                >
                  {guardianLoading ? "Loading…" : "Refresh"}
                </Button>
              </div>

              {/* Stats */}
              {moderationStats && (
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    {
                      label: "Pending",
                      count: moderationStats.pendingCount,
                      color: "rgba(200,169,106,0.8)",
                    },
                    {
                      label: "Approved",
                      count: moderationStats.approvedCount,
                      color: "rgba(74,222,128,0.8)",
                    },
                    {
                      label: "Rejected",
                      count: moderationStats.rejectedCount,
                      color: "rgba(248,113,113,0.8)",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(200,169,106,0.1)",
                        borderRadius: 10,
                        padding: "0.75rem 1.25rem",
                        minWidth: 90,
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.5rem",
                          color: s.color,
                          margin: 0,
                          fontWeight: 700,
                        }}
                      >
                        {s.count.toString()}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.72rem",
                          color: "rgba(229,231,235,0.4)",
                          margin: 0,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Queue */}
              {moderationQueue.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                    🛡️
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: "italic",
                      color: "rgba(200,169,106,0.6)",
                      fontSize: "0.95rem",
                    }}
                  >
                    The Guardian is watching silently.
                    <br />
                    No content needs review.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {moderationQueue.map((entry) => {
                    const idStr = entry.id.toString();
                    const riskColor =
                      entry.riskLevel === "high"
                        ? "rgba(248,113,113,0.85)"
                        : entry.riskLevel === "medium"
                          ? "rgba(251,191,36,0.85)"
                          : "rgba(74,222,128,0.85)";
                    return (
                      <div
                        key={idStr}
                        style={{
                          background: "rgba(26,20,16,0.7)",
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
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.78rem",
                              color: "rgba(200,169,106,0.7)",
                              textTransform: "capitalize",
                            }}
                          >
                            {entry.contentType}
                          </span>
                          <span style={{ color: "rgba(245,230,211,0.3)" }}>
                            ·
                          </span>
                          <span
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.78rem",
                              color: "rgba(245,230,211,0.5)",
                            }}
                          >
                            by {entry.authorName}
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              background: `${riskColor.replace("0.85", "0.12")}`,
                              border: `1px solid ${riskColor.replace("0.85", "0.3")}`,
                              borderRadius: 6,
                              padding: "0.1rem 0.5rem",
                              color: riskColor,
                              fontSize: "0.72rem",
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              textTransform: "capitalize",
                            }}
                          >
                            {entry.riskLevel} risk
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontStyle: "italic",
                            color: "rgba(229,231,235,0.7)",
                            fontSize: "0.88rem",
                            lineHeight: 1.6,
                            margin: "0 0 0.5rem",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          "{entry.content.slice(0, 200)}
                          {entry.content.length > 200 ? "…" : ""}"
                        </p>
                        {entry.reason && (
                          <p
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.75rem",
                              color: "rgba(200,169,106,0.5)",
                              margin: "0 0 0.75rem",
                              fontStyle: "italic",
                            }}
                          >
                            Flagged: {entry.reason}
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleApprove(entry.id)}
                            data-ocid="admin.confirm_button"
                            style={{
                              background: "rgba(74,222,128,0.1)",
                              border: "1px solid rgba(74,222,128,0.3)",
                              borderRadius: 6,
                              padding: "0.3rem 0.8rem",
                              color: "rgba(74,222,128,0.9)",
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.78rem",
                              cursor: "pointer",
                            }}
                          >
                            ✅ Approve
                          </button>
                          {showRejectInput[idStr] ? (
                            <>
                              <input
                                value={rejectReason[idStr] || ""}
                                onChange={(e) =>
                                  setRejectReason((p) => ({
                                    ...p,
                                    [idStr]: e.target.value,
                                  }))
                                }
                                placeholder="Reason for rejection…"
                                data-ocid="admin.input"
                                style={{
                                  flex: 1,
                                  minWidth: 140,
                                  background: "rgba(255,255,255,0.05)",
                                  border: "1px solid rgba(200,169,106,0.2)",
                                  borderRadius: 6,
                                  padding: "0.3rem 0.6rem",
                                  color: "#F5E6D3",
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.78rem",
                                  outline: "none",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleReject(entry.id, idStr)}
                                data-ocid="admin.delete_button"
                                style={{
                                  background: "rgba(248,113,113,0.1)",
                                  border: "1px solid rgba(248,113,113,0.3)",
                                  borderRadius: 6,
                                  padding: "0.3rem 0.8rem",
                                  color: "rgba(248,113,113,0.9)",
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                }}
                              >
                                Confirm Reject
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowRejectInput((p) => ({
                                    ...p,
                                    [idStr]: false,
                                  }))
                                }
                                data-ocid="admin.cancel_button"
                                style={{
                                  background: "transparent",
                                  border: "1px solid rgba(245,230,211,0.1)",
                                  borderRadius: 6,
                                  padding: "0.3rem 0.7rem",
                                  color: "rgba(245,230,211,0.4)",
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setShowRejectInput((p) => ({
                                  ...p,
                                  [idStr]: true,
                                }))
                              }
                              data-ocid="admin.delete_button"
                              style={{
                                background: "rgba(248,113,113,0.08)",
                                border: "1px solid rgba(248,113,113,0.2)",
                                borderRadius: 6,
                                padding: "0.3rem 0.8rem",
                                color: "rgba(248,113,113,0.7)",
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                                fontSize: "0.78rem",
                                cursor: "pointer",
                              }}
                            >
                              ❌ Reject
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
