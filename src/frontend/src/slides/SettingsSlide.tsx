import {
  BarChart2,
  Bell,
  Bot,
  Camera,
  Globe,
  HelpCircle,
  Image,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Moon,
  NotebookPen,
  Palette,
  PenTool,
  Settings,
  Shield,
  Star,
  Sun,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCamera } from "../camera/useCamera";

interface Props {
  currentUser: { username: string; bio: string; createdAt: string } | null;
  onLogout: () => void;
  onNavigate: (slide: string) => void;
}

interface UserSettings {
  displayName: string;
  bio: string;
  profilePhoto: string;
  coverImage: string;
  accountVisibility: "public" | "private";
  defaultPostPrivacy: "public" | "followers" | "private";
  showInSearch: boolean;
  allowMessagesFrom: "everyone" | "followers" | "nobody";
  notifyLikes: boolean;
  notifyComments: boolean;
  notifyReplies: boolean;
  notifyMessages: boolean;
  notifyCommunity: boolean;
  theme: "warm-cream" | "midnight" | "forest" | "ocean" | "rose" | "ink";
  fontStyle: "classic" | "soft";
  textSize: "small" | "medium" | "large";
  writingMode: "free" | "structured";
  autoSave: boolean;
  writingSuggestions: boolean;
  aiEnabled: boolean;
  aiAutoSuggest: boolean;
  aiWritingSuggestions: boolean;
  aiImageGen: boolean;
  aiAudioGen: boolean;
  aiTranslation: boolean;
  aiMode: "soft" | "philosophical" | "minimal";
  defaultVoice: "male" | "female";
  playbackSpeed: "slow" | "normal" | "expressive";
  readReceipts: boolean;
  typingIndicator: boolean;
  voiceCalls: boolean;
  videoCalls: boolean;
  contentDisplay: "poems" | "both";
  hideSensitive: boolean;
  defaultNotePrivacy: "private" | "public";
  publicNotesDisplay: boolean;
  emailUpdates: boolean;
  newPoemsAlerts: boolean;
  communityHighlights: boolean;
  twoFactor: boolean;
}

const defaultSettings: UserSettings = {
  displayName: "",
  bio: "",
  profilePhoto: "",
  coverImage: "",
  accountVisibility: "public",
  defaultPostPrivacy: "public",
  showInSearch: true,
  allowMessagesFrom: "everyone",
  notifyLikes: true,
  notifyComments: true,
  notifyReplies: true,
  notifyMessages: true,
  notifyCommunity: true,
  theme: "warm-cream",
  fontStyle: "classic",
  textSize: "medium",
  writingMode: "free",
  autoSave: true,
  writingSuggestions: true,
  aiEnabled: true,
  aiAutoSuggest: false,
  aiWritingSuggestions: true,
  aiImageGen: false,
  aiAudioGen: false,
  aiTranslation: false,
  aiMode: "soft",
  defaultVoice: "female",
  playbackSpeed: "normal",
  readReceipts: true,
  typingIndicator: true,
  voiceCalls: true,
  videoCalls: true,
  contentDisplay: "both",
  hideSensitive: false,
  defaultNotePrivacy: "private",
  publicNotesDisplay: false,
  emailUpdates: true,
  newPoemsAlerts: true,
  communityHighlights: false,
  twoFactor: false,
};

export const THEME_PALETTES = {
  "warm-cream": {
    bg: "#FFF8EE",
    paper: "#F5ECD7",
    text: "#3D2B1F",
    muted: "#8B6F47",
    gold: "#D4A853",
    mocha: "#5C3D2E",
    border: "rgba(139,111,71,0.25)",
    name: "Warm Cream",
  },
  midnight: {
    bg: "#0D0D14",
    paper: "#1A1A2E",
    text: "#E8E0D5",
    muted: "#9E8070",
    gold: "#D4A853",
    mocha: "#C4A882",
    border: "rgba(200,170,120,0.2)",
    name: "Midnight Dark",
  },
  forest: {
    bg: "#F0F4EE",
    paper: "#E3EDE0",
    text: "#1E3A2F",
    muted: "#4A7C59",
    gold: "#7DAF6E",
    mocha: "#2D5A3E",
    border: "rgba(74,124,89,0.25)",
    name: "Forest Green",
  },
  ocean: {
    bg: "#EEF4FA",
    paper: "#E0EBF5",
    text: "#1A2E4A",
    muted: "#4A6E8C",
    gold: "#5BA3CC",
    mocha: "#2A4F73",
    border: "rgba(74,110,140,0.25)",
    name: "Ocean Blue",
  },
  rose: {
    bg: "#FDF0F3",
    paper: "#F8E0E6",
    text: "#3A1A22",
    muted: "#8C4A5A",
    gold: "#CC7A8A",
    mocha: "#6B2D3E",
    border: "rgba(140,74,90,0.25)",
    name: "Rose Petal",
  },
  ink: {
    bg: "#F5F0E8",
    paper: "#EDE8DC",
    text: "#1A1510",
    muted: "#5C5040",
    gold: "#8B7355",
    mocha: "#3D3020",
    border: "rgba(92,80,64,0.25)",
    name: "Ink & Paper",
  },
};

export function applyTheme(theme: keyof typeof THEME_PALETTES) {
  const p = THEME_PALETTES[theme] || THEME_PALETTES["warm-cream"];
  const root = document.documentElement;
  root.style.setProperty("--theme-bg", p.bg);
  root.style.setProperty("--theme-paper", p.paper);
  root.style.setProperty("--theme-text", p.text);
  root.style.setProperty("--theme-muted", p.muted);
  root.style.setProperty("--theme-gold", p.gold);
  root.style.setProperty("--theme-mocha", p.mocha);
  root.style.setProperty("--theme-border", p.border);
  document.body.style.background = p.bg;
  document.body.style.color = p.text;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("chinnua_theme", theme);
  window.dispatchEvent(new CustomEvent("themeChanged", { detail: p }));
}

