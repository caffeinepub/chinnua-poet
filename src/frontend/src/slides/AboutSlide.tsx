import { Check, Edit2, Mail, Pencil, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiX, SiYoutube } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const PERSONAL_STORY = `I was born with a cleft lip and palate. As the years passed, surgeries became a part of my childhood—four operations before I even turned five. My body healed in time, but my voice became something people noticed in ways that hurt. School life was never easy. Many people humiliated me because of how I sounded, and sometimes that pain came even from within my own family. I think that is where my shyness began—or maybe it only deepened what already existed within me.

My parents have been the greatest support of my life. Without them, I don't know where I would be. Still, the humiliation and loneliness became too heavy at times. I tried to end my life more than once. The first time, I was only seven years old. Writing this now is not easy, but it is the truth of my journey.

Crowds make me anxious. I stay quiet, withdrawn, unsure of myself. Over time, life taught me a hard lesson—that for people with physical or mental struggles, survival is more difficult. The world often supports only those who look "normal," who sound "normal," who appear successful or wealthy. People rarely try to understand what someone else is going through. Though, I must say—there are good people too, even if they are fewer and quieter.

I never spoke much about my pain. No one really tried to understand; everyone was ready with advice instead. What I needed was to be heard—but that never came. So, to heal myself, to express my emotions, thoughts, and pain, I began writing poetry. Poetry was not a choice for me—it was the only way left.

When I started writing, my parents asked me to stop. They believed poetry would interfere with my studies. But I couldn't stop. Because if I stopped writing, I would lose myself completely.

When my friends read my poems, they encouraged me to share them on Instagram—to create a poetic space, to connect with people who carried different stories and different struggles. That is how I began sharing my words with the world.

Today, I am 18 years old. Life has taught me many lessons—through suffering, through experience, and through the people I've met along the way. I am still learning. I think I always will be.

This is my story—imperfect, unfinished, but mine.

Thank you for listening to me with such care.`;

const STORY_PARAGRAPHS = PERSONAL_STORY.split("\n\n");

const POETIC_LINES = [
  "Not every poet is meant to be known…\nsome are only meant to be felt.",
  "I am not here to be seen,\nI am here to be understood—\nand even that is rare.",
  "I write what silence cannot hold anymore,\nwhat the heart hides behind calm eyes,\nwhat the world often ignores… yet feels.",
  "These words are not just poetry,\nthey are fragments of moments,\nof pain, of longing, of unanswered questions.",
  "If you find yourself in my lines,\nthen maybe…\nwe have suffered the same silence.",
  "And if you don't—\nthen perhaps,\nyou were never meant to.",
];

const DEAR_UNIVERSE = `Dear Universe,

Today I begin a new journey.
Not because my life is new, but because this path no longer has you in it.
And that makes it new in its own way.

From today onward, I choose to create a better version of myself—
not for anyone else, not to prove anything,
but only for me.

I accept my past, every experience it gave me,
every lesson it forced me to learn.
Now I am planning a future that feels secure, honest, and mine.
I will repay all the kindness I have received—
especially to nature,
which listened silently to my stories,
my pain,
and every situation I survived.

I am deeply thankful to those who truly supported me,
who genuinely cared about me.
They are rare, and they are worth everything.

In my life now, there is no space for forgiveness or love
for those who chose to hurt me intentionally.
Protecting my peace is not cruelty—
it is self-respect.

I wish no harm to anyone.
I only wish to live my life fulfilling my dreams,
without becoming the reason for someone else's pain.

Sometimes I wonder if I am a good person.
Some say I am kind, pure, and genuine.
Others call me selfish.
Maybe I am selfish—
especially when I want to return the pain
that was given to me without mercy,
or when my emotions overflow beyond control.

But I know one thing:
I listen to my heart.
I never hurt anyone without reason.
If I can help, I try to help.
I notice pain in people's eyes,
even when my own eyes are tired of crying.

Someone once told me,
"You are the purest soul I have ever met—
someone who never hesitates to help,
who still cares for others
even after being hurt."
And then they said,
"But you know yourself better than anyone."

Yes. I do.

Thank you, Universe,
for everything that happened in my life—
the good, the painful,
and the lessons that shaped who I am becoming.

🌿✨`;

