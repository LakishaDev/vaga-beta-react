# ✅ Cloudflare Pages - Pre-Deployment Checklist

## 🚀 PRE NEGO ŠTO DEPLOYUJEŠ

### Step 1: Local Verification ✓

- [x] Code je commited na Git
- [x] Env check je uspešan: `npm run env:check`
- [x] Build je uspešan: `npm run build` (Exit Code 0)
- [x] Nema build warning-a
- [x] Nema lint error-a
- [x] Sitemap je generisan (8 stranica)

**Proverite:**

```bash
npm run env:check
npm run build:prod
# Trebalo bi:
# ✓ 2532 modules transformed
# ✓ built in ~25s
```

### Step 2: Environment Variables ✓

Proverite da su obavezne varijable definisane u `.env.local`:

```env
✓ VITE_FIREBASE_API_KEY
✓ VITE_FIREBASE_AUTH_DOMAIN
✓ VITE_FIREBASE_PROJECT_ID
✓ VITE_FIREBASE_STORAGE_BUCKET
✓ VITE_FIREBASE_MESSAGING_SENDER_ID
✓ VITE_FIREBASE_APP_ID
✓ VITE_APP_URL=https://vagabeta.rs
✓ VITE_R2_PUBLIC_URL (ako koristiš R2 slike)

# Opciono
○ VITE_FIREBASE_MEASUREMENT_ID
○ VITE_GOOGLE_MAPS_API_KEY
○ VITE_GA_TRACKING_ID
○ VITE_ENABLE_ANALYTICS=true
```

### Step 3: Critical Files Check ✓

Proverite da su ovi fajlovi u `public/` foldern:

```bash
public/
  ├── _headers              ✓ Security + CSP headers
  ├── _redirects            ✓ SPA routing
  ├── robots.txt            ✓ SEO
  ├── sitemap.xml           ✓ SEO (generated)
  ├── manifest.json         ✓ PWA
  └── favicon.ico           ✓ Favicon
```

### Step 4: Cloudflare Pages Configuration ✓

U Cloudflare Pages Dashboard:

```
Settings > Build, deployments and functions
  ├─ Build command:        npm run build:prod        ✓
  ├─ Build output dir:     dist                      ✓
  ├─ Root directory:       (blank)                   ✓
  └─ Node.js version:      18 ili novija             ✓
```

### Step 5: Environment Variables u Cloudflare ✓

U Cloudflare Pages > Settings > Environment variables > Production:

Dodaj obavezne VITE\_\* varijable:

```env
VITE_FIREBASE_API_KEY=...              ✓
VITE_FIREBASE_AUTH_DOMAIN=...          ✓
VITE_FIREBASE_PROJECT_ID=...           ✓
VITE_FIREBASE_STORAGE_BUCKET=...       ✓
VITE_FIREBASE_MESSAGING_SENDER_ID=...  ✓
VITE_FIREBASE_APP_ID=...               ✓
VITE_APP_URL=https://vagabeta.rs       ✓
VITE_R2_PUBLIC_URL=...                 ✓

# Opcione:
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_GOOGLE_MAPS_API_KEY=...
VITE_GA_TRACKING_ID=...
VITE_ENABLE_ANALYTICS=true
```

### Step 5.1: SEO Smoke Mode u CI ✓

Cloudflare build treba da koristi lokalni smoke test mode (`SEO_SMOKE_MODE=local`) kako deployment ne bi zavisio od trenutnog stanja live sajta.

### Step 5.2: Post-deploy smoke komande ✓

Nakon deploy-a pokreni:

```bash
npm run verify:live
```

Time proveravaš robots, sitemap, product canonical + Product schema i image headers na live domenu.

### Step 6: DNS Setup ✓

U Cloudflare DNS Records:

```
Type    Name    Content                 TTL
CNAME   @       vagabeta.rs.pages.dev   Auto     ✓
CNAME   www     vagabeta.rs.pages.dev   Auto     ✓
TXT     @       v=spf1 -all             Auto     ✓
```

---

## 🚀 DEPLOYMENT

### Opcija A: GitHub Auto Deploy (preporučeno)

```bash
# 1. Kreiraj GitHub repository (ako nije već)
git remote add origin https://github.com/yourusername/vaga-beta

# 2. Push kod na GitHub
git branch -M main
git push -u origin main

# 3. U Cloudflare Pages:
#    - Connect GitHub account
#    - Select repository: vaga-beta-react
#    - Production branch: main
#    - Build command će se pokrenuti automatski

# 4. Čekaj build (trebalo bi 3-5 minuta)
```

### Opcija B: Manual Deploy sa Wrangler

```bash
# 1. Instaliraj Wrangler (ako nije instaliran)
npm install -g wrangler

# 2. Login
wrangler login

# 3. Build
npm run build:prod

# 4. Deploy
wrangler pages deploy dist --project-name=vaga-beta

# 5. Čekaj deployment (trebalo bi 30-60 sekundi)
```

### Opcija C: Koristi Deploy Script

**Za Linux/Mac:**

