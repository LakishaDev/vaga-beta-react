# 🔐 Cloudflare Pages - Environment Variables Setup

## ⚠️ BITNO: Dodaj Variables Pre Deployment-a

Za svaki deployment na Cloudflare Pages, **Firebase environment variables moraju biti postavljene u Cloudflare Dashboard**. Vite ugrađuje ove vrednosti tokom build procesa.

---

## 📋 Kako Dodati Environment Variables

### 1. Otvori Cloudflare Dashboard

1. Idi na: https://dash.cloudflare.com/
2. Select account: `031ca9685557ca09a945ef3d0ba54f8e`
3. Klikni **Workers & Pages** u sidebar-u
4. Izaberi projekat: **vaga-beta**

### 2. Otvori Settings

1. Klikni tab **Settings**
2. Scroll do **Environment variables**
3. Klikni **Add variable** za Production

---

## 🔑 Environment Variables za PRODUCTION

Kopiraj i dodaj **SVE** ove varijable:

```env
VITE_FIREBASE_API_KEY=AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
VITE_FIREBASE_AUTH_DOMAIN=vaga-beta-sajt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaga-beta-sajt
VITE_FIREBASE_STORAGE_BUCKET=vaga-beta-sajt.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=128255475317
VITE_FIREBASE_APP_ID=1:128255475317:web:940cd944e6f1f762b9423c
VITE_FIREBASE_MEASUREMENT_ID=G-WQFDTPZEXB
VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=C0D542DB-96AE-4886-A47F-6A6B7FD27D30
VITE_FIREBASE_RECAPTCHA_SITE_KEY=6LdhT-ArAAAAAA93PlM7Ua3eE3TttZAjFcSpwySS
VITE_ADMIN_EMAILS=lazar.cve@gmail.com
```

### Opciono (ako koristiš):

```env
VITE_R2_WORKER_URL=https://worker.vagabeta.rs
VITE_CLOUDFLARE_ACCOUNT_ID=031ca9685557ca09a945ef3d0ba54f8e
VITE_R2_BUCKET_NAME=vaga-beta-cache
VITE_R2_BUCKET_REGION=auto
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GA_TRACKING_ID=G-WQFDTPZEXB
VITE_APP_URL=https://vagabeta.rs
VITE_ENABLE_ANALYTICS=true
```

---

## 📝 Screenshots Koraka

### Korak 1: Settings > Environment variables

```
[Cloudflare Dashboard]
  └── Workers & Pages
      └── vaga-beta
          └── Settings
              └── Environment variables  <-- Klikni ovde
```

### Korak 2: Add variable

```
[Production]   [Preview]   [Add variable]  <-- Klikni ovde
```

### Korak 3: Unesi ime i vrednost

```
Variable name:  VITE_FIREBASE_API_KEY
Value:          AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
                [Add variable]
```

### Korak 4: Ponovi za SVE varijable

- Moraš ručno dodati svaku varijablu pojedinačno
- Proveri da su imena TAČNA (case-sensitive!)
- Proveri da vrednosti NEMAJU razmake na početku/kraju

---

## ✅ Provera

Nakon što dodaš environment variables:

### 1. Redeploy Projekta

U Cloudflare Pages:

1. Idi na **Deployments** tab
2. Klikni **...** (three dots) pored poslednjeg deployment-a
3. Klikni **Retry deployment**

ILI samo push-uj novi commit:

```bash
git commit --allow-empty -m "trigger: Redeploy with environment variables"
git push origin main
```

### 2. Proveri Build Log

Tokom build-a, proveri da nema poruke:

```
⚠ WARNING: Missing environment variable VITE_FIREBASE_PROJECT_ID
```

Ako vidiš ovu poruku, znači da varijabla NIJE pravilno postavljena.

### 3. Testiranje u Browser-u

Nakon uspešnog deployment-a:

