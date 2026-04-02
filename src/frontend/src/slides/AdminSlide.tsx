import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AI_BOTS } from "../data/ai-bots";
import { useActor } from "../hooks/useActor";
import { POEMS } from "../poems-data";

interface UserEntry {
  username: string;
  bio: string;
  createdAt: string;
}
interface Post {
  id: string;
  username: string;
  title: string;
  preview: string;
  timestamp: string;
}
interface GalleryPhoto {
  id: string;
  src: string;
  uploader: string;
  timestamp: string;
}

const WARM_GOLD = "#D4A853";
const WARM_BROWN = "#8B6F47";
const WARM_MOCHA = "#5C3D2E";
const _WARM_PAPER = "#F5ECD7";
const WARM_TEXT = "#3D2B1F";
const WARM_MUTED = "#9E8070";

interface InkReply {
  id: string;
  letterType: "morning" | "night";
  userMessage: string;
  adminReply?: string;
  submittedAt: string;
  repliedAt?: string;
}

function AiUsersTab() {
  const WARM_MOCHA = "#5C3D2E";
  const WARM_BROWN = "#8B6F47";
  const WARM_PAPER = "#F5ECD7";
  const WARM_BORDER = "rgba(139,111,71,0.25)";
  const WARM_TEXT = "#3D2B1F";

  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("chinnua_bot_passwords") || "{}");
    } catch {
      return {};
    }
  });
  const [editPw, setEditPw] = useState<string | null>(null);
  const [pwValue, setPwValue] = useState("");

  const savePw = (username: string) => {
    const updated = { ...passwords, [username]: pwValue };
    localStorage.setItem("chinnua_bot_passwords", JSON.stringify(updated));
    setPasswords(updated);
    setEditPw(null);
    setPwValue("");
  };

  return (
    <div>
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: WARM_MOCHA,
          marginBottom: "1rem",
        }}
      >
        AI Bot Users
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {AI_BOTS.map((bot) => (
          <div
            key={bot.username}
            style={{
              background: WARM_PAPER,
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 12,
              padding: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.6rem",
              }}
            >
              <img
                src={bot.photo}
                alt={bot.displayName}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    color: WARM_MOCHA,
                    fontSize: "0.9rem",
                  }}
                >
                  {bot.displayName}
                </div>
                <div style={{ fontSize: "0.72rem", color: WARM_BROWN }}>
                  @{bot.username}
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.78rem",
                color: WARM_BROWN,
                marginBottom: "0.8rem",
              }}
            >
              {bot.bio}
            </p>
            <div
              style={{
                fontSize: "0.72rem",
                color: WARM_BROWN,
                marginBottom: "0.5rem",
              }}
            >
              Password:{" "}
              <strong style={{ color: WARM_MOCHA }}>
                {passwords[bot.username] ?? "bot2026"}
              </strong>
            </div>
            {editPw === bot.username ? (
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <input
                  type="text"
                  value={pwValue}
                  onChange={(e) => setPwValue(e.target.value)}
                  placeholder="New password"
                  style={{
                    flex: 1,
                    padding: "0.3rem 0.5rem",
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 6,
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.78rem",
                    background: "white",
                    color: WARM_TEXT,
                  }}
                />
                <button
                  type="button"
                  onClick={() => savePw(bot.username)}
                  style={{
                    padding: "0.3rem 0.6rem",
                    background: "rgba(212,168,83,0.15)",
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    color: WARM_MOCHA,
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditPw(null);
                    setPwValue("");
                  }}
                  style={{
                    padding: "0.3rem 0.5rem",
                    background: "none",
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    color: WARM_BROWN,
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditPw(bot.username);
                  setPwValue(passwords[bot.username] ?? "bot2026");
                }}
                style={{
                  padding: "0.3rem 0.8rem",
                  background: "rgba(139,111,71,0.1)",
                  border: `1px solid ${WARM_BORDER}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.75rem",
                  color: WARM_BROWN,
                }}
              >
                Change Password
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MusicManagementTab() {
  const WARM_MOCHA = "#5C3D2E";
  const WARM_BROWN = "#8B6F47";
  const WARM_PAPER = "#F5ECD7";
  const WARM_BORDER = "rgba(139,111,71,0.25)";
  const WARM_GOLD = "#D4A853";
  const WARM_TEXT = "#3D2B1F";

  interface Track {
    id: string;
    title: string;
    artist: string;
    mood: string;
    spotifyUrl: string;
  }
  const DEFAULT_TRACKS: Track[] = [
    {
      id: "default_1",
      title: "Autumn Letters",
      artist: "The Cinematic Orchestra",
      mood: "Sad",
      spotifyUrl:
        "https://open.spotify.com/search/autumn+letters+cinematic+orchestra",
    },
    {
      id: "default_2",
      title: "Experience",
      artist: "Ludovico Einaudi",
      mood: "Peaceful",
      spotifyUrl: "https://open.spotify.com/search/experience+ludovico+einaudi",
    },
    {
      id: "default_3",
      title: "River Flows in You",
      artist: "Yiruma",
      mood: "Romantic",
      spotifyUrl: "https://open.spotify.com/search/river+flows+in+you+yiruma",
    },
    {
      id: "default_4",
      title: "Night in the Forest",
      artist: "Max Richter",
      mood: "Dark",
      spotifyUrl: "https://open.spotify.com/search/max+richter+night",
    },
    {
      id: "default_5",
      title: "Golden Hour",
      artist: "JVKE",
      mood: "Hopeful",
      spotifyUrl: "https://open.spotify.com/search/golden+hour+jvke",
    },
  ];

  const [tracks, setTracks] = useState<Track[]>(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("chinnua_music_library") || "null",
      );
      return stored ?? DEFAULT_TRACKS;
    } catch {
      return DEFAULT_TRACKS;
    }
  });
  const [newTrack, setNewTrack] = useState({
    title: "",
    artist: "",
    mood: "Peaceful",
    spotifyUrl: "",
  });

  const addTrack = () => {
    if (!newTrack.title.trim() || !newTrack.artist.trim()) return;
    const updated = [...tracks, { ...newTrack, id: `track_${Date.now()}` }];
    setTracks(updated);
    localStorage.setItem("chinnua_music_library", JSON.stringify(updated));
    setNewTrack({ title: "", artist: "", mood: "Peaceful", spotifyUrl: "" });
  };

  const deleteTrack = (id: string) => {
    const updated = tracks.filter((t) => t.id !== id);
    setTracks(updated);
    localStorage.setItem("chinnua_music_library", JSON.stringify(updated));
  };

  const moods = ["Sad", "Romantic", "Dark", "Hopeful", "Peaceful", "Energetic"];

  return (
    <div>
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: WARM_MOCHA,
          marginBottom: "1rem",
        }}
      >
        Music Library
      </h3>
      <div
        style={{
          background: WARM_PAPER,
          border: `1px solid ${WARM_BORDER}`,
          borderRadius: 12,
          padding: "1.2rem",
          marginBottom: "1.5rem",
        }}
      >
        <h4
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_MOCHA,
            marginBottom: "0.8rem",
            fontSize: "0.9rem",
          }}
        >
          Add New Track
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <input
            type="text"
            placeholder="Track title"
            value={newTrack.title}
            onChange={(e) =>
              setNewTrack((p) => ({ ...p, title: e.target.value }))
            }
            style={{
              padding: "0.5rem 0.75rem",
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 8,
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.85rem",
              color: WARM_TEXT,
              background: "white",
            }}
          />
          <input
            type="text"
            placeholder="Artist name"
            value={newTrack.artist}
            onChange={(e) =>
              setNewTrack((p) => ({ ...p, artist: e.target.value }))
            }
            style={{
              padding: "0.5rem 0.75rem",
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 8,
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.85rem",
              color: WARM_TEXT,
              background: "white",
            }}
          />
          <input
            type="text"
            placeholder="Spotify URL"
            value={newTrack.spotifyUrl}
            onChange={(e) =>
              setNewTrack((p) => ({ ...p, spotifyUrl: e.target.value }))
            }
            style={{
              padding: "0.5rem 0.75rem",
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 8,
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.85rem",
              color: WARM_TEXT,
              background: "white",
            }}
          />
          <select
            value={newTrack.mood}
            onChange={(e) =>
              setNewTrack((p) => ({ ...p, mood: e.target.value }))
            }
            style={{
              padding: "0.5rem 0.75rem",
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 8,
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.85rem",
              color: WARM_TEXT,
              background: "white",
            }}
          >
            {moods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={addTrack}
          data-ocid="admin.primary_button"
          style={{
            padding: "0.5rem 1.5rem",
            background: "rgba(212,168,83,0.15)",
            border: "1px solid rgba(212,168,83,0.4)",
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.85rem",
            color: WARM_MOCHA,
            fontWeight: 600,
          }}
        >
          Add Track
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {tracks.map((track) => (
          <div
            key={track.id}
            style={{
              background: WARM_PAPER,
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 10,
              padding: "0.9rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  color: WARM_MOCHA,
                  fontSize: "0.9rem",
                }}
              >
                {track.title}
              </span>
              <span
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.8rem",
                  color: WARM_BROWN,
                  marginLeft: "0.5rem",
                }}
              >
                — {track.artist}
              </span>
            </div>
            <span
              style={{
                padding: "0.2rem 0.6rem",
                background: "rgba(212,168,83,0.12)",
                borderRadius: 12,
                fontSize: "0.7rem",
                color: WARM_BROWN,
                flexShrink: 0,
              }}
            >
              {track.mood}
            </span>
            {track.spotifyUrl && (
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "0.75rem",
                  color: WARM_GOLD,
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                Spotify
              </a>
            )}
            <button
              type="button"
              onClick={() => deleteTrack(track.id)}
              data-ocid="admin.delete_button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(248,113,113,0.7)",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyLettersTab() {
  const [morningLetters, setMorningLetters] = React.useState<string[]>(() => {
    try {
      const d = localStorage.getItem("chinnua_daily_messages");
      if (d) return JSON.parse(d).morning || [];
    } catch {}
    return [
      "The sun rose today, and so did you. That alone is something worth celebrating.",
      "Before the world asks anything of you, let this letter remind you — you are enough.",
      "Open your eyes slowly. There's no rush. Today belongs to you.",
      "The morning mist clears, and in its place — a day written just for you.",
      "Today may hold a thousand moments. Let the first one be quiet, and yours.",
      "Good morning, dear heart. May today be gentle on you.",
      "A new page. A new morning. Write it softly.",
    ];
  });
  const [nightLetters, setNightLetters] = React.useState<string[]>(() => {
    try {
      const d = localStorage.getItem("chinnua_daily_messages");
      if (d) return JSON.parse(d).night || [];
    } catch {}
    return [
      "The day is done. Whatever it held, you held it too. Rest now.",
      "Stars don't need to shine brightly every night. Neither do you.",
      "Let the weight of today dissolve. Tomorrow will be lighter.",
      "Close your eyes, dear soul. You did enough.",
      "The moon is watching over you tonight. Sleep in peace.",
      "In the silence of this night, your story continues. Rest well.",
      "Another day loved, survived, breathed through. That's everything.",
    ];
  });
  const [editIdx, setEditIdx] = React.useState<{
    type: "morning" | "night";
    idx: number;
  } | null>(null);
  const [editVal, setEditVal] = React.useState("");
  const [newMsg, setNewMsg] = React.useState("");
  const [newType, setNewType] = React.useState<"morning" | "night">("morning");

  const save = (m: string[], n: string[]) => {
    localStorage.setItem(
      "chinnua_daily_messages",
      JSON.stringify({ morning: m, night: n }),
    );
  };

  const handleEdit = (type: "morning" | "night", idx: number, val: string) => {
    if (type === "morning") {
      const updated = morningLetters.map((l, i) => (i === idx ? val : l));
      setMorningLetters(updated);
      save(updated, nightLetters);
    } else {
      const updated = nightLetters.map((l, i) => (i === idx ? val : l));
      setNightLetters(updated);
      save(morningLetters, updated);
    }
    setEditIdx(null);
  };

  const handleDelete = (type: "morning" | "night", idx: number) => {
    if (type === "morning") {
      const updated = morningLetters.filter((_, i) => i !== idx);
      setMorningLetters(updated);
      save(updated, nightLetters);
    } else {
      const updated = nightLetters.filter((_, i) => i !== idx);
      setNightLetters(updated);
      save(morningLetters, updated);
    }
  };

  const handleAdd = () => {
    if (!newMsg.trim()) return;
    if (newType === "morning") {
      const updated = [...morningLetters, newMsg.trim()];
      setMorningLetters(updated);
      save(updated, nightLetters);
    } else {
      const updated = [...nightLetters, newMsg.trim()];
      setNightLetters(updated);
      save(morningLetters, updated);
    }
    setNewMsg("");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(245,236,215,0.5)",
    border: "1px solid rgba(139,111,71,0.25)",
    borderRadius: 8,
    padding: "0.5rem 0.75rem",
    color: WARM_TEXT,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const renderList = (items: string[], type: "morning" | "night") => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {items.map((msg, i) => (
        <div
          key={`${type}-${String(i)}`}
          style={{
            background: "rgba(245,236,215,0.3)",
            border: "1px solid rgba(139,111,71,0.2)",
            borderRadius: 10,
            padding: "0.75rem 1rem",
          }}
        >
          {editIdx?.type === type && editIdx.idx === i ? (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexDirection: "column",
              }}
            >
              <textarea
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "none" }}
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => handleEdit(type, i, editVal)}
                  style={{
                    background: WARM_GOLD,
                    border: "none",
                    borderRadius: 6,
                    padding: "0.3rem 0.8rem",
                    color: "#3D2B1F",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontFamily: "'Lora', Georgia, serif",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditIdx(null)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(139,111,71,0.3)",
                    borderRadius: 6,
                    padding: "0.3rem 0.8rem",
                    color: WARM_BROWN,
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontFamily: "'Lora', Georgia, serif",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.88rem",
                  color: WARM_TEXT,
                  margin: 0,
                  flex: 1,
                  lineHeight: 1.6,
                }}
              >
                {msg}
              </p>
              <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                <button
                  type="button"
                  data-ocid="admin.edit_button"
                  onClick={() => {
                    setEditIdx({ type, idx: i });
                    setEditVal(msg);
                  }}
                  style={{
                    background: "rgba(212,168,83,0.15)",
                    border: "1px solid rgba(212,168,83,0.3)",
                    borderRadius: 5,
                    padding: "0.2rem 0.5rem",
                    color: WARM_GOLD,
                    cursor: "pointer",
                    fontSize: "0.72rem",
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  data-ocid="admin.delete_button"
                  onClick={() => handleDelete(type, i)}
                  style={{
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: 5,
                    padding: "0.2rem 0.5rem",
                    color: "rgba(248,113,113,0.7)",
                    cursor: "pointer",
                    fontSize: "0.72rem",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        paddingTop: "1rem",
      }}
    >
      <div>
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_GOLD,
            fontSize: "1rem",
            margin: "0 0 0.75rem",
          }}
        >
          ☀️ Morning Letters
        </h3>
        {renderList(morningLetters, "morning")}
      </div>
      <div>
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_MOCHA,
            fontSize: "1rem",
            margin: "0 0 0.75rem",
          }}
        >
          🌙 Evening Letters
        </h3>
        {renderList(nightLetters, "night")}
      </div>
      <div
        style={{
          background: "rgba(245,236,215,0.3)",
          border: "1px solid rgba(139,111,71,0.2)",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <h4
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_BROWN,
            fontSize: "0.9rem",
            margin: "0 0 0.75rem",
          }}
        >
          Add New Letter
        </h4>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <label
            style={{
              display: "flex",
              gap: "0.3rem",
              alignItems: "center",
              cursor: "pointer",
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.82rem",
              color: WARM_TEXT,
            }}
          >
            <input
              type="radio"
              name="newType"
              checked={newType === "morning"}
              onChange={() => setNewType("morning")}
              style={{ accentColor: WARM_GOLD }}
            />
            Morning
          </label>
          <label
            style={{
              display: "flex",
              gap: "0.3rem",
              alignItems: "center",
              cursor: "pointer",
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.82rem",
              color: WARM_TEXT,
            }}
          >
            <input
              type="radio"
              name="newType"
              checked={newType === "night"}
              onChange={() => setNewType("night")}
              style={{ accentColor: WARM_GOLD }}
            />
            Evening
          </label>
        </div>
        <textarea
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Write a new letter…"
          rows={3}
          style={{ ...inputStyle, resize: "none", marginBottom: "0.5rem" }}
        />
        <button
          type="button"
          data-ocid="admin.primary_button"
          onClick={handleAdd}
          style={{
            background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
            border: "none",
            borderRadius: 8,
            padding: "0.5rem 1.25rem",
            color: "#3D2B1F",
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add Letter
        </button>
      </div>
    </div>
  );
}

function InkRepliesTab() {
  const [replies, setReplies] = React.useState<InkReply[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("chinnua_ink_replies") || "[]");
    } catch {
      return [];
    }
  });
  const [replyText, setReplyText] = React.useState<Record<string, string>>({});

  const saveReply = (id: string) => {
    const text = replyText[id]?.trim();
    if (!text) return;
    const updated = replies.map((r) =>
      r.id === id
        ? { ...r, adminReply: text, repliedAt: new Date().toISOString() }
        : r,
    );
    setReplies(updated);
    localStorage.setItem("chinnua_ink_replies", JSON.stringify(updated));
    setReplyText((prev) => ({ ...prev, [id]: "" }));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(245,236,215,0.5)",
    border: "1px solid rgba(139,111,71,0.25)",
    borderRadius: 8,
    padding: "0.5rem 0.75rem",
    color: WARM_TEXT,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    fontSize: "0.88rem",
    outline: "none",
    resize: "none" as const,
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        paddingTop: "1rem",
      }}
    >
      {replies.length === 0 ? (
        <div
          data-ocid="admin.empty_state"
          style={{
            textAlign: "center",
            padding: "3rem",
            color: WARM_MUTED,
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
          }}
        >
          No Ink & Pen replies yet.
        </div>
      ) : (
        replies.map((reply, i) => (
          <div
            key={reply.id}
            data-ocid={`admin.item.${i + 1}`}
            style={{
              background: "rgba(245,236,215,0.3)",
              border: "1px solid rgba(139,111,71,0.2)",
              borderRadius: 12,
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                marginBottom: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:
                    reply.letterType === "morning" ? WARM_GOLD : WARM_MOCHA,
                  background: "rgba(212,168,83,0.12)",
                  padding: "2px 8px",
                  borderRadius: 20,
                }}
              >
                {reply.letterType === "morning" ? "☀️ Morning" : "🌙 Evening"}
              </span>
              <span
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.72rem",
                  color: WARM_MUTED,
                }}
              >
                {new Date(reply.submittedAt).toLocaleString()}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.9rem",
                color: WARM_TEXT,
                margin: "0 0 0.75rem",
                lineHeight: 1.7,
              }}
            >
              "{reply.userMessage}"
            </p>
            {reply.adminReply ? (
              <div
                style={{
                  background: "rgba(212,168,83,0.08)",
                  border: "1px solid rgba(212,168,83,0.25)",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: WARM_GOLD,
                    margin: 0,
                  }}
                >
                  Your reply: "{reply.adminReply}"
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexDirection: "column",
                }}
              >
                <textarea
                  value={replyText[reply.id] || ""}
                  onChange={(e) =>
                    setReplyText((p) => ({ ...p, [reply.id]: e.target.value }))
                  }
                  placeholder="Write a warm, comforting reply…"
                  rows={2}
                  style={inputStyle}
                  data-ocid="admin.textarea"
                />
                <button
                  type="button"
                  data-ocid="admin.save_button"
                  onClick={() => saveReply(reply.id)}
                  style={{
                    alignSelf: "flex-start",
                    background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
                    border: "none",
                    borderRadius: 8,
                    padding: "0.4rem 1rem",
                    color: "#3D2B1F",
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function AdminInboxTab() {
  const WARM_MOCHA = "#5C3D2E";
  const WARM_BROWN = "#8B6F47";
  const WARM_PAPER = "#F5ECD7";
  const WARM_BORDER = "rgba(139,111,71,0.25)";
  const WARM_TEXT = "#3D2B1F";

  interface InboxMsg {
    id: string;
    from: string;
    to: string;
    text: string;
    timestamp: string;
  }

  const [msgs, setMsgs] = React.useState<InboxMsg[]>([]);

  React.useEffect(() => {
    // Collect all messages sent to CHINNUA_POET
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("chinnua_conv_"),
    );
    const collected: InboxMsg[] = [];
    for (const key of allKeys) {
      try {
        const convMsgs = JSON.parse(localStorage.getItem(key) || "[]");
        for (const m of convMsgs) {
          if (m.to === "CHINNUA_POET" || key.includes("CHINNUA_POET")) {
            collected.push(m);
          }
        }
      } catch {}
    }
    collected.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    setMsgs(collected);
  }, []);

  return (
    <div>
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: WARM_MOCHA,
          marginBottom: "1rem",
        }}
      >
        Admin Inbox
      </h3>
      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontStyle: "italic",
          color: WARM_BROWN,
          fontSize: "0.82rem",
          marginBottom: "1.5rem",
        }}
      >
        All messages sent to CHINNUA_POET from users.
      </p>
      {msgs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            color: WARM_BROWN,
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
          }}
        >
          No messages yet.
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {msgs.slice(0, 50).map((m, i) => (
            <div
              key={m.id || i}
              style={{
                background: WARM_PAPER,
                border: `1px solid ${WARM_BORDER}`,
                borderRadius: 10,
                padding: "0.85rem 1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    color: WARM_MOCHA,
                    fontSize: "0.88rem",
                  }}
                >
                  {m.from}
                </span>
                <span
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.7rem",
                    color: "rgba(61,43,31,0.45)",
                  }}
                >
                  {new Date(m.timestamp).toLocaleString()}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.85rem",
                  color: WARM_TEXT,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {m.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminAboutTab() {
  const WARM_MOCHA = "#5C3D2E";
  const WARM_BROWN = "#8B6F47";
  const WARM_PAPER = "#F5ECD7";
  const WARM_BORDER = "rgba(139,111,71,0.25)";
  const WARM_TEXT = "#3D2B1F";

  const [bio, setBio] = React.useState("");
  const [story, setStory] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    try {
      const about = JSON.parse(
        localStorage.getItem("chinnua_about_content") || "{}",
      );
      setBio(about.bio || "");
      setStory(about.story || "");
    } catch {}
  }, []);

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      // Parse the document: first paragraph = bio, rest = story
      const lines = text.split("\n").filter((l) => l.trim());
      const bioText = lines.slice(0, 3).join(" ");
      const storyText = lines.slice(3).join("\n");
      setBio(bioText);
      setStory(storyText);
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    const about = { bio, story, poetName: "CHINNUA_POET" };
    localStorage.setItem("chinnua_about_content", JSON.stringify(about));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: WARM_MOCHA,
          marginBottom: "1rem",
        }}
      >
        About Page Editor
      </h3>

      {/* Document Upload */}
      <div
        style={{
          background: WARM_PAPER,
          border: `1px solid ${WARM_BORDER}`,
          borderRadius: 10,
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_MOCHA,
            fontWeight: 600,
            marginBottom: "0.5rem",
            fontSize: "0.88rem",
          }}
        >
          Upload Document (.txt)
        </p>
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.78rem",
            color: WARM_BROWN,
            marginBottom: "0.75rem",
          }}
        >
          Upload a text file to auto-populate the About page with its content.
        </p>
        <input
          type="file"
          accept=".txt"
          data-ocid="admin.upload_button"
          onChange={handleDocUpload}
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.8rem",
            color: WARM_TEXT,
          }}
        />
      </div>

      {/* Bio */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_MOCHA,
            fontSize: "0.88rem",
            fontWeight: 600,
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          Bio
        </div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          data-ocid="admin.textarea"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: `1px solid ${WARM_BORDER}`,
            borderRadius: 8,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.85rem",
            color: WARM_TEXT,
            background: WARM_PAPER,
            resize: "vertical",
            outline: "none",
          }}
        />
      </div>

      {/* Story */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_MOCHA,
            fontSize: "0.88rem",
            fontWeight: 600,
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          Full Story / About Content
        </div>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={10}
          data-ocid="admin.textarea"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: `1px solid ${WARM_BORDER}`,
            borderRadius: 8,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.85rem",
            color: WARM_TEXT,
            background: WARM_PAPER,
            resize: "vertical",
            outline: "none",
          }}
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        data-ocid="admin.save_button"
        style={{
          background: saved ? "rgba(92,180,92,0.15)" : "rgba(212,168,83,0.85)",
          border: "none",
          borderRadius: 8,
          padding: "0.6rem 1.5rem",
          cursor: "pointer",
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: "0.85rem",
          color: "#3D2B1F",
          fontWeight: 600,
          transition: "all 0.2s",
        }}
      >
        {saved ? "Saved!" : "Save About Content"}
      </button>
    </div>
  );
}

export default function AdminSlide() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [deletedPoems, setDeletedPoems] = useState<Set<number>>(new Set());
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [showNewPoemModal, setShowNewPoemModal] = useState(false);
  const [newPoemTitle, setNewPoemTitle] = useState("");
  const [newPoemCategory, setNewPoemCategory] = useState("Identity");
  const [newPoemText, setNewPoemText] = useState("");
  const [newPoemImageUrl, setNewPoemImageUrl] = useState("");
  const [twoFAStep, setTwoFAStep] = useState(false);
  const [twoFAInput, setTwoFAInput] = useState("");
  const [rules, setRules] = useState(
    "1. Be respectful to all community members.\n2. No hate speech or harassment.\n3. Share only original content or give proper credit.\n4. Keep discussions poetry-related.\n5. No spam or promotional content.\n6. Respect privacy of others.",
  );

  // Guardian moderation
  const { actor } = useActor();
  interface ModerationEntry {
    id: bigint;
    contentType: string;
    content: string;
    authorName: string;
    status: { __kind__: string };
    reason: string;
    riskLevel: string;
    timestamp: bigint;
  }
  interface ModerationStats {
    pendingCount: bigint;
    approvedCount: bigint;
    rejectedCount: bigint;
  }
  const [moderationQueue, setModerationQueue] = useState<ModerationEntry[]>([]);
  const [moderationStats, setModerationStats] =
    useState<ModerationStats | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<
    Record<string, boolean>
  >({});
  const [guardianLoading, setGuardianLoading] = useState(false);

  const loadGuardianData = async () => {
    if (!actor) return;
    setGuardianLoading(true);
    try {
      const [queue, stats] = await Promise.all([
        (actor as any).getModerationQueue(),
        (actor as any).getModerationStats(),
      ]);
      setModerationQueue(queue as ModerationEntry[]);
      setModerationStats(stats as ModerationStats);
    } catch {}
    setGuardianLoading(false);
  };

  const handleApprove = async (id: bigint) => {
    if (!actor) return;
    try {
      await (actor as any).approveModeratedContent(id);
      toast.success("Content approved");
      loadGuardianData();
    } catch {
      toast.error("Failed");
    }
  };

  const handleReject = async (id: bigint, idStr: string) => {
    if (!actor) return;
    try {
      await (actor as any).rejectModeratedContent(
        id,
        rejectReason[idStr] || "Violates community guidelines",
      );
      toast.success("Content rejected");
      setShowRejectInput((p) => ({ ...p, [idStr]: false }));
      loadGuardianData();
    } catch {
      toast.error("Failed");
    }
  };

  useEffect(() => {
    setDeletedPoems(
      new Set(
        JSON.parse(localStorage.getItem("chinnua_deleted_poems") || "[]"),
      ),
    );
    setFeedPosts(JSON.parse(localStorage.getItem("chinnua_posts") || "[]"));
    setUsers(JSON.parse(localStorage.getItem("chinnua_users") || "[]"));
    setGallery(JSON.parse(localStorage.getItem("chinnua_gallery") || "[]"));
    setAnnouncement(localStorage.getItem("chinnua_announcement") || "");
    const storedRules = localStorage.getItem("chinnua_rules");
    if (storedRules) setRules(storedRules);
  }, []);

  const checkPassword = async () => {
    let passwordOk = false;
    try {
      if (actor) {
        const ok = await (actor as any).checkAdminPassword(password);
        if (ok) passwordOk = true;
        else {
          toast.error("Incorrect password");
          return;
        }
      } else {
        if (password === "chinnua2025") passwordOk = true;
        else {
          toast.error("Incorrect password");
          return;
        }
      }
    } catch {
      if (password === "chinnua2025") passwordOk = true;
      else {
        toast.error("Incorrect password");
        return;
      }
    }

    if (passwordOk) {
      const storedCode = localStorage.getItem("chinnua_2fa_code");
      if (storedCode) {
        setTwoFAStep(true);
      } else {
        setAuthed(true);
        localStorage.setItem("chinnua_admin_authed", "true");
      }
    }
  };

  const checkTwoFA = () => {
    const storedCode = localStorage.getItem("chinnua_2fa_code");
    if (twoFAInput === storedCode) {
      setAuthed(true);
      setTwoFAStep(false);
      localStorage.setItem("chinnua_admin_authed", "true");
    } else {
      toast.error("Invalid 2FA code");
    }
  };

  const publishNewPoem = () => {
    if (!newPoemTitle.trim() || !newPoemText.trim()) {
      toast.error("Title and poem text are required");
      return;
    }
    const customPoems = JSON.parse(
      localStorage.getItem("chinnua_custom_poems") || "[]",
    );
    const newPoem = {
      id: `custom_${Date.now()}`,
      title: newPoemTitle.trim(),
      category: newPoemCategory,
      full: newPoemText.trim(),
      imageUrl: newPoemImageUrl.trim() || null,
      author: "CHINNUA_POET",
      timestamp: new Date().toISOString(),
    };
    customPoems.unshift(newPoem);
    localStorage.setItem("chinnua_custom_poems", JSON.stringify(customPoems));
    setNewPoemTitle("");
    setNewPoemText("");
    setNewPoemImageUrl("");
    setShowNewPoemModal(false);
    toast.success("Poem published successfully");
  };

  const emergencyReset = () => {
    localStorage.removeItem("chinnua_admin_password");
    toast.success("Password reset to chinnua2025 — try logging in now");
  };

  const lockAdmin = () => {
    setAuthed(false);
    localStorage.removeItem("chinnua_admin_authed");
  };

  const deletePoem = (id: number) => {
    const updated = new Set(deletedPoems);
    updated.add(id);
    localStorage.setItem("chinnua_deleted_poems", JSON.stringify([...updated]));
    setDeletedPoems(updated);
    toast.success("Poem hidden");
  };

  const restorePoem = (id: number) => {
    const updated = new Set(deletedPoems);
    updated.delete(id);
    localStorage.setItem("chinnua_deleted_poems", JSON.stringify([...updated]));
    setDeletedPoems(updated);
    toast.success("Poem restored");
  };

  const deleteFeedPost = (id: string) => {
    const deletedIds: string[] = JSON.parse(
      localStorage.getItem("chinnua_deleted_posts") || "[]",
    );
    deletedIds.push(id);
    localStorage.setItem("chinnua_deleted_posts", JSON.stringify(deletedIds));
    const updated = feedPosts.filter((p) => p.id !== id);
    localStorage.setItem("chinnua_posts", JSON.stringify(updated));
    setFeedPosts(updated);
    toast.success("Post deleted");
  };

  const deleteUser = (username: string) => {
    const updated = users.filter((u) => u.username !== username);
    localStorage.setItem("chinnua_users", JSON.stringify(updated));
    setUsers(updated);
    toast.success("User removed");
  };

  const deleteGalleryPhoto = (id: string) => {
    const updated = gallery.filter((p) => p.id !== id);
    localStorage.setItem("chinnua_gallery", JSON.stringify(updated));
    setGallery(updated);
    toast.success("Photo deleted");
  };

  const savePassword = () => {
    if (!newPassword.trim()) return;
    localStorage.setItem("chinnua_admin_password", newPassword.trim());
    setNewPassword("");
    toast.success("Password updated");
  };

  const inputStyle = {
    background: "rgba(255,248,238,0.9)",
    border: "1px solid rgba(139,111,71,0.3)",
    borderRadius: 8,
    padding: "0.6rem 0.9rem",
    color: "#3D2B1F",
    fontFamily: "'Libre Baskerville', Georgia, serif",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  };
  const deleteBtn = {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "rgba(239,68,68,0.9)",
    fontFamily: "'Libre Baskerville', Georgia, serif",
    fontSize: "0.78rem",
    padding: "0.25rem 0.75rem",
    height: "auto" as const,
  };

  if (!authed) {
    return (
      <div
        className="slide-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="feed-card"
          style={{
            padding: "2.5rem",
            width: "100%",
            maxWidth: 380,
            textAlign: "center",
          }}
          data-ocid="admin.panel"
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.4rem",
              color: "#3D2B1F",
              marginBottom: "0.5rem",
            }}
          >
            Admin Panel
          </h2>
          <p
            style={{
              color: "rgba(92,61,46,0.5)",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            Enter password to continue
          </p>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              data-ocid="admin.input"
              onKeyDown={(e) => {
                if (e.key === "Enter") checkPassword();
              }}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(92,61,46,0.5)",
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button
            onClick={checkPassword}
            data-ocid="admin.submit_button"
            style={{
              width: "100%",
              background: "rgba(200,169,106,0.85)",
              border: "none",
              color: "#3D2B1F",
            }}
          >
            Enter
          </Button>
          <button
            type="button"
            onClick={emergencyReset}
            style={{
              marginTop: "0.5rem",
              background: "none",
              border: "none",
              color: "#8B6F47",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              textDecoration: "underline",
            }}
          >
            Forgot password? Reset to default
          </button>
        </motion.div>
      </div>
    );
  }

  if (twoFAStep) {
    return (
      <div
        className="slide-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="feed-card"
          style={{
            padding: "2.5rem",
            width: "100%",
            maxWidth: 380,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.2rem",
              color: WARM_TEXT,
              marginBottom: "0.5rem",
            }}
          >
            Two-Factor Authentication
          </h2>
          <p
            style={{
              color: WARM_MUTED,
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            Enter your 6-digit backup code
          </p>
          <input
            type="text"
            value={twoFAInput}
            onChange={(e) => setTwoFAInput(e.target.value)}
            placeholder="000000"
            maxLength={6}
            onKeyDown={(e) => {
              if (e.key === "Enter") checkTwoFA();
            }}
            style={{
              background: "rgba(255,248,238,0.9)",
              border: "1px solid rgba(139,111,71,0.3)",
              borderRadius: 8,
              padding: "0.6rem 0.9rem",
              color: WARM_TEXT,
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "1.2rem",
              outline: "none",
              width: "100%",
              letterSpacing: "0.3em",
              textAlign: "center",
              marginBottom: "1rem",
              boxSizing: "border-box",
            }}
            data-ocid="admin.input"
          />
          <Button
            onClick={checkTwoFA}
            data-ocid="admin.submit_button"
            style={{
              width: "100%",
              background: "rgba(200,169,106,0.85)",
              border: "none",
              color: WARM_TEXT,
            }}
          >
            Verify
          </Button>
          <button
            type="button"
            onClick={() => setTwoFAStep(false)}
            style={{
              marginTop: "0.5rem",
              background: "none",
              border: "none",
              color: WARM_BROWN,
              fontSize: "0.75rem",
              cursor: "pointer",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              textDecoration: "underline",
            }}
          >
            Back to password
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="slide-container"
      style={{ overflowY: "auto", paddingBottom: "2rem" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.6rem",
              color: "#3D2B1F",
              fontWeight: 700,
            }}
          >
            Admin Panel
          </h2>
          <Button
            onClick={lockAdmin}
            data-ocid="admin.secondary_button"
            style={{
              background: "rgba(255,248,238,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#8B6F47",
              fontSize: "0.82rem",
            }}
          >
            Lock
          </Button>
        </div>
        <Tabs defaultValue="poems">
          <TabsList
            style={{
              background: "rgba(255,248,238,0.9)",
              border: "1px solid rgba(200,169,106,0.15)",
              marginBottom: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              height: "auto",
              gap: "0.25rem",
            }}
          >
            {[
              "poems",
              "feed",
              "users",
              "gallery",
              "settings",
              "rules",
              "guardian",
              "letters",
              "replies",
              "ai-users",
              "music",
              "inbox",
              "about",
            ].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                data-ocid="admin.tab"
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.82rem",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="poems">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  color: "rgba(92,61,46,0.5)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.82rem",
                  margin: 0,
                }}
              >
                {POEMS.length} poems · {deletedPoems.size} hidden
              </p>
              <Button
                onClick={() => setShowNewPoemModal(true)}
                data-ocid="admin.primary_button"
                style={{
                  background: "rgba(212,168,83,0.85)",
                  border: "none",
                  color: "#3D2B1F",
                  fontFamily: "'Lora', serif",
                  fontSize: "0.82rem",
                }}
              >
                + Write New Poem
              </Button>
            </div>
            {/* New Poem Modal */}
            {showNewPoemModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  zIndex: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1rem",
                }}
                data-ocid="admin.modal"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  style={{
                    background: "#F5ECD7",
                    borderRadius: 16,
                    padding: "2rem",
                    maxWidth: 520,
                    width: "100%",
                    maxHeight: "85vh",
                    overflowY: "auto",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: WARM_TEXT,
                      fontSize: "1.2rem",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Write New Poem
                  </h3>
                  <input
                    value={newPoemTitle}
                    onChange={(e) => setNewPoemTitle(e.target.value)}
                    placeholder="Poem title"
                    style={{ ...inputStyle, marginBottom: "0.75rem" }}
                    data-ocid="admin.input"
                  />
                  <select
                    value={newPoemCategory}
                    onChange={(e) => setNewPoemCategory(e.target.value)}
                    style={{ ...inputStyle, marginBottom: "0.75rem" }}
                    data-ocid="admin.select"
                  >
                    {[
                      "Sad",
                      "Romantic",
                      "Dark",
                      "Hopeful",
                      "Love",
                      "Loss",
                      "Nature",
                      "Spiritual",
                      "Identity",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <Textarea
                    value={newPoemText}
                    onChange={(e) => setNewPoemText(e.target.value)}
                    placeholder="Write your poem here…"
                    rows={10}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      marginBottom: "0.75rem",
                    }}
                    data-ocid="admin.textarea"
                  />
                  <input
                    value={newPoemImageUrl}
                    onChange={(e) => setNewPoemImageUrl(e.target.value)}
                    placeholder="Optional image URL"
                    style={{ ...inputStyle, marginBottom: "1rem" }}
                  />
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Button
                      onClick={publishNewPoem}
                      data-ocid="admin.confirm_button"
                      style={{
                        flex: 1,
                        background: "rgba(212,168,83,0.85)",
                        border: "none",
                        color: "#3D2B1F",
                      }}
                    >
                      Publish Poem
                    </Button>
                    <Button
                      onClick={() => setShowNewPoemModal(false)}
                      data-ocid="admin.cancel_button"
                      style={{
                        flex: 1,
                        background: "rgba(139,111,71,0.15)",
                        border: "1px solid rgba(139,111,71,0.3)",
                        color: WARM_TEXT,
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              {POEMS.slice(0, 100).map((poem) => (
                <div
                  key={poem.id}
                  className="feed-card"
                  style={{
                    padding: "0.75rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: deletedPoems.has(poem.id) ? 0.4 : 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.88rem",
                      color: "#3D2B1F",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginRight: "0.75rem",
                    }}
                  >
                    {poem.title}
                  </span>
                  {deletedPoems.has(poem.id) ? (
                    <Button
                      onClick={() => restorePoem(poem.id)}
                      style={{
                        background: "rgba(34,197,94,0.2)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        color: "rgba(34,197,94,0.9)",
                        fontSize: "0.78rem",
                        padding: "0.25rem 0.75rem",
                        height: "auto",
                      }}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      onClick={() => deletePoem(poem.id)}
                      data-ocid="admin.delete_button"
                      style={deleteBtn}
                    >
                      Hide
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feed">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {feedPosts.length === 0 ? (
                <p
                  style={{
                    color: "rgba(92,61,46,0.5)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                  }}
                  data-ocid="admin.empty_state"
                >
                  No user posts yet
                </p>
              ) : (
                feedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="feed-card"
                    style={{
                      padding: "0.75rem 1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <span
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.82rem",
                          color: "#D4A853",
                          marginRight: "0.5rem",
                        }}
                      >
                        @{post.username}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.85rem",
                          color: "#8B6F47",
                        }}
                      >
                        {(post.preview || "").slice(0, 60)}
                      </span>
                    </div>
                    <Button
                      onClick={() => deleteFeedPost(post.id)}
                      data-ocid="admin.delete_button"
                      style={{ ...deleteBtn, flexShrink: 0 }}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {users.length === 0 ? (
                <p
                  style={{
                    color: "rgba(92,61,46,0.5)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                  }}
                  data-ocid="admin.empty_state"
                >
                  No registered users
                </p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.username}
                    className="feed-card"
                    style={{
                      padding: "0.75rem 1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.9rem",
                          color: "#3D2B1F",
                          fontWeight: 600,
                        }}
                      >
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p
                          style={{
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: "0.78rem",
                            color: "rgba(92,61,46,0.5)",
                          }}
                        >
                          {user.bio.slice(0, 60)}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => deleteUser(user.username)}
                      data-ocid="admin.delete_button"
                      style={deleteBtn}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            {gallery.length === 0 ? (
              <p
                style={{
                  color: "rgba(92,61,46,0.5)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                }}
                data-ocid="admin.empty_state"
              >
                No gallery photos
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="feed-card"
                    style={{ padding: 0, overflow: "hidden" }}
                  >
                    <img
                      src={photo.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div style={{ padding: "0.5rem" }}>
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.75rem",
                          color: "rgba(92,61,46,0.5)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {photo.uploader}
                      </p>
                      <Button
                        onClick={() => deleteGalleryPhoto(photo.id)}
                        data-ocid="admin.delete_button"
                        style={{
                          ...deleteBtn,
                          width: "100%",
                          padding: "0.2rem",
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                maxWidth: 480,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#3D2B1F",
                    marginBottom: "0.75rem",
                  }}
                >
                  Change Password
                </h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    data-ocid="admin.input"
                    style={{ ...inputStyle, flex: 1, width: "auto" }}
                  />
                  <Button
                    onClick={savePassword}
                    data-ocid="admin.save_button"
                    style={{
                      background: "rgba(200,169,106,0.85)",
                      border: "none",
                      color: "#3D2B1F",
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#3D2B1F",
                    marginBottom: "0.75rem",
                  }}
                >
                  Site Announcement
                </h3>
                <Textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Announcement visible to all users..."
                  data-ocid="admin.textarea"
                  style={{
                    background: "rgba(255,248,238,0.9)",
                    border: "1px solid rgba(139,111,71,0.3)",
                    color: "#3D2B1F",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    minHeight: 80,
                  }}
                />
                <Button
                  onClick={() => {
                    localStorage.setItem("chinnua_announcement", announcement);
                    toast.success("Saved");
                  }}
                  data-ocid="admin.save_button"
                  style={{
                    marginTop: "0.5rem",
                    background: "rgba(200,169,106,0.85)",
                    border: "none",
                    color: "#3D2B1F",
                  }}
                >
                  Save Announcement
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules">
            <div style={{ maxWidth: 600 }}>
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#3D2B1F",
                  marginBottom: "0.75rem",
                }}
              >
                Community Rules
              </h3>
              <Textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                data-ocid="admin.textarea"
                style={{
                  background: "rgba(255,248,238,0.9)",
                  border: "1px solid rgba(139,111,71,0.3)",
                  color: "#3D2B1F",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  minHeight: 200,
                }}
              />
              <Button
                onClick={() => {
                  localStorage.setItem("chinnua_rules", rules);
                  toast.success("Rules saved");
                }}
                data-ocid="admin.save_button"
                style={{
                  marginTop: "0.75rem",
                  background: "rgba(200,169,106,0.85)",
                  border: "none",
                  color: "#3D2B1F",
                }}
              >
                Save Rules
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="guardian">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>🛡️</span>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#D4A853",
                      margin: 0,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    The Silent Guardian
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      color: "rgba(92,61,46,0.5)",
                      fontSize: "0.78rem",
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    Watching quietly. Protecting the space.
                  </p>
                </div>
                <Button
                  onClick={loadGuardianData}
                  data-ocid="admin.secondary_button"
                  style={{
                    marginLeft: "auto",
                    background: "rgba(200,169,106,0.12)",
                    border: "1px solid rgba(200,169,106,0.25)",
                    color: "#D4A853",
                    fontSize: "0.78rem",
                  }}
                >
                  {guardianLoading ? "Loading…" : "Refresh"}
                </Button>
              </div>

              {/* Stats */}
              {moderationStats && (
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    {
                      label: "Pending",
                      count: moderationStats.pendingCount,
                      color: "#D4A853",
                    },
                    {
                      label: "Approved",
                      count: moderationStats.approvedCount,
                      color: "rgba(74,222,128,0.8)",
                    },
                    {
                      label: "Rejected",
                      count: moderationStats.rejectedCount,
                      color: "rgba(248,113,113,0.8)",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(200,169,106,0.1)",
                        borderRadius: 10,
                        padding: "0.75rem 1.25rem",
                        minWidth: 90,
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.5rem",
                          color: s.color,
                          margin: 0,
                          fontWeight: 700,
                        }}
                      >
                        {s.count.toString()}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.72rem",
                          color: "rgba(92,61,46,0.5)",
                          margin: 0,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Queue */}
              {moderationQueue.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                    🛡️
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: "italic",
                      color: "#8B6F47",
                      fontSize: "0.95rem",
                    }}
                  >
                    The Guardian is watching silently.
                    <br />
                    No content needs review.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {moderationQueue.map((entry) => {
                    const idStr = entry.id.toString();
                    const riskColor =
                      entry.riskLevel === "high"
                        ? "rgba(248,113,113,0.85)"
                        : entry.riskLevel === "medium"
                          ? "rgba(251,191,36,0.85)"
                          : "rgba(74,222,128,0.85)";
                    return (
                      <div
                        key={idStr}
                        style={{
                          background: "rgba(26,20,16,0.7)",
                          border: "1px solid rgba(200,169,106,0.12)",
                          borderRadius: 10,
                          padding: "1rem 1.25rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.78rem",
                              color: "#D4A853",
                              textTransform: "capitalize",
                            }}
                          >
                            {entry.contentType}
                          </span>
                          <span style={{ color: "rgba(92,61,46,0.4)" }}>·</span>
                          <span
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.78rem",
                              color: "rgba(92,61,46,0.5)",
                            }}
                          >
                            by {entry.authorName}
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              background: `${riskColor.replace("0.85", "0.12")}`,
                              border: `1px solid ${riskColor.replace("0.85", "0.3")}`,
                              borderRadius: 6,
                              padding: "0.1rem 0.5rem",
                              color: riskColor,
                              fontSize: "0.72rem",
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              textTransform: "capitalize",
                            }}
                          >
                            {entry.riskLevel} risk
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontStyle: "italic",
                            color: "#8B6F47",
                            fontSize: "0.88rem",
                            lineHeight: 1.6,
                            margin: "0 0 0.5rem",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          "{entry.content.slice(0, 200)}
                          {entry.content.length > 200 ? "…" : ""}"
                        </p>
                        {entry.reason && (
                          <p
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.75rem",
                              color: "#8B6F47",
                              margin: "0 0 0.75rem",
                              fontStyle: "italic",
                            }}
                          >
                            Flagged: {entry.reason}
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleApprove(entry.id)}
                            data-ocid="admin.confirm_button"
                            style={{
                              background: "rgba(74,222,128,0.1)",
                              border: "1px solid rgba(74,222,128,0.3)",
                              borderRadius: 6,
                              padding: "0.3rem 0.8rem",
                              color: "rgba(74,222,128,0.9)",
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.78rem",
                              cursor: "pointer",
                            }}
                          >
                            ✅ Approve
                          </button>
                          {showRejectInput[idStr] ? (
                            <>
                              <input
                                value={rejectReason[idStr] || ""}
                                onChange={(e) =>
                                  setRejectReason((p) => ({
                                    ...p,
                                    [idStr]: e.target.value,
                                  }))
                                }
                                placeholder="Reason for rejection…"
                                data-ocid="admin.input"
                                style={{
                                  flex: 1,
                                  minWidth: 140,
                                  background: "rgba(255,248,238,0.9)",
                                  border: "1px solid rgba(139,111,71,0.3)",
                                  borderRadius: 6,
                                  padding: "0.3rem 0.6rem",
                                  color: "#3D2B1F",
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.78rem",
                                  outline: "none",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleReject(entry.id, idStr)}
                                data-ocid="admin.delete_button"
                                style={{
                                  background: "rgba(248,113,113,0.1)",
                                  border: "1px solid rgba(248,113,113,0.3)",
                                  borderRadius: 6,
                                  padding: "0.3rem 0.8rem",
                                  color: "rgba(248,113,113,0.9)",
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                }}
                              >
                                Confirm Reject
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowRejectInput((p) => ({
                                    ...p,
                                    [idStr]: false,
                                  }))
                                }
                                data-ocid="admin.cancel_button"
                                style={{
                                  background: "transparent",
                                  border: "1px solid rgba(245,230,211,0.1)",
                                  borderRadius: 6,
                                  padding: "0.3rem 0.7rem",
                                  color: "rgba(92,61,46,0.5)",
                                  fontFamily:
                                    "'Libre Baskerville', Georgia, serif",
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setShowRejectInput((p) => ({
                                  ...p,
                                  [idStr]: true,
                                }))
                              }
                              data-ocid="admin.delete_button"
                              style={{
                                background: "rgba(248,113,113,0.08)",
                                border: "1px solid rgba(248,113,113,0.2)",
                                borderRadius: 6,
                                padding: "0.3rem 0.8rem",
                                color: "rgba(248,113,113,0.7)",
                                fontFamily:
                                  "'Libre Baskerville', Georgia, serif",
                                fontSize: "0.78rem",
                                cursor: "pointer",
                              }}
                            >
                              ❌ Reject
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="letters">
            <DailyLettersTab />
          </TabsContent>

          <TabsContent value="replies">
            <InkRepliesTab />
          </TabsContent>
          <TabsContent value="ai-users">
            <AiUsersTab />
          </TabsContent>
          <TabsContent value="music">
            <MusicManagementTab />
          </TabsContent>
          <TabsContent value="inbox">
            <AdminInboxTab />
          </TabsContent>
          <TabsContent value="about">
            <AdminAboutTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
