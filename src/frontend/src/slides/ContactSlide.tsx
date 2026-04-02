import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { useState } from "react";
import { SiX, SiYoutube } from "react-icons/si";
import { toast } from "sonner";

export default function ContactSlide() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    const messages = JSON.parse(
      localStorage.getItem("chinnua_contact_messages") || "[]",
    );
    messages.push({ ...form, timestamp: new Date().toISOString() });
    localStorage.setItem("chinnua_contact_messages", JSON.stringify(messages));
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    toast.success("Message sent. Thank you.");
  };

  const setEmailColor = (el: HTMLAnchorElement, color: string) => {
    el.style.color = color;
  };

  const setSocialStyles = (el: HTMLAnchorElement, hover: boolean) => {
    el.style.background = hover
      ? "rgba(200,169,106,0.15)"
      : "rgba(255,255,255,0.05)";
    el.style.borderColor = hover
      ? "rgba(200,169,106,0.4)"
      : "rgba(200,169,106,0.2)";
    el.style.color = hover ? "rgba(200,169,106,0.9)" : "#8B6F47";
    el.style.boxShadow = hover ? "0 0 12px rgba(200,169,106,0.2)" : "none";
  };

  return (
    <div
      className="slide-container"
      style={{ overflowY: "auto", paddingBottom: "2rem" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 600, margin: "0 auto", padding: "2.5rem 1.5rem" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "#3D2B1F",
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            Contact
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              height: 1,
              background: "rgba(200,169,106,0.5)",
              margin: "0 auto 1.5rem",
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "rgba(92,61,46,0.5)",
              lineHeight: 1.8,
            }}
          >
            Words find their way. Reach out.
          </motion.p>
        </div>

        {/* Email & Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "rgba(16,24,38,0.8)",
            border: "1px solid rgba(139,111,71,0.3)",
            borderRadius: 14,
            padding: "1.75rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <p
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B6F47",
                marginBottom: "0.4rem",
              }}
            >
              Email
            </p>
            <a
              href="mailto:anoldpoet07@gmail.com"
              data-ocid="contact.link"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1rem",
                color: "#3D2B1F",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                setEmailColor(e.currentTarget, "rgba(200,169,106,0.9)")
              }
              onMouseLeave={(e) => setEmailColor(e.currentTarget, "#F5E6D3")}
            >
              anoldpoet07@gmail.com
            </a>
          </div>

          <div>
            <p
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B6F47",
                marginBottom: "0.75rem",
              }}
            >
              Socials
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                {
                  href: "https://www.youtube.com/@ChinnuaPoetofficial",
                  Icon: SiYoutube,
                  label: "YouTube",
                },
                { href: "https://x.com/CHINNUA_POET", Icon: SiX, label: "X" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.link"
                  title={label}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "rgba(255,248,238,0.9)",
                    border: "1px solid rgba(139,111,71,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8B6F47",
                    fontSize: "1.1rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => setSocialStyles(e.currentTarget, true)}
                  onMouseLeave={(e) => setSocialStyles(e.currentTarget, false)}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          onSubmit={handleSubmit}
          data-ocid="contact.panel"
          style={{
            background: "rgba(16,24,38,0.8)",
            border: "1px solid rgba(139,111,71,0.3)",
            borderRadius: 14,
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.1rem",
              color: "#3D2B1F",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Send a Message
          </h3>

          {sent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              data-ocid="contact.success_state"
              style={{
                background: "rgba(200,169,106,0.1)",
                border: "1px solid rgba(200,169,106,0.3)",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.85rem",
                color: "#D4A853",
                textAlign: "center",
              }}
            >
              Your message has been sent. ✨
            </motion.div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
          >
            <label
              htmlFor="contact-name"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(92,61,46,0.5)",
              }}
            >
              Name
            </label>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              required
              data-ocid="contact.input"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(139,111,71,0.3)",
                color: "#3D2B1F",
                fontFamily: "'Libre Baskerville', Georgia, serif",
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
          >
            <label
              htmlFor="contact-email"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(92,61,46,0.5)",
              }}
            >
              Email
            </label>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="your@email.com"
              required
              data-ocid="contact.input"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(139,111,71,0.3)",
                color: "#3D2B1F",
                fontFamily: "'Libre Baskerville', Georgia, serif",
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
          >
            <label
              htmlFor="contact-message"
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(92,61,46,0.5)",
              }}
            >
              Message
            </label>
            <Textarea
              id="contact-message"
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Your words..."
              required
              data-ocid="contact.textarea"
              rows={5}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(139,111,71,0.3)",
                color: "#3D2B1F",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.92rem",
                resize: "none",
              }}
            />
          </div>

          <Button
            type="submit"
            data-ocid="contact.submit_button"
            style={{
              background: "rgba(200,169,106,0.85)",
              border: "none",
              color: "#3D2B1F",
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontWeight: 600,
              boxShadow: "0 0 20px rgba(200,169,106,0.25)",
            }}
          >
            Send Message
          </Button>
        </motion.form>
      </motion.div>
    </div>
  );
}
