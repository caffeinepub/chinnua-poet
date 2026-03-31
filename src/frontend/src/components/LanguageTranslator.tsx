import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी — Hindi" },
  { code: "ur", name: "اردو — Urdu" },
  { code: "es", name: "Español — Spanish" },
  { code: "fr", name: "Français — French" },
  { code: "ar", name: "العربية — Arabic" },
  { code: "zh-CN", name: "中文 — Chinese" },
  { code: "ja", name: "日本語 — Japanese" },
  { code: "pt", name: "Português — Portuguese" },
  { code: "ru", name: "Русский — Russian" },
  { code: "de", name: "Deutsch — German" },
  { code: "ko", name: "한국어 — Korean" },
  { code: "it", name: "Italiano — Italian" },
  { code: "tr", name: "Türkçe — Turkish" },
  { code: "bn", name: "বাংলা — Bengali" },
  { code: "sw", name: "Kiswahili — Swahili" },
  { code: "nl", name: "Nederlands — Dutch" },
  { code: "pl", name: "Polski — Polish" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "vi", name: "Tiếng Việt — Vietnamese" },
  { code: "th", name: "ภาษาไทย — Thai" },
  { code: "fa", name: "فارسی — Persian" },
  { code: "ms", name: "Bahasa Melayu — Malay" },
  { code: "ta", name: "தமிழ் — Tamil" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: object, elementId: string) => undefined;
      };
    };
  }
}

export default function LanguageTranslator() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject hidden Google Translate element
    if (!document.getElementById("google_translate_element")) {
      const el = document.createElement("div");
      el.id = "google_translate_element";
      el.style.display = "none";
      document.body.appendChild(el);
    }

    // Inject Google Translate script once
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            { pageLanguage: "en", autoDisplay: false },
            "google_translate_element",
          );
        }
      };
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Suppress Google Translate banner/frame
    const style = document.createElement("style");
    style.id = "hide-gt-bar";
    style.textContent = [
      ".goog-te-banner-frame{display:none!important}",
      ".goog-te-menu-frame{display:none!important}",
      "body{top:0!important}",
      ".skiptranslate{display:none!important}",
      "#google_translate_element{display:none!important}",
    ].join("");
    if (!document.getElementById("hide-gt-bar")) {
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    setOpen(false);
    const select = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement | null;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    }
  };

  const currentLabel =
    LANGUAGES.find((l) => l.code === currentLang)
      ?.name.split("—")[0]
      .trim() ?? "EN";

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Translate page"
        data-ocid="translator.button"
        style={{
          background: open
            ? "rgba(200,169,106,0.12)"
            : "rgba(200,169,106,0.06)",
          border: "1px solid rgba(200,169,106,0.25)",
          borderRadius: 6,
          padding: "0.28rem 0.55rem",
          cursor: "pointer",
          color: "#D4A853",
          display: "flex",
          alignItems: "center",
          gap: 5,
          transition: "all 0.2s",
          fontSize: "0.7rem",
          fontFamily: "'Libre Baskerville', Georgia, serif",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(200,169,106,0.5)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 10px rgba(200,169,106,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(200,169,106,0.25)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >
        <span style={{ fontSize: "0.85rem" }}>🌐</span>
        <span>{currentLabel}</span>
      </button>

      {open && (
        <div
          data-ocid="translator.dropdown_menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#F5ECD7",
            border: "1px solid rgba(200,169,106,0.3)",
            borderRadius: 8,
            padding: "0.4rem 0",
            zIndex: 300,
            minWidth: 210,
            maxHeight: 320,
            overflowY: "auto",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,169,106,0.05)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(200,169,106,0.2) transparent",
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              style={{
                width: "100%",
                background:
                  currentLang === lang.code ? "rgba(200,169,106,0.1)" : "none",
                border: "none",
                padding: "0.45rem 1rem",
                cursor: "pointer",
                textAlign: "left",
                color: currentLang === lang.code ? "#C8A96A" : "#8B6F47",
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "0.76rem",
                transition: "all 0.15s",
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(200,169,106,0.07)";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(245,230,211,0.9)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  currentLang === lang.code ? "rgba(200,169,106,0.1)" : "none";
                (e.currentTarget as HTMLButtonElement).style.color =
                  currentLang === lang.code ? "#C8A96A" : "#8B6F47";
              }}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
