import { motion } from "motion/react";
import { useState } from "react";

const MOODS = [
  {
    name: "Melancholy",
    emoji: "🌧️",
    desc: "Gentle rain, soft piano — for when the heart is heavy",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3YSRoSdA634",
  },
  {
    name: "Romantic",
    emoji: "🌹",
    desc: "Warm strings and tender melodies — for when love speaks",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DXbvABJXBIyiY",
  },
  {
    name: "Peaceful",
    emoji: "🌿",
    desc: "Ambient sounds and stillness — for quiet reflection",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DX1s9knjP51Oa",
  },
  {
    name: "Energetic",
    emoji: "⚡",
    desc: "Upbeat rhythms to fuel your creative fire",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP",
  },
  {
    name: "Mystical",
    emoji: "🌙",
    desc: "Ethereal sounds for deep poetic exploration",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DWXe9gFZP0gtP",
  },
];

export default function MusicSlide() {
  const [activeMood, setActiveMood] = useState(MOODS[0]);

  return (
    <div className="slide-container" style={{ overflowY: "auto" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "1.5rem 1rem",
          paddingBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.6rem",
            color: "#F5E6D3",
            marginBottom: "0.5rem",
            fontWeight: 700,
          }}
        >
          Music Player
        </h2>
        <p
          style={{
            color: "rgba(229,231,235,0.5)",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.9rem",
            marginBottom: "2rem",
          }}
        >
          Choose your mood and let the music carry your words
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          {MOODS.map((mood) => (
            <button
              key={mood.name}
              type="button"
              onClick={() => setActiveMood(mood)}
              data-ocid="music.tab"
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: 24,
                border: `1px solid ${activeMood.name === mood.name ? "rgba(200,169,106,0.7)" : "rgba(200,169,106,0.2)"}`,
                background:
                  activeMood.name === mood.name
                    ? "rgba(200,169,106,0.2)"
                    : "transparent",
                color:
                  activeMood.name === mood.name
                    ? "rgba(200,169,106,0.95)"
                    : "rgba(229,231,235,0.6)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow:
                  activeMood.name === mood.name
                    ? "0 0 15px rgba(200,169,106,0.2)"
                    : "none",
              }}
            >
              {mood.emoji} {mood.name}
            </button>
          ))}
        </div>
        <motion.div
          key={activeMood.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(229,231,235,0.6)",
              marginBottom: "1.25rem",
              fontSize: "0.95rem",
            }}
          >
            {activeMood.desc}
          </p>
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(200,169,106,0.15)",
            }}
          >
            <iframe
              src={activeMood.playlist}
              width="100%"
              height="352"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`${activeMood.name} playlist`}
              style={{ display: "block" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
