import {
  Bell,
  Check,
  Eye,
  Heart,
  Mail,
  MessageSquare,
  Send,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface IUser {
  username: string;
  bio: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "message";
  fromUser: string;
  targetContent?: string;
  message?: string;
  timestamp: string;
  read: boolean;
}

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_BROWN = "#8B6F47";
const WARM_MOCHA = "#5C3D2E";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";

function TypeIcon({ type }: { type: Notification["type"] }) {
  const style = { width: 18, height: 18, flexShrink: 0 as const };
  switch (type) {
    case "like":
      return <Heart style={{ ...style, color: "#c04060" }} />;
    case "comment":
      return <MessageSquare style={{ ...style, color: WARM_BROWN }} />;
    case "follow":
      return <User style={{ ...style, color: WARM_BROWN }} />;
    case "message":
      return <Mail style={{ ...style, color: WARM_BROWN }} />;
  }
}

function typeLabel(n: Notification) {
  switch (n.type) {
    case "like":
      return `${n.fromUser} liked your poem`;
    case "comment":
      return `${n.fromUser} commented on your post`;
    case "follow":
      return `${n.fromUser} started following you`;
    case "message":
      return `${n.fromUser} sent you a message`;
  }
}

function typeFullMessage(n: Notification): string {
  switch (n.type) {
    case "like":
      return `${n.fromUser} loved your poem${n.targetContent ? ` "${n.targetContent}"` : ""}. Their reaction shows your words resonated deeply.`;
    case "comment":
      return (
        n.message ||
        `${n.fromUser} left a comment on your post${n.targetContent ? ` "${n.targetContent}"` : ""}. Tap to read their words.`
      );
    case "follow":
      return `${n.fromUser} is now following you. They will see your poems and posts in their feed.`;
    case "message":
      return (
        n.message ||
        `${n.fromUser} sent you a private message. Visit Messages to reply.`
      );
  }
}

function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function groupByDate(
  notifications: Notification[],
): { label: string; items: Notification[] }[] {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterday = today - 86400000;
  const groups: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    Older: [],
  };
  for (const n of notifications) {
    const t = new Date(n.timestamp).getTime();
    if (t >= today) groups.Today.push(n);
    else if (t >= yesterday) groups.Yesterday.push(n);
    else groups.Older.push(n);
  }
  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

function seedNotifications(): Notification[] {
  const samples: Notification[] = [
    {
      id: "n1",
      type: "like",
      fromUser: "Luna_Verse",
      targetContent: "Echoes of My Heart",
      message:
        'Luna_Verse liked your poem "Echoes of My Heart". Your words touched their soul.',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      read: false,
    },
    {
      id: "n2",
      type: "comment",
      fromUser: "SilentInk",
      targetContent: "Fading Light",
      message:
        'SilentInk wrote: "This poem made me feel seen. The way you write about silence is extraordinary."',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: "n3",
      type: "follow",
      fromUser: "VelvetWords",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: "n4",
      type: "message",
      fromUser: "PoetryMuse",
      message:
        'PoetryMuse wrote: "I\'ve been reading your poems for weeks. The one about unread chapters gave me chills."',
      timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      read: true,
    },
  ];
  localStorage.setItem("chinnua_notifications", JSON.stringify(samples));
  return samples;
}

function getUserAvatar(username: string): string | null {
  try {
    const p = localStorage.getItem(`chinnua_profile_${username}`);
    if (p) return JSON.parse(p)?.photo ?? null;
  } catch {}
  return null;
}

function AvatarBubble({ username }: { username: string }) {
  const photo = getUserAvatar(username);
  const initials = username.charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(212,168,83,0.15)",
        border: `1px solid ${WARM_BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
        fontSize: "0.9rem",
        color: WARM_MOCHA,
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
        initials
      )}
    </div>
  );
}

// Detail Modal
function NotificationDetail({
  notification,
  onClose,
  onMarkRead,
  onNavigate,
}: {
  notification: Notification;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onNavigate: (slide: string, extra?: Record<string, string>) => void;
}) {
  useEffect(() => {
    if (!notification.read) onMarkRead(notification.id);
  }, [notification.id, notification.read, onMarkRead]);

  const goToMessages = () => {
    onNavigate("messages", { openUser: notification.fromUser });
    onClose();
  };

  const goToProfile = () => {
    onNavigate("profile", { username: notification.fromUser });
    onClose();
  };

  const goToPost = () => {
    const dest =
      notification.type === "like" && notification.targetContent
        ? "poems"
        : "feed";
    onNavigate(dest);
    onClose();
  };

  const actionBtn = (label: string, handler: () => void, primary = true) => (
    <button
      type="button"
      onClick={handler}
      style={{
        flex: 1,
        padding: "0.55rem",
        background: primary ? "rgba(212,168,83,0.85)" : "rgba(139,111,71,0.1)",
        border: primary ? "none" : `1px solid ${WARM_BORDER}`,
        borderRadius: 8,
        cursor: "pointer",
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontSize: "0.82rem",
        color: "#3D2B1F",
        fontWeight: primary ? 600 : 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.3rem",
      }}
    >
      {label}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(61,43,31,0.4)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        data-ocid="notifications.dialog"
        style={{
          background: WARM_BG,
          border: `1px solid ${WARM_BORDER}`,
          borderRadius: 18,
          padding: "1.75rem",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 20px 60px rgba(92,61,46,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <AvatarBubble username={notification.fromUser} />
            <div>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  color: WARM_MOCHA,
                  margin: 0,
                  fontSize: "0.95rem",
                }}
              >
                {notification.fromUser}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  marginTop: "0.15rem",
                }}
              >
                <TypeIcon type={notification.type} />
                <span
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.72rem",
                    color: WARM_BROWN,
                    textTransform: "capitalize",
                  }}
                >
                  {notification.type}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="notifications.close_button"
            style={{
              background: "rgba(139,111,71,0.1)",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: WARM_BROWN,
            }}
          >
            <X width={14} height={14} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            background: WARM_PAPER,
            borderRadius: 12,
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.9rem",
              color: WARM_TEXT,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {typeFullMessage(notification)}
          </p>
        </div>

        {/* Timestamp */}
        <p
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.72rem",
            color: "rgba(61,43,31,0.45)",
            margin: "0 0 1.25rem",
          }}
        >
          {new Date(notification.timestamp).toLocaleString()}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {notification.type === "message" &&
            actionBtn("Go to Messages", goToMessages)}
          {notification.type === "follow" &&
            actionBtn("View Profile", goToProfile)}
          {(notification.type === "like" || notification.type === "comment") &&
            actionBtn("View Post", goToPost)}

          {/* Message user button always present */}
          <button
            type="button"
            onClick={goToMessages}
            data-ocid="notifications.confirm_button"
            style={{
              flex: 1,
              padding: "0.55rem",
              background: "rgba(212,168,83,0.15)",
              border: "1px solid rgba(212,168,83,0.45)",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.82rem",
              color: WARM_MOCHA,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem",
            }}
          >
            <Send width={12} height={12} />
            Message {notification.fromUser}
          </button>

          <button
            type="button"
            data-ocid="notifications.cancel_button"
            onClick={onClose}
            style={{
              padding: "0.55rem 1rem",
              background: "transparent",
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.82rem",
              color: WARM_BROWN,
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NotificationsSlide({
  currentUser,
  onLogin,
  onNavigate,
}: {
  currentUser: IUser | null;
  onLogin: () => void;
  onNavigate?: (slide: string, extra?: Record<string, string>) => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<Notification | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("chinnua_notifications");
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications(seedNotifications());
      }
    } catch {
      setNotifications(seedNotifications());
    }
  }, []);

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("chinnua_notifications", JSON.stringify(updated));
  };

  const markRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    setNotifications(updated);
    localStorage.setItem("chinnua_notifications", JSON.stringify(updated));
  };

  const handleClick = (n: Notification) => {
    setSelected(n);
  };

  const handleNavigate = (slide: string, extra?: Record<string, string>) => {
    if (onNavigate) {
      onNavigate(slide, extra);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const grouped = groupByDate(notifications);

  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: WARM_BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: WARM_PAPER,
            borderRadius: 16,
            border: `1px solid ${WARM_BORDER}`,
            maxWidth: 360,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <Bell style={{ width: 36, height: 36, color: WARM_GOLD }} />
          </div>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.1rem",
              color: WARM_MOCHA,
              marginBottom: "0.5rem",
            }}
          >
            Notifications
          </p>
          <p
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(61,43,31,0.65)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            Sign in to see your notifications
          </p>
          <button
            type="button"
            onClick={onLogin}
            data-ocid="notifications.primary_button"
            style={{
              background: "rgba(212,168,83,0.85)",
              border: "none",
              borderRadius: 8,
              padding: "0.5rem 1.25rem",
              color: "#3D2B1F",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: WARM_BG,
        padding: "2rem 1.5rem",
      }}
    >
      <AnimatePresence>
        {selected && (
          <NotificationDetail
            notification={selected}
            onClose={() => setSelected(null)}
            onMarkRead={markRead}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Bell style={{ width: 24, height: 24, color: WARM_GOLD }} />
            <div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.9rem",
                  color: WARM_MOCHA,
                  fontWeight: 700,
                  marginBottom: "0.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Notifications
                {unreadCount > 0 && (
                  <span
                    style={{
                      display: "inline-block",
                      background: WARM_GOLD,
                      color: "#3D2B1F",
                      borderRadius: "100px",
                      padding: "0.1rem 0.55rem",
                      fontSize: "0.7rem",
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      verticalAlign: "middle",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontStyle: "italic",
                  color: "rgba(92,61,46,0.65)",
                  fontSize: "0.82rem",
                  margin: 0,
                }}
              >
                Your activity, letters, and interactions
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              data-ocid="notifications.secondary_button"
              style={{
                background: "rgba(212,168,83,0.12)",
                border: "1px solid rgba(212,168,83,0.3)",
                borderRadius: 8,
                padding: "0.4rem 0.8rem",
                color: WARM_BROWN,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.72rem",
                cursor: "pointer",
                letterSpacing: "0.04em",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Check width={12} height={12} />
              Mark all read
            </button>
          )}
        </motion.div>

        {/* Empty state */}
        {notifications.length === 0 ? (
          <motion.div
            data-ocid="notifications.empty_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ textAlign: "center", padding: "4rem 1rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
                opacity: 0.4,
              }}
            >
              <Bell style={{ width: 48, height: 48, color: WARM_GOLD }} />
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "rgba(61,43,31,0.55)",
                fontSize: "1rem",
              }}
            >
              No notifications yet
            </p>
            <p
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                color: "rgba(61,43,31,0.45)",
                fontSize: "0.78rem",
                marginTop: "0.5rem",
              }}
            >
              When someone likes, comments, or follows you \u2014 it appears
              here
            </p>
          </motion.div>
        ) : (
          <div>
            {grouped.map(({ label, items }) => (
              <section key={label} style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: WARM_GOLD,
                    marginBottom: "0.75rem",
                  }}
                >
                  {label}
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  {items.map((n, idx) => (
                    <motion.div
                      key={n.id}
                      data-ocid={`notifications.item.${idx + 1}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * idx, duration: 0.35 }}
                      onClick={() => handleClick(n)}
                      style={{
                        background: n.read
                          ? WARM_PAPER
                          : "rgba(212,168,83,0.08)",
                        border: `1px solid ${
                          n.read ? WARM_BORDER : "rgba(212,168,83,0.35)"
                        }`,
                        borderRadius: 12,
                        padding: "0.85rem 1rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 4px 16px rgba(92,61,46,0.12)";
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "none";
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(0)";
                      }}
                    >
                      {/* Avatar + type icon */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <AvatarBubble username={n.fromUser} />
                        <div
                          style={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            background: WARM_BG,
                            borderRadius: "50%",
                            width: 18,
                            height: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `1px solid ${WARM_BORDER}`,
                          }}
                        >
                          <TypeIcon type={n.type} />
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: "0.85rem",
                            color: WARM_TEXT,
                            margin: 0,
                            lineHeight: 1.5,
                          }}
                        >
                          {typeLabel(n)}
                        </p>
                        {n.targetContent && (
                          <p
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontStyle: "italic",
                              fontSize: "0.75rem",
                              color: "rgba(61,43,31,0.6)",
                              margin: "0.2rem 0 0",
                            }}
                          >
                            on &ldquo;{n.targetContent}&rdquo;
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            marginTop: "0.3rem",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.68rem",
                              color: "rgba(61,43,31,0.45)",
                            }}
                          >
                            {relativeTime(n.timestamp)}
                          </span>
                          <Eye
                            style={{
                              width: 11,
                              height: 11,
                              color: "rgba(61,43,31,0.35)",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.65rem",
                              color: "rgba(61,43,31,0.35)",
                            }}
                          >
                            Tap for details
                          </span>
                        </div>
                      </div>
                      {!n.read && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: WARM_GOLD,
                            flexShrink: 0,
                            marginTop: "0.4rem",
                          }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
