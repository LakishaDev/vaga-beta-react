import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// SSR Vite konfiguracija za Server-Side Rendering
// Omogućava React komponentama da se renderuju na serveru
// Klijent JSX fajl se koristi samo za hydration-a
export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      babel: {
        plugins: [
          ["transform-react-remove-prop-types", { removeImport: true }],
        ],
      },
    }),
    tailwindcss(),
  ],

  // Ignoriši Firebase pri optimizaciji
  optimizeDeps: {
    exclude: ["firebase", "firebase-admin"],
  },

  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },

  build: {
    target: "es2015",

    // SSR output konfiguracija
    ssr: "src/entry-server.jsx",

    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": [
            "framer-motion",
            "@headlessui/react",
            "@heroicons/react",
            "lucide-react",
            "react-icons",
          ],
        },
      },
    },

    // SSR manifesto za matching assets
    ssrManifest: true,

    // Dovoljno minimiziraj
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },

    chunkSizeWarningLimit: 1000,
  },

  // Dev server konfiguracija
  server: {
    middlewareMode: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },

  define: {
    "process.env.SSR": "true",
  },
});
