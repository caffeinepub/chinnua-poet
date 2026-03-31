import { motion } from "motion/react";
import { useState } from "react";

const WARM_BG = "#FFF8EE";
const _WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const _WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";
const WARM_MUTED = "rgba(92,61,46,0.5)";

const MOODS = [
  {
    name: "Melancholy",
    desc: "Gentle rain, soft piano — for when the heart is heavy",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3YSRoSdA634",
  },
  {
    name: "Romantic",
    desc: "Warm strings and tender melodies — for when love speaks",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DXbvABJXBIyiY",
  },
  {
    name: "Peaceful",
    desc: "Ambient sounds and stillness — for quiet reflection",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DX1s9knjP51Oa",
  },
  {
    name: "Energetic",
    desc: "Upbeat rhythms to fuel your creative fire",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP",
  },
  {
    name: "Mystical",
    desc: "Ethereal sounds for deep poetic exploration",
    playlist: "https://open.spotify.com/embed/playlist/37i9dQZF1DWXe9gFZP0gtP",
  },
];

export default function MusicSlide() {
  const [activeMood, setActiveMood] = useState(MOODS[0]);

  return (
    <div style={{ background: WARM_BG, overflowY: "auto", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.6rem",
            color: WARM_MOCHA,
            marginBottom: "0.5rem",
            fontWeight: 700,
          }}
        >
          Music Player
        </h2>
        <p
          style={{
            color: WARM_MUTED,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.9rem",
            marginBottom: "2rem",
            fontStyle: "italic",
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
                border: `1px solid ${
                  activeMood.name === mood.name
                    ? "rgba(212,168,83,0.7)"
                    : WARM_BORDER
                }`,
                background:
                  activeMood.name === mood.name
                    ? "rgba(212,168,83,0.15)"
                    : "transparent",
                color: activeMood.name === mood.name ? WARM_MOCHA : WARM_BROWN,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: activeMood.name === mood.name ? 600 : 400,
              }}
            >
              {mood.name}
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
              color: WARM_TEXT,
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
              border: `1px solid ${WARM_BORDER}`,
              boxShadow: "0 4px 20px rgba(92,61,46,0.1)",
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
