import { useState } from "react";

interface LoginGateUser {
  username: string;
  bio: string;
  createdAt: string;
}

interface StoredUser {
  username: string;
  emailOrPhone: string;
  password: string;
  bio: string;
  createdAt: string;
}

interface LoginGateProps {
  onLogin: (user: LoginGateUser) => void;
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,248,238,0.9)",
  border: "1px solid rgba(200,169,106,0.25)",
  borderRadius: 8,
  padding: "0.65rem 1rem",
  color: "#3D2B1F",
  fontFamily: "'Libre Baskerville', Georgia, serif",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
};

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={open ? "Hide password" : "Show password"}
    >
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );
}

export function LoginGate({ onLogin }: LoginGateProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setEmailOrPhone("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowPassword(false);
    setShowConfirm(false);
  };

  const switchMode = (m: "login" | "signup") => {
    reset();
    setMode(m);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const ep = emailOrPhone.trim();
    const pw = password;

    if (!ep || !pw) {
      setError("Please fill in all required fields.");
      return;
    }

    let users: StoredUser[] = [];
    try {
      users = JSON.parse(localStorage.getItem("chinnua_users") || "[]");
    } catch {}

    if (mode === "login") {
      const found = users.find(
        (u) => u.emailOrPhone === ep && u.password === pw,
      );
      if (!found) {
        setError("Incorrect email/phone or password.");
        return;
      }
      const loggedIn: LoginGateUser = {
        username: found.username,
        bio: found.bio || "",
        createdAt: found.createdAt,
      };
      localStorage.setItem("chinnua_user", JSON.stringify(loggedIn));
      onLogin(loggedIn);
    } else {
      const un = username.trim();
      if (!un) {
        setError("Please choose a username.");
        return;
      }
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(un)) {
        setError(
          "Username: 3–20 characters, letters, numbers, underscore only.",
        );
        return;
      }
      if (pw.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (pw !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (users.find((u) => u.username.toLowerCase() === un.toLowerCase())) {
        setError("Username already taken.");
        return;
      }
      if (users.find((u) => u.emailOrPhone === ep)) {
        setError("An account with this email/phone already exists.");
        return;
      }
      const now = new Date().toISOString();
      const newUser: StoredUser = {
        username: un,
        emailOrPhone: ep,
        password: pw,
        bio: "",
        createdAt: now,
      };
      users.push(newUser);
      localStorage.setItem("chinnua_users", JSON.stringify(users));
      const loggedIn: LoginGateUser = {
        username: un,
        bio: "",
        createdAt: now,
      };
      localStorage.setItem("chinnua_user", JSON.stringify(loggedIn));
      onLogin(loggedIn);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        minHeight: 300,
        gap: "1.25rem",
      }}
      data-ocid="login_gate.modal"
    >
      <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#3D2B1F",
            margin: "0 0 0.5rem",
          }}
        >
          {mode === "login" ? "Welcome Back" : "Join to Read"}
        </h3>
        <p
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.88rem",
            color: "rgba(92,61,46,0.5)",
            margin: 0,
          }}
        >
          {mode === "login"
            ? "Sign in to continue reading"
            : "Create an account to read the full poem"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          width: "100%",
          maxWidth: 340,
        }}
      >
        <input
          type="text"
          value={emailOrPhone}
          onChange={(e) => {
            setEmailOrPhone(e.target.value);
            setError("");
          }}
          placeholder="Email or phone number"
          autoComplete="username"
          data-ocid="login_gate.input"
          style={inputStyle}
        />

        {mode === "signup" && (
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder="Username (3–20 chars)"
            data-ocid="login_gate.input"
            style={inputStyle}
          />
        )}

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            data-ocid="login_gate.input"
            style={{ ...inputStyle, paddingRight: "2.75rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#8B6F47",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        {mode === "signup" && (
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              placeholder="Confirm password"
              autoComplete="new-password"
              data-ocid="login_gate.input"
              style={{ ...inputStyle, paddingRight: "2.75rem" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#8B6F47",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        )}

        {error && (
          <p
            data-ocid="login_gate.error_state"
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "0.8rem",
              color: "rgba(244,63,94,0.85)",
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          data-ocid="login_gate.submit_button"
          style={{
            background: "rgba(200,169,106,0.85)",
            border: "none",
            borderRadius: 8,
            padding: "0.7rem 1rem",
            color: "#3D2B1F",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
            marginTop: "0.25rem",
          }}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => switchMode(mode === "login" ? "signup" : "login")}
        data-ocid="login_gate.toggle"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: "0.8rem",
          color: "#D4A853",
          textDecoration: "underline",
          padding: 0,
        }}
      >
        {mode === "login"
          ? "New here? Create account"
          : "Already have an account? Sign in"}
      </button>

      <p
        style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: "0.75rem",
          color: "rgba(92,61,46,0.4)",
          margin: 0,
          textAlign: "center",
        }}
      >
        Your information is stored only on your device.
      </p>
    </div>
  );
}
