# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vaga Beta — React 19 + Vite 7 marketing site + e-commerce ("Prodavnica") for a Serbian scales/measuring-equipment company. Backed by Firebase (Auth, Firestore, Storage, App Check) and deployed to Cloudflare Pages with hybrid SSR (SSR for marketing pages, CSR for shop). User-facing copy is in Serbian.

## Common commands

```bash
npm run dev                # Vite dev server on :3000
npm run dev:ssr            # Express SSR dev server (server.js)
npm run lint               # ESLint over the repo
npm run build              # Client-only build (generates sitemap first)
npm run build:hybrid       # Client + SSR server bundle for Cloudflare
npm run build:cloudflare   # Full Cloudflare build incl. SEO smoke + sitemap
npm run deploy:cloudflare  # build:cloudflare + wrangler pages deploy
npm run preview:hybrid     # Local wrangler pages dev against dist/
npm run env:check          # Validate required VITE_* env vars
npm run seo:smoke:local    # SEO smoke test against local build
npm run seo:smoke:live     # SEO smoke test against production
npm run analyze            # vite build --mode analyze (bundle inspection)
```

There is no test runner configured. "Tests" in this repo means SEO/image smoke scripts under `scripts/` (`seo-smoke-test.mjs`, `image-smoke-test.mjs`) and ad-hoc `*.mjs` files at the root (`test-ssr.mjs`, `simple-test.mjs`). Run them directly with `node`.

The shell on this machine is PowerShell — use PowerShell syntax for one-offs (`$env:VAR`, not `export`).

## Architecture

### Two apps, one bundle
`src/App.jsx` decides at runtime — based on `location.pathname` — whether to render the **marketing site** (Navbar/Footer + lazy `Home/Usluge/Kontakt/Onama/...` routes) or the **shop** (`src/Prodavnica.jsx`, mounted for `/prodavnica*` and `/p/*`). The shop has its own Navbar/Footer, providers (`AuthProvider`, `CartProvider`, `SnackbarProvider`), and admin routes. When adding a route, decide which half it belongs to and edit the corresponding file.

### SSR / hybrid rendering
There are multiple entry points; pick the right one:
- `src/entry-client.jsx` / `src/entry-client-cloudflare.jsx` — browser hydration.
- `src/entry-server.jsx` / `src/entry-server-simple.jsx` — Node Express SSR (`server.js`, `vite.config.ssr.js`).
- `src/entry-server-cloudflare.jsx` — Workers-runtime SSR via `renderToReadableStream`. Built with `SSR_BUILD=true` into `dist/.server/` then copied by `scripts/copy-server-build.js`.

`functions/_middleware.js` is the Cloudflare Pages Functions middleware that selects SSR vs static for each request and injects Firestore-fetched data (e.g. promo banner) into the HTML shell. SSR-incompatible packages are listed in `vite.config.js` under `ssr.external` (`firebase-admin`, `express`, `compression`, `react-helmet-async`); SSR-bundled deps live in `ssr.noExternal`. When adding a dependency that touches Node APIs, update one of these lists or SSR will break in Workers.

`react-helmet-async` is **excluded** from SSR — `entry-server-cloudflare.jsx` uses an inline mock `HelmetProvider`. Don't assume helmet output is available server-side.

App must remain SSR-safe: never call `useLocation` above the Router, always guard `window`/`document` access with `typeof window !== "undefined"`, and use `suppressHydrationWarning` on elements whose content legitimately differs between server and client (see `App.jsx`).

### Firebase
`src/utils/firebase.js` and `src/services/firebase.js` initialize the client SDK; `firestore.rules` is the source of truth for security. `VITE_ADMIN_EMAILS` (comma-separated) gates admin UI. App Check uses reCAPTCHA v3 — `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` is needed locally. Required env vars are validated by `scripts/check-required-env.mjs` (run via `npm run env:check`, also part of `build:prod`).

### R2 cache layer
`src/services/R2CacheService.js` + `src/contexts/R2CacheContext.jsx` + `src/workers/r2-cache-worker.js` (Cloudflare Worker, deployed via `wrangler.workers.toml`) implement a Firestore→R2 cache for product/image data, with Firebase auth verification on the worker side. The worker is a separate deployable from Pages — don't conflate `wrangler.toml` (Pages) and `wrangler.workers.toml` (Worker).

### Build chunking
`vite.config.js` pins manual chunks (`react-vendor`, `ui-vendor`, `three-vendor`, `markdown-vendor`) but **only for client builds** (`SSR_BUILD !== "true"`); SSR build emits a single `entry-server-cloudflare.js`. Terser drops `console.log`/`console.info` in production, so don't rely on console output post-build.

### Routing conventions
- Marketing routes: in `App.jsx` Routes block.
- Shop routes: in `Prodavnica.jsx`, paths prefixed with `/prodavnica` or `/p/` (product details use slugs via `src/services/productSlugService.js` / `src/utils/slugUtils.js`).
- Lazy-load page components with `React.lazy` + `Suspense fallback={<Loader />}` (existing pattern in both files).

### Path alias
`@/` resolves to `src/` (configured in `vite.config.js`).

## Docs map

`docs/` is organized by topic — `admin-panel/`, `design/`, `features/`, `deployment/`, `setup/`, `testing/`, `plans/`, `summaries/`, `changelog/`. Browse `docs/README.md` for the index. Several top-level `*.md` files (`CLOUDFLARE_DEPLOYMENT.md`, `SSR_SETUP_QUICK_START.md`, `SECURITY_GUIDE.md`) cover deployment-specific runbooks.
