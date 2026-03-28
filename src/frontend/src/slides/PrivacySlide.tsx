import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface PrivacySlideProps {
  onBack: () => void;
}

const sections = [
  {
    emoji: "🌑",
    num: "1",
    title: "Information We Collect",
    body: "We may collect:\n\n• Name / Username\n• Email address\n• Profile information (bio, profile picture)\n• Content you post (poetry, comments, messages)\n• Usage data (interactions, activity)",
  },
  {
    emoji: "🔍",
    num: "2",
    title: "How We Use Your Information",
    body: "We use your data to:\n\n• Create and manage your account\n• Display your content on the platform\n• Improve user experience\n• Send notifications (likes, comments, messages)\n• Ensure platform safety and moderation",
  },
  {
    emoji: "🤝",
    num: "3",
    title: "Sharing of Information",
    body: "We do NOT sell your personal data.\n\nWe may share data only:\n\n• To comply with legal obligations\n• To protect platform security\n• With trusted service providers (hosting, authentication)",
  },
  {
    emoji: "🔒",
    num: "4",
    title: "Data Security",
    body: "We take reasonable steps to protect your information. However, no system is completely secure.",
  },
  {
    emoji: "📩",
    num: "5",
    title: "Email & Notifications",
    body: "You may receive:\n\n• Account-related emails\n• Notifications about activity\n\nYou can control these in your settings.",
  },
  {
    emoji: "🧾",
    num: "6",
    title: "Your Rights",
    body: "You have the right to:\n\n• Access your data\n• Edit your profile\n• Delete your account",
  },
  {
    emoji: "🗑️",
    num: "7",
    title: "Data Retention",
    body: "We keep your data as long as your account is active. Deleted accounts may have data removed permanently.",
  },
  {
    emoji: "👶",
    num: "8",
    title: "Age Requirement",
    body: "Users must be at least 13 years old to use this platform.",
  },
  {
    emoji: "🔄",
    num: "9",
    title: "Changes to Privacy Policy",
    body: "We may update this policy. Continued use means acceptance.",
  },
  {
    emoji: "🖤",
    num: "10",
    title: "Final Words",
    body: "Your words matter.\nYour privacy does too.\n\nWe protect both—with care.",
  },
];

export default function PrivacySlide({ onBack }: PrivacySlideProps) {
  return (
    <div
      className="slide-container"
      style={{ overflowY: "auto", paddingBottom: "4rem" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          data-ocid="privacy.button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "none",
            border: "none",
            color: "rgba(200,169,106,0.7)",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.82rem",
            cursor: "pointer",
            marginBottom: "2rem",
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> Back to Settings
        </button>

        {/* Title */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.72rem",
              color: "rgba(200,169,106,0.5)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Effective Date: 2026
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.6rem",
              color: "#F5E6D3",
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: "0.75rem",
            }}
          >
            🔐 Privacy Policy
          </h2>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(200,169,106,0.7)",
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
            }}
          >
            CHINNUA POET
          </p>
        </div>

        {/* Sections */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {sections.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.5 }}
              style={{
                background: "rgba(26,20,16,0.6)",
                border: "1px solid rgba(200,169,106,0.12)",
                borderRadius: 10,
                padding: "1.25rem 1.5rem",
                boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1rem",
                  color: "rgba(200,169,106,0.9)",
                  fontWeight: 600,
                  marginBottom: "0.6rem",
                }}
              >
                {s.emoji} {s.num}. {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.88rem",
                  color: "rgba(229,231,235,0.72)",
                  lineHeight: 1.85,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(200,169,106,0.15)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(200,169,106,0.6)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
            }}
          >
            "This platform is built on trust, expression,
            <br />
            and silence that finally found a voice."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
