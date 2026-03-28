import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

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
            ? "rgba(200,169,106,0.3)"
            : "rgba(255,255,255,0.1)",
        border:
          username === "CHINNUA_POET"
            ? "1px solid rgba(200,169,106,0.5)"
            : "1px solid rgba(255,255,255,0.15)",
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
          style={{ color: username === "CHINNUA_POET" ? "#C8A96A" : "#F5E6D3" }}
        >
          {username.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

// ── WebRTC / localStorage signaling ──────────────────────────────────────────
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

export default function MessagesSlide({
  currentUser,
  onJoin,
}: { currentUser: User | null; onJoin: () => void }) {
  const [conversations, setConversations] = useState<string[]>([
    "CHINNUA_POET",
  ]);
  const [activeConv, setActiveConv] = useState("CHINNUA_POET");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // ── Call state ──────────────────────────────────────────────────────────────
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

  useEffect(() => {
    const stored: Record<string, Message[]> = JSON.parse(
      localStorage.getItem("chinnua_messages") || "{}",
    );
    setMessages(stored);
    const keys = Object.keys(stored).filter((k) => k !== "CHINNUA_POET");
    setConversations(["CHINNUA_POET", ...keys]);
  }, []);

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
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
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

  // Polling for incoming signals
  useEffect(() => {
    if (!currentUser) return;
    const poll = () => {
      if (!currentUser) return;
      const signals = consumeSignals(currentUser.username);
      for (const sig of signals) {
        handleIncomingSignal(sig);
      }
    };
    pollingRef.current = setInterval(poll, 1500);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: poll does not need to re-register on callState change
  }, [currentUser]);

  const handleIncomingSignal = async (sig: PendingSignal) => {
    if (sig.type === "offer" && callState === "idle") {
      setCallPeer(sig.from);
      setCallState("receiving");
      // Store the offer for when user accepts
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
      // Flush pending ICE
      for (const c of pendingCandidatesRef.current) {
        await pcRef.current.addIceCandidate(c).catch(() => {});
      }
      pendingCandidatesRef.current = [];
      setCallState("active");
      return;
    }
    if (sig.type === "iceCandidate" && pcRef.current) {
      const cand = new RTCIceCandidate(JSON.parse(sig.data));
      if (pcRef.current.remoteDescription) {
        await pcRef.current.addIceCandidate(cand).catch(() => {});
      } else {
        pendingCandidatesRef.current.push(cand);
      }
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
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

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
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = createPeerConnection();
      pcRef.current = pc;
      for (const track of stream.getTracks()) pc.addTrack(track, stream);

      const offer = JSON.parse(offerData);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      for (const c of pendingCandidatesRef.current) {
        await pc.addIceCandidate(c).catch(() => {});
      }
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
      for (const t of localStreamRef.current.getAudioTracks()) {
        t.enabled = !t.enabled;
      }
      setMicMuted((m) => !m);
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getVideoTracks()) {
        t.enabled = !t.enabled;
      }
      setCamOff((c) => !c);
    }
  };

  const sendMessage = () => {
    if (!currentUser || !text.trim()) return;
    const msg: Message = {
      id: `msg_${Date.now()}`,
      from: currentUser.username,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
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
  };

  if (!currentUser) {
    return (
      <div
        className="slide-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
              color: "rgba(229,231,235,0.7)",
              marginBottom: "1rem",
            }}
          >
            Join to send messages
          </p>
          <Button
            onClick={onJoin}
            data-ocid="messages.primary_button"
            style={{
              background: "rgba(200,169,106,0.85)",
              border: "none",
              color: "#fff",
            }}
          >
            Join the Community
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentMessages = messages[activeConv] ?? [];

  return (
    <div className="slide-container">
      {/* ── Incoming call overlay ── */}
      <AnimatePresence>
        {callState === "receiving" && callPeer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
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
                background: "#1A1410",
                border: "1px solid rgba(200,169,106,0.3)",
                borderRadius: 16,
                padding: "2.5rem 3rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
                boxShadow: "0 0 40px rgba(200,169,106,0.15)",
              }}
              data-ocid="messages.dialog"
            >
              <AvatarBubble username={callPeer} size={64} />
              <div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.25rem",
                    color: "#C8A96A",
                    margin: 0,
                  }}
                >
                  {callPeer}
                </p>
                <p
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.8rem",
                    color: "rgba(245,230,211,0.5)",
                    margin: "0.3rem 0 0",
                    fontStyle: "italic",
                  }}
                >
                  {callType === "video"
                    ? "📹 Incoming video call…"
                    : "📞 Incoming voice call…"}
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
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    fontSize: "1.4rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  📞
                </button>
                <button
                  type="button"
                  onClick={declineCall}
                  data-ocid="messages.cancel_button"
                  style={{
                    background: "#ef4444",
                    border: "none",
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    fontSize: "1.4rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active call overlay ── */}
      <AnimatePresence>
        {(callState === "calling" || callState === "active") && callPeer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "#0D0D0D",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            data-ocid="messages.modal"
          >
            {/* Remote video / avatar area */}
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
                      color: "#F5E6D3",
                    }}
                  >
                    {callPeer}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Libre Baskerville', Georgia, serif",
                      color: "rgba(245,230,211,0.5)",
                      fontStyle: "italic",
                    }}
                  >
                    {callState === "calling" ? "Calling…" : "Call connected"}
                  </p>
                </div>
              )}

              {/* Local video PiP */}
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
                    border: "1px solid rgba(200,169,106,0.4)",
                    background: "#111",
                  }}
                />
              )}
            </div>

            {/* Call controls */}
            <div
              style={{
                display: "flex",
                gap: "1.25rem",
                padding: "1.5rem 2rem",
                background: "rgba(26,20,16,0.95)",
                width: "100%",
                justifyContent: "center",
                borderTop: "1px solid rgba(200,169,106,0.15)",
              }}
            >
              <CallBtn
                onClick={toggleMic}
                active={!micMuted}
                label={micMuted ? "🎙️✕" : "🎙️"}
                title={micMuted ? "Unmute" : "Mute"}
              />
              {callType === "video" && (
                <CallBtn
                  onClick={toggleCam}
                  active={!camOff}
                  label={camOff ? "📷✕" : "📷"}
                  title={camOff ? "Camera on" : "Camera off"}
                />
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
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                📵
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          height: "100%",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Conversation list */}
        <div
          style={{
            width: 200,
            borderRight: "1px solid rgba(200,169,106,0.15)",
            padding: "1rem 0.75rem",
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.75rem",
              color: "rgba(229,231,235,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
              paddingLeft: "0.25rem",
            }}
          >
            Messages
          </h3>
          {conversations.map((conv) => (
            <button
              key={conv}
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
                    ? "rgba(200,169,106,0.15)"
                    : "transparent",
                border:
                  activeConv === conv
                    ? "1px solid rgba(200,169,106,0.3)"
                    : "1px solid transparent",
                color:
                  activeConv === conv ? "#F5E6D3" : "rgba(229,231,235,0.6)",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.85rem",
                cursor: "pointer",
                marginBottom: "0.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
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
          ))}
        </div>

        {/* Chat area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            overflow: "hidden",
          }}
        >
          {/* Header with call buttons */}
          <div
            style={{
              borderBottom: "1px solid rgba(200,169,106,0.15)",
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
                  color: "#F5E6D3",
                  margin: 0,
                }}
              >
                {activeConv === "CHINNUA_POET" ? "✦ CHINNUA_POET" : activeConv}
              </h3>
              {activeConv === "CHINNUA_POET" && (
                <p
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.72rem",
                    color: "rgba(229,231,235,0.4)",
                    margin: 0,
                  }}
                >
                  Send a message to the poet
                </p>
              )}
            </div>
            {/* Call icons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => startCall(activeConv, "voice")}
                title="Voice call"
                data-ocid="messages.secondary_button"
                style={{
                  background: "rgba(200,169,106,0.08)",
                  border: "1px solid rgba(200,169,106,0.2)",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(200,169,106,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(200,169,106,0.08)";
                }}
              >
                📞
              </button>
              <button
                type="button"
                onClick={() => startCall(activeConv, "video")}
                title="Video call"
                data-ocid="messages.secondary_button"
                style={{
                  background: "rgba(200,169,106,0.08)",
                  border: "1px solid rgba(200,169,106,0.2)",
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(200,169,106,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(200,169,106,0.08)";
                }}
              >
                🎥
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
                  color: "rgba(229,231,235,0.3)",
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  fontSize: "0.85rem",
                  marginTop: "2rem",
                }}
                data-ocid="messages.empty_state"
              >
                No messages yet. Say something…
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
                      ? "rgba(200,169,106,0.25)"
                      : "rgba(255,255,255,0.06)",
                  border: `1px solid ${msg.from === currentUser.username ? "rgba(200,169,106,0.3)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <p
                  style={{
                    color: "rgba(229,231,235,0.85)",
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "0.88rem",
                    margin: 0,
                  }}
                >
                  {msg.text}
                </p>
                <p
                  style={{
                    color: "rgba(229,231,235,0.3)",
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
              borderTop: "1px solid rgba(200,169,106,0.15)",
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              data-ocid="messages.input"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(200,169,106,0.2)",
                borderRadius: 8,
                padding: "0.6rem 0.9rem",
                color: "#F5E6D3",
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
                background: "rgba(200,169,106,0.85)",
                border: "none",
                color: "#fff",
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CallBtn({
  onClick,
  active,
  label,
  title,
}: { onClick: () => void; active: boolean; label: string; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        background: active
          ? "rgba(200,169,106,0.15)"
          : "rgba(255,255,255,0.08)",
        border: `1px solid ${active ? "rgba(200,169,106,0.4)" : "rgba(255,255,255,0.15)"}`,
        borderRadius: "50%",
        width: 52,
        height: 52,
        fontSize: "1.3rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}
