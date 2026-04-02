import { useState } from "react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: "Heart",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "💕",
      "💞",
      "💓",
      "💗",
    ],
  },
  {
    label: "Nature",
    emojis: [
      "🌸",
      "🌹",
      "🌺",
      "🌻",
      "🌷",
      "🌿",
      "🍃",
      "🍂",
      "🌊",
      "🌙",
      "⭐",
      "✨",
    ],
  },
  {
    label: "Poetic",
    emojis: [
      "📖",
      "📝",
      "✒️",
      "🕯️",
      "🪶",
      "📜",
      "🎭",
      "🎵",
      "🎶",
      "🌌",
      "💭",
      "🌅",
    ],
  },
  {
    label: "Feelings",
    emojis: [
      "😔",
      "😢",
      "😭",
      "🥺",
      "😌",
      "😊",
      "🥰",
      "😍",
      "😤",
      "😞",
      "😶",
      "🫂",
    ],
  },
  {
    label: "Weather",
    emojis: ["🌧️", "⛈️", "🌩️", "🌫️", "🌦️", "☀️", "🌤️", "❄️", "🌬️", "🌪️", "🌈", "⛅"],
  },
  {
    label: "Objects",
    emojis: [
      "🦋",
      "🕊️",
      "🦅",
      "🐦",
      "🌾",
      "🍵",
      "☕",
      "🪴",
      "🫀",
      "🎸",
      "🎹",
      "🎻",
    ],
  },
];

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div
      style={{
        background: "#FFF8EE",
        border: "1px solid rgba(139,111,71,0.25)",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(92,61,46,0.15)",
        padding: "0.75rem",
        width: 260,
        zIndex: 100,
      }}
      data-ocid="emoji_picker.panel"
    >
      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          marginBottom: "0.6rem",
          flexWrap: "wrap",
        }}
      >
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => setActiveCategory(i)}
            data-ocid="emoji_picker.tab"
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: 6,
              border:
                activeCategory === i
                  ? "1px solid rgba(212,168,83,0.5)"
                  : "1px solid rgba(139,111,71,0.2)",
              background:
                activeCategory === i ? "rgba(212,168,83,0.15)" : "transparent",
              cursor: "pointer",
              fontSize: "0.65rem",
              color: activeCategory === i ? "#5C3D2E" : "#8B6F47",
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "0.2rem",
        }}
      >
        {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            data-ocid="emoji_picker.button"
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              border: "none",
              borderRadius: 6,
              background: "transparent",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(212,168,83,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        data-ocid="emoji_picker.close_button"
        style={{
          marginTop: "0.5rem",
          width: "100%",
          padding: "0.25rem",
          background: "transparent",
          border: "1px solid rgba(139,111,71,0.2)",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "0.7rem",
          color: "rgba(92,61,46,0.5)",
          fontFamily: "'Lora', Georgia, serif",
        }}
      >
        Close
      </button>
    </div>
  );
}
