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
        syne: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
