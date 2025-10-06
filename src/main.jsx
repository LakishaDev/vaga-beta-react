// src/main.jsx
// Ulazna tačka React aplikacije
// Renderuje glavnu App komponentu unutar StrictMode
// Učitava globalne stilove iz index.css
// Koristi React 18 createRoot API
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
