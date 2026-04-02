import { Bookmark, ExternalLink, Music } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";
const WARM_MUTED = "rgba(92,61,46,0.5)";

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
      "https://open.spotify.com/search/autumn%20letters%20cinematic%20orchestra",
  },
  {
    id: "default_2",
    title: "Experience",
    artist: "Ludovico Einaudi",
    mood: "Peaceful",
    spotifyUrl:
      "https://open.spotify.com/search/experience%20ludovico%20einaudi",
  },
  {
    id: "default_3",
    title: "River Flows in You",
    artist: "Yiruma",
    mood: "Romantic",
    spotifyUrl:
      "https://open.spotify.com/search/river%20flows%20in%20you%20yiruma",
  },
  {
    id: "default_4",
    title: "Night in the Forest",
    artist: "Max Richter",
    mood: "Dark",
    spotifyUrl: "https://open.spotify.com/search/max%20richter%20night",
  },
  {
    id: "default_5",
    title: "Golden Hour",
    artist: "JVKE",
    mood: "Hopeful",
    spotifyUrl: "https://open.spotify.com/search/golden%20hour%20jvke",
  },
];

const MOOD_PLAYLISTS = [
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
  const [activeMood, setActiveMood] = useState(MOOD_PLAYLISTS[0]);
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [savedTracks, setSavedTracks] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("chinnua_music_library") || "null",
      );
      if (stored && Array.isArray(stored) && stored.length > 0)
        setTracks(stored);
    } catch {}
    try {
      const items = JSON.parse(
        localStorage.getItem("chinnua_saved_items") || "[]",
      );
      const musicSaved = new Set(
        items.filter((i: any) => i.type === "music").map((i: any) => i.itemId),
      );
      setSavedTracks(musicSaved as Set<string>);
    } catch {}
  }, []);

  const handleSaveTrack = (trackId: string, currentUser: string | null) => {
    if (!currentUser) {
      toast("Sign in to save tracks");
      return;
    }
    const items: any[] = JSON.parse(
      localStorage.getItem("chinnua_saved_items") || "[]",
    );
    const newSaved = new Set(savedTracks);
    if (newSaved.has(trackId)) {
      newSaved.delete(trackId);
      const filtered = items.filter(
        (i) => !(i.type === "music" && i.itemId === trackId),
      );
      localStorage.setItem("chinnua_saved_items", JSON.stringify(filtered));
    } else {
      newSaved.add(trackId);
      items.push({
        id: `save_${Date.now()}`,
        type: "music",
        itemId: trackId,
        savedAt: new Date().toISOString(),
        userId: currentUser,
      });
      localStorage.setItem("chinnua_saved_items", JSON.stringify(items));
      toast("Track saved to your profile");
    }
    setSavedTracks(newSaved);
  };

  const currentUser = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("chinnua_user") || "null")?.username ??
        null
      );
    } catch {
      return null;
    }
  })();

  return (
    <div style={{ background: WARM_BG, overflowY: "auto", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem 2rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.4rem",
          }}
        >
          <Music size={20} color={WARM_GOLD} />
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.6rem",
              color: WARM_MOCHA,
              margin: 0,
              fontWeight: 700,
            }}
          >
            Music Player
          </h2>
        </div>
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

        {/* Mood playlists */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          {MOOD_PLAYLISTS.map((mood) => (
            <button
              key={mood.name}
              type="button"
              onClick={() => setActiveMood(mood)}
              data-ocid="music.tab"
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: 24,
                border: `1px solid ${activeMood.name === mood.name ? "rgba(212,168,83,0.7)" : WARM_BORDER}`,
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

        {/* Admin-curated track library */}
        {tracks.length > 0 && (
          <section style={{ marginTop: "2.5rem" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: WARM_MOCHA,
                fontSize: "1.1rem",
                marginBottom: "1rem",
                fontWeight: 600,
              }}
            >
              Curated Tracks
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {tracks.map((track) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: WARM_PAPER,
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 12,
                    padding: "0.9rem 1.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <Music
                    size={16}
                    color={WARM_GOLD}
                    style={{ flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 700,
                        color: WARM_MOCHA,
                        fontSize: "0.9rem",
                      }}
                    >
                      {track.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "0.78rem",
                        color: WARM_BROWN,
                      }}
                    >
                      {track.artist}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "0.2rem 0.6rem",
                      background: "rgba(212,168,83,0.12)",
                      borderRadius: 12,
                      fontSize: "0.68rem",
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
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.75rem",
                        color: WARM_GOLD,
                        textDecoration: "none",
                        flexShrink: 0,
                      }}
                      data-ocid="music.button"
                    >
                      <ExternalLink size={13} /> Spotify
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSaveTrack(track.id, currentUser)}
                    data-ocid="music.toggle"
                    title={savedTracks.has(track.id) ? "Unsave" : "Save"}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: savedTracks.has(track.id) ? WARM_GOLD : WARM_BROWN,
                      flexShrink: 0,
                      transition: "color 0.2s",
                    }}
                  >
                    <Bookmark
                      size={15}
                      fill={savedTracks.has(track.id) ? WARM_GOLD : "none"}
                    />
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}
