// src/entry-client-cloudflare.jsx
// Klijentska ulazna tačka za Cloudflare Pages SSR + CSR hybrid
// Hydratuje server-renderovani HTML i aktivira client-side routing
// Koristi hydrateRoot umesto createRoot za brže inicijalizacije

import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Hydratuj sa BrowserRouter - router će automatski čitati window.location
// NAPOMENA: StrictMode je onemogućen jer SSR ne koristi StrictMode
// što bi uzrokovalo hydration mismatch
hydrateRoot(
  document.getElementById("root"),
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>,
);
