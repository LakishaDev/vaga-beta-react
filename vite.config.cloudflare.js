// vite.config.cloudflare.js
// Optimizovana Vite konfiguracija za Cloudflare Pages SSR
// Koristi se za build servera sa: npm run build:server

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false, // Disable HMR za SSR
      babel: {
        plugins: [
          ["transform-react-remove-prop-types", { removeImport: true }],
        ],
      },
    }),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },

  build: {
    // SSR output - build server bundle
    ssr: "src/entry-server-cloudflare.jsx",
    outDir: "dist/server",

    // Target modernnog browsera
    target: "es2020",

    rollupOptions: {
      output: {
        format: "esm",
        // Bez hash-eva za lakši import
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },

    // Bez minifikacije SSR bundle-a (lakše debugovanje)
    minify: false,

    // Source maps za razvoj
    sourcemap: true,
  },

  ssr: {
    // Koje package-e MORAMO bundle-ovati
    noExternal: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-helmet-async",
      "framer-motion",
      "motion",
      "lucide-react",
      "@headlessui/react",
      "@react-three/fiber",
      "@react-three/drei",
      "three",
      "react-markdown",
      "remark-gfm",
      "rehype-raw",
    ],

    // Packages koji se ne mogu koristiti u Workers Runtime
    external: [
      "firebase-admin",
      "express",
      "compression",
      "fs",
      "path",
      "stream",
      "http",
    ],
  },

  // Environment varijable dostupne u SSR
  define: {
    "process.env.SSR": JSON.stringify(true),
  },

  // Dev server (samo informativno, SSR se koristi na production)
  server: {
    middlewareMode: true,
  },
});
