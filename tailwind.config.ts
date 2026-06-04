import type { Config } from "tailwindcss";

// Ported verbatim from misraje-site (the design canon). The palette, editorial
// scale, letter-spacing tokens, and animations are shared across the Misraje
// family of neighborhood sites. Site-specific values live in lib/site-config.ts,
// not here.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Misraje brand — sampled from the existing sites
        navy: {
          950: "#0A1F3D", // primary background
          900: "#0F2547", // section background
          800: "#143057", // card background
          700: "#1A3D6B", // border / hover
        },
        royal: {
          700: "#194E8F",
          600: "#1E5BA8", // CTA buttons
          500: "#2A6BC0",
        },
        gold: {
          600: "#B8973F",
          500: "#C8A75B", // accent underline, hairlines
          400: "#D4B872",
        },
        ink: {
          50: "#F5F7FA",
          100: "#E8EDF2", // body copy on navy
          200: "#B8C2D1", // muted body
          300: "#8794A8", // captions / labels
        },
      },
      fontFamily: {
        // Display: a refined sans for headings & wordmark
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        // Body: a clean humanist sans
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        // Editorial accent: a classy serif for pull quotes and hero titles
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
      },
      letterSpacing: {
        wordmark: "0.22em",
        eyebrow: "0.25em",
        nav: "0.12em",
      },
      fontSize: {
        // Editorial scale
        eyebrow: ["11px", { lineHeight: "1.4", letterSpacing: "0.25em" }],
        hero: ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        display: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1" }],
      },
      maxWidth: {
        prose: "65ch",
        editorial: "1280px",
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 1.2s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
