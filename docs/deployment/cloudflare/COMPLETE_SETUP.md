# 🚀 Vaga Beta - Cloudflare Pages Kompletna Konfiguracija

## 📋 Quick Deploy Checklist

- [ ] Testiraj build lokalno: `npm run build:prod`
- [ ] Dodaj environment varijable u Cloudflare Pages
- [ ] Prosledi Cloudflare Pages - Wrangler konfiguraciju
- [ ] Testiraj nakon deployment-a - koristi 🔧 Debug button
- [ ] Proveri sve tri funkcionalnosti: R2, Firebase, Maps
- [ ] Monitor sa Cloudflare Analytics

---

## 1️⃣ Korak 1: Lokalni Build

### Testiraj build:

```bash
npm run build:prod
```

**Očekivani izlaz:**

```
✓ 2530 modules transformed
✓ built in ~25s
✓ No warnings
```

### Testiraj build server:

```bash
npm run preview
```

Otvori http://localhost:4173 i testiraj sve funkcionalnosti lokalno.

---

## 2️⃣ Korak 2: Cloudflare Pages Konfiguracija

### Build & Deploy Settings

```
Framework:                None
Build command:            npm run build:prod
Build output directory:   dist
Root directory (if applicable):  leave blank
```

### Environment Variables - Production

Dodaj u Cloudflare Pages Dashboard > Settings > Environment variables:

```env
VITE_FIREBASE_API_KEY=AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
VITE_FIREBASE_AUTH_DOMAIN=vaga-beta-sajt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaga-beta-sajt
VITE_FIREBASE_STORAGE_BUCKET=vaga-beta-sajt.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=128255475317
VITE_FIREBASE_APP_ID=1:128255475317:web:940cd944e6f1f762b9423c
VITE_FIREBASE_MEASUREMENT_ID=G-WQFDTPZEXB
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
VITE_APP_URL=https://vagabeta.rs
```

**Gde pronaći varijable:**

- **Firebase:** Cloudflare > Project Settings
- **Google Maps:** Google Cloud Console > APIs & Services > Credentials
- **Google Analytics:** Analytics > Admin > Data Streams > Web

---

## 3️⃣ Korak 3: Cloudflare Pages DNS

### Custom Domain Setup

1. Dodaj custom domain u Cloudflare Pages: `vagabeta.rs`
2. Proveri DNS records u Cloudflare DNS:

```
Type    Name    Content              TTL
CNAME   www     vagabeta.rs.pages.dev  Auto
CNAME   @       vagabeta.rs.pages.dev  Auto
TXT     @       v=spf1 -all           Auto
```

3. Čekaj DNS propagaciju (~5 minuta)

---

## 4️⃣ Korak 4: Deploy na Cloudflare

### Opcija A: GitHub/GitLab Auto Deploy (preporučeno)

1. Connect GitHub repo u Cloudflare Pages
2. Select production branch: `main`
3. Build command će se izvršiti automatski na svaki push

### Opcija B: Manual Deploy sa Wrangler CLI

```bash
# Instaliraj wrangler ako nije instaliran
npm install -g wrangler

# Login sa Cloudflare account-om
wrangler login

# Deploy
npm run build:prod
wrangler pages deploy dist --project-name=vaga-beta
```

---

## 5️⃣ Korak 5: Testiranje Deployment-a

### Test 1: Otvori stranicu

```
https://vagabeta.rs
```

Trebalo bi da se otvori bez greške.

### Test 2: Koristi Debug Tool

1. Otvori stranicu
2. Klikni 🔧 Debug dugme u donjem desnom uglu
3. Klikni "Pokreni sve testove"

**Očekivani rezultati:**

```
✅ CSP Policy - CSP je korektno konfigurisan
✅ Firebase - Firebase je dostupan
✅ R2 Storage - R2 je dostupan
✅ Google Maps - Google Maps je dostupan
✅ Google Analytics - Google Analytics je dostupan
✅ Security Headers - Security headers su OK
```

### Test 3: Proveri Network (DevTools)

1. Otvori DevTools (F12)
2. Idi na Network tab
3. Osveži stranicu (Ctrl+Shift+R - hard refresh)
4. Filtriraj po statusu - ne sme biti puno **blocked** stavki
5. Proveri za CSP upozorenja u **Console** tabu

### Test 4: Test Videa (R2)

```javascript
// U DevTools Console-u
const video = document.querySelector("video");
console.log("Video URL:", video?.src);
console.log("Video playing:", !video?.paused);
```

### Test 5: Test Firebase Realtime

```javascript
// U DevTools Console-u
console.log("Firebase available:", typeof firebase !== "undefined");
// Trebaće biti true
```

### Test 6: Test Google Maps

1. Idi na stranicu sa mapom
2. Mapa bi trebala da se učita bez greške
3. Proveri Console za Maps error-e

---

## 🔧 Troubleshooting

### Problem: Video se ne prikazuje (R2)

**Simptomi:**

- Video element je u HTML-u ali ne prikazuje se
- Console pokazuje: `Failed to load resource: blocked by CSP`

**Rešenja:**

1. **Proverite CSP policy:**

   ```bash
   # Terminal
   curl -I https://vagabeta.rs | grep -i "content-security-policy"
   ```

2. **Proverite CORS:**

   ```javascript
   // U Console-u
   fetch("https://vaga-beta-cdn.r2.cloudflarestorage.com/test.mp4", {
     method: "HEAD",
     mode: "cors",
   }).then((r) =>
     console.log(
       "Status:",
       r.status,
       "CORS:",
       r.headers.get("access-control-allow-origin"),
     ),
   );
   ```

