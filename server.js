// server.js
// Express SSR server za razvoj i produkciju
// Renderuje React komponentu na serveru i vraća HTML
// Koristi Vite SSR middleware za dev mode
// U produkciji čita build fajlove direktno

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";

const app = express();

// Direktiva za __dirname u ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Kompresija odgovora
app.use(compression());

// Vite dev server middleware (samo u development)
let render;
const environment = process.env.NODE_ENV || "development";

async function initVite(app) {
  if (environment === "development") {
    // Development mode - koristi Vite za hot reload
    const viteModule = await import("vite");
    const viteDev = await viteModule.createServer({
      appType: "ssr",
      server: { middlewareMode: true },
      ssr: {
        external: ["express", "compression"],
      },
    });

    // REDOSLED VAŽAN:
    // 1. Public folder static files
    app.use(express.static(path.resolve(__dirname, "public")));

    // 2. Vite middlewares za assets, CSS, JS bundove
    app.use(viteDev.middlewares);

    // 3. SSR render sa React Router - SAMO za "/" i stvarne rute
    app.get("*", async (req, res) => {
      // Preskoči asset zahteve koji nisu obrađeni od Vite-a
      if (
        req.path.includes(".json") ||
        req.path.startsWith("/.well-known") ||
        req.path.startsWith("/api")
      ) {
        return res.status(404).send("Not found");
      }

      try {
        const url = req.originalUrl;
        const helmetContext = {};

        render = (await viteDev.ssrLoadModule("src/entry-server.jsx")).render;

        if (!render) {
          return res.status(500).send("SSR server nije inicijalizovan");
        }

        const { html, helmet } = await render(url, helmetContext);

        const template = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf8",
        );

        const finalHtml = template
          .replace("<!--ssr-outlet-->", html)
          .replace(
            "</head>",
            `
          <title>${helmet?.title ? helmet.title.toComponent().join("") : "Vaga Beta"}</title>
          ${helmet?.meta ? helmet.meta.toComponent().join("") : ""}
          ${helmet?.link ? helmet.link.toComponent().join("") : ""}
          </head>`,
          )
          .replace(
            "</body>",
            `<script type="module" src="/src/entry-client.jsx"></script></body>`,
          );

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(finalHtml);
      } catch (error) {
        console.error("❌ SSR Error:", error.message);
        res
          .status(500)
          .send(
            `<h1>Server Error</h1><p>${error.message}</p><pre>${error.stack}</pre>`,
          );
      }
    });
  } else {
    // Production mode - učitaj iz dist/
    const entryPath = path.resolve(__dirname, "dist/server/entry-server.js");
    const { render: serverRender } = await import(entryPath);
    render = serverRender;

    // Static assets za prod
    app.use(express.static(path.resolve(__dirname, "dist/client")));
    app.use(express.static(path.resolve(__dirname, "public")));

    // SSR catch-all za prod
    app.get("*", async (req, res) => {
      if (
        req.path.includes(".json") ||
        req.path.startsWith("/.well-known") ||
        req.path.startsWith("/api")
      ) {
        return res.status(404).send("Not found");
      }

      try {
        const url = req.originalUrl;
        const helmetContext = {};

        if (!serverRender) {
          return res.status(500).send("SSR server nije inicijalizovan");
        }

        const { html, helmet } = await serverRender(url, helmetContext);

        const template = fs.readFileSync(
          path.resolve(__dirname, "dist/client/index.html"),
          "utf8",
        );

        const finalHtml = template.replace("<!--ssr-outlet-->", html).replace(
          "</head>",
          `
          <title>${helmet?.title ? helmet.title.toComponent().join("") : "Vaga Beta"}</title>
          ${helmet?.meta ? helmet.meta.toComponent().join("") : ""}
          ${helmet?.link ? helmet.link.toComponent().join("") : ""}
          </head>`,
        );

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(finalHtml);
      } catch (error) {
        console.error("❌ SSR Error:", error.message);
        res
          .status(500)
          .send(
            `<h1>Server Error</h1><p>${error.message}</p><pre>${error.stack}</pre>`,
          );
      }
    });
  }
}
const port = process.env.PORT || 3000;

initVite(app)
  .then(() => {
    app.listen(port, () => {
      console.log(`\n✅ SSR Server pokrenut!`);
      console.log(`📍 http://localhost:${port}`);
      console.log(`🔧 Environment: ${environment}`);
      console.log("");
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start SSR server:", error);
    process.exit(1);
  });
