import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
      screens: {
        "max-513": { max: "513px" },
        sm: "640px",
        md: "768px",
        lg: "992px",
        xl: "1280px",
        xxl: "1450px",
      },
    },
    fontFamily: {
      primary: "var(--font-robotoSlab)",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "soft-green": "0px 10px 50px #E1EACD",
      },
      colors: {
        primary: "#609084",
        secondary: "#BAD8B6",
        thirdly: "#E1EACD",
        light: "#EBEFD6",
        red: "#CC0000",
        green: "#00A010",
        superlight: "white",
      },
      keyframes: {
        motion: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(3px)" },
        },
        roadAnimation: {
          "0%": { transform: "translateX(0px)" },
          "100%": { transform: "translateX(-350px)" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
      animation: {
        motion: "motion 1s linear infinite",
        roadAnimation: "roadAnimation 1.4s linear infinite",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        bounce: "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
