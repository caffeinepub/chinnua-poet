import { Feather, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface Message {
  id: number;
  role: "assistant" | "user";
  text: string;
  showChips?: boolean;
}

const SUGGESTION_CHIPS = [
  "Help me write a poem",
  "Suggest a theme for me",
  "How do I submit my poem?",
  "Who is Chinnua?",
];

function getAIResponse(message: string): string {
  const m = message.toLowerCase().trim();

  if (/^(hello|hi|hey|greetings|namaste)/.test(m) || m === "") {
    return "Welcome, dear soul. I am here to help you navigate this space of words \u2014 or to help you find your own. You can ask me how to use this site, or let me guide your pen toward poetry. What stirs in you today?";
  }

  if (/how to read|full poem|login|sign in|locked/.test(m)) {
    return "To read full poems, you need to sign in with Internet Identity \u2014 it's completely free and takes less than a minute. Look for the 'Sign In' button in the navigation bar. Once signed in, every poem on this site opens for you.";
  }
  if (
    /submit|community|post poem|share.*poem|my poem/.test(m) &&
    !/help me write|write a poem/.test(m)
  ) {
    return "Visit the Community section from the navigation. There you can:\n\n\u2022 Create a pen name (your poetic identity)\n\u2022 Write and submit your own poetry\n\u2022 Get a personalized theme suggestion for your style\n\u2022 See your poem displayed in the Community Gallery\n\nYour words deserve to be seen too.";
  }
  if (/account|sign up|register|how to join/.test(m)) {
    return "This site uses Internet Identity \u2014 a secure, privacy-first login system. No email or password needed. Just click 'Sign In', create your Internet Identity (takes ~30 seconds), and you're in. It's free, safe, and anonymous.";
  }
  if (/contact|email|reach|message chinnua/.test(m)) {
    return "You can reach Chinnua directly at:\n\nanoldpoet07@gmail.com\n\nOr use the 'Contact Me' form on the website to send a message directly. Every message is read personally.";
  }
  if (/instagram|social media|social/.test(m)) {
    return "Chinnua is on Instagram as @chinnua_07_\n\nhttps://www.instagram.com/chinnua_07_/\n\nFollow for poetry fragments, mood posts, and glimpses of the poet's inner world.";
  }
  if (/youtube|video|channel/.test(m)) {
    return "Chinnua's YouTube channel is live at:\n\n@ChinnuaPoetofficial\n\nhttps://www.youtube.com/@ChinnuaPoetofficial\n\nPoetry read aloud \u2014 words in motion.";
  }
  if (/admin|add poem|chinnua add|post new/.test(m)) {
    return "Only Chinnua can add poems to the main collection \u2014 via a secret admin panel. This keeps the collection curated and personal. However, you can share your own poetry in the Community section!";
  }
  if (/about|who is chinnua|poet behind|story/.test(m)) {
    return "Chinnua is an 18-year-old poet and storyteller from India, active since 2025. Words became a refuge \u2014 a way to hold pain, longing, and quiet beauty that conversation couldn't carry. Chinnua's work speaks to anyone who has loved, lost, waited, or wondered. The face is hidden; the words are everything.";
  }

  if (
    /sad poem|poem about (sadness|grief|loss|pain|loneliness|sorrow)/.test(m)
  ) {
    return "Here's a starter for a sad poem \u2014 fill in the blanks with your own feeling:\n\n---\nThe day you left, even _______ forgot how to _______.\nI kept your _______ on the shelf \u2014\nproof that something real\ncan disappear without a sound.\n\nI still _______ at _______ o'clock,\nwaiting for a door that never opens.\n---\n\nReplace the blanks with your specific memories. Specificity makes sadness universal.";
  }
  if (/love poem|romantic poem|poem about love|romance/.test(m)) {
    return "Here's a starter for a romantic poem:\n\n---\nYou arrived like _______ \u2014\nunexpected, and suddenly necessary.\n\nI had learned to live without warmth\nuntil you stood beside me like _______,\nand I forgot what cold felt like.\n\nKeep your name here: _______.\nI'll write it in every poem,\neven the ones that don't mention you.\n---\n\nLet the poem feel like a secret being confessed.";
  }
  if (/nature poem|poem about nature|sky|rain|ocean|forest|stars/.test(m)) {
    return "Here's a starter for a nature poem:\n\n---\nThe _______ never asks permission\nto be beautiful.\n\nI watched the _______ this morning \u2014\nit didn't know I was watching,\nand perhaps that is why\nit was so honest.\n\nThere is a language in _______\nthat I am still learning.\n---\n\nNature poems work best when they secretly speak about the human heart.";
  }
  if (
    /write a poem|help me write|poem about|create a poem|make a poem/.test(m)
  ) {
    const topic = m
      .replace(
        /write a poem|help me write|poem about|create a poem|make a poem|about|a|the/g,
        "",
      )
      .trim();
    const topicDisplay =
      topic.length > 2 ? `about "${topic}"` : "on your chosen theme";
    return `Here is a poem template ${topicDisplay}:\n\n---\nBegin with a single image: what do you see, hear, or feel?\n\nLine 1: Describe the moment \u2014 no explanation, just sensation.\nLine 2: What does it remind you of?\nLine 3: What does it make you feel, without naming the feeling?\nLine 4: A question you'll never ask aloud.\nLine 5: The one thing you wish were different.\n\n---\n\nWrite the first line right now \u2014 don't think, just write. The poem will follow.`;
  }
  if (/theme|suggest theme|what should i write|theme idea/.test(m)) {
    return "Here are 5 poetic themes to inspire you:\n\n\u{1F319} Moonlit Grief \u2014 The quiet ache of losing something you never fully had\n\n\u{1F339} Burning Rose \u2014 Love that is beautiful and painful in equal measure\n\n\u26A1 Silent Thunder \u2014 Rage held inward, felt but never spoken\n\n\u{1F342} Wandering Soul \u2014 The feeling of not belonging anywhere, and finding peace in motion\n\n\u{1F305} Golden Dusk \u2014 Gratitude mixed with melancholy, the beauty of endings\n\nWhich one calls to you? I can help you start writing in that theme.";
  }
  if (/rhyme|rhyming word|find a rhyme/.test(m)) {
    return "Here are rhyming word pairs for emotional poetry:\n\n\u2022 ache / wake / break / take / forsake\n\u2022 night / light / fight / sight / quiet\n\u2022 rain / pain / again / remain / explain\n\u2022 heart / start / apart / art / dark\n\u2022 soul / whole / toll / control / console\n\nTip: Let rhyme happen naturally \u2014 don't force it. A near-rhyme (slant rhyme) often feels more honest than a perfect one.";
  }
  if (
    /structure|how to write poetry|format|haiku|sonnet|free verse|form/.test(m)
  ) {
    return "Three Common Poetry Forms:\n\nHaiku (Japanese form)\n3 lines: 5 syllables / 7 syllables / 5 syllables\nBest for: nature, a single moment, zen stillness\n\nFree Verse\nNo fixed structure \u2014 rhythm and line breaks are your tools\nBest for: emotion, storytelling, personal expression\n\nSonnet (14 lines)\nTypically ABAB CDCD EFEF GG rhyme scheme\nBest for: love, longing, philosophical reflection\n\nFor your first poems, free verse is the most forgiving and expressive form.";
  }
  if (
    /stuck|no ideas|inspiration|can't write|don't know what to write|blank/.test(
      m,
    )
  ) {
    return "Here are 3 writing prompts to unstick you:\n\n\u2726 Write about the last time you felt completely misunderstood. Don't explain it \u2014 just describe the room, the light, the silence.\n\n\u2726 A door in your memory that you've never opened in words. What's behind it?\n\n\u2726 Write a letter to your 10-year-old self \u2014 but only using images, no direct statements.\n\nStart with just one sentence. The poem will grow from there.";
  }
  if (/improve|feedback|make it better|tips|advice|better poem/.test(m)) {
    return "3 Ways to Deepen Your Poetry:\n\n\u2726 Show, don't tell \u2014 Instead of 'I was sad,' write 'I sat at the edge of the bed and couldn't move.' Emotions live in images, not labels.\n\n\u2726 Cut the unnecessary words \u2014 Read your poem aloud. Every word that slows it down without adding feeling? Remove it. Silence is part of the poem.\n\n\u2726 End on a surprise \u2014 The last line should shift something \u2014 the perspective, the emotion, the image. A poem that ends where it began doesn't take the reader anywhere.";
  }

  return "I'm here to help you with:\n\nWriting Poetry \u2014 poem starters, themes, structure, rhymes, inspiration\n\nUsing This Site \u2014 how to read full poems, submit your own, create an account\n\nConnecting with Chinnua \u2014 contact info, Instagram, YouTube\n\nTry asking: 'Help me write a sad poem', 'Suggest a theme', 'How do I submit my poem?', or 'Who is Chinnua?'";
}

function FormatText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static formatted lines
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function PoetryAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chipsUsed, setChipsUsed] = useState(false);
  const [msgCounter, setMsgCounter] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: open is the only trigger needed
  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true;
      const welcome = getAIResponse("hello");
      setMessages([
        { id: 1, role: "assistant", text: welcome, showChips: true },
      ]);
      setMsgCounter(2);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = {
      id: msgCounter,
      role: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setMsgCounter((c) => c + 1);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: msgCounter + 1, role: "assistant", text: response },
      ]);
      setMsgCounter((c) => c + 1);
      setIsTyping(false);
    }, 800);
  };

  const handleChip = (chip: string) => {
    setChipsUsed(true);
    sendMessage(chip);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-24 left-5 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      >
        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          data-ocid="poetry_assistant.open_modal_button"
          className="relative flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #1A1410 0%, #0D0D0D 100%)",
            border: "1px solid #C8A96A",
            color: "#C8A96A",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Feather size={18} />
          </motion.div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
            Ask AI
          </span>
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 0px #C8A96A40",
                "0 0 16px #C8A96A60",
                "0 0 0px #C8A96A40",
              ],
            }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="poetry_assistant.modal"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-44 left-5 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: "min(380px, calc(100vw - 40px))",
              height: "min(500px, calc(100vh - 200px))",
              background: "#0D0D0D",
              border: "1px solid #C8A96A40",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                background: "#1A1410",
                borderBottom: "1px solid #C8A96A40",
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: "#C8A96A" }} />
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#C8A96A",
                    fontSize: "0.85rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  CHINNUA's Poetry Assistant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-ocid="poetry_assistant.close_button"
                className="p-1 rounded-full transition-opacity opacity-60 hover:opacity-100"
                style={{ color: "#F5E6D3" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#C8A96A30 transparent",
              }}
            >
              {messages.map((msg) => (
                <div key={msg.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', 'Cormorant Garamond', serif",
                        fontSize: "0.875rem",
                        lineHeight: "1.6",
                        background:
                          msg.role === "user" ? "#C8A96A20" : "#1A1410",
                        border: `1px solid ${msg.role === "user" ? "#C8A96A50" : "#C8A96A20"}`,
                        color: msg.role === "user" ? "#C8A96A" : "#F5E6D3",
                      }}
                    >
                      <FormatText text={msg.text} />
                    </div>
                  </motion.div>
                  {msg.showChips && !chipsUsed && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex flex-wrap gap-2 mt-2"
                    >
                      {SUGGESTION_CHIPS.map((chip) => (
                        <button
                          type="button"
                          key={chip}
                          onClick={() => handleChip(chip)}
                          data-ocid="poetry_assistant.button"
                          className="px-3 py-1 rounded-full text-xs transition-all cursor-pointer"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "0.75rem",
                            background: "transparent",
                            border: "1px solid #C8A96A60",
                            color: "#C8A96A",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "#C8A96A20";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "transparent";
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="px-4 py-3 rounded-xl"
                    data-ocid="poetry_assistant.loading_state"
                    style={{
                      background: "#1A1410",
                      border: "1px solid #C8A96A20",
                    }}
                  >
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "#C8A96A" }}
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="shrink-0 px-3 py-3 flex gap-2 items-center"
              style={{
                borderTop: "1px solid #C8A96A20",
                background: "#0D0D0D",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder="Ask me anything..."
                data-ocid="poetry_assistant.input"
                className="flex-1 bg-transparent outline-none text-sm px-3 py-2 rounded-lg"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.875rem",
                  color: "#F5E6D3",
                  border: "1px solid #C8A96A30",
                  caretColor: "#C8A96A",
                }}
              />
              <Button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                data-ocid="poetry_assistant.submit_button"
                size="icon"
                className="shrink-0 w-9 h-9"
                style={{
                  background: input.trim() ? "#C8A96A" : "#C8A96A30",
                  border: "none",
                  color: "#0D0D0D",
                  transition: "background 0.2s",
                }}
              >
                <Send size={14} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