const LAST_GOODBYE = `This is my last message for you.
It's really true — I love you so much, more than anything else.
Even after you broke up with me, my heart broke into pieces, and it will never be like it was before.

You know, I planned so many things about our future, but I didn't realize that you never loved me at all.
I know that is not your fault.
It is only and only my fault — for falling in love with you.
Everything I lost, I can't get back.
But the thing which is in my hand is my life.
My life is in my hand, as everyone's is.

From today I take back all my divine energies,
and I take back all my prayers with God,
where I mentioned you — with wishes for your successful life and safety.

I hope you find a good partner.
I hope you are happy.
May God bless you with love and a successful journey.

Goodbye.`;

const WHAT_SCARES_ME = `You know what scares me the most?
My future.

I'm scared of losing my goals, my dreams, my purpose.
Because the truth is, the only things that make me feel alive are my career, my dreams, and my poetry.

That's why I don't want anyone to come in between all of this—
because I want to support my parents.
I want to give them everything they deserve.
I want to repay them for giving me such a beautiful life.

No matter what, my mother has fought for me every single day since I was born.
She might be strict with me, but she loves me the most.

I'm always scared of that day when she won't be with me anymore.
When I see tears in her eyes, I just can't handle it.

Sometimes it makes me question everything—
why life has been so unfair to her,
why my grandparents didn't treat her well.

She is the reason I am alive in every moment.
I love my mother so much.

I want to give her everything.
I want to see her happy in every moment of her life.
She is the one who makes my life so beautiful.
I want her to know that I'm so proud to be her daughter.

No matter what happens, I will always be there for her.
Maybe I'm not a perfect daughter,
maybe I'm not the best…

But I'm trying every single day
to become a better daughter. 💫`;

const ON_BIRTHDAYS = `Every year, my birthday becomes the worst day of all my past years.
It doesn't feel important to remember anymore.

Maybe if I had celebrated my first birthday—or any birthday before—those moments might have felt special.

It's a day I wait for all year.
But when it finally arrives, it turns into the worst day.
It never becomes a day where I can truly smile with joy from my heart.

Instead, it's a day when I cry a lot—
for being in a world where no one remembers, celebrates, or even wishes me.`;

const toggleStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid rgba(212,168,83,0.3)",
  borderRadius: 8,
  color: "rgba(212,168,83,0.85)",
  fontFamily: "'Libre Baskerville', Georgia, serif",
  fontSize: "0.85rem",
  cursor: "pointer",
  padding: "0.5rem 1rem",
  transition: "all 0.2s",
  marginTop: "1rem",
};

const personalWritingStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontStyle: "italic",
  color: "rgba(61,43,31,0.6)",
  lineHeight: 1.9,
  fontSize: "0.92rem",
  whiteSpace: "pre-line",
  marginTop: "1rem",
  marginBottom: "0.5rem",
};

