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
        // Core Primary & Secondary from Pop Culture Brand Deck
        primary: "#D73B3A", // Scarlet Rush
        bg: "#FFF8EE", // Floral White
        secondary: "#B1847D", // Rosy Taupe (corrected from deck typo)
        espresso: "#522C28", // Espresso Dark
        dark: "#522C28", // Espresso

        // Accent Colours from Pop Culture Brand Deck Slide 17
        accent: {
          rose: "#C66B8E", // Dusty Rose / Mauve
          yellow: "#FAC537", // Warm Yellow / Golden
          red: "#ED0006", // Vibrant Red
          green: "#3CA837", // Kelly Green
          lime: "#93BF56", // Lime / Sage Green
          // Legacy mappings for backwards-compatibility
          pink: "#C66B8E",
          gold: "#FAC537",
          orange: "#F79E1B",
        },
      },
      fontFamily: {
        display: ["var(--font-lilita)", "'Lilita One'", "cursive", "sans-serif"],
        heading: ["var(--font-lilita)", "'Lilita One'", "cursive", "sans-serif"],
        sans: ["var(--font-manrope)", "'Manrope'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        body: ["var(--font-manrope)", "'Manrope'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
