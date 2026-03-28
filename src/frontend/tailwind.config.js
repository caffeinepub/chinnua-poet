import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        cinzel: ["'PlayfairDisplay'", "Georgia", "serif"],
        playfair: ["'Playfair Display'", "Georgia", "serif"],
        cormorant: ["'Cormorant Garamond'", "Georgia", "serif"],
        baskerville: ["'Libre Baskerville'", "Georgia", "serif"],
        lora: ["'Lora'", "'Cormorant Garamond'", "Georgia", "serif"],
        parisienne: ["'Parisienne'", "cursive"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: { DEFAULT: "oklch(var(--primary) / <alpha-value>)", foreground: "oklch(var(--primary-foreground))" },
        secondary: { DEFAULT: "oklch(var(--secondary) / <alpha-value>)", foreground: "oklch(var(--secondary-foreground))" },
        destructive: { DEFAULT: "oklch(var(--destructive) / <alpha-value>)", foreground: "oklch(var(--destructive-foreground))" },
        muted: { DEFAULT: "oklch(var(--muted) / <alpha-value>)", foreground: "oklch(var(--muted-foreground) / <alpha-value>)" },
        accent: { DEFAULT: "oklch(var(--accent) / <alpha-value>)", foreground: "oklch(var(--accent-foreground))" },
        popover: { DEFAULT: "oklch(var(--popover))", foreground: "oklch(var(--popover-foreground))" },
        card: { DEFAULT: "oklch(var(--card))", foreground: "oklch(var(--card-foreground))" },
        chart: { 1: "oklch(var(--chart-1))", 2: "oklch(var(--chart-2))", 3: "oklch(var(--chart-3))", 4: "oklch(var(--chart-4))", 5: "oklch(var(--chart-5))" },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        /* Warm palette tokens */
        warm: {
          bg: "#FFF8EE",
          paper: "#F5ECD7",
          brown: "#8B6F47",
          mocha: "#5C3D2E",
          gold: "#D4A853",
          "gold-light": "#F0D080",
          cream: "#FFFDF5",
          text: "#3D2B1F",
          muted: "#9E8070",
        },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        gold: "0 0 20px rgba(212,168,83,0.2)",
        "gold-lg": "0 0 40px rgba(212,168,83,0.3)",
        warm: "0 4px 20px rgba(92,61,46,0.12)",
        "warm-lg": "0 8px 40px rgba(92,61,46,0.18)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        confetti: { "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" }, "100%": { transform: "translateY(100px) rotate(360deg)", opacity: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
        confetti: "confetti 2s ease-out forwards",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
