import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import InkAndPenModal from "../components/InkAndPenModal";

interface User {
  username: string;
  bio: string;
  createdAt: string;
}

interface InboxSlideProps {
  currentUser: User | null;
  onLogin: () => void;
}

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_MUTED = "#9E8070";
const WARM_BORDER = "rgba(139,111,71,0.25)";

const MORNING_LETTERS = [
  "The sun rose today, and so did you. That alone is something worth celebrating.",
  "Before the world asks anything of you, let this letter remind you — you are enough.",
  "Open your eyes slowly. There's no rush. Today belongs to you.",
  "The morning mist clears, and in its place — a day written just for you.",
  "Today may hold a thousand moments. Let the first one be quiet, and yours.",
  "Good morning, dear heart. May today be gentle on you.",
  "A new page. A new morning. Write it softly.",
];

const NIGHT_LETTERS = [
  "The day is done. Whatever it held, you held it too. Rest now.",
  "Stars don't need to shine brightly every night. Neither do you.",
  "Let the weight of today dissolve. Tomorrow will be lighter.",
  "Close your eyes, dear soul. You did enough.",
  "The moon is watching over you tonight. Sleep in peace.",
  "In the silence of this night, your story continues. Rest well.",
  "Another day loved, survived, breathed through. That's everything.",
];

interface Letter {
  id: string;
  type: "morning" | "night";
  text: string;
  date: string;
  read: boolean;
  imageGradient?: string;
  adminReply?: string;
}

function getLetterForToday(username: string): Letter[] {
  const now = new Date();
  const dayIndex = now.getDay();
  const hour = now.getHours();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let adminMorning: string[] = [];
  let adminNight: string[] = [];
  try {
    const adminLetters = localStorage.getItem("chinnua_daily_messages");
    if (adminLetters) {
      const parsed = JSON.parse(adminLetters);
      adminMorning = parsed.morning || [];
      adminNight = parsed.night || [];
    }
  } catch {}

  const morningPool = adminMorning.length > 0 ? adminMorning : MORNING_LETTERS;
  const nightPool = adminNight.length > 0 ? adminNight : NIGHT_LETTERS;

  const morningText = morningPool[dayIndex % morningPool.length];
  const nightText = nightPool[dayIndex % nightPool.length];

  const imageGradients = [
    "linear-gradient(135deg, #D4A853 0%, #8B6F47 40%, #F5ECD7 100%)",
    "linear-gradient(135deg, #F5ECD7 0%, #D4A853 50%, #8B6F47 100%)",
    "linear-gradient(180deg, #9E8070 0%, #8B6F47 60%, #5C3D2E 100%)",
  ];

  const letters: Letter[] = [];

  let readStatus: Record<string, boolean> = {};
  let inkReplies: Array<{ id: string; adminReply?: string }> = [];
  try {
    readStatus = JSON.parse(
      localStorage.getItem(`chinnua_inbox_read_${username}`) || "{}",
    );
    inkReplies = JSON.parse(
      localStorage.getItem("chinnua_ink_replies") || "[]",
    );
  } catch {}

  const morningId = `morning_${dateStr}`;
  const nightId = `night_${dateStr}`;

  const morningReply = inkReplies.find((r) => r.id === morningId)?.adminReply;
  const nightReply = inkReplies.find((r) => r.id === nightId)?.adminReply;

  letters.push({
    id: morningId,
    type: "morning",
    text: morningText,
    date: dateStr,
    read: readStatus[morningId] ?? false,
    imageGradient: imageGradients[dayIndex % imageGradients.length],
    adminReply: morningReply,
  });

  if (hour >= 20 || hour < 5) {
    letters.push({
      id: nightId,
      type: "night",
      text: nightText,
      date: dateStr,
      read: readStatus[nightId] ?? false,
      imageGradient: imageGradients[(dayIndex + 1) % imageGradients.length],
      adminReply: nightReply,
    });
  }

  return letters;
}

function markRead(username: string, letterId: string) {
  try {
    const key = `chinnua_inbox_read_${username}`;
    const current = JSON.parse(localStorage.getItem(key) || "{}");
    current[letterId] = true;
    localStorage.setItem(key, JSON.stringify(current));
  } catch {}
}

