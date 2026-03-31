import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";
import InboxSlide from "./InboxSlide";

const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_MOCHA = "#5C3D2E";
const WARM_BROWN = "#8B6F47";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_BORDER = "rgba(139,111,71,0.25)";
const WARM_MUTED = "rgba(92,61,46,0.5)";

interface User {
  username: string;
  bio: string;
  createdAt: string;
}
interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: string;
}

type CallState = "idle" | "calling" | "receiving" | "active";
type CallType = "voice" | "video";
type MsgSection = "messages" | "inbox";

interface PendingSignal {
  id: string;
  from: string;
  type: "offer" | "answer" | "iceCandidate" | "hangup";
  data: string;
  timestamp: number;
}

function getUserAvatar(username: string): string | null {
  try {
    const p = localStorage.getItem(`chinnua_profile_${username}`);
    if (p) return JSON.parse(p)?.photo ?? null;
  } catch {}
  return null;
}

function AvatarBubble({
  username,
  size = 32,
}: { username: string; size?: number }) {
  const photo = getUserAvatar(username);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          username === "CHINNUA_POET"
            ? "rgba(212,168,83,0.2)"
            : "rgba(139,111,71,0.15)",
        border:
          username === "CHINNUA_POET"
            ? "1px solid rgba(212,168,83,0.5)"
            : `1px solid ${WARM_BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.34,
        fontWeight: 700,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt={username}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span
          style={{
            color: username === "CHINNUA_POET" ? WARM_GOLD : WARM_BROWN,
          }}
        >
          {username.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function pushSignal(toUsername: string, signal: PendingSignal) {
  const key = `webrtc_signals_${toUsername}`;
  const existing: PendingSignal[] = JSON.parse(
    localStorage.getItem(key) || "[]",
  );
  existing.push(signal);
  localStorage.setItem(key, JSON.stringify(existing));
}

function consumeSignals(myUsername: string): PendingSignal[] {
  const key = `webrtc_signals_${myUsername}`;
  const signals: PendingSignal[] = JSON.parse(
    localStorage.getItem(key) || "[]",
  );
  localStorage.removeItem(key);
  return signals;
}

// Phone SVG icon
function PhoneIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Phone"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.59 4.18 2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function VideoIcon({
  size = 16,
  color = WARM_BROWN,
}: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Video"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function MicIcon({ muted, size = 16 }: { muted: boolean; size?: number }) {
  const color = muted ? "#ef4444" : WARM_BROWN;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Microphone"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

export default function MessagesSlide({
  currentUser,
  onJoin,
  onLogin,
}: { currentUser: User | null; onJoin: () => void; onLogin?: () => void }) {
  const { actor } = useActor();
  const [section, setSection] = useState<MsgSection>("messages");
  const [conversations, setConversations] = useState<string[]>([
    "CHINNUA_POET",
  ]);
  const [activeConv, setActiveConv] = useState("CHINNUA_POET");
  const [msgTab, setMsgTab] = useState<"inbox" | "requests">("inbox");
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("chinnua_blocked_users") || "[]");
    } catch {
      return [];
    }
  });
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const [callState, setCallState] = useState<CallState>("idle");
  const [callType, setCallType] = useState<CallType>("voice");
  const [callPeer, setCallPeer] = useState<string | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const backendPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load localStorage messages on mount
  useEffect(() => {
    const stored: Record<string, Message[]> = JSON.parse(
      localStorage.getItem("chinnua_messages") || "{}",
    );
    setMessages(stored);
    const keys = Object.keys(stored).filter((k) => k !== "CHINNUA_POET");
    setConversations(["CHINNUA_POET", ...keys]);
  }, []);

  // Load + poll backend messages for active conversation
  useEffect(() => {
    if (!actor || !currentUser) return;

    const loadConv = async () => {
      try {
        const backendMsgs = await (actor as any).getConversationByUsername(
          currentUser.username,
          activeConv,
        );
        if (backendMsgs.length === 0) return;

        const mapped: Message[] = backendMsgs.map((m) => ({
          id: m.id.toString(),
          from: m.fromUsername,
          text: m.text,
          timestamp: new Date(Number(m.timestamp / 1_000_000n)).toISOString(),
        }));

        setMessages((prev) => {
          const existing = prev[activeConv] ?? [];
          const existingIds = new Set(existing.map((m) => m.id));
          const newOnes = mapped.filter((m) => !existingIds.has(m.id));
          if (newOnes.length === 0) return prev;
          const merged = [...existing, ...newOnes].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );
          const updated = { ...prev, [activeConv]: merged };
          localStorage.setItem("chinnua_messages", JSON.stringify(updated));
          return updated;
        });

        // Ensure conversation appears in list
        setConversations((prev) =>
          prev.includes(activeConv)
            ? prev
            : [
                "CHINNUA_POET",
                activeConv,
                ...prev.filter((c) => c !== "CHINNUA_POET" && c !== activeConv),
              ],
        );

        // Mark messages as read
        for (const m of backendMsgs) {
          if (!m.read && m.toUsername === currentUser.username) {
            (actor as any).markDirectMessageRead(m.id).catch(() => {});
          }
        }
      } catch {}
    };

    loadConv();
    backendPollRef.current = setInterval(loadConv, 5000);
    return () => {
      if (backendPollRef.current) clearInterval(backendPollRef.current);
    };
  }, [actor, currentUser, activeConv]);

  // Also load all conversations from backend to populate sidebar
  useEffect(() => {
    if (!actor || !currentUser) return;
    const loadAll = async () => {
      try {
        const all = await (actor as any).getMessagesForUser(
          currentUser.username,
        );
        const peers = new Set<string>();
        for (const m of all) {
          const other =
            m.fromUsername === currentUser.username
              ? m.toUsername
              : m.fromUsername;
          peers.add(other);
        }
        setConversations((prev) => {
          const combined = [
            "CHINNUA_POET",
            ...Array.from(peers).filter((p) => p !== "CHINNUA_POET"),
            ...prev.filter((p) => p !== "CHINNUA_POET" && !peers.has(p)),
          ];
          return [...new Set(combined)];
        });
      } catch {}
    };
    loadAll();
  }, [actor, currentUser]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConv]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });
    pc.onicecandidate = (e) => {
      if (e.candidate && callPeer && currentUser) {
        pushSignal(callPeer, {
          id: `sig_${Date.now()}_${Math.random()}`,
          from: currentUser.username,
          type: "iceCandidate",
          data: JSON.stringify(e.candidate),
          timestamp: Date.now(),
        });
      }
    };
    pc.ontrack = (e) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = e.streams[0];
    };
    return pc;
  }, [callPeer, currentUser]);

  const stopCall = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getTracks()) t.stop();
      localStreamRef.current = null;
    }
    pcRef.current?.close();
    pcRef.current = null;
    pendingCandidatesRef.current = [];
    setCallState("idle");
    setCallPeer(null);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const poll = () => {
      if (!currentUser) return;
      const signals = consumeSignals(currentUser.username);
      for (const sig of signals) handleIncomingSignal(sig);
    };
    pollingRef.current = setInterval(poll, 1500);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [currentUser]); // eslint-disable-line

  const handleIncomingSignal = async (sig: PendingSignal) => {
    if (sig.type === "offer" && callState === "idle") {
      setCallPeer(sig.from);
      setCallState("receiving");
      localStorage.setItem(`webrtc_pending_offer_${sig.from}`, sig.data);
      return;
    }
    if (sig.type === "hangup") {
      stopCall();
      return;
    }
    if (sig.type === "answer" && pcRef.current) {
      const answer = JSON.parse(sig.data);
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      for (const c of pendingCandidatesRef.current)
        await pcRef.current.addIceCandidate(c).catch(() => {});
      pendingCandidatesRef.current = [];
      setCallState("active");
      return;
    }
    if (sig.type === "iceCandidate" && pcRef.current) {
      const cand = new RTCIceCandidate(JSON.parse(sig.data));
      if (pcRef.current.remoteDescription)
        await pcRef.current.addIceCandidate(cand).catch(() => {});
      else pendingCandidatesRef.current.push(cand);
    }
  };

  const startCall = async (peer: string, type: CallType) => {
    if (!currentUser) return;
    setCallPeer(peer);
    setCallType(type);
    setCallState("calling");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      const pc = createPeerConnection();
      pcRef.current = pc;
      for (const track of stream.getTracks()) pc.addTrack(track, stream);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      pushSignal(peer, {
        id: `sig_${Date.now()}`,
        from: currentUser.username,
        type: "offer",
        data: JSON.stringify(offer),
        timestamp: Date.now(),
      });
    } catch {
      stopCall();
    }
  };

  const acceptCall = async () => {
    if (!currentUser || !callPeer) return;
    const offerData = localStorage.getItem(`webrtc_pending_offer_${callPeer}`);
    if (!offerData) return;
    localStorage.removeItem(`webrtc_pending_offer_${callPeer}`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      const pc = createPeerConnection();
      pcRef.current = pc;
      for (const track of stream.getTracks()) pc.addTrack(track, stream);
      const offer = JSON.parse(offerData);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      for (const c of pendingCandidatesRef.current)
        await pc.addIceCandidate(c).catch(() => {});
      pendingCandidatesRef.current = [];
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      pushSignal(callPeer, {
        id: `sig_${Date.now()}`,
        from: currentUser.username,
        type: "answer",
        data: JSON.stringify(answer),
        timestamp: Date.now(),
      });
      setCallState("active");
    } catch {
      stopCall();
    }
  };

  const declineCall = () => {
    if (callPeer && currentUser) {
      pushSignal(callPeer, {
        id: `sig_${Date.now()}`,
        from: currentUser.username,
        type: "hangup",
        data: "",
        timestamp: Date.now(),
      });
      localStorage.removeItem(`webrtc_pending_offer_${callPeer}`);
    }
    stopCall();
  };

  const hangUp = () => {
    if (callPeer && currentUser) {
      pushSignal(callPeer, {
        id: `sig_${Date.now()}`,
        from: currentUser.username,
        type: "hangup",
        data: "",
        timestamp: Date.now(),
      });
    }
    stopCall();
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getAudioTracks())
        t.enabled = !t.enabled;
      setMicMuted((m) => !m);
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getVideoTracks())
        t.enabled = !t.enabled;
      setCamOff((c) => !c);
    }
  };

  const handleBlock = (username: string) => {
    const updated = [...blockedUsers, username];
    setBlockedUsers(updated);
    localStorage.setItem("chinnua_blocked_users", JSON.stringify(updated));
    setConversations((prev) => prev.filter((c) => c !== username));
    if (activeConv === username) setActiveConv("CHINNUA_POET");
  };

  const sendMessage = async () => {
    if (!currentUser || !text.trim()) return;
    const msg: Message = {
      id: `msg_${Date.now()}`,
      from: currentUser.username,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    // Save locally
    const stored: Record<string, Message[]> = JSON.parse(
      localStorage.getItem("chinnua_messages") || "{}",
    );
    stored[activeConv] = [...(stored[activeConv] ?? []), msg];
    localStorage.setItem("chinnua_messages", JSON.stringify(stored));
    setMessages({ ...stored });
    setText("");
    if (activeConv !== "CHINNUA_POET" && !conversations.includes(activeConv)) {
      setConversations((prev) => [...prev, activeConv]);
    }
    // Also send to backend so recipient sees it
    if (actor) {
      try {
        await (actor as any).sendDirectMessage(
          currentUser.username,
          activeConv,
          msg.text,
        );
      } catch {}
    }
  };

  if (!currentUser) {
    return (
      <div
        className="slide-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: WARM_BG,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.2rem",
              color: WARM_MOCHA,
              marginBottom: "0.5rem",
            }}
          >
            Join to send messages
          </p>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.9rem",
              color: WARM_MUTED,
              marginBottom: "1.5rem",
            }}
          >
            Messages are private and secure
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={onJoin}
              data-ocid="messages.primary_button"
              style={{
                background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
                border: "none",
                color: "#3D2B1F",
              }}
            >
              Join the Community
            </Button>
            {onLogin && (
              <Button
                onClick={onLogin}
                variant="outline"
                data-ocid="messages.secondary_button"
                style={{
                  border: `1px solid ${WARM_BORDER}`,
                  color: WARM_MOCHA,
                  background: "transparent",
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const currentMessages = messages[activeConv] ?? [];

  return (
    <div className="slide-container" style={{ background: WARM_BG }}>
      {/* Section tab bar */}
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
        {(["messages", "inbox"] as MsgSection[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            data-ocid={`messages.${s}.tab`}
            style={{
              background:
                section === s ? "rgba(212,168,83,0.12)" : "transparent",
              border: "none",
              borderBottom:
                section === s
                  ? `2px solid ${WARM_GOLD}`
                  : "2px solid transparent",
              color: section === s ? WARM_MOCHA : WARM_BROWN,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              padding: "0.75rem 2rem",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
            }}
          >
            {s === "messages" ? "Messages" : "Inbox"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {section === "inbox" ? (
          <motion.div
            key="inbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InboxSlide
              currentUser={currentUser}
              onLogin={onLogin ?? (() => {})}
            />
          </motion.div>
        ) : (
          <motion.div
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Incoming call overlay */}
            <AnimatePresence>
              {callState === "receiving" && callPeer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(92,61,46,0.6)",
                    backdropFilter: "blur(8px)",
                    zIndex: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      background: WARM_PAPER,
                      border: `1px solid ${WARM_BORDER}`,
                      borderRadius: 16,
                      padding: "2.5rem 3rem",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "1.25rem",
                      boxShadow: "0 20px 60px rgba(92,61,46,0.2)",
                    }}
                    data-ocid="messages.dialog"
                  >
                    <AvatarBubble username={callPeer} size={64} />
                    <div>
                      <p
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.25rem",
                          color: WARM_MOCHA,
                          margin: 0,
                        }}
                      >
                        {callPeer}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.8rem",
                          color: WARM_MUTED,
                          margin: "0.3rem 0 0",
                          fontStyle: "italic",
                        }}
                      >
                        {callType === "video"
                          ? "Incoming video call"
                          : "Incoming voice call"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        type="button"
                        onClick={acceptCall}
                        data-ocid="messages.confirm_button"
                        style={{
                          background: "#22c55e",
                          border: "none",
                          borderRadius: 10,
                          padding: "0.6rem 1.4rem",
                          color: "#3D2B1F",
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={declineCall}
                        data-ocid="messages.cancel_button"
                        style={{
                          background: "#ef4444",
                          border: "none",
                          borderRadius: 10,
                          padding: "0.6rem 1.4rem",
                          color: "#3D2B1F",
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active call overlay */}
            <AnimatePresence>
              {(callState === "calling" || callState === "active") &&
                callPeer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "#1a0f0a",
                      zIndex: 200,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    data-ocid="messages.modal"
                  >
                    <div
                      style={{
                        flex: 1,
                        width: "100%",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {callType === "video" ? (
                        <video
                          ref={remoteVideoRef}
                          autoPlay
                          playsInline
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            background: "#111",
                          }}
                        >
                          <track kind="captions" />
                        </video>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1.5rem",
                          }}
                        >
                          <AvatarBubble username={callPeer} size={96} />
                          <p
                            style={{
                              fontFamily: "'Playfair Display', Georgia, serif",
                              fontSize: "1.5rem",
                              color: "#3D2B1F",
                            }}
                          >
                            {callPeer}
                          </p>
                          <p
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              color: WARM_MUTED,
                              fontStyle: "italic",
                            }}
                          >
                            {callState === "calling"
                              ? "Calling..."
                              : "Call connected"}
                          </p>
                        </div>
                      )}
                      {callType === "video" && (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                            width: 120,
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: `1px solid ${WARM_BORDER}`,
                            background: "#111",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1.25rem",
                        padding: "1.5rem 2rem",
                        background: "rgba(26,15,10,0.95)",
                        width: "100%",
                        justifyContent: "center",
                        borderTop: `1px solid ${WARM_BORDER}`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={toggleMic}
                        title={micMuted ? "Unmute" : "Mute"}
                        style={{
                          background: micMuted
                            ? "rgba(239,68,68,0.2)"
                            : "rgba(212,168,83,0.15)",
                          border: `1px solid ${micMuted ? "rgba(239,68,68,0.4)" : WARM_BORDER}`,
                          borderRadius: "50%",
                          width: 52,
                          height: 52,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MicIcon muted={micMuted} size={18} />
                      </button>
                      {callType === "video" && (
                        <button
                          type="button"
                          onClick={toggleCam}
                          title={camOff ? "Camera on" : "Camera off"}
                          style={{
                            background: camOff
                              ? "rgba(239,68,68,0.2)"
                              : "rgba(212,168,83,0.15)",
                            border: `1px solid ${camOff ? "rgba(239,68,68,0.4)" : WARM_BORDER}`,
                            borderRadius: "50%",
                            width: 52,
                            height: 52,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <VideoIcon
                            size={18}
                            color={camOff ? "#ef4444" : WARM_BROWN}
                          />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={hangUp}
                        data-ocid="messages.close_button"
                        style={{
                          background: "#ef4444",
                          border: "none",
                          borderRadius: "50%",
                          width: 52,
                          height: 52,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#3D2B1F",
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        End
                      </button>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            <div
              style={{
                display: "flex",
                height: "calc(100vh - 52px)",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              {/* Conversation list */}
              <div
                style={{
                  width: 200,
                  borderRight: `1px solid ${WARM_BORDER}`,
                  padding: "1rem 0.75rem",
                  flexShrink: 0,
                  overflowY: "auto",
                  background: "rgba(245,236,215,0.5)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {["inbox", "requests"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMsgTab(t as "inbox" | "requests")}
                      data-ocid="messages.tab"
                      style={{
                        flex: 1,
                        background:
                          msgTab === t
                            ? "rgba(212,168,83,0.15)"
                            : "transparent",
                        border:
                          msgTab === t
                            ? "1px solid rgba(212,168,83,0.4)"
                            : `1px solid ${WARM_BORDER}`,
                        borderRadius: 6,
                        padding: "0.3rem",
                        color: msgTab === t ? WARM_MOCHA : WARM_BROWN,
                        fontSize: "0.65rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        cursor: "pointer",
                      }}
                    >
                      {t === "inbox" ? "Chats" : "Requests"}
                    </button>
                  ))}
                </div>

                {/* Backend notice */}
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.6rem",
                    color: WARM_GOLD,
                    fontStyle: "italic",
                    marginBottom: "0.75rem",
                    lineHeight: 1.5,
                  }}
                >
                  Messages are saved to the platform
                </p>

                {msgTab === "inbox" ? (
                  conversations
                    .filter((c) => !blockedUsers.includes(c))
                    .map((conv) => (
                      <div
                        key={conv}
                        style={{
                          position: "relative",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveConv(conv)}
                          data-ocid="messages.button"
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "0.65rem 0.75rem",
                            borderRadius: 8,
                            background:
                              activeConv === conv
                                ? "rgba(212,168,83,0.15)"
                                : "transparent",
                            border:
                              activeConv === conv
                                ? "1px solid rgba(212,168,83,0.3)"
                                : "1px solid transparent",
                            color:
                              activeConv === conv ? WARM_MOCHA : WARM_BROWN,
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            paddingRight: "2rem",
                          }}
                        >
                          <AvatarBubble username={conv} size={26} />
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.82rem",
                            }}
                          >
                            {conv}
                          </span>
                        </button>
                        {conv !== "CHINNUA_POET" && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Block ${conv}?`)) handleBlock(conv);
                            }}
                            title="Block user"
                            data-ocid="messages.delete_button"
                            style={{
                              position: "absolute",
                              right: 4,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "rgba(220,80,80,0.6)",
                              fontSize: "0.75rem",
                              padding: "0.2rem",
                            }}
                          >
                            x
                          </button>
                        )}
                      </div>
                    ))
                ) : (
                  <div
                    style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}
                  >
                    <p
                      style={{
                        color: WARM_MUTED,
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "0.78rem",
                      }}
                    >
                      No message requests
                    </p>
                    <p
                      style={{
                        color: WARM_MUTED,
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.68rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      Messages from restricted users appear here
                    </p>
                  </div>
                )}
              </div>

              {/* Chat area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  overflow: "hidden",
                  background: WARM_BG,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    borderBottom: `1px solid ${WARM_BORDER}`,
                    paddingBottom: "0.75rem",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: WARM_MOCHA,
                        margin: 0,
                      }}
                    >
                      {activeConv === "CHINNUA_POET"
                        ? "CHINNUA_POET"
                        : activeConv}
                    </h3>
                    {activeConv === "CHINNUA_POET" && (
                      <p
                        style={{
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.72rem",
                          color: WARM_MUTED,
                          margin: 0,
                        }}
                      >
                        Send a message to the poet
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => startCall(activeConv, "voice")}
                      title="Voice call"
                      data-ocid="messages.secondary_button"
                      style={{
                        background: "rgba(212,168,83,0.08)",
                        border: `1px solid ${WARM_BORDER}`,
                        borderRadius: 8,
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <PhoneIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => startCall(activeConv, "video")}
                      title="Video call"
                      data-ocid="messages.secondary_button"
                      style={{
                        background: "rgba(212,168,83,0.08)",
                        border: `1px solid ${WARM_BORDER}`,
                        borderRadius: 8,
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <VideoIcon size={14} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    paddingBottom: "0.5rem",
                  }}
                >
                  {currentMessages.length === 0 && (
                    <p
                      style={{
                        textAlign: "center",
                        color: WARM_MUTED,
                        fontFamily: "'Libre Baskerville', Georgia, serif",
                        fontSize: "0.85rem",
                        marginTop: "2rem",
                        fontStyle: "italic",
                      }}
                      data-ocid="messages.empty_state"
                    >
                      No messages yet. Write something...
                    </p>
                  )}
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf:
                          msg.from === currentUser.username
                            ? "flex-end"
                            : "flex-start",
                        maxWidth: "70%",
                        padding: "0.6rem 1rem",
                        borderRadius: 12,
                        background:
                          msg.from === currentUser.username
                            ? "rgba(212,168,83,0.2)"
                            : "rgba(245,236,215,0.9)",
                        border: `1px solid ${
                          msg.from === currentUser.username
                            ? "rgba(212,168,83,0.3)"
                            : WARM_BORDER
                        }`,
                      }}
                    >
                      <p
                        style={{
                          color: WARM_TEXT,
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.88rem",
                          margin: 0,
                        }}
                      >
                        {msg.text}
                      </p>
                      <p
                        style={{
                          color: WARM_MUTED,
                          fontFamily: "'Libre Baskerville', Georgia, serif",
                          fontSize: "0.7rem",
                          margin: "0.2rem 0 0",
                          textAlign: "right",
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>

                {/* Input */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    paddingTop: "0.75rem",
                    borderTop: `1px solid ${WARM_BORDER}`,
                  }}
                >
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a message..."
                    data-ocid="messages.input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                    style={{
                      flex: 1,
                      background: "rgba(255,248,238,0.9)",
                      border: `1px solid ${WARM_BORDER}`,
                      borderRadius: 8,
                      padding: "0.6rem 0.9rem",
                      color: WARM_TEXT,
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    data-ocid="messages.submit_button"
                    style={{
                      background: `linear-gradient(135deg, ${WARM_GOLD}, ${WARM_BROWN})`,
                      border: "none",
                      color: "#3D2B1F",
                    }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
