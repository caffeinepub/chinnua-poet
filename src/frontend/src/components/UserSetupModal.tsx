import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface UserSetupModalProps {
  open: boolean;
  onClose: (username: string) => void;
}

export function UserSetupModal({ open, onClose }: UserSetupModalProps) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    setSaving(true);
    setError("");
    const principalStr = identity?.getPrincipal().toString() ?? "";
    try {
      if (actor) {
        await actor.setDisplayName(username.trim());
      }
      localStorage.setItem(
        `chinnua_displayname_${principalStr}`,
        username.trim(),
      );
      localStorage.setItem(`chinnua_bio_${principalStr}`, bio.trim());
      onClose(username.trim());
    } catch {
      setError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-sm bg-[oklch(0.095_0.008_55)] border border-[oklch(0.72_0.09_75/0.4)] text-foreground rounded-none p-0"
        data-ocid="user_setup.dialog"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.09_75)] to-transparent" />
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="font-cinzel text-sm tracking-[0.2em] text-gold uppercase">
              Welcome, Poet
            </DialogTitle>
            <p className="font-lora text-sm text-muted-foreground italic mt-1">
              Choose a name before you write.
            </p>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="setup-username"
                className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase"
              >
                Username *
              </Label>
              <Input
                id="setup-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="your_poet_name"
                className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm focus-visible:ring-[oklch(0.72_0.09_75/0.5)]"
                data-ocid="user_setup.input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="setup-bio"
                className="font-cinzel text-[10px] tracking-[0.2em] text-gold uppercase"
              >
                Bio (optional)
              </Label>
              <Textarea
                id="setup-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A few words about you…"
                rows={3}
                className="rounded-none border-[oklch(0.22_0.02_60/0.5)] bg-[oklch(0.07_0.005_50)] font-lora text-sm resize-none focus-visible:ring-[oklch(0.72_0.09_75/0.5)]"
                data-ocid="user_setup.textarea"
              />
            </div>
            {error && (
              <p
                className="font-lora text-xs text-red-400 italic"
                data-ocid="user_setup.error_state"
              >
                {error}
              </p>
            )}
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-none bg-[oklch(0.72_0.09_75)] text-[oklch(0.065_0.005_50)] hover:bg-[oklch(0.78_0.11_78)] font-cinzel text-xs tracking-[0.15em] uppercase h-10"
              data-ocid="user_setup.submit_button"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Enter the Feed"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
