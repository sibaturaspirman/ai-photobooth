import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    animation: {
      marquee: "marquee 5s linear infinite",
      marquee2: "marquee2 5s linear infinite",
      marquee3: "marquee3 5s linear infinite",
      marquee4: "marquee4 5s linear infinite",
    },
    keyframes: {
      marquee: {
        "0%": { transform: "translateX(0%)" },
        "100%": { transform: "translateX(-100%)" },
      },
      marquee2: {
        "0%": { transform: "translateX(100%)" },
        "100%": { transform: "translateX(0%)" },
      },
      marquee3: {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(0%)" },
      },
      marquee4: {
        "0%": { transform: "translateX(0%)" },
        "100%": { transform: "translateX(100%)" },
      },
    },
  },
  plugins: [],
};
export default config;