import React from "react";

export interface AISettings {
  aiEnabled: boolean;
  aiAutoSuggest: boolean;
  aiWritingSuggestions: boolean;
  aiImageGen: boolean;
  aiAudioGen: boolean;
  aiTranslation: boolean;
  aiMode: "soft" | "philosophical" | "minimal";
  defaultVoice: "male" | "female";
  playbackSpeed: "slow" | "normal" | "expressive";
  writingMode: "default" | "free" | "structured";
  theme: string;
  fontStyle: string;
  textSize: string;
}

export const AI_DEFAULTS: AISettings = {
  aiEnabled: true,
  aiAutoSuggest: false,
  aiWritingSuggestions: true,
  aiImageGen: false,
  aiAudioGen: false,
  aiTranslation: false,
  aiMode: "soft",
  defaultVoice: "female",
  playbackSpeed: "normal",
  writingMode: "default",
  theme: "warm-cream",
  fontStyle: "classic",
  textSize: "medium",
};

export function getAISettings(): AISettings {
  try {
    const s =
      localStorage.getItem("chinnua_user_settings") ||
      localStorage.getItem("chinnua_settings");
    if (s) return { ...AI_DEFAULTS, ...JSON.parse(s) };
  } catch {}
  return AI_DEFAULTS;
}

export function useAISettings(): AISettings {
  const [s, setS] = React.useState<AISettings>(getAISettings);
  React.useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail) setS({ ...AI_DEFAULTS, ...ce.detail });
    };
    window.addEventListener("settingsChanged", handler);
    return () => window.removeEventListener("settingsChanged", handler);
  }, []);
  return s;
}

/** Speak text aloud using Web Speech API based on settings */
export function speakText(text: string, settings: AISettings): void {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate =
    settings.playbackSpeed === "slow"
      ? 0.7
      : settings.playbackSpeed === "expressive"
        ? 1.3
        : 1.0;
  utter.pitch =
    settings.aiMode === "philosophical"
      ? 0.8
      : settings.aiMode === "soft"
        ? 1.1
        : 1.0;
  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find((v) =>
        settings.defaultVoice === "male"
          ? v.name.toLowerCase().includes("male") ||
            v.name.toLowerCase().includes("david") ||
            v.name.toLowerCase().includes("james") ||
            v.name.toLowerCase().includes("alex")
          : v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("karen"),
      );
      if (preferred) utter.voice = preferred;
      window.speechSynthesis.speak(utter);
    } else {
      window.speechSynthesis.onvoiceschanged = () => trySpeak();
    }
  };
  trySpeak();
}

export function stopSpeaking(): void {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/** Generate a canvas-based AI image placeholder */
export function generateAIImage(prompt: string): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve("");
  const lower = prompt.toLowerCase();
  let c1: string;
  let c2: string;
  if (
    lower.includes("sad") ||
    lower.includes("dark") ||
    lower.includes("night")
  ) {
    c1 = "#1a0a2e";
    c2 = "#3d1a4a";
  } else if (
    lower.includes("love") ||
    lower.includes("rose") ||
    lower.includes("heart")
  ) {
    c1 = "#5a1a28";
    c2 = "#c4506a";
  } else if (
    lower.includes("nature") ||
    lower.includes("forest") ||
    lower.includes("green")
  ) {
    c1 = "#0a2a1a";
    c2 = "#1a5a3a";
  } else {
    c1 = "#2b1a0a";
    c2 = "#5c3d2e";
  }
  const grad = ctx.createLinearGradient(0, 0, 400, 300);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 400, 300);
  // Stars
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 400;
    const y = Math.random() * 300;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(212,168,83,0.75)";
  ctx.font = "italic 15px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const words = prompt.split(" ").slice(0, 8).join(" ");
  ctx.fillText(`\u2728 ${words} \u2728`, 200, 145);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "11px Georgia, serif";
  ctx.fillText("AI Generated Image", 200, 180);
  return Promise.resolve(canvas.toDataURL("image/png"));
}

/** Auto-suggest a poetic next line */
export function suggestNextLine(
  _currentText: string,
  mode: AISettings["aiMode"],
): string {
  const soft = [
    "and the silence held its breath...",
    "like petals falling into forgotten rivers...",
    "where words dissolve into feeling...",
    "in the space between heartbeats...",
    "as the moon remembers what the sun forgets...",
  ];
  const philosophical = [
    "yet the question outlives the answer...",
    "for meaning hides in the margins of certainty...",
    "existence, then, is the unresolved poem...",
    "between knowing and unknowing, we live...",
    "truth wears many faces, all of them partial...",
  ];
  const minimal = [
    "still.",
    "nothing more.",
    "and then\u2014",
    "silence.",
    "enough.",
  ];
  const pool =
    mode === "philosophical"
      ? philosophical
      : mode === "minimal"
        ? minimal
        : soft;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Generate writing suggestions based on current text */
export function getWritingSuggestions(text: string): string[] {
  if (!text.trim())
    return [
      "Begin with a sensory detail \u2014 a smell, a texture, a sound...",
      "What feeling are you trying to capture? Name it first...",
      "Start with a question the poem will try to answer...",
    ];
  return [
    "Consider breaking this line \u2014 where does the breath pause?",
    "Try replacing an adjective with a verb for more movement...",
    "What if you ended here and let the silence complete it?",
    "Read it aloud \u2014 where does your voice naturally slow down?",
  ];
}
