import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Comment, CommentReply } from "../components/CommentThread";
import CommentThread from "../components/CommentThread";
import { LoginGate } from "../components/LoginGate";
import { useActor } from "../hooks/useActor";
import { POEMS } from "../poems-data";
import GallerySlide from "./GallerySlide";
import MusicSlide from "./MusicSlide";

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";
const WARM_MUTED = "rgba(92,61,46,0.5)";

const CATEGORIES = [
  "All",
  "Sad",
  "Romantic",
  "Dark",
  "Hopeful",
  "Love",
  "Loss",
  "Nature",
  "Spiritual",
  "Identity",
];

type PoemType = (typeof POEMS)[number];

function getCategoryGradient(category: string): string {
  switch (category.toLowerCase()) {
    case "hopeful":
    case "spiritual":
    case "nature":
      return "linear-gradient(135deg, #D4A853 0%, #8B6F47 40%, #5C3D2E 100%)";
    case "romantic":
    case "love":
      return "linear-gradient(135deg, #F5ECD7 0%, #D4A853 50%, #8B6F47 100%)";
    case "sad":
    case "loss":
      return "linear-gradient(180deg, #9E8070 0%, #5C3D2E 60%, #3D2B1F 100%)";
    default:
      return "linear-gradient(135deg, #8B6F47 0%, #5C3D2E 100%)";
  }
}

function assignCategory(poem: PoemType): string {
  if (poem.theme) {
    const t = poem.theme.trim();
    if (CATEGORIES.slice(1).some((c) => c.toLowerCase() === t.toLowerCase())) {
      return (
        CATEGORIES.slice(1).find((c) => c.toLowerCase() === t.toLowerCase()) ||
        ""
      );
    }
  }
  const text = `${poem.title} ${poem.full}`.toLowerCase();
  const check = (words: string[]) => words.some((w) => text.includes(w));
  if (
    check([
      "dark",
      "shadow",
      "fear",
      "death",
      "night",
      "black",
      "cold",
      "hollow",
      "void",
      "despair",
      "abyss",
      "bleed",
      "scream",
      "trapped",
      "haunted",
      "ghost",
    ])
  )
    return "Dark";
  if (
    check([
      "god",
      "divine",
      "universe",
      "soul",
      "spirit",
      "prayer",
      "sacred",
      "eternal",
      "faith",
      "bless",
      "heaven",
      "celestial",
      "peace",
    ])
  )
    return "Spiritual";
  if (
    check([
      "who am i",
      "identity",
      "mirror",
      "mask",
      "exist",
      "belong",
      "real",
      "truth",
      "hidden",
      "understand",
    ])
  )
    return "Identity";
  if (
    check([
      "nature",
      "rain",
      "river",
      "tree",
      "flower",
      "sky",
      "wind",
      "earth",
      "ocean",
      "moon",
      "sun",
      "storm",
      "leaf",
      "season",
      "mountain",
      "forest",
      "bird",
    ])
  )
    return "Nature";
  if (
    check([
      "hope",
      "light",
      "dawn",
      "rise",
      "strength",
      "future",
      "believe",
      "tomorrow",
      "dream",
      "courage",
      "shine",
      "heal",
      "new",
    ])
  )
    return "Hopeful";
  if (
    check([
      "loss",
      "lose",
      "gone",
      "farewell",
      "goodbye",
      "miss",
      "memory",
      "remember",
      "forget",
      "leave",
      "left",
      "fade",
      "absent",
    ])
  )
    return "Loss";
  if (
    check([
      "romantic",
      "rose",
      "moonlight",
      "whisper",
      "lover",
      "beloved",
      "tender",
      "desire",
      "kiss",
      "embrace",
      "together",
      "heart",
      "longing",
      "warmth",
    ])
  )
    return "Romantic";
  if (
    check([
      "love",
      "adore",
      "cherish",
      "devotion",
      "affection",
      "care",
      "hold",
      "forever",
      "precious",
      "beautiful",
    ])
  )
    return "Love";
  return "Sad";
}

interface PoemsSlideProps {
  currentUser: { username: string; bio: string; createdAt: string } | null;
  onLogin: (user: {
    username: string;
    bio?: string;
    email?: string;
    createdAt: string;
  }) => void;
}

type Tab = "poems" | "gallery" | "music";

