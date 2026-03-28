import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCamera } from "../camera/useCamera";
import { POEMS } from "../poems-data";

interface User {
  username: string;
  bio: string;
  createdAt: string;
  profilePhoto?: string;
}

interface Post {
  id: string;
  username: string;
  title: string;
  preview: string;
  fullContent: string;
  category: string;
  timestamp: string;
  likes: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileSlideProps {
  viewUsername: string;
  currentUser: User | null;
  onBack: () => void;
  onGoToMessages: () => void;
  onLogin: () => void;
}

type Tab = "posts" | "notes" | "likes" | "messages";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildAllPosts(): Post[] {
  const base = new Date("2024-01-01").getTime();
  const poemPosts: Post[] = POEMS.map((p, i) => ({
    id: `poem_${p.id}`,
    username: "CHINNUA_POET",
    title: p.title,
    preview: p.full.split("\n").filter(Boolean).slice(0, 3).join("\n"),
    fullContent: p.full,
    category: p.theme || "Poetry",
    timestamp: new Date(base + i * 172800000).toISOString(),
    likes: 0,
  }));
  let userPosts: Post[] = [];
  try {
    userPosts = JSON.parse(localStorage.getItem("chinnua_posts") || "[]");
  } catch {}
  const deletedIds = new Set<string>(
    JSON.parse(localStorage.getItem("chinnua_deleted_posts") || "[]"),
  );
  const likesMap: Record<string, number> = JSON.parse(
    localStorage.getItem("chinnua_likes") || "{}",
  );
  return [...userPosts, ...poemPosts]
    .filter((p) => !deletedIds.has(p.id))
    .map((p) => ({ ...p, likes: likesMap[p.id] ?? p.likes }))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
}

function loadNotes(username: string): Note[] {
  try {
    return JSON.parse(
      localStorage.getItem(`chinnua_notes_${username}`) || "[]",
    );
  } catch {
    return [];
  }
}

function saveNotes(username: string, notes: Note[]) {
  localStorage.setItem(`chinnua_notes_${username}`, JSON.stringify(notes));
}

const GoldBtn: React.CSSProperties = {
  background: "rgba(200,169,106,0.1)",
  border: "1px solid rgba(200,169,106,0.3)",
  borderRadius: 6,
  padding: "0.4rem 0.9rem",
  color: "#C8A96A",
  fontFamily: "'Libre Baskerville', Georgia, serif",
  fontSize: "0.73rem",
  letterSpacing: "0.06em",
  cursor: "pointer",
  transition: "all 0.2s",
  textTransform: "uppercase" as const,
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

export default function UserProfileSlide({
  viewUsername,
  currentUser,
  onBack,
  onGoToMessages,
  onLogin,
}: UserProfileSlideProps) {
  const isOwn = currentUser?.username === viewUsername;
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  // ── Profile editing ──
  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState(viewUsername);
  const [editBio, setEditBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const camera = useCamera({
    facingMode: "user",
    quality: 0.9,
    format: "image/jpeg",
  });

  // ── Posts ──
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editPostText, setEditPostText] = useState("");
  const [confirmDeletePost, setConfirmDeletePost] = useState<string | null>(
    null,
  );

  // ── Notes ──
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState("");
  const [editNoteContent, setEditNoteContent] = useState("");
  const [editNotePublic, setEditNotePublic] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    // load user info
    const storedUser = localStorage.getItem(`chinnua_profile_${viewUsername}`);
    if (storedUser) {
      try {
        const p = JSON.parse(storedUser);
        setEditBio(p.bio ?? "");
        setProfilePhoto(p.photo ?? "");
      } catch {}
    } else if (isOwn && currentUser) {
      setEditBio(currentUser.bio ?? "");
    }
    setEditUsername(viewUsername);
    // load posts
    setAllPosts(buildAllPosts());
    // load notes
    setNotes(loadNotes(viewUsername));
  }, [viewUsername, isOwn, currentUser]);

  const userPosts = allPosts.filter((p) => p.username === viewUsername);
  const likedIds: string[] = JSON.parse(
    localStorage.getItem("chinnua_liked_ids") || "[]",
  );
  const likedPosts = isOwn
    ? allPosts.filter((p) => likedIds.includes(p.id))
    : [];
  const visibleNotes = isOwn ? notes : notes.filter((n) => n.isPublic);