export default function AboutSlide() {
  const [storyOpen, setStoryOpen] = useState(false);
  const [universeOpen, setUniverseOpen] = useState(false);
  const [goodbyeOpen, setGoodbyeOpen] = useState(false);
  const [scareOpen, setScareOpen] = useState(false);
  const [birthdayOpen, setBirthdayOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [poetsNote, setPoetsNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  // About section editing
  const { actor } = useActor();
  const [aboutEditing, setAboutEditing] = useState(false);
  const [aboutFields, setAboutFields] = useState({
    poetName: "CHINNUA_POET",
    bio: "Chinnua is a poet and storyteller whose words dance between worlds.",
    story:
      "With a gift for transforming ordinary moments into extraordinary verse, Chinnua's poetry explores the depth of human emotion, the beauty of nature, and the quiet power of silence.",
    poetryFragments: "",
  });

  useEffect(() => {
    if (!actor || typeof (actor as any).get_about_content !== "function")
      return;
    (actor as any)
      .get_about_content()
      .then((data: any) => {
        if (data) {
          setAboutFields((prev) => ({
            poetName: data.poetName || prev.poetName,
            bio: data.bio || prev.bio,
            story: data.story || prev.story,
            poetryFragments: data.poetryFragments || prev.poetryFragments,
          }));
        }
      })
      .catch(() => {});
  }, [actor]);

  const saveAboutContent = async () => {
    if (!actor) return;
    try {
      await (actor as any).saveAboutContent(
        aboutFields.poetName,
        aboutFields.bio,
        aboutFields.story,
        aboutFields.poetryFragments,
      );
      setAboutEditing(false);
      toast.success("About section updated");
    } catch {
      toast.error("Failed to save");
    }
  };

  useEffect(() => {
    // Check if admin is currently authenticated
    const adminAuthed = localStorage.getItem("chinnua_admin_authed") === "true";
    setIsAdmin(adminAuthed);

    // Load saved poet's note
    const savedNote = localStorage.getItem("chinnua_poets_note") || "";
    setPoetsNote(savedNote);
  }, []);

  const startEdit = () => {
    setEditValue(poetsNote);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditValue("");
  };

  const saveNote = () => {
    const trimmed = editValue.trim();
    // Check if this is a new/changed note (not just whitespace edit of same content)
    const prevNote = localStorage.getItem("chinnua_poets_note") || "";
    const isNewContent = trimmed !== prevNote.trim();

    localStorage.setItem("chinnua_poets_note", trimmed);

    // Only reset the 24h timer if the content actually changed
    if (isNewContent && trimmed) {
      localStorage.setItem(
        "chinnua_poets_note_saved_at",
        Date.now().toString(),
      );
      // Clear the "already posted to feed" flag so the new note can be posted
      localStorage.removeItem("chinnua_poets_note_feed_posted");
    }

    setPoetsNote(trimmed);
    setEditing(false);
    toast.success("Poet's Note saved");
  };

  return (
    <div
      className="slide-container"
      style={{ overflowY: "auto", paddingBottom: "3rem" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.6rem",
              color: "#3D2B1F",
              fontWeight: 700,
              margin: 0,
            }}
          >
            About the Poet
          </h2>
          {isAdmin && !aboutEditing && (
            <button
              type="button"
              onClick={() => setAboutEditing(true)}
              data-ocid="about.edit_button"
              title="Edit About Section"
              style={{
                background: "rgba(212,168,83,0.1)",
                border: "1px solid rgba(212,168,83,0.3)",
                borderRadius: 7,
                padding: "0.3rem 0.7rem",
                color: "rgba(212,168,83,0.8)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.75rem",
                transition: "all 0.2s",
              }}
            >
              <Edit2 size={12} /> Edit About
            </button>
          )}
        </div>

        {/* ── About Edit Modal ── */}
        {aboutEditing && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#F5ECD7",
              border: "1px solid rgba(212,168,83,0.25)",
              borderRadius: 12,
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#D4A853",
                margin: "0 0 1rem",
                fontSize: "1rem",
              }}
            >
              ✍️ Edit About Section
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  htmlFor="about-poet-name"
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.75rem",
                    color: "rgba(212,168,83,0.6)",
                    display: "block",
                    marginBottom: "0.3rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Poet Name
                </label>
                <input
                  id="about-poet-name"
                  value={aboutFields.poetName}
                  onChange={(e) =>
                    setAboutFields((p) => ({ ...p, poetName: e.target.value }))
                  }
                  data-ocid="about.input"
                  style={{
                    width: "100%",
                    background: "rgba(139,111,71,0.08)",
                    border: "1px solid rgba(212,168,83,0.2)",
                    borderRadius: 7,
                    padding: "0.6rem 0.8rem",
                    color: "#3D2B1F",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="about-bio"
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.75rem",
                    color: "rgba(212,168,83,0.6)",
                    display: "block",
                    marginBottom: "0.3rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Bio / Short Description
                </label>
                <textarea
                  id="about-bio"
                  value={aboutFields.bio}
                  onChange={(e) =>
                    setAboutFields((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={3}
                  data-ocid="about.textarea"
                  style={{
                    width: "100%",
                    background: "rgba(139,111,71,0.08)",
                    border: "1px solid rgba(212,168,83,0.2)",
                    borderRadius: 7,
                    padding: "0.6rem 0.8rem",
                    color: "#3D2B1F",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="about-story"
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.75rem",
                    color: "rgba(212,168,83,0.6)",
                    display: "block",
                    marginBottom: "0.3rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Personal Story
                </label>
                <textarea
                  id="about-story"
                  value={aboutFields.story}
                  onChange={(e) =>
                    setAboutFields((p) => ({ ...p, story: e.target.value }))
                  }
                  rows={6}
                  data-ocid="about.textarea"
                  style={{
                    width: "100%",
                    background: "rgba(139,111,71,0.08)",
                    border: "1px solid rgba(212,168,83,0.2)",
                    borderRadius: 7,
                    padding: "0.6rem 0.8rem",
                    color: "#3D2B1F",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="about-fragments"
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.75rem",
                    color: "rgba(212,168,83,0.6)",
                    display: "block",
                    marginBottom: "0.3rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Poetry Fragments
                </label>
                <textarea
                  id="about-fragments"
                  value={aboutFields.poetryFragments}
                  onChange={(e) =>
                    setAboutFields((p) => ({
                      ...p,
                      poetryFragments: e.target.value,
                    }))
                  }
                  rows={4}
                  data-ocid="about.textarea"
                  style={{
                    width: "100%",
                    background: "rgba(139,111,71,0.08)",
                    border: "1px solid rgba(212,168,83,0.2)",
                    borderRadius: 7,
                    padding: "0.6rem 0.8rem",
                    color: "#3D2B1F",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={saveAboutContent}
                  data-ocid="about.save_button"
                  style={{
                    background: "#D4A853",
                    border: "none",
                    borderRadius: 7,
                    padding: "0.55rem 1.2rem",
                    color: "#1A1410",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setAboutEditing(false)}
                  data-ocid="about.cancel_button"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(139,111,71,0.2)",
                    borderRadius: 7,
                    padding: "0.55rem 1rem",
                    color: "rgba(61,43,31,0.5)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ flexShrink: 0 }}
          >
            <div
              style={{
                width: 200,
                height: 260,
                overflow: "hidden",
                borderRadius: 12,
                border: "2px solid rgba(212,168,83,0.4)",
                boxShadow: "0 0 30px rgba(212,168,83,0.2)",
              }}
            >
              <img
                src="/assets/uploads/chatgpt_image_mar_27_2026_05_29_47_pm-019d334d-3cb3-70a1-9f7f-ccdf89ed6a6d-1.png"
                alt="Chinnua"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[
                { label: "Genre", value: "Contemporary Lyric Poetry" },
                { label: "Based In", value: "India" },
                { label: "Language", value: "English" },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.7rem",
                      color: "rgba(212,168,83,0.7)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.85rem",
                      color: "rgba(61,43,31,0.55)",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#3D2B1F",
                marginBottom: "0.25rem",
              }}
            >
              CHINNUA
            </h3>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                color: "rgba(212,168,83,0.8)",
                fontSize: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              "I exist… but not everyone gets to see me."
            </p>

            {aboutFields.bio.split("\n\n").map((para, i) => {
              const parts = aboutFields.bio.split("\n\n");
              return (
                <p
                  key={para.slice(0, 20) || String(i)}
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "rgba(61,43,31,0.75)",
                    lineHeight: 1.9,
                    fontSize: "0.95rem",
                    marginBottom:
                      i === parts.length - 1 ? "1.75rem" : "0.75rem",
                  }}
                >
                  {para}
                </p>
              );
            })}

            {/* Poetic lines block */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                borderLeft: "2px solid rgba(212,168,83,0.3)",
                paddingLeft: "1.25rem",
                marginBottom: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
              }}
            >
              {POETIC_LINES.map((stanza) => (
                <p
                  key={stanza.slice(0, 20)}
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    color: "rgba(212,168,83,0.7)",
                    fontSize: "0.92rem",
                    lineHeight: 1.85,
                    whiteSpace: "pre-line",
                    margin: 0,
                  }}
                >
                  {stanza}
                </p>
              ))}
            </motion.div>

            {/* Story toggle */}
            <button
              type="button"
              onClick={() => setStoryOpen(!storyOpen)}
              data-ocid="about.toggle"
              style={toggleStyle}
            >
              {storyOpen ? "Hide My Story" : "My Story — In My Own Voice"}
            </button>
            {storyOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginBottom: "1.5rem" }}
              >
                {STORY_PARAGRAPHS.map((para) => (
                  <p
                    key={para.slice(0, 30)}
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "rgba(61,43,31,0.6)",
                      lineHeight: 1.9,
                      fontSize: "0.92rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </motion.div>
            )}

            {/* Social links */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginTop: "1.5rem",
              }}
            >
              <h4
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.75rem",
                  color: "rgba(61,43,31,0.4)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                Connect
              </h4>
              {[
                {
                  Icon: SiYoutube,
                  href: "https://www.youtube.com/@ChinnuaPoetofficial",
                  label: "@ChinnuaPoetofficial",
                },
                {
                  Icon: SiX,
                  href: "https://x.com/CHINNUA_POET",
                  label: "@CHINNUA_POET",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="about.link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    color: "rgba(61,43,31,0.55)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  <Icon size={16} /> {label}
                </a>
              ))}
              <a
                href="mailto:anoldpoet07@gmail.com"
                data-ocid="about.link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  color: "rgba(61,43,31,0.55)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.88rem",
                  textDecoration: "none",
                }}
              >
                <Mail size={16} /> anoldpoet07@gmail.com
              </a>
            </div>

            {/* Poet's Note */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(212,168,83,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.68rem",
                    color: "rgba(212,168,83,0.5)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontVariant: "small-caps",
                    margin: 0,
                  }}
                >
                  Poet's Note
                </p>
                {isAdmin && !editing && (
                  <button
                    type="button"
                    onClick={startEdit}
                    title="Edit Poet's Note"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(212,168,83,0.5)",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(212,168,83,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(212,168,83,0.5)";
                    }}
                  >
                    <Pencil size={13} />
                  </button>
                )}
              </div>

              {editing ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Write a note to your readers…"
                    rows={5}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(212,168,83,0.3)",
                      borderRadius: 8,
                      padding: "0.75rem",
                      color: "#3D2B1F",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "0.88rem",
                      lineHeight: 1.7,
                      resize: "vertical",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={saveNote}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        background: "rgba(212,168,83,0.2)",
                        border: "1px solid rgba(212,168,83,0.4)",
                        borderRadius: 6,
                        color: "rgba(212,168,83,0.9)",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.8rem",
                        padding: "0.35rem 0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      <Check size={13} /> Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        background: "none",
                        border: "1px solid rgba(229,231,235,0.15)",
                        borderRadius: 6,
                        color: "rgba(61,43,31,0.4)",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.8rem",
                        padding: "0.35rem 0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      <X size={13} /> Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    color: poetsNote ? "rgba(61,43,31,0.65)" : "#8B6F47",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                    whiteSpace: "pre-line",
                  }}
                >
                  {poetsNote || "No note from the poet yet."}
                </p>
              )}
            </div>

            {/* === New Personal Writings === */}

            {/* Dear Universe */}
            <button
              type="button"
              onClick={() => setUniverseOpen(!universeOpen)}
              data-ocid="about.toggle"
              style={toggleStyle}
            >
              {universeOpen ? "Close" : "Dear Universe — A Letter"}
            </button>
            {universeOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p style={personalWritingStyle}>{DEAR_UNIVERSE}</p>
              </motion.div>
            )}

            {/* A Last Goodbye */}
            <button
              type="button"
              onClick={() => setGoodbyeOpen(!goodbyeOpen)}
              data-ocid="about.toggle"
              style={toggleStyle}
            >
              {goodbyeOpen ? "Close" : "A Last Goodbye — Unsent Letter"}
            </button>
            {goodbyeOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p style={personalWritingStyle}>{LAST_GOODBYE}</p>
              </motion.div>
            )}

            {/* What Scares Me Most */}
            <button
              type="button"
              onClick={() => setScareOpen(!scareOpen)}
              data-ocid="about.toggle"
              style={toggleStyle}
            >
              {scareOpen ? "Close" : "What Scares Me Most"}
            </button>
            {scareOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p style={personalWritingStyle}>{WHAT_SCARES_ME}</p>
              </motion.div>
            )}

            {/* On Birthdays */}
            <button
              type="button"
              onClick={() => setBirthdayOpen(!birthdayOpen)}
              data-ocid="about.toggle"
              style={toggleStyle}
            >
              {birthdayOpen ? "Close" : "On Birthdays"}
            </button>
            {birthdayOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p style={personalWritingStyle}>{ON_BIRTHDAYS}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
