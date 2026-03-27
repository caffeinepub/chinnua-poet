import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  Facebook,
  Instagram,
  Mail,
  Menu,
  Search,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { AdminPoem } from "./backend";
import { AdminPanel } from "./components/AdminPanel";
import { CommunitySection } from "./components/CommunitySection";
import { FeedSection } from "./components/FeedSection";
import MusicPlayer from "./components/MusicPlayer";
import PoetryAssistant from "./components/PoetryAssistant";
import { ProfileModal } from "./components/ProfileModal";
import { UserSetupModal } from "./components/UserSetupModal";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { POEMS } from "./poems-data";

const NAV_LINKS = ["Home", "Feed", "Poems", "Community", "About", "Contact"];
type Poem = (typeof POEMS)[0];
type Category =
  | "All"
  | "Sad"
  | "Romantic"
  | "Love"
  | "Life"
  | "Nature"
  | "Other";
const CATEGORIES: Category[] = [
  "All",
  "Sad",
  "Romantic",
  "Love",
  "Life",
  "Nature",
  "Other",
];

function getCategory(poem: {
  title: string;
  full: string;
  excerpt: string;
}): Category {
  const text = `${poem.title} ${poem.full} ${poem.excerpt}`.toLowerCase();
  if (
    /romantic|romance|candle|wine|kiss|touch|embrace|night together/.test(text)
  )
    return "Romantic";
  if (
    /sad|pain|hurt|cry|tear|grief|sorrow|broken|miss|lost|alone|dark|silent|wound|bleed/.test(
      text,
    )
  )
    return "Sad";
  if (
    /nature|rain|sky|wind|tree|flower|earth|sun|moon|star|river|sea|ocean|forest/.test(
      text,
    )
  )
    return "Nature";
  if (
    /love|heart|feel|beloved|dear|you and i|us|together|care|warmth/.test(text)
  )
    return "Love";
  if (
    /life|dream|hope|future|time|memory|past|moment|journey|story|world/.test(
      text,
    )
  )
    return "Life";
  return "Other";
}

function FeatherIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold opacity-70"
      role="img"
      aria-label="Feather quill icon"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

