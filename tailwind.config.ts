import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--c-base) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        raised: "rgb(var(--c-raised) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        faint: "rgb(var(--c-faint) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        signal: "rgb(var(--c-signal) / <alpha-value>)",
        danger: "rgb(var(--c-danger) / <alpha-value>)",
        ok: "rgb(var(--c-ok) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(2.6rem, 6.5vw, 4.6rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        title: ["clamp(1.9rem, 3.6vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        head: ["clamp(1.35rem, 2.2vw, 1.7rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
      },
      maxWidth: { reading: "68ch", shell: "1180px" },
      borderRadius: { card: "12px", chip: "6px", btn: "8px" },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.35" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        rise: "rise .6s cubic-bezier(.2,.7,.3,1) both",
        pulseDot: "pulseDot 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
