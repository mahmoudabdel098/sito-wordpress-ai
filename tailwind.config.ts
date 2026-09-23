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
        'accent-lime': '#ccff00',
      },
      fontFamily: {
        // Alias to the Inter variable loaded via next/font so `font-syne`
        // resolves to Inter (same font as the home hero). No visual drift
        // between home and /social — no more system-font fallback.
        syne: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
