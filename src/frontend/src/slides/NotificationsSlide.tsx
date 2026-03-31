import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface User {
  username: string;
  bio: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "message";
  fromUser: string;
  targetContent?: string;
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

function typeIcon(type: Notification["type"]) {
  switch (type) {
    case "like":
      return "❤️";
    case "comment":
      return "💬";
    case "follow":
      return "👤";
    case "message":
      return "✉️";
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

// Seed sample notifications if none exist
function seedNotifications(): Notification[] {
  const samples: Notification[] = [
    {
      id: "n1",
      type: "like",
      fromUser: "Luna_Verse",
      targetContent: "Echoes of My Heart",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      read: false,
    },
    {
      id: "n2",
      type: "comment",
      fromUser: "SilentInk",
      targetContent: "Fading Light",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: "n3",
      type: "follow",
      fromUser: "VelvetWords",
      targetContent: undefined,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: "n4",
      type: "message",
      fromUser: "PoetryMuse",
      targetContent: undefined,
      timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      read: true,
    },
  ];
  localStorage.setItem("chinnua_notifications", JSON.stringify(samples));
  return samples;
}

export default function NotificationsSlide({
  currentUser,
  onLogin,
}: {
  currentUser: User | null;
  onLogin: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.1rem",
              color: WARM_MOCHA,
              marginBottom: "0.5rem",
            }}
          >
            🔔 Notifications
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
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.9rem",
                color: WARM_MOCHA,
                fontWeight: 700,
                marginBottom: "0.2rem",
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: "0.6rem",
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
              }}
            >
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
            <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔔</p>
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
              When someone likes, comments, or follows you — it appears here
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
                      style={{
                        background: n.read
                          ? WARM_PAPER
                          : "rgba(212,168,83,0.08)",
                        border: `1px solid ${n.read ? WARM_BORDER : "rgba(212,168,83,0.35)"}`,
                        borderRadius: 12,
                        padding: "0.85rem 1rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        transition: "background 0.2s",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.25rem",
                          flexShrink: 0,
                          marginTop: "0.1rem",
                        }}
                      >
                        {typeIcon(n.type)}
                      </span>
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
                            on "{n.targetContent}"
                          </p>
                        )}
                        <span
                          style={{
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: "0.68rem",
                            color: "rgba(61,43,31,0.45)",
                            marginTop: "0.3rem",
                            display: "block",
                          }}
                        >
                          {relativeTime(n.timestamp)}
                        </span>
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
