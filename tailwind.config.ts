import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97316", // Neon Safety Orange
        dark: "#050505", // Deep Anthracite/Black
        card: "#0A0A0A", // Slightly lighter than bg
      },
    },
  },
  plugins: [],
};

export default config;

