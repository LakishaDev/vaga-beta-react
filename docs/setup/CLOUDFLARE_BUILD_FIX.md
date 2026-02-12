# Cloudflare Pages Build - Vodiču za rešavanje Firebase varijabli

## Problem

Greška `Missing Firebase config: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN...` se pojavljuje samo na Cloudflare Pages, ne lokalno.

## Uzrok

- Vite čita environment varijable iz `.env*` fajlova tokom build-a
- Cloudflare Pages postavlja varijable u sistem okruženje, ali Vite ih ne čita automatski
- `.env.local` fajl nije dostupan na Cloudflare Pages build serveru
- Rezultat: Vite build se izvršava sa `undefined` vrednostima

## Rešenje

### 1. **Postavi build komandu u Cloudflare Pages**

Ulazi u Cloudflare Dashboard:

1. **Workers & Pages** → **Pages**
2. Odaberi projekt **vaga-beta**
3. Idite u **Settings** → **Builds & deployments**
4. Pod **Build settings**, promeniti build komandu sa:

```bash
npm run build:prod
```

Na:

```bash
npm run build:cloudflare
```

### 2. **Postavi environment varijable kao Plaintext**

U istim **Settings** → **Builds & deployments** → **Environment variables**:

Dodaj sve ove varijable sa vrednostima (kao **Plaintext**, NE Secret):

```
VITE_FIREBASE_API_KEY=AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
VITE_FIREBASE_AUTH_DOMAIN=vaga-beta-sajt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vaga-beta-sajt
VITE_FIREBASE_STORAGE_BUCKET=vaga-beta-sajt.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=128255475317
VITE_FIREBASE_APP_ID=1:128255475317:web:940cd944e6f1f762b9423c
VITE_FIREBASE_MEASUREMENT_ID=G-WQFDTPZEXB
VITE_FIREBASE_RECAPTCHA_SITE_KEY=6LdhT-ArAAAAAA93PlM7Ua3eE3TttZAjFcSpwySS
VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=C0D542DB-96AE-4886-A47F-6A6B7FD27D30
```

**VAŽNO:** Mora biti **Plaintext** jer Vite treba da pristup ovim varijablama tokom build-a!

### 3. **Kako funkcioniše?**

Nova build komanda `npm run build:cloudflare` radi sledeće:

1. **Pokrenout skriptu** (`scripts/build-cloudflare.js`) koja:
   - Čita sve `VITE_*` varijable iz sistema (Cloudflare Pages okruženja)
   - Kreira privremeni `.env.production` fajl
   - Pisuje sve varijable u taj fajl

2. **Povača Vite build**:
   - Vite automatski čita `.env.production` fajl
   - Sve varijable su sada dostupne tokom kompajliranja
   - Build se završava uspešno

3. **Čišćenje**:
   - `.env.production` se nikad ne commituje (u `.gitignore`)
   - Kreira se samo tokom build-a, i uklanja se nakon

## Provera

Nakon što promenio build komandu i postavio varijable:

1. Potiski novo preko gita:

   ```bash
   git add -A
   git commit -m "Fix: Add Cloudflare build script for Firebase env variables"
   git push
   ```

2. Cloudflare pages će automatski pokrenuti novi build
3. Proveri build log da vidiš:
   ```
   🔨 Cloudflare Pages Build Script
   ✓ VITE_FIREBASE_API_KEY
   ✓ VITE_FIREBASE_AUTH_DOMAIN
   ... (sve varijable)
   ✅ Kreiran .env.production fajl sa 9 varijabli
   🚀 Pokretanje Vite build-a...
   ```

## Lokalna Provera

Lokalno, pusti:

```bash
# Koristi build:prod (čita iz .env.local)
npm run build:prod

# Ili za simulaciju Cloudflare okruženja:
export VITE_FIREBASE_API_KEY="<vrednost>"
export VITE_FIREBASE_AUTH_DOMAIN="<vrednost>"
# ... postavi sve varijable kao env vars
npm run build:cloudflare
```

## Alternativna Rešenja (ako gore ne radi)

### Option A: Koristi `.env.production` direktno

Kreiraj `.env.production` u repo-u sa vrednostima (MANJE BEZBEDNO - varijable u gitu):

```dotenv
VITE_FIREBASE_API_KEY=AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk
...
```

Zatim samo koristi `npm run build:prod` i dodaj `.env.production` u git.
⚠️ **RIZIKO**: Tajne su vidljive u git historiji!

### Option B: Docker build sa env-file

Ako imaš pristup Docker build-u na Cloudflare, koristi:

```dockerfile
RUN --mount=type=secret,id=env_vars \
    --mount=type=cache,target=/app/node_modules \
    cat /run/secrets/env_vars > .env.production && \
    npm run build:prod
```

## Još Pitanja?

Ako problem i dalje postoji:

1. Čekiraj Cloudflare build log (Settings → Deployments)
2. Proveri da li su varijable **Plaintext** (ne Secret)
3. Proverj da build komanda je `npm run build:cloudflare`
4. Pokušaj da resetuješ build keširanje: Settings → Purge Cache
