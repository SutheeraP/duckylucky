import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");
// const fonts = require("tailwindcss/fontFamily");



const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#EAA800',
        secondary: '#EAA800',
      },
      // fontFamily: {
      //   'Mali': ['Mali', 'sans-serif'],
      //   // Rampart: ["Rampart One", "cursive"],
      // },
      margin: {
        '-46':'-11.5rem'
      },
      inset: {
        '23':'5.75rem'
      },
      spacing: {
        '34':'8.5rem'
      }
    },

  },
  plugins: [],
};
export default config;
