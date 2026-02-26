// src/entry-client-cloudflare.jsx
// Klijentska ulazna tačka za Cloudflare Pages SSR + CSR hybrid
// Ako postoji server-renderovani HTML koristi hydrateRoot, inače createRoot

import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const app = (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

const hasServerMarkup = container.hasChildNodes();

if (hasServerMarkup) {
  hydrateRoot(container, app, {
    onRecoverableError: (error) => {
      if (import.meta.env.DEV) {
        console.error("Recoverable hydration error:", error);
      }
    },
  });
} else {
  createRoot(container).render(app);
}
