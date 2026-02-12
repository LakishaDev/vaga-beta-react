# Performance & Security Optimizations - Finalna Konfiguracija

## ✅ Implementirane Optimizacije

### 1. **Security Headers (\_headers fajl)**

#### Content Security Policy (CSP)

Zaštita od XSS, injection attacks, i unauthorized scripts:

```
default-src 'self'                        // Samo same origin
script-src 'self' 'unsafe-inline' ...     // Dozvoljeni script izvori
style-src 'self' 'unsafe-inline' ...      // Dozvoljeni style izvori
connect-src ... Firebase, Google APIs     // API connections
```

**Napomena**: CSP može blokirati neke spoljne resurse. Ako vidiš greške u konzoli tipa:

```
Refused to load the script 'https://example.com/script.js'
because it violates the following Content Security Policy directive
```

Dodaj taj origin u odgovarajuću CSP direktivu u `public/_headers`.

#### Permissions Policy

Onemogućava pristup osetljivim API-ima:

- geolocation
- microphone
- camera
- payment
- USB devices

#### HSTS (HTTP Strict Transport Security)

```
max-age=63072000 (2 godine)
includeSubDomains
preload
```

### 2. **Environment Variables Segregacija**

**`.env`** - Safe to commit, public values only:

```env
VITE_R2_WORKER_URL=https://worker.vagabeta.rs
VITE_R2_BUCKET_NAME=vaga-beta-cache
```

**`.env.local`** - NIKAD ne commit, tajne vrednosti:

```env
VITE_FIREBASE_API_KEY=...
VITE_CLOUDFLARE_ACCOUNT_ID=...
VITE_CLOUDFLARE_API_TOKEN=...
```

**Cloudflare Pages Env Vars** - Deployment-time:

- Sve `VITE_FIREBASE_*` → **Plaintext** (build-time)
- `VITE_CLOUDFLARE_API_TOKEN` → **Secret** (runtime only)

### 3. **Wrangler Config Cleanup**

**Uklonio**:

- account_id (čita iz Cloudflare CLI auth)
- KV namespace IDs (čita iz env vars)
- Zone IDs (konfiguriši u Dashboard)

**Sada se koristi**:

- `wrangler.workers.example.toml` → template sa placeholder vrednostima
- Prave vrednosti podesi lokalno ili u Cloudflare Dashboard

### 4. **.gitignore Proširenje**

Dodati su:

```
.env
.env.local
.env.production
.env.*.local
.env.*.backup
wrangler.workers.local.toml
*.key, *.pem, *.p8
credentials.json
serviceAccountKey.json
```

---

## 🚀 Build Optimizacije

### Vite Config Optimizations

#### 1. **Code Splitting**

```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['framer-motion', '@headlessui/react', ...],
  'three-vendor': ['@react-three/fiber', '@react-three/drei'],
  'markdown-vendor': ['react-markdown', 'remark-gfm', ...],
}
```

**Benefiti**:

- Cache busting po vendor-u
- Paralelno preuzimanje chunks
- Manje initial load vreme

#### 2. **Terser Minification**

```javascript
terserOptions: {
  compress: {
    drop_console: true,      // Ukloni console.log
    drop_debugger: true,      // Ukloni debugger
    passes: 2,                // Multi-pass optimizacija
  }
}
```

**Benefiti**:

- Manji bundle size (~30% smanjenje)
- Uklanja debug kod u production

#### 3. **CSS Optimization**

```javascript
cssCodeSplit: true,
cssMinify: true,
```

**Benefiti**:

- Samo potreban CSS za svaku stranicu
- GZIP/Brotli friendly

---

## 📊 Cloudflare Pages Konfiguracija

### Build Settings

**Build command**:

```bash
npm run build:cloudflare
```

**Build output directory**:

```
dist
```

**Root directory**:

```
/
```

**Node version**:

```
18 ili 20 (LTS)
```

### Environment Variables (Plaintext)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=vaga-beta-sajt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaga-beta-sajt
VITE_FIREBASE_STORAGE_BUCKET=vaga-beta-sajt.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_FIREBASE_RECAPTCHA_SITE_KEY=...
```

**Secrets** (ako treba):

```env
VITE_CLOUDFLARE_API_TOKEN=...
```

---

## 🔍 Performance Metrics

### Expected Lighthouse Scores

**Desktop**:

- Performance: 95-100
- Accessibility: 95-100
- Best Practices: 95-100
- SEO: 95-100

**Mobile**:

- Performance: 85-95
- Accessibility: 95-100
- Best Practices: 95-100
- SEO: 95-100

### Bundle Size Targets

```
Total bundle:        ~1.2-1.5 MB (uncompressed)
Gzipped:             ~300-400 KB
Brotli:              ~250-350 KB

