# 🚀 Cloudflare Pages Deployment Guide

## 📋 Pre-deployment Checklist

### 1. Environment Variables

Kreirajte `.env.local` fajl u root direktorijumu sa sledećim vrednostima:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 2. Cloudflare Pages Environment Variables

U Cloudflare Dashboard -> Pages -> Settings -> Environment Variables, dodajte **ISTE** promenljive kao u `.env.local`.

⚠️ **ВАЖНО**: Cloudflare Pages **NE ČITA** `.env.local` fajl automatski!

---

## 🏗️ Build Configuration

### Hybrid SSR/CSR Setup

Aplikacija koristi **hybrid pristup**:

- **SSR** (Server-Side Rendering) - za marketing stranice (`/`, `/usluge`, `/evaga-desktop`)
- **CSR** (Client-Side Rendering) - za prodavnicu i autentifikovane stranice (`/prodavnica/*`)

### Build Commands

```bash
# Development
npm run dev

# Production build (hybrid)
npm run build:cloudflare

# Preview locally
npm run preview:hybrid
```

---

## 🌐 Deployment na Cloudflare Pages

### Automatski Deployment

#### Windows (PowerShell):

```powershell
.\deploy-cloudflare.ps1
```

#### Linux/Mac (Bash):

```bash
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

### Manual Deployment

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build
npm run build:cloudflare

# 3. Deploy
npx wrangler pages deploy dist/client --project-name=vaga-beta
```

---

## 📁 Project Structure

```
dist/
├── client/          # Client-side build (upload ovaj folder)
│   ├── assets/
│   ├── index.html
│   └── ...
└── server/          # Server-side build (koristi ga _middleware.js)
    └── entry-server-cloudflare.js

functions/
└── _middleware.js   # Edge Function za SSR routing
```

---

## 🔧 Troubleshooting

### Problem: "Došlo je do greške u prikazu stranice"

**Uzrok**: Firebase ili browser API se poziva tokom SSR-a

**Rešenje**: Već implementirano u kodu:

- `Prodavnica.jsx` - client-side guard za Firebase
- `CartProvider.jsx` - localStorage guards
- `AuthProvider.jsx` - client-side guard za auth
- `_middleware.js` - `/prodavnica` je u CSR_ROUTES

### Problem: Environment variables nisu dostupne

**Rešenje**:

1. Proveri `.env.local` lokalno
2. Dodaj **ISTE** varijable u Cloudflare Dashboard:
   - Pages → Settings → Environment Variables
   - Dodaj za **Production** i **Preview** okruženja

### Problem: SSR greške sa Firebase

**Rešenje**: Proveri da li je ruta u CSR_ROUTES listi u `functions/_middleware.js`:

```javascript
const CSR_ROUTES = [
  "/prodavnica", // ← Ovo mora biti ovde
  "/admin",
  // ...
];
```

### Problem: "Module not found" tokom build-a

**Rešenje**:

```bash
# Reinstaliraj dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 🎯 Deployment Checklist

- [ ] `.env.local` fajl kreiran i popunjen
- [ ] Environment variables dodati u Cloudflare Dashboard
- [ ] `npm run build:cloudflare` uspešno izvršen
- [ ] `dist/client` i `dist/server` folderi postoje
- [ ] `functions/_middleware.js` ima `/prodavnica` u CSR_ROUTES
- [ ] Deploy komanda izvršena (`wrangler pages deploy dist/client`)
- [ ] Test na production URL-u
- [ ] Custom domain konfigurisan (opciono)

---

## 📊 Post-Deployment Tests

### 1. Marketing Stranice (SSR)

- [ ] `/` - Početna
- [ ] `/usluge` - Usluge
- [ ] `/evaga-desktop` - EVaga Desktop
- [ ] `/onama` - O nama
- [ ] `/kontakt` - Kontakt

**Proveri**: View Source → mora sadržati pun HTML sadržaj (ne samo `<div id="root"></div>`)

### 2. Prodavnica (CSR)

- [ ] `/prodavnica` - Hero section
- [ ] `/prodavnica/proizvodi` - Lista proizvoda
- [ ] `/prodavnica/korpa` - Korpa
- [ ] `/prodavnica/nalog` - Korisnički nalog
- [ ] `/prodavnica/admin` - Admin panel

**Proveri**: Browser konzola ne prikazuje Firebase greške

### 3. Environment Variables

- [ ] Firebase funkcionalnost radi (login/register)
- [ ] Google Maps API radi (kontakt stranica)

---

## 🔗 Helpful Links

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [React SSR Guide](https://react.dev/reference/react-dom/server)

---

## 📞 Support

Ako imate problema:

1. Proveri browser konzolu (F12)
2. Proveri Cloudflare Pages logs
3. Proveri da li su environment variables postavljene
4. Kontaktiraj support

---

**Poslednje ažurirano**: Februar 2026
