import { motion } from "motion/react";

interface HomeSlideProps {
  goToFeed: () => void;
}

const QUOTES = [
  {
    label: "Mystery",
    lines: ["Some stories…", "are never told,", "yet they scream the loudest."],
  },
  {
    label: "Hidden Pain",
    lines: [
      "I mastered silence…",
      "not because I had nothing to say,",
      "but because no one was ready to listen.",
    ],
  },
  {
    label: "Loneliness",
    lines: ["Being alone never hurt me…", "but being misunderstood did."],
  },
  {
    label: "Identity",
    lines: [
      "You see my words…",
      "but you'll never see",
      "the wounds that wrote them.",
    ],
  },
  {
    label: "Signature",
    lines: ["Not every poet writes…", "some just bleed quietly."],
  },
];

export default function HomeSlide({ goToFeed }: HomeSlideProps) {
  return (
    <div
      className="slide-container"
      style={{
        background: "#0D0D0D",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* ── HERO ── */}
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
        }}
      >
        {/* subtle ambient glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(200,169,106,0.05) 0%, transparent 65%)",
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
            border: "2px solid rgba(200,169,106,0.6)",
            boxShadow:
              "0 0 30px rgba(200,169,106,0.25), 0 0 70px rgba(200,169,106,0.08)",
            marginBottom: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <img
            src="/assets/uploads/chatgpt_image_mar_27_2026_05_29_47_pm-019d3017-bf42-731e-8619-ad60704720f8-1.png"
            alt="CHINNUA"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            fontWeight: 700,
            color: "#F5E6D3",
            letterSpacing: "0.14em",
            marginBottom: "1.2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          CHINNUA_POET
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1.2 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "#C8A96A",
            maxWidth: 440,
            lineHeight: 1.8,
            marginBottom: "3rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          "I exist… but not everyone gets to see me."
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
              borderRadius: 6,
              border: "1px solid rgba(200,169,106,0.5)",
              background: "transparent",
              color: "#F5E6D3",
              fontFamily: "'Libre Baskerville', Georgia, serif",
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
              borderRadius: 6,
              border: "none",
              background: "#C8A96A",
              color: "#0D0D0D",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 0 24px rgba(200,169,106,0.3)",
              transition: "all 0.3s",
              letterSpacing: "0.05em",
            }}
          >
            Enter the World →
          </button>
        </motion.div>
      </section>

      {/* ── QUOTE SECTIONS ── */}
      {QUOTES.map((quote) => (
        <section
          key={quote.label}
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6rem 2rem",
            textAlign: "center",
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
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.65rem",
                fontWeight: 400,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#C8A96A",
                marginBottom: "1.25rem",
                opacity: 0.8,
              }}
            >
              {quote.label}
            </span>
            <div
              style={{
                width: 40,
                height: 1,
                background: "rgba(200,169,106,0.4)",
                marginBottom: "2rem",
              }}
            />
            <div>
              {quote.lines.map((line) => (
                <p
                  key={line}
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                    color: "#F5E6D3",
                    lineHeight: 1.9,
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        </section>
      ))}

      {/* ── FOOTER QUOTE ── */}
      <section
        style={{
          paddingTop: "6rem",
          paddingBottom: "5rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.5 }}
          style={{ maxWidth: 420 }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: "rgba(200,169,106,0.25)",
              margin: "0 auto 2.5rem",
            }}
          />
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "rgba(245,230,211,0.45)",
              lineHeight: 1.9,
              margin: 0,
            }}
          >
            "If you understood even a part of this…"
            <br />
            you&apos;ve felt it too.
          </p>
          <p
            style={{
              marginTop: "2rem",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              color: "rgba(200,169,106,0.3)",
              textTransform: "uppercase",
            }}
          >
            — CHINNUA
          </p>
        </motion.div>

        {/* Caffeine footer */}
        <p
          style={{
            marginTop: "4rem",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.7rem",
            color: "rgba(245,230,211,0.18)",
          }}
        >
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(200,169,106,0.4)", textDecoration: "none" }}
          >
            caffeine.ai
          </a>
        </p>
      </section>
    </div>
  );
}
