import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface InkAndPenModalProps {
  letterId: string;
  letterType: "morning" | "night";
  onClose: () => void;
}

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_MUTED = "#9E8070";

interface InkReply {
  id: string;
  letterType: "morning" | "night";
  userMessage: string;
  adminReply?: string;
  submittedAt: string;
  repliedAt?: string;
}

export default function InkAndPenModal({
  letterId,
  letterType,
  onClose,
}: InkAndPenModalProps) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;
    try {
      const replies: InkReply[] = JSON.parse(
        localStorage.getItem("chinnua_ink_replies") || "[]",
      );
      const existing = replies.find((r) => r.id === letterId);
      if (existing) {
        existing.userMessage = message;
        existing.submittedAt = new Date().toISOString();
      } else {
        replies.push({
          id: letterId,
          letterType,
          userMessage: message,
          submittedAt: new Date().toISOString(),
        });
      }
      localStorage.setItem("chinnua_ink_replies", JSON.stringify(replies));
    } catch {}
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(92,61,46,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 150,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="inkpen.modal"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: WARM_BG,
          border: "1px solid rgba(212,168,83,0.4)",
          borderRadius: 20,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 20px 60px rgba(92,61,46,0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Paper texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,111,71,0.06) 27px, rgba(139,111,71,0.06) 28px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", padding: "2.5rem 2rem" }}>
          <button
            type="button"
            onClick={onClose}
            data-ocid="inkpen.close_button"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(139,111,71,0.12)",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              cursor: "pointer",
              color: WARM_BROWN,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>

          {/* Quill icon */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2.5rem" }}>✒️</span>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1.3rem",
                    color: WARM_MOCHA,
                    textAlign: "center",
                    margin: "0 0 0.5rem",
                    fontWeight: 400,
                  }}
                >
                  What are you thinking about today?
                </h2>
                <div
                  style={{
                    width: 50,
                    height: 1,
                    background: "rgba(212,168,83,0.4)",
                    margin: "0 auto 1.75rem",
                  }}
                />

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write freely, dear heart… this space holds no judgment."
                  rows={6}
                  data-ocid="inkpen.textarea"
                  style={{
                    width: "100%",
                    background: "rgba(245,236,215,0.6)",
                    border: "1px solid rgba(139,111,71,0.25)",
                    borderRadius: 12,
                    padding: "1rem",
                    color: WARM_TEXT,
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    lineHeight: 2,
                    resize: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(139,111,71,0.12) 31px, rgba(139,111,71,0.12) 32px)",
                    transition: "border-color 0.2s",
                  }}
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!message.trim()}
                  data-ocid="inkpen.submit_button"
                  style={{
                    width: "100%",
                    marginTop: "1.25rem",
                    background: message.trim()
                      ? `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`
                      : "rgba(139,111,71,0.15)",
                    border: "none",
                    borderRadius: 12,
                    padding: "0.85rem",
                    color: message.trim() ? WARM_PAPER : WARM_MUTED,
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.95rem",
                    cursor: message.trim() ? "pointer" : "not-allowed",
                    fontWeight: 600,
                    transition: "all 0.3s",
                    boxShadow: message.trim()
                      ? "0 4px 16px rgba(212,168,83,0.3)"
                      : "none",
                  }}
                >
                  Send with Love ❤️
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center", padding: "1rem 0" }}
                data-ocid="inkpen.success_state"
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  💌
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1.2rem",
                    color: WARM_MOCHA,
                    margin: "0 0 0.75rem",
                    fontWeight: 400,
                  }}
                >
                  Your words have been received.
                </h3>
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                    color: WARM_BROWN,
                    lineHeight: 1.8,
                    margin: "0 0 2rem",
                  }}
                >
                  A reply will find you soon.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  data-ocid="inkpen.cancel_button"
                  style={{
                    background: "rgba(212,168,83,0.15)",
                    border: "1px solid rgba(212,168,83,0.35)",
                    borderRadius: 10,
                    padding: "0.65rem 1.75rem",
                    color: WARM_MOCHA,
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
