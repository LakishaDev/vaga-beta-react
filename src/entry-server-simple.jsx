// src/entry-server-simple.jsx - Minimal SSR entry for testing
// Ovo je jednostavnija verzija bez Routera za testiranje

import { renderToString } from "react-dom/server";
import React from "react";

/**
 * Minimalna SSR render funkcija za testiranje
 * @param {string} url - Request URL path
 * @returns {Promise<{html: string, helmet: object}>}
 */
export async function render(url) {
  try {
    // Jednostavna React komponenta za testiranje
    const TestComponent = () =>
      React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Vaga Beta - SSR Test</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              </head>
              <body>
                <div id="root">
                  <h1>✅ SSR Works!</h1>
                  <p>Request URL: ${url}</p>
                  <p>Server-rendered at: ${new Date().toISOString()}</p>
                </div>
                <script>console.log('SSR HTML loaded')</script>
              </body>
            </html>
          `,
        },
      });

    // Renderuj React app u HTML string
    const html = renderToString(React.createElement(TestComponent));

    return {
      html,
      helmet: {},
    };
  } catch (error) {
    console.error("React SSR render error:", error);
    throw error;
  }
}
