import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import EmojiPicker from "../components/EmojiPicker";
import OnlineDot from "../components/OnlineDot";
import { AI_BOTS } from "../data/ai-bots";
import {
  generateAIImage,
  speakText,
  useAISettings,
} from "../hooks/useAISettings";
import { useActor } from "../hooks/useActor";
import { isOnline, updatePresence } from "../utils/presence";
import InboxSlide from "./InboxSlide";

const WARM_BG = "#FFF0F5";
const _MSG_OWN_BG = "#F5ECD7";
const _MSG_OTHER_BG = "#FDE8ED";
const WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";
const WARM_MUTED = "rgba(92,61,46,0.5)";

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

type CallState = "idle" | "calling" | "receiving" | "active";
type CallType = "voice" | "video";
type MsgSection = "messages" | "inbox";

interface PendingSignal {
  id: string;
  from: string;
  type: "offer" | "answer" | "iceCandidate" | "hangup";
  data: string;
  timestamp: number;
}

function getUserAvatar(username: string): string | null {
  try {
    const p = localStorage.getItem(`chinnua_profile_${username}`);
    if (p) return JSON.parse(p)?.photo ?? null;
  } catch {}
  return null;
}

function AvatarBubble({
  username,
  size = 32,
}: { username: string; size?: number }) {
  const photo = getUserAvatar(username);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          username === "CHINNUA_POET"
            ? "rgba(212,168,83,0.2)"
            : "rgba(139,111,71,0.15)",
        border:
          username === "CHINNUA_POET"
            ? "1px solid rgba(212,168,83,0.5)"
            : `1px solid ${WARM_BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.34,
        fontWeight: 700,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt={username}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span
          style={{
            color: username === "CHINNUA_POET" ? WARM_GOLD : WARM_BROWN,
          }}
        >
          {username.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function pushSignal(toUsername: string, signal: PendingSignal) {
  const key = `webrtc_signals_${toUsername}`;
  const existing: PendingSignal[] = JSON.parse(
    localStorage.getItem(key) || "[]",
  );
  existing.push(signal);
  localStorage.setItem(key, JSON.stringify(existing));
}

function consumeSignals(myUsername: string): PendingSignal[] {
  const key = `webrtc_signals_${myUsername}`;
  const signals: PendingSignal[] = JSON.parse(
    localStorage.getItem(key) || "[]",
  );
  localStorage.removeItem(key);
  return signals;
}

// ── Inline SVG icon components ──────────────────────────────────────
function SvgMailIcon({
  size = 18,
  color = WARM_GOLD,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,4 12,13 2,4" />
    </svg>
  );
}

function SvgMessageCircleIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SvgInboxIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function SvgUsersIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SvgBellIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SvgShieldIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SvgFeatherIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

function SvgPaperclipIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SvgMusicIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function SvgImageIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function SvgCameraIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function SvgSmileIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 13s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function SvgMusicNoteIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

// Phone SVG icon
function PhoneIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Phone"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.59 4.18 2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function VideoIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Video"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function MicIcon({ muted, size = 16 }: { muted: boolean; size?: number }) {
  const color = muted ? "#ef4444" : WARM_BROWN;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Microphone"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

interface StoredUser {
  username: string;
  emailOrPhone: string;
  password: string;
  bio: string;
  createdAt: string;
}

interface LoginGateUser {
  username: string;
  bio?: string;
  createdAt: string;
}

function MessagesLoginGate({
  onJoin,
  onLogin,
}: {
  onJoin: () => void;
  onLogin?: ((user: LoginGateUser) => void) | (() => void);
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ep = emailOrPhone.trim();
    const pw = password.trim();

    if (!ep || !pw) {
      setError("Please fill in all required fields.");
      return;
    }

    let users: StoredUser[] = [];
    try {
      users = JSON.parse(localStorage.getItem("chinnua_users") || "[]");
    } catch {}

    if (mode === "login") {
      const found = users.find(
        (u) => u.emailOrPhone === ep && u.password === pw,
      );
      if (!found) {
        setError("Incorrect email/phone or password.");
        return;
      }
      const loggedIn: LoginGateUser = {
        username: found.username,
        bio: found.bio || "",
        createdAt: found.createdAt,
      };
      localStorage.setItem("chinnua_user", JSON.stringify(loggedIn));
      if (onLogin) (onLogin as (u: LoginGateUser) => void)(loggedIn);
    } else {
      const un = username.trim();
      if (!un) {
        setError("Please choose a username.");
        return;
      }
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(un)) {
        setError("Username: 3–20 chars, letters/numbers/underscore.");
        return;
      }
      if (pw.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (pw !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (users.find((u) => u.username.toLowerCase() === un.toLowerCase())) {
        setError("Username already taken.");
        return;
      }
      if (users.find((u) => u.emailOrPhone === ep)) {
        setError("Account already exists for this email/phone.");
        return;
      }
      const now = new Date().toISOString();
      const newUser: StoredUser = {
        username: un,
        emailOrPhone: ep,
        password: pw,
        bio: "",
        createdAt: now,
      };
      users.push(newUser);
      localStorage.setItem("chinnua_users", JSON.stringify(users));
      const loggedIn: LoginGateUser = { username: un, bio: "", createdAt: now };
      localStorage.setItem("chinnua_user", JSON.stringify(loggedIn));
      if (onLogin) (onLogin as (u: LoginGateUser) => void)(loggedIn);
    }
  };

  const inputSt: React.CSSProperties = {
    background: "rgba(255,248,238,0.95)",
    border: "1px solid rgba(200,169,106,0.3)",
    borderRadius: 8,
    padding: "0.65rem 1rem",
    color: "#3D2B1F",
    fontFamily: "'Libre Baskerville', Georgia, serif",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      className="slide-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFF8EE",
        padding: "2rem 1rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "#FFFDF9",
          border: "1px solid rgba(200,169,106,0.3)",
          borderRadius: 16,
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 8px 32px rgba(92,61,46,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SvgMailIcon size={36} color="#D4A853" />
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#3D2B1F",
              margin: "0 0 0.4rem",
            }}
          >
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.85rem",
              color: "rgba(92,61,46,0.6)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {mode === "login"
              ? "Sign in to access your messages"
              : "Join to start sending messages"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => {
              setEmailOrPhone(e.target.value);
              setError("");
            }}
            placeholder="Email or phone number"
            autoComplete="username"
            style={inputSt}
          />
          {mode === "signup" && (
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Choose a username (3–20 chars)"
              style={inputSt}
            />
          )}
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              style={{ ...inputSt, paddingRight: "2.75rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#8B6F47",
                padding: 0,
              }}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          {mode === "signup" && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="Confirm password"
              autoComplete="new-password"
              style={inputSt}
            />
          )}
          {error && (
            <p
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.8rem",
                color: "#e53e3e",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #D4A853, #8B6F47)",
              border: "none",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              color: "#3D2B1F",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: "0.25rem",
            }}
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
            marginTop: "1.25rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setEmailOrPhone("");
              setUsername("");
              setPassword("");
              setConfirmPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.82rem",
              color: "#D4A853",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {mode === "login"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
          <button
            type="button"
            onClick={onJoin}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.78rem",
              color: "rgba(92,61,46,0.5)",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            or join as a new member
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function MessagesSlide({
  currentUser,
  onJoin,
  onLogin,
}: {
  currentUser: User | null;
  onJoin: () => void;
  onLogin?:
    | ((user: { username: string; bio?: string; createdAt: string }) => void)
    | (() => void);
}) {
  const { actor } = useActor();
  const [msgGateCleared, setMsgGateCleared] = useState<boolean>(() => {
    return localStorage.getItem("chinnua_user") !== null;
  });
  const [section, setSection] = useState<MsgSection>("messages");
  const [conversations, setConversations] = useState<string[]>([
    "CHINNUA_POET",
  ]);
  const [activeConv, setActiveConv] = useState(() => {
    const openUser = sessionStorage.getItem("chinnua_open_user_chat");
    if (openUser) return openUser;
    return "CHINNUA_POET";
  });
  const [msgTab, setMsgTab] = useState<"inbox" | "requests">("inbox");
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("chinnua_blocked_users") || "[]");
    } catch {
      return [];
    }
  });
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [text, setText] = useState("");
  const aiSettings = useAISettings();
  const [aiAttachedImage, setAiAttachedImage] = useState<string | null>(null);
  const [generatingAiImage, setGeneratingAiImage] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Handle open-user-chat from sessionStorage (set by Notifications/Explore)
  useEffect(() => {
    const openUser = sessionStorage.getItem("chinnua_open_user_chat");
    if (openUser) {
      sessionStorage.removeItem("chinnua_open_user_chat");
      setConversations((prev) => {
        if (!prev.includes(openUser)) return [openUser, ...prev];
        return prev;
      });
      setActiveConv(openUser);
    }
    // Also listen for openChat custom event
    const handleOpenChat = (e: Event) => {
      const username = (e as CustomEvent).detail?.username;
      if (username) {
        localStorage.removeItem("chinnua_open_chat_user");
        setConversations((prev) => {
          if (!prev.includes(username)) return [username, ...prev];
          return prev;
        });
        setActiveConv(username);
      }
    };
    window.addEventListener("openChat", handleOpenChat);
    return () => window.removeEventListener("openChat", handleOpenChat);
  }, []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSpotifyInput, setShowSpotifyInput] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [newConvInput, setNewConvInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [callState, setCallState] = useState<CallState>("idle");
  const [callType, setCallType] = useState<CallType>("voice");
  const [callPeer, setCallPeer] = useState<string | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const backendPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load localStorage messages on mount
  useEffect(() => {
    const stored: Record<string, Message[]> = JSON.parse(
      localStorage.getItem("chinnua_messages") || "{}",
    );
    setMessages(stored);
    const keys = Object.keys(stored).filter((k) => k !== "CHINNUA_POET");
    setConversations(["CHINNUA_POET", ...keys]);
  }, []);

  // Load + poll backend messages for active conversation
  useEffect(() => {
    if (!actor || !currentUser) return;

    const loadConv = async () => {
      try {
        const backendMsgs = await (actor as any).getConversationByUsername(
          currentUser.username,
          activeConv,
        );
        if (backendMsgs.length === 0) return;

        const mapped: Message[] = backendMsgs.map((m) => ({
          id: m.id.toString(),
          from: m.fromUsername,
          text: m.text,
          timestamp: new Date(Number(m.timestamp / 1_000_000n)).toISOString(),
        }));

        setMessages((prev) => {
          const existing = prev[activeConv] ?? [];
          const existingIds = new Set(existing.map((m) => m.id));
          const newOnes = mapped.filter((m) => !existingIds.has(m.id));
          if (newOnes.length === 0) return prev;
          const merged = [...existing, ...newOnes].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );
          const updated = { ...prev, [activeConv]: merged };
          localStorage.setItem("chinnua_messages", JSON.stringify(updated));
          // Notify App of new incoming messages
          if (newOnes.some((m) => m.from !== currentUser?.username)) {
            window.dispatchEvent(
              new CustomEvent("newMessage", { detail: { from: activeConv } }),
            );
          }
          return updated;
        });

        // Ensure conversation appears in list
        setConversations((prev) =>
          prev.includes(activeConv)
            ? prev
            : [
                "CHINNUA_POET",
                activeConv,
                ...prev.filter((c) => c !== "CHINNUA_POET" && c !== activeConv),
              ],
        );

        // Mark messages as read
        for (const m of backendMsgs) {
          if (!m.read && m.toUsername === currentUser.username) {
            (actor as any).markDirectMessageRead(m.id).catch(() => {});
          }
        }
      } catch {}
    };

    loadConv();
    backendPollRef.current = setInterval(loadConv, 5000);
    return () => {
      if (backendPollRef.current) clearInterval(backendPollRef.current);
    };
  }, [actor, currentUser, activeConv]);

  // Also load all conversations from backend to populate sidebar
  useEffect(() => {
    if (!actor || !currentUser) return;
    const loadAll = async () => {
      try {
        const all = await (actor as any).getMessagesForUser(
          currentUser.username,
        );
        const peers = new Set<string>();
        for (const m of all) {
          const other =
            m.fromUsername === currentUser.username
              ? m.toUsername
              : m.fromUsername;
          peers.add(other);
        }
        setConversations((prev) => {
          const combined = [
            "CHINNUA_POET",
            ...Array.from(peers).filter((p) => p !== "CHINNUA_POET"),
            ...prev.filter((p) => p !== "CHINNUA_POET" && !peers.has(p)),
          ];
          return [...new Set(combined)];
        });
      } catch {}
    };
    loadAll();
  }, [actor, currentUser]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConv]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });
    pc.onicecandidate = (e) => {
      if (e.candidate && callPeer && currentUser) {
        pushSignal(callPeer, {
          id: `sig_${Date.now()}_${Math.random()}`,
          from: currentUser.username,
          type: "iceCandidate",
          data: JSON.stringify(e.candidate),
          timestamp: Date.now(),
        });
      }
    };
    pc.ontrack = (e) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = e.streams[0];
    };
    return pc;
  }, [callPeer, currentUser]);

  const stopCall = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getTracks()) t.stop();
      localStreamRef.current = null;
    }
    pcRef.current?.close();
    pcRef.current = null;
    pendingCandidatesRef.current = [];
    setCallState("idle");
    setCallPeer(null);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const poll = () => {
      if (!currentUser) return;
      const signals = consumeSignals(currentUser.username);
      for (const sig of signals) handleIncomingSignal(sig);
    };
    pollingRef.current = setInterval(poll, 1500);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [currentUser]); // eslint-disable-line

  const handleIncomingSignal = async (sig: PendingSignal) => {
    if (sig.type === "offer" && callState === "idle") {
      setCallPeer(sig.from);
      setCallState("receiving");
      localStorage.setItem(`webrtc_pending_offer_${sig.from}`, sig.data);
      return;
    }
    if (sig.type === "hangup") {
      stopCall();
      return;
    }
    if (sig.type === "answer" && pcRef.current) {
      const answer = JSON.parse(sig.data);
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      for (const c of pendingCandidatesRef.current)
        await pcRef.current.addIceCandidate(c).catch(() => {});
      pendingCandidatesRef.current = [];
      setCallState("active");
      return;
    }
    if (sig.type === "iceCandidate" && pcRef.current) {
      const cand = new RTCIceCandidate(JSON.parse(sig.data));
      if (pcRef.current.remoteDescription)
        await pcRef.current.addIceCandidate(cand).catch(() => {});
      else pendingCandidatesRef.current.push(cand);
    }
  };

  const startCall = async (peer: string, type: CallType) => {
    if (!currentUser) return;
    setCallPeer(peer);
    setCallType(type);
    setCallState("calling");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      const pc = createPeerConnection();
      pcRef.current = pc;
      for (const track of stream.getTracks()) pc.addTrack(track, stream);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      pushSignal(peer, {
        id: `sig_${Date.now()}`,
        from: currentUser.username,
        type: "offer",
        data: JSON.stringify(offer),
        timestamp: Date.now(),
      });
    } catch {
      stopCall();
    }
  };

  const acceptCall = async () => {
    if (!currentUser || !callPeer) return;
    const offerData = localStorage.getItem(`webrtc_pending_offer_${callPeer}`);
    if (!offerData) return;
    localStorage.removeItem(`webrtc_pending_offer_${callPeer}`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      const pc = createPeerConnection();
      pcRef.current = pc;
      for (const track of stream.getTracks()) pc.addTrack(track, stream);
      const offer = JSON.parse(offerData);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      for (const c of pendingCandidatesRef.current)
        await pc.addIceCandidate(c).catch(() => {});
      pendingCandidatesRef.current = [];
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      pushSignal(callPeer, {
        id: `sig_${Date.now()}`,
        from: currentUser.username,
        type: "answer",
        data: JSON.stringify(answer),
        timestamp: Date.now(),
      });
      setCallState("active");
    } catch {
      stopCall();
    }
  };

  const declineCall = () => {
    if (callPeer && currentUser) {
      pushSignal(callPeer, {
        id: `sig_${Date.now()}`,
        from: currentUser.username,
        type: "hangup",
        data: "",
        timestamp: Date.now(),
      });
      localStorage.removeItem(`webrtc_pending_offer_${callPeer}`);
    }
    stopCall();
  };

  const hangUp = () => {
    if (callPeer && currentUser) {
      pushSignal(callPeer, {
        id: `sig_${Date.now()}`,
        from: currentUser.username,
        type: "hangup",
        data: "",
        timestamp: Date.now(),
      });
    }
    stopCall();
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getAudioTracks())
        t.enabled = !t.enabled;
      setMicMuted((m) => !m);
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getVideoTracks())
        t.enabled = !t.enabled;
      setCamOff((c) => !c);
    }
  };

  const handleBlock = (username: string) => {
    const updated = [...blockedUsers, username];
    setBlockedUsers(updated);
    localStorage.setItem("chinnua_blocked_users", JSON.stringify(updated));
    setConversations((prev) => prev.filter((c) => c !== username));
    if (activeConv === username) setActiveConv("CHINNUA_POET");
  };

  const sendMessage = async () => {
    if (!currentUser || !text.trim()) return;
    updatePresence(currentUser.username);
    const msg: Message = {
      id: `msg_${Date.now()}`,
      from: currentUser.username,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    // Save locally
    const stored: Record<string, Message[]> = JSON.parse(
      localStorage.getItem("chinnua_messages") || "{}",
    );
    stored[activeConv] = [...(stored[activeConv] ?? []), msg];
    localStorage.setItem("chinnua_messages", JSON.stringify(stored));
    setMessages({ ...stored });
    setText("");
    if (activeConv !== "CHINNUA_POET" && !conversations.includes(activeConv)) {
      setConversations((prev) => [...prev, activeConv]);
    }
    // Also send to backend so recipient sees it
    if (actor) {
      try {
        await (actor as any).sendDirectMessage(
          currentUser.username,
          activeConv,
          msg.text,
        );
      } catch {}
    }
  };

  if (!msgGateCleared) {
    return (
      <MessagesLoginGate
        onJoin={onJoin}
        onLogin={(user) => {
          setMsgGateCleared(true);
          if (onLogin) (onLogin as (u: typeof user) => void)(user);
        }}
      />
    );
  }

  const currentMessages = messages[activeConv] ?? [];
  const currentUserName = currentUser?.username ?? "";

  return (
    <div className="slide-container" style={{ background: WARM_BG }}>
      {/* Section tab bar */}
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
        {(["messages", "inbox"] as MsgSection[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            data-ocid={`messages.${s}.tab`}
            style={{
              background:
                section === s ? "rgba(212,168,83,0.12)" : "transparent",
              border: "none",
              borderBottom:
                section === s
                  ? `2px solid ${WARM_GOLD}`
                  : "2px solid transparent",
              color: section === s ? WARM_MOCHA : WARM_BROWN,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              padding: "0.75rem 2rem",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              {s === "messages" ? (
                <SvgMessageCircleIcon
                  size={15}
                  color={section === s ? "#5C3D2E" : "#8B6F47"}
                />
              ) : (
                <SvgInboxIcon
                  size={15}
                  color={section === s ? "#5C3D2E" : "#8B6F47"}
                />
              )}
              {s === "messages" ? "Messages" : "Inbox"}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {section === "inbox" ? (
          <motion.div
            key="inbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InboxSlide currentUser={currentUser} onLogin={() => {}} />
          </motion.div>
        ) : (
          <motion.div
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Incoming call overlay */}
            <AnimatePresence>
              {callState === "receiving" && callPeer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(92,61,46,0.6)",
                    backdropFilter: "blur(8px)",
                    zIndex: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      background: WARM_PAPER,
                      border: `1px solid ${WARM_BORDER}`,
                      borderRadius: 16,
                      padding: "2.5rem 3rem",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "1.25rem",
                      boxShadow: "0 20px 60px rgba(92,61,46,0.2)",
                    }}
                    data-ocid="messages.dialog"
                  >
                    <AvatarBubble username={callPeer} size={64} />
                    <div>
                      <p
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.25rem",
                          color: WARM_MOCHA,
                          margin: 0,
                        }}
                      >
                        {callPeer}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.8rem",
                          color: WARM_MUTED,
                          margin: "0.3rem 0 0",
                          fontStyle: "italic",
                        }}
                      >
                        {callType === "video"
                          ? "Incoming video call"
                          : "Incoming voice call"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        type="button"
                        onClick={acceptCall}
                        data-ocid="messages.confirm_button"
                        style={{
                          background: "#22c55e",
                          border: "none",
                          borderRadius: 10,
                          padding: "0.6rem 1.4rem",
                          color: "#3D2B1F",
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={declineCall}
                        data-ocid="messages.cancel_button"
                        style={{
                          background: "#ef4444",
                          border: "none",
                          borderRadius: 10,
                          padding: "0.6rem 1.4rem",
                          color: "#3D2B1F",
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active call overlay */}
            <AnimatePresence>
              {(callState === "calling" || callState === "active") &&
                callPeer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "#1a0f0a",
                      zIndex: 200,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    data-ocid="messages.modal"
                  >
                    <div
                      style={{
                        flex: 1,
                        width: "100%",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {callType === "video" ? (
                        <video
                          ref={remoteVideoRef}
                          autoPlay
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            background: "#111",
                          }}
                        >
                          <track kind="captions" />
                        </video>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1.5rem",
                          }}
                        >
                          <AvatarBubble username={callPeer} size={96} />
                          <p
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontSize: "1.5rem",
                              color: "#3D2B1F",
                            }}
                          >
                            {callPeer}
                          </p>
                          <p
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              color: WARM_MUTED,
                              fontStyle: "italic",
                            }}
                          >
                            {callState === "calling"
                              ? "Calling..."
                              : "Call connected"}
                          </p>
                        </div>
                      )}
                      {callType === "video" && (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                            width: 120,
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: `1px solid ${WARM_BORDER}`,
                            background: "#111",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1.25rem",
                        padding: "1.5rem 2rem",
                        background: "rgba(26,15,10,0.95)",
                        width: "100%",
                        justifyContent: "center",
                        borderTop: `1px solid ${WARM_BORDER}`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={toggleMic}
                        title={micMuted ? "Unmute" : "Mute"}
                        style={{
                          background: micMuted
                            ? "rgba(239,68,68,0.2)"
                            : "rgba(212,168,83,0.15)",
                          border: `1px solid ${micMuted ? "rgba(239,68,68,0.4)" : WARM_BORDER}`,
                          borderRadius: "50%",
                          width: 52,
                          height: 52,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MicIcon muted={micMuted} size={18} />
                      </button>
                      {callType === "video" && (
                        <button
                          type="button"
                          onClick={toggleCam}
                          title={camOff ? "Camera on" : "Camera off"}
                          style={{
                            background: camOff
                              ? "rgba(239,68,68,0.2)"
                              : "rgba(212,168,83,0.15)",
                            border: `1px solid ${camOff ? "rgba(239,68,68,0.4)" : WARM_BORDER}`,
                            borderRadius: "50%",
                            width: 52,
                            height: 52,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <VideoIcon
                            size={18}
                            color={camOff ? "#ef4444" : WARM_BROWN}
                          />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={hangUp}
                        data-ocid="messages.close_button"
                        style={{
                          background: "#ef4444",
                          border: "none",
                          borderRadius: "50%",
                          width: 52,
                          height: 52,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#3D2B1F",
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        End
                      </button>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            <div
              style={{
                display: "flex",
                height: "calc(100vh - 52px)",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              {/* Conversation list */}
              <div
                style={{
                  width: 200,
                  borderRight: `1px solid ${WARM_BORDER}`,
                  padding: "1rem 0.75rem",
                  flexShrink: 0,
                  overflowY: "auto",
                  background: "rgba(245,236,215,0.5)",
                }}
              >
                {/* New conversation search */}
                <div
                  style={{
                    marginBottom: "0.6rem",
                    display: "flex",
                    gap: "0.25rem",
                  }}
                >
                  <input
                    value={newConvInput}
                    onChange={(e) => setNewConvInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newConvInput.trim()) {
                        const uname = newConvInput.trim();
                        if (!conversations.includes(uname)) {
                          setConversations((prev) => [...prev, uname]);
                        }
                        setActiveConv(uname);
                        setNewConvInput("");
                      }
                    }}
                    placeholder="Message a user..."
                    data-ocid="messages.search_input"
                    style={{
                      flex: 1,
                      background: "rgba(255,248,238,0.9)",
                      border: `1px solid ${WARM_BORDER}`,
                      borderRadius: 6,
                      padding: "0.3rem 0.5rem",
                      fontSize: "0.7rem",
                      color: WARM_TEXT,
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    data-ocid="messages.secondary_button"
                    onClick={() => {
                      const uname = newConvInput.trim();
                      if (uname) {
                        if (!conversations.includes(uname)) {
                          setConversations((prev) => [...prev, uname]);
                        }
                        setActiveConv(uname);
                        setNewConvInput("");
                      }
                    }}
                    style={{
                      background: "rgba(212,168,83,0.15)",
                      border: `1px solid ${WARM_BORDER}`,
                      borderRadius: 6,
                      padding: "0.3rem 0.5rem",
                      cursor: "pointer",
                      color: WARM_MOCHA,
                      fontSize: "0.7rem",
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                    }}
                  >
                    +
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {["inbox", "requests"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMsgTab(t as "inbox" | "requests")}
                      data-ocid="messages.tab"
                      style={{
                        flex: 1,
                        background:
                          msgTab === t
                            ? "rgba(212,168,83,0.15)"
                            : "transparent",
                        border:
                          msgTab === t
                            ? "1px solid rgba(212,168,83,0.4)"
                            : `1px solid ${WARM_BORDER}`,
                        borderRadius: 6,
                        padding: "0.3rem",
                        color: msgTab === t ? WARM_MOCHA : WARM_BROWN,
                        fontSize: "0.65rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          justifyContent: "center",
                        }}
                      >
                        {t === "inbox" ? (
                          <SvgUsersIcon
                            size={12}
                            color={msgTab === t ? "#5C3D2E" : "#8B6F47"}
                          />
                        ) : (
                          <SvgBellIcon
                            size={12}
                            color={msgTab === t ? "#5C3D2E" : "#8B6F47"}
                          />
                        )}
                        {t === "inbox" ? "Chats" : "Requests"}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Backend notice */}
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.6rem",
                    color: WARM_GOLD,
                    fontStyle: "italic",
                    marginBottom: "0.75rem",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      justifyContent: "center",
                    }}
                  >
                    <SvgShieldIcon size={11} color="#D4A853" />
                    Messages are saved to the platform
                  </span>
                </p>

                {/* All Users quick-start section */}
                {msgTab === "inbox" &&
                  (() => {
                    let allStoredUsers: { username: string }[] = [];
                    try {
                      allStoredUsers = JSON.parse(
                        localStorage.getItem("chinnua_users") || "[]",
                      );
                    } catch {}
                    const botUsernames = AI_BOTS.map((b) => b.username);
                    const realUsernames = allStoredUsers.map((u) => u.username);
                    const allUsernames = [
                      ...new Set([...botUsernames, ...realUsernames]),
                    ].filter(
                      (u) =>
                        u !== currentUser?.username &&
                        !conversations.includes(u),
                    );
                    if (allUsernames.length === 0) return null;
                    return (
                      <div style={{ marginBottom: "0.75rem" }}>
                        <p
                          style={{
                            fontFamily: "'Lora', Georgia, serif",
                            fontSize: "0.58rem",
                            color: WARM_BROWN,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: "0.4rem",
                            paddingLeft: "0.25rem",
                          }}
                        >
                          All Users
                        </p>
                        {allUsernames.slice(0, 8).map((uname) => {
                          const bot = AI_BOTS.find((b) => b.username === uname);
                          const displayName = bot?.displayName ?? uname;
                          const online = isOnline(uname);
                          return (
                            <button
                              key={uname}
                              type="button"
                              onClick={() => {
                                setConversations((prev) =>
                                  prev.includes(uname)
                                    ? prev
                                    : [uname, ...prev],
                                );
                                setActiveConv(uname);
                              }}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                padding: "0.45rem 0.6rem",
                                borderRadius: 7,
                                background: "transparent",
                                border: "1px solid transparent",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                marginBottom: "0.15rem",
                                transition: "background 0.15s",
                              }}
                              onMouseEnter={(e) => {
                                (
                                  e.currentTarget as HTMLButtonElement
                                ).style.background = "rgba(212,168,83,0.08)";
                              }}
                              onMouseLeave={(e) => {
                                (
                                  e.currentTarget as HTMLButtonElement
                                ).style.background = "transparent";
                              }}
                            >
                              <div
                                style={{ position: "relative", flexShrink: 0 }}
                              >
                                <div
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                    background: "rgba(139,111,71,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    color: WARM_BROWN,
                                    overflow: "hidden",
                                  }}
                                >
                                  {bot?.photo ? (
                                    <img
                                      src={bot.photo}
                                      alt={uname}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    uname.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <span
                                  style={{
                                    position: "absolute",
                                    bottom: -1,
                                    right: -1,
                                  }}
                                >
                                  <OnlineDot username={uname} size={7} />
                                </span>
                              </div>
                              <span
                                style={{
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.7rem",
                                  color: online ? WARM_MOCHA : WARM_BROWN,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flex: 1,
                                }}
                              >
                                {displayName}
                              </span>
                            </button>
                          );
                        })}
                        <div
                          style={{
                            height: 1,
                            background: WARM_BORDER,
                            margin: "0.5rem 0",
                          }}
                        />
                      </div>
                    );
                  })()}

                {msgTab === "inbox" ? (
                  conversations
                    .filter((c) => !blockedUsers.includes(c))
                    .map((conv) => (
                      <div
                        key={conv}
                        style={{
                          position: "relative",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <button
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
                                ? "rgba(212,168,83,0.15)"
                                : "transparent",
                            border:
                              activeConv === conv
                                ? "1px solid rgba(212,168,83,0.3)"
                                : "1px solid transparent",
                            color:
                              activeConv === conv ? WARM_MOCHA : WARM_BROWN,
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            paddingRight: "2rem",
                          }}
                        >
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <AvatarBubble username={conv} size={26} />
                            <span
                              style={{
                                position: "absolute",
                                bottom: -1,
                                right: -1,
                              }}
                            >
                              <OnlineDot username={conv} size={8} />
                            </span>
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
                        {conv !== "CHINNUA_POET" && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Block ${conv}?`)) handleBlock(conv);
                            }}
                            title="Block user"
                            data-ocid="messages.delete_button"
                            style={{
                              position: "absolute",
                              right: 4,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "rgba(220,80,80,0.6)",
                              fontSize: "0.75rem",
                              padding: "0.2rem",
                            }}
                          >
                            x
                          </button>
                        )}
                      </div>
                    ))
                ) : (
                  <div
                    style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}
                  >
                    <p
                      style={{
                        color: WARM_MUTED,
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "0.78rem",
                      }}
                    >
                      No message requests
                    </p>
                    <p
                      style={{
                        color: WARM_MUTED,
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.68rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      Messages from restricted users appear here
                    </p>
                  </div>
                )}
              </div>

              {/* Chat area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  overflow: "hidden",
                  background: WARM_BG,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    borderBottom: `1px solid ${WARM_BORDER}`,
                    paddingBottom: "0.75rem",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: WARM_MOCHA,
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <SvgMessageCircleIcon size={15} color={WARM_GOLD} />
                      {activeConv === "CHINNUA_POET"
                        ? "CHINNUA_POET"
                        : activeConv}
                    </h3>
                    {activeConv === "CHINNUA_POET" && (
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.72rem",
                          color: WARM_MUTED,
                          margin: 0,
                        }}
                      >
                        Send a message to the poet
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => startCall(activeConv, "voice")}
                      title="Voice call"
                      data-ocid="messages.secondary_button"
                      style={{
                        background: "rgba(212,168,83,0.08)",
                        border: `1px solid ${WARM_BORDER}`,
                        borderRadius: 8,
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <PhoneIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => startCall(activeConv, "video")}
                      title="Video call"
                      data-ocid="messages.secondary_button"
                      style={{
                        background: "rgba(212,168,83,0.08)",
                        border: `1px solid ${WARM_BORDER}`,
                        borderRadius: 8,
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <VideoIcon size={14} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                {/* Screenshot warning */}
                <div
                  style={{
                    padding: "0.4rem 0.75rem",
                    background: "rgba(212,168,83,0.1)",
                    borderBottom: "1px solid rgba(212,168,83,0.2)",
                    fontSize: "0.7rem",
                    color: WARM_BROWN,
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      justifyContent: "center",
                    }}
                  >
                    <SvgShieldIcon size={12} color="#8B6F47" />
                    Screenshots are not permitted. This conversation is private.
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    paddingBottom: "0.5rem",
                    position: "relative",
                  }}
                >
                  {/* Watermark */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      zIndex: 0,
                      opacity: 0.04,
                      userSelect: "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "1.4rem",
                        color: WARM_MOCHA,
                        transform: "rotate(-30deg)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      CHINNUA_POET — Private
                    </span>
                  </div>
                  {currentMessages.length === 0 && (
                    <p
                      style={{
                        textAlign: "center",
                        color: WARM_MUTED,
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.85rem",
                        marginTop: "2rem",
                        fontStyle: "italic",
                      }}
                      data-ocid="messages.empty_state"
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          justifyContent: "center",
                        }}
                      >
                        <SvgFeatherIcon size={16} color="#8B6F47" /> No messages
                        yet. Write something...
                      </span>
                    </p>
                  )}
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf:
                          msg.from === currentUserName
                            ? "flex-end"
                            : "flex-start",
                        maxWidth: "70%",
                        padding: "0.6rem 1rem",
                        borderRadius: 12,
                        background:
                          msg.from === currentUserName
                            ? "rgba(212,168,83,0.2)"
                            : "#FFE4EC",
                        border: `1px solid ${
                          msg.from === currentUserName
                            ? "rgba(212,168,83,0.3)"
                            : WARM_BORDER
                        }`,
                      }}
                    >
                      {(() => {
                        const t = msg.text;
                        if (t.startsWith("[File: ")) {
                          const name = t.slice(7, -1);
                          return (
                            <p
                              style={{
                                color: WARM_TEXT,
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                                fontSize: "0.88rem",
                                margin: 0,
                              }}
                            >
                              📎 {name}
                            </p>
                          );
                        }
                        if (t.startsWith("[Audio: ")) {
                          const name = t.slice(8, -1);
                          return (
                            <p
                              style={{
                                color: WARM_TEXT,
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                                fontSize: "0.88rem",
                                margin: 0,
                              }}
                            >
                              🎵 {name}
                            </p>
                          );
                        }
                        if (t.startsWith("[Photo:data:")) {
                          const b64 = t.slice(7, -1);
                          return (
                            <img
                              src={b64}
                              alt="Shared"
                              style={{
                                maxWidth: 140,
                                maxHeight: 140,
                                borderRadius: 6,
                                display: "block",
                              }}
                            />
                          );
                        }
                        if (t.startsWith("[Photo: ")) {
                          const name = t.slice(8, -1);
                          return (
                            <p
                              style={{
                                color: WARM_TEXT,
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                                fontSize: "0.88rem",
                                margin: 0,
                              }}
                            >
                              🖼️ {name}
                            </p>
                          );
                        }
                        if (t.startsWith("[Spotify: ")) {
                          const url = t.slice(10, -1);
                          return (
                            <div
                              style={{
                                background: "rgba(29,185,84,0.08)",
                                border: "1px solid rgba(29,185,84,0.25)",
                                borderRadius: 8,
                                padding: "0.5rem 0.75rem",
                              }}
                            >
                              <p
                                style={{
                                  color: WARM_TEXT,
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.8rem",
                                  margin: "0 0 0.3rem",
                                  fontWeight: 600,
                                }}
                              >
                                🎵 Spotify Track
                              </p>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "rgba(29,185,84,0.9)",
                                  fontSize: "0.75rem",
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                }}
                              >
                                Listen on Spotify ↗
                              </a>
                            </div>
                          );
                        }
                        return (
                          <p
                            style={{
                              color: WARM_TEXT,
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.88rem",
                              margin: 0,
                            }}
                          >
                            {t}
                          </p>
                        );
                      })()}
                      <p
                        style={{
                          color: WARM_MUTED,
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.7rem",
                          margin: "0.2rem 0 0",
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "0.25rem",
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {msg.from === currentUserName && (
                          <span
                            style={{ color: "#D4A853", fontSize: "0.7rem" }}
                            title="Delivered"
                          >
                            ✓✓
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="*/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setText(`[File: ${file.name}]`);
                      e.target.value = "";
                    }
                  }}
                />
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setText(`[Audio: ${file.name}]`);
                      e.target.value = "";
                    }
                  }}
                />
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.type.startsWith("image/")) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const b64 = ev.target?.result as string;
                        setText(`[Photo:${b64}]`);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setText(`[Photo: ${file.name}]`);
                    }
                    e.target.value = "";
                  }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const b64 = ev.target?.result as string;
                      setText(`[Photo:${b64}]`);
                    };
                    reader.readAsDataURL(file);
                    e.target.value = "";
                  }}
                />

                {/* Input area */}
                <div
                  style={{
                    paddingTop: "0.75rem",
                    borderTop: `1px solid ${WARM_BORDER}`,
                  }}
                >
                  {/* Attachment toolbar */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.25rem",
                      marginBottom: "0.4rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      {
                        label: <SvgPaperclipIcon size={14} color="#8B6F47" />,
                        title: "Attach file",
                        action: () => fileInputRef.current?.click(),
                      },
                      {
                        label: <SvgMusicIcon size={14} color="#8B6F47" />,
                        title: "Send audio",
                        action: () => audioInputRef.current?.click(),
                      },
                      {
                        label: <SvgImageIcon size={14} color="#8B6F47" />,
                        title: "Photo/Video",
                        action: () => photoInputRef.current?.click(),
                      },
                      {
                        label: <SvgCameraIcon size={14} color="#8B6F47" />,
                        title: "Camera",
                        action: () => cameraInputRef.current?.click(),
                      },
                    ].map(
                      ({
                        label,
                        title,
                        action,
                      }: {
                        label: React.ReactNode;
                        title: string;
                        action: () => void;
                      }) => (
                        <button
                          key={title}
                          type="button"
                          title={title}
                          onClick={action}
                          data-ocid="messages.secondary_button"
                          style={{
                            background: "rgba(255,240,245,0.8)",
                            border: `1px solid ${WARM_BORDER}`,
                            borderRadius: 6,
                            width: 28,
                            height: 28,
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {label}
                        </button>
                      ),
                    )}
                    {/* GIF/Sticker */}
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        title="GIF / Sticker"
                        onClick={() => {
                          setShowEmojiPicker((v) => !v);
                          setShowSpotifyInput(false);
                        }}
                        data-ocid="messages.toggle"
                        style={{
                          background: showEmojiPicker
                            ? "rgba(212,168,83,0.15)"
                            : "rgba(255,240,245,0.8)",
                          border: `1px solid ${WARM_BORDER}`,
                          borderRadius: 6,
                          width: 28,
                          height: 28,
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SvgSmileIcon
                          size={14}
                          color={showEmojiPicker ? "#5C3D2E" : "#8B6F47"}
                        />
                      </button>
                      {showEmojiPicker && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "calc(100% + 8px)",
                            right: 0,
                            zIndex: 50,
                          }}
                          data-ocid="messages.popover"
                        >
                          <EmojiPicker
                            onSelect={(emoji) => {
                              setText((prev) => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            onClose={() => setShowEmojiPicker(false)}
                          />
                        </div>
                      )}
                    </div>
                    {/* Spotify */}
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        title="Send Spotify link"
                        onClick={() => {
                          setShowSpotifyInput((v) => !v);
                          setShowEmojiPicker(false);
                        }}
                        data-ocid="messages.toggle"
                        style={{
                          background: showSpotifyInput
                            ? "rgba(29,185,84,0.15)"
                            : "rgba(255,240,245,0.8)",
                          border: `1px solid ${WARM_BORDER}`,
                          borderRadius: 6,
                          width: 28,
                          height: 28,
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SvgMusicNoteIcon
                          size={14}
                          color={showSpotifyInput ? "#1DB954" : "#8B6F47"}
                        />
                      </button>
                      {showSpotifyInput && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "calc(100% + 4px)",
                            left: 0,
                            background: "#FFFDF9",
                            border: `1px solid ${WARM_BORDER}`,
                            borderRadius: 8,
                            padding: "0.5rem",
                            width: 200,
                            boxShadow: "0 4px 16px rgba(92,61,46,0.12)",
                            zIndex: 10,
                          }}
                          data-ocid="messages.popover"
                        >
                          <input
                            value={spotifyUrl}
                            onChange={(e) => setSpotifyUrl(e.target.value)}
                            placeholder="Paste Spotify URL..."
                            data-ocid="messages.input"
                            style={{
                              width: "100%",
                              background: "rgba(255,248,238,0.9)",
                              border: `1px solid ${WARM_BORDER}`,
                              borderRadius: 5,
                              padding: "0.3rem 0.5rem",
                              fontSize: "0.72rem",
                              color: WARM_TEXT,
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && spotifyUrl.trim()) {
                                setText(`[Spotify: ${spotifyUrl.trim()}]`);
                                setSpotifyUrl("");
                                setShowSpotifyInput(false);
                              }
                            }}
                          />
                          <button
                            type="button"
                            data-ocid="messages.confirm_button"
                            onClick={() => {
                              if (spotifyUrl.trim()) {
                                setText(`[Spotify: ${spotifyUrl.trim()}]`);
                                setSpotifyUrl("");
                                setShowSpotifyInput(false);
                              }
                            }}
                            style={{
                              marginTop: "0.3rem",
                              background: "rgba(29,185,84,0.15)",
                              border: "1px solid rgba(29,185,84,0.3)",
                              borderRadius: 5,
                              padding: "0.25rem 0.6rem",
                              cursor: "pointer",
                              fontSize: "0.7rem",
                              color: WARM_TEXT,
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              width: "100%",
                            }}
                          >
                            🎵 Send Link
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Group chat */}
                    <button
                      type="button"
                      title="Create group chat"
                      onClick={() => {
                        setShowGroupModal(true);
                        setShowEmojiPicker(false);
                        setShowSpotifyInput(false);
                      }}
                      data-ocid="messages.open_modal_button"
                      style={{
                        background: "rgba(255,240,245,0.8)",
                        border: `1px solid ${WARM_BORDER}`,
                        borderRadius: 6,
                        width: 28,
                        height: 28,
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SvgUsersIcon size={14} color="#8B6F47" />
                    </button>
                  </div>

                  {/* AI compose buttons */}
                  {(aiSettings.aiAudioGen || aiSettings.aiImageGen) && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {aiSettings.aiAudioGen && (
                        <button
                          type="button"
                          title="Listen to message preview"
                          onClick={() => {
                            if (text.trim()) speakText(text, aiSettings);
                          }}
                          disabled={!text.trim()}
                          style={{
                            background: "rgba(255,240,245,0.8)",
                            border: `1px solid ${WARM_BORDER}`,
                            borderRadius: 6,
                            padding: "0.2rem 0.5rem",
                            cursor: text.trim() ? "pointer" : "default",
                            fontSize: "0.7rem",
                            color: WARM_BROWN,
                            fontFamily: "'Libre Baskerville', serif",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            opacity: text.trim() ? 1 : 0.5,
                          }}
                        >
                          ▶ Preview
                        </button>
                      )}
                      {aiSettings.aiImageGen && (
                        <button
                          type="button"
                          title="Generate AI image to attach"
                          onClick={async () => {
                            setGeneratingAiImage(true);
                            try {
                              const img = await generateAIImage(
                                text || "poetic abstract",
                              );
                              setAiAttachedImage(img);
                            } finally {
                              setGeneratingAiImage(false);
                            }
                          }}
                          disabled={generatingAiImage}
                          style={{
                            background: aiAttachedImage
                              ? "rgba(212,168,83,0.15)"
                              : "rgba(255,240,245,0.8)",
                            border: `1px solid ${WARM_BORDER}`,
                            borderRadius: 6,
                            padding: "0.2rem 0.5rem",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                            color: WARM_BROWN,
                            fontFamily: "'Libre Baskerville', serif",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          ✦{" "}
                          {generatingAiImage
                            ? "Generating…"
                            : aiAttachedImage
                              ? "Image Ready"
                              : "AI Image"}
                        </button>
                      )}
                      {aiAttachedImage && (
                        <button
                          type="button"
                          onClick={() => setAiAttachedImage(null)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.7rem",
                            color: WARM_BROWN,
                          }}
                        >
                          ✕ Remove image
                        </button>
                      )}
                    </div>
                  )}
                  {/* AI image preview */}
                  {aiAttachedImage && (
                    <div style={{ marginBottom: "0.4rem" }}>
                      <img
                        src={aiAttachedImage}
                        alt="AI"
                        style={{
                          maxHeight: 80,
                          borderRadius: 6,
                          maxWidth: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}

                  {/* Text input + send */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write a message..."
                      data-ocid="messages.input"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          sendMessage();
                          setShowEmojiPicker(false);
                          setShowSpotifyInput(false);
                        }
                      }}
                      style={{
                        flex: 1,
                        background: "rgba(255,248,238,0.9)",
                        border: `1px solid ${WARM_BORDER}`,
                        borderRadius: 8,
                        padding: "0.6rem 0.9rem",
                        color: WARM_TEXT,
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                    <Button
                      onClick={() => {
                        sendMessage();
                        setShowEmojiPicker(false);
                        setShowSpotifyInput(false);
                      }}
                      disabled={!text.trim()}
                      data-ocid="messages.submit_button"
                      style={{
                        background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
                        border: "none",
                        color: "#3D2B1F",
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </div>

                {/* Group chat modal */}
                {showGroupModal && (
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(92,61,46,0.4)",
                      backdropFilter: "blur(4px)",
                      zIndex: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    data-ocid="messages.modal"
                  >
                    <div
                      style={{
                        background: "#FFFDF9",
                        border: `1px solid ${WARM_BORDER}`,
                        borderRadius: 14,
                        padding: "1.5rem",
                        width: "90%",
                        maxWidth: 340,
                        boxShadow: "0 8px 32px rgba(92,61,46,0.15)",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: WARM_MOCHA,
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <SvgUsersIcon size={16} color="#5C3D2E" /> Create
                          Group Chat
                        </span>
                      </h3>
                      <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group name..."
                        data-ocid="messages.input"
                        style={{
                          width: "100%",
                          background: "rgba(255,248,238,0.9)",
                          border: `1px solid ${WARM_BORDER}`,
                          borderRadius: 7,
                          padding: "0.5rem 0.75rem",
                          color: WARM_TEXT,
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.85rem",
                          outline: "none",
                          marginBottom: "0.75rem",
                          boxSizing: "border-box",
                        }}
                      />
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.75rem",
                          color: WARM_BROWN,
                          marginBottom: "0.5rem",
                        }}
                      >
                        Add members:
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.3rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {conversations
                          .filter((c) => c !== "CHINNUA_POET")
                          .map((conv) => (
                            <label
                              key={conv}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                                fontSize: "0.82rem",
                                color: WARM_TEXT,
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                data-ocid="messages.checkbox"
                                checked={groupMembers.includes(conv)}
                                onChange={(e) => {
                                  setGroupMembers((prev) =>
                                    e.target.checked
                                      ? [...prev, conv]
                                      : prev.filter((m) => m !== conv),
                                  );
                                }}
                              />
                              {conv}
                            </label>
                          ))}
                        {conversations.filter((c) => c !== "CHINNUA_POET")
                          .length === 0 && (
                          <p
                            style={{
                              color: WARM_MUTED,
                              fontSize: "0.75rem",
                              fontStyle: "italic",
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                            }}
                          >
                            No other conversations yet
                          </p>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          data-ocid="messages.confirm_button"
                          onClick={() => {
                            if (groupName.trim()) {
                              const gname = `👥 ${groupName.trim()}`;
                              setConversations((prev) => [...prev, gname]);
                              setActiveConv(gname);
                              setShowGroupModal(false);
                              setGroupName("");
                              setGroupMembers([]);
                            }
                          }}
                          style={{
                            flex: 1,
                            background: "rgba(212,168,83,0.85)",
                            border: "none",
                            borderRadius: 8,
                            padding: "0.55rem",
                            cursor: "pointer",
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: "0.82rem",
                            color: "#3D2B1F",
                            fontWeight: 700,
                          }}
                        >
                          Create Group
                        </button>
                        <button
                          type="button"
                          data-ocid="messages.cancel_button"
                          onClick={() => {
                            setShowGroupModal(false);
                            setGroupName("");
                            setGroupMembers([]);
                          }}
                          style={{
                            background: "transparent",
                            border: `1px solid ${WARM_BORDER}`,
                            borderRadius: 8,
                            padding: "0.55rem 1rem",
                            cursor: "pointer",
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: "0.82rem",
                            color: WARM_BROWN,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
