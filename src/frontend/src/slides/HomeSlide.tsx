import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import FeedSlide from "./FeedSlide";

interface User {
  username: string;
  bio?: string;
  createdAt?: string;
}

interface HomeSlideProps {
  goToFeed: () => void;
  currentUser?: User | null;
  onJoin?: () => void;
  onLogin?: (user: {
    username: string;
    bio?: string;
    email?: string;
    createdAt: string;
  }) => void;
  onViewProfile?: (username: string) => void;
}

const QUOTES = [
  {
    label: "Mystery",
    lines: [
      "Some stories...",
      "are never told,",
      "yet they scream the loudest.",
    ],
  },
  {
    label: "Hidden Pain",
    lines: [
      "I mastered silence...",
      "not because I had nothing to say,",
      "but because no one was ready to listen.",
    ],
  },
  {
    label: "Loneliness",
    lines: ["Being alone never hurt me...", "but being misunderstood did."],
  },
  {
    label: "Identity",
    lines: [
      "You see my words...",
      "but you'll never see",
      "the wounds that wrote them.",
    ],
  },
  {
    label: "Signature",
    lines: ["Not every poet writes...", "some just bleed quietly."],
  },
];

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";

function TabBar({
  active,
  onChange,
}: {
  active: "home" | "feed";
  onChange: (t: "home" | "feed") => void;
}) {
  const tabs: { key: "home" | "feed"; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "feed", label: "Feed" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderBottom: `1px solid ${WARM_BORDER}`,
        background: WARM_PAPER,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          data-ocid={`home.${t.key}.tab`}
          style={{
            background:
              active === t.key ? "rgba(212,168,83,0.12)" : "transparent",
            border: "none",
            borderBottom:
              active === t.key
                ? `2px solid ${WARM_GOLD}`
                : "2px solid transparent",
            color: active === t.key ? WARM_MOCHA : WARM_BROWN,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            padding: "0.75rem 2rem",
            cursor: "pointer",
            transition: "all 0.2s",
            textTransform: "uppercase",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function HomeSlide({
  goToFeed,
  currentUser,
  onJoin,
  onLogin,
  onViewProfile,
}: HomeSlideProps) {
  const [tab, setTab] = useState<"home" | "feed">("home");

  const feedUser = currentUser
    ? {
        username: currentUser.username,
        bio: currentUser.bio ?? "",
        createdAt: currentUser.createdAt ?? new Date().toISOString(),
      }
    : null;

  return (
    <div
      className="slide-container"
      style={{ background: WARM_BG, overflowY: "auto", overflowX: "hidden" }}
    >
      <TabBar active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        {tab === "feed" ? (
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FeedSlide
              currentUser={feedUser}
              onJoin={onJoin ?? (() => {})}
              onLogin={onLogin ?? (() => {})}
              onViewProfile={onViewProfile}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* HERO */}
            <section
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "5rem 2rem 4rem",
                position: "relative",
                background: `linear-gradient(180deg, ${WARM_BG} 0%, #F5ECD7 60%, ${WARM_BG} 100%)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 50% 40%, rgba(212,168,83,0.1) 0%, transparent 65%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,111,71,0.04) 27px, rgba(139,111,71,0.04) 28px)",
                  pointerEvents: "none",
                }}
              />

              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  width: 148,
                  height: 148,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid rgba(212,168,83,0.6)",
                  boxShadow:
                    "0 0 30px rgba(212,168,83,0.25), 0 8px 30px rgba(92,61,46,0.2)",
                  marginBottom: "2rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <img
                  src="/assets/uploads/chatgpt_image_mar_27_2026_05_29_47_pm-019d334d-3cb3-70a1-9f7f-ccdf89ed6a6d-1.png"
                  alt="CHINNUA"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(0deg, rgba(92,61,46,0.75) 0%, transparent 100%)",
                    padding: "0.6rem 0.5rem 0.4rem",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "0.48rem",
                      color: "rgba(255,248,238,0.9)",
                      letterSpacing: "0.04em",
                      lineHeight: 1.4,
                      display: "block",
                    }}
                  >
                    I exist... but not everyone gets to see me.
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                  fontWeight: 700,
                  color: WARM_MOCHA,
                  letterSpacing: "0.12em",
                  marginBottom: "0.75rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                CHINNUA_POET
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                  color: WARM_BROWN,
                  maxWidth: 460,
                  lineHeight: 1.8,
                  marginBottom: "1rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Where every morning begins with a letter
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                  color: WARM_GOLD,
                  marginBottom: "2.5rem",
                  zIndex: 1,
                  position: "relative",
                }}
              >
                Words that feel like home
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <a
                  href="https://x.com/CHINNUA_POET"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="home.primary_button"
                  style={{
                    padding: "0.7rem 1.8rem",
                    borderRadius: 10,
                    border: "1px solid rgba(139,111,71,0.4)",
                    background: "transparent",
                    color: WARM_MOCHA,
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "all 0.3s",
                    letterSpacing: "0.05em",
                  }}
                >
                  Follow on X
                </a>
                <button
                  type="button"
                  onClick={goToFeed}
                  data-ocid="home.secondary_button"
                  style={{
                    padding: "0.7rem 1.8rem",
                    borderRadius: 10,
                    border: "none",
                    background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
                    color: "#3D2B1F",
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(212,168,83,0.35)",
                    transition: "all 0.3s",
                    letterSpacing: "0.05em",
                  }}
                >
                  Enter the World
                </button>
              </motion.div>
            </section>

            {/* QUOTE SECTIONS */}
            {QUOTES.map((quote) => (
              <section
                key={quote.label}
                style={{
                  minHeight: "60vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5rem 2rem",
                  textAlign: "center",
                  borderTop: "1px solid rgba(139,111,71,0.12)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: 560,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: WARM_GOLD,
                      marginBottom: "1rem",
                      opacity: 0.9,
                    }}
                  >
                    {quote.label}
                  </span>
                  <div
                    style={{
                      width: 40,
                      height: 1,
                      background: "rgba(212,168,83,0.4)",
                      marginBottom: "1.75rem",
                    }}
                  />
                  <div>
                    {quote.lines.map((line) => (
                      <p
                        key={line}
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontStyle: "italic",
                          fontSize: "clamp(1.15rem, 3vw, 1.7rem)",
                          color: WARM_MOCHA,
                          lineHeight: 1.9,
                          margin: 0,
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </section>
            ))}

            {/* NOTE FROM THE POET */}
            <section
              style={{
                padding: "8rem 2rem 6rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                style={{
                  maxWidth: 560,
                  width: "100%",
                  background: WARM_PAPER,
                  border: "1px solid rgba(212,168,83,0.3)",
                  borderRadius: 16,
                  padding: "3rem",
                  textAlign: "center",
                  boxShadow: "0 8px 40px rgba(92,61,46,0.12)",
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,111,71,0.06) 27px, rgba(139,111,71,0.06) 28px)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(212,168,83,0.4)",
                    margin: "0 auto 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: WARM_GOLD,
                    fontSize: "1rem",
                  }}
                >
                  &#9993;
                </div>
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.62rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: WARM_GOLD,
                    margin: "0 0 1.2rem",
                    opacity: 0.9,
                  }}
                >
                  A Note from the Poet
                </p>
                <div
                  style={{
                    width: 50,
                    height: 1,
                    background: "rgba(212,168,83,0.4)",
                    margin: "0 auto 2rem",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)",
                    color: WARM_BROWN,
                    lineHeight: 2,
                    margin: "0 0 2rem",
                  }}
                >
                  Dear Reader, As you reach the final page, may these poems
                  linger in your heart, like whispers of forgotten dreams and
                  silent hopes. Each verse is a window into a world of feelings
                  — love, loss, wonder, and discovery. Carry them with you, and
                  let your soul wander in their echoes.
                </p>
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    color: WARM_GOLD,
                    margin: "0 0 0.75rem",
                  }}
                >
                  Thank you
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: WARM_BROWN,
                    margin: 0,
                  }}
                >
                  — CHINNUA_POET
                </p>
              </motion.div>
            </section>

            {/* FOOTER QUOTE */}
            <section
              style={{
                padding: "4rem 2rem 6rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderTop: "1px solid rgba(139,111,71,0.12)",
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                style={{ maxWidth: 420 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 1,
                    background: "rgba(212,168,83,0.3)",
                    margin: "0 auto 2.5rem",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1rem",
                    color: WARM_TEXT,
                    lineHeight: 1.9,
                    margin: 0,
                  }}
                >
                  &ldquo;If you understood even a part of this...&rdquo;
                  <br />
                  you&apos;ve felt it too.
                </p>
                <p
                  style={{
                    marginTop: "2rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    color: WARM_GOLD,
                    textTransform: "uppercase",
                  }}
                >
                  — CHINNUA
                </p>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