1. Otvori sajt (https://vagabeta.rs ili https://vaga-beta.pages.dev)
2. Otvori Developer Console (F12)
3. Proveri da NEMA grešaka:

   ```
   ❌ Firebase Error: Missing App configuration value: "projectId"
   ❌ FirebaseError: Installations: Missing App configuration value
   ```

4. Testiranje Firebase konekcije:

   ```javascript
   // U konzoli, unesi:
   console.log("Firebase config:", {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
   });
   ```

   Trebalo bi da vidiš:

   ```javascript
   {
     apiKey: "AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk",
     projectId: "vaga-beta-sajt"
   }
   ```

---

## 🚨 Česti Problemi

### Problem 1: "Missing App configuration value: projectId"

**Uzrok:** Environment varijabla nije postavljena u Cloudflare Pages dashboard

**Rešenje:**

1. Proveri da je `VITE_FIREBASE_PROJECT_ID` dodata u Cloudflare
2. Proveri da vrednost nema typo: `vaga-beta-sajt`
3. Redeploy projekat (Retry deployment ili push commit)

---

### Problem 2: Build Errors - "VITE_FIREBASE_XXX is not defined"

**Uzrok:** Environment varijable nisu dostupne tokom build-a

**Rešenje:**

1. Proveri da SVE `VITE_FIREBASE_*` varijable postoje u Cloudflare
2. Proveri da su dodane u **Production** tab (ne Preview)
3. Proveri da imena počinju sa `VITE_` prefiksom

---

### Problem 3: CSP Errors u konzoli

**Uzrok:** Content Security Policy blokira skripte

**Rešenje:**
✅ Već popravljeno u `public/_headers` fajlu!

Promene:

- Dodato `data:` za Vite inline scripts
- Dodato `https://www.google.com` za reCAPTCHA
- Dodato `https://www.gstatic.com` za reCAPTCHA resurse
- Dodato `https://static.cloudflareinsights.com` za CF analytics

---

## 🔒 Bezbednost

### Da li je bezbedno deliti Firebase API keys javno?

**DA** - Firebase API keys su **javni identifikatori**, ne tajni ključevi:

✅ **Bezbedno:** Firebase API keys u browseru  
✅ **Bezbedno:** Committing API keys u Git  
✅ **Zaštita:** Firebase Security Rules (Firestore/Storage)  
✅ **Zaštita:** Firebase App Check (reCAPTCHA)

❌ **NIKAD:** Service Account Keys (.json fajlovi)  
❌ **NIKAD:** Admin SDK credentials  
❌ **NIKAD:** Private keys iz backend-a

Firebase koristi **Security Rules** i **App Check** za zaštitu, ne "tajne" API ključeve.

---

## 📚 Dodatni Resursi

- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api-keys)

---

## ✨ Workflow Za Svaki Deployment

1. **Lokalni development:**
   - Koristi `.env.local` fajl (git ignored)
   - Varijable automatski učitane u Vite dev server

2. **Cloudflare Pages deployment:**
   - Dodaj varijable u Cloudflare Dashboard (jednom)
   - Push na GitHub → automatski build + deploy
   - Varijable se ugrađuju u build tokom kompajliranja

3. **Workers (R2 cache):**
   - Koristi **Secrets** u Wrangler
   - Deploy sa: `wrangler deploy --config wrangler.workers.toml`
   - Postavi secrets sa: `wrangler secret put CLOUDFLARE_API_TOKEN`

---

## 🎯 Quick Checklist

Pre svakog deployment-a, proveri:

- [ ] SVE Firebase env vars dodane u Cloudflare Pages
- [ ] Imena varijabli tačna (copy-paste iz ovog fajla)
- [ ] Vrednosti nemaju razmake na početku/kraju
- [ ] `public/_headers` ima ažurirane CSP pravila
- [ ] Git push triggeruje novi build
- [ ] Build log ne pokazuje "missing variable" warnings
- [ ] Browser konzola nema CSP ili Firebase greške

---

**Sada si spreman za deployment! 🚀**

Push promene na GitHub i Cloudflare Pages će automatski napraviti build sa tvojim environment variables.
