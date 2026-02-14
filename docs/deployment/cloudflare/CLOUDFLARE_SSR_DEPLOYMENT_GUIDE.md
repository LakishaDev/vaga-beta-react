# 🚀 Cloudflare Pages SSR Deployment Guide

**Datum kreiranja**: 14. februar 2026.  
**Status**: Implementation Required  
**Cilj**: Omogućiti Server-Side Rendering na Cloudflare Pages

---

## 📊 Trenutno Stanje

### ✅ Šta Trenutno Radi

**Lokalni SSR Development**:

```bash
npm run dev:ssr          # Express server sa SSR-om
npm run build:ssr        # SSR build proces
npm run serve:ssr        # Production SSR server (lokalno)
```

**Postojeća infrastruktura**:

- ✅ `server.js` - Express SSR server (Node.js)
- ✅ `src/entry-server.jsx` - SSR render funkcija
- ✅ `src/entry-client.jsx` - Client-side hydration
- ✅ `vite.config.ssr.js` - SSR build konfiguracija
- ✅ React Router sa StaticRouter za SSR
- ✅ react-helmet-async za meta tags

### ❌ Šta Ne Radi na Cloudflare Pages

**Problem**: Express server se **ne može koristiti** na Cloudflare Pages!

**Razlog**:

- Cloudflare Pages koristi **Workers Runtime**, ne Node.js
- `server.js` koristi Node.js specifične module (`express`, `fs`, `stream`)
- Workers Runtime nema pristup Node.js API-ima

**Trenutni deployment**:

```bash
npm run build              # CSR (Client-Side Rendering) build
git push origin main       # Auto-deploy na Cloudflare Pages
```

→ Aplikacija radi, ali **bez SSR-a** - sve se renderuje u browser-u

---

## 🎯 Opcije za SSR na Cloudflare Pages

Cloudflare Pages podržava **2 pristupa** za SSR:

### Opcija 1: **Cloudflare Pages Functions** ⭐ (PREPORUČENO)

**Kako radi**:

- Serverless funkcije u `/functions` folderu
- Automatski se deployuju sa aplikacijom
- Pokreću se samo kada se pozovu (cold start 0-50ms)

**Arhitektura**:

```
/functions
  /_middleware.js          ← SSR middleware (presreće sve zahteve)
  /api                     ← (opcionalno) API routes
    /[...slug].js          ← Dynamic API endpoints
```

**Prednosti**:

- ✅ Jednostavna implementacija
- ✅ Automatski scaling
- ✅ Ugrađen u Cloudflare Pages (nema dodatnih konfiguracija)
- ✅ Može kombinovati SSR + CSR (hybrid)

**Mane**:

- ⚠️ Cold start latency (0-50ms)
- ⚠️ Memory limit: 128MB
- ⚠️ CPU time limit: 50ms wall time (za free tier), 500ms (za Pro)

---

### Opcija 2: **Advanced Mode (\_worker.js)**

**Kako radi**:

- Custom Cloudflare Worker u root folderu
- Potpuna kontrola nad request lifecycle-om
- Zahteva manual konfiguraciju

**Arhitektura**:

```
/_worker.js               ← Custom Worker koji obrađuje SVE zahteve
/dist                     ← Static assets
```

**Prednosti**:

- ✅ Potpuna kontrola
- ✅ Može koristiti Cloudflare KV, R2, D1
- ✅ Lower latency (nema cold start-a posle prvog zahteva)

**Mane**:

- ⚠️ Složenija implementacija
- ⚠️ Manual konfiguracija routing-a
- ⚠️ Teže za debugging
- ⚠️ Zahteva dobro poznavanje Workers API-ja

---

### Opcija 3: **Hybrid Approach** 🎨 (NAJBOLJE ZA VAGA BETA)

**Šta je hybrid**:

- Statički build (CSR) za većinu stranica
- SSR samo za kritične stranice (Home, Pricing, SEO-važne)
- API routes za backend funkcionalnosti

**Kombinirani setup**:

```
/functions
  /_middleware.js         ← SSR za /pricing, /, /evaga-desktop
  /api
    /licenses
      create.js           ← Serverless API za kreiranje licenci
```

**Prednosti**:

