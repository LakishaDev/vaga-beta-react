/**
 * Vite Configuration za R2 Cache
 * Dodaj ovo u tvoj vite.config.js ako trebaš custom build rules
 */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Resolving
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },

  // Environment variables
  define: {
    __R2_ENABLED__: true,
    __R2_WORKER_URL__: JSON.stringify(
      process.env.VITE_R2_WORKER_URL || "https://cache.vaga-beta.rs",
    ),
  },

  // Build optimization
  build: {
    rollupOptions: {
      output: {
        // Chunk strategija - izdvoji R2 servise u poseban chunk
        manualChunks: {
          r2: ["./src/services/R2CacheService.js", "./src/hooks/useR2Cache.js"],
        },
      },
    },
    // Minifikacija
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
      },
    },
  },

  // Optimizacije
  optimizeDeps: {
    include: ["react", "react-dom", "react-hot-toast"],
  },

  // Server konfiguracija
  server: {
    proxy: {
      "/cache": {
        target: process.env.VITE_R2_WORKER_URL || "http://localhost:8787",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cache/, ""),
      },
    },
  },
});
