# Security & Configuration Guide - VAŽNO PROČITAJ!

## 🔐 Bezbednosni Problemi Pronađeni i Rešeni

### Problem 1: Tajne vrednosti u verziji kontrole

**Status**: ⚠️ **HITNO** - Ako je `.env.local` već committed u git, trebalo bi da resetuješ history!

```bash
# Ukloni .env.local iz git history (PAŽNJA - ovo resetuje sve!)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env.local' HEAD

# Ili brisanje specifičnih vrednosti:
git log -p --all -S "AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk" -- .env.local
```

### Problem 2: Account ID i Zone ID u wrangler.workers.toml

**Status**: ⚠️ Već resolved - Premešten u `.example` fajl

---

## 📋 Setup Uputstvo

### 1. **Kreiraj lokalnu `.env.local` datoteku**

```bash
# Kopiraj template
cp .env.local.example .env.local

# Dodaj prave vrednosti (SAMO LOKALNO!)
nano .env.local  # ili prilagođeni editor
```

### 2. **Za Cloudflare Pages - postavi Plaintext varijable**

Idite u **Cloudflare Dashboard** → **Pages** → **Settings** → **Environment variables**:

- Sve `VITE_FIREBASE_*` varijable - **Plaintext**
- `VITE_CLOUDFLARE_ACCOUNT_ID` - **Plaintext**
- `VITE_CLOUDFLARE_API_TOKEN` - **Secret**

**KLJUČNO**:

- Firebase varijable MORAJU biti **Plaintext** jer Vite čita tokom build-a
- API Token može biti **Secret** jer se ne koristi tokom build-a

### 3. **Za Cloudflare Workers - koristi wrangler config**

```bash
# Kreiraj lokalnu verziju sa tajnama
cp wrangler.workers.example.toml wrangler.workers.local.toml

# Dodaj prave vrednosti
# Nikada ne commit-uj ovu datoteku!
```

---

## 🚫 Šta NIKADA Ne Treba da Radiš

❌ **NIKADA** ne commit-uj ove fajlove:

- `.env.local`
- `.env.production`
- `wrangler.workers.local.toml`
- Bilo koji fajl sa tajnim vrednostima

❌ **NIKADA** ne stavi tajne vrednosti u:

- `.env` (commit-uj ga!)
- `wrangler.workers.toml` (commit-uj template verziju!)
- README ili dokumentaciju

❌ **NIKADA** ne deli javno:

- Firebase API Keys
- Cloudflare Account ID
- API Tokens
- reCAPTCHA private keys
- Admin emailovi
- Zone IDs

---

## ✅ Bezbedne Vrednosti za Slanje (Cloudflare Pages)

Ove vrednosti su sigurne za Plaintext varijable (vidljive u kodu):

```env
# Safe for commit/public
VITE_FIREBASE_AUTH_DOMAIN=vaga-beta-sajt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaga-beta-sajt
VITE_FIREBASE_STORAGE_BUCKET=vaga-beta-sajt.firebasestorage.app
VITE_FIREBASE_MEASUREMENT_ID=G-WQFDTPZEXB

VITE_R2_WORKER_URL=https://worker.vagabeta.rs
VITE_R2_BUCKET_NAME=vaga-beta-cache
VITE_R2_BUCKET_REGION=auto
```

---

## 🔑 Šta Trebalo Resetre u Git History

Ako su ove vrednosti već committed, trebalo bi da ih resetuješ:

```
❌ AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk (Firebase API Key)
❌ hSh_h9j-1e0gWPaLR39zzBDy7wK4tIvDKG1lJIxL (API Token)
❌ 031ca9685557ca09a945ef3d0ba54f8e (Account ID)
❌ C0D542DB-96AE-4886-A47F-6A6B7FD27D30 (Debug Token)
❌ 6LdhT-ArAAAAAA93PlM7Ua3eE3TttZAjFcSpwySS (reCAPTCHA key)
❌ lazar.cve@gmail.com (Admin email)
❌ 8e9adffbe324937621ebe15e3595b23c (Zone ID)
```

**VAŽNO**: Čak i ako vidim ove vrednosti u kodu, trebalo bi smatrati ih kao kompromitovane! Firebase keys i API tokens trebalo bi rotirati.

---

## 🛡️ Optimizacije i Best Practices

### 1. **CSP Headers (Content Security Policy)**

Kreiraj bezbedne headers u `public/_headers`:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 2. **Firebase Security Rules**

Kreiraj `firestore.rules` sa strorom pristup kontrolom:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Samo admini mogu čitati/pisati
    match /admin/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }

    // Javno čitljivo
    match /public/{document=**} {
      allow read;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

### 3. **API Token Rotation**

- Rotira Cloudflare API token svakih 90 dana
- Koristi granular permissions (samo ono što je potrebno)
- Koristi service tokens umesto user tokens za CI/CD

### 4. **Firebase App Check**

Već je konfigurisan sa reCAPTCHA v3 - DOBRO! ✅

Dodatna konfiguracija:

```javascript
// Samo dozvoli API pozive sa App Check tokenom
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(recaptchaKey),
  isTokenAutoRefreshEnabled: true,
  forceRefresh: true, // Refresh svakih 30 min
});
```

### 5. **Environment Separation**

```
Development  → .env.local (nikada commit)
Production   → Cloudflare Pages Dashboard (deployment-time)
Testing      → .env.test (pode biti sa dummy vrednostima)
```

---

## 📝 Pre Svakog Deployment-a

- [ ] Potvrdi da `.env.local` NIJE u `.gitignore` liniji
- [ ] Potvrdi da je sve tajne vrednosti postavljene kao Plaintext u Cloudflare Pages
- [ ] Proveri Security headers u `public/_headers`
- [ ] Testiraj Firebase inicijalizaciju (proveri console za greške)
- [ ] Koristi `npm run build:cloudflare` za test build pre push-a

---

## 🆘 Ako Nešto Krene Po Zlu

**Greška: "Missing Firebase config"**
→ Proveri da varijable postoje u Cloudflare Pages Environment variables (Plaintext)

**Greška: "Too many API requests"**
→ Možda je reCAPTCHA debug token istekao u production, ukloni ga

**API Token nije radio**
→ Proveri da li je token rotiran, kreiraj novi

**Zone ID ne radi u wrangler**
→ Koristi `wrangler zones list` za pronalaženje pod-a
