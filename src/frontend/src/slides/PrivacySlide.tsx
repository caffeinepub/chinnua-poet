import {
  ArrowLeft,
  BookOpen,
  Database,
  Handshake,
  Heart,
  Lock,
  Mail,
  RefreshCw,
  ScrollText,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";

interface PrivacySlideProps {
  onBack: () => void;
}

const sections: {
  icon: React.ReactNode;
  num: string;
  title: string;
  body: string;
}[] = [
  {
    icon: <Database size={16} />,
    num: "1",
    title: "Information We Collect",
    body: "We may collect:\n\n\u2022 Name / Username\n\u2022 Email address\n\u2022 Profile information (bio, profile picture)\n\u2022 Content you post (poetry, comments, messages)\n\u2022 Usage data (interactions, activity)",
  },
  {
    icon: <Search size={16} />,
    num: "2",
    title: "How We Use Your Information",
    body: "We use your data to:\n\n\u2022 Create and manage your account\n\u2022 Display your content on the platform\n\u2022 Improve user experience\n\u2022 Send notifications (likes, comments, messages)\n\u2022 Ensure platform safety and moderation",
  },
  {
    icon: <Handshake size={16} />,
    num: "3",
    title: "Sharing of Information",
    body: "We do NOT sell your personal data.\n\nWe may share data only:\n\n\u2022 To comply with legal obligations\n\u2022 To protect platform security\n\u2022 With trusted service providers (hosting, authentication)",
  },
  {
    icon: <Lock size={16} />,
    num: "4",
    title: "Data Security",
    body: "We take reasonable steps to protect your information. However, no system is completely secure.",
  },
  {
    icon: <Mail size={16} />,
    num: "5",
    title: "Email & Notifications",
    body: "You may receive:\n\n\u2022 Account-related emails\n\u2022 Notifications about activity\n\nYou can control these in your settings.",
  },
  {
    icon: <ScrollText size={16} />,
    num: "6",
    title: "Your Rights",
    body: "You have the right to:\n\n\u2022 Access your data\n\u2022 Edit your profile\n\u2022 Delete your account",
  },
  {
    icon: <Trash2 size={16} />,
    num: "7",
    title: "Data Retention",
    body: "We keep your data as long as your account is active. Deleted accounts may have data removed permanently.",
  },
  {
    icon: <UserCheck size={16} />,
    num: "8",
    title: "Age Requirement",
    body: "Users must be at least 13 years old to use this platform.",
  },
  {
    icon: <RefreshCw size={16} />,
    num: "9",
    title: "Changes to Privacy Policy",
    body: "We may update this policy. Continued use means acceptance.",
  },
  {
    icon: <BookOpen size={16} />,
    num: "10",
    title: "Final Words",
    body: "Your words matter.\nYour privacy does too.\n\nWe protect both\u2014with care.",
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
            <Shield size={22} /> Privacy Policy
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