function TabBar({
  active,
  onChange,
}: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "poems", label: "Poems" },
    { key: "gallery", label: "Gallery" },
    { key: "music", label: "Music" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderBottom: `1px solid ${WARM_BORDER}`,
        background: WARM_PAPER,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          data-ocid={`poems.${t.key}.tab`}
          style={{
            background:
              active === t.key ? "rgba(212,168,83,0.12)" : "transparent",
            border: "none",
            borderBottom:
              active === t.key
                ? `2px solid ${WARM_GOLD}`
                : "2px solid transparent",
            color: active === t.key ? WARM_MOCHA : WARM_BROWN,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            padding: "0.75rem 2rem",
            cursor: "pointer",
            transition: "all 0.2s",
            textTransform: "uppercase",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function CategoryFilterRow({
  categories,
  active,
  onChange,
  ocidPrefix,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
  ocidPrefix: string;
}) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          data-ocid={`${ocidPrefix}.tab`}
          style={{
            padding: "0.35rem 0.9rem",
            borderRadius: 20,
            border: `1px solid ${active === cat ? "rgba(212,168,83,0.7)" : WARM_BORDER}`,
            background:
              active === cat ? "rgba(212,168,83,0.15)" : "transparent",
            color: active === cat ? WARM_MOCHA : WARM_BROWN,
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function PoemGrid({
  poems,
  onSelect,
  emptyOcid,
  itemOcidPrefix,
}: {
  poems: PoemType[];
  onSelect: (p: PoemType) => void;
  emptyOcid: string;
  itemOcidPrefix: string;
}) {
  if (poems.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: WARM_MUTED,
          fontFamily: "'Libre Baskerville', Georgia, serif",
        }}
        data-ocid={emptyOcid}
      >
        No poems found
      </div>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "1rem",
      }}
    >
      {poems.slice(0, 120).map((poem, idx) => {
        const cat = assignCategory(poem);
        return (
          <motion.div
            key={poem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.01, 0.4) }}
            className="feed-card"
            style={{ padding: "1.25rem", cursor: "pointer" }}
            onClick={() => onSelect(poem)}
            data-ocid={`${itemOcidPrefix}.item.${idx + 1}`}
          >
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                background: "rgba(212,168,83,0.12)",
                borderRadius: 4,
                color: WARM_GOLD,
                fontFamily: "'Libre Baskerville', Georgia, serif",
                marginBottom: "0.5rem",
                display: "inline-block",
              }}
            >
              {cat}
            </span>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: WARM_MOCHA,
                marginBottom: "0.5rem",
                lineHeight: 1.4,
              }}
            >
              {poem.title}
            </h3>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: WARM_MUTED,
                fontSize: "0.85rem",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {poem.full.split("\n").filter(Boolean).slice(0, 2).join("\n")}
            </p>
            <span
              style={{
                marginTop: "0.75rem",
                display: "block",
                fontSize: "0.78rem",
                color: WARM_GOLD,
                fontFamily: "'Libre Baskerville', Georgia, serif",
              }}
            >
              Read poem
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function PoemsSlide({ currentUser, onLogin }: PoemsSlideProps) {
  const [tab, setTab] = useState<Tab>("poems");
  const [search1, setSearch1] = useState("");
  const [category1, setCategory1] = useState("All");
  const [search2, setSearch2] = useState("");
  const [category2, setCategory2] = useState("All");
  const [selected, setSelected] = useState<PoemType | null>(null);
  const [poemComments, setPoemComments] = useState<Comment[]>([]);
  const [poemCommentsLoaded, setPoemCommentsLoaded] = useState(false);
  const { actor } = useActor();

  useEffect(() => {
    if (!selected || !actor) {
      setPoemComments([]);
      setPoemCommentsLoaded(false);
      return;
    }
    const load = async () => {
      try {
        const backendComments = await actor.getCommentsForPost(
          String(selected.id),
        );
        const mapped: Comment[] = await Promise.all(
          backendComments.map(async (bc) => {
            let replies: CommentReply[] = [];
            try {
              const backendReplies = await actor.getRepliesForComment(bc.id);
              replies = backendReplies.map((br) => ({
                id: br.id.toString(),
                userId: br.author.toText(),
                username: br.authorName,
                text: br.text,
                timestamp: Number(br.timestamp / 1_000_000n),
              }));
            } catch {}
            return {
              id: bc.id.toString(),
              postId: bc.postId,
              userId: bc.author.toText(),
              username: bc.authorName,
              text: bc.text,
              timestamp: Number(bc.timestamp / 1_000_000n),
              replies,
            };
          }),
        );
        setPoemComments(mapped);
        setPoemCommentsLoaded(true);
      } catch {}
    };
    load();
  }, [selected, actor]);

  const handlePoemAddComment = async (postId: string, text: string) => {
    if (!currentUser || !actor) return;
    try {
      const result = await actor.addComment(postId, text, currentUser.username);
      if (result.__kind__ === "success") {
        const bc = result.success;
        setPoemComments((prev) => [
          ...prev,
          {
            id: bc.id.toString(),
            postId: bc.postId,
            userId: bc.author.toText(),
            username: bc.authorName,
            text: bc.text,
            timestamp: Number(bc.timestamp / 1_000_000n),
            replies: [],
          },
        ]);
      }
    } catch {}
  };

  const handlePoemAddReply = async (
    postId: string,
    commentId: string,
    text: string,
  ) => {
    if (!currentUser || !actor) return;
    try {
      const result = await actor.addReply(
        BigInt(commentId),
        postId,
        text,
        currentUser.username,
      );
      if (result.__kind__ === "success") {
        const br = result.success;
        setPoemComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  replies: [
                    ...c.replies,
                    {
                      id: br.id.toString(),
                      userId: br.author.toText(),
                      username: br.authorName,
                      text: br.text,
                      timestamp: Number(br.timestamp / 1_000_000n),
                    },
                  ],
                }
              : c,
          ),
        );
      }
    } catch {}
  };

  const handlePoemDeleteComment = async (
    _postId: string,
    commentId: string,
  ) => {
    if (!actor) return;
    try {
      await actor.deleteComment(BigInt(commentId));
    } catch {}
    setPoemComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handlePoemDeleteReply = async (
    _postId: string,
    commentId: string,
    replyId: string,
  ) => {
    if (!actor) return;
    try {
      await actor.deleteReply(BigInt(replyId));
    } catch {}
    setPoemComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
          : c,
      ),
    );
  };

  const mainPoems = POEMS.filter((p) => !p.collection);
  const echoesPoems = POEMS.filter(
    (p) => p.collection === "Echoes of My Heart",
  );

  function filterPoems(poems: PoemType[], search: string, category: string) {
    return poems.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.full.toLowerCase().includes(search.toLowerCase());
      const cat = assignCategory(p);
      const matchCat = category === "All" || cat === category;
      return matchSearch && matchCat;
    });
  }

  const filtered1 = filterPoems(mainPoems, search1, category1);
  const filtered2 = filterPoems(echoesPoems, search2, category2);

  return (
    <div
      className="slide-container"
      style={{ background: WARM_BG, overflowY: "auto" }}
    >
      <TabBar active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        {tab === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GallerySlide currentUser={currentUser} />
          </motion.div>
        )}
        {tab === "music" && (
          <motion.div
            key="music"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MusicSlide />
          </motion.div>
        )}
        {tab === "poems" && (
          <motion.div
            key="poems"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "1.5rem 1rem",
              paddingBottom: "2rem",
            }}
          >
            {/* Section 1 */}
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.6rem",
                color: WARM_MOCHA,
                marginBottom: "1.25rem",
                fontWeight: 700,
              }}
            >
              Poetry Collection
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <Input
                value={search1}
                onChange={(e) => setSearch1(e.target.value)}
                placeholder="Search poems..."
                data-ocid="poems.search_input"
                style={{
                  background: "rgba(255,248,238,0.8)",
                  border: `1px solid ${WARM_BORDER}`,
                  color: WARM_TEXT,
                  maxWidth: 400,
                }}
              />
              <CategoryFilterRow
                categories={CATEGORIES}
                active={category1}
                onChange={setCategory1}
                ocidPrefix="poems"
              />
            </div>
            <PoemGrid
              poems={filtered1}
              onSelect={setSelected}
              emptyOcid="poems.empty_state"
              itemOcidPrefix="poems"
            />

            <div
              style={{
                margin: "3rem 0",
                height: 1,
                background:
                  "linear-gradient(to right, transparent, rgba(212,168,83,0.4), transparent)",
              }}
            />

            {/* Section 2 */}
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.6rem",
                color: WARM_MOCHA,
                marginBottom: "0.4rem",
                fontWeight: 700,
              }}
            >
              Echoes of My Heart
            </h2>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: WARM_BROWN,
                fontSize: "0.88rem",
                marginBottom: "1.25rem",
              }}
            >
              A special collection
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <Input
                value={search2}
                onChange={(e) => setSearch2(e.target.value)}
                placeholder="Search Echoes of My Heart..."
                data-ocid="echoes.search_input"
                style={{
                  background: "rgba(255,248,238,0.8)",
                  border: `1px solid ${WARM_BORDER}`,
                  color: WARM_TEXT,
                  maxWidth: 400,
                }}
              />
              <CategoryFilterRow
                categories={CATEGORIES}
                active={category2}
                onChange={setCategory2}
                ocidPrefix="echoes"
              />
            </div>
            <PoemGrid
              poems={filtered2}
              onSelect={setSelected}
              emptyOcid="echoes.empty_state"
              itemOcidPrefix="echoes"
            />

            {/* Farewell */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                marginTop: "4rem",
                marginBottom: "2rem",
                textAlign: "center",
                padding: "3rem 2rem",
                borderTop: `1px solid ${WARM_BORDER}`,
                borderBottom: `1px solid ${WARM_BORDER}`,
              }}
            >
              <div
                style={{
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    height: 1,
                    width: 60,
                    background:
                      "linear-gradient(to right, transparent, rgba(212,168,83,0.5))",
                  }}
                />
                <span
                  style={{
                    color: WARM_GOLD,
                    fontSize: "1.1rem",
                    letterSpacing: "0.3em",
                  }}
                >
                  +
                </span>
                <div
                  style={{
                    height: 1,
                    width: 60,
                    background:
                      "linear-gradient(to left, transparent, rgba(212,168,83,0.5))",
                  }}
                />
              </div>

              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  color: WARM_MUTED,
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                A Note from the Poet
              </p>

              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  color: WARM_BROWN,
                  fontSize: "1.05rem",
                  lineHeight: 2,
                  maxWidth: 640,
                  margin: "0 auto 2rem",
                }}
              >
                Dear Reader, As you reach the final page, may these poems linger
                in your heart, like whispers of forgotten dreams and silent
                hopes. Each verse is a window into a world of feelings—love,
                loss, wonder, and discovery. Carry them with you, and let your
                soul wander in their echoes.
              </p>

              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: WARM_GOLD,
                  fontSize: "1.4rem",
                  letterSpacing: "0.15em",
                  marginBottom: "1.5rem",
                }}
              >
                Thank you
              </p>

              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  color: WARM_BROWN,
                  fontSize: "0.88rem",
                  letterSpacing: "0.08em",
                }}
              >
                — CHINNUA_POET
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poem Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          style={{
            background: WARM_PAPER,
            border: `1px solid ${WARM_BORDER}`,
            maxWidth: 600,
            maxHeight: "80vh",
            overflowY: "auto",
            color: WARM_TEXT,
          }}
          data-ocid="poems.dialog"
        >
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: WARM_MOCHA,
                fontSize: "1.3rem",
              }}
            >
              {selected?.title}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div
              style={{
                height: 160,
                borderRadius: 12,
                background: getCategoryGradient(assignCategory(selected)),
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "flex-end",
                padding: "1rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(245,236,215,0.7) 100%)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                  color: WARM_GOLD,
                  position: "relative",
                  zIndex: 1,
                  letterSpacing: "0.06em",
                }}
              >
                {assignCategory(selected)}
              </span>
            </div>
          )}
          {selected && (
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 8px",
                background: "rgba(212,168,83,0.12)",
                borderRadius: 4,
                color: WARM_GOLD,
                fontFamily: "'Libre Baskerville', Georgia, serif",
              }}
            >
              {assignCategory(selected)}
            </span>
          )}
          {currentUser ? (
            <pre
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: WARM_TEXT,
                fontSize: "0.95rem",
                lineHeight: 2,
                whiteSpace: "pre-wrap",
                marginTop: "1rem",
              }}
            >
              {selected?.full}
            </pre>
          ) : (
            <LoginGate
              onLogin={(u) =>
                onLogin({
                  username: u.username,
                  bio: u.bio,
                  createdAt: u.createdAt,
                })
              }
            />
          )}
          {selected && poemCommentsLoaded && (
            <div style={{ marginTop: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{ flex: 1, height: 1, background: `${WARM_BORDER}` }}
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: WARM_GOLD,
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Reflections
                </span>
                <div
                  style={{ flex: 1, height: 1, background: `${WARM_BORDER}` }}
                />
              </div>
              <CommentThread
                postId={String(selected.id)}
                currentUser={currentUser}
                comments={poemComments}
                onAddComment={handlePoemAddComment}
                onAddReply={handlePoemAddReply}
                onDeleteComment={handlePoemDeleteComment}
                onDeleteReply={handlePoemDeleteReply}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
