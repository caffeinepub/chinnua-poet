import { useState } from "react";

interface LoginGateUser {
  username: string;
  email: string;
  createdAt: string;
}

interface LoginGateProps {
  onLogin: (user: LoginGateUser) => void;
}

export function LoginGate({ onLogin }: LoginGateProps) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !username.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    const user: LoginGateUser = {
      username: username.trim(),
      email: emailOrPhone.trim(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("chinnua_user", JSON.stringify(user));
    // Also add to users list
    try {
      const users = JSON.parse(localStorage.getItem("chinnua_users") || "[]");
      if (!users.find((u: LoginGateUser) => u.username === user.username)) {
        users.push(user);
        localStorage.setItem("chinnua_users", JSON.stringify(users));
      }
    } catch {}
    onLogin(user);
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
            color: "#F5E6D3",
            margin: "0 0 0.5rem",
          }}
        >
          Join to Read
        </h3>
        <p
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.88rem",
            color: "rgba(229,231,235,0.5)",
            margin: 0,
          }}
        >
          Create an account to read the full poem
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
          data-ocid="login_gate.input"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(200,169,106,0.25)",
            borderRadius: 8,
            padding: "0.65rem 1rem",
            color: "#F5E6D3",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.9rem",
            outline: "none",
            width: "100%",
          }}
        />
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          placeholder="Username"
          data-ocid="login_gate.input"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(200,169,106,0.25)",
            borderRadius: 8,
            padding: "0.65rem 1rem",
            color: "#F5E6D3",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.9rem",
            outline: "none",
            width: "100%",
          }}
        />
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
            color: "#fff",
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Continue
        </button>
      </form>

      <p
        style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: "0.75rem",
          color: "rgba(229,231,235,0.3)",
          margin: 0,
          textAlign: "center",
        }}
      >
        Your information is stored only on your device.
      </p>
    </div>
  );
}
