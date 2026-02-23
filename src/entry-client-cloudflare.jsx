// src/entry-client-cloudflare.jsx
// Klijentska ulazna tačka za Cloudflare Pages SSR + CSR hybrid
// Ako postoji server-renderovani HTML koristi hydrateRoot, inače createRoot

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

const app = (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

createRoot(container).render(app);