  const [displayBio, setDisplayBio] = useState("");
  useEffect(() => {
    const storedUser = localStorage.getItem(`chinnua_profile_${viewUsername}`);
    if (storedUser) {
      try {
        const p = JSON.parse(storedUser);
        setDisplayBio(p.bio ?? "");
        setProfilePhoto(p.photo ?? "");
      } catch {}
    } else if (isOwn && currentUser) {
      setDisplayBio(currentUser.bio ?? "");
    }
  }, [viewUsername, isOwn, currentUser]);

  // ── Profile save ──
  const handleSaveProfile = () => {
    if (!editUsername.trim()) return;
    const profileData = { bio: editBio, photo: profilePhoto };
    localStorage.setItem(
      `chinnua_profile_${viewUsername}`,
      JSON.stringify(profileData),
    );
    setDisplayBio(editBio);
    // update chinnua_user
    const cu = localStorage.getItem("chinnua_user");
    if (cu) {
      try {
        const parsed = JSON.parse(cu);
        parsed.bio = editBio;
        localStorage.setItem("chinnua_user", JSON.stringify(parsed));
      } catch {}
    }
    setEditMode(false);
  };

  // ── Photo upload ──
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfilePhoto(dataUrl);
    };
    reader.readAsDataURL(file);
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

  const handleCameraCapture = async () => {
    const file = await camera.capturePhoto();
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCapturedPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const confirmCameraPhoto = () => {
    if (capturedPhoto) {
      setProfilePhoto(capturedPhoto);
      setCapturedPhoto(null);
      setShowCameraModal(false);
      camera.stopCamera();
    }
  };

  // ── Post edit/delete ──
  const handleSavePostEdit = () => {
    if (!editingPost || !editPostText.trim()) return;
    const stored: Post[] = JSON.parse(
      localStorage.getItem("chinnua_posts") || "[]",
    );
    const updated = stored.map((p) =>
      p.id === editingPost.id
        ? { ...p, preview: editPostText, fullContent: editPostText }
        : p,
    );
    localStorage.setItem("chinnua_posts", JSON.stringify(updated));
    setAllPosts((prev) =>
      prev.map((p) =>
        p.id === editingPost.id
          ? { ...p, preview: editPostText, fullContent: editPostText }
          : p,
      ),
    );
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    const stored: Post[] = JSON.parse(
      localStorage.getItem("chinnua_posts") || "[]",
    );
    const filtered = stored.filter((p) => p.id !== postId);
    localStorage.setItem("chinnua_posts", JSON.stringify(filtered));
    const deleted: string[] = JSON.parse(
      localStorage.getItem("chinnua_deleted_posts") || "[]",
    );
    deleted.push(postId);
    localStorage.setItem("chinnua_deleted_posts", JSON.stringify(deleted));
    setAllPosts((prev) => prev.filter((p) => p.id !== postId));
    setConfirmDeletePost(null);
  };

  // ── Note CRUD ──
  const openNewNote = () => {
    setEditingNote(null);
    setEditNoteTitle("");
    setEditNoteContent("");
    setEditNotePublic(false);
    setShowNoteForm(true);
  };

  const openEditNote = (note: Note) => {
    setEditingNote(note);
    setEditNoteTitle(note.title);
    setEditNoteContent(note.content);
    setEditNotePublic(note.isPublic);
    setShowNoteForm(true);
  };

  const handleSaveNote = () => {
    if (!editNoteTitle.trim() || !currentUser) return;
    const now = new Date().toISOString();
    if (editingNote) {
      const updated = notes.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              title: editNoteTitle.trim(),
              content: editNoteContent,
              isPublic: editNotePublic,
              updatedAt: now,
            }
          : n,
      );
      setNotes(updated);
      saveNotes(viewUsername, updated);
    } else {
      const newNote: Note = {
        id: `note_${Date.now()}`,
        title: editNoteTitle.trim(),
        content: editNoteContent,
        isPublic: editNotePublic,
        createdAt: now,
        updatedAt: now,
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      saveNotes(viewUsername, updated);
    }
    setShowNoteForm(false);
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    saveNotes(viewUsername, updated);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "posts", label: "Posts" },
    { key: "notes", label: "Notes" },
    ...(isOwn
      ? [
          { key: "likes" as Tab, label: "Likes" },
          { key: "messages" as Tab, label: "Messages" },
        ]
      : []),
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0D0D",
        color: "#F5E6D3",
        display: "flex",
        flexDirection: "column",
      }}
      data-ocid="profile.page"
    >
      {/* Back bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(13,13,13,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(200,169,106,0.12)",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          data-ocid="profile.secondary_button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(200,169,106,0.7)",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: 0,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#C8A96A";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(200,169,106,0.7)";
          }}
        >
          ← Back
        </button>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "0.8rem",
            color: "rgba(245,230,211,0.5)",
            letterSpacing: "0.05em",
          }}
        >
          {viewUsername}
        </span>
      </div>

      {/* Profile header */}
      <div
        style={{
          padding: "2.5rem 1.5rem 1.5rem",
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: profilePhoto
                  ? "transparent"
                  : "rgba(200,169,106,0.12)",
                border: "2px solid rgba(200,169,106,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 0 18px rgba(200,169,106,0.1)",
                cursor: isOwn && editMode ? "pointer" : "default",
              }}
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "2rem",
                    color: "#C8A96A",
                    fontWeight: 700,
                  }}
                >
                  {viewUsername[0]?.toUpperCase()}
                </span>
              )}
            </div>
            {isOwn && editMode && (
              <>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  data-ocid="profile.upload_button"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#1A1410",
                    border: "1px solid rgba(200,169,106,0.4)",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#C8A96A",
                    fontSize: "0.65rem",
                  }}
                >
                  ✏
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={openCamera}
                  data-ocid="profile.upload_button"
                  title="Take a photo with camera"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    background: "#1A1410",
                    border: "1px solid rgba(200,169,106,0.4)",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#C8A96A",
                    fontSize: "0.6rem",
                  }}
                >
                  cam
                </button>
              </>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {editMode ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                <div>
                  <label
                    htmlFor="profile-bio-input"
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(200,169,106,0.55)",
                      display: "block",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Bio
                  </label>
                  <textarea
                    id="profile-bio-input"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="A few words about yourself…"
                    rows={3}
                    data-ocid="profile.textarea"
                    style={{
                      ...inputSx,
                      resize: "none",
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.85rem",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(200,169,106,0.45)";
                      e.target.style.boxShadow =
                        "0 0 8px rgba(200,169,106,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(200,169,106,0.22)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    data-ocid="profile.save_button"
                    style={{
                      ...GoldBtn,
                      background: "rgba(200,169,106,0.2)",
                      boxShadow: "0 0 12px rgba(200,169,106,0.1)",
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    data-ocid="profile.cancel_button"
                    style={{ ...GoldBtn, color: "rgba(245,230,211,0.5)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: "0.3rem",
                    flexWrap: "wrap",
                  }}
                >
                  <h1
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color:
                        viewUsername === "CHINNUA_POET" ? "#C8A96A" : "#F5E6D3",
                      margin: 0,
                    }}
                  >
                    {viewUsername === "CHINNUA_POET"
                      ? "✦ CHINNUA_POET"
                      : viewUsername}
                  </h1>
                  {isOwn && (
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      data-ocid="profile.edit_button"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(200,169,106,0.5)",
                        fontSize: "0.85rem",
                        padding: 2,
                        transition: "color 0.2s",
                      }}
                      title="Edit profile"
                    >
                      ✏
                    </button>
                  )}
                </div>
                {displayBio && (
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "0.95rem",
                      color: "rgba(245,230,211,0.65)",
                      lineHeight: 1.6,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {displayBio}
                  </p>
                )}
                {!isOwn && currentUser && (
                  <button
                    type="button"
                    onClick={onGoToMessages}
                    data-ocid="profile.primary_button"
                    style={GoldBtn}
                  >
                    💬 Message
                  </button>
                )}
                {!currentUser && !isOwn && (
                  <button
                    type="button"
                    onClick={onLogin}
                    data-ocid="profile.primary_button"
                    style={GoldBtn}
                  >
                    Sign in to message
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid rgba(200,169,106,0.12)",
            marginTop: "2rem",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              data-ocid={`profile.${tab.key}.tab`}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab.key
                    ? "2px solid #C8A96A"
                    : "2px solid transparent",
                padding: "0.6rem 1.1rem",
                cursor: "pointer",
                color:
                  activeTab === tab.key ? "#C8A96A" : "rgba(245,230,211,0.45)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "color 0.2s, border-color 0.2s",
                marginBottom: "-1px",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(245,230,211,0.75)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(245,230,211,0.45)";
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ paddingTop: "1.5rem" }}
          >
            {/* ── POSTS TAB ── */}
            {activeTab === "posts" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {userPosts.length === 0 ? (
                  <div
                    data-ocid="profile.posts.empty_state"
                    style={{
                      textAlign: "center",
                      padding: "3rem 0",
                      color: "rgba(245,230,211,0.3)",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "1rem",
                    }}
                  >
                    No posts yet.
                  </div>
                ) : (
                  userPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      data-ocid={`profile.posts.item.${idx + 1}`}
                      style={{
                        background: "rgba(26,20,16,0.7)",
                        border: "1px solid rgba(200,169,106,0.12)",
                        borderRadius: 10,
                        padding: "1rem 1.1rem",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "rgba(200,169,106,0.28)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "rgba(200,169,106,0.12)";
                      }}
                    >
                      {post.title && (
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "#F5E6D3",
                            marginBottom: "0.35rem",
                          }}
                        >
                          {post.title}
                        </p>
                      )}
                      {editingPost?.id === post.id ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                          }}
                        >
                          <textarea
                            value={editPostText}
                            onChange={(e) => setEditPostText(e.target.value)}
                            rows={4}
                            data-ocid="profile.posts.textarea"
                            style={{
                              ...inputSx,
                              resize: "none",
                              fontFamily:
                                "'Cormorant Garamond', Georgia, serif",
                              fontSize: "0.9rem",
                            }}
                          />
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              type="button"
                              onClick={handleSavePostEdit}
                              data-ocid="profile.posts.save_button"
                              style={GoldBtn}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPost(null)}
                              data-ocid="profile.posts.cancel_button"
                              style={{
                                ...GoldBtn,
                                color: "rgba(245,230,211,0.45)",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily:
                                "'Cormorant Garamond', Georgia, serif",
                              fontStyle: "italic",
                              fontSize: "0.9rem",
                              color: "rgba(245,230,211,0.65)",
                              lineHeight: 1.7,
                              whiteSpace: "pre-line",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 5,
                              WebkitBoxOrient: "vertical",
                            }}
                            onClick={() => setExpandedPost(post)}
                          >
                            {post.preview}
                          </button>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: "0.6rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.65rem",
                                color: "rgba(245,230,211,0.3)",
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                              }}
                            >
                              {timeAgo(post.timestamp)}
                            </span>
                            {isOwn && !post.id.startsWith("poem_") && (
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPost(post);
                                    setEditPostText(post.fullContent);
                                  }}
                                  data-ocid={`profile.posts.edit_button.${idx + 1}`}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "rgba(200,169,106,0.45)",
                                    fontSize: "0.7rem",
                                    fontFamily:
                                      "'Libre Baskerville', Georgia, serif",
                                    padding: 0,
                                    transition: "color 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "#C8A96A";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "rgba(200,169,106,0.45)";
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeletePost(post.id)}
                                  data-ocid={`profile.posts.delete_button.${idx + 1}`}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "rgba(239,68,68,0.4)",
                                    fontSize: "0.7rem",
                                    fontFamily:
                                      "'Libre Baskerville', Georgia, serif",
                                    padding: 0,
                                    transition: "color 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "rgba(239,68,68,0.75)";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "rgba(239,68,68,0.4)";
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── NOTES TAB ── */}
            {activeTab === "notes" && (
              <div>
                {isOwn && (
                  <div style={{ marginBottom: "1rem" }}>
                    <button
                      type="button"
                      onClick={openNewNote}
                      data-ocid="profile.notes.open_modal_button"
                      style={GoldBtn}
                    >
                      + New Note
                    </button>
                  </div>
                )}
                {visibleNotes.length === 0 ? (
                  <div
                    data-ocid="profile.notes.empty_state"
                    style={{
                      textAlign: "center",
                      padding: "3rem 0",
                      color: "rgba(245,230,211,0.3)",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "1rem",
                    }}
                  >
                    {isOwn
                      ? "No notes yet. Create your first note."
                      : "No public notes."}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                    }}
                  >
                    {visibleNotes.map((note, idx) => (
                      <div
                        key={note.id}
                        data-ocid={`profile.notes.item.${idx + 1}`}
                        style={{
                          background: "rgba(26,20,16,0.7)",
                          border: note.isPublic
                            ? "1px solid rgba(200,169,106,0.18)"
                            : "1px solid rgba(200,169,106,0.08)",
                          borderRadius: 8,
                          padding: "0.9rem 1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            marginBottom: "0.35rem",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontSize: "0.9rem",
                              fontWeight: 700,
                              color: "#F5E6D3",
                              margin: 0,
                            }}
                          >
                            {note.title}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.6rem",
                                color: note.isPublic
                                  ? "rgba(200,169,106,0.6)"
                                  : "rgba(245,230,211,0.25)",
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                              }}
                            >
                              {note.isPublic ? "Public" : "Private"}
                            </span>
                            {isOwn && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openEditNote(note)}
                                  data-ocid={`profile.notes.edit_button.${idx + 1}`}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "rgba(200,169,106,0.45)",
                                    fontSize: "0.7rem",
                                    fontFamily:
                                      "'Libre Baskerville', Georgia, serif",
                                    padding: 0,
                                    transition: "color 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "#C8A96A";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "rgba(200,169,106,0.45)";
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteNote(note.id)}
                                  data-ocid={`profile.notes.delete_button.${idx + 1}`}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "rgba(239,68,68,0.4)",
                                    fontSize: "0.7rem",
                                    fontFamily:
                                      "'Libre Baskerville', Georgia, serif",
                                    padding: 0,
                                    transition: "color 0.15s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "rgba(239,68,68,0.7)";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "rgba(239,68,68,0.4)";
                                  }}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <p
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontStyle: "italic",
                            fontSize: "0.88rem",
                            color: "rgba(245,230,211,0.6)",
                            lineHeight: 1.65,
                            whiteSpace: "pre-line",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {note.content}
                        </p>
                        <p
                          style={{
                            fontSize: "0.62rem",
                            color: "rgba(245,230,211,0.25)",
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            marginTop: "0.4rem",
                          }}
                        >
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── LIKES TAB ── */}
            {activeTab === "likes" && isOwn && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {likedPosts.length === 0 ? (
                  <div
                    data-ocid="profile.likes.empty_state"
                    style={{
                      textAlign: "center",
                      padding: "3rem 0",
                      color: "rgba(245,230,211,0.3)",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "1rem",
                    }}
                  >
                    No liked posts yet.
                  </div>
                ) : (
                  likedPosts.map((post, idx) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setExpandedPost(post)}
                      data-ocid={`profile.likes.item.${idx + 1}`}
                      style={{
                        background: "rgba(26,20,16,0.5)",
                        border: "1px solid rgba(200,169,106,0.1)",
                        borderRadius: 8,
                        padding: "0.9rem 1rem",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "rgba(200,169,106,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "rgba(200,169,106,0.1)";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          marginBottom: "0.3rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.65rem",
                            color: "rgba(200,169,106,0.5)",
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                          }}
                        >
                          by {post.username}
                        </span>
                        <span
                          style={{
                            fontSize: "0.6rem",
                            color: "rgba(245,230,211,0.25)",
                          }}
                        >
                          · ❤️ {post.likes}
                        </span>
                      </div>
                      {post.title && (
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "0.88rem",
                            fontWeight: 700,
                            color: "#F5E6D3",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {post.title}
                        </p>
                      )}
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontStyle: "italic",
                          fontSize: "0.85rem",
                          color: "rgba(245,230,211,0.55)",
                          lineHeight: 1.65,
                          whiteSpace: "pre-line",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {post.preview}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* ── MESSAGES TAB ── */}
            {activeTab === "messages" && isOwn && (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1rem",
                    color: "rgba(245,230,211,0.45)",
                  }}
                >
                  View and manage all your private messages.
                </p>
                <button
                  type="button"
                  onClick={onGoToMessages}
                  data-ocid="profile.messages.primary_button"
                  style={{
                    ...GoldBtn,
                    fontSize: "0.8rem",
                    padding: "0.6rem 1.4rem",
                    boxShadow: "0 0 16px rgba(200,169,106,0.12)",
                  }}
                >
                  Open Messages
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Expanded post dialog ── */}
      <Dialog open={!!expandedPost} onOpenChange={() => setExpandedPost(null)}>
        <DialogContent
          style={{
            background: "#1A1410",
            border: "1px solid rgba(200,169,106,0.2)",
            maxWidth: 600,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          data-ocid="profile.posts.dialog"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F5E6D3",
                fontSize: "1.2rem",
              }}
            >
              {expandedPost?.title || "Post"}
            </DialogTitle>
          </DialogHeader>
          <pre
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(229,231,235,0.82)",
              fontSize: "0.95rem",
              lineHeight: 2,
              whiteSpace: "pre-wrap",
              marginTop: "0.75rem",
            }}
          >
            {expandedPost?.fullContent}
          </pre>
        </DialogContent>
      </Dialog>

      {/* ── Delete post confirm dialog ── */}
      <Dialog
        open={!!confirmDeletePost}
        onOpenChange={() => setConfirmDeletePost(null)}
      >
        <DialogContent
          style={{
            background: "#1A1410",
            border: "1px solid rgba(200,169,106,0.2)",
            maxWidth: 380,
          }}
          data-ocid="profile.posts.dialog"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F5E6D3",
                fontSize: "1.1rem",
              }}
            >
              Delete this post?
            </DialogTitle>
          </DialogHeader>
          <p
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.82rem",
              color: "rgba(245,230,211,0.55)",
              marginTop: "0.5rem",
            }}
          >
            This action cannot be undone.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={() => setConfirmDeletePost(null)}
              data-ocid="profile.posts.cancel_button"
              style={{ ...GoldBtn, color: "rgba(245,230,211,0.45)" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                confirmDeletePost && handleDeletePost(confirmDeletePost)
              }
              data-ocid="profile.posts.delete_button"
              style={{
                ...GoldBtn,
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "rgba(239,68,68,0.85)",
              }}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Note form dialog ── */}
      <Dialog
        open={showNoteForm}
        onOpenChange={(o) => !o && setShowNoteForm(false)}
      >
        <DialogContent
          style={{
            background: "#1A1410",
            border: "1px solid rgba(200,169,106,0.2)",
            maxWidth: 500,
          }}
          data-ocid="profile.notes.dialog"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F5E6D3",
                fontSize: "1.1rem",
              }}
            >
              {editingNote ? "Edit Note" : "New Note"}
            </DialogTitle>
          </DialogHeader>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginTop: "0.5rem",
            }}
          >
            <div>
              <label
                htmlFor="note-title-input"
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.63rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(200,169,106,0.55)",
                  display: "block",
                  marginBottom: "0.3rem",
                }}
              >
                Title
              </label>
              <input
                id="note-title-input"
                value={editNoteTitle}
                onChange={(e) => setEditNoteTitle(e.target.value)}
                placeholder="Note title…"
                data-ocid="profile.notes.input"
                style={inputSx}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(200,169,106,0.45)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(200,169,106,0.22)";
                }}
              />
            </div>
            <div>
              <label
                htmlFor="note-content-input"
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.63rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(200,169,106,0.55)",
                  display: "block",
                  marginBottom: "0.3rem",
                }}
              >
                Content
              </label>
              <textarea
                id="note-content-input"
                value={editNoteContent}
                onChange={(e) => setEditNoteContent(e.target.value)}
                placeholder="Your note…"
                rows={5}
                data-ocid="profile.notes.textarea"
                style={{
                  ...inputSx,
                  resize: "none",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "0.95rem",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(200,169,106,0.45)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(200,169,106,0.22)";
                }}
              />
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={editNotePublic}
                onChange={(e) => setEditNotePublic(e.target.checked)}
                data-ocid="profile.notes.checkbox"
                style={{ accentColor: "#C8A96A" }}
              />
              <span
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(245,230,211,0.6)",
                }}
              >
                Make this note public (visible on your profile)
              </span>
            </label>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowNoteForm(false)}
                data-ocid="profile.notes.cancel_button"
                style={{ ...GoldBtn, color: "rgba(245,230,211,0.45)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                data-ocid="profile.notes.save_button"
                style={GoldBtn}
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Modal */}
      {showCameraModal && (
        <div
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
          data-ocid="profile.modal"
        >
          <div
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
                  <canvas ref={camera.canvasRef} style={{ display: "none" }} />
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
                      {camera.error ? camera.error.message : "Camera inactive"}
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
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {!capturedPhoto ? (
                <>
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    disabled={!camera.isActive}
                    data-ocid="profile.primary_button"
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
                    data-ocid="profile.toggle"
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
                    data-ocid="profile.confirm_button"
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
                    data-ocid="profile.secondary_button"
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
                data-ocid="profile.close_button"
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
          </div>
        </div>
      )}
    </div>
  );
}