function Header({
  onSearchOpen,
  onAdminOpen,
}: { onSearchOpen: () => void; onAdminOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [_logoClicks, setLogoClicks] = useState(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { identity, login, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.07_0.005_50/0.97)] shadow-[0_2px_24px_oklch(0_0_0/0.6)]"
          : "bg-[oklch(0.07_0.005_50/0.85)]"
      } backdrop-blur-md border-b border-[oklch(0.22_0.02_60/0.4)]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setLogoClicks((prev) => {
              const next = prev + 1;
              if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
              if (next >= 5) {
                onAdminOpen();
                return 0;
              }
              logoClickTimer.current = setTimeout(() => setLogoClicks(0), 1500);
              return next;
            });
          }}
          className="font-cinzel text-sm sm:text-base font-semibold tracking-[0.15em] text-gold uppercase"
          data-ocid="header.link"
        >
          CHINNUA POET
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              className="font-cinzel text-xs tracking-[0.12em] text-muted-foreground hover:text-gold transition-colors uppercase"
              data-ocid="nav.link"
            >
              {link}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSearchOpen}
            className="p-2 text-muted-foreground hover:text-gold transition-colors"
            data-ocid="header.search_input"
            aria-label="Search poems"
          >
            <Search size={18} />
          </button>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={clear}
              className="font-cinzel text-xs tracking-widest text-muted-foreground hover:text-gold transition-colors uppercase px-3 py-1.5 border border-[oklch(0.22_0.02_60/0.4)] hover:border-[oklch(0.72_0.09_75/0.4)]"
              data-ocid="header.button"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={login}
              className="font-cinzel text-xs tracking-widest text-gold uppercase px-3 py-1.5 border border-[oklch(0.72_0.09_75/0.4)] hover:border-[oklch(0.72_0.09_75/0.8)] hover:bg-[oklch(0.72_0.09_75/0.06)] transition-all"
              data-ocid="header.button"
            >
              Login
            </button>
          )}
          <a
            href="https://x.com/CHINNUA_POET"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-[oklch(0.72_0.09_75/0.5)] text-gold hover:bg-[oklch(0.72_0.09_75/0.08)] transition-all font-cinzel text-xs tracking-widest"
            data-ocid="header.link"
          >
            Follow CHINNUA_POET
          </a>
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-[oklch(0.22_0.02_60/0.4)] bg-[oklch(0.07_0.005_50/0.97)]"
          >
            <nav className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link}
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="font-cinzel text-xs tracking-[0.15em] text-muted-foreground hover:text-gold transition-colors uppercase text-left"
                  data-ocid="nav.link"
                >
                  {link}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0D0D0D 0%, #1A1410 40%, #0f0b08 70%, #0D0D0D 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full py-20 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-[oklch(0.72_0.09_75/0.6)]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-gold uppercase">
              Est. 2025 · Poetry & Verse
            </span>
          </div>
          <h1 className="font-cinzel text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-none">
            <span className="text-gold block">CHINNUA</span>
            <span className="text-foreground block mt-1">_POET</span>
          </h1>
          <p className="font-lora text-xl italic leading-relaxed text-[oklch(0.93_0.025_65)]">
            &ldquo;I exist… but not everyone gets to see me.&rdquo;
          </p>
          <p className="font-lora text-sm text-muted-foreground leading-loose max-w-md">
            Exploring the depth of human emotion, the beauty of nature, and the
            quiet power of words left between the lines.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              type="button"
              onClick={onExplore}
              className="group flex items-center gap-2 px-7 py-3.5 font-cinzel text-xs tracking-[0.15em] uppercase bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] transition-all duration-300 shadow-[0_0_24px_oklch(0.72_0.09_75/0.25)]"
              data-ocid="hero.primary_button"
            >
              Explore Poems{" "}
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("poems")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2 px-7 py-3.5 font-cinzel text-xs tracking-[0.15em] uppercase border border-[oklch(0.72_0.09_75/0.4)] text-gold hover:bg-[oklch(0.72_0.09_75/0.08)] transition-all duration-300"
              data-ocid="hero.secondary_button"
            >
              Latest Collection
            </button>
          </div>
          <div className="flex items-center gap-8 mt-4 pt-6 border-t border-[oklch(0.22_0.02_60/0.4)]">
            <div>
              <p className="font-cinzel text-2xl font-semibold text-gold">
                365+
              </p>
              <p className="font-lora text-xs text-muted-foreground mt-0.5">
                Poems Written
              </p>
            </div>
            <div className="w-px h-10 bg-[oklch(0.22_0.02_60/0.5)]" />
            <div>
              <p className="font-cinzel text-2xl font-semibold text-gold">
                2025
              </p>
              <p className="font-lora text-xs text-muted-foreground mt-0.5">
                Active Since
              </p>
            </div>
            <div className="w-px h-10 bg-[oklch(0.22_0.02_60/0.5)]" />
            <div>
              <p className="font-cinzel text-2xl font-semibold text-gold">
                India
              </p>
              <p className="font-lora text-xs text-muted-foreground mt-0.5">
                Based In
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto w-[420px] h-[560px]">
            <div className="absolute -inset-3 border border-[oklch(0.72_0.09_75/0.2)] -rotate-1" />
            <div className="absolute -inset-6 border border-[oklch(0.72_0.09_75/0.1)] rotate-1" />
            <img
              src="/assets/uploads/chatgpt_image_mar_27_2026_05_29_47_pm-019d3017-bf42-731e-8619-ad60704720f8-1.png"
              alt="Chinnua"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, oklch(0.065 0.005 50) 0%, transparent 40%)",
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[oklch(0.07_0.006_52/0.9)] border border-[oklch(0.72_0.09_75/0.25)] backdrop-blur-sm">
              <p className="font-lora text-sm italic text-muted-foreground leading-relaxed">
                &ldquo;I exist… but not everyone gets to see me.&rdquo;
              </p>
              <p className="font-cinzel text-xs tracking-widest text-gold mt-2">
                — CHINNUA
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="font-cinzel text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[oklch(0.72_0.09_75)] to-transparent animate-bounce" />
      </div>
    </section>
  );
}

const QUOTE_SECTIONS = [
  {
    label: "Mystery",
    lines: ["Some stories…", "are never told,", "yet they scream the loudest."],
    gold: [0],
  },
  {
    label: "Hidden Pain",
    lines: [
      "I mastered silence…",
      "not because I had nothing to say,",
      "but because no one was ready to listen.",
    ],
    gold: [0],
  },
  {
    label: "Loneliness",
    lines: ["Being alone never hurt me…", "but being misunderstood did."],
    gold: [1],
  },
  {
    label: "Identity",
    lines: [
      "You see my words…",
      "but you'll never see",
      "the wounds that wrote them.",
    ],
    gold: [2],
  },
  {
    label: "Signature",
    lines: ["Not every poet writes…", "some just bleed quietly."],
    gold: [1],
  },
];

function QuoteSections() {
  return (
    <div>
      {QUOTE_SECTIONS.map((q, qi) => (
        <motion.section
          key={q.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="py-24 px-4 flex flex-col items-center justify-center text-center border-t border-[#C8A96A]/15"
          style={{
            background: qi % 2 === 0 ? "#0D0D0D" : "#111109",
          }}
        >
          <span className="font-cinzel text-[10px] tracking-[0.3em] text-[oklch(0.4_0.04_65)] uppercase mb-8 block">
            {q.label}
          </span>
          <div className="flex flex-col gap-2">
            {q.lines.map((line, li) => (
              <p
                key={line}
                className={`font-playfair text-2xl sm:text-3xl italic leading-relaxed ${q.gold.includes(li) ? "text-gold" : "text-[oklch(0.93_0.025_65)]"}`}
              >
                {line}
              </p>
            ))}
          </div>
          <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.3)] mt-10 block" />
        </motion.section>
      ))}
    </div>
  );
}

