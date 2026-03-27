import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { CommunityPoem } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function suggestTheme(text: string): { name: string; description: string } {
  const t = text.toLowerCase();
  if (/sad|pain|hurt|cry|tear|broken|alone|dark/.test(t))
    return {
      name: "Moonlit Grief",
      description:
        "Your words carry the weight of quiet suffering. Write in dim candlelight.",
    };
  if (/romantic|kiss|touch|desire|night|embrace|candle/.test(t))
    return {
      name: "Burning Rose",
      description: "Passion and longing run through your lines. Write boldly.",
    };
  if (/life|journey|dream|future|hope|memory/.test(t))
    return {
      name: "Wandering Soul",
      description: "Your poetry seeks meaning in motion. Write freely.",
    };
  if (/nature|rain|sky|tree|flower|earth|moon|river/.test(t))
    return {
      name: "Earthsong",
      description: "You hear the world breathe. Write near a window.",
    };
  return {
    name: "Midnight Echo",
    description: "Your voice is mysterious and deep. Write in silence.",
  };
}

function CommunityPoemCard({
  poem,
  index,
  onClick,
}: {
  poem: CommunityPoem;
  index: number;
  onClick: () => void;
}) {
  const lines = poem.content
    .split("\n")
    .filter((l) => l.trim())
    .slice(0, 3);
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 9) * 0.06 }}
      className="group relative flex flex-col bg-[oklch(0.095_0.008_55)] border border-[oklch(0.22_0.02_60/0.4)] hover:border-[oklch(0.72_0.09_75/0.5)] transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_oklch(0.72_0.09_75/0.1)]"
      onClick={onClick}
      data-ocid={`community.item.${(index % 9) + 1}`}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75/0.6)] to-transparent group-hover:via-[oklch(0.72_0.09_75)] transition-all duration-300" />
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="inline-block font-cinzel text-[9px] tracking-[0.2em] text-[oklch(0.065_0.005_50)] bg-[oklch(0.72_0.09_75)] px-2 py-0.5 uppercase">
              {poem.suggestedTheme.name}
            </span>
            <h3 className="font-cinzel text-sm font-semibold text-foreground mt-2 group-hover:text-gold transition-colors">
              {poem.title}
            </h3>
          </div>
        </div>
        <p className="font-lora text-xs text-muted-foreground leading-relaxed flex-1 italic whitespace-pre-line">
          {lines.join("\n")}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-[oklch(0.22_0.02_60/0.3)]">
          <span className="font-cinzel text-[10px] tracking-widest text-gold">
            {poem.authorName}
          </span>
          <span className="font-cinzel text-[9px] tracking-widest text-muted-foreground uppercase">
            Read →
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function CommunityPoemModal({
  poem,
  onClose,
}: {
  poem: CommunityPoem | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!poem} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl bg-[oklch(0.095_0.008_55)] border border-[oklch(0.22_0.02_60/0.5)] text-foreground rounded-none p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
        data-ocid="community.modal"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75)] to-transparent" />
        <div className="p-8 sm:p-10">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block font-cinzel text-[9px] tracking-[0.2em] text-[oklch(0.065_0.005_50)] bg-[oklch(0.72_0.09_75)] px-2 py-0.5 uppercase">
                {poem?.suggestedTheme.name}
              </span>
            </div>
            <DialogTitle className="font-cinzel text-2xl sm:text-3xl font-semibold text-foreground">
              {poem?.title}
            </DialogTitle>
            <p className="font-lora text-xs text-muted-foreground mt-1 italic">
              by {poem?.authorName}
            </p>
            <div className="h-px mt-3 bg-gradient-to-r from-[oklch(0.72_0.09_75/0.4)] to-transparent" />
          </DialogHeader>
          <div className="font-lora text-base leading-[2] text-muted-foreground whitespace-pre-line italic">
            {poem?.content}
          </div>
          <div className="mt-8 p-4 border border-[oklch(0.72_0.09_75/0.3)] bg-[oklch(0.07_0.005_50/0.5)]">
            <p className="font-cinzel text-xs tracking-[0.2em] text-gold uppercase mb-1">
              {poem?.suggestedTheme.name}
            </p>
            <p className="font-lora text-xs text-muted-foreground italic">
              {poem?.suggestedTheme.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CommunitySection() {
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const [communityPoems, setCommunityPoems] = useState<CommunityPoem[]>([]);
  const [loadingPoems, setLoadingPoems] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [hasName, setHasName] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const [poemTitle, setPoemTitle] = useState("");
  const [poemContent, setPoemContent] = useState("");
  const [suggestedTheme, setSuggestedTheme] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [selectedPoem, setSelectedPoem] = useState<CommunityPoem | null>(null);

  const fetchCommunityPoems = async () => {
    if (!actor) return;
    setLoadingPoems(true);
    try {
      const result = await actor.getCommunityPoems();
      setCommunityPoems(result);
    } catch {
      // ignore
    } finally {
      setLoadingPoems(false);
    }
  };

  const fetchDisplayName = async () => {
    if (!actor || !identity) return;
    try {
      const name = await actor.getDisplayName(identity.getPrincipal());
      if (name) {
        setDisplayName(name);
        setHasName(true);
      }
    } catch {
      // ignore
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchCommunityPoems is stable
  useEffect(() => {
    if (actor) {
      fetchCommunityPoems();
    }
  }, [actor]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchDisplayName is stable
  useEffect(() => {
    if (actor && isLoggedIn) {
      fetchDisplayName();
    }
  }, [actor, isLoggedIn]);

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !displayNameInput.trim()) return;
    setSavingName(true);
    try {
      await actor.setDisplayName(displayNameInput.trim());
      setDisplayName(displayNameInput.trim());
      setHasName(true);
    } catch {
      // ignore
    } finally {
      setSavingName(false);
    }
  };

  const handleSuggestTheme = () => {
    const text = `${poemTitle} ${poemContent}`;
    setSuggestedTheme(suggestTheme(text));
  };

  const handleSubmitPoem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !poemTitle.trim() || !poemContent.trim() || !displayName)
      return;
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    try {
      const result = await actor.submitPoem(
        poemTitle.trim(),
        poemContent.trim(),
        displayName,
      );
      if (result.__kind__ === "success") {
        setSubmitSuccess(true);
        setPoemTitle("");
        setPoemContent("");
        setSuggestedTheme(null);
        await fetchCommunityPoems();
      } else {
        setSubmitError(`Could not submit: ${result.__kind__}`);
      }
    } catch {
      setSubmitError("Failed to submit poem. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="community"
      className="py-24 px-4 sm:px-8"
      style={{
        background: "#080806",
        borderTop: "1px solid rgba(200,169,106,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="font-cinzel text-xs tracking-[0.3em] text-gold uppercase">
            Open Voices
          </span>
          <h2 className="font-cinzel text-4xl sm:text-5xl font-semibold text-foreground mt-3 tracking-wide uppercase">
            Community
          </h2>
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
            <span className="font-lora text-xl italic text-gold opacity-60">
              ✦
            </span>
            <span className="h-px w-16 bg-[oklch(0.72_0.09_75/0.4)]" />
          </div>
          <p className="font-lora text-sm italic text-muted-foreground mt-5 max-w-lg mx-auto leading-relaxed">
            Every voice deserves a space. Share your poem with the world.
          </p>
        </motion.div>

        {/* Submit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-20"
        >
          {!isLoggedIn ? (
            <div
              className="text-center p-10 border border-[oklch(0.72_0.09_75/0.3)] bg-[oklch(0.09_0.008_55)]"
              data-ocid="community.panel"
            >
              <p className="font-lora text-sm italic text-muted-foreground mb-6">
                Sign in to share your poetry with the community.
              </p>
              <button
                type="button"
                onClick={login}
                className="font-cinzel text-xs tracking-widest text-gold uppercase border border-[oklch(0.72_0.09_75/0.45)] px-6 py-3 hover:bg-[oklch(0.72_0.09_75/0.07)] hover:border-[oklch(0.72_0.09_75/0.8)] transition-all"
                data-ocid="community.button"
              >
                Sign In to Share Your Poem
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col gap-8 p-8 border border-[oklch(0.72_0.09_75/0.3)] bg-[oklch(0.09_0.008_55)]"
              data-ocid="community.panel"
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75/0.6)] to-transparent" />
              <h3 className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                Share Your Poem
              </h3>

              {/* Display Name */}
              {!hasName ? (
                <form onSubmit={saveName} className="flex flex-col gap-3">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                    Your Display Name
                  </span>
                  <p className="font-lora text-xs text-muted-foreground italic">
                    This name will appear with your poems.
                  </p>
                  <div className="flex gap-0">
                    <Input
                      value={displayNameInput}
                      onChange={(e) => setDisplayNameInput(e.target.value)}
                      placeholder="Your pen name…"
                      required
                      className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm border-r-0"
                      data-ocid="community.input"
                    />
                    <Button
                      type="submit"
                      disabled={savingName}
                      className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-widest px-5 shrink-0"
                      data-ocid="community.save_button"
                    >
                      {savingName ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                    Writing as:
                  </span>
                  <span className="font-lora text-sm italic text-foreground">
                    {displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHasName(false)}
                    className="font-cinzel text-[10px] tracking-widest text-muted-foreground hover:text-gold uppercase transition-colors"
                    data-ocid="community.button"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Poem Form */}
              {hasName && (
                <form
                  onSubmit={handleSubmitPoem}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                      Poem Title
                    </span>
                    <Input
                      value={poemTitle}
                      onChange={(e) => setPoemTitle(e.target.value)}
                      placeholder="Give your poem a title…"
                      required
                      className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm"
                      data-ocid="community.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                      Your Poem
                    </span>
                    <Textarea
                      value={poemContent}
                      onChange={(e) => {
                        setPoemContent(e.target.value);
                        setSuggestedTheme(null);
                      }}
                      placeholder="Write your poem here…\n\nEvery word matters."
                      required
                      rows={10}
                      className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm leading-loose resize-none"
                      data-ocid="community.textarea"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSuggestTheme}
                    disabled={!poemContent.trim()}
                    className="self-start font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase border border-[oklch(0.72_0.09_75/0.4)] px-5 py-2.5 hover:bg-[oklch(0.72_0.09_75/0.08)] hover:border-[oklch(0.72_0.09_75/0.8)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    data-ocid="community.button"
                  >
                    ✦ Suggest My Theme
                  </button>

                  <AnimatePresence>
                    {suggestedTheme && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="p-5 border border-[oklch(0.72_0.09_75/0.5)] bg-[oklch(0.07_0.005_50/0.7)]"
                        data-ocid="community.panel"
                      >
                        <p className="font-cinzel text-xl text-gold tracking-wide">
                          {suggestedTheme.name}
                        </p>
                        <p className="font-lora text-sm italic text-muted-foreground mt-2">
                          {suggestedTheme.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {submitSuccess && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-lora text-sm italic text-green-400"
                      data-ocid="community.success_state"
                    >
                      Your poem has been shared with the world. ✦
                    </motion.p>
                  )}
                  {submitError && (
                    <p
                      className="font-lora text-sm italic text-red-400"
                      data-ocid="community.error_state"
                    >
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={
                      submitting || !poemContent.trim() || !poemTitle.trim()
                    }
                    className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] uppercase self-start px-8 py-3"
                    data-ocid="community.submit_button"
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {submitting ? "Sharing…" : "Share Poem"}
                  </Button>
                </form>
              )}
            </div>
          )}
        </motion.div>

        {/* Community Poems Gallery */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="font-cinzel text-2xl font-semibold text-foreground uppercase tracking-wide">
              Community Voices
            </h3>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="h-px w-12 bg-[oklch(0.72_0.09_75/0.4)]" />
              <span className="font-lora text-sm italic text-muted-foreground">
                Poems by our readers
              </span>
              <span className="h-px w-12 bg-[oklch(0.72_0.09_75/0.4)]" />
            </div>
          </motion.div>

          {loadingPoems ? (
            <div
              className="flex items-center justify-center py-16 gap-3"
              data-ocid="community.loading_state"
            >
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
              <span className="font-lora text-sm italic text-muted-foreground">
                Loading community poems…
              </span>
            </div>
          ) : communityPoems.length === 0 ? (
            <div
              className="text-center py-16"
              data-ocid="community.empty_state"
            >
              <p className="font-lora text-sm italic text-muted-foreground">
                No community poems yet. Be the first to share your words.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              data-ocid="community.list"
            >
              {communityPoems.map((poem, i) => (
                <CommunityPoemCard
                  key={poem.id.toString()}
                  poem={poem}
                  index={i}
                  onClick={() => setSelectedPoem(poem)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CommunityPoemModal
        poem={selectedPoem}
        onClose={() => setSelectedPoem(null)}
      />
    </section>
  );
}
