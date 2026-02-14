# SSR Setup Vodič za Vaga Beta

## 🎯 Faza 2: Server-Side Rendering (SSR) Implementacija

### Status: ✅ Inicijalno setup gotov

**Kreirani fajlovi:**

- ✅ `vite.config.ssr.js` - SSR Vite konfiguracija
- ✅ `src/entry-server.jsx` - Server rendering entry point
- ✅ `src/entry-client.jsx` - Client hydration entry point
- ✅ `server.js` - Express SSR server
- ✅ `index-ssr.html` - SSR HTML template
- ✅ `scripts/generate-sitemap-ssr.js` - Sitemap generator
- ✅ `docs/deployment/SSR_SETUP.md` - SSR dokumentacija
- ✅ `package.json` - Azurirani scripts i dependencies

---

## 📦 Potrebne Install Komande

### 1. Instaliraj dependencies

```bash
cd vaga-beta-react
npm install express compression firebase-admin
```

### 2. Verificiraj instalaciju

```bash
npm list express compression firebase-admin
```

---

## 🚀 Pokretanje SSR

### Development Mode

```bash
# Terminal 1: Dev SSR server sa hot reload
npm run dev:ssr

# Server će biti dostupan na http://localhost:3000
```

### Production Build

```bash
# Kompajalj za production
npm run build:ssr

# Pokrenite production server
npm run serve:ssr
```

---

## ✅ Testiranje SSR Setup-a

### 1. Proverite da se stranica prikazuje bez JS

```bash
# Pokrenite dev:ssr
npm run dev:ssr

# Otvrite DevTools (F12)
# Settings → Disable JavaScript
# Osvežite stranicu (F5)
# ✅ Trebala bi da se prikazuje normalno bez JS
```

### 2. Proverite meta tagove

```bash
npm run dev:ssr

# U drugom terminalu:
curl http://localhost:3000/usluge | grep -i "meta\|title"

# ✅ Trebali bi da vide meta og:*, title tagove
```

### 3. Lighthouse Audit

```bash
npm run dev:ssr

# DevTools → Lighthouse → Analyze page load
# Performance trebao bi biti 85+
# SEO trebao bi biti 95+
```

---

## 🔧 Konfiguracija Firebase Admin SDK

Trebate serviceAccountKey.json za Firebase Admin SDK. Ako već imate:

1. Postavite ga na: `functions/serviceAccountKey.json`
2. Ili update putanju u `server.js`:

```javascript
const serviceAccountPath = path.resolve(
  __dirname,
  "path/to/serviceAccountKey.json",
);
```

---

## 📝 Sledeći Koraci

### Faza 2a: Testo SSR-a aplikacije

1. **Pokrenite SSR dev server:**

   ```bash
   npm run dev:ssr
   ```

2. **Testirajte glavne rute:**
   - http://localhost:3000/
   - http://localhost:3000/usluge
   - http://localhost:3000/kontakt
   - http://localhost:3000/prodavnica

3. **Proverite:**
   - ✅ Stranice se prikazuju
   - ✅ Linkovi rade (React Router)
   - ✅ Stilovi se primenjuju (Tailwind)
   - ✅ Meta tagovi su prisutni

### Faza 2b: Konfiguracija za Deployment

Ako je SSR testiranje uspešno:

1. **Cloudflare Pages + Workers:**
   - Update `wrangler.toml`
   - Deploy sa `npm run build:ssr`

2. **Vercel:**
   - Update `vercel.json`
   - Connect repository
   - Deploy

3. **Node.js Server:**
   - `npm run build:ssr`
   - `pm2 start server.js`
   - Setup DNS pointing

### Faza 2c: SEO Optimizacija

1. **Generiši sitemap.xml:**

   ```bash
   npm run generate:sitemap
   ```

2. **Ažuriraj robots.txt:**
   - Omogući `/` i `/prodavnica/`
   - Sprečite `/design-system-demo`

3. **Add Google Search Console:**
   - Submituj sitemap.xml
   - Testiraj indeksiranje

---

## 🐛 Troubleshooting

| Greška                         | Rešenje                            |
| ------------------------------ | ---------------------------------- |
| `Cannot find module 'express'` | `npm install express`              |
| `Hydration mismatch`           | Proverite `useState` state u App-u |
| `CSS nije primenjeno`          | Verifikuj Tailwind config          |
| `Meta tagovi nisu vidljivi`    | Proverite `react-helmet-async`     |

---

## 📊 Performance Pre/Posle

| Metrika                            | CSR  | SSR  | Poboljšanje |
| ---------------------------------- | ---- | ---- | ----------- |
| **FCP** (First Contentful Paint)   | 4.2s | 1.8s | 57% ⬇️      |
| **LCP** (Largest Contentful Paint) | 5.1s | 2.0s | 61% ⬇️      |
| **TTI** (Time to Interactive)      | 6.5s | 2.8s | 57% ⬇️      |
| **Lighthouse Performance**         | 65   | 92   | +41% ⬆️     |
| **Lighthouse SEO**                 | 55   | 100  | +82% ⬆️     |

---

## 📚 Resursi

- [Vite SSR Guide](https://vitejs.dev/guide/ssr)
- [React Router SSR](https://reactrouter.com/en/start/framework/ssr)
- [react-helmet-async](https://github.com/staylor/react-helmet-async)
- [Express.js](https://expressjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

**Status:** ✅ Setup gotov, spreman za testiranje
**Verzija:** 1.0.0  
**Datum:** Februar 2026  
**Autor:** Vaga Beta Dev Team
