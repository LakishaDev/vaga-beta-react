# ☁️ Cloudflare Pages Deployment Guide

> Kompletna dokumentacija za deployment Vaga Beta aplikacije na Cloudflare Pages

## 📚 Navigacija

### 🌟 NOVO: SSR Deployment

- **[SSR Decision Guide](./SSR_DECISION_GUIDE.md)** - ⭐ Da li ti treba SSR? (START HERE)
- **[SSR Quick Start](./SSR_QUICK_START.md)** - ⚡ Copy-paste ready kod (30-45 min)
- **[SSR Deployment Guide](./CLOUDFLARE_SSR_DEPLOYMENT_GUIDE.md)** - 📖 Kompletna dokumentacija

### Brzi Linkovi (Standard Deployment)

- **[Quick Start](./QUICK_START.md)** - 5 min setup (bez SSR)
- **[Complete Setup](./COMPLETE_SETUP.md)** - Detaljan vodič
- **[Environment Setup](./ENV_SETUP.md)** - Firebase & environment variables
- **[GitHub Integration](./GITHUB_SETUP.md)** - Automatski deployment
- **[Pages Deployment](./PAGES_DEPLOYMENT.md)** - Cloudflare Pages specifics
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Rešavanje problema

---

## 🚀 Quick Start (5 minuta)

### 1. Push na GitHub

```bash
git add .
git commit -m "Ready for Cloudflare deployment"
git push origin main
```

### 2. Kreiraj Cloudflare Pages Projekat

1. Idi na https://dash.cloudflare.com/
2. Workers & Pages → Create application → Pages → Connect to Git
3. Izaberi repository: `LakishaDev/vaga-beta-react`
4. Build settings:
   - **Build command:** `npm run build:prod`
   - **Build output directory:** `dist`
   - **Framework:** Vite (auto-detected)

### 3. Dodaj Environment Variables ⚠️ OBAVEZNO

U Cloudflare Pages → Settings → Environment variables → Production:

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

### 4. Deploy!

Klikni **Save and Deploy** - gotovo! 🎉

---

## 📖 Detaljni Vodič

### Za Nove Korisnike

Ako si prvi put na projektu ili prvi put koristiš Cloudflare Pages:
👉 **Počni sa:** [Complete Setup Guide](./COMPLETE_SETUP.md)

### Za Experienced Developere

Ako već znaš basics i samo treba brzo da deployuješ:
👉 **Koristi:** [Quick Start Guide](./QUICK_START.md)

### Za GitHub Integration

Automatski deployment svaki put kada push-uješ na GitHub:
👉 **Podesi:** [GitHub Integration Guide](./GITHUB_SETUP.md)

### Za Environment Variables

Firebase ne radi? Proveri environment variables:
👉 **Vodič:** [Environment Setup Guide](./ENV_SETUP.md)

### Problemi?

Build failure? Firebase greške? CSP violation?
👉 **Troubleshooting:** [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

## ⚙️ Konfiguracioni Fajlovi

Projekat koristi sledeće fajlove za Cloudflare deployment:

| Fajl                | Svrha                   | Lokacija                                          |
| ------------------- | ----------------------- | ------------------------------------------------- |
| `wrangler.toml`     | Pages konfiguracija     | [/wrangler.toml](../../../wrangler.toml)          |
| `wrangler.json`     | Build settings (backup) | [/wrangler.json](../../../wrangler.json)          |
| `public/_headers`   | CSP & security headers  | [/public/\_headers](../../../public/_headers)     |
| `public/_redirects` | SPA routing (minimal)   | [/public/\_redirects](../../../public/_redirects) |
| `.nvmrc`            | Node version (20)       | [/.nvmrc](../../../.nvmrc)                        |

---

## 🎯 Build Settings

### Cloudflare Pages Dashboard

```
Project name:           vaga-beta
Production branch:      main
Framework preset:       Vite
Build command:          npm run build:prod
Build output directory: dist
Node version:           20 (from .nvmrc)
```

### Build Process

1. **Clone:** Cloudflare klonira GitHub repo
2. **Install:** `npm clean-install` (dependencies)
3. **Lint:** ESLint provera (ako je u build:prod)
4. **Sitemap:** Generisanje sitemap.xml
5. **Build:** Vite build → `dist/` folder
6. **Deploy:** Upload na Cloudflare CDN
7. **DNS:** Automatski setup za custom domain

---

## 🌍 Custom Domain Setup

### Dodavanje vagabeta.rs

1. **U Cloudflare Pages projektu:**
   - Settings → Custom domains → Set up a custom domain

2. **Unesi domene:**
   - `vagabeta.rs`
   - `www.vagabeta.rs`

3. **DNS konfiguracija:**
   - Ako je domen u istom Cloudflare account-u → automatski
   - Ako ne → manuelno dodaj CNAME record

4. **SSL:**
   - Free SSL certifikat se automatski provision-uje
   - Wait 5-10 minuta za aktivaciju

---

## 🔐 Security Headers

Projekat koristi stroge Content Security Policy (CSP) headers za zaštitu.

### Dozvoljeni izvori:

- **Scripts:** Vite inline, Google Analytics, reCAPTCHA, Cloudflare Insights
- **Styles:** Self, Google Fonts
- **Images:** Self, data:, blob:, HTTPS (Firebase Storage, R2)
- **Connect:** Firebase APIs, App Check, reCAPTCHA, R2
- **Frames:** YouTube, Facebook, Google Maps, reCAPTCHA

Detaljno: [public/\_headers](../../../public/_headers)

---

## 🔄 Automatski Deployments

### Production Branch (main)

- Svaki push na `main` → automatski production deploy
- URL: https://vagabeta.rs + https://vaga-beta.pages.dev

### Preview Branches

- Pull request → preview deployment
- URL: https://[branch-name].vaga-beta.pages.dev

### Rollbacks

- Jedan klik rollback na bilo koji prethodni deployment
- Deployments tab → "..." → Rollback to this deployment

---

## 📊 Monitoring & Analytics

### Build Logs

- Real-time build logs u Cloudflare dashboard
- Deployments tab → Klikni na deployment → View build log

### Analytics

- Cloudflare Web Analytics (free)
- Google Analytics (ako je konfigurisan)
- Firebase Analytics

### Performance

- Cloudflare Global CDN (300+ datacenter-a)
- Automatic image optimization
- HTTP/3 & Brotli compression

---

## 🆘 Često Postavljana Pitanja

### Q: Build prolazi ali Firebase ne radi?

**A:** Environment variables nisu dodane. Proveri [ENV_SETUP.md](./ENV_SETUP.md)

### Q: CSP violation greške u konzoli?

**A:** Proveri da je `public/_headers` up-to-date. Vidi [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Q: Kako retry deployment?

**A:** Deployments tab → "..." → Retry deployment

### Q: Kako dodati env variable?

**A:** Settings → Environment variables → Add variable. Detaljno: [ENV_SETUP.md](./ENV_SETUP.md)

### Q: Redirect infinite loop warning?

**A:** `public/_redirects` fajl je prazan/minimal - Cloudflare automatski handluje SPA routing

---

## 🔗 Dodatni Resursi

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

---

## 📞 Support

**Problemi sa deploymentom?**

1. Proveri [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Proveri [Pre-Deployment Checklist](../PRE_DEPLOYMENT_CHECKLIST.md)
3. Proveri build logs u Cloudflare dashboard

**Pitanja o projektu?**
Vidi glavni [README](../../../README.md)

---

**Poslednje ažurirano:** Februar 2026  
**Cloudflare Pages Version:** v1.0
