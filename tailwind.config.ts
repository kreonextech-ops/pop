import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette from DESIGN_BLUEPRINT.md
        primary: "#D73B3A", // Scarlet Rush
        bg: "#FFF8EE", // Floral White
        secondary: "#C9E4E7", // Rosy Taupe / Mist
        dark: "#522C28", // Espresso

        // Accent Colours from DESIGN_BLUEPRINT.md
        accent: {
          pink: "#D26D99", // Berry Pink
          yellow: "#FFCD3C", // Sunshine Yellow
          red: "#FB0008", // Poppy / Vivid Red
          green: "#4AAC31", // Kelly Green
          lime: "#92C358", // Lime Green
          orange: "#F37D20", // Tangerine Orange
          gold: "#FCC434", // Amber Gold
        },
      },
      fontFamily: {
        display: ["'Lilita One'", "var(--font-lilita)", "cursive", "sans-serif"],
        body: ["'Lilita One'", "var(--font-lilita)", "cursive", "sans-serif"],
        sans: ["'Lilita One'", "var(--font-lilita)", "cursive", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
