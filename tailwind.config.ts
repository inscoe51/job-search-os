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
        ink: "#13212f",
        surface: "#f5f1e8",
        panel: "#fffdf8",
        accent: "#1f6f5f",
        danger: "#a33f2f",
        caution: "#9a6a12"
      },
      boxShadow: {
        card: "0 10px 30px rgba(19, 33, 47, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
