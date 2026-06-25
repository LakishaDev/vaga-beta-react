import { designTokens } from "./src/configs/designTokens.js";
import { adminTheme } from "./src/configs/adminTheme.js";

export const content = ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    screens: {
      xs: "475px",
      "3xl": "1920px",
      "4xl": "2560px",
    },
    colors: {
      // New Cobalt Navy Design System
      brand: {
        primary: designTokens.colors.brand.primary,
        "primary-hover": designTokens.colors.brand.primaryHover,
        "primary-active": designTokens.colors.brand.primaryActive,
        secondary: designTokens.colors.brand.secondary,
        "secondary-hover": designTokens.colors.brand.secondaryHover,
        "secondary-active": designTokens.colors.brand.secondaryActive,
        accent: designTokens.colors.brand.accent,
        "accent-hover": designTokens.colors.brand.accentHover,
        "accent-active": designTokens.colors.brand.accentActive,
      },
      neutral: {
        bg: designTokens.colors.neutral.bg,
        surface: designTokens.colors.neutral.surface,
        "surface-tint": designTokens.colors.neutral.surfaceTint,
        border: designTokens.colors.neutral.border,
        "border-light": designTokens.colors.neutral.borderLight,
        "border-dark": designTokens.colors.neutral.borderDark,
      },
      text: {
        primary: designTokens.colors.text.primary,
        secondary: designTokens.colors.text.secondary,
        tertiary: designTokens.colors.text.tertiary,
        inverse: designTokens.colors.text.inverse,
        link: designTokens.colors.text.link,
        "link-hover": designTokens.colors.text.linkHover,
      },
      success: designTokens.colors.semantic.success,
      warning: designTokens.colors.semantic.warning,
      error: designTokens.colors.semantic.error,
      info: designTokens.colors.semantic.info,

      // Admin royal-blue theme (scoped to .admin-shell)
      admin: {
        primary: adminTheme.colors.primary,
        "primary-hover": adminTheme.colors.primaryHover,
        "primary-active": adminTheme.colors.primaryActive,
        accent: adminTheme.colors.accent,
        navy: adminTheme.colors.navy,
        "surface-tint": adminTheme.colors.surfaceTint,
        border: adminTheme.colors.border,
        "border-dark": adminTheme.colors.borderDark,
        text: adminTheme.colors.text,
        "text-muted": adminTheme.colors.textMuted,
      },

      // Legacy colors (for backward compatibility - will migrate gradually)
      bone: "#CBCFBB",
      midnight: "#1E3E49",
      sheen: "#6EAEA2",
      chestnut: "#8A4D34",
      outerspace: "#1A343D",
      rust: "#AD5637",
      bluegreen: "#91CEC1",
      charcoal: "#2F5363",
    },
    spacing: {
      ...designTokens.spacing,
    },
    borderRadius: {
      ...designTokens.radius,
    },
    boxShadow: {
      ...designTokens.shadow,
    },
    zIndex: {
      ...designTokens.zIndex,
    },
    animation: {
      "spin-reverse": "spin 1s linear infinite reverse",
      fadeIn: "fadeIn 200ms ease-in",
      fadeUp: "fadeUp 300ms ease-out",
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
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      fadeUp: {
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
    transitionDuration: {
      fast: designTokens.animation.fast,
      base: designTokens.animation.base,
      slow: designTokens.animation.slow,
      slower: designTokens.animation.slower,
    },
  },
  fontFamily: {
    sans: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif",
    ],
    body: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif",
    ],
    heading: [
      "Manrope",
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif",
    ],
    mono: ["Fira Code", "Courier New", "monospace"],
  },
};
export const plugins = [
  // eslint-disable-next-line no-undef
  require("@tailwindcss/forms"),
  // eslint-disable-next-line no-undef
  require("@tailwindcss/typography"),
];