const SECTIONS: { id: string; icon: React.ReactNode; label: string }[] = [
  { id: "profile", icon: <User size={15} />, label: "Profile" },
  { id: "privacy", icon: <Lock size={15} />, label: "Privacy" },
  { id: "notifications", icon: <Bell size={15} />, label: "Notifications" },
  { id: "appearance", icon: <Palette size={15} />, label: "Appearance" },
  { id: "writing", icon: <PenTool size={15} />, label: "Writing" },
  { id: "ai", icon: <Bot size={15} />, label: "AI Assistant" },
  { id: "messaging", icon: <MessageCircle size={15} />, label: "Messaging" },
  { id: "content", icon: <Image size={15} />, label: "Content" },
  { id: "language", icon: <Globe size={15} />, label: "Language" },
  { id: "notes", icon: <NotebookPen size={15} />, label: "Notes" },
  { id: "help", icon: <HelpCircle size={15} />, label: "Help Centre" },
  { id: "security", icon: <Shield size={15} />, label: "Security" },
  { id: "email", icon: <Mail size={15} />, label: "Email" },
  { id: "account", icon: <LogOut size={15} />, label: "Account" },
];

const FAQ_ITEMS = [
  {
    q: "How do I post a poem?",
    a: "Go to the Feed section, type your poem in the text box at the top, and click Post. Your poem will appear in the community feed.",
  },
  {
    q: "Can I make my account private?",
    a: "Yes! Go to Privacy Settings here and set Account Visibility to Private. Only people you approve can see your content.",
  },
  {
    q: "How do I use the translator?",
    a: "Click the globe icon (🌐) in the navigation bar to select your language. The entire website — including poems — will be translated.",
  },
  {
    q: "What is The Silent Guardian?",
    a: "The Silent Guardian is our gentle AI moderation system. It quietly reviews content to keep the space safe, respectful, and poetic. It never interrupts your experience.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Account Controls at the bottom of this Settings page. Click Delete Account and follow the confirmation steps. This action is permanent.",
  },
  {
    q: "How do I report a post?",
    a: "Click the options menu on any post and select Report. Our moderation team will review it with care.",
  },
];

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

function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        padding: "0.6rem 0",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <span
        style={{
          color: colors.text,
          fontFamily: "'Lora', serif",
          fontSize: "0.92rem",
        }}
      >
        {label}
      </span>
      <div
        id={id}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: checked ? colors.gold : "rgba(139,111,71,0.25)",
          position: "relative",
          transition: "background 0.3s",
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            transition: "left 0.3s",
          }}
        />
      </div>
    </label>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: colors.paper,
        borderRadius: 16,
        padding: "1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 12px rgba(92,61,46,0.08)",
        border: "1px solid rgba(139,111,71,0.25)",
      }}
    >
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.15rem",
          color: colors.mocha,
          marginBottom: "1.2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

