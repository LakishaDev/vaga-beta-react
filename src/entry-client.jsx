// src/entry-client.jsx
// SSR klijentska ulazna tačka - hydratuje server-renderovani HTML
// Zamenjuje src/main.jsx kada je SSR enabled
// Koristi hydrateRoot umesto createRoot za brže inicijalizacije

import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

hydrateRoot(
  document.getElementById("root"),
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
