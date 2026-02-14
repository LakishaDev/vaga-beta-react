import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimizuj React refresh
      fastRefresh: true,
      // Babel opcije za optimizaciju
      babel: {
        plugins: [
          // Ukloni prop-types u production
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

  // Build optimizacije
  build: {
    // Target modernih browsera za manje bundleove
    target: "es2015",

    // Optimizuj chunk strategiju
    rollupOptions: {
      output: {
        // Manual chunking SAMO za client build, ne za SSR
        ...(process.env.SSR_BUILD !== "true" && {
          manualChunks: {
            // Vendor chunks
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": [
              "framer-motion",
              "@headlessui/react",
              "@heroicons/react",
              "lucide-react",
              "react-icons",
            ],
            "three-vendor": ["@react-three/fiber", "@react-three/drei"],
            // Utils chunks
            "markdown-vendor": ["react-markdown", "remark-gfm", "rehype-raw"],
          },
        }),

        // Optimizuj imena fajlova za production
        // Za SSR: bez hash-eva, za client: sa hash-evima
        chunkFileNames:
          process.env.SSR_BUILD === "true"
            ? "assets/js/[name].js"
            : "assets/js/[name]-[hash].js",

        entryFileNames:
          process.env.SSR_BUILD === "true"
            ? "entry-server-cloudflare.js"
            : "assets/js/[name]-[hash].js",

        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp|avif)$/.test(name ?? "")) {
            return "assets/images/[name]-[hash][extname]";
          }
          if (/\.css$/.test(name ?? "")) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },

    // Compression i minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Ukloni console.log u production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"], // Ukloni specifične funkcije
        passes: 2, // Više prolaza za bolju optimizaciju
      },
      mangle: {
        safari10: true, // Safari 10+ kompatibilnost
      },
      format: {
        comments: false, // Ukloni sve komentare
      },
    },

    // Source maps samo za debugging (može se isključiti u produkciji)
    sourcemap: false,

    // Chunk size optimizacija
    chunkSizeWarningLimit: 1000,

    // CSS optimizacija
    cssCodeSplit: true,
    cssMinify: true,

    // Reportovanje bundle size-a
    reportCompressedSize: true,
  },

  // Server konfiguracija za development
  server: {
    port: 3000,
    open: false,
    cors: true,
    compress: true,
    // Za SSR, isključi HMR - koristi page refresh umesto
    hmr: false,
    watch: {
      // Ignoriraj određene fajlove iz watch-a
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    },
  },

  // Preview server konfiguracija
  preview: {
    port: 4173,
    open: true,
  },

  // Optimizacija dependency pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "firebase",
      "framer-motion",
    ],
    exclude: ["@react-three/fiber", "@react-three/drei"], // Exclude large 3D libs from pre-bundling
  },

  // SSR build konfiguracija
  ssr: {
    // Bundleuj sve dependencies za SSR (jer Workers Runtime nema npm)
    noExternal: [
      "react",
      "react-dom",
      "react-router-dom",
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
      "react-icons",
      "@heroicons/react",
      "lenis",
    ],
    // Packages which cannot be used in Workers Runtime
    external: [
      "firebase-admin",
      "express",
      "compression",
      "node:fs",
      "node:path",
      "node:stream",
      "node:http",
      "react-helmet-async", // Exclude helmet-async za sada
    ],
  },

  // CSS preprocessor opcije
  css: {
    devSourcemap: true,
  },

  // Environment varijable prefix
  envPrefix: "VITE_",

  // Esbuild opcije za transpilaciju
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    legalComments: "none", // Ukloni legal komentare
  },
});