export default function SettingsSlide({
  currentUser,
  onLogout,
  onNavigate: _onNavigate,
}: Props) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem("chinnua_user_settings");
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSent, setContactSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const { startCamera, stopCamera, capturePhoto, videoRef } = useCamera();
  const [showCamera, setShowCamera] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [showTwoFAModal, setShowTwoFAModal] = useState(false);

  const update = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveAll = () => {
    localStorage.setItem("chinnua_user_settings", JSON.stringify(settings));
    localStorage.setItem("chinnua_settings", JSON.stringify(settings));
    applyTheme(settings.theme as keyof typeof THEME_PALETTES);
    window.dispatchEvent(
      new CustomEvent("settingsChanged", { detail: settings }),
    );
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update("profilePhoto", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update("coverImage", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCapture = async () => {
    await startCamera();
    setShowCamera(true);
  };

  const handleTakePhoto = async () => {
    const file = await capturePhoto();
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        update("profilePhoto", ev.target?.result as string);
      reader.readAsDataURL(file);
    }
    stopCamera();
    setShowCamera(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: colors.bg,
    border: "1px solid rgba(139,111,71,0.25)",
    borderRadius: 8,
    padding: "0.6rem 0.8rem",
    fontFamily: "'Lora', serif",
    fontSize: "0.9rem",
    color: colors.text,
    outline: "none",
    marginBottom: "0.8rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Lora', serif",
    fontSize: "0.8rem",
    color: colors.muted,
    marginBottom: "0.3rem",
  };

  const radioGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "0.8rem",
  };

  const radioOption = (
    value: string,
    current: string,
    label: string,
    onClick: () => void,
  ) => (
    <button
      type="button"
      key={value}
      onClick={onClick}
      style={{
        padding: "0.4rem 0.9rem",
        borderRadius: 20,
        border: `1px solid ${current === value ? colors.gold : colors.border}`,
        background: current === value ? "rgba(212,168,83,0.12)" : "transparent",
        color: current === value ? colors.mocha : colors.muted,
        fontFamily: "'Lora', serif",
        fontSize: "0.85rem",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <SectionCard title="Profile Settings" icon={<User size={16} />}>
            {settings.profilePhoto && (
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <img
                  src={settings.profilePhoto}
                  alt="Profile"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid ${colors.gold}`,
                  }}
                />
              </div>
            )}
            <p style={labelStyle}>Username</p>
            <input
              style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed" }}
              value={currentUser?.username || ""}
              readOnly
              data-ocid="settings.profile.input"
            />
            <p style={labelStyle}>Display Name (Pen Name)</p>
            <input
              style={inputStyle}
              value={settings.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              placeholder="Your pen name…"
              data-ocid="settings.displayname.input"
            />
            <p style={labelStyle}>Bio</p>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              value={settings.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="A few words about you…"
              data-ocid="settings.bio.textarea"
            />
            <p style={labelStyle}>Profile Picture</p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginBottom: "0.8rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: `1px solid ${colors.gold}`,
                  background: "transparent",
                  color: colors.mocha,
                  fontFamily: "'Lora', serif",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
                data-ocid="settings.profile_photo.upload_button"
              >
                Upload from Device
              </button>
              <button
                type="button"
                onClick={handleCapture}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: `1px solid ${colors.gold}`,
                  background: "transparent",
                  color: colors.mocha,
                  fontFamily: "'Lora', serif",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
                data-ocid="settings.profile_photo_camera.button"
              >
                Capture from Camera
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="user"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            {showCamera && (
              <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    maxWidth: 240,
                    borderRadius: 12,
                    border: "1px solid rgba(139,111,71,0.25)",
                  }}
                >
                  <track kind="captions" />
                </video>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleTakePhoto}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: 8,
                      background: colors.gold,
                      border: "none",
                      color: "#3D2B1F",
                      cursor: "pointer",
                    }}
                  >
                    Take Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setShowCamera(false);
                    }}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: 8,
                      background: "transparent",
                      border: "1px solid rgba(139,111,71,0.25)",
                      color: colors.muted,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <p style={labelStyle}>Cover Image (optional)</p>
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                border: "1px solid rgba(139,111,71,0.25)",
                background: "transparent",
                color: colors.muted,
                fontFamily: "'Lora', serif",
                fontSize: "0.85rem",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
              data-ocid="settings.cover_image.upload_button"
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Image size={14} /> Upload Cover Image
              </span>
            </button>
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleCoverUpload}
            />
            {settings.coverImage && (
              <img
                src={settings.coverImage}
                alt="Cover"
                style={{
                  width: "100%",
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: "1rem",
                }}
              />
            )}
            <button
              type="button"
              onClick={saveAll}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 10,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: saved ? "0 0 16px rgba(212,168,83,0.6)" : "none",
                transition: "box-shadow 0.3s",
              }}
              data-ocid="settings.save.button"
            >
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </SectionCard>
        );

      case "privacy":
        return (
          <SectionCard title="Privacy Settings" icon={<Lock size={16} />}>
            <p style={labelStyle}>Account Visibility</p>
            <div style={radioGroupStyle}>
              {radioOption("public", settings.accountVisibility, "Public", () =>
                update("accountVisibility", "public"),
              )}
              {radioOption(
                "private",
                settings.accountVisibility,
                "Private",
                () => update("accountVisibility", "private"),
              )}
            </div>
            <p style={labelStyle}>Default Post Privacy</p>
            <select
              style={selectStyle}
              value={settings.defaultPostPrivacy}
              onChange={(e) =>
                update("defaultPostPrivacy", e.target.value as any)
              }
              data-ocid="settings.post_privacy.select"
            >
              <option value="public">Public</option>
              <option value="followers">Followers Only</option>
              <option value="private">Private</option>
            </select>
            <Toggle
              id="showSearch"
              checked={settings.showInSearch}
              onChange={(v) => update("showInSearch", v)}
              label="Show Profile in Search"
            />
            <p style={{ ...labelStyle, marginTop: "0.8rem" }}>
              Allow Messages From
            </p>
            <select
              style={selectStyle}
              value={settings.allowMessagesFrom}
              onChange={(e) =>
                update("allowMessagesFrom", e.target.value as any)
              }
              data-ocid="settings.messages_from.select"
            >
              <option value="everyone">Everyone</option>
              <option value="followers">Followers Only</option>
              <option value="nobody">No One</option>
            </select>
            <button
              type="button"
              onClick={saveAll}
              style={{
                marginTop: "0.5rem",
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.privacy_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "notifications":
        return (
          <SectionCard title="Notification Settings" icon={<Bell size={16} />}>
            <Toggle
              id="notifyLikes"
              checked={settings.notifyLikes}
              onChange={(v) => update("notifyLikes", v)}
              label="Likes"
            />
            <Toggle
              id="notifyComments"
              checked={settings.notifyComments}
              onChange={(v) => update("notifyComments", v)}
              label="Comments"
            />
            <Toggle
              id="notifyReplies"
              checked={settings.notifyReplies}
              onChange={(v) => update("notifyReplies", v)}
              label="Replies"
            />
            <Toggle
              id="notifyMessages"
              checked={settings.notifyMessages}
              onChange={(v) => update("notifyMessages", v)}
              label="Messages"
            />
            <Toggle
              id="notifyCommunity"
              checked={settings.notifyCommunity}
              onChange={(v) => update("notifyCommunity", v)}
              label="Community Activity"
            />
            <button
              type="button"
              onClick={saveAll}
              style={{
                marginTop: "0.75rem",
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.notif_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "appearance":
        return (
          <SectionCard title="Appearance Settings" icon={<Palette size={16} />}>
            <p style={labelStyle}>Theme</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              {(
                Object.entries(THEME_PALETTES) as [
                  string,
                  (typeof THEME_PALETTES)["warm-cream"],
                ][]
              ).map(([key, palette]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    update("theme", key as any);
                    applyTheme(key as keyof typeof THEME_PALETTES);
                  }}
                  style={{
                    padding: "0.75rem",
                    borderRadius: 10,
                    border:
                      settings.theme === key
                        ? `2px solid ${palette.gold}`
                        : `1px solid ${palette.border}`,
                    background: palette.paper,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 24,
                      borderRadius: 6,
                      background: palette.bg,
                      marginBottom: "0.4rem",
                      border: `1px solid ${palette.border}`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Lora', serif",
                      fontSize: "0.8rem",
                      color: palette.text,
                      fontWeight: settings.theme === key ? 700 : 400,
                      display: "block",
                    }}
                  >
                    {palette.name}
                  </span>
                  {settings.theme === key && (
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.65rem",
                        color: palette.gold,
                        marginTop: 2,
                      }}
                    >
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p style={labelStyle}>Font Style</p>
            <div style={radioGroupStyle}>
              {radioOption("classic", settings.fontStyle, "Classic Serif", () =>
                update("fontStyle", "classic"),
              )}
              {radioOption("soft", settings.fontStyle, "Soft Modern", () =>
                update("fontStyle", "soft"),
              )}
            </div>
            <p style={labelStyle}>Text Size</p>
            <div style={radioGroupStyle}>
              {radioOption("small", settings.textSize, "Small", () =>
                update("textSize", "small"),
              )}
              {radioOption("medium", settings.textSize, "Medium", () =>
                update("textSize", "medium"),
              )}
              {radioOption("large", settings.textSize, "Large", () =>
                update("textSize", "large"),
              )}
            </div>
            <div
              style={{
                background: colors.bg,
                border: "1px solid rgba(139,111,71,0.25)",
                borderRadius: 10,
                padding: "1rem 1.2rem",
                marginTop: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: colors.muted,
                  fontSize: "0.72rem",
                  marginBottom: "0.4rem",
                }}
              >
                Preview
              </p>
              <p
                style={{
                  fontFamily:
                    settings.fontStyle === "classic"
                      ? "'Playfair Display', serif"
                      : "'Lora', serif",
                  fontSize:
                    settings.textSize === "small"
                      ? "0.85rem"
                      : settings.textSize === "large"
                        ? "1.1rem"
                        : "0.95rem",
                  color: colors.text,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                }}
              >
                Roses bloom in silence,
                <br />
                where only the moon hears
                <br />
                the secrets of the soil.
              </p>
            </div>
            <button
              type="button"
              onClick={saveAll}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.appearance_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "writing":
        return (
          <SectionCard title="Writing Preferences" icon={<PenTool size={16} />}>
            <p style={labelStyle}>Default Writing Mode</p>
            <div style={radioGroupStyle}>
              {radioOption("free", settings.writingMode, "Free Verse", () =>
                update("writingMode", "free"),
              )}
              {radioOption(
                "structured",
                settings.writingMode,
                "Structured",
                () => update("writingMode", "structured"),
              )}
            </div>
            <Toggle
              id="autoSave"
              checked={settings.autoSave}
              onChange={(v) => update("autoSave", v)}
              label="Auto-save Poems"
            />
            <Toggle
              id="writingSug"
              checked={settings.writingSuggestions}
              onChange={(v) => update("writingSuggestions", v)}
              label="Writing Suggestions"
            />
            <button
              type="button"
              onClick={saveAll}
              style={{
                marginTop: "0.75rem",
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.writing_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "ai":
        return (
          <SectionCard title="The Silent Listener" icon={<Bot size={16} />}>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
                color: colors.gold,
                fontSize: "0.9rem",
                marginBottom: "1.2rem",
              }}
            >
              "Sometimes silence needs a voice."
            </p>
            <Toggle
              id="aiEnabled"
              checked={settings.aiEnabled}
              onChange={(v) => update("aiEnabled", v)}
              label="Enable AI Assistant"
            />
            <Toggle
              id="aiAutoSuggest"
              checked={settings.aiAutoSuggest}
              onChange={(v) => update("aiAutoSuggest", v)}
              label="Auto-suggest Lines"
            />
            <Toggle
              id="aiWritingSug"
              checked={settings.aiWritingSuggestions}
              onChange={(v) => update("aiWritingSuggestions", v)}
              label="Writing Suggestions"
            />
            <Toggle
              id="aiImageGen"
              checked={settings.aiImageGen}
              onChange={(v) => update("aiImageGen", v)}
              label="AI Image Generation"
            />
            <Toggle
              id="aiAudioGen"
              checked={settings.aiAudioGen}
              onChange={(v) => update("aiAudioGen", v)}
              label="AI Audio Generation"
            />
            <Toggle
              id="aiTranslation"
              checked={settings.aiTranslation}
              onChange={(v) => update("aiTranslation", v)}
              label="AI Translation"
            />
            <p style={{ ...labelStyle, marginTop: "1rem" }}>AI Mode</p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
              }}
            >
              {(
                [
                  {
                    val: "soft",
                    icon: "soft",
                    name: "Soft Emotional",
                    desc: "Gentle & comforting",
                  },
                  {
                    val: "philosophical",
                    icon: "deep",
                    name: "Deep Philosophical",
                    desc: "Reflective & thought-provoking",
                  },
                  {
                    val: "minimal",
                    icon: "minimal",
                    name: "Minimal",
                    desc: "Short & direct",
                  },
                ] as const
              ).map(({ val, icon, name, desc }) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => update("aiMode", val)}
                  style={{
                    flex: "1 1 140px",
                    padding: "0.75rem",
                    borderRadius: 12,
                    border: `1px solid ${settings.aiMode === val ? colors.gold : colors.border}`,
                    background:
                      settings.aiMode === val
                        ? "rgba(212,168,83,0.1)"
                        : "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  data-ocid={`settings.ai_mode_${val}.button`}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                    {icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.85rem",
                      color:
                        settings.aiMode === val ? colors.mocha : colors.text,
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Lora', serif",
                      fontSize: "0.75rem",
                      color: colors.muted,
                    }}
                  >
                    {desc}
                  </div>
                </button>
              ))}
            </div>
            <p style={labelStyle}>Default Voice</p>
            <div style={radioGroupStyle}>
              {radioOption("male", settings.defaultVoice, "Male", () =>
                update("defaultVoice", "male"),
              )}
              {radioOption("female", settings.defaultVoice, "Female", () =>
                update("defaultVoice", "female"),
              )}
            </div>
            <p style={labelStyle}>Playback Speed</p>
            <div style={radioGroupStyle}>
              {radioOption("slow", settings.playbackSpeed, "Slow", () =>
                update("playbackSpeed", "slow"),
              )}
              {radioOption("normal", settings.playbackSpeed, "Normal", () =>
                update("playbackSpeed", "normal"),
              )}
              {radioOption(
                "expressive",
                settings.playbackSpeed,
                "Expressive",
                () => update("playbackSpeed", "expressive"),
              )}
            </div>
            <button
              type="button"
              onClick={saveAll}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.ai_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "messaging":
        return (
          <SectionCard
            title="Messaging Settings"
            icon={<MessageCircle size={16} />}
          >
            <Toggle
              id="readReceipts"
              checked={settings.readReceipts}
              onChange={(v) => update("readReceipts", v)}
              label="Read Receipts"
            />
            <Toggle
              id="typingIndicator"
              checked={settings.typingIndicator}
              onChange={(v) => update("typingIndicator", v)}
              label="Typing Indicator"
            />
            <div
              style={{
                padding: "0.6rem 0",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <span
                style={{
                  color: colors.muted,
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9rem",
                }}
              >
                Mute Conversations — available inside each conversation
              </span>
            </div>
            <Toggle
              id="voiceCalls"
              checked={settings.voiceCalls}
              onChange={(v) => update("voiceCalls", v)}
              label="Enable Voice Calls"
            />
            <Toggle
              id="videoCalls"
              checked={settings.videoCalls}
              onChange={(v) => update("videoCalls", v)}
              label="Enable Video Calls"
            />
            <button
              type="button"
              onClick={saveAll}
              style={{
                marginTop: "0.75rem",
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.messaging_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "content":
        return (
          <SectionCard title="Content Preferences" icon={<Image size={16} />}>
            <p style={labelStyle}>Show</p>
            <select
              style={selectStyle}
              value={settings.contentDisplay}
              onChange={(e) => update("contentDisplay", e.target.value as any)}
              data-ocid="settings.content_display.select"
            >
              <option value="poems">Poems Only</option>
              <option value="both">Poems + Images</option>
            </select>
            <Toggle
              id="hideSensitive"
              checked={settings.hideSensitive}
              onChange={(v) => update("hideSensitive", v)}
              label="Hide Sensitive Content"
            />
            <div
              style={{
                padding: "0.6rem 0",
                borderBottom: `1px solid ${colors.border}`,
                marginTop: "0.2rem",
              }}
            >
              <span
                style={{
                  color: colors.muted,
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9rem",
                }}
              >
                Language: English (content language is fixed)
              </span>
            </div>
            <div style={{ padding: "0.6rem 0" }}>
              <span
                style={{
                  color: colors.muted,
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9rem",
                }}
              >
                Use the globe icon in the navigation bar to translate the
                website into any language.
              </span>
            </div>
            <button
              type="button"
              onClick={saveAll}
              style={{
                marginTop: "0.5rem",
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.content_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "language":
        return (
          <SectionCard
            title="Language &amp; Translator"
            icon={<Globe size={16} />}
          >
            <div
              style={{
                background: colors.bg,
                border: "1px solid rgba(139,111,71,0.25)",
                borderRadius: 10,
                padding: "1.2rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "1.75rem",
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Globe size={32} style={{ color: "#8B6F47" }} />
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: colors.mocha,
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                }}
              >
                Globe Translator
              </p>
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  color: colors.muted,
                  fontSize: "0.88rem",
                  lineHeight: 1.6,
                }}
              >
                Use the <strong>globe icon</strong> in the navigation bar to
                translate the entire website into your language.
              </p>
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: "italic",
                  color: colors.gold,
                  fontSize: "0.85rem",
                  marginTop: "0.75rem",
                }}
              >
                "Poetry meaning is preserved as much as possible."
              </p>
            </div>
          </SectionCard>
        );

      case "notes":
        return (
          <SectionCard title="Notes Settings" icon={<NotebookPen size={16} />}>
            <p style={labelStyle}>Default Note Privacy</p>
            <select
              style={selectStyle}
              value={settings.defaultNotePrivacy}
              onChange={(e) =>
                update("defaultNotePrivacy", e.target.value as any)
              }
              data-ocid="settings.note_privacy.select"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <Toggle
              id="publicNotesDisplay"
              checked={settings.publicNotesDisplay}
              onChange={(v) => update("publicNotesDisplay", v)}
              label="Enable Public Notes Display"
            />
            <button
              type="button"
              onClick={saveAll}
              style={{
                marginTop: "0.75rem",
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.notes_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "help":
        return (
          <SectionCard title="Help Centre" icon={<HelpCircle size={16} />}>
            {/* Silent Listener */}
            <div
              style={{
                background: colors.bg,
                borderRadius: 10,
                padding: "1rem",
                marginBottom: "1rem",
                border: "1px solid rgba(139,111,71,0.25)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: colors.mocha,
                  marginBottom: "0.4rem",
                }}
              >
                The Silent Listener AI Chat
              </p>
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  color: colors.muted,
                  fontSize: "0.88rem",
                  marginBottom: "0.6rem",
                }}
              >
                Your personal AI poetry companion is always available in the
                bottom-right corner.
              </p>
              <button
                type="button"
                onClick={() => {
                  /* trigger AI chat */
                }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  background: colors.gold,
                  border: "none",
                  color: "#3D2B1F",
                  cursor: "pointer",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.85rem",
                }}
                data-ocid="help.ai_chat.button"
              >
                Open The Silent Listener
              </button>
            </div>

            {/* FAQ */}
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                color: colors.mocha,
                marginBottom: "0.6rem",
              }}
            >
              Frequently Asked Questions
            </p>
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={item.q}
                style={{
                  borderBottom: `1px solid ${colors.border}`,
                  marginBottom: "0.2rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.65rem 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: colors.text,
                    fontFamily: "'Lora', serif",
                    fontSize: "0.9rem",
                  }}
                  data-ocid={`help.faq_item.${i + 1}`}
                >
                  {item.q}
                  <span style={{ color: colors.gold, marginLeft: "0.5rem" }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          padding: "0 0 0.75rem",
                          fontFamily: "'Lora', serif",
                          color: colors.muted,
                          fontSize: "0.87rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Contact */}
            <div style={{ marginTop: "1.5rem" }}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: colors.mocha,
                  marginBottom: "0.8rem",
                }}
              >
                Contact Us
              </p>
              {contactSent ? (
                <div
                  style={{
                    textAlign: "center",
                    color: colors.gold,
                    fontFamily: "'Lora', serif",
                    padding: "1rem",
                  }}
                  data-ocid="help.contact.success_state"
                >
                  ✓ Message sent. We'll get back to you soon.
                </div>
              ) : (
                <>
                  <input
                    style={inputStyle}
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, name: e.target.value }))
                    }
                    data-ocid="help.contact_name.input"
                  />
                  <input
                    style={inputStyle}
                    placeholder="Your email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, email: e.target.value }))
                    }
                    data-ocid="help.contact_email.input"
                  />
                  <textarea
                    style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                    placeholder="Your message…"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, message: e.target.value }))
                    }
                    data-ocid="help.contact_message.textarea"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (contactForm.name && contactForm.message) {
                        const msgs = JSON.parse(
                          localStorage.getItem("chinnua_contact_messages") ||
                            "[]",
                        );
                        msgs.push({
                          ...contactForm,
                          date: new Date().toISOString(),
                        });
                        localStorage.setItem(
                          "chinnua_contact_messages",
                          JSON.stringify(msgs),
                        );
                        setContactSent(true);
                      }
                    }}
                    style={{
                      padding: "0.6rem 1.5rem",
                      borderRadius: 8,
                      background: colors.gold,
                      border: "none",
                      color: "#3D2B1F",
                      cursor: "pointer",
                      fontFamily: "'Lora', serif",
                    }}
                    data-ocid="help.contact.submit_button"
                  >
                    Send Message
                  </button>
                </>
              )}
              <p
                style={{
                  marginTop: "0.75rem",
                  fontFamily: "'Lora', serif",
                  color: colors.muted,
                  fontSize: "0.85rem",
                }}
              >
                Or email us directly:{" "}
                <a
                  href="mailto:anoldpoet07@gmail.com"
                  style={{ color: colors.gold }}
                >
                  anoldpoet07@gmail.com
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://www.youtube.com/@ChinnuaPoetofficial"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 20,
                  border: "1px solid rgba(139,111,71,0.25)",
                  color: colors.mocha,
                  textDecoration: "none",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.85rem",
                }}
              >
                YouTube
              </a>
              <a
                href="https://x.com/CHINNUA_POET"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 20,
                  border: "1px solid rgba(139,111,71,0.25)",
                  color: colors.mocha,
                  textDecoration: "none",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.85rem",
                }}
              >
                X (Twitter)
              </a>
            </div>
          </SectionCard>
        );

      case "security":
        return (
          <SectionCard title="Security Settings" icon={<Shield size={16} />}>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              style={{
                width: "100%",
                marginBottom: "0.75rem",
                padding: "0.65rem",
                borderRadius: 8,
                border: "1px solid rgba(139,111,71,0.25)",
                background: "transparent",
                color: colors.text,
                fontFamily: "'Lora', serif",
                cursor: "pointer",
                textAlign: "left",
              }}
              data-ocid="settings.change_password.button"
            >
              Change Password
            </button>
            <div
              style={{
                padding: "0.6rem 0",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <span
                style={{
                  color: colors.muted,
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9rem",
                }}
              >
                Connected Account: Google (Gmail)
              </span>
            </div>
            <div
              style={{
                padding: "0.6rem 0",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: colors.mocha,
                  fontFamily: "'Lora', serif",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  padding: 0,
                }}
                onClick={() =>
                  alert("You have been logged out from all devices.")
                }
                data-ocid="settings.logout_all.button"
              >
                Logout from all devices
              </button>
            </div>
            <Toggle
              id="twoFactor"
              checked={settings.twoFactor}
              onChange={(v) => {
                update("twoFactor", v);
                if (v) {
                  const code = Math.floor(
                    100000 + Math.random() * 900000,
                  ).toString();
                  localStorage.setItem("chinnua_2fa_code", code);
                  setTwoFACode(code);
                  setShowTwoFAModal(true);
                } else {
                  localStorage.removeItem("chinnua_2fa_code");
                  toast.success("Two-factor authentication disabled");
                }
              }}
              label="Two-Factor Authentication"
            />
            {/* 2FA Modal */}
            <AnimatePresence>
              {showTwoFAModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                  }}
                  data-ocid="settings.dialog"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                      background: colors.paper,
                      borderRadius: 16,
                      padding: "2rem",
                      maxWidth: 360,
                      width: "100%",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: colors.text,
                        fontSize: "1.1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Two-Factor Authentication Enabled
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Lora', serif",
                        color: colors.muted,
                        fontSize: "0.85rem",
                        marginBottom: "1rem",
                      }}
                    >
                      Save this backup code. You'll need it when logging in as
                      admin.
                    </p>
                    <div
                      style={{
                        background: colors.bg,
                        border: `2px solid ${colors.gold}`,
                        borderRadius: 10,
                        padding: "1rem",
                        textAlign: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.8rem",
                          letterSpacing: "0.3em",
                          color: colors.text,
                          fontWeight: 700,
                        }}
                      >
                        {twoFACode}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Lora', serif",
                        color: colors.muted,
                        fontSize: "0.78rem",
                        marginBottom: "1rem",
                        fontStyle: "italic",
                      }}
                    >
                      Keep this code private. Do not share it with anyone.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowTwoFAModal(false)}
                      data-ocid="settings.confirm_button"
                      style={{
                        width: "100%",
                        padding: "0.6rem",
                        background: colors.gold,
                        border: "none",
                        borderRadius: 8,
                        color: "#3D2B1F",
                        fontFamily: "'Lora', serif",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      I've saved my code
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Change Password Modal */}
            <AnimatePresence>
              {showPasswordModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  data-ocid="settings.change_password.modal"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                      background: colors.paper,
                      borderRadius: 16,
                      padding: "1.5rem",
                      width: "min(360px, 90vw)",
                      boxShadow: "0 8px 32px rgba(92,61,46,0.2)",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: colors.mocha,
                        marginBottom: "1rem",
                      }}
                    >
                      Change Password
                    </h3>
                    <input
                      style={inputStyle}
                      type="password"
                      placeholder="Current password"
                      value={oldPw}
                      onChange={(e) => setOldPw(e.target.value)}
                      data-ocid="settings.old_password.input"
                    />
                    <input
                      style={inputStyle}
                      type="password"
                      placeholder="New password"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      data-ocid="settings.new_password.input"
                    />
                    {pwMsg && (
                      <p
                        style={{
                          color: colors.gold,
                          fontFamily: "'Lora', serif",
                          fontSize: "0.85rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {pwMsg}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!oldPw || !newPw) {
                            setPwMsg("Please fill all fields.");
                            return;
                          }
                          const storedPw =
                            localStorage.getItem("chinnua_admin_password") ||
                            "chinnua2025";
                          if (oldPw !== storedPw) {
                            setPwMsg("Current password is incorrect.");
                            return;
                          }
                          localStorage.setItem("chinnua_admin_password", newPw);
                          setPwMsg("Password changed!");
                          setTimeout(() => {
                            setShowPasswordModal(false);
                            setPwMsg("");
                            setOldPw("");
                            setNewPw("");
                          }, 1500);
                        }}
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          borderRadius: 8,
                          background: colors.gold,
                          border: "none",
                          color: "#3D2B1F",
                          cursor: "pointer",
                          fontFamily: "'Lora', serif",
                        }}
                        data-ocid="settings.change_password.confirm_button"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordModal(false);
                          setPwMsg("");
                          setOldPw("");
                          setNewPw("");
                        }}
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          borderRadius: 8,
                          border: "1px solid rgba(139,111,71,0.25)",
                          background: "transparent",
                          color: colors.muted,
                          cursor: "pointer",
                          fontFamily: "'Lora', serif",
                        }}
                        data-ocid="settings.change_password.cancel_button"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        );

      case "email":
        return (
          <SectionCard
            title="Email &amp; Notification Settings"
            icon={<Mail size={16} />}
          >
            <Toggle
              id="emailUpdates"
              checked={settings.emailUpdates}
              onChange={(v) => update("emailUpdates", v)}
              label="Receive Email Updates"
            />
            <Toggle
              id="newPoemsAlerts"
              checked={settings.newPoemsAlerts}
              onChange={(v) => update("newPoemsAlerts", v)}
              label="New Poems Alerts"
            />
            <Toggle
              id="communityHighlights"
              checked={settings.communityHighlights}
              onChange={(v) => update("communityHighlights", v)}
              label="Community Highlights"
            />
            <button
              type="button"
              onClick={saveAll}
              style={{
                marginTop: "0.75rem",
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: colors.gold,
                border: "none",
                color: "#3D2B1F",
                cursor: "pointer",
                fontFamily: "'Lora', serif",
              }}
              data-ocid="settings.email_save.button"
            >
              Save
            </button>
          </SectionCard>
        );

      case "account":
        return (
          <SectionCard title="Account Controls" icon={<LogOut size={16} />}>
            <button
              type="button"
              onClick={onLogout}
              style={{
                width: "100%",
                marginBottom: "0.75rem",
                padding: "0.7rem",
                borderRadius: 8,
                border: "1px solid rgba(139,111,71,0.25)",
                background: "transparent",
                color: colors.text,
                fontFamily: "'Lora', serif",
                cursor: "pointer",
                textAlign: "left",
              }}
              data-ocid="settings.logout.button"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={() => setShowDeactivateConfirm(true)}
              style={{
                width: "100%",
                marginBottom: "0.75rem",
                padding: "0.7rem",
                borderRadius: 8,
                border: "1px solid rgba(139,111,71,0.4)",
                background: "transparent",
                color: colors.brown,
                fontFamily: "'Lora', serif",
                cursor: "pointer",
                textAlign: "left",
              }}
              data-ocid="settings.deactivate.button"
            >
              Deactivate Account
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: 8,
                border: "1px solid rgba(220,60,60,0.4)",
                background: "transparent",
                color: "#c0392b",
                fontFamily: "'Lora', serif",
                cursor: "pointer",
                textAlign: "left",
              }}
              data-ocid="settings.delete_account.button"
            >
              Delete Account
            </button>

            <AnimatePresence>
              {showDeactivateConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  data-ocid="settings.deactivate.modal"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    style={{
                      background: colors.paper,
                      borderRadius: 16,
                      padding: "1.5rem",
                      width: "min(340px, 90vw)",
                      boxShadow: "0 8px 32px rgba(92,61,46,0.2)",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: colors.mocha,
                        marginBottom: "0.75rem",
                      }}
                    >
                      Deactivate Account
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Lora', serif",
                        color: colors.muted,
                        fontSize: "0.9rem",
                        marginBottom: "1rem",
                      }}
                    >
                      Your account will be hidden but your data will be
                      preserved. You can reactivate it anytime.
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => setShowDeactivateConfirm(false)}
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          borderRadius: 8,
                          border: "1px solid rgba(139,111,71,0.25)",
                          background: "transparent",
                          color: colors.muted,
                          cursor: "pointer",
                          fontFamily: "'Lora', serif",
                        }}
                        data-ocid="settings.deactivate.cancel_button"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeactivateConfirm(false);
                          onLogout();
                        }}
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          borderRadius: 8,
                          background: colors.brown,
                          border: "none",
                          color: "#3D2B1F",
                          cursor: "pointer",
                          fontFamily: "'Lora', serif",
                        }}
                        data-ocid="settings.deactivate.confirm_button"
                      >
                        Deactivate
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  data-ocid="settings.delete_account.modal"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    style={{
                      background: colors.paper,
                      borderRadius: 16,
                      padding: "1.5rem",
                      width: "min(340px, 90vw)",
                      boxShadow: "0 8px 32px rgba(92,61,46,0.2)",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#c0392b",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Delete Account
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Lora', serif",
                        color: colors.muted,
                        fontSize: "0.9rem",
                        marginBottom: "1rem",
                      }}
                    >
                      This action is permanent and cannot be undone. Type{" "}
                      <strong>DELETE</strong> to confirm.
                    </p>
                    <input
                      style={inputStyle}
                      placeholder="Type DELETE to confirm"
                      value={deleteText}
                      onChange={(e) => setDeleteText(e.target.value)}
                      data-ocid="settings.delete_confirm.input"
                    />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteText("");
                        }}
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          borderRadius: 8,
                          border: "1px solid rgba(139,111,71,0.25)",
                          background: "transparent",
                          color: colors.muted,
                          cursor: "pointer",
                          fontFamily: "'Lora', serif",
                        }}
                        data-ocid="settings.delete_account.cancel_button"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (deleteText === "DELETE") {
                            setShowDeleteConfirm(false);
                            setDeleteText("");
                            onLogout();
                          }
                        }}
                        disabled={deleteText !== "DELETE"}
                        style={{
                          flex: 1,
                          padding: "0.6rem",
                          borderRadius: 8,
                          background:
                            deleteText === "DELETE"
                              ? "#c0392b"
                              : "rgba(192,57,43,0.4)",
                          border: "none",
                          color: "#3D2B1F",
                          cursor:
                            deleteText === "DELETE" ? "pointer" : "not-allowed",
                          fontFamily: "'Lora', serif",
                        }}
                        data-ocid="settings.delete_account.confirm_button"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        padding: "2rem 1rem",
        fontFamily: "'Lora', serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            color: colors.mocha,
            marginBottom: "0.5rem",
            letterSpacing: "-0.01em",
          }}
        >
          Your Space
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            color: colors.gold,
            fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
          }}
        >
          "You don't need to be seen by everyone… just understood by the right
          ones."
        </motion.p>
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          gap: "1.5rem",
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            width: 200,
            flexShrink: 0,
            background: colors.paper,
            borderRadius: 16,
            padding: "1rem 0.5rem",
            boxShadow: "0 2px 12px rgba(92,61,46,0.08)",
            border: "1px solid rgba(139,111,71,0.25)",
            position: "sticky",
            top: 16,
            display: window.innerWidth < 640 ? "none" : undefined,
          }}
        >
          {SECTIONS.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: 8,
                border: "none",
                background:
                  activeSection === s.id
                    ? "rgba(212,168,83,0.12)"
                    : "transparent",
                color: activeSection === s.id ? colors.mocha : colors.muted,
                fontFamily: "'Lora', serif",
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left",
                borderLeft:
                  activeSection === s.id
                    ? `3px solid ${colors.gold}`
                    : "3px solid transparent",
                transition: "all 0.2s",
              }}
              data-ocid={`settings.${s.id}.link`}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </motion.div>

        {/* Mobile section tabs */}
        <div
          style={{
            display: window.innerWidth < 640 ? "block" : "none",
            marginBottom: "1rem",
          }}
        >
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            style={{ ...selectStyle, marginBottom: 0 }}
          >
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, minWidth: 0 }}
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
}
