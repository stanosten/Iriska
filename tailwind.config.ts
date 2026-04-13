import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBF3E9",
        foreground: "#3D2B1F",
        accent: "#A88B4A",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-tenor-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
