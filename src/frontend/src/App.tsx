import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import LanguageTranslator from "./components/LanguageTranslator";
import { LoginGate } from "./components/LoginGate";
import PoetryAssistant from "./components/PoetryAssistant";
import SilentListenerChat from "./components/SilentListenerChat";
import { UserSetupModal } from "./components/UserSetupModal";
import AboutSlide from "./slides/AboutSlide";
import AdminSlide from "./slides/AdminSlide";
import FeedSlide from "./slides/FeedSlide";
import GallerySlide from "./slides/GallerySlide";
import HomeSlide from "./slides/HomeSlide";
import InboxSlide from "./slides/InboxSlide";
import MessagesSlide from "./slides/MessagesSlide";
import MusicSlide from "./slides/MusicSlide";
import NotesSlide from "./slides/NotesSlide";
import PoemsSlide from "./slides/PoemsSlide";
import PrivacySlide from "./slides/PrivacySlide";
import SettingsSlide from "./slides/SettingsSlide";
import TermsSlide from "./slides/TermsSlide";
import UserProfileSlide from "./slides/UserProfileSlide";

type Slide =
  | "home"
  | "feed"
  | "poems"
  | "gallery"
  | "music"
  | "messages"
  | "about"
  | "notes"
  | "admin"
  | "profile"
  | "settings"
  | "terms"
  | "privacy"
  | "inbox";

interface User {
  username: string;
  bio: string;
  createdAt: string;
}

const BASE_NAV_ITEMS: { slide: Slide; label: string }[] = [
  { slide: "home", label: "Home" },
  { slide: "feed", label: "Feed" },
  { slide: "poems", label: "Poems" },
  { slide: "gallery", label: "Gallery" },
  { slide: "music", label: "Music" },
  { slide: "messages", label: "Messages" },
  { slide: "about", label: "About" },
];

const NOTES_NAV_ITEM: { slide: Slide; label: string } = {
  slide: "notes",
  label: "My Notes",
};
const INBOX_NAV_ITEM: { slide: Slide; label: string } = {
  slide: "inbox",
  label: "Inbox",
};

function UserIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="User"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// Warm theme constants
const WARM_BG = "#FFF8EE";
const WARM_PAPER = "#F5ECD7";
const WARM_BROWN = "#8B6F47";
const WARM_MOCHA = "#5C3D2E";
const WARM_GOLD = "#D4A853";
const WARM_TEXT = "#3D2B1F";
const WARM_MUTED = "rgba(92,61,46,0.5)";
const WARM_BORDER = "rgba(139,111,71,0.25)";