3. **Ažurira \_headers fajl:**

   ```
   # public/_headers

   /*
     Content-Security-Policy: media-src 'self' blob: https: https://*.r2.cloudflarestorage.com https://*.firebasestorage.googleapis.com;
     Access-Control-Allow-Origin: *
     Access-Control-Allow-Methods: GET, HEAD, PUT, POST, DELETE
   ```

---

### Problem: Firebase ne radi

**Simptomi:**

- Realtime baza ne učitava podatke
- Console pokazuje: `Failed to load resource: blocked by CSP`
- WebSocket connection error

**Rešenja:**

1. **Proverite Firebase connectivity:**

   ```javascript
   // U Console-u
   fetch("https://vaga-beta-sajt.firebaseio.com/.json", {
     headers: { Authorization: "Bearer test" },
   })
     .then((r) => console.log("Firebase status:", r.status))
     .catch((e) => console.error("Firebase error:", e));
   ```

2. **Proverite WebSocket:**

   ```javascript
   // U Console-u - trebalo bi da se konekcija pravi na wss://
   console.log("Has websocket:", "WebSocket" in window);
   ```

3. **Dodaj WebSocket u CSP:**
   ```
   # public/_headers - connect-src smeće da ima:
   connect-src 'self' https://*.firebase.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com
   ```

---

### Problem: Google Maps se ne učitava

**Simptomi:**

- Mapa je prazna
- Console pokazuje: `Google is not defined`

**Rešenja:**

1. **Proverite Google Maps API key:**

   ```bash
   # Cloudflare Pages > Settings > Environment variables
   # Trebalo bi da bude postavljen VITE_GOOGLE_MAPS_API_KEY
   ```

2. **Proverite CSP za Maps:**

   ```
   # public/_headers trebalo bi da ima:
   script-src https://maps.googleapis.com https://maps-api-ssl.google.com;
   frame-src https://maps.google.com;
   img-src data: blob: https: https://*.maps.googleapis.com;
   ```

3. **Testiraj Maps API direktno:**
   ```javascript
   // U Console-u
   const script = document.createElement("script");
   script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places`;
   document.head.appendChild(script);
   // Trebalo bi da se API učita
   ```

---

### Problem: 404 nakon refresh-a

**Simptomi:**

- Navigacija radi, ali refresh na bilo kojoj stranici pokazuje 404
- `/usluge`, `/kontakt` itd. vraćaju 404

**Rešenje:**

Proverite da `public/_redirects` fajl postoji:

```
# public/_redirects
/* /index.html 200
```

Ovaj fajl je **OBAVEZNO** za Cloudflare Pages SPA routing.

---

## 📊 Production Monitoring

### Cloudflare Analytics

1. Dashboard > Analytics & Logs
2. Proverite:
   - **Requests:** Da li se zahtevi procesiraju
   - **Errors:** CSP errors, 4xx/5xx
   - **Performance:** Latency, Cache hit rate

### Google Analytics

1. Analytics > Real-time
2. Trebalo bi da vidite real-time traffic

### Firebaseonsole

1. Firebase Console > Realtime Database
2. Proverite da li se podatci učitavaju

---

## 🔒 Security Checklist

- [ ] CSP policy je kompletan (proveri `securityheaders.com`)
- [ ] HTTPS je aktiviran (trebalo bi automatski sa Cloudflare)
- [ ] HSTS header je postavljen
- [ ] X-Frame-Options je SAMEORIGIN
- [ ] X-Content-Type-Options je nosniff
- [ ] Referrer-Policy je strict-origin-when-cross-origin
- [ ] Permissions-Policy je konfigurisan

**Test na SecurityHeaders.com:**

1. Idi na https://securityheaders.com
2. Unesi https://vagabeta.rs
3. Trebalo bi da dobiješ A ili minimum B rating

---

## 📈 Performance Optimization

### Bundle Size:

```
Idealno: <500 KB (gzipped)
Trenutno: ~262 KB (gzipped)
Status: ✅ Odličan
```

### Cache Strategy:

```
Assets (JS/CSS/Images):   1 year (immutable)
HTML:                     No cache
API requests:             No cache
```

### CDN Performance:

- Cloudflare koristi global CDN - assets se cache-iraju po lokaciji
- R2 buckets su dostupni u regionu EU

---

## 📱 Mobile Testing

1. Otvori sa mobilnog uređaja: https://vagabeta.rs
2. Testiraj responsiveness (trebalo bi da se prilagodi)
3. Testiraj touch interactions
4. Testiraj video playback na mobilnom

---

## 🎯 Next Steps

1. **Week 1:** Deploy, test sve funkcionalnosti, monitor
2. **Week 2:** Optimize performance (PageSpeed Insights), setup alerts
3. **Week 3:** User acceptance testing, gather feedback
4. **Week 4:** Optimize based on analytics, prepare for launch

---

## 📞 Kontakt & Support

**Ako nešto ne radi:**

1. Proveri Network tab u DevTools
2. Proveri Console za error-e
3. Proveri Cloudflare Pages logs
4. Priloži Network tab screenshot u bug report

**Logs na Cloudflare Pages:**

1. Cloudflare Dashboard > Pages > vaga-beta
2. Deployments > [zadnji deployment]
3. View build logs / View runtime logs

---

**Verzija:** 1.0.0  
**Poslednja izmena:** Februar 5, 2026  
**Status:** ✅ Ready for Production
