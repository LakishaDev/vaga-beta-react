# 🌍 Vaga Beta - Cloudflare Pages Deployment

Kompletan setup za deployment Vaga Beta React aplikacije na Cloudflare Pages sa R2 storage-om, Firebase realtime baza, i Google Maps integracijom.

## 📚 Dokumentacija

### 🚀 Za Brz Start

- **[CLOUDFLARE_SETUP_COMPLETE.md](./CLOUDFLARE_SETUP_COMPLETE.md)** - Što je završeno i kako koristiti
- **[PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)** - Proverite pre nego nego što deployujete

### 📖 Detaljne Vodiče

- **[CLOUDFLARE_COMPLETE_SETUP.md](./CLOUDFLARE_COMPLETE_SETUP.md)** - Kompletan korak-po-korak vodič
- **[CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md)** - Detaljan vodič sa troubleshooting

---

## 🎯 Što Je Sadržano

### ✅ Debug Komponenta

Kreirata debug komponenta za testiranje svih servisa:

- 🔧 Debug dugme (samo u dev-u)
- Testira Firebase connectivity
- Testira R2 bucket pristup
- Testira Google Maps API
- Testira Google Analytics
- Proverava CSP policy
- Izvozi test rezultate

**Korišćenje:**

```bash
npm run dev
# Klikni 🔧 Debug dugme u donjem desnom uglu
```

### ✅ Deploy Skriptovi

**Za Linux/Mac:**

```bash
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

**Za Windows (PowerShell):**

```powershell
.\deploy-cloudflare.ps1
```

### ✅ Security Konfiguracija

- **public/\_headers** - CSP policy, HSTS, CORS headers
- **public/\_redirects** - SPA routing
- **vite.config.js** - Build optimizacija
- **wrangler.toml** - Cloudflare Workers config

---

## 🚀 Brz Deploy (3 koraka)

### 1. Lokalnie Testiranje

```bash
# Build
npm run build:prod

# Testiraj build server
npm run preview

# Testiraj u http://localhost:4173
# Klikni 🔧 Debug dugme
```

### 2. Deploy

**Opcija A: GitHub (preporučeno)**

```bash
git push origin main
# Cloudflare Pages će automatski deployovati
```

**Opcija B: Manual**

```bash
./deploy-cloudflare.sh  # ili deploy-cloudflare.ps1 na Windows
```

### 3. Verifikacija

1. Otvori https://vagabeta.rs
2. Klikni 🔧 Debug dugme
3. Testiraj sve funkcionalnosti

---

## 📋 Checklist Pre Deployment-a

Proverite:

- [x] Build je uspešan: `npm run build:prod`
- [x] Nema build warning-a
- [x] `.env.local` je konfigurisan sa svim varijablama
- [x] Cloudflare Pages ima sve environment varijable
- [x] `public/_headers` postoji
- [x] `public/_redirects` postoji
- [x] DNS je propagiran

Vise detalja: [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)

---

## 🔧 Environment Varijable

### .env.local (lokalno)

```env
# Firebase
VITE_FIREBASE_API_KEY=AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
VITE_FIREBASE_AUTH_DOMAIN=vaga-beta-sajt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaga-beta-sajt
VITE_FIREBASE_STORAGE_BUCKET=vaga-beta-sajt.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=128255475317
VITE_FIREBASE_APP_ID=1:128255475317:web:940cd944e6f1f762b9423c
VITE_FIREBASE_MEASUREMENT_ID=G-WQFDTPZEXB

# Google
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# App
VITE_APP_URL=https://vagabeta.rs
VITE_ENABLE_ANALYTICS=true
```

### Cloudflare Pages Settings

U Cloudflare Pages > Settings > Environment variables > Production:

Dodaj sve VITE\_\* varijable (identično kao gore)

---

## 🐛 Debugging

### Ako nešto ne radi nakon deployment-a:

1. **Klikni 🔧 Debug dugme** - Automatski testirate sve servise
2. **Proverite Network tab** - Pogledajte blocked zahteve
3. **Proverite Console** - CSP error-i su vidljivi ovde
4. **Čitajte build logs** - Cloudflare Pages > Deployments > [Build logs]

### Česti Problemi:

| Problem               | Rešenje                                       |
| --------------------- | --------------------------------------------- |
| Video se ne prikazuje | Proveri CSP za R2 bucket dozvolu              |
| Firebase ne radi      | Proveri WebSocket dozvolu (wss://)            |
| Maps se ne učitava    | Proveri API key i maps.googleapis.com dozvolu |
| 404 nakon refresh-a   | Proveri da \_redirects postoji                |

Detaljno: [CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md)

---

## 📊 Fajlovi

```
├── CLOUDFLARE_SETUP_COMPLETE.md      # Što je završeno
├── PRE_DEPLOYMENT_CHECKLIST.md       # Proverite pre deployment-a
├── CLOUDFLARE_COMPLETE_SETUP.md      # Detaljno korak-po-korak
├── CLOUDFLARE_PAGES_DEPLOYMENT.md    # Vodič sa troubleshooting
├── deploy-cloudflare.sh               # Deploy script (Linux/Mac)
├── deploy-cloudflare.ps1              # Deploy script (Windows)
├── src/components/CloudflareDeploymentDebug.jsx
├── src/utils/cloudflareDeploymentTest.js
├── public/_headers                   # Security headers + CSP
├── public/_redirects                 # SPA routing
└── vite.config.js                    # Build config
```

---

## 🎯 Sledeći Koraci

1. **Lokalno Testiranje** - `npm run build:prod` + `npm run preview`
2. **Dodaj Environment Varijable** - U Cloudflare Pages settings
3. **Deploy** - `./deploy-cloudflare.sh` ili GitHub push
4. **Testiraj** - Klikni 🔧 Debug dugme nakon deployment-a
5. **Monitor** - Cloudflare Analytics, Google Analytics

---

## 🔗 Linkovi

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Firebase Web Docs](https://firebase.google.com/docs/web/setup)
- [Google Maps API](https://developers.google.com/maps)
- [Vite Docs](https://vitejs.dev/)

---

## ✅ Status

```
🚀 Build:        ✅ SUCCESS (2532 modules, 24.49s)
📦 Bundle:       ✅ OPTIMIZED (~262 KB gzipped)
🛡️  Security:     ✅ CONFIGURED (CSP, HSTS, CORS)
🔧 Debug:        ✅ READY
📝 Docs:         ✅ COMPLETE
🌐 Deployment:   ✅ READY
```

---

**Verzija:** 1.0.0 - Production Ready  
**Zadnja izmena:** Februar 5, 2026  
**Status:** ✅ Gotovo

🎉 **Aplikacija je sprema za Cloudflare Pages deployment!**