export default function App() {
  const [activeSlide, setActiveSlide] = useState<Slide>("home");
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showUserSetup, setShowUserSetup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("slide") === "admin") setActiveSlide("admin");
    try {
      const stored = localStorage.getItem("chinnua_user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {}
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const PROFILE_NAV_ITEM: { slide: Slide; label: string } = {
    slide: "profile",
    label: "Profile",
  };
  const SETTINGS_NAV_ITEM: { slide: Slide; label: string } = {
    slide: "settings",
    label: "Settings",
  };
  const navItems = currentUser
    ? [
        ...BASE_NAV_ITEMS,
        NOTES_NAV_ITEM,
        INBOX_NAV_ITEM,
        PROFILE_NAV_ITEM,
        SETTINGS_NAV_ITEM,
      ]
    : BASE_NAV_ITEMS;

  const handleLogoClick = () => {
    const count = adminClickCount + 1;
    setAdminClickCount(count);
    if (count >= 5) {
      setActiveSlide("admin");
      setAdminClickCount(0);
    }
  };

  const handleViewProfile = (username: string) => {
    setProfileUsername(username);
    setActiveSlide("profile");
  };

  const handleUserSetupClose = (username: string) => {
    if (username) {
      const user: User = {
        username,
        bio: "",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("chinnua_user", JSON.stringify(user));
      try {
        const users: User[] = JSON.parse(
          localStorage.getItem("chinnua_users") || "[]",
        );
        if (!users.find((u) => u.username === username)) {
          users.push(user);
          localStorage.setItem("chinnua_users", JSON.stringify(users));
        }
      } catch {}
      setCurrentUser(user);
    }
    setShowUserSetup(false);
  };

  const handleLogin = (user: {
    username: string;
    bio?: string;
    email?: string;
    createdAt: string;
  }) => {
    const u: User = {
      username: user.username,
      bio: user.bio ?? "",
      createdAt: user.createdAt,
    };
    setCurrentUser(u);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("chinnua_user");
    setCurrentUser(null);
    if (
      activeSlide === "notes" ||
      activeSlide === "profile" ||
      activeSlide === "inbox"
    )
      setActiveSlide("home");
  };

  const handleNavClick = (slide: Slide) => {
    if (slide === "profile" && currentUser) {
      setProfileUsername(currentUser.username);
    } else if (slide !== "profile") {
      setProfileUsername(null);
    }
    setActiveSlide(slide);
  };

  const renderSlide = () => {
    switch (activeSlide) {
      case "home":
        return (
          <HomeSlide
            goToFeed={() => setActiveSlide("feed")}
            currentUser={currentUser}
          />
        );
      case "feed":
        return (
          <FeedSlide
            currentUser={currentUser}
            onJoin={() => setShowUserSetup(true)}
            onLogin={handleLogin}
            onViewProfile={handleViewProfile}
          />
        );
      case "poems":
        return <PoemsSlide currentUser={currentUser} onLogin={handleLogin} />;
      case "gallery":
        return <GallerySlide currentUser={currentUser} />;
      case "music":
        return <MusicSlide />;
      case "messages":
        return (
          <MessagesSlide
            currentUser={currentUser}
            onJoin={() => setShowUserSetup(true)}
          />
        );
      case "about":
        return <AboutSlide />;
      case "notes":
        return (
          <NotesSlide
            currentUser={currentUser}
            onLogin={() => setShowLoginModal(true)}
          />
        );
      case "inbox":
        return (
          <InboxSlide
            currentUser={currentUser}
            onLogin={() => setShowLoginModal(true)}
          />
        );
      case "admin":
        return <AdminSlide />;
      case "settings":
        return (
          <SettingsSlide
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={(slide: string) => setActiveSlide(slide as Slide)}
          />
        );
      case "terms":
        return <TermsSlide onBack={() => setActiveSlide("settings")} />;
      case "privacy":
        return <PrivacySlide onBack={() => setActiveSlide("settings")} />;
      case "profile":
        return profileUsername ? (
          <UserProfileSlide
            viewUsername={profileUsername}
            currentUser={currentUser}
            onBack={() => {
              setActiveSlide("feed");
              setProfileUsername(null);
            }}
            onGoToMessages={() => setActiveSlide("messages")}
            onLogin={() => setShowLoginModal(true)}
          />
        ) : (
          <HomeSlide
            goToFeed={() => setActiveSlide("feed")}
            currentUser={currentUser}
          />
        );
      default:
        return (
          <HomeSlide
            goToFeed={() => setActiveSlide("feed")}
            currentUser={currentUser}
          />
        );
    }
  };

  const sidebarWidth = 200;

  return (
    <div
      style={{
        background: WARM_BG,
        minHeight: "100vh",
        color: WARM_TEXT,
        display: "flex",
      }}
    >
      <Toaster />

      {/* ── Desktop Sidebar ── */}
      {!isMobile && (
        <nav
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            width: sidebarWidth,
            background: WARM_PAPER,
            borderRight: `1px solid ${WARM_BORDER}`,
            display: "flex",
            flexDirection: "column",
            padding: "2rem 0 2rem",
            zIndex: 40,
            boxShadow: "2px 0 12px rgba(92,61,46,0.08)",
          }}
          data-ocid="nav.panel"
        >
          {/* Logo */}
          <button
            type="button"
            onClick={handleLogoClick}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 1.5rem",
              marginBottom: "1.5rem",
              textAlign: "left",
            }}
            data-ocid="nav.button"
          >
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                color: WARM_MOCHA,
                textTransform: "uppercase",
                display: "block",
                lineHeight: 1.3,
                fontWeight: 700,
              }}
            >
              CHINNUA
              <br />
              POET
            </span>
            <span
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.6rem",
                color: WARM_BROWN,
                letterSpacing: "0.05em",
                marginTop: "0.2rem",
                display: "block",
              }}
            >
              Where words bloom
            </span>
          </button>

          {/* Translator */}
          <div style={{ padding: "0 1.5rem", marginBottom: "1.25rem" }}>
            <LanguageTranslator />
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: WARM_BORDER,
              margin: "0 1.5rem 1.5rem",
            }}
          />

          {/* Nav items */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.15rem",
              flex: 1,
              overflowY: "auto",
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.slide}
                type="button"
                onClick={() => handleNavClick(item.slide)}
                data-ocid="nav.link"
                style={{
                  background:
                    activeSlide === item.slide
                      ? "rgba(212,168,83,0.12)"
                      : "transparent",
                  border: "none",
                  borderLeft:
                    activeSlide === item.slide
                      ? `2px solid ${WARM_GOLD}`
                      : "2px solid transparent",
                  cursor: "pointer",
                  padding: "0.6rem 1.5rem",
                  textAlign: "left",
                  transition: "all 0.2s",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  if (activeSlide !== item.slide) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(212,168,83,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSlide !== item.slide) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: activeSlide === item.slide ? WARM_GOLD : WARM_BROWN,
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* User area */}
          <div
            style={{
              borderTop: `1px solid ${WARM_BORDER}`,
              margin: "0 1.5rem",
              paddingTop: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {currentUser ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleViewProfile(currentUser.username)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  title="View your profile"
                >
                  <span
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.7rem",
                      color: WARM_MOCHA,
                      letterSpacing: "0.05em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      fontWeight: 600,
                    }}
                  >
                    {currentUser.username}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  data-ocid="nav.secondary_button"
                  style={{
                    background: "rgba(139,111,71,0.1)",
                    border: `1px solid ${WARM_BORDER}`,
                    borderRadius: 6,
                    padding: "0.3rem 0.6rem",
                    color: WARM_BROWN,
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.62rem",
                    letterSpacing: "0.07em",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s",
                    textTransform: "uppercase",
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                data-ocid="nav.primary_button"
                style={{
                  background: "rgba(212,168,83,0.15)",
                  border: "1px solid rgba(212,168,83,0.4)",
                  borderRadius: 6,
                  padding: "0.35rem 0.6rem",
                  color: WARM_MOCHA,
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.07em",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Sign In
              </button>
            )}
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.62rem",
                color: WARM_MUTED,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              &ldquo;Words that linger.
              <br />
              Verses that heal.&rdquo;
            </p>
          </div>
        </nav>
      )}

      {/* ── Main content ── */}
      <main
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginBottom: isMobile ? 64 : 0,
          flex: 1,
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={
              activeSlide === "profile"
                ? `profile_${profileUsername}`
                : activeSlide
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ minHeight: "100vh" }}
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      {isMobile && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            background: WARM_PAPER,
            borderTop: `1px solid ${WARM_BORDER}`,
            display: "flex",
            alignItems: "center",
            zIndex: 40,
            overflowX: "auto",
            boxShadow: "0 -2px 12px rgba(92,61,46,0.08)",
          }}
          data-ocid="nav.panel"
        >
          <button
            type="button"
            onClick={handleLogoClick}
            style={{
              flexShrink: 0,
              background: "none",
              border: "none",
              padding: "0 0.6rem",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
            data-ocid="nav.button"
          >
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.5rem",
                color: WARM_MOCHA,
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              C_P
            </span>
          </button>

          {navItems.map((item) => (
            <button
              key={item.slide}
              type="button"
              onClick={() => handleNavClick(item.slide)}
              data-ocid="nav.link"
              style={{
                flex: 1,
                minWidth: 48,
                height: "100%",
                background: "none",
                border: "none",
                borderTop:
                  activeSlide === item.slide
                    ? `2px solid ${WARM_GOLD}`
                    : "2px solid transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 4,
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "0.48rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: activeSlide === item.slide ? WARM_GOLD : WARM_BROWN,
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            </button>
          ))}

          <div
            style={{
              flexShrink: 0,
              padding: "0 0.4rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                transform: "scale(0.85)",
                transformOrigin: "right center",
              }}
            >
              <LanguageTranslator />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (currentUser) {
                handleViewProfile(currentUser.username);
              } else {
                setShowLoginModal(true);
              }
            }}
            data-ocid="nav.secondary_button"
            style={{
              flexShrink: 0,
              background: "none",
              border: "none",
              padding: "0 0.7rem",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              height: "100%",
            }}
          >
            {currentUser ? (
              <>
                <UserIcon color={WARM_MOCHA} />
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.4rem",
                    color: WARM_MOCHA,
                    letterSpacing: "0.06em",
                    maxWidth: 44,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentUser.username}
                </span>
              </>
            ) : (
              <>
                <UserIcon color={WARM_BROWN} />
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "0.4rem",
                    color: WARM_BROWN,
                    letterSpacing: "0.06em",
                  }}
                >
                  Sign In
                </span>
              </>
            )}
          </button>
        </nav>
      )}

      {/* ── Login Modal ── */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(92,61,46,0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "1rem",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLoginModal(false);
            }}
            data-ocid="login_gate.modal"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={{
                background: WARM_PAPER,
                border: "1px solid rgba(212,168,83,0.35)",
                borderRadius: 16,
                width: "100%",
                maxWidth: 400,
                position: "relative",
                boxShadow: "0 8px 40px rgba(92,61,46,0.25)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                data-ocid="login_gate.close_button"
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: WARM_BROWN,
                  fontSize: "1.2rem",
                  lineHeight: 1,
                  padding: "0.25rem",
                }}
              >
                ×
              </button>
              <LoginGate onLogin={handleLogin} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PoetryAssistant />
      <SilentListenerChat />
      <UserSetupModal open={showUserSetup} onClose={handleUserSetupClose} />
    </div>
  );
}