Largest chunks:
- firebase vendor:   ~430 KB gzip (~130 KB)
- markdown vendor:   ~345 KB gzip (~103 KB)
- three vendor:      ~179 KB gzip (~56 KB)
```

---

## 🔧 Optimizacije koje Možeš Dodati

### 1. **Image Optimization**

Koristi Cloudflare Image Resizing:

```html
<img
  src="https://vagabeta.rs/cdn-cgi/image/width=800,quality=85/imgs/hero.jpg"
  alt="Hero image"
/>
```

### 2. **Preload Critical Resources**

Dodaj u `index.html`:

```html
<link rel="preload" as="script" href="/assets/js/react-vendor.js" />
<link rel="preload" as="style" href="/assets/css/index.css" />
<link rel="dns-prefetch" href="https://firebaseapp.com" />
```

### 3. **Service Worker za Offline Support**

Kreiraj `public/service-worker.js`:

```javascript
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/assets/css/index.css",
        // ... critical resources
      ]);
    }),
  );
});
```

### 4. **HTTP/3 + QUIC**

Cloudflare automatski koristi HTTP/3, ali proveri:

- SSL/TLS → Edge Certificates → Enable HTTP/3 (QUIC)
- Speed → Optimization → Enable "Auto Minify" (HTML, CSS, JS)

### 5. **Brotli Compression**

Cloudflare automatski kompresuje Brotli ako browser podržava!

Proveri:

```bash
curl -H "Accept-Encoding: br" https://vagabeta.rs -I
# Traži: content-encoding: br
```

---

## ⚙️ Advanced CSP Configuration

Ako trebaš da dozvolis dodatne izvore:

**Google Fonts**:

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
```

**External APIs**:

```
connect-src 'self' https://api.example.com;
```

**Inline scripts** (samo ako je APSOLUTNO potrebno):

```
script-src 'self' 'unsafe-inline';  // Manje bezbedno!
```

**Nonce-based CSP** (najbezbednije):

```javascript
// Generiši nonce tokom build-a
const nonce = generateNonce();

// U HTML:
<script nonce="${nonce}">...</script>

// U CSP header:
Content-Security-Policy: script-src 'self' 'nonce-${nonce}';
```

---

## 📈 Monitoring & Analytics

### Cloudflare Analytics

Cloudflare automatski pruža:

- Request count
- Bandwidth usage
- Cache hit ratio
- Response time

### Firebase Analytics

Već konfigurisano! Proveri:

```javascript
logEvent(analytics, "page_view", {
  page_title: document.title,
  page_location: window.location.href,
});
```

### Real User Monitoring (RUM)

Dodaj u `index.html`:

```html
<script>
  // Core Web Vitals tracking
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(entry.name, entry.value);
      // Pošalji na analytics
    }
  }).observe({
    entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
  });
</script>
```

---

## ✅ Pre-Deployment Checklist

- [ ] Sve tajne vrednosti su u `.env.local` (lokalno)
- [ ] Cloudflare Pages env vars su postavljene kao Plaintext
- [ ] Build komanda je `npm run build:cloudflare`
- [ ] `.gitignore` uključuje sve tajne fajlove
- [ ] CSP headers dozvoljavaju sve potrebne izvore
- [ ] Lighthouse score > 90 za sve metrke
- [ ] Firebase rules su konfigurisane
- [ ] reCAPTCHA App Check radi
- [ ] Cross-browser test (Chrome, Firefox, Safari, Edge)
- [ ] Mobile test (iOS Safari, Android Chrome)

---

## 🆘 Troubleshooting

**CSP blokira resurse**:
→ Proveri browser console, dodaj origin u CSP

**Build fails sa "Missing env vars"**:
→ Proveri da su varijable Plaintext u Cloudflare Pages

**Firebase ne radi u production**:
→ Proveri da build script čita varijable (`npm run build:cloudflare`)

**Wrangler ne pronalazi account**:
→ `wrangler login` ili dodaj u `.env.local`

**Images ne učitavaju**:
→ Dodaj origin u `img-src` CSP direktivu
