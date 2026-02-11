# 🚀 Cloudflare Pages Deployment Guide

Kompletan vodič za deployment Vaga Beta na Cloudflare Pages sa R2, Firebase i svim ostalim servisima.

## 📋 Checklist Pre Deployment

### 1. ✅ Proverite Fajlove

```bash
# Ova fajlovi MORAJU da postoje u `public/` foldern:
- _headers          # Security headers + CSP
- _redirects        # SPA routing
- robots.txt        # SEO
- sitemap.xml       # SEO (generiše se automatski)
- manifest.json     # PWA
```

### 2. ✅ Environment Variables

Dodaj u Cloudflare Pages settings (Settings > Environment variables):

```env
VITE_FIREBASE_API_KEY=AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
VITE_FIREBASE_AUTH_DOMAIN=vaga-beta-sajt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaga-beta-sajt
VITE_FIREBASE_STORAGE_BUCKET=vaga-beta-sajt.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=128255475317
VITE_FIREBASE_APP_ID=1:128255475317:web:940cd944e6f1f762b9423c
VITE_FIREBASE_MEASUREMENT_ID=G-WQFDTPZEXB
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
VITE_APP_URL=https://vagabeta.rs
```

### 3. ✅ Cloudflare Pages Build Settings

U Cloudflare Pages Dashboard:

**Build Settings:**

- Framework: None
- Build command: `npm run build:prod`
- Build output directory: `dist`
- Node.js version: 18 ili novija

**Environment Variables:**

- Production: Dodaj sve VITE\_\* varijable
- Preview: Iste kao production

### 4. ✅ R2 Bucket Setup (ako koristiš R2)

```bash
# Kreiraj R2 buckete
wrangler r2 bucket create vaga-beta-cache --jurisdiction=eu
wrangler r2 bucket create vaga-beta-cdn --jurisdiction=eu

# Test pristupa
wrangler r2 bucket list
```

**CORS Configuration za R2:**

```json
[
  {
    "AllowedOrigins": ["https://vagabeta.rs", "https://www.vagabeta.rs"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "x-amz-version-id"],
    "MaxAgeSeconds": 3000
  }
]
```

### 5. ✅ DNS Setup

Cloudflare DNS records (ukoliko koristiš Cloudflare za DNS):

```
CNAME    www       vagabeta.rs.pages.dev
CNAME    cache     cache.vagabeta.rs.pages.dev  (za R2 worker)
A        @         auto (Cloudflare)
TXT      @         v=spf1 -all
```

---

## 🛡️ Security & Headers

### CSP Policy (u `public/_headers`)

CSP je optimizovan za:

- ✅ Firebase (svi domeni)
- ✅ R2 Cloudflare Storage
- ✅ Google Maps
- ✅ Google Analytics
- ✅ YouTube embeds
- ✅ Facebook embeds

**Dozvoljeni izvori:**

```
script-src: Google Tag Manager, Analytics, Maps, CDN
style-src: Google Fonts, Maps
img-src: R2 Storage, Firebase Storage
connect-src: Firebase, R2, Google Services, WebSocket
media-src: R2 Storage (za video)
```

### CORS Headers

Dozvoljeni su:

- GET/HEAD za sve resurse
- POST/PUT/DELETE za API
- Presets za R2 pristupa

---

## 🎥 Video/Media Loading Issue - FIXES

### Problem: Video se ne prikazuje nakon deployment-a

**Razlozi:**

1. CSP `media-src` ne dozvolava R2
2. CORS blocked sa strane R2
3. Video MIME type nije pravilno konfigurisan

**Rešenje:**

1. **Ažuriraj CSP u `_headers`:** ✅ Već je urađeno

   ```
   media-src 'self' blob: https: https://*.r2.cloudflarestorage.com
   ```

2. **Konfiguruj R2 CORS:**

   ```bash
   wrangler r2 bucket update vaga-beta-cdn \
     --cors-rules '[{"AllowedOrigins":["https://vagabeta.rs"],...}]'
   ```

3. **Koristi presigned URL za video:**
   ```javascript
   // src/services/R2CacheService.js
   const url = await env.R2_BUCKET.getSignedUrl("video-file.mp4", {
     customHostname: "cdn.vagabeta.rs",
     expirationTtl: 3600, // 1 sat
   });
   ```

---

## 🔥 Firebase Connectivity Issue - FIXES

### Problem: Firebase se ne konekcuje nakon deployment-a

**Razlozi:**

1. CSP `connect-src` ne dozvolava Firebase domene
2. WebSocket nije dozvoljen
3. CORS issue

**Rešenje:**

1. **Ažuriraj CSP:** ✅ Već je urađeno

   ```
   connect-src 'self' https://*.firebase.googleapis.com
               https://*.firebaseio.com https://*.cloudfunctions.net
               wss://*.firebaseio.com
   ```

