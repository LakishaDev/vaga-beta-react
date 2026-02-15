// src/main.jsx
// Ulazna tačka React aplikacije za Cloudflare Pages
// Renderuje glavnu App komponentu sa BrowserRouter za CSR
// Učitava globalne stilove iz index.css

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
