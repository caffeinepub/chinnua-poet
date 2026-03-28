import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCamera } from "../camera/useCamera";

interface User {
  username: string;
  bio: string;
  createdAt: string;
}

interface SettingsSlideProps {
  currentUser: User | null;
  onLogout: () => void;
  onNavigate?: (slide: string) => void;
}

interface UserSettings {
  displayName: string;
  bio: string;
  profilePhoto: string;
  accountVisibility: "public" | "private";
  defaultPostPrivacy: "public" | "followers" | "private";
  showInSearch: boolean;
  allowMessagesFrom: "everyone" | "followers" | "nobody";
  notifyLikes: boolean;
  notifyComments: boolean;
  notifyFollowers: boolean;
  notifyMessages: boolean;
  notifyReplies: boolean;
  fontStyle: "classic" | "soft";
  textSize: "small" | "medium" | "large";
  writingMode: "free" | "structured";
  autoSave: boolean;
  writingSuggestions: boolean;
  enableAI: boolean;
  aiMode: "emotional" | "philosophical" | "minimal";
  aiAutoSuggest: boolean;
  readReceipts: boolean;
  typingIndicator: boolean;
  allowCalls: boolean;
  cameraDefault: "front" | "back";
  showPoemsOnly: boolean;
  hideSensitive: boolean;
  emailUpdates: boolean;
  newPoemsNotify: boolean;
  communityHighlights: boolean;
  twoFactor: boolean;
}

const defaultSettings: UserSettings = {
  displayName: "",
  bio: "",
  profilePhoto: "",
  accountVisibility: "public",
  defaultPostPrivacy: "public",
  showInSearch: true,
  allowMessagesFrom: "everyone",
  notifyLikes: true,
  notifyComments: true,
  notifyFollowers: true,
  notifyMessages: true,
  notifyReplies: true,
  fontStyle: "classic",
  textSize: "medium",
  writingMode: "free",
  autoSave: true,
  writingSuggestions: true,
  enableAI: true,
  aiMode: "emotional",
  aiAutoSuggest: false,
  readReceipts: true,
  typingIndicator: true,
  allowCalls: true,
  cameraDefault: "front",
  showPoemsOnly: false,
  hideSensitive: false,
  emailUpdates: false,
  newPoemsNotify: true,
  communityHighlights: false,
  twoFactor: false,
};

const card: React.CSSProperties = {
  background: "#1A1410",
  border: "1px solid rgba(200,169,106,0.2)",
  borderRadius: 12,
  padding: "1.5rem",
  transition: "box-shadow 0.6s ease",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "1.05rem",
  color: "#C8A96A",
  margin: 0,
  fontWeight: 700,
  letterSpacing: "0.03em",
};

const divider: React.CSSProperties = {
  height: 1,
  background: "rgba(200,169,106,0.15)",
  margin: "0.75rem 0 1rem",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Libre Baskerville', Georgia, serif",
  fontSize: "0.78rem",
  color: "rgba(245,230,211,0.65)",
  letterSpacing: "0.06em",
};

const inputSx: React.CSSProperties = {
  width: "100%",
  background: "#0D0D0D",
  border: "1px solid rgba(200,169,106,0.22)",
  borderRadius: 6,
  padding: "0.55rem 0.8rem",
  color: "#F5E6D3",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "1rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box" as const,
};

function Toggle({
  on,
  onChange,
  id,
}: { on: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? "#C8A96A" : "rgba(255,255,255,0.1)",
        border: on
          ? "1px solid rgba(200,169,106,0.5)"
          : "1px solid rgba(255,255,255,0.15)",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.3s, border-color 0.3s",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 22 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: on ? "#1A1410" : "rgba(255,255,255,0.5)",
          transition: "left 0.3s, background 0.3s",
          display: "block",
        }}
      />
    </button>
  );
}

function ToggleRow({
  label,
  id,
  on,
  onChange,
  note,
}: {
  label: string;
  id: string;
  on: boolean;
  onChange: (v: boolean) => void;
  note?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.45rem 0",
        gap: "1rem",
      }}
    >
      <div>
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
        {note && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.75rem",
              color: "rgba(245,230,211,0.35)",
              margin: "0.1rem 0 0",
            }}
          >
            {note}
          </p>
        )}
      </div>
      <Toggle on={on} onChange={onChange} id={id} />
    </div>
  );
}

