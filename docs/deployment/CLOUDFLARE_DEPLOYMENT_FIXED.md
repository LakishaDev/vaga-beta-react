# Cloudflare Pages Deployment - Quick Guide

## 🚀 Build problem je rešen!

### Problem koji smo rešili:

- ❌ **Stari problem**: Built `index.html` fajl nije sadržao `<script>` tagove
- ✅ **Rešenje**: Promenili smo entry point na `src/main.jsx` i build output na `dist/`

---

## 📦 Build Struktura

### Client Build (CSR)

```bash
npm run build:client
```

- **Output**: `dist/` folder
- **Sadrži**:
  - `index.html` sa pravilnim script tagovima
  - `assets/css/` - CSS fajlovi
  - `assets/js/` - JavaScript bundles

### Server Build (SSR)

```bash
npm run build:server
```

- **Output**: `dist/.server/` folder
- **Sadrži**:
  - `entry-server-cloudflare.js` - SSR render funkcija
  - `assets/js/` - Server-side chunks

### Copy Script

```bash
npm run copy:server
```

- **Akcija**: Kopira SSR build u `functions/` folder
- **Output**:
  - `functions/ssr-render.js` - SSR funkcija
  - `functions/assets/` - Server chunks (potrebni za SSR)

---

## 🔨 Build Proces

### Full Hybrid Build

```bash
npm run build:cloudflare
```

Ova komanda izvršava:

1. `generate:sitemap` - Generiše sitemap.xml
2. `build:client` - Pravi CSR build
3. `build:server` - Pravi SSR build
4. `copy:server` - Kopira SSR u functions/

---

## 🌐 Deployment

### Opcija 1: Automatski (Preporučeno)

```bash
npm run deploy:cloudflare
```

Ova komanda:

1. Pravi full build
2. Automatski deploy-uje na `vaga-beta-nesto` projekat
3. Ne pita za ime projekta

### Opcija 2: Bash Skripta (Interaktivno)

```bash
bash deploy-cloudflare.sh
```

- Pita za project name (default: `vaga-beta-nesto`)
- Instalira dependencies
- Pravi build
- Deploy-uje

### Opcija 3: Manualni Deployment

```bash
# 1. Build
npm run build:cloudflare

# 2. Deploy
wrangler pages deploy dist --project-name=vaga-beta-nesto --commit-dirty=true
```

---

## ✅ Verifikacija Deployment-a

### Proveri da li je deploy uspeo:

```bash
wrangler pages deployment list --project-name=vaga-beta-nesto
```

### Testiraj live site:

```bash
curl -I https://vagabeta.rs
```

Trebalo bi da vrати `HTTP/1.1 200 OK`

### Otvori u browseru:

- **Production**: https://vagabeta.rs
- **www**: https://www.vagabeta.rs
- **Pages URL**: https://vaga-beta-nesto.pages.dev

---

## 🔍 Testiranje

### Proveri da li stranice rade:

1. Homepage: `/`
2. Prodavnica: `/prodavnica` (CSR - bez SSR)
3. Admin: `/admin` (CSR - bez SSR)
4. Aplikacija: `/aplikacija`
5. EVaga Desktop: `/evaga-desktop`

### Proveri konzolu (DevTools):

```javascript
// Trebalo bi da nemaš greške tipa:
// - "Došlo je do greške u prikazu stranice"
// - Firebase initialization errors
// - SSR hydration errors
```

---

## 🛠️ Troubleshooting

### Problem: "Došlo je do greške u prikazu stranice"

**Uzrok**: SSR pokušava da renderuje Firebase-dependent stranicu  
**Rešenje**: Dodaj rutu u `CSR_ROUTES` u `functions/_middleware.js`

### Problem: Bela stranica posle deploymenta

**Uzrok**: Script tagovi nisu generisani u `index.html`  
**Rešenje**: Proveri `dist/index.html` lokalno:

```bash
grep "script" dist/index.html
```

Trebalo bi da vidiš:

```html
<script type="module" crossorigin src="/assets/js/main-[hash].js"></script>
```

### Problem: 500 Error na SSR rutama

**Uzrok**: SSR chunks nisu kopirani u `functions/assets/`  
**Rešenje**: Proveri da postoji `functions/assets/js/` folder:

```bash
ls -la functions/assets/js/
```

### Problem: functions/node_modules uzrokuje greške

**Uzrok**: Cloudflare Pages pokušava da bundle-uje node_modules  
**Rešenje**: Obriši `functions/node_modules`:

```bash
rm -rf functions/node_modules
```

---

## 📋 Folder Struktura Posle Build-a

```
vaga-beta-react/
├── dist/                    # 👈 Deploy ovaj folder
│   ├── index.html           # ✅ Sa script tagovima
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   ├── 3d/
│   ├── imgs/
│   └── videos/
│
├── functions/               # 👈 Upload-uje se automatski
│   ├── _middleware.js       # Routing logika
│   ├── ssr-render.js        # SSR render funkcija
│   └── assets/              # ✅ Server chunks
│       └── js/
│
└── dist/.server/            # ❌ Ne deploy-uje se
    └── entry-server-cloudflare.js
```

---

## 🎯 Ključne Promene

### Pre (Problem):

```json
"build:client": "vite build --outDir dist/client"
```

- Entry point: `src/entry-client-cloudflare.jsx`
- Output: `dist/client/`
- Problem: Vite nije procesirao custom entry point

### Posle (Rešenje):

```json
"build:client": "vite build"
```

- Entry point: `src/main.jsx` (standard Vite convention)
- Output: `dist/` (standard Vite convention)
- ✅ Vite pravilno inject-uje script tagove

---

## 📝 Environment Variables

Proveri da imaš `.env.local` sa:

```env
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=...

# R2 (opciono)
VITE_CLOUDFLARE_R2_PUBLIC_URL=...
```

---

## ⚡ Quick Commands

```bash
# Build + Deploy (jednom komandom)
npm run deploy:cloudflare

# Samo build
npm run build:cloudflare

# Preview lokalno (sa SSR)
npm run preview:hybrid

# Check deployment status
wrangler pages deployment list --project-name=vaga-beta-nesto
```

---

## 🎉 Success Checklist

- ✅ Build završava bez grešaka
- ✅ `dist/index.html` sadrži `<script>` tagove
- ✅ `functions/ssr-render.js` postoji
- ✅ `functions/assets/js/` folder postoji
- ✅ Deployment završava sa success message-om
- ✅ `https://vagabeta.rs` vraća HTTP 200
- ✅ Homepage se učitava ispravno
- ✅ `/prodavnica` radi sa Firebase auth-om
- ✅ Nema "Došlo je do greške" message-a

---

**Last Updated**: 15.02.2026  
**Status**: ✅ Production Ready
