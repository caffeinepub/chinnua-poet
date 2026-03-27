import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { FeedPost } from "./FeedSection";

function loadPosts(): FeedPost[] {
  try {
    return JSON.parse(localStorage.getItem("chinnua_feed_v2") ?? "[]");
  } catch {
    return [];
  }
}

function savePosts(posts: FeedPost[]) {
  localStorage.setItem("chinnua_feed_v2", JSON.stringify(posts));
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  author: string;
  authorPrincipal: string;
}

export function ProfileModal({
  open,
  onClose,
  author,
  authorPrincipal,
}: ProfileModalProps) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const principalStr = identity?.getPrincipal().toString() ?? "";
  const isOwn = principalStr && principalStr === authorPrincipal;

  const bio = localStorage.getItem(`chinnua_bio_${authorPrincipal}`) ?? "";
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(author);
  const [editBio, setEditBio] = useState(bio);
  const [saving, setSaving] = useState(false);
  const [displayBio, setDisplayBio] = useState(bio);
  const [displayName, setDisplayName] = useState(author);

  useEffect(() => {
    if (open) {
      const b = localStorage.getItem(`chinnua_bio_${authorPrincipal}`) ?? "";
      const n =
        localStorage.getItem(`chinnua_displayname_${authorPrincipal}`) ??
        author;
      setDisplayBio(b);
      setDisplayName(n);
      setEditName(n);
      setEditBio(b);
    }
  }, [open, authorPrincipal, author]);

  const userPosts = loadPosts().filter(
    (p) => p.authorPrincipal === authorPrincipal,
  );

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      if (actor) {
        await actor.setDisplayName(editName.trim());
      }
      localStorage.setItem(
        `chinnua_displayname_${authorPrincipal}`,
        editName.trim(),
      );
      localStorage.setItem(`chinnua_bio_${authorPrincipal}`, editBio.trim());
      // Update posts in feed
      const allPosts = loadPosts();
      const updated = allPosts.map((p) =>
        p.authorPrincipal === authorPrincipal
          ? { ...p, author: editName.trim() }
          : p,
      );
      savePosts(updated);
      setDisplayName(editName.trim());
      setDisplayBio(editBio.trim());
      setEditMode(false);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg bg-[oklch(0.095_0.008_55)] border border-[oklch(0.22_0.02_60/0.5)] text-foreground rounded-none p-0 max-h-[90vh] overflow-y-auto"
        data-ocid="profile.modal"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75)] to-transparent" />
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
                Profile
              </DialogTitle>
              <div className="flex items-center gap-2">
                {isOwn && !editMode && (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="p-1.5 text-muted-foreground hover:text-gold transition-colors"
                    data-ocid="profile.edit_button"
                    aria-label="Edit profile"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                {editMode && (
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="p-1.5 text-muted-foreground hover:text-gold transition-colors"
                    aria-label="Cancel edit"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-[oklch(0.12_0.008_55)] border border-[oklch(0.22_0.02_60/0.6)] flex items-center justify-center flex-shrink-0">
              <span className="font-cinzel text-xl text-gold">
                {displayName[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <div className="flex-1">
              {editMode ? (
                <div className="flex flex-col gap-3">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Username"
                    className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm"
                    data-ocid="profile.input"
                  />
                  <Textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Bio…"
                    rows={2}
                    className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm resize-none"
                    data-ocid="profile.textarea"
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="self-start px-5 py-2 bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] font-cinzel text-xs tracking-[0.15em] uppercase hover:bg-[oklch(0.78_0.11_78)] transition-all flex items-center gap-2"
                    data-ocid="profile.save_button"
                  >
                    {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="font-cinzel text-base text-foreground tracking-wide">
                    {displayName}
                  </p>
                  {displayBio && (
                    <p className="font-lora text-sm text-muted-foreground italic mt-1 leading-relaxed">
                      {displayBio}
                    </p>
                  )}
                  <p className="font-cinzel text-[10px] tracking-widest text-[oklch(0.4_0.02_60)] mt-2 uppercase">
                    {userPosts.length} poem{userPosts.length !== 1 ? "s" : ""}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-[oklch(0.22_0.02_60/0.4)] pt-5">
            <p className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase mb-4">
              Posts
            </p>
            {userPosts.length === 0 ? (
              <p
                className="font-lora text-sm text-muted-foreground italic text-center py-8"
                data-ocid="profile.empty_state"
              >
                No poems posted yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
                {userPosts.slice(0, 10).map((post, idx) => (
                  <div
                    key={post.id}
                    className="border-b border-[oklch(0.22_0.02_60/0.3)] pb-4"
                    data-ocid={`profile.item.${idx + 1}`}
                  >
                    <p className="font-lora text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap line-clamp-4">
                      {post.content}
                    </p>
                    <p className="font-cinzel text-[10px] text-muted-foreground mt-2">
                      {timeAgo(post.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
