import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable dark mode with the "dark" class
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        black: "",
        blueSoft: "0px 4px 4px 0px rgba(0, 51, 153, 0.25)",
      },
      colors: {
        primary: "#003399",
        darkPrimary: "#001F5C",
        gray1: "#E6EBF5",
        gray2: "#5C6370",
        gray3: "#98A2B3",
        gray4: "#E6EBF5",
        secondaryGreen: "#CFF8E0",
        ////////////////////////////////////
        darkBackground: "#1A1A1A",
        darkText: "#E6EBF5",
        darkLBg: "#333333",

        ////////////////////////////////////
        darkPrimary1: "#00297A",
        labelBlue: "#00143D",
        grayText: "#8F96A3",
        grayText2: "#717E95",
        lightgreen: "#E7FCF0",
        disabledBg: "#F4F6FB",
        disabledText: "#99ADD6",
        disabledBgBorder: "#CCD6EB",
        grayBg: "#E6EBF5",
        grayBg1: "#E3E5E8",
        grayBg2: "#EDF0F8",

        primaryGreen: "#0DDE65",

        tertiaryGreen: "#08853D",
        placeholderText: "#C7CBD1",
        lightred: "#fbd0cf",
        errorRed: "#FF2424",
        layoutBg: "#F0F3F9",
        activeCarousel: "#C4CFE7",
        ////yellow
        yellow: "#ffff00",
        amber1: "#FF9B19",
        amber2: "#FFE4C2",
        ////blue
        blue1: "#E6F8FE",
        blue2: "#9AE0F8",
        blue3: "#016A8F",
        blue4: "#6685C2",
        ///// red
        red1: "#FF5051",

        ////dark mode
        darkBgLayout: "#17191C",
        darkBgPrimary: "#454A54",
        darkBgSecondary: "#5C6370",
      },
      screens: {
        xs: "400px",
        xss: "480px",
        sm: "640px",
        sm1: "740px",
        md: "768px",
        md1: "880px",
        mdd: "926px",
        lg: "1050px",
        lg1: "1091px",
        xl: "1220px",
        xl1: "1300px",
        xl2: "1350px",
        "2xl": "1536px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-out forwards",
        shake: "shake 0.5s ease-in-out",
      },
    },
    fontFamily: {
      regular: ["Sequel Sans Regular", "sans-serif"],
      romanDisp: ["Sequel Sans Roman", "sans-serif"],
      semibold: ["Sequel Sans SemiBold", "sans-serif"],
      bold: ["Sequel Sans Bold", "sans-serif"],
    },
  },
  plugins: [],
};

export default config;
