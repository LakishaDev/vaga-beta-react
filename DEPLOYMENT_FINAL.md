# 🚀 FINALNI DEPLOYMENT GUIDE - Cloudflare Pages

## ⚠️ VAŽNO - Pre nego što počnete

### Problem koji smo rešili

- **`/prodavnica` ruta uzrokovala SSR greške** jer Firebase ne radi na serveru
- **Rešenje**: Dodali smo `/prodavnica` u CSR_ROUTES u `functions/_middleware.js`
- **Client-side guards** u svim Firebase komponentama

---

## 📦 STEP 1: Build Aplikacije

```bash
# Obriši stari build
rm -rf dist

# Napravi novi hybrid build
npm run build:cloudflare
```

**Očekivani output:**

```
dist/
├── client/          # Upload OVU folder na Cloudflare
│   ├── assets/
│   ├── index.html
│   └── ...
└── server/          # Koristi ga _middleware.js automatski
    └── entry-server-cloudflare.js
```

**Proveri build:**

```bash
# Windows PowerShell
.\test-deployment.ps1

# Linux/Mac
chmod +x test-deployment.sh
./test-deployment.sh
```

---

## 🌐 STEP 2: Environment Variables u Cloudflare

### Cloudflare Dashboard Setup

1. **Idi na**: https://dash.cloudflare.com
2. **Klikni**: Pages → [Tvoj Project]
3. **Klikni**: Settings → Environment Variables
4. **Dodaj SVE ove varijable** (za **Production** i **Preview**):

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=vaga-beta-xyz.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaga-beta-xyz
VITE_FIREBASE_STORAGE_BUCKET=vaga-beta-xyz.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXX
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

⚠️ **KRITIČNO**: Cloudflare **NE** čita `.env.local` fajl!

---

## 🚀 STEP 3: Deploy

### Opcija A: Automatski (PowerShell - Windows)

```powershell
.\deploy-cloudflare.ps1
```

### Opcija B: Automatski (Bash - Linux/Mac)

```bash
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

### Opcija C: Manuelno

```bash
# 1. Build
npm run build:cloudflare

# 2. Deploy
npx wrangler pages deploy dist/client --project-name=vaga-beta
```

---

## ✅ STEP 4: Post-Deployment Test

### Test 1: SSR Routes (Marketing)

Proveri **View Page Source** (Ctrl+U):

- ✅ `https://vaga-beta.pages.dev/` - mora sadržati pun HTML
- ✅ `https://vaga-beta.pages.dev/usluge` - mora sadržati pun HTML
- ✅ `https://vaga-beta.pages.dev/evaga-desktop` - mora sadržati pun HTML

**Ako vidiš samo `<div id="root"></div>`** → SSR nije aktivan (OK ako je CSR ruta)

### Test 2: CSR Routes (Prodavnica)

Proveri **Browser Console** (F12):

- ✅ `https://vaga-beta.pages.dev/prodavnica` - ne sme imati Firebase SSR greške
- ✅ `https://vaga-beta.pages.dev/prodavnica/proizvodi` - moraju se učitati proizvodi
- ✅ Login/Register funkcionalnost radi

### Test 3: Environment Variables

- ✅ Firebase auth radi (login/register)
- ✅ Google Maps se učitava na `/kontakt`
- ✅ Firestore queries rade

---

## 🐛 Troubleshooting

### Problem: "Došlo je do greške u prikazu stranice"

**Uzrok**: Firebase se pokrenuo tokom SSR-a

**Provera**:

```bash
# Proveri da li je /prodavnica u CSR_ROUTES
grep "/prodavnica" functions/_middleware.js
```

**Rešenje**: Već implementirano u kodu ✅

---

### Problem: Firebase Auth ne radi

**Uzrok**: Environment variables nisu postavljene u Cloudflare

**Rešenje**:

1. Cloudflare Dashboard → Pages → Settings → Environment Variables
2. Dodaj SVE Firebase varijable
3. **Re-deploy** projekat (mora rebuild posle promene ENV vars)

---

### Problem: Google Maps ne učitava

**Uzrok**: API key nije postavljen

**Rešenje**:

1. Dodaj `VITE_GOOGLE_MAPS_API_KEY` u Cloudflare Dashboard
2. Re-deploy

---

### Problem: CSS se ne primenjuje

**Uzrok**: Build cache ili pogrešan path

**Rešenje**:

```bash
# Obriši build cache
rm -rf dist node_modules/.vite

# Rebuild
npm run build:cloudflare
```

---

### Problem: "\_middleware.js nije pronađen"

**Uzrok**: Functions folder nije uploadovan

**Rešenje**: Wrangler automatski detektuje `functions/` folder. Proveri:

```bash
ls -la functions/_middleware.js
```

---

## 📊 Deployment Checklist

Pre deployovanja:

- [ ] `npm run build:cloudflare` uspešno
- [ ] `dist/client` folder postoji
- [ ] `dist/server/entry-server-cloudflare.js` postoji
- [ ] `functions/_middleware.js` ima `/prodavnica` u CSR_ROUTES
- [ ] Environment variables dodati u Cloudflare Dashboard
- [ ] `.env.local` fajl postoji lokalno (za development)

Posle deployovanja:

- [ ] SSR routes vraćaju pun HTML (View Source)
- [ ] CSR routes (prodavnica) rade bez grešaka
- [ ] Firebase auth radi
- [ ] Google Maps radi
- [ ] Console nema grešaka

---

## 🔗 Korisni Linkovi

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Deployment Logs**: Pages → [Project] → View build
- **Environment Variables**: Pages → Settings → Environment Variables
- **Functions Logs**: Pages → [Project] → Functions

---

## 📞 Pomoć

Ako imate problema:

1. **Proveri browser console** (F12) - tamo će biti detalji greške
2. **Proveri Cloudflare Functions logs** - tamo će biti server-side greške
3. **`RenderBoundary`** sada prikazuje detaljne greške u dev mode-u

---

**Poslednje ažurirano**: Februar 15, 2026
**Status**: ✅ Sve greške rešene, deployment spreman