function RadioRow({
  label,
  options,
  value,
  onChange,
  name,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div style={{ padding: "0.4rem 0" }}>
      <p style={{ ...labelStyle, marginBottom: "0.5rem" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {options.map((opt) => (
          <label
            key={opt.value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.75rem",
              color: value === opt.value ? "#C8A96A" : "rgba(245,230,211,0.5)",
              transition: "color 0.2s",
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              style={{ accentColor: "#C8A96A" }}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function SelectRow({
  label,
  id,
  value,
  onChange,
  options,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ padding: "0.4rem 0" }}>
      <label
        htmlFor={id}
        style={{ ...labelStyle, display: "block", marginBottom: "0.35rem" }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputSx,
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: "0.85rem",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SettingsSlide({
  currentUser,
  onLogout,
  onNavigate,
}: SettingsSlideProps) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const camera = useCamera({
    facingMode: settings.cameraDefault === "front" ? "user" : "environment",
    quality: 0.9,
    format: "image/jpeg",
  });

  const username = currentUser?.username ?? "";

  useEffect(() => {
    if (!username) return;
    try {
      const stored = localStorage.getItem(`chinnua_settings_${username}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
      // Load photo from profile storage
      const profile = localStorage.getItem(`chinnua_profile_${username}`);
      if (profile) {
        const p = JSON.parse(profile);
        setSettings((prev) => ({
          ...prev,
          profilePhoto: p.photo ?? "",
          bio: p.bio ?? prev.bio,
        }));
      }
    } catch {}
  }, [username]);

  const save = (updates: Partial<UserSettings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    if (username) {
      localStorage.setItem(
        `chinnua_settings_${username}`,
        JSON.stringify(next),
      );
      // Sync profile photo/bio to profile storage too
      if ("profilePhoto" in updates || "bio" in updates) {
        const profile = { photo: next.profilePhoto, bio: next.bio };
        localStorage.setItem(
          `chinnua_profile_${username}`,
          JSON.stringify(profile),
        );
      }
    }
  };

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => save({ profilePhoto: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async () => {
    const file = await camera.capturePhoto();
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setCapturedPhoto(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmCameraPhoto = () => {
    if (capturedPhoto) {
      save({ profilePhoto: capturedPhoto });
      setCapturedPhoto(null);
      setShowCameraModal(false);
      camera.stopCamera();
    }
  };

  const openCamera = async () => {
    setShowCameraModal(true);
    setCapturedPhoto(null);
    await camera.startCamera();
  };

  const closeCamera = () => {
    setShowCameraModal(false);
    setCapturedPhoto(null);
    camera.stopCamera();
  };

  const handleDeleteAccount = () => {
    // Clear all user data
    if (username) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.includes(username) || k === "chinnua_user"))
          keysToRemove.push(k);
      }
      for (const k of keysToRemove) localStorage.removeItem(k);
    }
    onLogout();
  };

  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0D0D0D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            color: "rgba(245,230,211,0.4)",
            fontSize: "1.1rem",
          }}
        >
          Sign in to access your settings.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0D0D",
        color: "#F5E6D3",
        overflowY: "auto",
        padding: "2.5rem 1rem 4rem",
      }}
      data-ocid="settings.page"
    >
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "2rem",
              color: "#C8A96A",
              margin: "0 0 0.35rem",
              fontWeight: 700,
            }}
          >
            Your Space
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "rgba(245,230,211,0.45)",
              margin: 0,
            }}
          >
            "You don't need to be seen by everyone… just understood by the right
            ones."
          </p>
        </motion.div>

        {/* 👤 Profile Settings */}
        <Section delay={0.05}>
          <h2 style={sectionTitle}>👤 Profile Settings</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {/* Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: settings.profilePhoto
                    ? "transparent"
                    : "rgba(200,169,106,0.12)",
                  border: "2px solid rgba(200,169,106,0.35)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {settings.profilePhoto ? (
                  <img
                    src={settings.profilePhoto}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.6rem",
                      color: "#C8A96A",
                    }}
                  >
                    {username[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  data-ocid="settings.upload_button"
                  style={{
                    background: "rgba(200,169,106,0.1)",
                    border: "1px solid rgba(200,169,106,0.3)",
                    borderRadius: 6,
                    padding: "0.35rem 0.75rem",
                    color: "#C8A96A",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.72rem",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  📁 Upload
                </button>
                <button
                  type="button"
                  onClick={openCamera}
                  data-ocid="settings.secondary_button"
                  style={{
                    background: "rgba(200,169,106,0.1)",
                    border: "1px solid rgba(200,169,106,0.3)",
                    borderRadius: 6,
                    padding: "0.35rem 0.75rem",
                    color: "#C8A96A",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.72rem",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  📷 Camera
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFile}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="settings-displayname"
                style={{
                  ...labelStyle,
                  display: "block",
                  marginBottom: "0.3rem",
                }}
              >
                Display Name / Pen Name
              </label>
              <input
                id="settings-displayname"
                value={settings.displayName}
                onChange={(e) => save({ displayName: e.target.value })}
                placeholder={username}
                data-ocid="settings.input"
                style={inputSx}
              />
            </div>
            <div>
              <label
                htmlFor="settings-bio"
                style={{
                  ...labelStyle,
                  display: "block",
                  marginBottom: "0.3rem",
                }}
              >
                Bio
              </label>
              <textarea
                id="settings-bio"
                value={settings.bio}
                onChange={(e) => save({ bio: e.target.value })}
                placeholder="A few words about yourself…"
                rows={4}
                data-ocid="settings.textarea"
                style={{ ...inputSx, resize: "none" }}
              />
            </div>
            <GoldButton
              onClick={() => {}}
              label="Save Changes"
              ocid="settings.save_button"
            />
          </div>
        </Section>

        {/* 🔒 Privacy Settings */}
        <Section delay={0.1}>
          <h2 style={sectionTitle}>🔒 Privacy Settings</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <RadioRow
              label="Account Visibility"
              options={[
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ]}
              value={settings.accountVisibility}
              onChange={(v) =>
                save({ accountVisibility: v as "public" | "private" })
              }
              name="visibility"
            />
            <SelectRow
              label="Default Post Privacy"
              id="post-privacy"
              value={settings.defaultPostPrivacy}
              onChange={(v) =>
                save({
                  defaultPostPrivacy: v as "public" | "followers" | "private",
                })
              }
              options={[
                { value: "public", label: "Public" },
                { value: "followers", label: "Followers Only" },
                { value: "private", label: "Private" },
              ]}
            />
            <ToggleRow
              label="Show Profile in Search"
              id="show-search"
              on={settings.showInSearch}
              onChange={(v) => save({ showInSearch: v })}
            />
            <SelectRow
              label="Allow Messages From"
              id="msg-from"
              value={settings.allowMessagesFrom}
              onChange={(v) =>
                save({
                  allowMessagesFrom: v as "everyone" | "followers" | "nobody",
                })
              }
              options={[
                { value: "everyone", label: "Everyone" },
                { value: "followers", label: "Followers Only" },
                { value: "nobody", label: "No One" },
              ]}
            />
          </div>
        </Section>

        {/* 🔔 Notification Settings */}
        <Section delay={0.13}>
          <h2 style={sectionTitle}>🔔 Notification Settings</h2>
          <div style={divider} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ToggleRow
              label="Likes"
              id="notify-likes"
              on={settings.notifyLikes}
              onChange={(v) => save({ notifyLikes: v })}
            />
            <ToggleRow
              label="Comments"
              id="notify-comments"
              on={settings.notifyComments}
              onChange={(v) => save({ notifyComments: v })}
            />
            <ToggleRow
              label="New Followers"
              id="notify-followers"
              on={settings.notifyFollowers}
              onChange={(v) => save({ notifyFollowers: v })}
            />
            <ToggleRow
              label="Messages"
              id="notify-messages"
              on={settings.notifyMessages}
              onChange={(v) => save({ notifyMessages: v })}
            />
            <ToggleRow
              label="Community Replies"
              id="notify-replies"
              on={settings.notifyReplies}
              onChange={(v) => save({ notifyReplies: v })}
            />
          </div>
        </Section>

        {/* 🎨 Appearance */}
        <Section delay={0.16}>
          <h2 style={sectionTitle}>🎨 Appearance</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div style={{ padding: "0.4rem 0" }}>
              <p style={labelStyle}>Theme</p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                  color: "rgba(245,230,211,0.35)",
                  margin: "0.3rem 0 0",
                }}
              >
                Dark — the only mode worthy of these words.
              </p>
            </div>
            <RadioRow
              label="Font Style"
              options={[
                { value: "classic", label: "Classic Serif" },
                { value: "soft", label: "Soft Serif" },
              ]}
              value={settings.fontStyle}
              onChange={(v) => save({ fontStyle: v as "classic" | "soft" })}
              name="font-style"
            />
            <RadioRow
              label="Text Size"
              options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
              ]}
              value={settings.textSize}
              onChange={(v) =>
                save({ textSize: v as "small" | "medium" | "large" })
              }
              name="text-size"
            />
            {/* Preview */}
            <div
              style={{
                marginTop: "0.5rem",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(200,169,106,0.1)",
                borderRadius: 8,
                padding: "1rem",
              }}
            >
              <p
                style={{
                  fontFamily:
                    settings.fontStyle === "soft"
                      ? "'Cormorant Garamond', Georgia, serif"
                      : "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontSize:
                    settings.textSize === "small"
                      ? "0.82rem"
                      : settings.textSize === "large"
                        ? "1.05rem"
                        : "0.92rem",
                  color: "rgba(245,230,211,0.6)",
                  margin: 0,
                  lineHeight: 1.8,
                }}
              >
                "Not every poet writes… some just bleed quietly."
              </p>
            </div>
          </div>
        </Section>

        {/* ✍️ Writing Preferences */}
        <Section delay={0.19}>
          <h2 style={sectionTitle}>✍️ Writing Preferences</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <RadioRow
              label="Default Writing Mode"
              options={[
                { value: "free", label: "Free Verse" },
                { value: "structured", label: "Structured" },
              ]}
              value={settings.writingMode}
              onChange={(v) =>
                save({ writingMode: v as "free" | "structured" })
              }
              name="writing-mode"
            />
            <ToggleRow
              label="Auto-save Poems"
              id="auto-save"
              on={settings.autoSave}
              onChange={(v) => save({ autoSave: v })}
            />
            <ToggleRow
              label="Writing Suggestions"
              id="writing-suggest"
              on={settings.writingSuggestions}
              onChange={(v) => save({ writingSuggestions: v })}
            />
            <ToggleRow
              label="Enable AI Assistant"
              id="enable-ai"
              on={settings.enableAI}
              onChange={(v) => save({ enableAI: v })}
            />
          </div>
        </Section>

        {/* 🤖 AI Assistant */}
        <Section delay={0.22}>
          <h2 style={sectionTitle}>🤖 The Silent Listener</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <ToggleRow
              label="Enable AI"
              id="ai-enable"
              on={settings.enableAI}
              onChange={(v) => save({ enableAI: v })}
            />
            <RadioRow
              label="Mode"
              options={[
                { value: "emotional", label: "Soft Emotional" },
                { value: "philosophical", label: "Deep Philosophical" },
                { value: "minimal", label: "Minimal" },
              ]}
              value={settings.aiMode}
              onChange={(v) =>
                save({ aiMode: v as "emotional" | "philosophical" | "minimal" })
              }
              name="ai-mode"
            />
            <ToggleRow
              label="Auto-suggest lines while typing"
              id="ai-suggest"
              on={settings.aiAutoSuggest}
              onChange={(v) => save({ aiAutoSuggest: v })}
            />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.82rem",
                color: "rgba(245,230,211,0.35)",
                margin: "0.25rem 0 0",
              }}
            >
              "Sometimes silence needs a voice."
            </p>
          </div>
        </Section>

        {/* 💬 Messaging Settings */}
        <Section delay={0.25}>
          <h2 style={sectionTitle}>💬 Messaging Settings</h2>
          <div style={divider} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ToggleRow
              label="Read Receipts"
              id="read-receipts"
              on={settings.readReceipts}
              onChange={(v) => save({ readReceipts: v })}
            />
            <ToggleRow
              label="Typing Indicator"
              id="typing-indicator"
              on={settings.typingIndicator}
              onChange={(v) => save({ typingIndicator: v })}
            />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.75rem",
                color: "rgba(245,230,211,0.3)",
                margin: "0.5rem 0 0",
              }}
            >
              To mute specific conversations, open the Messages section.
            </p>
          </div>
        </Section>

        {/* 🔐 Voice & Video Call Settings */}
        <Section delay={0.28}>
          <h2 style={sectionTitle}>🔐 Voice & Video Calls</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <ToggleRow
              label="Allow Incoming Calls"
              id="allow-calls"
              on={settings.allowCalls}
              onChange={(v) => save({ allowCalls: v })}
            />
            <RadioRow
              label="Camera Default"
              options={[
                { value: "front", label: "Front" },
                { value: "back", label: "Back" },
              ]}
              value={settings.cameraDefault}
              onChange={(v) => save({ cameraDefault: v as "front" | "back" })}
              name="cam-default"
            />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.78rem",
                color: "rgba(245,230,211,0.35)",
                margin: "0.25rem 0 0",
              }}
            >
              Calls are private and peer-to-peer. No recordings are stored.
            </p>
          </div>
        </Section>

        {/* 🖼️ Content Preferences */}
        <Section delay={0.31}>
          <h2 style={sectionTitle}>🖼️ Content Preferences</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <RadioRow
              label="Show"
              options={[
                { value: "all", label: "Poems + Images" },
                { value: "poems", label: "Poems Only" },
              ]}
              value={settings.showPoemsOnly ? "poems" : "all"}
              onChange={(v) => save({ showPoemsOnly: v === "poems" })}
              name="content-pref"
            />
            <ToggleRow
              label="Hide Sensitive Content"
              id="hide-sensitive"
              on={settings.hideSensitive}
              onChange={(v) => save({ hideSensitive: v })}
            />
            <div style={{ padding: "0.4rem 0" }}>
              <p style={labelStyle}>Language</p>
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.8rem",
                  color: "rgba(245,230,211,0.5)",
                  margin: "0.3rem 0 0",
                }}
              >
                English — use the 🌐 translator to read in other languages.
              </p>
            </div>
          </div>
        </Section>

        {/* 🔐 Security Settings */}
        <Section delay={0.34}>
          <h2 style={sectionTitle}>🔐 Security Settings</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <button
              type="button"
              onClick={() => setShowChangePassword(true)}
              data-ocid="settings.secondary_button"
              style={{
                background: "transparent",
                border: "1px solid rgba(200,169,106,0.25)",
                borderRadius: 7,
                padding: "0.55rem 1rem",
                color: "rgba(245,230,211,0.7)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.8rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.3s, color 0.3s",
              }}
            >
              🔑 Change Password
            </button>
            <div style={{ padding: "0.3rem 0" }}>
              <p style={labelStyle}>Connected Account</p>
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.8rem",
                  color: "rgba(245,230,211,0.45)",
                  margin: "0.25rem 0 0",
                }}
              >
                Gmail / Email address on file
              </p>
            </div>
            <ToggleRow
              label="Two-factor Authentication"
              id="two-factor"
              on={settings.twoFactor}
              onChange={(v) => {
                save({ twoFactor: v });
                if (v) alert("Two-factor authentication — Coming soon.");
              }}
              note="Coming soon"
            />
            <button
              type="button"
              onClick={onLogout}
              data-ocid="settings.secondary_button"
              style={{
                background: "transparent",
                border: "1px solid rgba(200,169,106,0.3)",
                borderRadius: 7,
                padding: "0.55rem 1rem",
                color: "#C8A96A",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Sign Out from all devices
            </button>
          </div>
        </Section>

        {/* 📩 Email & Newsletter */}
        <Section delay={0.37}>
          <h2 style={sectionTitle}>📩 Email & Newsletter</h2>
          <div style={divider} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ToggleRow
              label="Receive Email Updates"
              id="email-updates"
              on={settings.emailUpdates}
              onChange={(v) => save({ emailUpdates: v })}
            />
            <ToggleRow
              label="New Poems Notifications"
              id="poem-notify"
              on={settings.newPoemsNotify}
              onChange={(v) => save({ newPoemsNotify: v })}
            />
            <ToggleRow
              label="Community Highlights"
              id="community-highlights"
              on={settings.communityHighlights}
              onChange={(v) => save({ communityHighlights: v })}
            />
          </div>
        </Section>

        {/* 🚪 Account Controls */}
        <Section delay={0.4}>
          <h2 style={sectionTitle}>🚪 Account Controls</h2>
          <div style={divider} />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <button
              type="button"
              onClick={onLogout}
              data-ocid="settings.secondary_button"
              style={{
                background: "transparent",
                border: "1px solid rgba(200,169,106,0.3)",
                borderRadius: 7,
                padding: "0.55rem 1rem",
                color: "#C8A96A",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.8rem",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.3s",
              }}
            >
              Sign Out
            </button>
            <button
              type="button"
              onClick={() => {}}
              data-ocid="settings.secondary_button"
              style={{
                background: "transparent",
                border: "1px solid rgba(245,230,211,0.1)",
                borderRadius: 7,
                padding: "0.55rem 1rem",
                color: "rgba(245,230,211,0.35)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.8rem",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.3s",
              }}
            >
              Deactivate Account
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              data-ocid="settings.delete_button"
              style={{
                background: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.3)",
                borderRadius: 7,
                padding: "0.55rem 1rem",
                color: "rgba(220,100,100,0.85)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.8rem",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.3s",
              }}
            >
              Delete Account
            </button>
          </div>
        </Section>

        {/* ── Legal Links ── */}
        <Section delay={0.5}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onNavigate?.("terms")}
              data-ocid="settings.link"
              style={{
                background: "none",
                border: "none",
                color: "rgba(200,169,106,0.5)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.78rem",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Terms of Service
            </button>
            <span
              style={{ color: "rgba(245,230,211,0.2)", fontSize: "0.78rem" }}
            >
              ·
            </span>
            <button
              type="button"
              onClick={() => onNavigate?.("privacy")}
              data-ocid="settings.link"
              style={{
                background: "none",
                border: "none",
                color: "rgba(200,169,106,0.5)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.78rem",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Privacy Policy
            </button>
          </div>
          <p
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.72rem",
              color: "rgba(245,230,211,0.2)",
              marginTop: "0.5rem",
              fontStyle: "italic",
            }}
          >
            "This platform is built on trust, expression, and silence that
            finally found a voice."
          </p>
        </Section>
      </div>

      {/* ── Camera Modal ── */}
      <AnimatePresence>
        {showCameraModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(6px)",
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            data-ocid="settings.modal"
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              style={{
                background: "#1A1410",
                border: "1px solid rgba(200,169,106,0.25)",
                borderRadius: 14,
                padding: "1.5rem",
                width: "100%",
                maxWidth: 480,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "#C8A96A",
                  margin: 0,
                }}
              >
                Take a Photo
              </h3>
              <div
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#000",
                  minHeight: 240,
                  position: "relative",
                }}
              >
                {capturedPhoto ? (
                  <img
                    src={capturedPhoto}
                    alt="Preview"
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <video
                      ref={camera.videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: "100%",
                        display: camera.isActive ? "block" : "none",
                      }}
                    />
                    <canvas
                      ref={camera.canvasRef}
                      style={{ display: "none" }}
                    />
                    {!camera.isActive && !camera.isLoading && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 240,
                          color: "rgba(245,230,211,0.4)",
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.85rem",
                        }}
                      >
                        {camera.error
                          ? camera.error.message
                          : "Camera inactive"}
                      </div>
                    )}
                    {camera.isLoading && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 240,
                          color: "#C8A96A",
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.85rem",
                        }}
                      >
                        Starting camera…
                      </div>
                    )}
                  </>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {!capturedPhoto ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCameraCapture}
                      disabled={!camera.isActive}
                      data-ocid="settings.primary_button"
                      style={{
                        flex: 1,
                        background: "rgba(200,169,106,0.85)",
                        border: "none",
                        borderRadius: 7,
                        padding: "0.55rem",
                        color: "#1A1410",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      📸 Capture
                    </button>
                    <button
                      type="button"
                      onClick={() => camera.switchCamera()}
                      data-ocid="settings.toggle"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 7,
                        padding: "0.55rem 0.75rem",
                        color: "rgba(245,230,211,0.65)",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                      }}
                    >
                      🔄
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={confirmCameraPhoto}
                      data-ocid="settings.confirm_button"
                      style={{
                        flex: 1,
                        background: "rgba(200,169,106,0.85)",
                        border: "none",
                        borderRadius: 7,
                        padding: "0.55rem",
                        color: "#1A1410",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      ✓ Use Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setCapturedPhoto(null)}
                      data-ocid="settings.secondary_button"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 7,
                        padding: "0.55rem 0.75rem",
                        color: "rgba(245,230,211,0.65)",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                      }}
                    >
                      Retake
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={closeCamera}
                  data-ocid="settings.close_button"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(245,230,211,0.12)",
                    borderRadius: 7,
                    padding: "0.55rem 0.75rem",
                    color: "rgba(245,230,211,0.45)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm dialog ── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            data-ocid="settings.dialog"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              style={{
                background: "#1A1410",
                border: "1px solid rgba(220,38,38,0.3)",
                borderRadius: 14,
                padding: "2rem",
                maxWidth: 400,
                width: "100%",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.1rem",
                  color: "#F5E6D3",
                  marginBottom: "0.5rem",
                }}
              >
                Delete Account?
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                  color: "rgba(245,230,211,0.45)",
                  marginBottom: "1.5rem",
                }}
              >
                This cannot be undone. All your poems and notes will be deleted.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  data-ocid="settings.confirm_button"
                  style={{
                    background: "rgba(220,38,38,0.8)",
                    border: "none",
                    borderRadius: 7,
                    padding: "0.55rem 1.25rem",
                    color: "#fff",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  data-ocid="settings.cancel_button"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(245,230,211,0.2)",
                    borderRadius: 7,
                    padding: "0.55rem 1.25rem",
                    color: "rgba(245,230,211,0.55)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Change Password modal ── */}
      <AnimatePresence>
        {showChangePassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            data-ocid="settings.modal"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              style={{
                background: "#1A1410",
                border: "1px solid rgba(200,169,106,0.2)",
                borderRadius: 14,
                padding: "2rem",
                maxWidth: 380,
                width: "100%",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "#C8A96A",
                  margin: "0 0 1.25rem",
                }}
              >
                Change Password
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <label
                    htmlFor="old-pw"
                    style={{
                      ...labelStyle,
                      display: "block",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Current Password
                  </label>
                  <input
                    id="old-pw"
                    type="password"
                    value={oldPw}
                    onChange={(e) => setOldPw(e.target.value)}
                    data-ocid="settings.input"
                    style={inputSx}
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-pw"
                    style={{
                      ...labelStyle,
                      display: "block",
                      marginBottom: "0.3rem",
                    }}
                  >
                    New Password
                  </label>
                  <input
                    id="new-pw"
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    data-ocid="settings.input"
                    style={inputSx}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setOldPw("");
                      setNewPw("");
                    }}
                    data-ocid="settings.confirm_button"
                    style={{
                      flex: 1,
                      background: "rgba(200,169,106,0.85)",
                      border: "none",
                      borderRadius: 7,
                      padding: "0.55rem",
                      color: "#1A1410",
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setOldPw("");
                      setNewPw("");
                    }}
                    data-ocid="settings.cancel_button"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(245,230,211,0.15)",
                      borderRadius: 7,
                      padding: "0.55rem 1rem",
                      color: "rgba(245,230,211,0.5)",
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  children,
  delay,
}: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      style={card}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 20px rgba(200,169,106,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {children}
    </motion.div>
  );
}

function GoldButton({
  onClick,
  label,
  ocid,
}: { onClick: () => void; label: string; ocid: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      style={{
        background: "#C8A96A",
        border: "none",
        borderRadius: 7,
        padding: "0.6rem 1.5rem",
        color: "#1A1410",
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontSize: "0.82rem",
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: "0.06em",
        transition: "box-shadow 0.6s ease, transform 0.2s",
        alignSelf: "flex-start",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 0 16px rgba(200,169,106,0.45)";
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(0)";
      }}
    >
      {label}
    </button>
  );
}