export default function InboxSlide({ currentUser, onLogin }: InboxSlideProps) {
  const [openLetter, setOpenLetter] = useState<Letter | null>(null);
  const [letters, setLetters] = useState<Letter[]>(() =>
    currentUser ? getLetterForToday(currentUser.username) : [],
  );
  const [showInkModal, setShowInkModal] = useState(false);
  const [inkLetter, setInkLetter] = useState<Letter | null>(null);

  const handleOpenLetter = (letter: Letter) => {
    setOpenLetter(letter);
    if (!letter.read && currentUser) {
      markRead(currentUser.username, letter.id);
      setLetters((prev) =>
        prev.map((l) => (l.id === letter.id ? { ...l, read: true } : l)),
      );
    }
  };

  const handleInkPen = (letter: Letter) => {
    setInkLetter(letter);
    setShowInkModal(true);
    setOpenLetter(null);
  };

  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: "60vh",
          background: WARM_BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `1px solid ${WARM_BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            color: WARM_GOLD,
            fontSize: "1.5rem",
          }}
        >
          &#9993;
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.5rem",
            color: WARM_MOCHA,
            margin: "0 0 1rem",
          }}
        >
          Your Inbox Awaits
        </h2>
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            fontSize: "1rem",
            color: WARM_BROWN,
            maxWidth: 360,
            lineHeight: 1.8,
            margin: "0 0 2rem",
          }}
        >
          Sign in to receive your daily letters — a warm morning note and a
          gentle evening wish, just for you.
        </p>
        <button
          type="button"
          onClick={onLogin}
          data-ocid="inbox.primary_button"
          style={{
            background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
            border: "none",
            borderRadius: 10,
            padding: "0.75rem 2rem",
            color: "#3D2B1F",
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.9rem",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(212,168,83,0.35)",
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "60vh",
        background: WARM_BG,
        padding: "2rem 2rem 5rem",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: 640, margin: "0 auto 3rem", textAlign: "center" }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `1px solid ${WARM_BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 0.75rem",
            color: WARM_GOLD,
            fontSize: "1.3rem",
          }}
        >
          &#9993;
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.8rem",
            color: WARM_MOCHA,
            margin: "0 0 0.5rem",
            fontWeight: 700,
          }}
        >
          Your Inbox
        </h1>
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: WARM_BROWN,
            margin: 0,
          }}
        >
          Letters written with love, delivered just for you
        </p>
        <div
          style={{
            width: 60,
            height: 2,
            background: "rgba(212,168,83,0.5)",
            margin: "1.25rem auto 0",
            borderRadius: 1,
          }}
        />
      </motion.div>

      {/* Letters list */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {letters.length === 0 ? (
          <div
            data-ocid="inbox.empty_state"
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: WARM_PAPER,
              borderRadius: 16,
              border: `1px solid ${WARM_BORDER}`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${WARM_BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                color: WARM_MOCHA,
                fontSize: "1.1rem",
              }}
            >
              )
            </div>
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                color: WARM_BROWN,
                fontSize: "1rem",
                lineHeight: 1.8,
              }}
            >
              Your morning letter is being written...
              <br />
              <span style={{ fontSize: "0.85rem", color: WARM_MUTED }}>
                Evening letters arrive after 8pm.
              </span>
            </p>
          </div>
        ) : (
          letters.map((letter, i) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              data-ocid={`inbox.item.${i + 1}`}
            >
              <button
                type="button"
                onClick={() => handleOpenLetter(letter)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  className="warm-card"
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Image preview */}
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      background: letter.imageGradient,
                      flexShrink: 0,
                      boxShadow: "0 2px 10px rgba(92,61,46,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3D2B1F",
                      fontSize: "0.7rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    {letter.type === "morning" ? "AM" : "PM"}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.4rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "0.6rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color:
                            letter.type === "morning" ? WARM_GOLD : WARM_MOCHA,
                          background:
                            letter.type === "morning"
                              ? "rgba(212,168,83,0.15)"
                              : "rgba(92,61,46,0.12)",
                          padding: "2px 8px",
                          borderRadius: 20,
                        }}
                      >
                        {letter.type === "morning"
                          ? "Morning Letter"
                          : "Evening Letter"}
                      </span>
                      {!letter.read && (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: WARM_GOLD,
                            flexShrink: 0,
                            boxShadow: "0 0 6px rgba(212,168,83,0.6)",
                            display: "inline-block",
                          }}
                        />
                      )}
                    </div>
                    <p
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                        color: WARM_TEXT,
                        lineHeight: 1.6,
                        margin: "0 0 0.4rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                      }}
                    >
                      {letter.text}
                    </p>
                    <span
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontSize: "0.72rem",
                        color: WARM_MUTED,
                      }}
                    >
                      {letter.date}
                    </span>
                    {letter.adminReply && (
                      <div
                        style={{
                          marginTop: "0.4rem",
                          fontSize: "0.72rem",
                          color: WARM_GOLD,
                          fontFamily: "'Lora', Georgia, serif",
                          fontStyle: "italic",
                        }}
                      >
                        Reply received
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Full letter modal */}
      <AnimatePresence>
        {openLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(92,61,46,0.45)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "1rem",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpenLetter(null);
            }}
            data-ocid="inbox.modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: WARM_PAPER,
                border: "1px solid rgba(212,168,83,0.4)",
                borderRadius: 20,
                maxWidth: 520,
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(92,61,46,0.25)",
                position: "relative",
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,111,71,0.06) 27px, rgba(139,111,71,0.06) 28px)",
              }}
            >
              {/* Image section */}
              <div
                style={{
                  height: 160,
                  borderRadius: "20px 20px 0 0",
                  background: openLetter.imageGradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(245,236,215,0.8) 100%)",
                    borderRadius: "20px 20px 0 0",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#3D2B1F",
                    textShadow: "0 1px 4px rgba(92,61,46,0.5)",
                  }}
                >
                  {openLetter.type === "morning" ? "Morning" : "Evening"}
                </span>
              </div>

              <div style={{ padding: "2rem" }}>
                <button
                  type="button"
                  onClick={() => setOpenLetter(null)}
                  data-ocid="inbox.close_button"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "rgba(139,111,71,0.15)",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: WARM_BROWN,
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}
                >
                  x
                </button>

                <div style={{ marginBottom: "1.5rem" }}>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color:
                        openLetter.type === "morning" ? WARM_GOLD : WARM_MOCHA,
                    }}
                  >
                    {openLetter.type === "morning"
                      ? "Good Morning"
                      : "Good Evening"}
                    , {currentUser?.username}
                  </span>
                  <div
                    style={{
                      width: 40,
                      height: 1,
                      background: "rgba(212,168,83,0.4)",
                      margin: "0.75rem 0",
                    }}
                  />
                </div>

                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    color: WARM_TEXT,
                    lineHeight: 1.9,
                    margin: "0 0 1.5rem",
                  }}
                >
                  {openLetter.text}
                </p>

                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.72rem",
                    color: WARM_MUTED,
                    letterSpacing: "0.08em",
                    margin: "0 0 2rem",
                  }}
                >
                  — with love, CHINNUA_POET &nbsp;&middot;&nbsp;{" "}
                  {openLetter.date}
                </p>

                {openLetter.adminReply && (
                  <div
                    style={{
                      background: "rgba(212,168,83,0.08)",
                      border: "1px solid rgba(212,168,83,0.3)",
                      borderRadius: 12,
                      padding: "1rem 1.25rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                        color: WARM_GOLD,
                        lineHeight: 1.8,
                        margin: 0,
                      }}
                    >
                      &ldquo;{openLetter.adminReply}&rdquo;
                    </p>
                    <p
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "0.62rem",
                        color: WARM_BROWN,
                        margin: "0.5rem 0 0",
                        letterSpacing: "0.08em",
                      }}
                    >
                      A personal reply from CHINNUA_POET
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleInkPen(openLetter)}
                  data-ocid="inbox.secondary_button"
                  style={{
                    width: "100%",
                    background:
                      "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(139,111,71,0.1))",
                    border: "1px solid rgba(212,168,83,0.35)",
                    borderRadius: 12,
                    padding: "0.85rem",
                    color: WARM_MOCHA,
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontStyle: "italic",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>Ink &amp; Pen — Reply with your heart</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInkModal && inkLetter && (
          <InkAndPenModal
            letterId={inkLetter.id}
            letterType={inkLetter.type}
            onClose={() => {
              setShowInkModal(false);
              setInkLetter(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
