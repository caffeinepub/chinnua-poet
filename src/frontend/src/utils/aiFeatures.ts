// AI Features Utility — uses browser APIs, no external dependencies

/**
 * AI Audio Generation using Web Speech API
 */
export function speakText(
  text: string,
  voice: "male" | "female" = "female",
  speed: "slow" | "normal" | "expressive" = "normal",
) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (voice === "female") {
        const f = voices.find(
          (v) =>
            v.name.toLowerCase().includes("female") ||
            v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Moira") ||
            (v.lang.startsWith("en") &&
              v.name.includes("Google") &&
              !v.name.includes("Male")),
        );
        if (f) utterance.voice = f;
      } else {
        const m = voices.find(
          (v) =>
            v.name.toLowerCase().includes("male") ||
            v.name.includes("Alex") ||
            v.name.includes("Daniel"),
        );
        if (m) utterance.voice = m;
      }
      utterance.rate =
        speed === "slow" ? 0.75 : speed === "expressive" ? 1.25 : 1.0;
      utterance.pitch = speed === "expressive" ? 1.2 : 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  } else {
    loadVoices();
  }
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/**
 * Writing Suggestions — rule-based poetic next lines
 */
const POETIC_STARTERS = [
  "And in the silence,",
  "Like shadows at dusk,",
  "When words escape me,",
  "Between each breath,",
  "In the space between stars,",
  "The night remembers",
  "I carry the weight of",
  "Beneath these words,",
  "Even the wind knows",
  "What the heart cannot say,",
  "In rivers of thought,",
  "Where the light fades softly,",
];

const EMOTION_SUGGESTIONS: Record<string, string[]> = {
  sad: [
    "Let the rain speak what I cannot",
    "Some griefs are older than the moon",
    "I hold the absence like a stone",
  ],
  love: [
    "You are the poem I never finished",
    "In every quiet moment, your name",
    "Love is the wound that heals you",
  ],
  dark: [
    "The shadows know my truest self",
    "Some nights have no dawn",
    "I wrote your name in disappearing ink",
  ],
  hope: [
    "But morning still comes for the broken",
    "Even seeds remember the sun",
    "There is always one candle left",
  ],
  nature: [
    "The trees remember everything",
    "Even rivers carry old wounds",
    "In the language of leaves,",
  ],
};

export function getWritingSuggestions(text: string): string[] {
  const lower = text.toLowerCase();
  let suggestions: string[] = [];

  if (
    lower.includes("sad") ||
    lower.includes("grief") ||
    lower.includes("cry") ||
    lower.includes("lost")
  ) {
    suggestions = EMOTION_SUGGESTIONS.sad;
  } else if (
    lower.includes("love") ||
    lower.includes("heart") ||
    lower.includes("you")
  ) {
    suggestions = EMOTION_SUGGESTIONS.love;
  } else if (
    lower.includes("dark") ||
    lower.includes("night") ||
    lower.includes("shadow")
  ) {
    suggestions = EMOTION_SUGGESTIONS.dark;
  } else if (
    lower.includes("hope") ||
    lower.includes("light") ||
    lower.includes("morning")
  ) {
    suggestions = EMOTION_SUGGESTIONS.hope;
  } else if (
    lower.includes("tree") ||
    lower.includes("rain") ||
    lower.includes("wind") ||
    lower.includes("sea")
  ) {
    suggestions = EMOTION_SUGGESTIONS.nature;
  } else {
    const idx = Math.floor(Math.random() * (POETIC_STARTERS.length - 2));
    suggestions = POETIC_STARTERS.slice(idx, idx + 3);
  }

  return suggestions.slice(0, 3);
}

export function getAutoSuggestLine(lastLine: string): string {
  const lower = lastLine.toLowerCase().trim();
  if (!lower) return "";

  if (lower.endsWith(",") || lower.endsWith("—")) {
    return "the silence speaks for me";
  }
  if (lower.includes("i") && lower.includes("feel")) {
    return "something I cannot name";
  }
  if (lower.includes("you")) {
    return "exist in every word I leave behind";
  }

  const starters = POETIC_STARTERS;
  return starters[Math.floor(Math.random() * starters.length)];
}

/**
 * AI Image Generation — canvas gradient placeholder
 * Returns a data URL
 */
export function generateImagePlaceholder(prompt: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Detect mood from prompt
  const lower = prompt.toLowerCase();
  let colors: [string, string];
  if (
    lower.includes("sad") ||
    lower.includes("dark") ||
    lower.includes("night")
  ) {
    colors = ["#1a0a2e", "#3d1a4a"];
  } else if (
    lower.includes("love") ||
    lower.includes("rose") ||
    lower.includes("heart")
  ) {
    colors = ["#6b1a2a", "#c4506a"];
  } else if (
    lower.includes("nature") ||
    lower.includes("forest") ||
    lower.includes("green")
  ) {
    colors = ["#0a2a1a", "#1a5a3a"];
  } else if (
    lower.includes("ocean") ||
    lower.includes("sea") ||
    lower.includes("wave")
  ) {
    colors = ["#0a1a3a", "#1a4a7a"];
  } else {
    colors = ["#2b1a0a", "#5c3d2e"];
  }

  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);

  // Add subtle texture dots
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 600;
    const y = Math.random() * 400;
    const r = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Prompt text
  ctx.fillStyle = "rgba(212,168,83,0.7)";
  ctx.font = "italic 18px 'Lora', Georgia, serif";
  ctx.textAlign = "center";
  const words = prompt.split(" ").slice(0, 8).join(" ");
  ctx.fillText(`"${words}"`, 300, 200);

  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "12px 'Lora', Georgia, serif";
  ctx.fillText("AI Generated Image", 300, 230);

  return canvas.toDataURL("image/png");
}

/**
 * Get saved AI settings from localStorage
 */
export function getAiSettings() {
  try {
    const s = localStorage.getItem("chinnua_settings");
    if (s) return JSON.parse(s);
  } catch {}
  return {
    aiEnabled: true,
    aiAutoSuggest: false,
    aiWritingSuggestions: true,
    aiImageGen: false,
    aiAudioGen: false,
    aiTranslation: false,
    aiMode: "soft",
    defaultVoice: "female",
    playbackSpeed: "normal",
  };
}
