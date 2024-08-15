import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)", "sans-serif"],
      },
      screens: {
        m: { max: "1068px" },
        s: { max: "768px" },
        xs: { max: "420px" },
      },
      maxWidth: {
        "container-l": "1048px",
        "container-m": "744px",
        "container-s": "335px",
      },
      // ex) className : text-title
      fontSize: {
        title: ["28px", "1.2"],
        subtitle: ["20px", "1.2"],
        base: ["16px", "1.5"],
        baseS: ["14px", "1.6"],
        baseXs: ["12px", "1.6"],
      },
      // ex) className : font-title
      fontWeight: {
        title: "700",
        subtitle: "600",
        baseBold: "500",
        base: "400",
      },
      /* ex) 배경 색상 변경 className : bg-primary
         ex) 텍스트 색상 변경 className : text-fillNormal
      */
      colors: {
        background: "#212121",
        primary: "#C3E88D",
        primaryStrong: "#ACDF62",
        primaryHeavy: "#96D738",
        fontWhite: "#F7F7F7",
        fillLight: "#3B3D3F",
        fillNormal: "#323334",
        fillNeutral: "#2D2D2F",
        fillAssistive: "#28282A",
        fillAlternative: "#19191A",
        fillStrong: "#141415",
        labelNormal: "#C4C4C4",
        labelStrong: "#F7F7F7",
        labelNeutral: "#919191",
        labelAssistive: "#5E5E5E",
        labelDisabled: "#454545",
        labelAlternative: "#2B2B2B",
        statusPositive: "#05CE55",
        statusCautionary: "#FFA902",
        statusDestructive: "#FF3F02",
        accentOrange: "#FAC66A",
        accentMaya: "#82AAFF",
        accentPurple: "#C792E9",
        accentRed: "#E86E75",
        accentMint: "#A0E7B8",
        accentColumbia: "#88DDFF",
        accentPink: "#FAA6C9",
        accentYellow: "#FFE350",
      },
      /* box shadow */
      boxShadow: {
        custom:
          "0px 2px 8px 0px rgba(0, 0, 0, 0.12), 0px 1px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 1px 0px rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(-10%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        bounce: "bounce 0.5s infinite",
      },
    },
  },
  variants: {
    extend: {
      animation: ["hover"],
    },
  },

  plugins: [require("tailwind-scrollbar-hide")],
};

export default config;