- ✅ Najbolji performance (static pages su instant)
- ✅ SEO benefiti gde je potrebno
- ✅ Manji troškovi (SSR samo za kritične stranice)
- ✅ Lakše za održavanje

**Preporučeno za Vaga Beta**:

- ✅ SSR za: `/`, `/pricing`, `/evaga-desktop` (SEO + marketing)
- ✅ CSR za: `/admin`, `/dashboard`, `/profil` (authenticated stranice)
- ✅ Static za: `/usluge`, `/o-nama`, `/kontakt`

---

## 🔧 Šta Treba Implementirati

### 1. **Cloudflare Pages Functions Setup**

**Kreirati `/functions` folder**:

```
/functions
  /_middleware.js          ← SSR middleware
  /api
    /licenses.js           ← License API (već postoji u Firebase Functions)
    /health.js             ← Health check endpoint
```

### 2. **Adaptor za Workers Runtime**

**Problem**: `src/entry-server.jsx` koristi Node.js stream API  
**Rešenje**: Kreirati Cloudflare-kompatibilnu verziju

**Novi fajl**: `src/entry-server-cloudflare.jsx`

```jsx
// Cloudflare ne podržava renderToPipeableStream
// Koristi renderToString ili renderToReadableStream
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter } from "react-router-dom";
import App from "./App";

export async function render(url) {
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
  );

  const helmet = helmetContext.helmet;

  return { html, helmet };
}
```

### 3. **SSR Middleware** (`/functions/_middleware.js`)

```javascript
import { render } from "../dist/server/entry-server-cloudflare.js";

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Skip SSR za assets
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/imgs/") ||
    url.pathname.match(/\.(js|css|png|jpg|svg|ico|json|webp)$/)
  ) {
    return next();
  }

  // Skip SSR za admin routes (CSR only)
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/dashboard")
  ) {
    return next();
  }

  try {
    // SSR za marketing stranice
    const { html, helmet } = await render(url.pathname);

    // Učitaj HTML template
    const template = await env.ASSETS.fetch(request).then((r) => r.text());

    // Inject SSR HTML
    const finalHtml = template.replace("<!--ssr-outlet-->", html).replace(
      "</head>",
      `
        <title>${helmet?.title || "Vaga Beta"}</title>
        ${helmet?.meta || ""}
        ${helmet?.link || ""}
      </head>`,
    );

    return new Response(finalHtml, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("SSR Error:", error);
    // Fallback na CSR
    return next();
  }
}
```

### 4. **Build Proces Izmena**

**Dodati u `package.json`**:

```json
{
  "scripts": {
    "build:cloudflare": "npm run generate:sitemap && vite build && npm run build:ssr-cloudflare",
    "build:ssr-cloudflare": "vite build --ssr src/entry-server-cloudflare.jsx --outDir dist/server"
  }
}
```

### 5. **Vite Config za Cloudflare**

**Novi fajl**: `vite.config.cloudflare.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    ssr: "src/entry-server-cloudflare.jsx",
    outDir: "dist/server",

    rollupOptions: {
      output: {
        format: "esm",
        // Externaliziraj module koji nisu podržani u Workers
        external: ["stream", "fs", "path"],
      },
    },

    // Bez minifikacije za SSR bundle (lakše debugovanje)
    minify: false,
  },

  ssr: {
    // External packages koji se ne mogu bundle-ovati
    external: ["firebase-admin"],
    // Workers-kompatibilni moduli
    noExternal: ["react", "react-dom", "react-router-dom"],
  },
});
```

### 6. **Environment Variables u Cloudflare Pages**

**Dodati u Cloudflare Dashboard** → Settings → Environment variables:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GOOGLE_MAPS_API_KEY=...
VITE_GOOGLE_ANALYTICS_ID=...
```

---

## 📝 Korak-po-Korak Implementacija

### Faza 1: Pripremni Koraci (5 min)

```bash
# 1. Kreiraj functions folder
mkdir -p functions/api