function PoemCard({
  poem,
  onClick,
  index,
}: { poem: Poem; onClick: () => void; index: number }) {
  const category = getCategory(poem);
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 12) * 0.05 }}
      className="group relative flex flex-col bg-[oklch(0.095_0.008_55)] border border-[oklch(0.22_0.02_60/0.4)] hover:border-[oklch(0.72_0.09_75/0.5)] transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_oklch(0.72_0.09_75/0.1)]"
      onClick={onClick}
      data-ocid={`poems.item.${(index % 12) + 1}`}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75/0.6)] to-transparent group-hover:via-[oklch(0.72_0.09_75)] transition-all duration-300" />
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
              {category}
            </span>
            <h3 className="font-cinzel text-base font-semibold text-foreground mt-1 group-hover:text-gold transition-colors">
              {poem.title}
            </h3>
          </div>
          <FeatherIcon />
        </div>
        <p className="font-lora text-sm text-muted-foreground leading-relaxed flex-1 italic">
          {poem.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-[oklch(0.22_0.02_60/0.3)]">
          <span className="font-cinzel text-[10px] tracking-widest text-[oklch(0.4_0.02_60)]">
            {poem.year}
          </span>
          <span className="font-cinzel text-[10px] tracking-[0.15em] text-gold uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
            Read More <ChevronRight size={10} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function LatestPoems({
  poems,
  onSelectPoem,
}: {
  poems: AdminPoemAsPoem[];
  onSelectPoem: (p: AdminPoemAsPoem) => void;
}) {
  if (poems.length === 0) {
    return (
      <section
        className="py-20 px-4 sm:px-8 text-center"
        style={{
          background: "#0D0D0D",
          borderTop: "1px solid rgba(200,169,106,0.12)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-gold uppercase">
            Fresh Ink
          </span>
          <h2 className="font-cinzel text-4xl sm:text-5xl font-semibold text-foreground mt-3 tracking-wide uppercase">
            Latest Poems
          </h2>
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
            <FeatherIcon />
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
          </div>
          <p className="font-lora text-sm italic text-muted-foreground mt-8 max-w-md mx-auto leading-relaxed">
            New poems coming soon…
          </p>
        </motion.div>
      </section>
    );
  }

  const displayed = poems.slice(0, 6);

  return (
    <section
      id="latest"
      className="py-24 px-4 sm:px-8"
      style={{
        background: "#0D0D0D",
        borderTop: "1px solid rgba(200,169,106,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-gold uppercase">
            Fresh Ink
          </span>
          <h2 className="font-cinzel text-4xl sm:text-5xl font-semibold text-foreground mt-3 tracking-wide uppercase">
            Latest Poems
          </h2>
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
            <FeatherIcon />
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
          </div>
          <p className="font-lora text-sm italic text-muted-foreground mt-5 max-w-lg mx-auto leading-relaxed">
            Newly added — words written closest to now.
          </p>
        </motion.div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="latest.list"
        >
          {displayed.map((poem, i) => (
            <motion.article
              key={poem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative flex flex-col bg-[oklch(0.09_0.008_55)] border border-[oklch(0.22_0.02_60/0.4)] hover:border-[oklch(0.72_0.09_75/0.55)] transition-all duration-300 cursor-pointer hover:shadow-[0_0_36px_oklch(0.72_0.09_75/0.1)]"
              onClick={() => onSelectPoem(poem)}
              data-ocid={`latest.item.${i + 1}`}
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75/0.7)] to-transparent group-hover:via-[oklch(0.72_0.09_75)] transition-all duration-300" />
              <div className="p-7 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="font-cinzel text-[10px] tracking-[0.22em] text-gold uppercase">
                      {poem.theme || "Poetry"}
                    </span>
                    <h3 className="font-cinzel text-base font-semibold text-foreground mt-1 group-hover:text-gold transition-colors leading-snug">
                      {poem.title}
                    </h3>
                  </div>
                  <FeatherIcon />
                </div>
                <p className="font-lora text-sm text-muted-foreground leading-relaxed flex-1 italic whitespace-pre-line line-clamp-4">
                  {poem.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[oklch(0.22_0.02_60/0.3)]">
                  <span className="font-cinzel text-[10px] tracking-widest text-[oklch(0.4_0.02_60)] uppercase">
                    {poem.year}
                  </span>
                  <button
                    type="button"
                    className="font-cinzel text-[10px] tracking-[0.15em] text-gold uppercase flex items-center gap-1 group-hover:gap-2 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPoem(poem);
                    }}
                    data-ocid={`latest.button.${i + 1}`}
                  >
                    Read <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const POEMS_PER_PAGE = 12;

function PoemsGallery({
  onSelectPoem,
  allPoems,
}: {
  onSelectPoem: (poem: Poem) => void;
  allPoems: (
    | Poem
    | {
        id: number;
        title: string;
        full: string;
        excerpt: string;
        year: string;
        theme: string;
      }
  )[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const filteredPoems =
    activeCategory === "All"
      ? allPoems
      : allPoems.filter((p) => getCategory(p) === activeCategory);
  const totalPages = Math.ceil(filteredPoems.length / POEMS_PER_PAGE);
  const pagePoems = filteredPoems.slice(
    (currentPage - 1) * POEMS_PER_PAGE,
    currentPage * POEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById("poems")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategory = (cat: Category) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <section
      id="poems"
      className="py-24 px-4 sm:px-8"
      style={{
        background: "#14100c",
        borderTop: "1px solid rgba(200,169,106,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-gold uppercase">
            The Collection
          </span>
          <h2 className="font-cinzel text-4xl sm:text-5xl font-semibold text-foreground mt-3 tracking-wide uppercase">
            Poems Gallery
          </h2>
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
            <FeatherIcon />
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
          </div>
          <p className="font-lora text-sm italic text-muted-foreground mt-5 max-w-lg mx-auto leading-relaxed">
            365 poems spanning love, loss, solitude, and strength.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategory(cat)}
              className={`font-cinzel text-[11px] tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] border-[oklch(0.72_0.09_75)]"
                  : "border-[oklch(0.72_0.09_75/0.3)] text-[oklch(0.72_0.09_75)] hover:bg-[oklch(0.72_0.09_75/0.08)] hover:border-[oklch(0.72_0.09_75/0.6)]"
              }`}
              data-ocid="poems.tab"
            >
              {cat}
            </button>
          ))}
        </motion.div>
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <button
              type="button"
              onClick={login}
              className="font-cinzel text-xs tracking-widest text-gold uppercase border border-[oklch(0.72_0.09_75/0.45)] px-6 py-3 hover:bg-[oklch(0.72_0.09_75/0.07)] hover:border-[oklch(0.72_0.09_75/0.8)] transition-all"
              data-ocid="poems.button"
            >
              Login to unlock the full collection →
            </button>
          </motion.div>
        )}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          data-ocid="poems.list"
        >
          {pagePoems.map((poem, i) => (
            <PoemCard
              key={poem.id}
              poem={poem}
              index={i}
              onClick={() => onSelectPoem(poem)}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-14">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="font-cinzel text-xs tracking-[0.15em] uppercase px-5 py-2.5 border border-[oklch(0.72_0.09_75/0.3)] text-gold hover:bg-[oklch(0.72_0.09_75/0.08)] hover:border-[oklch(0.72_0.09_75/0.6)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            data-ocid="poems.pagination_prev"
          >
            ← Prev
          </button>
          <span className="font-cinzel text-xs tracking-[0.2em] text-[oklch(0.5_0.025_60)]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="font-cinzel text-xs tracking-[0.15em] uppercase px-5 py-2.5 border border-[oklch(0.72_0.09_75/0.3)] text-gold hover:bg-[oklch(0.72_0.09_75/0.08)] hover:border-[oklch(0.72_0.09_75/0.6)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            data-ocid="poems.pagination_next"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}

const PERSONAL_STORY = `I was born with a cleft lip and palate. As the years passed, surgeries became a part of my childhood—four operations before I even turned five. My body healed in time, but my voice became something people noticed in ways that hurt. School life was never easy. Many people humiliated me because of how I sounded, and sometimes that pain came even from within my own family. I think that is where my shyness began—or maybe it only deepened what already existed within me.

My parents have been the greatest support of my life. Without them, I don't know where I would be. Still, the humiliation and loneliness became too heavy at times. I tried to end my life more than once. The first time, I was only seven years old. Writing this now is not easy, but it is the truth of my journey.

Crowds make me anxious. I stay quiet, withdrawn, unsure of myself. Over time, life taught me a hard lesson—that for people with physical or mental struggles, survival is more difficult. The world often supports only those who look "normal," who sound "normal," who appear successful or wealthy. People rarely try to understand what someone else is going through. Though, I must say—there are good people too, even if they are fewer and quieter.

I never spoke much about my pain. No one really tried to understand; everyone was ready with advice instead. What I needed was to be heard—but that never came. So, to heal myself, to express my emotions, thoughts, and pain, I began writing poetry. Poetry was not a choice for me—it was the only way left.

When I started writing, my parents asked me to stop. They believed poetry would interfere with my studies. But I couldn't stop. Because if I stopped writing, I would lose myself completely.

When my friends read my poems, they encouraged me to share them on Instagram—to create a poetic space, to connect with people who carried different stories and different struggles. That is how I began sharing my words with the world.

Today, I am 18 years old. Life has taught me many lessons—through suffering, through experience, and through the people I've met along the way. I am still learning. I think I always will be.

This is my story—imperfect, unfinished, but mine.

Thank you for listening to me with such care.`;

const ABOUT_POEM = `Not every poet is meant to be known…
some are only meant to be felt.

I am not here to be seen,
I am here to be understood—
and even that is rare.

I write what silence cannot hold anymore,
what the heart hides behind calm eyes,
what the world often ignores… yet feels.

These words are not just poetry,
they are fragments of moments,
of pain, of longing, of unanswered questions.

If you find yourself in my lines,
then maybe…
we have suffered the same silence.

And if you don't—
then perhaps,
you were never meant to.`;

function About() {
  const [storyOpen, setStoryOpen] = useState(false);
  const [poetNote, setPoetNote] = useState<string>(() => {
    try {
      return localStorage.getItem("chinnua_poet_note") ?? "";
    } catch {
      return "";
    }
  });
  const [editingNote, setEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  const handleEditNote = () => {
    const pw = window.prompt("Enter poet password to edit:");
    if (pw === "chinnua2025") {
      setNoteInput(poetNote);
      setEditingNote(true);
    } else if (pw !== null) {
      window.alert("Incorrect password.");
    }
  };

  const saveNote = () => {
    try {
      localStorage.setItem("chinnua_poet_note", noteInput);
    } catch {}
    setPoetNote(noteInput);
    setEditingNote(false);
  };

  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-8"
      style={{
        background: "linear-gradient(180deg, #0f0b08 0%, #0D0D0D 100%)",
        borderTop: "1px solid rgba(200,169,106,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-gold uppercase">
            The Poet
          </span>
          <h2 className="font-cinzel text-4xl sm:text-5xl font-semibold text-foreground mt-3 tracking-wide uppercase">
            About Chinnua
          </h2>
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
            <FeatherIcon />
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
          </div>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-[420px]">
              <div className="absolute -top-4 -left-4 w-full h-full border border-[oklch(0.72_0.09_75/0.2)]" />
              <img
                src="/assets/uploads/chatgpt_image_mar_27_2026_05_29_47_pm-019d3017-bf42-731e-8619-ad60704720f8-1.png"
                alt="Chinnua"
                className="w-full h-[480px] object-cover relative z-10"
              />
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to top, oklch(0.07 0.005 50/0.5) 0%, transparent 60%)",
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 border border-[oklch(0.22_0.02_60/0.3)] bg-[oklch(0.095_0.008_55)] mt-6">
              <div>
                <p className="font-cinzel text-xs tracking-widest text-gold uppercase mb-1">
                  Genre
                </p>
                <p className="font-lora text-sm text-muted-foreground">
                  Contemporary Lyric Poetry
                </p>
              </div>
              <div>
                <p className="font-cinzel text-xs tracking-widest text-gold uppercase mb-1">
                  Based In
                </p>
                <p className="font-lora text-sm text-muted-foreground">India</p>
              </div>
              <div>
                <p className="font-cinzel text-xs tracking-widest text-gold uppercase mb-1">
                  Language
                </p>
                <p className="font-lora text-sm text-muted-foreground">
                  English
                </p>
              </div>
              <div>
                <p className="font-cinzel text-xs tracking-widest text-gold uppercase mb-1">
                  Active Since
                </p>
                <p className="font-lora text-sm text-muted-foreground">2025</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col gap-7"
          >
            <div className="h-px bg-gradient-to-r from-[oklch(0.72_0.09_75/0.6)] to-transparent" />
            <p className="font-lora text-lg text-foreground leading-loose">
              Chinnua is a poet and storyteller whose words dance between
              worlds.
            </p>
            <p className="font-lora text-base text-muted-foreground leading-loose">
              With a gift for transforming ordinary moments into extraordinary
              verse, Chinnua's poetry explores the depth of human emotion, the
              beauty of nature, and the quiet power of silence. Each poem is an
              invitation to pause, feel, and remember.
            </p>
            <p className="font-lora text-base text-muted-foreground leading-loose">
              Drawing from lived experience and universal longing, the work
              speaks to anyone who has loved, lost, waited, or wondered — which
              is to say, everyone.
            </p>
            <blockquote className="border-l-2 border-[oklch(0.72_0.09_75/0.6)] pl-5 py-2 bg-[oklch(0.09_0.007_52)] pr-4">
              <p className="font-lora text-sm italic text-muted-foreground leading-loose whitespace-pre-line">
                {ABOUT_POEM}
              </p>
            </blockquote>
            <div>
              <button
                type="button"
                onClick={() => setStoryOpen((v) => !v)}
                className="font-cinzel text-xs tracking-[0.15em] uppercase text-gold border border-[oklch(0.72_0.09_75/0.35)] px-5 py-2.5 hover:bg-[oklch(0.72_0.09_75/0.07)] hover:border-[oklch(0.72_0.09_75/0.7)] transition-all flex items-center gap-2"
                data-ocid="about.toggle"
              >
                {storyOpen
                  ? "Hide My Story"
                  : "Read My Story — In My Own Voice"}
                <ChevronRight
                  size={12}
                  className={`transition-transform ${storyOpen ? "rotate-90" : ""}`}
                />
              </button>
              <AnimatePresence>
                {storyOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-6 border border-[oklch(0.22_0.02_60/0.3)] bg-[oklch(0.09_0.007_52)]">
                      <p className="font-cinzel text-xs tracking-[0.25em] text-gold uppercase mb-4">
                        My Story — In My Own Voice
                      </p>
                      <p className="font-lora text-sm text-muted-foreground leading-loose whitespace-pre-line">
                        {PERSONAL_STORY}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="border border-[oklch(0.72_0.09_75/0.2)] p-5 bg-[oklch(0.085_0.007_52)]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-cinzel text-xs tracking-[0.2em] text-gold uppercase">
                  Poet's Note
                </p>
                {!editingNote && (
                  <button
                    type="button"
                    onClick={handleEditNote}
                    className="font-cinzel text-[10px] tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors border border-[oklch(0.22_0.02_60/0.4)] px-3 py-1 hover:border-[oklch(0.72_0.09_75/0.4)]"
                    data-ocid="about.edit_button"
                  >
                    Edit Note
                  </button>
                )}
              </div>
              {editingNote ? (
                <div className="flex flex-col gap-3">
                  <Textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Write a note to your readers…"
                    className="font-lora text-sm bg-[oklch(0.07_0.005_50)] border-[oklch(0.72_0.09_75/0.3)] text-foreground placeholder:text-muted-foreground rounded-none focus-visible:ring-[oklch(0.72_0.09_75/0.4)] min-h-[100px]"
                    data-ocid="about.textarea"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveNote}
                      className="font-cinzel text-[10px] tracking-widest uppercase bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] px-4 py-2 hover:bg-[oklch(0.78_0.11_78)] transition-colors"
                      data-ocid="about.save_button"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingNote(false)}
                      className="font-cinzel text-[10px] tracking-widest uppercase border border-[oklch(0.22_0.02_60/0.4)] text-muted-foreground px-4 py-2 hover:text-gold transition-colors"
                      data-ocid="about.cancel_button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-lora text-sm italic text-muted-foreground leading-relaxed">
                  {poetNote || "No note from the poet yet."}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold opacity-70" />
                <a
                  href="mailto:anoldpoet07@gmail.com"
                  className="font-lora text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  anoldpoet07@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram size={14} className="text-gold opacity-70" />
                <a
                  href="https://www.instagram.com/chinnua_07_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-lora text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  @chinnua_07_
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Youtube size={14} className="text-gold opacity-70" />
                <a
                  href="https://www.youtube.com/@ChinnuaPoetofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-lora text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  @ChinnuaPoetofficial
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-parisienne text-4xl text-gold">Chinnua</p>
              <span className="h-px w-20 bg-[oklch(0.72_0.09_75/0.4)]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer
      id="contact"
      className="border-t border-[oklch(0.22_0.02_60/0.3)] bg-[oklch(0.065_0.005_50)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex flex-col gap-8">
            <div>
              <p className="font-cinzel text-lg font-semibold tracking-[0.15em] text-gold uppercase">
                CHINNUA POET
              </p>
              <p className="font-lora text-sm italic text-muted-foreground mt-2">
                Words that linger. Verses that heal.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-3">
              {["Home", "Poems", "About", "Contact"].map((link) => (
                <button
                  type="button"
                  key={link}
                  onClick={() =>
                    document
                      .getElementById(link.toLowerCase())
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="font-cinzel text-xs tracking-[0.12em] text-muted-foreground hover:text-gold transition-colors uppercase"
                  data-ocid="footer.link"
                >
                  {link}
                </button>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {[
                  {
                    Icon: Twitter,
                    href: "https://twitter.com/CHINNUA_POET",
                    label: "Twitter",
                  },
                  {
                    Icon: Instagram,
                    href: "https://www.instagram.com/chinnua_07_/",
                    label: "Instagram",
                  },
                  {
                    Icon: Youtube,
                    href: "https://www.youtube.com/@ChinnuaPoetofficial",
                    label: "YouTube",
                  },
                  { Icon: Facebook, href: "#", label: "Facebook" },
                  {
                    Icon: Mail,
                    href: "mailto:anoldpoet07@gmail.com",
                    label: "Email",
                  },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel={
                      href.startsWith("mailto")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    aria-label={label}
                    className="p-2 text-muted-foreground hover:text-gold border border-[oklch(0.22_0.02_60/0.3)] hover:border-[oklch(0.72_0.09_75/0.5)] transition-all"
                    data-ocid="footer.link"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
              <a
                href="mailto:anoldpoet07@gmail.com"
                className="font-lora text-xs text-muted-foreground hover:text-gold transition-colors"
              >
                anoldpoet07@gmail.com
              </a>
            </div>
            <p className="font-lora text-xs text-[oklch(0.38_0.015_60)]">
              © {year}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Built with ♥ using caffeine.ai
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <p className="font-cinzel text-xs tracking-[0.25em] text-gold uppercase">
                Stay Connected
              </p>
              <h3 className="font-cinzel text-xl font-semibold text-foreground mt-2">
                Join the Circle
              </h3>
              <p className="font-lora text-sm text-muted-foreground mt-2 leading-relaxed">
                Receive new poems and thoughts directly in your inbox. No noise
                — only verse.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex gap-0"
              data-ocid="newsletter.panel"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.095_0.008_55)] text-foreground placeholder:text-muted-foreground font-lora text-sm focus-visible:ring-[oklch(0.72_0.09_75/0.5)] border-r-0"
                data-ocid="newsletter.input"
              />
              <Button
                type="submit"
                className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] px-5 shrink-0"
                data-ocid="newsletter.submit_button"
              >
                SIGN UP
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[oklch(0.22_0.02_60/0.2)] text-center">
          <p className="font-lora text-sm italic text-gold opacity-60">
            &ldquo;If you understood even a part of this… you&rsquo;ve felt it
            too.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}

type Comment = { id: number; text: string; timestamp: string };

function PoemModal({
  poem,
  onClose,
}: { poem: Poem | null; onClose: () => void }) {
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setComments([]);
    setCommentInput("");
  }, []);

  const postComment = () => {
    const text = commentInput.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), text, timestamp: new Date().toLocaleDateString() },
    ]);
    setCommentInput("");
  };

  return (
    <Dialog open={!!poem} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-2xl bg-[oklch(0.095_0.008_55)] border border-[oklch(0.22_0.02_60/0.5)] text-foreground rounded-none p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
        data-ocid="poems.modal"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75)] to-transparent" />
        {isLoggedIn ? (
          <div className="p-8 sm:p-10">
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <FeatherIcon />
                <span className="font-cinzel text-[10px] tracking-[0.25em] text-gold uppercase">
                  {poem?.year}
                </span>
              </div>
              <DialogTitle className="font-cinzel text-2xl sm:text-3xl font-semibold text-foreground">
                {poem?.title}
              </DialogTitle>
              <div className="h-px mt-3 bg-gradient-to-r from-[oklch(0.72_0.09_75/0.4)] to-transparent" />
            </DialogHeader>
            <div className="font-lora text-base leading-[2] text-muted-foreground whitespace-pre-line italic">
              {poem?.full}
            </div>
            <div className="mt-10 pt-8 border-t border-[oklch(0.22_0.02_60/0.3)]">
              <p className="font-cinzel text-xs tracking-[0.2em] text-gold uppercase mb-5">
                Leave a Thought
              </p>
              <div className="flex flex-col gap-3" data-ocid="poems.panel">
                <Textarea
                  ref={textareaRef}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="A thought, a feeling, a suggestion…"
                  className="font-lora text-sm bg-[oklch(0.07_0.005_50)] border-[oklch(0.72_0.09_75/0.25)] text-foreground placeholder:text-muted-foreground rounded-none focus-visible:ring-[oklch(0.72_0.09_75/0.4)] min-h-[80px] resize-none"
                  data-ocid="poems.textarea"
                />
                <button
                  type="button"
                  onClick={postComment}
                  className="self-end font-cinzel text-xs tracking-[0.15em] uppercase bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] px-5 py-2 hover:bg-[oklch(0.78_0.11_78)] transition-colors"
                  data-ocid="poems.submit_button"
                >
                  Post
                </button>
              </div>
              {comments.length > 0 && (
                <div className="mt-5 flex flex-col gap-3">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-[oklch(0.08_0.006_52)] border border-[oklch(0.22_0.02_60/0.3)]"
                    >
                      <p className="font-lora text-sm text-muted-foreground italic">
                        {c.text}
                      </p>
                      <p className="font-cinzel text-[10px] tracking-widest text-[oklch(0.4_0.02_60)] mt-1">
                        {c.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-[oklch(0.22_0.02_60/0.3)]">
              <p className="font-parisienne text-2xl text-gold">Chinnua</p>
              <Button
                variant="ghost"
                onClick={onClose}
                className="font-cinzel text-xs tracking-[0.15em] text-muted-foreground hover:text-gold uppercase"
                data-ocid="poems.close_button"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-10 sm:p-14 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 flex items-center justify-center border border-[oklch(0.72_0.09_75/0.35)] bg-[oklch(0.07_0.005_50)]">
              <FeatherIcon />
            </div>
            <DialogHeader>
              <DialogTitle className="font-cinzel text-2xl text-foreground tracking-wide">
                Members Only
              </DialogTitle>
            </DialogHeader>
            <p className="font-lora text-sm italic text-muted-foreground max-w-xs leading-relaxed">
              Login with Internet Identity to read the full poem.
            </p>
            <button
              type="button"
              onClick={login}
              className="bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] px-6 py-3 transition-all"
              data-ocid="poems.primary_button"
            >
              Login to Read
            </button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="font-cinzel text-xs tracking-[0.15em] text-muted-foreground hover:text-gold uppercase"
              data-ocid="poems.close_button"
            >
              Close
            </Button>
          </div>
        )}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75/0.4)] to-transparent" />
      </DialogContent>
    </Dialog>
  );
}

function SearchModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Poem | null>(null);

  const results =
    query.trim().length > 1
      ? POEMS.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.theme.toLowerCase().includes(query.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  return (
    <>
      <Dialog open={open && !selected} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          className="max-w-xl bg-[oklch(0.095_0.008_55)] border border-[oklch(0.22_0.02_60/0.5)] text-foreground rounded-none p-0"
          data-ocid="search.modal"
        >
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                Search Poems
              </DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, theme…"
                className="pl-9 rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora placeholder:text-muted-foreground focus-visible:ring-[oklch(0.72_0.09_75/0.5)]"
                data-ocid="search.search_input"
              />
            </div>
            {results.length > 0 && (
              <ul className="mt-4 flex flex-col gap-1 max-h-80 overflow-y-auto">
                {results.map((poem) => (
                  <li key={poem.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(poem);
                      }}
                      className="w-full text-left p-3 hover:bg-[oklch(0.72_0.09_75/0.08)] border border-transparent hover:border-[oklch(0.72_0.09_75/0.3)] transition-all"
                    >
                      <p className="font-cinzel text-sm text-foreground">
                        {poem.title}
                      </p>
                      <p className="font-cinzel text-[10px] tracking-widest text-gold mt-0.5 uppercase">
                        {getCategory(poem)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.length > 1 && results.length === 0 && (
              <p className="font-lora text-sm text-muted-foreground italic mt-4 text-center py-4">
                No poems found for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <PoemModal
        poem={selected}
        onClose={() => {
          setSelected(null);
          onClose();
        }}
      />
    </>
  );
}

type AdminPoemAsPoem = {
  id: number;
  title: string;
  full: string;
  excerpt: string;
  year: string;
  theme: string;
};

function adminPoemToPoem(ap: AdminPoem, index: number): AdminPoemAsPoem {
  const lines = ap.content.split("\n").filter((l) => l.trim());
  return {
    id: -(index + 1),
    title: ap.title,
    full: ap.content,
    excerpt: lines.slice(0, 4).join("\n"),
    year: new Date().getFullYear().toString(),
    theme: ap.category,
  };
}

export default function App() {
  const { actor } = useActor();
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPoems, setAdminPoems] = useState<AdminPoem[]>([]);
  const [profileView, setProfileView] = useState<{
    author: string;
    principal: string;
  } | null>(null);
  const [showUserSetup, setShowUserSetup] = useState(false);
  const { identity } = useInternetIdentity();
  const principalStr = identity?.getPrincipal().toString() ?? "";

  // Check if logged-in user needs to set up username
  useEffect(() => {
    if (identity && principalStr) {
      const stored = localStorage.getItem(
        `chinnua_displayname_${principalStr}`,
      );
      if (!stored) {
        setShowUserSetup(true);
      }
    }
  }, [identity, principalStr]);

  // Check for ?admin=true in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") setAdminOpen(true);
  }, []);

  const fetchAdminPoems = async () => {
    if (!actor) return;
    try {
      const result = await actor.getAdminPoems();
      setAdminPoems(result);
    } catch {
      // ignore
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchAdminPoems only changes with actor
  useEffect(() => {
    if (actor) fetchAdminPoems();
  }, [actor]);

  const allPoems: (Poem | AdminPoemAsPoem)[] = [
    ...POEMS,
    ...adminPoems.map((ap, i) => adminPoemToPoem(ap, i)),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onAdminOpen={() => setAdminOpen(true)}
      />
      <main>
        <Hero
          onExplore={() =>
            document
              .getElementById("poems")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />
        <QuoteSections />
        <LatestPoems
          poems={adminPoems.map((ap, i) => adminPoemToPoem(ap, i))}
          onSelectPoem={(p) => setSelectedPoem(p as unknown as Poem)}
        />
        <PoemsGallery
          onSelectPoem={(p) => setSelectedPoem(p as Poem)}
          allPoems={allPoems}
        />
        <FeedSection
          onViewProfile={(author, principal) =>
            setProfileView({ author, principal })
          }
        />
        <CommunitySection />
        <About />
      </main>
      <Footer />
      <PoemModal poem={selectedPoem} onClose={() => setSelectedPoem(null)} />
      <UserSetupModal
        open={showUserSetup}
        onClose={() => {
          setShowUserSetup(false);
        }}
      />
      <ProfileModal
        open={!!profileView}
        onClose={() => setProfileView(null)}
        author={profileView?.author ?? ""}
        authorPrincipal={profileView?.principal ?? ""}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onPoemsChanged={fetchAdminPoems}
      />
      <PoetryAssistant />
      <MusicPlayer />
    </div>
  );
}
