import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Heart,
  Lock,
  LogOut,
  PenTool,
  RefreshCw,
  Scale,
  Shield,
  TrendingDown,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";

interface TermsSlideProps {
  onBack: () => void;
}

const sections: {
  icon: React.ReactNode;
  num: string;
  title: string;
  body: string;
}[] = [
  {
    icon: <Heart size={16} />,
    num: "1",
    title: "Acceptance of Terms",
    body: "By accessing or using CHINNUA POET, you agree to follow these Terms of Service. If you do not agree, please do not use the platform.",
  },
  {
    icon: <User size={16} />,
    num: "2",
    title: "User Accounts",
    body: "You must provide accurate information when creating an account. You are responsible for maintaining your login credentials. You are responsible for all activity under your account.\n\nWe reserve the right to suspend or terminate accounts that violate these terms.",
  },
  {
    icon: <PenTool size={16} />,
    num: "3",
    title: "User Content",
    body: "You retain ownership of the poetry, text, or content you create. By posting, you grant CHINNUA POET a non-exclusive license to display and share your content on the platform. You must not post content you do not own or have permission to use.",
  },
  {
    icon: <XCircle size={16} />,
    num: "4",
    title: "Prohibited Activities",
    body: "You agree NOT to:\n\n\u2022 Post harmful, abusive, or hateful content\n\u2022 Harass, threaten, or intimidate others\n\u2022 Upload spam, advertisements, or irrelevant material\n\u2022 Impersonate another person\n\u2022 Attempt to hack, disrupt, or misuse the platform",
  },
  {
    icon: <AlertTriangle size={16} />,
    num: "5",
    title: "Content Moderation",
    body: "CHINNUA POET reserves the right to:\n\n\u2022 Review, approve, or remove content\n\u2022 Suspend or ban users\n\u2022 Take action against reported content\n\nModeration decisions are made to protect the community.",
  },
  {
    icon: <Lock size={16} />,
    num: "6",
    title: "Privacy",
    body: "Your use of the platform is also governed by our Privacy Policy. We are committed to protecting your personal data.",
  },
  {
    icon: <TrendingDown size={16} />,
    num: "7",
    title: "Limitation of Liability",
    body: "CHINNUA POET is not responsible for:\n\n\u2022 User-generated content\n\u2022 Emotional or personal impact of content\n\u2022 Loss of data or service interruptions\n\nUse the platform at your own discretion.",
  },
  {
    icon: <RefreshCw size={16} />,
    num: "8",
    title: "Changes to Terms",
    body: "We may update these Terms at any time. Continued use means you accept the updated Terms.",
  },
  {
    icon: <LogOut size={16} />,
    num: "9",
    title: "Termination",
    body: "We reserve the right to suspend or terminate access if rules are violated.",
  },
  {
    icon: <BookOpen size={16} />,
    num: "10",
    title: "Final Note",
    body: "This platform exists for expression\u2014not harm.\nRespect it, and it will respect you.",
  },
];

export default function TermsSlide({ onBack }: TermsSlideProps) {
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
          data-ocid="terms.button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "none",
            border: "none",
            color: "#D4A853",
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
              color: "#8B6F47",
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
              color: "#3D2B1F",
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Scale size={22} /> Terms of Service
          </h2>
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              color: "#D4A853",
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
                  color: "#D4A853",
                  fontWeight: 600,
                  marginBottom: "0.6rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}
              >
                {s.icon} {s.num}. {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.88rem",
                  color: "#8B6F47",
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
              color: "#8B6F47",
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
