// src/entry-server.jsx
// SSR ulazna tačka - renderuje React komponentu na serveru
// Vraća HTML string koji se šalje klijentu
// Koristi streaming SSR koji podržava Suspense

import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "stream";
import pkg from "react-helmet-async";
const { HelmetProvider } = pkg;
import { StaticRouter } from "react-router-dom";
import App from "./App";

export async function render(url, helmetContext = {}) {
  const context = helmetContext;

  const html = await new Promise((resolve, reject) => {
    let htmlBuffer = "";
    let didError = false;
    let settled = false;

    const writable = new Writable({
      write(chunk, _encoding, callback) {
        htmlBuffer += chunk.toString();
        callback();
      },
    });

    const stream = renderToPipeableStream(
      <HelmetProvider context={context}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady() {
          stream.pipe(writable);
        },
        onError(error) {
          didError = true;
          if (!settled) {
            settled = true;
            reject(error);
          }
        },
      },
    );

    writable.on("finish", () => {
      if (!didError && !settled) {
        settled = true;
        clearTimeout(abortTimeout);
        resolve(htmlBuffer);
      }
    });

    const abortTimeout = setTimeout(() => {
      stream.abort();
    }, 10000);
  });

  const helmet = context.helmet;

  return {
    html,
    helmet,
  };
}
