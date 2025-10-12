export const content = ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      bone: "#CBCFBB",
      midnight: "#1E3E49",
      sheen: "#6EAEA2",
      chestnut: "#8A4D34",
      outerspace: "#1A343D",
      rust: "#AD5637",
      bluegreen: "#91CEC1",
      charcoal: "#2F5363",
    },
    animation: {
      "spin-reverse": "spin 1s linear infinite reverse",
    },
    backdropBlur: {
      xs: "2px",
      "3xl": "64px",
    },
    keyframes: {
      "fade-in-up": {
        "0%": {
          opacity: "0",
          transform: "translateY(20px)",
        },
        "100%": {
          opacity: "1",
          transform: "translateY(0)",
        },
      },
    },
  },
  fontFamily: {
    sans: ["Geist", "Inter", "sans-serif"],
  },
};
export const plugins = [
  // eslint-disable-next-line no-undef
  require("@tailwindcss/forms"),
  // eslint-disable-next-line no-undef
  require("@tailwindcss/typography"),
];
