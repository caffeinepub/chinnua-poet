import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { AdminPoem } from "../backend";
import { useActor } from "../hooks/useActor";

const SESSION_KEY = "chinnua_admin_authed";
const ANNOUNCEMENT_KEY = "chinnua_announcement";

const CATEGORIES = ["Sad", "Romantic", "Love", "Life", "Nature", "Other"];

type Tab = "poems" | "settings" | "rules";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  onPoemsChanged: () => void;
}

export function AdminPanel({ open, onClose, onPoemsChanged }: AdminPanelProps) {
  const { actor } = useActor();
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [checkingPw, setCheckingPw] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("poems");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sad");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  const [poems, setPoems] = useState<AdminPoem[]>([]);
  const [loadingPoems, setLoadingPoems] = useState(false);

  // Edit state
  const [editingPoem, setEditingPoem] = useState<AdminPoem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Sad");
  const [editContent, setEditContent] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editMsg, setEditMsg] = useState("");

  // Delete state
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  // Change password state
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [changePwMsg, setChangePwMsg] = useState("");
  const [changePwError, setChangePwError] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  // Announcement state
  const [announcement, setAnnouncement] = useState(
    () => localStorage.getItem(ANNOUNCEMENT_KEY) ?? "",
  );
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  const fetchPoems = async () => {
    if (!actor) return;
    setLoadingPoems(true);
    try {
      const result = await actor.getAdminPoems();
      setPoems(result);
    } catch {
      // ignore
    } finally {
      setLoadingPoems(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchPoems is stable
  useEffect(() => {
    if (open && authed && actor) {
      fetchPoems();
    }
  }, [open, authed, actor]);

  const handleLogin = async () => {
    if (!actor) return;
    setCheckingPw(true);
    setPwError(false);
    try {
      const storedPw = await actor.getAdminPassword();
      if (pwInput === storedPw) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setAuthed(true);
      } else {
        setPwError(true);
      }
    } catch {
      setPwError(true);
    } finally {
      setCheckingPw(false);
    }
  };

  const handleChangePassword = async () => {
    if (!actor) return;
    setChangePwMsg("");
    setChangePwError("");
    if (newPw.length < 6) {
      setChangePwError("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setChangePwError("Passwords do not match.");
      return;
    }
    setSavingPw(true);
    try {
      const result = await actor.changeAdminPassword(currentPw, newPw);
      if (result.__kind__ === "success") {
        setChangePwMsg("Password changed! It now works on every browser.");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setTimeout(() => setShowChangePw(false), 2000);
      } else if (result.__kind__ === "incorrectPassword") {
        setChangePwError("Current password is incorrect.");
      } else {
        setChangePwError("New password must be at least 6 characters.");
      }
    } catch {
      setChangePwError("Failed to save. Try again.");
    } finally {
      setSavingPw(false);
    }
  };

  const handleSaveAnnouncement = () => {
    localStorage.setItem(ANNOUNCEMENT_KEY, announcement);
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !title.trim() || !content.trim()) return;
    setSubmitting(true);
    setSubmitMsg("");
    try {
      const result = await actor.addAdminPoem(
        title.trim(),
        content.trim(),
        category,
      );
      if (result.__kind__ === "success") {
        setSubmitMsg("Poem added successfully!");
        setTitle("");
        setContent("");
        setCategory("Sad");
        await fetchPoems();
        onPoemsChanged();
      } else {
        setSubmitMsg(`Error: ${result.__kind__}`);
      }
    } catch {
      setSubmitMsg("Failed to add poem. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (poem: AdminPoem) => {
    setEditingPoem(poem);
    setEditTitle(poem.title);
    setEditCategory(poem.category);
    setEditContent(poem.content);
    setEditMsg("");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !editingPoem || !editTitle.trim() || !editContent.trim())
      return;
    setEditSubmitting(true);
    setEditMsg("");
    try {
      const result = await actor.updateAdminPoem(
        editingPoem.id,
        editTitle.trim(),
        editContent.trim(),
        editCategory,
      );
      if (result.__kind__ === "success") {
        setEditMsg("Poem updated!");
        await fetchPoems();
        onPoemsChanged();
        setTimeout(() => setEditingPoem(null), 1000);
      } else {
        setEditMsg(`Error: ${result.__kind__}`);
      }
    } catch {
      setEditMsg("Failed to update. Try again.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    setDeletingId(id);
    try {
      await actor.deleteAdminPoem(id);
      await fetchPoems();
      onPoemsChanged();
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  if (!open) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "poems", label: "Poems" },
    { id: "settings", label: "Settings" },
    { id: "rules", label: "Rules" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "oklch(0 0 0 / 0.85)" }}
        >
          {/* Edit Modal — always on top */}
          <AnimatePresence>
            {editingPoem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center p-4"
                style={{ background: "oklch(0 0 0 / 0.7)" }}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[oklch(0.09_0.008_55)] border border-[oklch(0.72_0.09_75/0.6)]"
                >
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75)] to-transparent" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                        Edit Poem
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingPoem(null)}
                        className="p-1 text-muted-foreground hover:text-gold transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <form
                      onSubmit={handleEditSave}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                          Title
                        </span>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Poem title…"
                          required
                          className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                          Category
                        </span>
                        <Select
                          value={editCategory}
                          onValueChange={setEditCategory}
                        >
                          <SelectTrigger className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[oklch(0.09_0.008_55)] border-[oklch(0.22_0.02_60/0.5)]">
                            {CATEGORIES.map((cat) => (
                              <SelectItem
                                key={cat}
                                value={cat}
                                className="font-lora text-sm"
                              >
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                          Poem
                        </span>
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          placeholder="Write your poem here…"
                          required
                          rows={10}
                          className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm leading-loose resize-none"
                        />
                      </div>
                      {editMsg && (
                        <p
                          className={`font-lora text-sm italic ${editMsg.startsWith("Poem updated") ? "text-green-400" : "text-red-400"}`}
                        >
                          {editMsg}
                        </p>
                      )}
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={editSubmitting || !actor}
                          className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] uppercase px-6 py-2"
                        >
                          {editSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setEditingPoem(null)}
                          className="rounded-none bg-transparent border border-[oklch(0.22_0.02_60/0.5)] text-muted-foreground hover:text-foreground font-cinzel text-xs tracking-[0.15em] uppercase px-6 py-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[oklch(0.09_0.008_55)] border border-[oklch(0.72_0.09_75/0.4)]"
            data-ocid="admin.modal"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75)] to-transparent" />
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="font-cinzel text-[10px] tracking-[0.3em] text-gold uppercase">
                    Admin
                  </span>
                  <h2 className="font-cinzel text-2xl font-semibold text-foreground mt-1">
                    Control Panel
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-gold transition-colors"
                  data-ocid="admin.close_button"
                >
                  <X size={18} />
                </button>
              </div>

              {!authed ? (
                <div className="flex flex-col gap-4 max-w-sm">
                  <p className="font-lora text-sm text-muted-foreground italic">
                    Enter your admin password to continue.
                  </p>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={pwInput}
                    onChange={(e) => setPwInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm"
                    data-ocid="admin.input"
                  />
                  {pwError && (
                    <p
                      className="font-lora text-xs text-red-400"
                      data-ocid="admin.error_state"
                    >
                      Incorrect password.
                    </p>
                  )}
                  <Button
                    onClick={handleLogin}
                    disabled={checkingPw || !actor}
                    className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] uppercase"
                    data-ocid="admin.submit_button"
                  >
                    {checkingPw ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Unlock"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-0">
                  {/* Tab Bar */}
                  <div
                    className="flex border-b border-[oklch(0.22_0.02_60/0.5)] mb-8"
                    role="tablist"
                    data-ocid="admin.tab"
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        data-ocid={`admin.${tab.id}.tab`}
                        className={[
                          "font-cinzel text-[11px] tracking-[0.2em] uppercase px-5 py-3 relative transition-colors",
                          activeTab === tab.id
                            ? "text-[oklch(0.72_0.09_75)]"
                            : "text-muted-foreground hover:text-[oklch(0.72_0.09_75)]",
                        ].join(" ")}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[oklch(0.72_0.09_75)]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Poems Tab */}
                  {activeTab === "poems" && (
                    <div className="flex flex-col gap-10">
                      {/* Add Poem Form */}
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                      >
                        <h3 className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                          Add New Poem
                        </h3>
                        <div className="flex flex-col gap-1">
                          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                            Title
                          </span>
                          <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Poem title…"
                            required
                            className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm"
                            data-ocid="admin.input"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                            Category
                          </span>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger
                              className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm"
                              data-ocid="admin.select"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[oklch(0.09_0.008_55)] border-[oklch(0.22_0.02_60/0.5)]">
                              {CATEGORIES.map((cat) => (
                                <SelectItem
                                  key={cat}
                                  value={cat}
                                  className="font-lora text-sm"
                                >
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                            Poem
                          </span>
                          <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your poem here…"
                            required
                            rows={10}
                            className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm leading-loose resize-none"
                            data-ocid="admin.textarea"
                          />
                        </div>
                        {submitMsg && (
                          <p
                            className={`font-lora text-sm italic ${
                              submitMsg.startsWith("Poem added")
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                            data-ocid="admin.success_state"
                          >
                            {submitMsg}
                          </p>
                        )}
                        <Button
                          type="submit"
                          disabled={submitting || !actor}
                          className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] uppercase self-start px-8 py-3"
                          data-ocid="admin.submit_button"
                        >
                          {submitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          {submitting ? "Adding…" : "Add Poem"}
                        </Button>
                      </form>

                      {/* Poems List */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <h3 className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                            Your Added Poems
                          </h3>
                          <button
                            type="button"
                            onClick={fetchPoems}
                            className="font-cinzel text-[10px] tracking-widest text-muted-foreground hover:text-gold uppercase transition-colors"
                            data-ocid="admin.button"
                          >
                            Refresh
                          </button>
                        </div>
                        {loadingPoems ? (
                          <div
                            className="flex items-center gap-2 py-4"
                            data-ocid="admin.loading_state"
                          >
                            <Loader2 className="h-4 w-4 animate-spin text-gold" />
                            <span className="font-lora text-sm text-muted-foreground italic">
                              Loading poems…
                            </span>
                          </div>
                        ) : poems.length === 0 ? (
                          <p
                            className="font-lora text-sm text-muted-foreground italic py-4"
                            data-ocid="admin.empty_state"
                          >
                            No poems added yet.
                          </p>
                        ) : (
                          <div
                            className="flex flex-col gap-3"
                            data-ocid="admin.list"
                          >
                            {poems.map((poem, i) => (
                              <div
                                key={`admin-${poem.id}-${i}`}
                                className="p-4 border border-[oklch(0.22_0.02_60/0.4)] bg-[oklch(0.07_0.005_50)]"
                                data-ocid={`admin.item.${i + 1}`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <span className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase">
                                      {poem.category}
                                    </span>
                                    <p className="font-cinzel text-sm text-foreground mt-0.5">
                                      {poem.title}
                                    </p>
                                    <p className="font-lora text-xs text-muted-foreground italic mt-2 line-clamp-2">
                                      {poem.content
                                        .split("\n")
                                        .filter((l) => l.trim())[0] ?? ""}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 ml-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditOpen(poem)}
                                      className="p-1.5 text-muted-foreground hover:text-gold transition-colors"
                                      title="Edit poem"
                                      data-ocid={`admin.edit_button.${i + 1}`}
                                    >
                                      <Pencil size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(poem.id)}
                                      disabled={deletingId === poem.id}
                                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
                                      title="Delete poem"
                                      data-ocid={`admin.delete_button.${i + 1}`}
                                    >
                                      {deletingId === poem.id ? (
                                        <Loader2
                                          size={14}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Trash2 size={14} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === "settings" && (
                    <div className="flex flex-col gap-8">
                      {/* Change Password */}
                      <div className="flex flex-col gap-3">
                        <h3 className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                          Change Password
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setShowChangePw(!showChangePw);
                            setChangePwMsg("");
                            setChangePwError("");
                          }}
                          className="self-start font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase hover:opacity-70 transition-opacity"
                          data-ocid="admin.button"
                        >
                          {showChangePw ? "Hide" : "Update Password"}
                        </button>

                        {showChangePw && (
                          <div className="flex flex-col gap-3 max-w-sm p-4 border border-[oklch(0.22_0.02_60/0.4)] bg-[oklch(0.07_0.005_50)]">
                            <p className="font-lora text-xs text-muted-foreground italic">
                              Your new password will save to every browser and
                              device.
                            </p>
                            <Input
                              type="password"
                              placeholder="Current password"
                              value={currentPw}
                              onChange={(e) => setCurrentPw(e.target.value)}
                              className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.09_0.008_55)] font-lora text-sm"
                            />
                            <Input
                              type="password"
                              placeholder="New password (min 6 chars)"
                              value={newPw}
                              onChange={(e) => setNewPw(e.target.value)}
                              className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.09_0.008_55)] font-lora text-sm"
                            />
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              value={confirmPw}
                              onChange={(e) => setConfirmPw(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleChangePassword()
                              }
                              className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.09_0.008_55)] font-lora text-sm"
                            />
                            {changePwError && (
                              <p className="font-lora text-xs text-red-400 italic">
                                {changePwError}
                              </p>
                            )}
                            {changePwMsg && (
                              <p className="font-lora text-xs text-green-400 italic">
                                {changePwMsg}
                              </p>
                            )}
                            <Button
                              type="button"
                              onClick={handleChangePassword}
                              disabled={savingPw}
                              className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] uppercase self-start px-6 py-2"
                            >
                              {savingPw ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Save New Password"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Site Announcement */}
                      <div className="flex flex-col gap-3">
                        <h3 className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                          Site Announcement
                        </h3>
                        <p className="font-lora text-xs text-muted-foreground italic">
                          A short message shown to visitors. Saved to your
                          browser.
                        </p>
                        <Textarea
                          value={announcement}
                          onChange={(e) => setAnnouncement(e.target.value)}
                          placeholder="Write a short announcement for your visitors…"
                          rows={3}
                          className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm leading-relaxed resize-none max-w-sm"
                          data-ocid="admin.textarea"
                        />
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            onClick={handleSaveAnnouncement}
                            className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] uppercase self-start px-6 py-2"
                            data-ocid="admin.save_button"
                          >
                            Save
                          </Button>
                          {announcementSaved && (
                            <span
                              className="font-lora text-xs text-green-400 italic"
                              data-ocid="admin.success_state"
                            >
                              Saved!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rules Tab */}
                  {activeTab === "rules" && (
                    <div className="flex flex-col gap-4">
                      <h3 className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                        Rules &amp; Regulations
                      </h3>
                      <div className="p-5 border border-[oklch(0.22_0.02_60/0.4)] bg-[oklch(0.07_0.005_50)] flex flex-col gap-1">
                        <p className="font-cinzel text-sm tracking-[0.15em] text-gold uppercase mb-4">
                          CHINNUA_POET — Community Rules &amp; Regulations
                        </p>
                        <div className="h-3" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
