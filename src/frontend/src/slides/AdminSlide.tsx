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
  name?: string;
  displayName?: string;
  bio: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  joinedAt?: string;
  isBot?: boolean;
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
    audioData?: string;
    fileName?: string;
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

  const [pendingAudio, setPendingAudio] = React.useState<{
    data: string;
    fileName: string;
  } | null>(null);

  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Audio file must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      setPendingAudio({ data, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const addTrack = () => {
    if (!newTrack.title.trim() || !newTrack.artist.trim()) return;
    const track: Track = {
      ...newTrack,
      id: `track_${Date.now()}`,
      ...(pendingAudio
        ? { audioData: pendingAudio.data, fileName: pendingAudio.fileName }
        : {}),
    };
    const updated = [...tracks, track];
    setTracks(updated);
    localStorage.setItem("chinnua_music_library", JSON.stringify(updated));
    setNewTrack({ title: "", artist: "", mood: "Peaceful", spotifyUrl: "" });
    setPendingAudio(null);
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
        {/* Audio upload */}
        <div style={{ marginBottom: "0.75rem" }}>
          <label
            htmlFor="audio-file-upload"
            style={{
              display: "block",
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.82rem",
              color: WARM_BROWN,
              marginBottom: "0.4rem",
            }}
          >
            Upload Audio File (optional, max 10MB)
          </label>
          <input
            id="audio-file-upload"
            type="file"
            accept="audio/*"
            onChange={handleAudioFile}
            data-ocid="admin.upload_button"
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.8rem",
              color: WARM_TEXT,
            }}
          />
          {pendingAudio && (
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "0.75rem",
                color: WARM_BROWN,
                marginTop: "0.3rem",
                fontStyle: "italic",
              }}
            >
              Ready: {pendingAudio.fileName}
            </p>
          )}
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
            {(track as any).audioData && (
              <audio
                controls
                src={(track as any).audioData}
                style={{ height: 28, flexShrink: 0, maxWidth: 140 }}
              >
                <track kind="captions" srcLang="en" label="English" />
              </audio>
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
  const MORNING_DEFAULTS = [
    "Morning whispers in golden light,\nDreams fade softly from the night,\nRise with hope, let worries fall,\nToday is yours—embrace it all.",
    "Sunrise paints the sky anew,\nFresh beginnings wait for you,\nBreathe in courage, let it stay,\nSmile gently into the day.",
    "Dewdrops shine on petals bright,\nCarrying dreams from fading night,\nWake your soul with gentle grace,\nLet joy reflect upon your face.",
    "The sky unfolds a story bright,\nOf hope reborn from darkest night,\nStep ahead with fearless heart,\nToday's your chance to make a start.",
    "Golden rays through windows glide,\nBringing peace you hold inside,\nLet your spirit rise and sing,\nMorning brings a brand new wing.",
    "Birds compose a melody sweet,\nNature bows at morning's feet,\nLet your heart in rhythm flow,\nWith every step, let happiness grow.",
    "Soft winds hum a morning tune,\nDreams awaken far too soon,\nGather strength from light above,\nWalk your path with hope and love.",
    "Sunlight dances on your face,\nTime begins its gentle race,\nChase your dreams, don't delay,\nMake your magic in the day.",
    "Morning blooms in silent cheer,\nWashing away yesterday's fear,\nStep with faith, stand tall and true,\nThe world awaits the best of you.",
    "New light spills across the sky,\nLifting dreams that long to fly,\nHold your purpose, keep it near,\nA brighter day has now appeared.",
    "Morning blooms in golden air,\nHope awakens everywhere,\nLet your dreams step into light,\nLeave behind the fading night.",
    "Sunlight kisses earth so wide,\nFilling hearts with warmth inside,\nRise and shine with fearless grace,\nLet joy glow upon your face.",
    "A new dawn hums soft and slow,\nCarrying dreams you wish to grow,\nStep ahead with courage bright,\nTurn your shadows into light.",
    "Morning sings in silent cheer,\nWashing off yesterday's fear,\nTake each step with calm belief,\nLife unfolds beyond your grief.",
    "Golden rays begin to flow,\nTouching hearts with gentle glow,\nRise with strength, embrace the day,\nLet your worries drift away.",
    "Soft winds carry dreams anew,\nPainting skies in brighter hue,\nWake your soul with hopeful sight,\nChase your dreams with all your might.",
    "The sun writes poems in the sky,\nTelling dreams to rise and fly,\nHold your faith and start again,\nMorning heals all silent pain.",
    "Dawn arrives with silent grace,\nTime begins its steady race,\nFill your heart with purpose true,\nThe day belongs to you.",
    "Light unfolds on nature's face,\nFilling time with gentle pace,\nStep ahead with steady mind,\nLeave the past far behind.",
    'Morning whispers soft and low,\n"Let your inner beauty glow,"\nRise above each fear and doubt,\nThat\'s what life is all about.',
    "Sunlight spills like golden streams,\nAwakening your hidden dreams,\nTake a breath and start anew,\nA brighter path awaits you.",
    "The sky awakens calm and wide,\nWith endless hope standing beside,\nRise today with fearless will,\nAnd let your dreams fulfill.",
    "Morning hums a hopeful song,\nTelling you where you belong,\nTrust your path and gently start,\nLet courage guide your heart.",
    "Dewdrops shine like tiny stars,\nHealing yesterday's old scars,\nStep into the morning light,\nAnd make your future bright.",
    "Golden dawn begins to rise,\nPainting dreams across the skies,\nHold your strength and move ahead,\nLet no fear remain unsaid.",
    "A fresh new day begins to call,\nInviting you to give your all,\nWalk ahead with steady pace,\nVictory will find your place.",
    'Morning brings a silent cheer,\nWhispering "you\'re stronger here,"\nRise above what held you tight,\nStep into your inner light.',
    "Sunlight dances, soft and free,\nOpening paths you cannot see,\nTake the chance and make it real,\nTrust the strength you truly feel.",
    "The dawn unfolds a story new,\nFilled with dreams just made for you,\nHold your hope and let it stay,\nGuide you through this lovely day.",
    "Morning smiles in golden hue,\nBringing endless chance to you,\nRise, believe, and take your stand,\nLife is shaped by your own hand.",
    "Morning rises soft and bright,\nPushing back the silent night,\nTake a breath and start anew,\nThe world awakens just for you.",
    "Golden sunlight gently falls,\nAnswering your inner calls,\nRise with hope, let worries fade,\nStep into the plans you made.",
    "Dawn whispers through the air,\nTelling you life is fair,\nHold your dreams and let them grow,\nMorning gives a hopeful glow.",
    "Sunlight paints your path ahead,\nFilling courage where you tread,\nWalk with faith and fearless heart,\nEvery day's a brand new start.",
    "Morning breeze sings soft and low,\nCarrying dreams you long to grow,\nWake your soul and let it shine,\nToday is yours, the moment's mine.",
    "The sky unfolds in shades so new,\nHolding endless hope for you,\nRise and shine with strength inside,\nLet your dreams become your guide.",
    "Fresh light touches earth and sky,\nCalling silent dreams to fly,\nTake your step, don't hesitate,\nMorning opens every gate.",
    "The sun arrives with gentle grace,\nBringing smiles to every face,\nLet your worries drift away,\nAnd welcome in this lovely day.",
    "Morning hums a peaceful tune,\nDreams awaken all too soon,\nRise with courage, bold and free,\nBe the best you're meant to be.",
    "Golden rays begin to gleam,\nLighting up your hidden dream,\nStep ahead with calm and might,\nTurn your darkness into light.",
  ];

  const EVENING_DEFAULTS = [
    "Evening falls with amber glow,\nSoft winds whisper calm and slow,\nLet the worries drift away,\nPeace arrives at close of day.",
    "The sun bows low in silent grace,\nLeaving warmth in its embrace,\nPause a while, let silence stay,\nAnd gently end your busy day.",
    "Golden skies begin to fade,\nCalmness in the air is laid,\nTake a breath, release the strain,\nLet your soul feel light again.",
    "Evening hums a quiet song,\nTelling hearts they've been strong,\nRest your thoughts in twilight's hue,\nPeaceful moments wait for you.",
    "The horizon glows in soft delight,\nBlending day into the night,\nHold the calm, let tensions cease,\nWrap your soul in evening peace.",
    "Shadows stretch and softly creep,\nCalling minds to gentle sleep,\nBefore the night fully begins,\nLet go of battles, losses, wins.",
    "The sky turns into painted art,\nTouching deeply every heart,\nPause and feel this quiet bliss,\nEvenings are made just like this.",
    "A golden hush fills up the air,\nSoft and calm beyond compare,\nLet your heart slow down its pace,\nEvening brings a warm embrace.",
    "Light fades slow, yet hope remains,\nAfter joys and after pains,\nBreathe in calm, let stillness stay,\nAnd gently close your day.",
    "Twilight sings in colors deep,\nCalling dreams from hidden sleep,\nLet your soul in silence bend,\nTo the beauty evenings send.",
    "Evening falls in amber light,\nBlending day into the night,\nPause your heart and softly breathe,\nLet the calm your soul receive.",
    "Golden skies begin to rest,\nHolding warmth within your chest,\nLet your worries fade away,\nPeace arrives at end of day.",
    "The sun dips low with quiet grace,\nLeaving glow in every place,\nSlow your thoughts and gently stay,\nFeel the calm of closing day.",
    "Evening hums a soothing tune,\nUnderneath the rising moon,\nLet your heart release its weight,\nPeace is never far or late.",
    "Twilight paints the world so still,\nSoftly bending time and will,\nTake a pause, let silence grow,\nFeel the peace you truly know.",
    "Golden light begins to fade,\nYet a calm is gently laid,\nBreathe it in and let it stay,\nEnding softly your long day.",
    "Evening whispers calm and slow,\nLetting inner stillness grow,\nLeave behind each stress and race,\nRest within this quiet space.",
    "The horizon glows so deep,\nCalling tired minds to sleep,\nBefore the stars fully rise,\nRest your thoughts and close your eyes.",
    "Light dissolves in twilight's art,\nTouching gently every heart,\nHold the calm and let it stay,\nPeace belongs to evening's way.",
    "Evening wraps the world in peace,\nGiving every soul release,\nLet your mind grow soft and light,\nDrifting slowly into night.",
    "Soft winds hum a lullaby,\nAs the daylight waves goodbye,\nLet your spirit settle down,\nTrade your worries for a crown.",
    "The sky turns into gentle fire,\nCooling down each loud desire,\nPause your soul and feel the air,\nEvening's calm is always there.",
    "A quiet glow fills up the sky,\nWhere silent dreams begin to lie,\nTake a breath and let it flow,\nPeace is something you should know.",
    "Evening sings in colors mild,\nSoothing every heart once wild,\nLet your thoughts find softer ground,\nWhere true calmness can be found.",
    "Daylight fades with gentle art,\nLeaving warmth within your heart,\nClose the chapter, slow your pace,\nRest inside this calm embrace.",
    'Twilight whispers soft and near,\n"You have done enough, my dear,"\nLet your heart now gently rest,\nYou have truly tried your best.',
    "Evening spreads a velvet sky,\nWhere your restless thoughts can lie,\nTake a pause and just be still,\nLet calmness bend your will.",
    "Golden dusk begins to fall,\nBringing quiet to it all,\nLet your worries fade away,\nYou've survived another day.",
    'The day now bows in silent peace,\nGiving hearts a sweet release,\nBreathe it in and gently say,\n"I\'ll begin again someday."',
    "Evening comes with tender light,\nBridging day and silent night,\nLet your heart feel soft and free,\nJust exist and simply be.",
    "Evening falls with gentle light,\nBridging day into the night,\nPause your heart and softly breathe,\nLet the calm your soul receive.",
    "Golden skies begin to fade,\nPeace within the air is laid,\nLet your worries slip away,\nYou've done enough for today.",
    "The sun bows down in silent grace,\nLeaving warmth in every place,\nSlow your thoughts and gently rest,\nYou have truly done your best.",
    "Twilight hums a quiet song,\nTelling hearts they've been strong,\nLet your mind now drift in peace,\nGive your worries sweet release.",
    "Evening paints the sky so wide,\nHolding calmness deep inside,\nTake a breath and let it stay,\nEnd with peace your busy day.",
    "Soft winds whisper through the air,\nCarrying peace beyond compare,\nLet your soul unwind and slow,\nEvening's calm begins to grow.",
    "Golden dusk begins to fall,\nBringing silence over all,\nLeave behind the stress and race,\nRest within this quiet space.",
    "Light dissolves in colors deep,\nCalling tired minds to sleep,\nBefore the stars fill up the sky,\nLet your restless thoughts pass by.",
    "Evening comes with tender glow,\nTeaching hearts to move slow,\nHold this calm and let it stay,\nEnding softly your long day.",
    "The horizon fades in art,\nTouching softly every heart,\nTake a pause and simply be,\nWrapped in quiet harmony.",
  ];

  const NIGHT_DEFAULTS = [
    "Stars awaken in the sky,\nWhispering dreams drifting by,\nClose your eyes, let worries fade,\nIn night's calm embrace be laid.",
    "Moonlight falls so soft and bright,\nGuarding you through silent night,\nRest your soul, release the day,\nLet your dreams gently sway.",
    "The night hums a lullaby,\nUnderneath a velvet sky,\nLay your thoughts to peaceful rest,\nTomorrow will bring its best.",
    "Darkness wraps the world in peace,\nGiving hearts a sweet release,\nSleep now deep, let dreams take flight,\nWrapped in love—good night.",
    "Stars align in quiet grace,\nLighting up the darkest space,\nClose your eyes, drift far away,\nTo a brighter, softer day.",
    "Night descends with tender care,\nBringing calm into the air,\nLet your soul unwind and rest,\nSleep is nature's quiet best.",
    "Moonlight paints your dreams in white,\nGuarding you throughout the night,\nLet go softly, breathe in deep,\nAnd fall into peaceful sleep.",
    "Silent skies above you stay,\nWashing all your stress away,\nDream in colors, soft and bright,\nSleep in peace—good night.",
    "The world slows down, the stars appear,\nCarrying dreams you hold dear,\nClose your eyes without a fight,\nTomorrow waits—good night.",
    "Night wraps you in velvet streams,\nGuiding you to gentle dreams,\nLet your heart feel calm and light,\nSleep well, and good night.",
    "Night descends with silent grace,\nWrapping calm in every space,\nClose your eyes and drift away,\nDreams will guide a brighter day.",
    "Stars above begin to glow,\nWhispering things you need to know,\nRest your soul and breathe in deep,\nLet the night embrace your sleep.",
    "Moonlight dances soft and slow,\nWhere peaceful dreams begin to grow,\nLet your worries fade from sight,\nSleep in calm and gentle night.",
    "The sky turns dark yet softly kind,\nLeaving all your stress behind,\nLay your head and gently rest,\nTomorrow will bring its best.",
    "Stars align in quiet streams,\nGuiding you to tender dreams,\nClose your eyes without a fear,\nPeaceful nights are always near.",
    "Night hums low a silent song,\nTelling you you've been strong,\nLet your heart now rest and heal,\nDreams will show what you can feel.",
    "Moonlight wraps your thoughts in white,\nGuarding you through every night,\nLet go softly, don't hold tight,\nEverything will be alright.",
    "The world slows down, the air is still,\nLet go now of every will,\nSleep will take you far away,\nTo a brighter, softer day.",
    "Stars whisper in the sky so deep,\nCalling you to peaceful sleep,\nLet your heart feel calm and light,\nDrift away—good night.",
    "Darkness brings a gentle peace,\nGiving tired minds release,\nClose your eyes and softly stay,\nDream your worries far away.",
    "Night arrives with silent grace,\nWrapping calm in every space,\nClose your eyes and drift away,\nDreams will guide a brighter day.",
    "Stars appear in skies so deep,\nCalling you to peaceful sleep,\nLet your worries fade from sight,\nRest your soul—good night.",
    "Moonlight falls so soft and bright,\nGuarding you through silent night,\nLay your head and gently rest,\nTomorrow will bring its best.",
    "The night hums a gentle tune,\nUnderneath the watching moon,\nLet your thoughts now fade away,\nSleep will heal what words can't say.",
    "Darkness brings a peaceful air,\nSoft and calm beyond compare,\nClose your eyes and drift so light,\nWrapped in dreams—good night.",
    "Stars whisper in quiet streams,\nGuiding you to tender dreams,\nLet your heart feel calm and free,\nSleep in peaceful harmony.",
    "Moonlight paints your dreams so bright,\nHolding you throughout the night,\nLet go softly, breathe in deep,\nAnd fall into restful sleep.",
    "The world slows down, the air is still,\nLet go now of every will,\nRest your mind and close your sight,\nPeace surrounds you—good night.",
    "Night wraps you in velvet streams,\nCarrying you into dreams,\nLet your soul feel safe and light,\nSleep in calm—good night.",
    "The moon glows soft, the stars align,\nWhispering dreams so pure, so fine,\nLet your heart feel calm and right,\nDrift away—good night.",
  ];

  const [morningLetters, setMorningLetters] = React.useState<string[]>(() => {
    try {
      const d = localStorage.getItem("chinnua_daily_messages");
      if (d) {
        const parsed = JSON.parse(d);
        if (parsed.morning && parsed.morning.length > 0) return parsed.morning;
      }
    } catch {}
    return MORNING_DEFAULTS;
  });
  const [eveningLetters, setEveningLetters] = React.useState<string[]>(() => {
    try {
      const d = localStorage.getItem("chinnua_daily_messages");
      if (d) {
        const parsed = JSON.parse(d);
        if (parsed.evening && parsed.evening.length > 0) return parsed.evening;
      }
    } catch {}
    return EVENING_DEFAULTS;
  });
  const [nightLetters, setNightLetters] = React.useState<string[]>(() => {
    try {
      const d = localStorage.getItem("chinnua_daily_messages");
      if (d) {
        const parsed = JSON.parse(d);
        if (parsed.night && parsed.night.length > 0) return parsed.night;
      }
    } catch {}
    return NIGHT_DEFAULTS;
  });
  const [editIdx, setEditIdx] = React.useState<{
    type: "morning" | "evening" | "night";
    idx: number;
  } | null>(null);
  const [editVal, setEditVal] = React.useState("");
  const [newMsg, setNewMsg] = React.useState("");
  const [newType, setNewType] = React.useState<"morning" | "evening" | "night">(
    "morning",
  );
  const [sendToast, setSendToast] = React.useState<string | null>(null);
  const [seqPos, setSeqPos] = React.useState<number>(() => {
    try {
      return (
        Number.parseInt(
          localStorage.getItem("chinnua_letter_sequence_pos") || "0",
          10,
        ) || 0
      );
    } catch {
      return 0;
    }
  });

  const SEQ_LABELS = ["morning", "evening", "night"] as const;
  const SEQ_EMOJI = ["🌅", "🌇", "🌙"];
  const SEQ_NAMES = ["Good Morning", "Good Evening", "Good Night"];

  const save = (m: string[], e: string[], n: string[]) => {
    localStorage.setItem(
      "chinnua_daily_messages",
      JSON.stringify({ morning: m, evening: e, night: n }),
    );
  };

  const handleEdit = (
    type: "morning" | "evening" | "night",
    idx: number,
    val: string,
  ) => {
    if (type === "morning") {
      const updated = morningLetters.map((l, i) => (i === idx ? val : l));
      setMorningLetters(updated);
      save(updated, eveningLetters, nightLetters);
    } else if (type === "evening") {
      const updated = eveningLetters.map((l, i) => (i === idx ? val : l));
      setEveningLetters(updated);
      save(morningLetters, updated, nightLetters);
    } else {
      const updated = nightLetters.map((l, i) => (i === idx ? val : l));
      setNightLetters(updated);
      save(morningLetters, eveningLetters, updated);
    }
    setEditIdx(null);
  };

  const handleDelete = (type: "morning" | "evening" | "night", idx: number) => {
    if (type === "morning") {
      const updated = morningLetters.filter((_, i) => i !== idx);
      setMorningLetters(updated);
      save(updated, eveningLetters, nightLetters);
    } else if (type === "evening") {
      const updated = eveningLetters.filter((_, i) => i !== idx);
      setEveningLetters(updated);
      save(morningLetters, updated, nightLetters);
    } else {
      const updated = nightLetters.filter((_, i) => i !== idx);
      setNightLetters(updated);
      save(morningLetters, eveningLetters, updated);
    }
  };

  const handleAdd = () => {
    if (!newMsg.trim()) return;
    if (newType === "morning") {
      const updated = [...morningLetters, newMsg.trim()];
      setMorningLetters(updated);
      save(updated, eveningLetters, nightLetters);
    } else if (newType === "evening") {
      const updated = [...eveningLetters, newMsg.trim()];
      setEveningLetters(updated);
      save(morningLetters, updated, nightLetters);
    } else {
      const updated = [...nightLetters, newMsg.trim()];
      setNightLetters(updated);
      save(morningLetters, eveningLetters, updated);
    }
    setNewMsg("");
  };

  const sendToAll = (type: "morning" | "evening" | "night") => {
    const now = new Date().toISOString();
    localStorage.setItem(`chinnua_last_sent_${type}`, now);
    try {
      const users = JSON.parse(localStorage.getItem("chinnua_users") || "[]");
      const log = JSON.parse(localStorage.getItem("chinnua_sent_log") || "[]");
      log.push({ type, sentAt: now, count: users.length });
      localStorage.setItem("chinnua_sent_log", JSON.stringify(log));
    } catch {}
    const label =
      type === "morning"
        ? "Good Morning"
        : type === "evening"
          ? "Good Evening"
          : "Good Night";
    setSendToast(`${label} sent to all users!`);
    setTimeout(() => setSendToast(null), 3000);
  };

  const sendNextInSequence = () => {
    const type = SEQ_LABELS[seqPos];
    sendToAll(type);
    const next = (seqPos + 1) % 3;
    setSeqPos(next);
    localStorage.setItem("chinnua_letter_sequence_pos", String(next));
    const label = SEQ_NAMES[seqPos];
    const nextLabel = SEQ_NAMES[next];
    setSendToast(`${label} sent! Next up: ${nextLabel}`);
    setTimeout(() => setSendToast(null), 4000);
  };

  const getLastSent = (type: string) => {
    const ts = localStorage.getItem(`chinnua_last_sent_${type}`);
    if (!ts) return null;
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return null;
    }
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
    boxSizing: "border-box" as const,
  };

  const renderList = (
    items: string[],
    type: "morning" | "evening" | "night",
  ) => (
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
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
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
                  fontSize: "0.85rem",
                  color: WARM_TEXT,
                  margin: 0,
                  flex: 1,
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
                {i + 1}. {msg}
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
      {/* Toast */}
      {sendToast && (
        <div
          data-ocid="admin.toast"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "rgba(92,180,92,0.9)",
            color: "white",
            padding: "0.75rem 1.25rem",
            borderRadius: 10,
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.9rem",
            zIndex: 9999,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          {sendToast}
        </div>
      )}

      {/* Morning Letters */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: WARM_GOLD,
              fontSize: "1rem",
              margin: 0,
            }}
          >
            🌅 Good Morning Letters ({morningLetters.length})
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.2rem",
            }}
          >
            <button
              type="button"
              data-ocid="admin.primary_button"
              onClick={() => sendToAll("morning")}
              style={{
                background: "rgba(212,168,83,0.85)",
                border: "none",
                borderRadius: 6,
                padding: "0.35rem 0.85rem",
                color: "#3D2B1F",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontFamily: "'Lora', Georgia, serif",
                fontWeight: 600,
              }}
            >
              Send to All Users
            </button>
            {getLastSent("morning") && (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: WARM_BROWN,
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                Last sent: {getLastSent("morning")}
              </span>
            )}
          </div>
        </div>
        {renderList(morningLetters, "morning")}
      </div>

      {/* Evening Letters */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#B8860B",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            🌇 Good Evening Letters ({eveningLetters.length})
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.2rem",
            }}
          >
            <button
              type="button"
              data-ocid="admin.primary_button"
              onClick={() => sendToAll("evening")}
              style={{
                background: "rgba(184,134,11,0.85)",
                border: "none",
                borderRadius: 6,
                padding: "0.35rem 0.85rem",
                color: "#FFF8EE",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontFamily: "'Lora', Georgia, serif",
                fontWeight: 600,
              }}
            >
              Send to All Users
            </button>
            {getLastSent("evening") && (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: WARM_BROWN,
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                Last sent: {getLastSent("evening")}
              </span>
            )}
          </div>
        </div>
        {renderList(eveningLetters, "evening")}
      </div>

      {/* Night Letters */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: WARM_MOCHA,
              fontSize: "1rem",
              margin: 0,
            }}
          >
            🌙 Good Night Letters ({nightLetters.length})
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.2rem",
            }}
          >
            <button
              type="button"
              data-ocid="admin.primary_button"
              onClick={() => sendToAll("night")}
              style={{
                background: "rgba(92,61,46,0.85)",
                border: "none",
                borderRadius: 6,
                padding: "0.35rem 0.85rem",
                color: "#FFF8EE",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontFamily: "'Lora', Georgia, serif",
                fontWeight: 600,
              }}
            >
              Send to All Users
            </button>
            {getLastSent("night") && (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: WARM_BROWN,
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                Last sent: {getLastSent("night")}
              </span>
            )}
          </div>
        </div>
        {renderList(nightLetters, "night")}
      </div>

      {/* Sequential Send Section */}
      <div
        style={{
          background: "rgba(245,236,215,0.5)",
          border: "1px solid rgba(212,168,83,0.3)",
          borderRadius: 14,
          padding: "1.25rem",
        }}
      >
        <h4
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_MOCHA,
            fontSize: "0.95rem",
            margin: "0 0 0.5rem",
          }}
        >
          Sequential Send
        </h4>
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.78rem",
            color: WARM_BROWN,
            margin: "0 0 1rem",
          }}
        >
          Sends messages in order: Morning → Evening → Night → Morning → ...
          indefinitely.
        </p>
        <div
          style={{
            background: "rgba(212,168,83,0.08)",
            border: "1px solid rgba(212,168,83,0.2)",
            borderRadius: 8,
            padding: "0.75rem 1rem",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>{SEQ_EMOJI[seqPos]}</span>
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: WARM_MOCHA,
                fontSize: "0.9rem",
                margin: 0,
                fontWeight: 600,
              }}
            >
              Next: {SEQ_NAMES[seqPos]}
            </p>
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.72rem",
                color: WARM_BROWN,
                margin: "0.2rem 0 0",
              }}
            >
              After this: {SEQ_NAMES[(seqPos + 1) % 3]} →{" "}
              {SEQ_NAMES[(seqPos + 2) % 3]}
            </p>
          </div>
        </div>
        <button
          type="button"
          data-ocid="admin.primary_button"
          onClick={sendNextInSequence}
          style={{
            background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_MOCHA})`,
            border: "none",
            borderRadius: 8,
            padding: "0.6rem 1.5rem",
            color: "#FFF8EE",
            cursor: "pointer",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          {SEQ_EMOJI[seqPos]} Send Next ({SEQ_NAMES[seqPos]})
        </button>
      </div>

      {/* Add New Letter */}
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
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          {(["morning", "evening", "night"] as const).map((t) => (
            <label
              key={t}
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
                checked={newType === t}
                onChange={() => setNewType(t)}
                style={{ accentColor: WARM_GOLD }}
              />
              {t === "morning"
                ? "🌅 Morning"
                : t === "evening"
                  ? "🌇 Evening"
                  : "🌙 Night"}
            </label>
          ))}
        </div>
        <textarea
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Write a new letter…"
          rows={4}
          style={{
            ...inputStyle,
            resize: "vertical" as const,
            marginBottom: "0.5rem",
          }}
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
                {reply.letterType === "morning" ? "Morning" : "Evening"}
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
  const WARM_GOLD = "#D4A853";
  const WARM_TEXT = "#3D2B1F";

  interface InboxMsg {
    id: string;
    from: string;
    to: string;
    text: string;
    timestamp: string;
  }

  interface Conversation {
    username: string;
    lastMsg: string;
    lastTime: string;
    messages: InboxMsg[];
  }

  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [showNewConv, setShowNewConv] = React.useState(false);
  const [newConvUsername, setNewConvUsername] = React.useState("");
  const [lastRefresh, setLastRefresh] = React.useState(new Date());

  const loadConversations = React.useCallback(() => {
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("chinnua_conv_"),
    );
    const convMap: Record<string, InboxMsg[]> = {};
    for (const key of allKeys) {
      try {
        const msgs: InboxMsg[] = JSON.parse(localStorage.getItem(key) || "[]");
        for (const m of msgs) {
          const otherUser = m.from === "CHINNUA_POET" ? m.to : m.from;
          if (otherUser !== "CHINNUA_POET") {
            if (!convMap[otherUser]) convMap[otherUser] = [];
            convMap[otherUser].push(m);
          }
        }
        // Also check key naming pattern
        const keyParts = key.replace("chinnua_conv_", "").split("_");
        for (const part of keyParts) {
          if (part && part !== "CHINNUA" && part !== "POET") {
            if (!convMap[part]) convMap[part] = [];
          }
        }
      } catch {}
    }
    const convList: Conversation[] = Object.entries(convMap).map(
      ([username, msgs]) => {
        const sorted = [...msgs].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        return {
          username,
          lastMsg: sorted[0]?.text?.slice(0, 50) || "(no messages)",
          lastTime: sorted[0]?.timestamp || "",
          messages: sorted,
        };
      },
    );
    convList.sort(
      (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime(),
    );
    setConversations(convList);
    setLastRefresh(new Date());
  }, []);

  React.useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const selectedConv = conversations.find((c) => c.username === selectedUser);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    const msg: InboxMsg = {
      id: `admin_${Date.now()}`,
      from: "CHINNUA_POET",
      to: selectedUser,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    const key = `chinnua_conv_CHINNUA_POET_${selectedUser}`;
    try {
      const existing: InboxMsg[] = JSON.parse(
        localStorage.getItem(key) || "[]",
      );
      existing.push(msg);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      localStorage.setItem(key, JSON.stringify([msg]));
    }
    setNewMessage("");
    loadConversations();
  };

  const startNewConversation = () => {
    if (!newConvUsername.trim()) return;
    const username = newConvUsername.trim();
    setSelectedUser(username);
    setShowNewConv(false);
    setNewConvUsername("");
    // Ensure conversation entry exists
    if (!conversations.find((c) => c.username === username)) {
      setConversations((prev) => [
        { username, lastMsg: "(no messages)", lastTime: "", messages: [] },
        ...prev,
      ]);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: WARM_MOCHA,
            margin: 0,
          }}
        >
          Admin Inbox
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.72rem",
              color: WARM_BROWN,
              fontStyle: "italic",
            }}
          >
            Updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            type="button"
            onClick={loadConversations}
            data-ocid="admin.secondary_button"
            style={{
              padding: "0.3rem 0.75rem",
              background: "rgba(212,168,83,0.1)",
              border: "1px solid rgba(212,168,83,0.3)",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.75rem",
              color: WARM_MOCHA,
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", minHeight: 500 }}>
        {/* Left panel: conversation list */}
        <div
          style={{
            width: "33%",
            minWidth: 160,
            background: WARM_PAPER,
            border: `1px solid ${WARM_BORDER}`,
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
          data-ocid="admin.panel"
        >
          <div
            style={{
              padding: "0.75rem",
              borderBottom: `1px solid ${WARM_BORDER}`,
            }}
          >
            <button
              type="button"
              onClick={() => setShowNewConv(!showNewConv)}
              data-ocid="admin.primary_button"
              style={{
                width: "100%",
                padding: "0.4rem 0.75rem",
                background: "rgba(212,168,83,0.15)",
                border: "1px solid rgba(212,168,83,0.35)",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "0.8rem",
                color: WARM_MOCHA,
                fontWeight: 600,
              }}
            >
              + Message User
            </button>
            {showNewConv && (
              <div
                style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem" }}
              >
                <input
                  value={newConvUsername}
                  onChange={(e) => setNewConvUsername(e.target.value)}
                  placeholder="Username…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") startNewConversation();
                  }}
                  data-ocid="admin.input"
                  style={{
                    flex: 1,
                    padding: "0.35rem 0.5rem",
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 6,
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.78rem",
                    color: WARM_TEXT,
                    background: "white",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={startNewConversation}
                  data-ocid="admin.confirm_button"
                  style={{
                    padding: "0.35rem 0.6rem",
                    background: WARM_GOLD,
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    color: "#3D2B1F",
                    fontWeight: 600,
                  }}
                >
                  Go
                </button>
              </div>
            )}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversations.length === 0 ? (
              <p
                data-ocid="admin.empty_state"
                style={{
                  padding: "1.5rem",
                  textAlign: "center",
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.8rem",
                  color: WARM_BROWN,
                }}
              >
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.username}
                  type="button"
                  onClick={() => setSelectedUser(conv.username)}
                  data-ocid="admin.row"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background:
                      selectedUser === conv.username
                        ? "rgba(212,168,83,0.12)"
                        : "transparent",
                    borderLeft:
                      selectedUser === conv.username
                        ? `3px solid ${WARM_GOLD}`
                        : "3px solid transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: `1px solid ${WARM_BORDER}`,
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 700,
                      color: WARM_MOCHA,
                      fontSize: "0.85rem",
                    }}
                  >
                    @{conv.username}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.72rem",
                      color: WARM_BROWN,
                      marginTop: "0.15rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conv.lastMsg}
                  </div>
                  {conv.lastTime && (
                    <div
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontSize: "0.65rem",
                        color: "rgba(61,43,31,0.4)",
                        marginTop: "0.1rem",
                      }}
                    >
                      {new Date(conv.lastTime).toLocaleDateString()}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right panel: conversation thread */}
        <div
          style={{
            flex: 1,
            background: WARM_PAPER,
            border: `1px solid ${WARM_BORDER}`,
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          data-ocid="admin.panel"
        >
          {selectedUser ? (
            <>
              {/* Thread header */}
              <div
                style={{
                  padding: "0.75rem 1.25rem",
                  borderBottom: `1px solid ${WARM_BORDER}`,
                  background: "rgba(212,168,83,0.06)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    color: WARM_MOCHA,
                    fontSize: "0.95rem",
                  }}
                >
                  Conversation with @{selectedUser}
                </span>
              </div>

              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {!selectedConv || selectedConv.messages.length === 0 ? (
                  <p
                    data-ocid="admin.empty_state"
                    style={{
                      textAlign: "center",
                      fontFamily: "'Lora', Georgia, serif",
                      fontStyle: "italic",
                      color: WARM_BROWN,
                      fontSize: "0.85rem",
                      marginTop: "2rem",
                    }}
                  >
                    No messages yet. Send the first message below.
                  </p>
                ) : (
                  [...(selectedConv?.messages || [])].reverse().map((m, i) => {
                    const isAdmin = m.from === "CHINNUA_POET";
                    return (
                      <div
                        key={m.id || i}
                        data-ocid={`admin.item.${i + 1}`}
                        style={{
                          display: "flex",
                          justifyContent: isAdmin ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            background: isAdmin
                              ? "rgba(212,168,83,0.2)"
                              : "rgba(255,248,238,0.9)",
                            border: `1px solid ${isAdmin ? "rgba(212,168,83,0.4)" : WARM_BORDER}`,
                            borderRadius: isAdmin
                              ? "12px 12px 2px 12px"
                              : "12px 12px 12px 2px",
                            padding: "0.6rem 0.9rem",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              fontSize: "0.85rem",
                              color: WARM_TEXT,
                              margin: 0,
                              lineHeight: 1.5,
                            }}
                          >
                            {m.text}
                          </p>
                          <p
                            style={{
                              fontFamily: "'Lora', Georgia, serif",
                              fontSize: "0.65rem",
                              color: "rgba(61,43,31,0.4)",
                              margin: "0.25rem 0 0",
                              textAlign: isAdmin ? "right" : "left",
                            }}
                          >
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Compose area */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderTop: `1px solid ${WARM_BORDER}`,
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a message…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  data-ocid="admin.input"
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.75rem",
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 8,
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.85rem",
                    color: WARM_TEXT,
                    background: "white",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  data-ocid="admin.primary_button"
                  style={{
                    padding: "0.5rem 1rem",
                    background: WARM_GOLD,
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.85rem",
                    color: "#3D2B1F",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    color: WARM_BROWN,
                    fontSize: "1rem",
                  }}
                >
                  Select a conversation
                </p>
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.8rem",
                    color: "rgba(61,43,31,0.4)",
                  }}
                >
                  or start a new one with "+ Message User"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminInfoTab() {
  const WARM_MOCHA = "#5C3D2E";
  const WARM_BROWN = "#8B6F47";
  const WARM_PAPER = "#F5ECD7";
  const WARM_BORDER = "rgba(139,111,71,0.25)";
  const WARM_GOLD = "#D4A853";
  const WARM_TEXT = "#3D2B1F";

  interface AdminProfile {
    username: string;
    displayName: string;
    email: string;
    bio: string;
    profilePhoto: string;
    websiteUrl: string;
    memberSince: string;
  }

  const DEFAULT_PROFILE: AdminProfile = {
    username: "CHINNUA_POET",
    displayName: "CHINNUA_POET",
    email: "anoldpoet07@gmail.com",
    bio: "The poet behind CHINNUA_POET",
    profilePhoto: "",
    websiteUrl: window.location.origin,
    memberSince: "2025",
  };

  const [profile, setProfile] = React.useState<AdminProfile>(() => {
    try {
      const stored = localStorage.getItem("chinnua_admin_profile");
      if (stored) return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [savedOk, setSavedOk] = React.useState(false);

  const currentPassword =
    localStorage.getItem("chinnua_admin_password") || "chinnua2025";

  const handleSave = () => {
    localStorage.setItem("chinnua_admin_profile", JSON.stringify(profile));
    if (newPassword.trim()) {
      localStorage.setItem("chinnua_admin_password", newPassword.trim());
      setNewPassword("");
    }
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.55rem 0.85rem",
    border: `1px solid ${WARM_BORDER}`,
    borderRadius: 8,
    fontFamily: "'Libre Baskerville', Georgia, serif",
    fontSize: "0.85rem",
    color: WARM_TEXT,
    background: "rgba(255,248,238,0.9)",
    outline: "none",
    boxSizing: "border-box",
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: "1rem",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "0.78rem",
    color: WARM_MOCHA,
    fontWeight: 700,
    marginBottom: "0.35rem",
    letterSpacing: "0.04em",
  };

  return (
    <div>
      <h3
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: WARM_MOCHA,
          marginBottom: "0.35rem",
          fontSize: "1.2rem",
        }}
      >
        Admin Profile
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
        Your admin account information. Changes are saved locally.
      </p>

      <div
        style={{
          background: WARM_PAPER,
          border: `1px solid ${WARM_BORDER}`,
          borderRadius: 14,
          padding: "1.5rem",
          maxWidth: 560,
        }}
      >
        {/* Read-only info row */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "1.5rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(212,168,83,0.15)",
              border: `2px solid ${WARM_GOLD}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="Admin"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem",
                  color: WARM_GOLD,
                }}
              >
                ✒
              </span>
            )}
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: WARM_MOCHA,
                margin: "0 0 0.2rem",
              }}
            >
              {profile.displayName}
            </p>
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "0.8rem",
                color: WARM_BROWN,
                margin: "0 0 0.15rem",
              }}
            >
              @{profile.username}
            </p>
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "0.75rem",
                color: "rgba(61,43,31,0.5)",
                margin: 0,
              }}
            >
              Member since {profile.memberSince}
            </p>
          </div>
        </div>

        {/* Editable fields */}
        <div style={fieldStyle}>
          <label htmlFor="admin-username" style={labelStyle}>
            Admin Username
          </label>
          <input
            id="admin-username"
            value={profile.username}
            onChange={(e) =>
              setProfile((p) => ({ ...p, username: e.target.value }))
            }
            style={inputStyle}
            data-ocid="admin.input"
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="admin-display-name" style={labelStyle}>
            Display Name
          </label>
          <input
            id="admin-display-name"
            value={profile.displayName}
            onChange={(e) =>
              setProfile((p) => ({ ...p, displayName: e.target.value }))
            }
            style={inputStyle}
            data-ocid="admin.input"
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="admin-email" style={labelStyle}>
            Admin Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile((p) => ({ ...p, email: e.target.value }))
            }
            style={inputStyle}
            data-ocid="admin.input"
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="admin-bio" style={labelStyle}>
            Bio
          </label>
          <textarea
            id="admin-bio"
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            data-ocid="admin.textarea"
          />
        </div>

        {/* Read-only fields */}
        <div
          style={{
            ...fieldStyle,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label htmlFor="admin-website-url" style={labelStyle}>
              Website URL (read-only)
            </label>
            <input
              id="admin-website-url"
              value={profile.websiteUrl}
              readOnly
              style={{ ...inputStyle, opacity: 0.6, cursor: "default" }}
            />
          </div>
          <div>
            <label htmlFor="admin-member-since" style={labelStyle}>
              Member Since (read-only)
            </label>
            <input
              id="admin-member-since"
              value={profile.memberSince}
              readOnly
              style={{ ...inputStyle, opacity: 0.6, cursor: "default" }}
            />
          </div>
        </div>

        {/* Profile photo path */}
        <div style={fieldStyle}>
          <label htmlFor="admin-photo" style={labelStyle}>
            Profile Photo URL (read-only)
          </label>
          <input
            id="admin-photo"
            value={profile.profilePhoto || "(none)"}
            readOnly
            style={{ ...inputStyle, opacity: 0.6, cursor: "default" }}
          />
        </div>

        {/* Password section */}
        <div
          style={{
            background: "rgba(212,168,83,0.06)",
            border: "1px solid rgba(212,168,83,0.2)",
            borderRadius: 10,
            padding: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <label htmlFor="admin-pw-display" style={labelStyle}>
            Admin Password
          </label>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <input
              id="admin-pw-display"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              readOnly
              style={{
                ...inputStyle,
                opacity: 0.7,
                cursor: "default",
                flex: 1,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              style={{
                padding: "0.4rem 0.7rem",
                background: "rgba(139,111,71,0.1)",
                border: `1px solid ${WARM_BORDER}`,
                borderRadius: 6,
                cursor: "pointer",
                color: WARM_BROWN,
                fontSize: "0.78rem",
                fontFamily: "'Lora', Georgia, serif",
                flexShrink: 0,
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type="password"
            placeholder="New password (leave blank to keep current)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            data-ocid="admin.input"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          data-ocid="admin.save_button"
          style={{
            padding: "0.6rem 1.75rem",
            background: savedOk
              ? "rgba(74,222,128,0.15)"
              : "rgba(212,168,83,0.85)",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.88rem",
            color: "#3D2B1F",
            fontWeight: 700,
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(212,168,83,0.2)",
          }}
        >
          {savedOk ? "Saved!" : "Save Profile"}
        </button>
      </div>

      {/* Stats section */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "0.75rem",
          maxWidth: 560,
        }}
      >
        {[
          { label: "Platform", value: "CHINNUA_POET" },
          { label: "Contact", value: "anoldpoet07@gmail.com" },
          { label: "YouTube", value: "ChinnuaPoetofficial" },
          { label: "X / Twitter", value: "@CHINNUA_POET" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: WARM_PAPER,
              border: `1px solid ${WARM_BORDER}`,
              borderRadius: 10,
              padding: "0.8rem 1rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.7rem",
                color: WARM_BROWN,
                margin: "0 0 0.2rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.82rem",
                color: WARM_MOCHA,
                margin: 0,
                fontWeight: 600,
                wordBreak: "break-all",
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({
  users,
  onDeleteUser,
}: { users: UserEntry[]; onDeleteUser: (username: string) => void }) {
  const WARM_MOCHA = "#5C3D2E";
  const WARM_BROWN = "#8B6F47";
  const _WARM_PAPER = "#F5ECD7";
  const WARM_BORDER = "rgba(139,111,71,0.25)";
  const WARM_TEXT = "#3D2B1F";
  const _WARM_GOLD = "#D4A853";

  const [search, setSearch] = React.useState("");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.name || u.displayName || "").toLowerCase().includes(q)
    );
  });

  const formatDate = (val?: string) => {
    if (!val) return "—";
    try {
      return new Date(val).toLocaleDateString();
    } catch {
      return val;
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            color: WARM_BROWN,
            fontSize: "0.82rem",
            margin: 0,
          }}
        >
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
        <input
          type="search"
          placeholder="Search by username or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="admin.search_input"
          style={{
            padding: "0.4rem 0.75rem",
            border: `1px solid ${WARM_BORDER}`,
            borderRadius: 8,
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.82rem",
            color: WARM_TEXT,
            background: "white",
            outline: "none",
            minWidth: 220,
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div
          data-ocid="admin.empty_state"
          style={{
            textAlign: "center",
            padding: "2rem",
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            color: WARM_BROWN,
          }}
        >
          No users found
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'Libre Baskerville', Georgia, serif",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(212,168,83,0.08)",
                  borderBottom: `2px solid ${WARM_BORDER}`,
                }}
              >
                {[
                  "Username",
                  "Name",
                  "Email",
                  "Phone",
                  "Joined",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "0.6rem 0.9rem",
                      textAlign: "left",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "0.78rem",
                      color: WARM_MOCHA,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr
                  key={user.username}
                  data-ocid={`admin.item.${i + 1}`}
                  style={{
                    borderBottom: `1px solid ${WARM_BORDER}`,
                    background:
                      i % 2 === 0 ? "transparent" : "rgba(212,168,83,0.04)",
                  }}
                >
                  <td style={{ padding: "0.6rem 0.9rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: WARM_MOCHA,
                          fontSize: "0.88rem",
                        }}
                      >
                        @{user.username}
                      </span>
                      {user.isBot && (
                        <span
                          style={{
                            background: "rgba(212,168,83,0.15)",
                            border: "1px solid rgba(212,168,83,0.4)",
                            borderRadius: 10,
                            padding: "0.1rem 0.4rem",
                            fontSize: "0.62rem",
                            color: "#5C3D2E",
                            fontFamily: "'Lora', serif",
                            whiteSpace: "nowrap",
                          }}
                        >
                          🤖 Bot
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "0.6rem 0.9rem",
                      fontSize: "0.82rem",
                      color: WARM_TEXT,
                    }}
                  >
                    {user.name || user.displayName || "—"}
                  </td>
                  <td
                    style={{
                      padding: "0.6rem 0.9rem",
                      fontSize: "0.82rem",
                      color: WARM_TEXT,
                    }}
                  >
                    {user.email || "—"}
                  </td>
                  <td
                    style={{
                      padding: "0.6rem 0.9rem",
                      fontSize: "0.82rem",
                      color: WARM_TEXT,
                    }}
                  >
                    {user.phone || "—"}
                  </td>
                  <td
                    style={{
                      padding: "0.6rem 0.9rem",
                      fontSize: "0.78rem",
                      color: WARM_BROWN,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(user.createdAt || user.joinedAt)}
                  </td>
                  <td style={{ padding: "0.6rem 0.9rem" }}>
                    <button
                      type="button"
                      onClick={() => onDeleteUser(user.username)}
                      data-ocid="admin.delete_button"
                      style={{
                        padding: "0.25rem 0.65rem",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.75rem",
                        color: "rgba(239,68,68,0.85)",
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const [poetsNote, setPoetsNote] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState<string>(
    () => localStorage.getItem("chinnua_about_photo") || "",
  );
  const [aboutToggles, setAboutToggles] = React.useState<
    { id: string; title: string; content: string }[]
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("chinnua_about_toggles") || "[]");
    } catch {
      return [];
    }
  });
  const [newToggleTitle, setNewToggleTitle] = React.useState("");
  const [newToggleContent, setNewToggleContent] = React.useState("");
  const [editToggleId, setEditToggleId] = React.useState<string | null>(null);
  const [editToggleTitle, setEditToggleTitle] = React.useState("");
  const [editToggleContent, setEditToggleContent] = React.useState("");

  React.useEffect(() => {
    try {
      const about = JSON.parse(
        localStorage.getItem("chinnua_about_content") || "{}",
      );
      setBio(about.bio || "");
      setStory(about.story || "");
      setPoetsNote(localStorage.getItem("chinnua_poets_note") || "");
    } catch {}
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
      localStorage.setItem("chinnua_about_photo", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const saveToggles = (toggles: typeof aboutToggles) => {
    localStorage.setItem("chinnua_about_toggles", JSON.stringify(toggles));
    setAboutToggles(toggles);
  };

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
    // Save poets note
    const trimmedNote = poetsNote.trim();
    const prevNote = localStorage.getItem("chinnua_poets_note") || "";
    if (trimmedNote !== prevNote.trim()) {
      localStorage.setItem("chinnua_poets_note", trimmedNote);
      localStorage.setItem(
        "chinnua_poets_note_saved_at",
        Date.now().toString(),
      );
      localStorage.removeItem("chinnua_poets_note_feed_posted");
    }
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

      {/* Profile Photo */}
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
          About Page Profile Photo
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
          Upload a photo to display on the About page.
        </p>
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Preview"
            style={{
              width: 120,
              height: 160,
              objectFit: "cover",
              borderRadius: 8,
              marginBottom: "0.5rem",
              border: `1px solid ${WARM_BORDER}`,
              display: "block",
            }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          data-ocid="admin.upload_button"
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.8rem",
            color: WARM_TEXT,
            display: "block",
          }}
        />
      </div>

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

      {/* Poet's Note */}
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
          Poet's Note
        </div>
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.78rem",
            color: WARM_BROWN,
            marginBottom: "0.5rem",
          }}
        >
          This note appears publicly on the About page. Visible to all visitors.
        </p>
        <textarea
          value={poetsNote}
          onChange={(e) => setPoetsNote(e.target.value)}
          rows={5}
          placeholder="Write a personal note to your readers…"
          data-ocid="admin.textarea"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: `1px solid ${WARM_BORDER}`,
            borderRadius: 8,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.85rem",
            color: WARM_TEXT,
            background: WARM_PAPER,
            resize: "vertical",
            outline: "none",
          }}
        />
      </div>

      {/* Toggle Management Section */}
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
            marginBottom: "0.75rem",
            fontSize: "0.88rem",
          }}
        >
          About Page Toggles
        </p>
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.78rem",
            color: WARM_BROWN,
            marginBottom: "1rem",
          }}
        >
          Add collapsible sections (toggles) to the About page that visitors can
          expand.
        </p>

        {/* Existing toggles */}
        {aboutToggles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {aboutToggles.map((toggle) => (
              <div
                key={toggle.id}
                style={{
                  background: "rgba(245,236,215,0.4)",
                  border: "1px solid rgba(139,111,71,0.2)",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                }}
              >
                {editToggleId === toggle.id ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="text"
                      value={editToggleTitle}
                      onChange={(e) => setEditToggleTitle(e.target.value)}
                      placeholder="Toggle title…"
                      data-ocid="admin.input"
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(139,111,71,0.3)",
                        borderRadius: 6,
                        padding: "0.4rem 0.6rem",
                        fontSize: "0.82rem",
                        color: WARM_TEXT,
                        fontFamily: "'Lora', Georgia, serif",
                        outline: "none",
                        boxSizing: "border-box" as const,
                      }}
                    />
                    <textarea
                      value={editToggleContent}
                      onChange={(e) => setEditToggleContent(e.target.value)}
                      rows={4}
                      placeholder="Toggle content…"
                      data-ocid="admin.textarea"
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(139,111,71,0.3)",
                        borderRadius: 6,
                        padding: "0.4rem 0.6rem",
                        fontSize: "0.82rem",
                        color: WARM_TEXT,
                        fontFamily: "'Lora', Georgia, serif",
                        fontStyle: "italic",
                        outline: "none",
                        resize: "vertical",
                        boxSizing: "border-box" as const,
                      }}
                    />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        data-ocid="admin.save_button"
                        onClick={() => {
                          if (!editToggleTitle.trim()) return;
                          const updated = aboutToggles.map((t) =>
                            t.id === editToggleId
                              ? {
                                  ...t,
                                  title: editToggleTitle.trim(),
                                  content: editToggleContent.trim(),
                                }
                              : t,
                          );
                          saveToggles(updated);
                          setEditToggleId(null);
                        }}
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
                        data-ocid="admin.cancel_button"
                        onClick={() => setEditToggleId(null)}
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
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: WARM_MOCHA,
                          margin: "0 0 0.25rem",
                        }}
                      >
                        {toggle.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontStyle: "italic",
                          fontSize: "0.8rem",
                          color: WARM_BROWN,
                          margin: 0,
                          lineHeight: 1.5,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {toggle.content.length > 100
                          ? `${toggle.content.slice(0, 100)}…`
                          : toggle.content}
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}
                    >
                      <button
                        type="button"
                        data-ocid="admin.edit_button"
                        onClick={() => {
                          setEditToggleId(toggle.id);
                          setEditToggleTitle(toggle.title);
                          setEditToggleContent(toggle.content);
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
                        onClick={() =>
                          saveToggles(
                            aboutToggles.filter((t) => t.id !== toggle.id),
                          )
                        }
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
        )}

        {/* Add new toggle */}
        <div
          style={{
            background: "rgba(245,236,215,0.3)",
            border: "1px solid rgba(139,111,71,0.15)",
            borderRadius: 8,
            padding: "0.75rem 1rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "0.82rem",
              color: WARM_BROWN,
              margin: "0 0 0.5rem",
              fontWeight: 600,
            }}
          >
            Add New Toggle
          </p>
          <input
            type="text"
            value={newToggleTitle}
            onChange={(e) => setNewToggleTitle(e.target.value)}
            placeholder="Toggle title (e.g. My Story, A Letter…)"
            data-ocid="admin.input"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(139,111,71,0.3)",
              borderRadius: 6,
              padding: "0.4rem 0.6rem",
              fontSize: "0.82rem",
              color: WARM_TEXT,
              fontFamily: "'Lora', Georgia, serif",
              outline: "none",
              boxSizing: "border-box" as const,
              marginBottom: "0.5rem",
              display: "block",
            }}
          />
          <textarea
            value={newToggleContent}
            onChange={(e) => setNewToggleContent(e.target.value)}
            rows={4}
            placeholder="Write the content for this toggle…"
            data-ocid="admin.textarea"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(139,111,71,0.3)",
              borderRadius: 6,
              padding: "0.4rem 0.6rem",
              fontSize: "0.82rem",
              color: WARM_TEXT,
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              outline: "none",
              resize: "vertical",
              boxSizing: "border-box" as const,
              marginBottom: "0.5rem",
              display: "block",
            }}
          />
          <button
            type="button"
            data-ocid="admin.primary_button"
            onClick={() => {
              if (!newToggleTitle.trim()) return;
              const newToggle = {
                id: `toggle_${Date.now()}`,
                title: newToggleTitle.trim(),
                content: newToggleContent.trim(),
              };
              saveToggles([...aboutToggles, newToggle]);
              setNewToggleTitle("");
              setNewToggleContent("");
            }}
            style={{
              background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
              border: "none",
              borderRadius: 6,
              padding: "0.4rem 1rem",
              color: "#FFF8EE",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontWeight: 600,
            }}
          >
            Add Toggle
          </button>
        </div>
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

function ensureAdminFollowed() {
  try {
    const users: Array<{ username: string }> = JSON.parse(
      localStorage.getItem("chinnua_users") || "[]",
    );
    for (const user of users) {
      const key = `chinnua_following_${user.username}`;
      const following: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      if (!following.includes("CHINNUA_POET")) {
        following.push("CHINNUA_POET");
        localStorage.setItem(key, JSON.stringify(following));
      }
    }
  } catch {}
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

  // Auto-follow admin when authed
  useEffect(() => {
    if (authed) {
      ensureAdminFollowed();
    }
  }, [authed]);

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
        <Tabs defaultValue="admin-info">
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
              "admin-info",
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

          <TabsContent value="admin-info">
            <AdminInfoTab />
          </TabsContent>

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
            <UsersTab users={users} onDeleteUser={deleteUser} />
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
                              background: `${riskColor.replace("0.85", "0.12")}",
                              border: "1px solid ${riskColor.replace("0.85", "0.3")}`,
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