# 2. Dodaj .gitkeep da se folder commituje
touch functions/.gitkeep
```

### Faza 2: Cloudflare SSR Entry Point (10 min)

```bash
# 3. Kreiraj entry-server-cloudflare.jsx
# (vidi kod gore)
```

**Fajl**: `src/entry-server-cloudflare.jsx`

- Koristi `renderToString` umesto `renderToPipeableStream`
- Ukloni Node.js stream dependencies
- Kompatibilan sa Workers Runtime

### Faza 3: Functions Middleware (15 min)

```bash
# 4. Kreiraj _middleware.js
# (vidi kod gore)
```

**Fajl**: `functions/_middleware.js`

- Presreće sve zahteve
- Odlučuje: SSR ili CSR?
- Inject-uje SSR HTML u template

### Faza 4: Build Proces (10 min)

```bash
# 5. Ažuriraj package.json
# (dodaj build:cloudflare skriptu)

# 6. Kreiraj vite.config.cloudflare.js
# (vidi kod gore)

# 7. Testiraj build
npm run build:cloudflare
```

### Faza 5: Testing & Deployment (20 min)

```bash
# 8. Testiraj lokalno sa Wrangler
npx wrangler pages dev dist --compatibility-date=2024-01-01

# 9. Proveri SSR radi
curl http://localhost:8788/ | grep "ssr-outlet"
# → Trebalo bi da vidiš renderovan HTML, ne samo <!--ssr-outlet-->

# 10. Deploy na Cloudflare
git add .
git commit -m "feat: Add SSR support for Cloudflare Pages"
git push origin main

# 11. Čekaj auto-deployment (~2-3 min)
```

### Faza 6: Verifikacija (5 min)

**U browser-u**:

1. Otvori https://vagabeta.rs
2. View Page Source (Ctrl+U)
3. Proveri da li vidis renderovan HTML (ne samo root div)

**Testiranje**:

- ✅ Home page: SSR ✓
- ✅ Pricing page: SSR ✓
- ✅ Admin panel: CSR ✓ (nema SSR)
- ✅ SEO meta tags: ✓

---

## ⚡ Performance Optimizacije

### 1. **Edge Caching**

**Dodati u `functions/_middleware.js`**:

```javascript
return new Response(finalHtml, {
  headers: {
    "Content-Type": "text/html;charset=UTF-8",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "CDN-Cache-Control": "max-age=3600",
  },
});
```

**Rezultat**:

- First visit: SSR (~50-100ms)
- Subsequent visits: Edge cache (~5-10ms) ⚡

### 2. **Selective SSR**

**SSR samo za marketing stranice**:

```javascript
const SSR_ROUTES = ["/", "/pricing", "/evaga-desktop", "/usluge"];

if (!SSR_ROUTES.includes(url.pathname)) {
  return next(); // CSR fallback
}
```

**Benefit**:

- Admin panel ostaje brz (CSR, hydration je instant)
- Marketing stranice dobiju SEO boost

### 3. **Streaming SSR** (Advanced)

**Za React 19+**:

```javascript
import { renderToReadableStream } from "react-dom/server";

const stream = await renderToReadableStream(<App />, {
  onError(error) {
    console.error("Stream error:", error);
  },
});

return new Response(stream, {
  headers: { "Content-Type": "text/html" },
});
```

**Benefit**:

- Progresivno prikazivanje (stranica se učitava dok se renderuje)
- Bolji First Contentful Paint (FCP)

---

## 🐛 Troubleshooting

### Problem 1: "Module not found: stream"

**Uzrok**: Node.js moduli nisu dostupni u Workers Runtime

**Rešenje**:

```javascript
// ❌ Ne radi u Workers:
import { Writable } from "stream";

// ✅ Radi u Workers:
import { renderToString } from "react-dom/server";
```

### Problem 2: "Firebase is not defined"

**Uzrok**: Firebase SDK ne radi u SSR okruženju

**Rešenje**:

```jsx
// Dodaj guard u App.jsx
import { useEffect, useState } from "react";

function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div>{isClient && <FirebaseProvider>...</FirebaseProvider>}</div>;
}
```

### Problem 3: "Cold start timeout"

**Uzrok**: SSR bundle prevezan, cold start >50ms

**Rešenje**:

1. Code split veliki package-i (`@react-three/fiber`, `three`)
2. Lazy load non-critical components
3. Koristi `React.lazy` za admin panel

```jsx
const AdminPanel = React.lazy(() => import("./pages/admin/AdminPanel"));

