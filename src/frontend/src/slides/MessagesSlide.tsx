import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface User {
  username: string;
  bio: string;
  createdAt: string;
}
interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: string;
}

export default function MessagesSlide({
  currentUser,
  onJoin,
}: { currentUser: User | null; onJoin: () => void }) {
  const [conversations, setConversations] = useState<string[]>([
    "CHINNUA_POET",
  ]);
  const [activeConv, setActiveConv] = useState("CHINNUA_POET");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored: Record<string, Message[]> = JSON.parse(
      localStorage.getItem("chinnua_messages") || "{}",
    );
    setMessages(stored);
    const keys = Object.keys(stored).filter((k) => k !== "CHINNUA_POET");
    setConversations(["CHINNUA_POET", ...keys]);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/conv change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConv]);

  const sendMessage = () => {
    if (!currentUser || !text.trim()) return;
    const msg: Message = {
      id: `msg_${Date.now()}`,
      from: currentUser.username,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    const stored: Record<string, Message[]> = JSON.parse(
      localStorage.getItem("chinnua_messages") || "{}",
    );
    stored[activeConv] = [...(stored[activeConv] ?? []), msg];
    localStorage.setItem("chinnua_messages", JSON.stringify(stored));
    setMessages({ ...stored });
    setText("");
  };

  if (!currentUser) {
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
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.2rem",
              color: "rgba(229,231,235,0.7)",
              marginBottom: "1rem",
            }}
          >
            Join to send messages
          </p>
          <Button
            onClick={onJoin}
            data-ocid="messages.primary_button"
            style={{
              background: "rgba(200,169,106,0.85)",
              border: "none",
              color: "#fff",
            }}
          >
            Join the Community
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentMessages = messages[activeConv] ?? [];

  return (
    <div className="slide-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          height: "100%",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: 200,
            borderRight: "1px solid rgba(200,169,106,0.15)",
            padding: "1rem 0.75rem",
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.75rem",
              color: "rgba(229,231,235,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
              paddingLeft: "0.25rem",
            }}
          >
            Messages
          </h3>
          {conversations.map((conv) => (
            <button
              key={conv}
              type="button"
              onClick={() => setActiveConv(conv)}
              data-ocid="messages.button"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.65rem 0.75rem",
                borderRadius: 8,
                background:
                  activeConv === conv
                    ? "rgba(200,169,106,0.15)"
                    : "transparent",
                border:
                  activeConv === conv
                    ? "1px solid rgba(200,169,106,0.3)"
                    : "1px solid transparent",
                color:
                  activeConv === conv ? "#F5E6D3" : "rgba(229,231,235,0.6)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.85rem",
                cursor: "pointer",
                marginBottom: "0.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background:
                    conv === "CHINNUA_POET"
                      ? "rgba(200,169,106,0.3)"
                      : "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {conv.charAt(0)}
              </div>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "0.82rem",
                }}
              >
                {conv}
              </span>
            </button>
          ))}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid rgba(200,169,106,0.15)",
              paddingBottom: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#F5E6D3",
              }}
            >
              {activeConv === "CHINNUA_POET" ? "✦ CHINNUA_POET" : activeConv}
            </h3>
            {activeConv === "CHINNUA_POET" && (
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.72rem",
                  color: "rgba(229,231,235,0.4)",
                }}
              >
                Send a message to the poet
              </p>
            )}
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          >
            {currentMessages.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "rgba(229,231,235,0.3)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.85rem",
                  marginTop: "2rem",
                }}
                data-ocid="messages.empty_state"
              >
                No messages yet. Say something…
              </p>
            )}
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf:
                    msg.from === currentUser.username
                      ? "flex-end"
                      : "flex-start",
                  maxWidth: "70%",
                  padding: "0.6rem 1rem",
                  borderRadius: 12,
                  background:
                    msg.from === currentUser.username
                      ? "rgba(200,169,106,0.25)"
                      : "rgba(255,255,255,0.06)",
                  border: `1px solid ${
                    msg.from === currentUser.username
                      ? "rgba(200,169,106,0.3)"
                      : "rgba(255,255,255,0.08)"
                  }`,
                }}
              >
                <p
                  style={{
                    color: "rgba(229,231,235,0.85)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.88rem",
                    margin: 0,
                  }}
                >
                  {msg.text}
                </p>
                <p
                  style={{
                    color: "rgba(229,231,235,0.3)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.7rem",
                    margin: "0.2rem 0 0",
                    textAlign: "right",
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid rgba(200,169,106,0.15)",
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              data-ocid="messages.input"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(200,169,106,0.2)",
                borderRadius: 8,
                padding: "0.6rem 0.9rem",
                color: "#F5E6D3",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!text.trim()}
              data-ocid="messages.submit_button"
              style={{
                background: "rgba(200,169,106,0.85)",
                border: "none",
                color: "#fff",
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
