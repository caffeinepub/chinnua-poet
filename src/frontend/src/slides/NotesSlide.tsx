import { Lightbulb, Sparkles, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  generateAIImage,
  getAISettings,
  getWritingSuggestions,
  speakText as speakTextFromHook,
} from "../hooks/useAISettings";
import { getAutoSuggestLine } from "../utils/aiFeatures";

interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CurrentUser {
  username: string;
  bio: string;
  createdAt: string;
}

interface Props {
  currentUser: CurrentUser | null;
  onLogin?: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STORAGE_KEY = (username: string) => `chinnua_notes_${username}`;

function loadNotes(username: string): Note[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(username)) || "[]");
  } catch {
    return [];
  }
}

function saveNotes(username: string, notes: Note[]) {
  localStorage.setItem(STORAGE_KEY(username), JSON.stringify(notes));
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#FFF8EE",
  border: "1px solid rgba(200,169,106,0.25)",
  borderRadius: 6,
  padding: "0.65rem 0.85rem",
  color: "#3D2B1F",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "1rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box" as const,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Libre Baskerville', Georgia, serif",
  fontSize: "0.68rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "#8B6F47",
  display: "block",
  marginBottom: "0.4rem",
};

function NoteFormModal({
  note,
  onSave,
  onClose,
}: {
  note: Partial<Note> | null;
  onSave: (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [isPublic, setIsPublic] = useState(note?.isPublic ?? false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoSuggest, setAutoSuggest] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [noteAiImage, setNoteAiImage] = useState<string | null>(null);
  const [generatingAiImage, setGeneratingAiImage] = useState(false);
  const aiSettings = getAISettings();

  // Auto-suggest debounce
  const handleContentChange = (val: string) => {
    setContent(val);
    if (aiSettings.aiAutoSuggest) {
      const lines = val.split("\n");
      const lastLine = lines[lines.length - 1] || "";
      if (lastLine.length > 5) {
        setAutoSuggest(getAutoSuggestLine(lastLine));
      } else {
        setAutoSuggest("");
      }
    }
    if (aiSettings.aiWritingSuggestions && val.length > 20) {
      setSuggestions(getWritingSuggestions(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), content, isPublic });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="notes.modal"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "#F5ECD7",
          border: "1px solid rgba(200,169,106,0.3)",
          borderRadius: 12,
          width: "100%",
          maxWidth: 540,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          boxShadow: "0 8px 48px rgba(0,0,0,0.85)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          data-ocid="notes.close_button"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(92,61,46,0.5)",
            fontSize: "1.4rem",
            lineHeight: 1,
            padding: "0.25rem 0.4rem",
          }}
        >
          ×
        </button>

        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#D4A853",
            fontSize: "1.15rem",
            letterSpacing: "0.06em",
            marginBottom: "1.5rem",
            marginTop: 0,
          }}
        >
          {note?.id ? "Edit Note" : "New Note"}
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          {/* Title */}
          <div>
            <label htmlFor="note-title" style={labelStyle}>
              Title
            </label>
            <input
              id="note-title"
              data-ocid="notes.input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              placeholder="Give your note a title..."
              style={{
                ...inputStyle,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.05rem",
                borderColor: titleFocused
                  ? "rgba(200,169,106,0.7)"
                  : "rgba(200,169,106,0.25)",
                boxShadow: titleFocused
                  ? "0 0 0 2px rgba(200,169,106,0.1)"
                  : "none",
              }}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="note-content" style={labelStyle}>
              Content
              {aiSettings.writingMode === "free" && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontStyle: "italic",
                    opacity: 0.7,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  — Free Verse Mode
                </span>
              )}
              {aiSettings.writingMode === "structured" && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontStyle: "italic",
                    opacity: 0.7,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  — Line {Math.min(content.split("\n").length, 4)} of 4
                </span>
              )}
            </label>
            <textarea
              id="note-content"
              data-ocid="notes.textarea"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Tab" &&
                  autoSuggest &&
                  aiSettings.aiAutoSuggest
                ) {
                  e.preventDefault();
                  setContent((prev) => `${prev} ${autoSuggest}`);
                  setAutoSuggest("");
                }
              }}
              onFocus={() => setContentFocused(true)}
              onBlur={() => setContentFocused(false)}
              placeholder={
                aiSettings.writingMode === "free"
                  ? "Let words fall freely — no structure required..."
                  : aiSettings.writingMode === "structured"
                    ? "Begin your verse — 4 lines, each with intention..."
                    : "Pour your thoughts here..."
              }
              rows={aiSettings.writingMode === "structured" ? 4 : 10}
              style={{
                ...inputStyle,
                resize:
                  aiSettings.writingMode === "free"
                    ? "vertical"
                    : aiSettings.writingMode === "structured"
                      ? "none"
                      : "vertical",
                lineHeight: 1.75,
                borderColor: contentFocused
                  ? "rgba(200,169,106,0.7)"
                  : "rgba(200,169,106,0.25)",
                boxShadow: contentFocused
                  ? "0 0 0 2px rgba(200,169,106,0.1)"
                  : "none",
              }}
            />
            {/* Auto-suggest ghost text */}
            {aiSettings.aiAutoSuggest && autoSuggest && (
              <div style={{ position: "relative", marginTop: "-0.25rem" }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.88rem",
                    color: "rgba(139,111,71,0.45)",
                    margin: "0.15rem 0 0",
                    paddingLeft: "0.85rem",
                    borderLeft: "2px solid rgba(212,168,83,0.2)",
                    lineHeight: 1.5,
                  }}
                >
                  {autoSuggest}
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      fontSize: "0.65rem",
                      color: "rgba(139,111,71,0.35)",
                      fontFamily: "'Lora', serif",
                    }}
                  >
                    [Tab to accept]
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* AI Writing Tools */}
          {(aiSettings.aiAutoSuggest ||
            aiSettings.aiWritingSuggestions ||
            aiSettings.aiAudioGen ||
            aiSettings.aiImageGen) && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginTop: "-0.25rem",
              }}
            >
              {aiSettings.aiAudioGen && (
                <button
                  type="button"
                  onClick={() => speakTextFromHook(content, aiSettings)}
                  data-ocid="notes.secondary_button"
                  style={{
                    padding: "0.25rem 0.7rem",
                    background: "transparent",
                    border: "1px solid rgba(139,111,71,0.3)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.72rem",
                    color: "#8B6F47",
                  }}
                >
                  <Volume2 size={13} /> Listen
                </button>
              )}
              {aiSettings.aiWritingSuggestions && content.length > 20 && (
                <button
                  type="button"
                  onClick={() => {
                    setSuggestions(getWritingSuggestions(content));
                    setShowSuggestions((s) => !s);
                  }}
                  data-ocid="notes.toggle"
                  style={{
                    padding: "0.25rem 0.7rem",
                    background: "transparent",
                    border: "1px solid rgba(139,111,71,0.3)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.72rem",
                    color: "#8B6F47",
                  }}
                >
                  <Sparkles size={13} /> Suggestions
                </button>
              )}
              {aiSettings.aiImageGen && (
                <button
                  type="button"
                  onClick={async () => {
                    setGeneratingAiImage(true);
                    try {
                      const img = await generateAIImage(`${title} ${content}`);
                      setNoteAiImage(img);
                    } finally {
                      setGeneratingAiImage(false);
                    }
                  }}
                  disabled={generatingAiImage}
                  data-ocid="notes.secondary_button"
                  style={{
                    padding: "0.25rem 0.7rem",
                    background: noteAiImage
                      ? "rgba(212,168,83,0.1)"
                      : "transparent",
                    border: "1px solid rgba(139,111,71,0.3)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.72rem",
                    color: "#8B6F47",
                  }}
                >
                  ✦ {generatingAiImage ? "Generating…" : "Generate Image"}
                </button>
              )}
            </div>
          )}
          {/* AI generated image preview */}
          {noteAiImage && (
            <div style={{ position: "relative", marginTop: "0.25rem" }}>
              <img
                src={noteAiImage}
                alt="AI"
                style={{
                  maxHeight: 100,
                  borderRadius: 8,
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
              <button
                type="button"
                onClick={() => setNoteAiImage(null)}
                style={{
                  position: "absolute",
                  top: 3,
                  right: 3,
                  background: "rgba(0,0,0,0.45)",
                  border: "none",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  cursor: "pointer",
                  color: "white",
                  fontSize: "0.65rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Auto-suggest ghost text */}
          {aiSettings.aiAutoSuggest && autoSuggest && (
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.82rem",
                color: "rgba(139,111,71,0.45)",
                padding: "0.25rem 0.5rem",
                borderLeft: "2px solid rgba(212,168,83,0.3)",
              }}
            >
              {autoSuggest}
              <button
                type="button"
                onClick={() => {
                  setContent(
                    (c) => c + (c.endsWith("\n") ? "" : "\n") + autoSuggest,
                  );
                  setAutoSuggest("");
                }}
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "0.65rem",
                  color: "rgba(212,168,83,0.7)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ↵ Add
              </button>
            </div>
          )}
          {/* Writing suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              style={{
                background: "rgba(212,168,83,0.06)",
                border: "1px solid rgba(212,168,83,0.2)",
                borderRadius: 8,
                padding: "0.75rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#8B6F47",
                  marginBottom: "0.4rem",
                  fontFamily: "'Lora', Georgia, serif",
                }}
              >
                Suggested next lines:
              </p>
              {suggestions.map((s) => (
                <button
                  key={s.slice(0, 30)}
                  type="button"
                  onClick={() => {
                    setContent((c) => c + (c.endsWith("\n") ? "" : "\n") + s);
                    setShowSuggestions(false);
                  }}
                  data-ocid="notes.item.1"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.3rem 0.5rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.82rem",
                    color: "#5C3D2E",
                    borderRadius: 4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(212,168,83,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {/* Privacy toggle */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <button
              type="button"
              data-ocid="notes.toggle"
              onClick={() => setIsPublic((p) => !p)}
              aria-pressed={isPublic}
              aria-label={isPublic ? "Set to private" : "Set to public"}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: isPublic ? "#C8A96A" : "#8B6F47",
                border: isPublic
                  ? "1px solid #C8A96A"
                  : "1px solid rgba(200,169,106,0.2)",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.25s, border-color 0.25s",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: isPublic ? 22 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: isPublic
                    ? "rgba(212,168,83,0.2)"
                    : "rgba(139,111,71,0.15)",
                  transition: "left 0.25s, background 0.25s",
                }}
              />
            </button>
            <span
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.78rem",
                color: isPublic ? "#D4A853" : "#8B6F47",
                transition: "color 0.25s",
              }}
            >
              {isPublic
                ? "Public — visible on your profile"
                : "Private — only you can see this"}
            </span>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              data-ocid="notes.cancel_button"
              style={{
                background: "transparent",
                border: "1px solid rgba(139,111,71,0.3)",
                borderRadius: 6,
                padding: "0.55rem 1.2rem",
                color: "rgba(92,61,46,0.5)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              data-ocid="notes.save_button"
              style={{
                background: "rgba(200,169,106,0.15)",
                border: "1px solid rgba(200,169,106,0.5)",
                borderRadius: 6,
                padding: "0.55rem 1.4rem",
                color: "#D4A853",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function NoteViewModal({
  note,
  onEdit,
  onDelete,
  onClose,
}: {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="notes.modal"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "#F5ECD7",
          border: "1px solid rgba(200,169,106,0.3)",
          borderRadius: 12,
          width: "100%",
          maxWidth: 580,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2.25rem",
          boxShadow: "0 8px 48px rgba(0,0,0,0.85)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          data-ocid="notes.close_button"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(92,61,46,0.5)",
            fontSize: "1.4rem",
            lineHeight: 1,
            padding: "0.25rem 0.4rem",
          }}
        >
          ×
        </button>

        {/* Badge */}
        <div style={{ marginBottom: "1rem" }}>
          <span
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: note.isPublic ? "#C8A96A" : "rgba(200,169,106,0.4)",
              border: `1px solid ${
                note.isPublic
                  ? "rgba(200,169,106,0.4)"
                  : "rgba(200,169,106,0.15)"
              }`,
              borderRadius: 4,
              padding: "0.2rem 0.5rem",
            }}
          >
            {note.isPublic ? "Public" : "Private"}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#3D2B1F",
            fontSize: "1.45rem",
            fontWeight: 400,
            lineHeight: 1.35,
            marginBottom: "0.5rem",
            marginTop: 0,
          }}
        >
          {note.title}
        </h2>

        {/* Date */}
        <p
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.68rem",
            color: "#D4A853",
            letterSpacing: "0.07em",
            marginBottom: "1.75rem",
          }}
        >
          {formatDate(note.createdAt)}
          {note.updatedAt !== note.createdAt &&
            ` · Edited ${formatDate(note.updatedAt)}`}
        </p>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(200,169,106,0.12)",
            marginBottom: "1.75rem",
          }}
        />

        {/* Content */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.05rem",
            lineHeight: 1.9,
            color: "#3D2B1F",
            whiteSpace: "pre-wrap",
            marginBottom: "2rem",
          }}
        >
          {note.content || (
            <em style={{ color: "rgba(92,61,46,0.4)" }}>No content.</em>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onEdit}
            data-ocid="notes.edit_button"
            style={{
              background: "rgba(200,169,106,0.1)",
              border: "1px solid rgba(200,169,106,0.3)",
              borderRadius: 6,
              padding: "0.5rem 1.1rem",
              color: "#D4A853",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Edit
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              data-ocid="notes.delete_button"
              style={{
                background: "transparent",
                border: "1px solid rgba(200,80,80,0.25)",
                borderRadius: 6,
                padding: "0.5rem 1.1rem",
                color: "rgba(220,100,100,0.6)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          ) : (
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.82rem",
                  color: "rgba(92,61,46,0.5)",
                }}
              >
                Are you sure?
              </span>
              <button
                type="button"
                onClick={onDelete}
                data-ocid="notes.confirm_button"
                style={{
                  background: "rgba(200,80,80,0.15)",
                  border: "1px solid rgba(200,80,80,0.4)",
                  borderRadius: 6,
                  padding: "0.4rem 0.9rem",
                  color: "rgba(220,100,100,0.85)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                data-ocid="notes.cancel_button"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(200,169,106,0.15)",
                  borderRadius: 6,
                  padding: "0.4rem 0.9rem",
                  color: "rgba(92,61,46,0.5)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NotesSlide({ currentUser, onLogin }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewNote, setViewNote] = useState<Note | null>(null);
  const [editNote, setEditNote] = useState<Partial<Note> | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setNotes(
        loadNotes(currentUser.username).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    }
  }, [currentUser]);

  const persistNotes = (updated: Note[]) => {
    if (!currentUser) return;
    const sorted = [...updated].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setNotes(sorted);
    saveNotes(currentUser.username, sorted);
  };

  const handleSave = (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    if (!currentUser) return;
    if (editNote?.id) {
      const updated = notes.map((n) =>
        n.id === editNote.id
          ? { ...n, ...data, updatedAt: new Date().toISOString() }
          : n,
      );
      persistNotes(updated);
      if (viewNote?.id === editNote.id) {
        const fresh = updated.find((n) => n.id === editNote.id);
        if (fresh) setViewNote(fresh);
      }
    } else {
      const now = new Date().toISOString();
      const newNote: Note = {
        id: Date.now().toString(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      persistNotes([...notes, newNote]);
    }
    setShowForm(false);
    setEditNote(null);
  };

  const handleDelete = (id: string) => {
    persistNotes(notes.filter((n) => n.id !== id));
    setViewNote(null);
  };

  const openEdit = (note: Note) => {
    setEditNote(note);
    setViewNote(null);
    setShowForm(true);
  };

  const openNew = () => {
    setEditNote(null);
    setShowForm(true);
  };

  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#FFF8EE",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "1.25rem",
            color: "rgba(92,61,46,0.5)",
            marginBottom: "2rem",
            lineHeight: 1.7,
            maxWidth: 340,
          }}
        >
          Your notes await you,
          <br />
          but first — please sign in.
        </p>
        {onLogin && (
          <button
            type="button"
            onClick={onLogin}
            data-ocid="notes.primary_button"
            style={{
              background: "rgba(200,169,106,0.12)",
              border: "1px solid rgba(200,169,106,0.35)",
              borderRadius: 7,
              padding: "0.65rem 1.8rem",
              color: "#D4A853",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: "100vh",
          background: "#FFF8EE",
          padding: "3.5rem 1.5rem 5rem",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#D4A853",
                fontSize: "2rem",
                fontWeight: 400,
                letterSpacing: "0.04em",
                margin: 0,
              }}
            >
              My Notes
            </h1>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.88rem",
                color: "#D4A853",
                marginTop: "0.4rem",
                marginBottom: 0,
              }}
            >
              Private thoughts. Quiet pages.
            </p>
          </div>

          <button
            type="button"
            onClick={openNew}
            data-ocid="notes.primary_button"
            style={{
              background: "rgba(200,169,106,0.12)",
              border: "1px solid rgba(200,169,106,0.4)",
              borderRadius: 7,
              padding: "0.55rem 1.3rem",
              color: "#D4A853",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(200,169,106,0.2)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 14px rgba(200,169,106,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(200,169,106,0.12)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            + New Note
          </button>
        </div>

        {/* Ornament divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "1.25rem 0 2.5rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(200,169,106,0.18)",
            }}
          />
          <span style={{ color: "#D4A853", fontSize: "0.85rem" }}>✦</span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(200,169,106,0.18)",
            }}
          />
        </div>

        {/* Empty state */}
        {notes.length === 0 ? (
          <div
            data-ocid="notes.empty_state"
            style={{ textAlign: "center", paddingTop: "5rem" }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "1.2rem",
                color: "rgba(92,61,46,0.4)",
                lineHeight: 1.8,
              }}
            >
              No notes yet.
              <br />
              Begin your first page.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            data-ocid="notes.list"
          >
            {notes.map((note, i) => (
              <NoteCard
                key={note.id}
                note={note}
                index={i + 1}
                onClick={() => setViewNote(note)}
              />
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {viewNote && !showForm && (
          <NoteViewModal
            note={viewNote}
            onEdit={() => openEdit(viewNote)}
            onDelete={() => handleDelete(viewNote.id)}
            onClose={() => setViewNote(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <NoteFormModal
            note={editNote}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditNote(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function NoteCard({
  note,
  index,
  onClick,
}: {
  note: Note;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const preview =
    note.content.slice(0, 80) + (note.content.length > 80 ? "…" : "");

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`notes.item.${index}`}
      style={{
        background: "#F5ECD7",
        border: "none",
        borderLeft: hovered
          ? "2px solid #C8A96A"
          : "2px solid rgba(200,169,106,0.3)",
        borderRadius: 8,
        padding: "1.1rem 1.4rem",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        transition: "box-shadow 0.25s, border-color 0.25s",
        boxShadow: hovered ? "0 0 18px rgba(200,169,106,0.12)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "0.45rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1rem",
            fontWeight: 400,
            color: hovered ? "#3D2B1F" : "#5C3D2E",
            margin: 0,
            lineHeight: 1.4,
            transition: "color 0.2s",
            flex: 1,
          }}
        >
          {note.title}
        </h3>
        <span
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.57rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: note.isPublic
              ? "rgba(200,169,106,0.7)"
              : "rgba(200,169,106,0.3)",
            border: `1px solid ${
              note.isPublic ? "rgba(200,169,106,0.3)" : "rgba(200,169,106,0.12)"
            }`,
            borderRadius: 3,
            padding: "0.18rem 0.45rem",
            flexShrink: 0,
            marginTop: "0.15rem",
          }}
        >
          {note.isPublic ? "Public" : "Private"}
        </span>
      </div>

      {preview && (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "rgba(92,61,46,0.5)",
            margin: "0 0 0.6rem",
            lineHeight: 1.65,
          }}
        >
          {preview}
        </p>
      )}

      <p
        style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: "0.62rem",
          color: "#D4A853",
          letterSpacing: "0.06em",
          margin: 0,
        }}
      >
        {formatDate(note.createdAt)}
      </p>
    </button>
  );
}