```bash
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

**Za Windows (PowerShell):**

```powershell
.\deploy-cloudflare.ps1
```

---

## ✅ POST-DEPLOYMENT TESTING

### Test 1: Stranica se učitava

```
https://vagabeta.rs
# ili
https://vaga-beta.pages.dev
```

Trebalo bi da se otvori bez greške.

### Test 2: Koristi Debug Tool

1. Klikni 🔧 Debug dugme (donji desni ugao)
2. Klikni "Pokreni sve testove"
3. Čekaj rezultate

**Očekivani rezultati:**

```
✅ CSP Policy - CSP je korektno konfigurisan
✅ Firebase - Firebase je dostupan
✅ R2 Storage - R2 je dostupan
✅ Google Maps - Google Maps je dostupan
✅ Google Analytics - Google Analytics je dostupan
✅ Security Headers - Security headers su OK
```

### Test 3: Specifični Funkcionalnosti

**Test Video Playback:**

```javascript
// U DevTools Console-u
const video = document.querySelector("video");
if (video) console.log("✅ Video element pronađen");
else console.log("❌ Video element nije pronađen");
```

**Test Firebase:**

```javascript
// Trebalo bi da se prikaže realtime podatke sa Firestore baze
// Proveri Console za error-e
```

**Test Google Maps:**

```javascript
// Trebalo bi da se prikaže mapa bez error-a
// Ako vidim "Google is not defined" - CSP blokira Maps
```

### Test 4: Network Tab Check

1. Otvori DevTools (F12)
2. Idi na Network tab
3. Osveži stranicu (Ctrl+Shift+R)
4. Proverite:
   - [ ] Nema crvenih stavki (Failed requests)
   - [ ] Nema CSP upozorenja u Console-u
   - [ ] Svi .js i .css fajlovi se učitavaju
   - [ ] Firebase zahtevi su uspešni
   - [ ] R2 zahtevi su uspešni

### Test 5: Security Headers Check

U terminalu:

```bash
curl -I https://vagabeta.rs
# Trebalo bi da vidim:
# Content-Security-Policy: ...
# Strict-Transport-Security: ...
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
```

Ili proverite na: https://securityheaders.com/?q=vagabeta.rs

---

## 🔴 Ako Nešto Ne Radi

### Problem 1: Build Failed

```
Što da radiš:
1. Proveri build logs u Cloudflare Pages
2. Čitaj error message
3. Proverite da su sve varijable postavljene
4. Testiraj build lokalno: npm run build:prod
```

### Problem 2: 404 After Refresh

```
Trebalo bi da je _redirects konfigurisan.
Proveri da public/_redirects postoji sa:
  /* /index.html 200
```

### Problem 3: Video se ne prikazuje

```
Što da radiš:
1. Network tab - proveri da li je zahtev ka R2 blokiran
2. Console tab - proveri za CSP error
3. Proverite da _headers ima media-src dozvolu za R2
```

### Problem 4: Firebase ne radi

```
Što da radiš:
1. Console tab - proveri za "Failed to connect"
2. Network tab - proveri za Firebase zahteve
3. Proveri da API key je ispravna u Cloudflare Pages env vars
4. Proverite da _headers ima WebSocket dozvolu (wss://)
```

### Problem 5: Google Maps se ne učitava

```
Što da radiš:
1. Console tab - proveri za "Google is not defined"
2. Proverite da API key je ispravna
3. Proverite da Google Maps API je enabled u Google Cloud
4. Proverite da _headers ima dozvolu za maps.googleapis.com
```

---

## 📊 MONITORING NAKON DEPLOYMENT-A

### Cloudflare Analytics

1. Dashboard > Analytics & Logs
2. Proverite:
   - Requests su se uspešno obradili
   - Nema previše 4xx/5xx error-a
   - Cache hit rate je dobar

### Google Analytics

1. Analytics > Real-time
2. Trebalo bi da vidite traffic

### Firebaseonsole

1. Firebase > Realtime Database
2. Trebalo bi da vidite write/read operations

---

## 🎉 SUCCESS INDICATORS

Ako vidite sve ovo - deployment je USPEŠAN:

```
✅ Strannica se učitava brzo (~1-2 sekunde)
✅ Debug tool pokazuje sve zelene ✅
✅ Video se reprodukuje normalno
✅ Firebase realtime se ažurira live
✅ Google Maps se učitava bez greške
✅ Google Analytics bilježi evente
✅ Network tab nema crvenih stavki
✅ Console nema CSP error-a
✅ SecurityHeaders.com daje A+ rating
```

---

## 📝 FINAL CHECKLIST

Pre nego nego što smatraš deployment ZAVRŠENIM:

- [ ] Local build je uspešan
- [ ] Svi environment varijable su postavljeni
- [ ] Cloudflare Pages settings su ispravni
- [ ] DNS je propagiran (5-10 minuta)
- [ ] Deploy je završen bez greške
- [ ] Debug tool pokazuje sve zelene ✅
- [ ] Video se reprodukuje
- [ ] Firebase radi
- [ ] Google Maps radi
- [ ] Security headers su OK
- [ ] Nema CSP error-a
- [ ] Nema 404 error-a
- [ ] Analytics prikupljaju podatke

---

## 🔗 KORISNI LINKOVI

- [Cloudflare Pages Status](https://www.cloudflarestatus.com/)
- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Google Analytics](https://analytics.google.com)
- [SecurityHeaders.com](https://securityheaders.com/)
- [PageSpeed Insights](https://pagespeed.web.dev)

---

## 🎓 SLEDEĆE

1. **Week 1:** Deploy, test sve, monitor
2. **Week 2:** Optimize performance
3. **Week 3:** User testing
4. **Week 4:** Official launch

---

**Verzija:** 1.0.0  
**Status:** ✅ READY FOR PRODUCTION  
**Poslednja izmena:** Februar 5, 2026

🚀 **Sveća sreća sa deploymentom!**
