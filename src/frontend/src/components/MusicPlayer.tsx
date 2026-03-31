import { Slider } from "@/components/ui/slider";
import { useCallback, useEffect, useRef, useState } from "react";

interface ScheduledAudio {
  start: () => void;
  stop: () => void;
  setVolume: (vol: number) => void;
}

function createRainNoise(ctx: AudioContext): ScheduledAudio {
  let gainNode: GainNode | null = null;
  let source: AudioBufferSourceNode | null = null;

  return {
    start() {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.5;

      gainNode = ctx.createGain();
      gainNode.gain.value = 0.15;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start();
    },
    stop() {
      if (gainNode) gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      setTimeout(() => {
        try {
          source?.stop();
        } catch {}
      }, 400);
    },
    setVolume(vol: number) {
      if (gainNode)
        gainNode.gain.setTargetAtTime(vol * 0.15, ctx.currentTime, 0.1);
    },
  };
}

function createMidnightDrone(ctx: AudioContext): ScheduledAudio {
  const oscillators: OscillatorNode[] = [];
  let gainNode: GainNode | null = null;

  return {
    start() {
      gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      gainNode.connect(ctx.destination);

      const freqs = [55, 82.5, 110];
      for (let i = 0; i < freqs.length; i++) {
        const freq = freqs[i];
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.05 + i * 0.02;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 2;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.3;
        osc.connect(oscGain);
        if (gainNode) oscGain.connect(gainNode);
        osc.start();
        oscillators.push(osc);
      }

      gainNode.gain.setTargetAtTime(0.12, ctx.currentTime, 1.5);
    },
    stop() {
      if (gainNode) gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      setTimeout(() => {
        for (const o of oscillators) {
          try {
            o.stop();
          } catch {}
        }
      }, 700);
    },
    setVolume(vol: number) {
      if (gainNode)
        gainNode.gain.setTargetAtTime(vol * 0.12, ctx.currentTime, 0.1);
    },
  };
}

function createPianoTones(ctx: AudioContext): ScheduledAudio {
  let gainNode: GainNode | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  // C E G A C G E C arpeggios
  const notes = [261.63, 329.63, 392.0, 440.0, 523.25, 392.0, 329.63, 261.63];
  let noteIndex = 0;

  function playNote(freq: number) {
    if (!gainNode) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

    osc.connect(env);
    env.connect(gainNode);
    osc.start();
    osc.stop(ctx.currentTime + 2.6);
  }

  return {
    start() {
      gainNode = ctx.createGain();
      gainNode.gain.value = 1;
      gainNode.connect(ctx.destination);
      playNote(notes[noteIndex % notes.length]);
      intervalId = setInterval(() => {
        noteIndex++;
        playNote(notes[noteIndex % notes.length]);
      }, 2000);
    },
    stop() {
      if (intervalId) clearInterval(intervalId);
      if (gainNode) gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    },
    setVolume(vol: number) {
      if (gainNode) gainNode.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
    },
  };
}

function createMelancholy(ctx: AudioContext): ScheduledAudio {
  let gainNode: GainNode | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  // A minor descending: A C E G F E D C
  const notes = [440.0, 523.25, 659.25, 783.99, 698.46, 659.25, 587.33, 523.25];
  let idx = 0;

  function playNote(freq: number) {
    if (!gainNode) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 1.005;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.1);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);

    osc.connect(env);
    osc2.connect(env);
    env.connect(gainNode);
    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 3.3);
    osc2.stop(ctx.currentTime + 3.3);
  }

  return {
    start() {
      gainNode = ctx.createGain();
      gainNode.gain.value = 1;
      gainNode.connect(ctx.destination);
      playNote(notes[idx % notes.length]);
      intervalId = setInterval(() => {
        idx++;
        playNote(notes[idx % notes.length]);
      }, 2800);
    },
    stop() {
      if (intervalId) clearInterval(intervalId);
      if (gainNode) gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    },
    setVolume(vol: number) {
      if (gainNode) gainNode.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
    },
  };
}

function createPeaceful(ctx: AudioContext): ScheduledAudio {
  const oscillators: OscillatorNode[] = [];
  let gainNode: GainNode | null = null;

  return {
    start() {
      gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      gainNode.connect(ctx.destination);

      // Gentle binaural-like tones
      const pairs: [number, number][] = [
        [174, 174.5],
        [285, 285.6],
        [396, 396.7],
      ];
      for (const [f1, f2] of pairs) {
        for (const freq of [f1, f2]) {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq;
          const g = ctx.createGain();
          g.gain.value = 0.06;
          osc.connect(g);
          if (gainNode) g.connect(gainNode);
          osc.start();
          oscillators.push(osc);
        }
      }

      gainNode.gain.setTargetAtTime(0.1, ctx.currentTime, 2);
    },
    stop() {
      if (gainNode) gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      setTimeout(() => {
        for (const o of oscillators) {
          try {
            o.stop();
          } catch {}
        }
      }, 700);
    },
    setVolume(vol: number) {
      if (gainNode)
        gainNode.gain.setTargetAtTime(vol * 0.1, ctx.currentTime, 0.1);
    },
  };
}

interface Mood {
  id: string;
  label: string;
  emoji: string;
  description: string;
  generate: (ctx: AudioContext) => ScheduledAudio;
}