// U routing-u:
<Suspense fallback={<Loader />}>
  <AdminPanel />
</Suspense>;
```

### Problem 4: "Helmet meta tags ne prikazuju se"

**Uzrok**: Helmet context se ne propagira pravilno

**Rešenje**:

```javascript
// U _middleware.js:
const helmetContext = {};

const html = renderToString(
  <HelmetProvider context={helmetContext}>
    <App />
  </HelmetProvider>,
);

// IMPORTANT: Ekstraktuj helmet POSLE renderovanja
const { helmet } = helmetContext;

// Inject helmet tags
const meta = helmet.meta.toString();
const title = helmet.title.toString();
```

---

## 📊 Metrika & Monitoring

### 1. **Web Vitals Tracking**

**Dodati u `src/entry-client.jsx`**:

```javascript
import { onCLS, onFID, onLCP, onFCP, onTTFB } from "web-vitals";

function sendToAnalytics({ name, value, id }) {
  // Send to Google Analytics
  gtag("event", name, {
    event_category: "Web Vitals",
    event_label: id,
    value: Math.round(value),
    non_interaction: true,
  });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### 2. **Cloudflare Analytics**

**Dodati u `functions/_middleware.js`**:

```javascript
export async function onRequest(context) {
  const start = Date.now();

  try {
    const response = await handleSSR(context);

    // Log performance
    context.env.ANALYTICS?.writeDataPoint({
      blobs: ["ssr", context.request.url],
      doubles: [Date.now() - start],
      indexes: [context.request.cf?.colo || "unknown"],
    });

    return response;
  } catch (error) {
    // Log errors
    context.env.ANALYTICS?.writeDataPoint({
      blobs: ["ssr-error", error.message],
      doubles: [Date.now() - start],
    });
    throw error;
  }
}
```

### 3. **Expected Metrics** (posle implementacije)

| Metrika       | CSR (trenutno) | SSR (cilj) | Improvement  |
| ------------- | -------------- | ---------- | ------------ |
| **TTFB**      | 200-400ms      | 50-150ms   | ⚡ 2-3x brže |
| **FCP**       | 800-1200ms     | 300-600ms  | ⚡ 2x brže   |
| **LCP**       | 1200-2000ms    | 600-1000ms | ⚡ 2x brže   |
| **SEO Score** | 75-85          | 95-100     | ✅ +15-20    |

---

## 💡 Preporuke

### Za Vaga Beta Projekat:

**Predlažem HYBRID pristup**:

1. ✅ **SSR za marketing** (`/`, `/pricing`, `/evaga-desktop`, `/usluge`)
   - SEO optimizacija
   - Brži First Paint
   - Bolji social media preview
2. ✅ **CSR za admin** (`/admin/*`, `/dashboard`, `/profil`)
   - Instant hydration
   - Bolja interaktivnost
   - Manje serverskog load-a
3. ✅ **Static za blog/docs** (`/blog/*`, `/dokumentacija/*`)
   - Najbrži load
   - CDN edge caching
   - Besplatan hosting

**Implementacija redosled**:

1. **Week 1**: Cloudflare Functions setup + SSR za home page
2. **Week 2**: SSR za pricing i evaga-desktop
3. **Week 3**: Performance tuning + caching optimizacija
4. **Week 4**: Monitoring, analytics, final polish

---

## 🎯 Sledeći Koraci

**Odmah**:

1. Pročitaj ovaj dokument
2. Odluči: Full SSR ili Hybrid?
3. Testiraj lokalno sa `npx wrangler pages dev`

**Za implementaciju**:

1. Kreiraj `/functions/_middleware.js`
2. Kreiraj `src/entry-server-cloudflare.jsx`
3. Ažuriraj `package.json` sa `build:cloudflare`
4. Deploy i testiraj

**Dodatni resursi**:

- [Cloudflare Pages Functions Docs](https://developers.cloudflare.com/pages/functions/)
- [React SSR Guide](https://react.dev/reference/react-dom/server)
- [Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)

---

**Kreirao**: GitHub Copilot  
**Datum**: 14. februar 2026.  
**Status**: Ready for Implementation
