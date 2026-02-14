// src/entry-client-cloudflare.jsx
// Klijentska ulazna tačka za Cloudflare Pages SSR + CSR hybrid
// Hydratuje server-renderovani HTML i aktivira client-side routing
// Koristi hydrateRoot umesto createRoot za brže inicijalizacije

import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Renderuj klijentski bez hydrate-a da izbegnemo SSR/CSR mismatch
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

createRoot(container).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>,
);
