import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const colors = {
  bg: "#FFF8EE",
  paper: "#F5ECD7",
  brown: "#8B6F47",
  mocha: "#5C3D2E",
  gold: "#D4A853",
  text: "#3D2B1F",
  muted: "rgba(92,61,46,0.5)",
  border: "rgba(139,111,71,0.25)",
};

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  "Help me write a poem",
  "Give me a theme",
  "I feel something but can't write",
  "How do I use this website?",
  "Suggest rhymes",
];

const RESPONSES = {
  poem: [
    "Let me help you find your words… What emotion is whispering inside you right now?",
    "Poetry begins where words hesitate. Tell me what you're feeling — I'll help you shape it.",
    "Every poem lives in silence before it's written. What silence are you carrying today?",
  ],
  theme: [
    'Today\'s theme: "The silence between two heartbeats." Write about the pause before everything changes.',
    "Theme: A letter to your younger self — what would you tell them about the nights that felt endless?",
    "Theme: The last candle — something fading, yet still casting light.",
    'Theme: "Rain on a forgotten window" — memories arriving uninvited.',
  ],
  feeling: [
    'Sometimes the feeling itself is the poem. Just start with "I feel…" and let the rest come.',
    "You don't have to write perfectly. Write honestly. The words will arrange themselves around the truth.",
    "Your heart already knows the poem. Let your pen follow it, not lead it.",
  ],
  howto: [
    "You can post in the Feed, explore poems in the Poems section, write notes in My Notes, and connect with others in Messages. The 🌐 globe translates the site into your language.",
    "To post a poem: go to Feed, type in the box at the top, and press Post. To read full poems, log in with your account.",
  ],
  rhymes: [
    "heart / apart / art / start / dark\nnight / light / sight / write / right\ntime / rhyme / climb / chime",
    "soul / whole / role / toll / console\nlove / above / dove / wove\nsea / free / be / me / mystery",
    "silence / violence / resilience\nbreath / death / beneath / wreath\nmoon / soon / tune / cocoon",
  ],
  general: [
    "I'm here, listening. What would you like to explore today?",
    "Every word you write is a small act of courage. I'm with you.",
    "In the silence between your thoughts — that's where your poem waits.",
    "There is no wrong way to feel. Only unexpressed ways. Let's change that.",
    "Your silence has its own language. Let me help you translate it.",
  ],
};

function getResponse(input: string, mode: string): string {
  const lower = input.toLowerCase();
  let pool: string[];

  if (
    lower.includes("poem") ||
    lower.includes("write") ||
    lower.includes("verse")
  ) {
    pool = RESPONSES.poem;
  } else if (
    lower.includes("theme") ||
    lower.includes("topic") ||
    lower.includes("idea")
  ) {
    pool = RESPONSES.theme;
  } else if (
    lower.includes("feel") ||
    lower.includes("emotion") ||
    lower.includes("can't write") ||
    lower.includes("something")
  ) {
    pool = RESPONSES.feeling;
  } else if (
    lower.includes("website") ||
    lower.includes("how") ||
    lower.includes("use") ||
    lower.includes("post")
  ) {
    pool = RESPONSES.howto;
  } else if (
    lower.includes("rhyme") ||
    lower.includes("word") ||
    lower.includes("suggest")
  ) {
    pool = RESPONSES.rhymes;
  } else {
    pool = RESPONSES.general;
  }

  const base = pool[Math.floor(Math.random() * pool.length)];

  if (mode === "philosophical") {
    return `${base}\n\nWhat does this stir in you? What question lives beneath your question?`;
  }
  if (mode === "minimal") {
    return `${base.split(".")[0]}.`;
  }
  return base;
}