2. **Testiraj Firebase connectivity:**

   ```javascript
   // Dodaj u devtools console
   await fetch("https://vaga-beta-sajt.firebaseio.com/.json", {
     headers: { Authorization: "Bearer YOUR_TOKEN" },
   });
   ```

3. **Kreiraj Firebase debug utility:**
   ```javascript
   // src/utils/firebaseDebug.js
   export function testFirebase() {
     const { initializeApp } = require("firebase/app");
     const { getAuth } = require("firebase/auth");

     try {
       const app = initializeApp({ ...firebaseConfig });
       const auth = getAuth(app);
       console.log("✅ Firebase initialized:", app);
       return true;
     } catch (error) {
       console.error("❌ Firebase error:", error);
       return false;
     }
   }
   ```

---

## 🗺️ Google Maps Issue - FIXES

### Problem: Google Maps se ne učitava

**Rešenje:**

1. **Dodaj API key u environment:**

   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key
   ```

2. **Koristi sa CSP dozvoljenim domenima:** ✅ Već je urađeno

   ```javascript
   <script
     src={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`}
   />
   ```

3. **Testiraj u devtools:**
   ```javascript
   // Check if Maps API loaded
   console.log(
     "Maps API:",
     typeof google !== "undefined" ? "Loaded" : "Blocked by CSP",
   );
   ```

---

## 🔍 Debugging Checklist

### 1. Check CSP Policy

```bash
# U browser DevTools:
# Console > Network > proveri Response Headers
# Trebalo bi da vidih: Content-Security-Policy header
```

### 2. Test CORS

```javascript
// U console-u:
fetch("https://<bucket>.r2.cloudflarestorage.com/test.mp4", {
  method: "HEAD",
  mode: "cors",
})
  .then((r) => console.log("✅ CORS OK:", r.status))
  .catch((e) => console.error("❌ CORS Error:", e));
```

### 3. Test Firebase

```javascript
// U console-u:
fetch("https://vaga-beta-sajt.firebaseio.com/.json")
  .then((r) => console.log("✅ Firebase OK"))
  .catch((e) => console.error("❌ Firebase Error:", e));
```

### 4. Monitor Network

1. Otvori DevTools
2. Idite na Network tab
3. Učitajte stranicu
4. Pronađite blokirane zahteve (crveni status)
5. Proverite CSP warning u Console-u

---

## 📝 Deployment Commands

### Za development:

```bash
npm run dev
```

### Za production build:

```bash
npm run build:prod
```

### Deploy na Cloudflare Pages:

```bash
# Automatski push na GitHub/GitLab
git push origin main

# ILI ručni deploy sa Wrangler:
wrangler pages deploy dist
```

### Test sa Wrangler locally:

```bash
wrangler pages dev dist
```

---

## ✨ Performance Optimizacije

1. **Caching Strategy:**
   - Assets: 1 godina cache
   - HTML: No cache (proverava svaki put)
   - API: No cache

2. **Cloudflare Optimizations:**
   - Zatvori automatic minification (već je urađeno u Vite)
   - Koristi Rocket Loader opciono
   - Enable Brotli compression

3. **R2 Optimization:**
   - Use presigned URLs za video
   - Set proper Cache-Control headers
   - Enable S3 API compatibility mode

---

## 🐛 Common Issues & Solutions

| Issue             | Razlog                      | Rešenje                          |
| ----------------- | --------------------------- | -------------------------------- |
| Video ne radi     | CSP blokira R2              | Ažuriraj `media-src` u \_headers |
| Firebase ne radi  | WebSocket blokiran          | Dodaj `wss://` u `connect-src`   |
| Maps ne učitava   | API key problem             | Dodaj API key u env variables    |
| CORS error        | R2 CORS nije konfigurisan   | Setup R2 CORS rules              |
| 404 nakon refresh | SPA routing nije postavljen | Kreiraj `_redirects` fajl        |
| Spor load         | Assets nisu cacheirani      | Proveri cache headers            |

---

## 📊 Monitoring & Analytics

### Setup CloudflareAnalytics:

1. Dashboard > Analytics
2. Proveri Traffic, Performance, Security
3. Setup alerts za greške

### Setup Google Analytics:

```javascript
// Trebalo bi da radi sa VITE_GA_TRACKING_ID
import analytics from "@/utils/analytics";
```

---

## 🎓 Sledeći Koraci

- [ ] Deploy na Cloudflare Pages
- [ ] Testiraj sve funkcionalnosti
- [ ] Proveri CSP headers (`securityheaders.com`)
- [ ] Testiraj video loading
- [ ] Testiraj Firebase connectivity
- [ ] Monitor sa Analytics
- [ ] Setup alerting
- [ ] Optimize performance (PageSpeed Insights)

---

**Verzija:** 1.0.0  
**Poslednja izmena:** Februar 5, 2026  
**Kontakt:** info@vagabeta.rs
