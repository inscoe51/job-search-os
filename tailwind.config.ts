import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18232f",
        canvas: "#f3f0e8",
        surface: "#ece7dc",
        panel: "#fffdfa",
        muted: "#5f6b75",
        line: "#d6d0c3",
        accent: "#1d6158",
        "accent-strong": "#154b43",
        "accent-soft": "#dcebe6",
        danger: "#9f4133",
        "danger-soft": "#f3dfd9",
        caution: "#8f6518",
        "caution-soft": "#f3ead2"
      },
      boxShadow: {
        card: "0 14px 36px rgba(24, 35, 47, 0.08)",
        elevated: "0 20px 48px rgba(24, 35, 47, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