export default function SilentListenerChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiMode, setAiMode] = useState("soft");

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("chinnua_user_settings") || "{}",
      );
      if (saved.aiEnabled === false) setAiEnabled(false);
      if (saved.aiMode) setAiMode(saved.aiMode);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowSuggestions(false);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const response = getResponse(text, aiMode);
    const aiMsg: Message = { id: Date.now() + 1, role: "ai", text: response };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!aiEnabled) return null;

  return (
    <>
      <style>{`
        @keyframes silentPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 16px rgba(212,168,83,0.45); }
          50% { transform: scale(1.06); box-shadow: 0 0 24px rgba(212,168,83,0.7); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-4px); }
        }
        .silent-msg-enter {
          animation: msgFadeIn 0.35s ease forwards;
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Floating Button */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            title="The Silent Listener is here…"
            aria-label="Open The Silent Listener"
            data-ocid="silent_listener.button"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, ${colors.gold}, #c8962a)",
              border: "none",
              cursor: "pointer",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "silentPulse 2.5s ease-in-out infinite",
              transition: "transform 0.2s",
            }}
          >
            ✒️
          </button>
          {/* Tooltip */}
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              right: 0,
              background: colors.paper,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: "0.35rem 0.65rem",
              whiteSpace: "nowrap",
              fontFamily: "'Lora', serif",
              fontSize: "0.78rem",
              color: colors.mocha,
              pointerEvents: "none",
              boxShadow: "0 2px 8px rgba(92,61,46,0.15)",
              opacity: 0,
            }}
            className="silent-tooltip"
          >
            The Silent Listener is here…
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: 90,
              right: 24,
              width: 340,
              maxHeight: 520,
              background: colors.paper,
              border: "1px solid rgba(212,168,83,0.35)",
              borderRadius: 16,
              boxShadow: "0 8px 40px rgba(92,61,46,0.25)",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            data-ocid="silent_listener.panel"
          >
            {/* Header */}
            <div
              style={{
                padding: "0.9rem 1rem 0.75rem",
                borderBottom: `1px solid ${colors.border}`,
                background: colors.paper,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: colors.mocha,
                      fontSize: "1rem",
                      margin: 0,
                    }}
                  >
                    The Silent Listener
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Lora', serif",
                      fontStyle: "italic",
                      color: colors.gold,
                      fontSize: "0.78rem",
                      margin: "0.15rem 0 0",
                    }}
                  >
                    Sometimes silence needs a voice.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: colors.muted,
                    fontSize: "1.1rem",
                    padding: "0.1rem",
                    lineHeight: 1,
                    marginLeft: "0.5rem",
                  }}
                  data-ocid="silent_listener.close_button"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "0.85rem",
                background:
                  "repeating-linear-gradient(to bottom, ${colors.paper} 0px, ${colors.paper} 27px, rgba(139,111,71,0.08) 28px)",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(212,168,83,0.3) transparent",
              }}
            >
              {/* Suggestion chips */}
              {showSuggestions && messages.length === 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <p
                    style={{
                      fontFamily: "'Lora', serif",
                      color: colors.muted,
                      fontSize: "0.78rem",
                      marginBottom: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    How can I help you today?
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
                  >
                    {SUGGESTIONS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => sendMessage(s)}
                        style={{
                          padding: "0.3rem 0.65rem",
                          borderRadius: 20,
                          border: `1px solid ${colors.gold}`,
                          background: colors.bg,
                          color: colors.mocha,
                          fontFamily: "'Lora', serif",
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        data-ocid="silent_listener.suggestion.button"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="silent-msg-enter"
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: "0.6rem",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "0.55rem 0.8rem",
                      borderRadius:
                        msg.role === "user"
                          ? "12px 12px 2px 12px"
                          : "12px 12px 12px 2px",
                      background:
                        msg.role === "user"
                          ? "rgba(212,168,83,0.15)"
                          : "rgba(139,111,71,0.1)",
                      fontFamily: "'Lora', serif",
                      fontSize: "0.85rem",
                      color: colors.text,
                      fontStyle: msg.role === "ai" ? "italic" : "normal",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.55,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "0.6rem",
                  }}
                >
                  <div
                    style={{
                      padding: "0.55rem 0.8rem",
                      borderRadius: "12px 12px 12px 2px",
                      background: "rgba(139,111,71,0.1)",
                      fontFamily: "'Lora', serif",
                      fontStyle: "italic",
                      color: colors.muted,
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                    }}
                  >
                    The Silent Listener is thinking
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: colors.gold,
                          animation: `typingDot 1.2s ease ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "0.65rem 0.85rem",
                borderTop: `1px solid ${colors.border}`,
                background: colors.paper,
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-end",
                flexShrink: 0,
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write what your heart couldn't say…"
                rows={2}
                style={{
                  flex: 1,
                  resize: "none",
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  padding: "0.45rem 0.65rem",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.82rem",
                  color: colors.text,
                  outline: "none",
                  lineHeight: 1.5,
                }}
                data-ocid="silent_listener.input"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: input.trim()
                    ? colors.gold
                    : "rgba(212,168,83,0.35)",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1rem",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
                data-ocid="silent_listener.send.button"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
