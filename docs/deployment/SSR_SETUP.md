# SSR/SSG Implementacijska Dokumentacija

## 🚀 Šta je SSR/SSG?

### SSR (Server-Side Rendering)

- HTML se generiše na serveru za svaki zahtev
- Korisnik dobija kompletan HTML odmah
- Odličan za SEO jer su meta tagovi već u HTML-u
- Dinamičan - može da se menja na osnovu zahteva

### SSG (Static Site Generation)

- HTML se generiše pri build vremenu za svaku rutu
- Brže jer je HTML već generisan
- CDN može da ga cache-uje
- Bolji za Lighthouse perf skorove

## 📋 SSR Setup za Vaga Beta

### 1. Entry Points

#### `src/entry-server.jsx` (Server)

```jsx
// Renderuje React na serveru
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export async function render(url, helmetContext) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
  return { html, helmet };
}
```

#### `src/entry-client.jsx` (Client)

```jsx
// Hydratuje server-renderovani HTML
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(document.getElementById("root"), <App />);
```

### 2. Express Server (`server.js`)

```bash
npm run dev:ssr       # Pokrenite SSR dev server
npm run build:ssr     # Kompajlirajte za SSR
npm run serve:ssr     # Pokrenite SSR production
```

**Server čini:**

- Učitava glavnu App komponentu
- Renderuje je na URL-u koji je zahtevao korisnik
- Injektuje renderovani HTML u template
- Vraća kompletnu HTML stranicu

### 3. Vite Konfiguracija (`vite.config.ssr.js`)

```javascript
export default defineConfig({
  build: {
    ssr: "src/entry-server.jsx", // Entry point za server
    ssrManifest: true, // Generiši manifest za assets
  },
});
```

### 4. Build Output

Kompletan SSR build generiše:

```
dist/
  server/
    entry-server.js      # Server bundle
  client/
    index.html           # Client-side template
    ssa-manifest.json    # Asset mapping
    main.XXX.js          # Main client bundle
```

## ⚙️ Migracija sa CSR na SSR

### Šta se menja?

#### ❌ BrowserRouter → ✅ StaticRouter (na serveru)

**Pre (CSR):**

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

**Posle (SSR server):**

```jsx
<StaticRouter location={url}>
  <App />
</StaticRouter>
```

**Posle (SSR client):**

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

### Šta ostaje isto?

- ✅ Sve komponente
- ✅ React Router putanje
- ✅ Tailwind CSS
- ✅ Firebase integracija
- ✅ State management

### Problemi koji se rešavaju

| Problem           | CSR            | SSR             | SSG           |
| ----------------- | -------------- | --------------- | ------------- |
| SEO               | ❌ JS potreban | ✅ HTML odmah   | ✅ Najbolje   |
| Performance       | 🟡 Sporo       | ✅ Brže         | ✅ Najbrže    |
| Social Sharing    | ❌ Nema meta   | ✅ Ima meta     | ✅ Ima meta   |
| Cache-iranje      | ❌ Ne          | 🟡 Delimično    | ✅ Potpuno    |
| Dinamični sadržaj | ✅ UV.         | ✅ Svaki zahtev | ❌ Build-time |

## 🔧 Konfiguracija Specifične stranice za SSR

### Dinamički Meta Tagovi

```jsx
import SEO from "@/components/SEO";

export default function Home() {
  const seoConfig = {
    title: "Vaga Beta - Prodavnica",
    description: "Kupi profesionalne industrijske vage...",
    image: "https://vagabeta.rs/og-image.jpg",
    url: window.location.href,
    keywords: "vage, servis, kalibracija",
  };

  return (
    <>
      <SEO {...seoConfig} />
      {/* Sadržaj stranice */}
    </>
  );
}
```

### Firestore Queries na Serveru

```jsx
// server.js
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore(app);
const products = await db.collection("products").get();
```

## 📊 Performance Poboljšanja

### Lighthouse Scores (Očekivano)

**Sadašnja (CSR):**

- Performance: 60-70
- Accessibility: 85-90
- Best Practices: 85-90
- SEO: 50-60

**Sa SSR:**

- Performance: 85-95
- Accessibility: 90-95
- Best Practices: 90-95
- SEO: 95-100

### Core Web Vitals

**LCP (Largest Contentful Paint):** < 2.5s

- CSR: ~4.5s (čeka JS)
- SSR: ~1.5s (HTML odmah)

**FID/INP:** < 200ms

- CSR: ~300ms
- SSR: ~100ms

**CLS:** < 0.1

- Oba: ~0.05

## 🚀 Deployment Options

### Cloudflare Pages + Workers

```toml
# wrangler.toml
[build]
command = "npm run build:ssr"
cwd = "./"

[[routes]]
pattern = "https://vagabeta.rs/*"
zone_name = "vagabeta.rs"
```

### Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build:ssr",
  "outputDirectory": "dist/server"
}
```

### Node.js

```bash
npm install -g pm2
npm run build:ssr
pm2 start server.js --name "vaga-beta"
```

## 🧪 Testing SSR

### 1. Proverite meta tagove

```bash
# Dev mode
npm run dev:ssr
curl http://localhost:3000/usluge

# Trebali bi videti <title>, <meta og:*> tagove u HTML-u
```

### 2. Proverite da li JavaScript nije potreban za prikaz

```bash
# Isključi JS u DevTools
DevTools > Settings > Disable JavaScript
# Stranica bi trebala da se prikazuje normalno
```

### 3. Lighthouse audit

```bash
npm run build:ssr
npm run serve:ssr
# Otvori DevTools > Lighthouse, analyze
```

### 4. Robots.txt i sitemap.xml

```
robots.txt - Omogućava crawling
sitemap.xml - Lista svih URL-a
```

## 📈 Dalje Optimizacije

### 1. Static Site Generation (SSG)

Za stranice koje se retko menjaju:

```javascript
// scripts/prebuild-pages.js
// Generiši HTML za /usluge, /onama, /kontakt pri build vremenu
```

### 2. Incremental Static Regeneration (ISR)

```javascript
// Regeneriši SSG stranice svakih N sekundi
export const revalidate = 3600; // 1 sat
```

### 3. Image Optimization

```jsx
// next-Image zamena sa sharp-om
import sharp from "sharp";
```

## 🐛 Troubleshooting

### Problem: "Cannot find module react-router-dom/server"

**Rešenje:** Ažuriraj react-router-dom na v7+

```bash
npm update react-router-dom
```

### Problem: "Hydration mismatch" (CSR content drugi na serveru)

**Rešenje:** Uklonj `typeof window === 'undefined'` checks ili koristi `<Suspense>`

```jsx
// ❌ Loše
const isDark = typeof window !== "undefined" && window.isDark;

// ✅ Dobro
import { useEffect, useState } from "react";
const [isDark, setIsDark] = useState(false);
useEffect(() => setIsDark(window.isDark), []);
```

### Problem: CSS nije učitan na serveru

**Rešenje:** Koristi CSS-in-JS ili Tailwind (@tailwindcss/vite)

```jsx
// ❌ Loše
import styles from './styles.module.css'; // Nije učitan na serveru

// ✅ Dobro
<div className="text-primary-brand"> {/* Tailwind */}
```

## 📚 Resursi

- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)
- [React Router Server Guide](https://reactrouter.com/start/framework/client-side-rendering)
- [SEO Best Practices](https://developers.google.com/search/docs)
- [Web Vitals](https://web.dev/vitals/)

---

**Status:** ✅ SSR setup gotov  
**Verzija:** 1.0.0  
**Datum:** Februar 2026
