// src/entry-server-cloudflare.jsx
// Cloudflare Workers-kompatibilan SSR entry point
// Koristi renderToString (ne renderToPipeableStream jer nije kompatibilan sa Workers)

import { renderToString } from "react-dom/server";
import React from "react";
import { StaticRouter } from "react-router-dom";
import App from "./App";

// Mock HelmetProvider za SSR (preko Helmet će biti dodano kasnije)
const HelmetProvider = ({ children }) => children;

/**
 * Renderuje React aplikaciju u HTML string za Cloudflare Workers
 * @param {string} url - Request URL path
 * @returns {Promise<{html: string, helmet: object}>}
 */
export async function render(url) {
  const helmetContext = {};

  try {
    // Renderuj React app u HTML string
    const html = renderToString(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>,
    );

    // Izvuci helmet podatke POSLE renderovanja
    const { helmet } = helmetContext;

    return {
      html,
      helmet,
    };
  } catch (error) {
    console.error("React SSR render error:", error);
    throw error;
  }
}