const MOODS: Mood[] = [
  {
    id: "rain",
    label: "Rain",
    emoji: "🌧️",
    description: "soft rain ambience",
    generate: createRainNoise,
  },
  {
    id: "midnight",
    label: "Midnight",
    emoji: "🕯️",
    description: "deep, dark ambient",
    generate: createMidnightDrone,
  },
  {
    id: "piano",
    label: "Piano",
    emoji: "🎹",
    description: "soft solo piano",
    generate: createPianoTones,
  },
  {
    id: "melancholy",
    label: "Melancholy",
    emoji: "🌙",
    description: "slow, emotional",
    generate: createMelancholy,
  },
  {
    id: "peaceful",
    label: "Peaceful",
    emoji: "🌿",
    description: "gentle, calm",
    generate: createPeaceful,
  },
];

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activeMood, setActiveMood] = useState<string>("piano");
  const [volume, setVolume] = useState(0.6);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<ScheduledAudio | null>(null);

  const stopCurrent = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.stop();
      currentAudioRef.current = null;
    }
  }, []);

  const startMood = useCallback(
    (moodId: string, vol: number) => {
      stopCurrent();
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const mood = MOODS.find((m) => m.id === moodId);
      if (!mood) return;
      const audio = mood.generate(ctx);
      audio.start();
      audio.setVolume(vol);
      currentAudioRef.current = audio;
    },
    [stopCurrent],
  );

  const handlePlayPause = useCallback(() => {
    if (playing) {
      stopCurrent();
      setPlaying(false);
    } else {
      startMood(activeMood, volume);
      setPlaying(true);
    }
  }, [playing, activeMood, volume, startMood, stopCurrent]);

  const handleMoodSelect = useCallback(
    (moodId: string) => {
      setActiveMood(moodId);
      if (playing) {
        startMood(moodId, volume);
      }
    },
    [playing, volume, startMood],
  );

  const handleVolumeChange = useCallback((vals: number[]) => {
    const vol = vals[0];
    setVolume(vol);
    if (currentAudioRef.current) {
      currentAudioRef.current.setVolume(vol);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrent();
      audioCtxRef.current?.close();
    };
  }, [stopCurrent]);

  const currentMood = MOODS.find((m) => m.id === activeMood);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      data-ocid="music_player.panel"
    >
      {open && (
        <div
          ref={panelRef}
          className="w-64 rounded-xl border shadow-2xl overflow-hidden"
          style={{
            background: "#111009",
            borderColor: "#C8A96A55",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px #C8A96A22",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "#C8A96A33" }}
          >
            <p
              className="text-xs uppercase tracking-widest"
              style={{
                color: "#D4A853",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              ♪ Ambient Mood
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#F5E6D355" }}>
              {playing ? `Playing — ${currentMood?.label}` : "Choose your mood"}
            </p>
          </div>

          {/* Mood buttons */}
          <div className="p-3 flex flex-col gap-1.5">
            {MOODS.map((mood) => (
              <button
                type="button"
                key={mood.id}
                data-ocid="music_player.tab"
                onClick={() => handleMoodSelect(mood.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200"
                style={{
                  background:
                    activeMood === mood.id ? "#C8A96A18" : "transparent",
                  border:
                    activeMood === mood.id
                      ? "1px solid #C8A96A66"
                      : "1px solid transparent",
                  color: activeMood === mood.id ? "#C8A96A" : "#F5E6D399",
                }}
              >
                <span className="text-base">{mood.emoji}</span>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontSize: "0.8rem",
                    }}
                  >
                    {mood.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "#F5E6D344", fontSize: "0.65rem" }}
                  >
                    {mood.description}
                  </p>
                </div>
                {activeMood === mood.id && playing && (
                  <span
                    className="ml-auto text-xs"
                    style={{ color: "#D4A853" }}
                  >
                    ▶
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div
            className="px-4 pb-4 pt-2 border-t flex flex-col gap-3"
            style={{ borderColor: "#C8A96A22" }}
          >
            <button
              type="button"
              data-ocid="music_player.toggle"
              onClick={handlePlayPause}
              className="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: playing ? "#C8A96A" : "transparent",
                border: playing ? "1px solid #C8A96A" : "1px solid #C8A96A66",
                color: playing ? "#0D0D0D" : "#C8A96A",
                fontFamily: "'Libre Baskerville', serif",
              }}
            >
              {playing ? (
                <>
                  <span style={{ fontSize: "0.85rem" }}>⏸</span> Pause
                </>
              ) : (
                <>
                  <span style={{ fontSize: "0.85rem" }}>▶</span> Play
                </>
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#F5E6D355" }}>
                🔈
              </span>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.01}
                className="flex-1"
                data-ocid="music_player.input"
              />
              <span className="text-xs" style={{ color: "#F5E6D355" }}>
                🔊
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        ref={btnRef}
        data-ocid="music_player.open_modal_button"
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: playing ? "#C8A96A" : "#111009",
          border: `2px solid ${playing ? "#C8A96A" : "#C8A96A88"}`,
          boxShadow: playing
            ? "0 0 20px #C8A96A55, 0 4px 16px rgba(0,0,0,0.6)"
            : "0 4px 16px rgba(0,0,0,0.6)",
          color: playing ? "#0D0D0D" : "#C8A96A",
        }}
        title="Background Music"
      >
        <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>
          {playing ? "♫" : "♪"}
        </span>
      </button>
    </div>
  );
}
