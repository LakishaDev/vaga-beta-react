# 🚀 SEO i Performance Optimizacija - Vaga Beta

Kompletna dokumentacija za SEO optimizaciju, performance poboljšanja i profesionalnu konfiguraciju Vaga Beta projekta.

## 📋 Sadržaj

- [SEO Optimizacije](#seo-optimizacije)
- [Performance Optimizacije](#performance-optimizacije)
- [Security Headers](#security-headers)
- [PWA Funkcionalnost](#pwa-funkcionalnost)
- [Analytics Setup](#analytics-setup)
- [Deployment](#deployment)

---

## 🎯 SEO Optimizacije

### 1. Meta Tagovi (index.html)

Dodati su svi ključni meta tagovi:

- ✅ Title i Description optimizovani za pretraživače
- ✅ Open Graph tagovi za socijalne mreže (Facebook, Viber, Messenger)
- ✅ Twitter Card tagovi
- ✅ Canonical URL
- ✅ Language alternatives
- ✅ Robots meta tagovi

### 2. Strukturirani Podaci (Schema.org)

Implementirani JSON-LD schema markup:

- **Organization Schema** - Informacije o kompaniji
- **LocalBusiness Schema** - Lokalne informacije biznisa
- **WebSite Schema** - Search action funkcionalnost

### 3. SEO Komponenta (`src/components/SEO.jsx`)

Dinamička SEO komponenta koja omogućava postavljanje meta tagova po stranici:

```jsx
import SEO, { SEO_CONFIGS } from "@/components/SEO";

function HomePage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.home} />
      {/* Tvoj sadržaj */}
    </>
  );
}
```

**Pre-definisane konfiguracije:**

- `SEO_CONFIGS.home` - Naslovna
- `SEO_CONFIGS.usluge` - Usluge
- `SEO_CONFIGS.kontakt` - Kontakt
- `SEO_CONFIGS.onama` - O nama
- `SEO_CONFIGS.prodavnica` - Prodavnica
- `SEO_CONFIGS.aplikacija` - eVaga App
- `SEO_CONFIGS.evagaDesktop` - eVaga Desktop

### 4. Sitemap Generator

Automatsko generisanje sitemap.xml fajla:

```bash
npm run generate:sitemap
```

Sitemap se automatski generiše pre production build-a.

### 5. robots.txt

Fajl `public/robots.txt` kontroliše kako pretraživači indeksiraju sajt:

- ✅ Dozvoljava indeksiranje glavnih stranica
- ✅ Blokira pristup admin panelu
- ✅ Definiše crawl delay za različite botove
- ✅ Ukazuje na sitemap lokaciju

---

## ⚡ Performance Optimizacije

### 1. Vite Config Optimizacije

**Build optimizacije** (`vite.config.js`):

- ✅ **Code Splitting** - Automatsko deljenje koda na chunks
- ✅ **Tree Shaking** - Uklanjanje nekorišćenog koda
- ✅ **Minification** - Terser minifikacija sa agresivnim opcijama
- ✅ **CSS Code Splitting** - Odvojeni CSS fajlovi
- ✅ **Asset Optimization** - Optimizacija slika i fajlova
- ✅ **Manual Chunking** - Vendor chunks za bolje cache-iranje

**Chunk Strategija:**

```javascript
{
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'firebase-vendor': ['firebase'],
  'ui-vendor': ['framer-motion', '@headlessui/react', ...],
  'three-vendor': ['@react-three/fiber', '@react-three/drei'],
}
```

### 2. Performance Monitor

Utility za praćenje Core Web Vitals (`src/utils/performanceMonitor.js`):

```javascript
import performanceMonitor from "@/utils/performanceMonitor";

// Dobij metrics report
const metrics = performanceMonitor.generateReport();
```

**Prati:**

- First Paint (FP)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Page Load Time

### 3. Lazy Loading

Implementiraj lazy loading za rute:

```jsx
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Home />
    </Suspense>
  );
}
```

### 4. Image Optimization

**Best practices:**

- Koristi WebP format
- Dodaj `loading="lazy"` atribut
- Definiši width i height
- Koristi srcset za responsive slike

```jsx
<img
  src="/imgs/hero.webp"
  alt="Vaga Beta"
  width="800"
  height="600"
  loading="lazy"
/>
```

---

## 🔒 Security Headers

### Implementacija

Security headers su konfigurisani u:

- `public/_headers` (Netlify)
- `vercel.json` (Vercel)
- `src/configs/securityHeaders.js` (Exportovana konfiguracija)

**Uključeni headers:**

- ✅ Content-Security-Policy (CSP)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy
- ✅ Strict-Transport-Security (HSTS)

### CSP Policy

Omogućava:

- Scripts sa `self` i Google Analytics
- Styles sa `self` i Google Fonts
- Firebase konekcije
- YouTube i Facebook embeds

---

## 📱 PWA Funkcionalnost

### Manifest.json

PWA manifest je konfigurisan u `public/manifest.json`:

```json
{
  "name": "Vaga Beta",
  "short_name": "Vaga Beta",
  "display": "standalone",
  "theme_color": "#1a1a1a",
  "icons": [...],
  "shortcuts": [...]
}
```

### Instalacija PWA

Korisnici mogu instalirati sajt kao aplikaciju:

- Desktop: Chrome / Edge - "Install Vaga Beta"
- Mobile: "Add to Home Screen"

### Offline Support

Za offline funkcionalnost, potrebno je dodati Service Worker.

---

## 📊 Analytics Setup

### Google Analytics 4

1. **Environment Setup (.env)**

```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
```

2. **Inicijalizacija**

Analytics se automatski inicijalizuje ako je `VITE_GA_TRACKING_ID` postavljen.

3. **Upotreba**

```javascript
import analytics from "@/utils/analytics";

// Track page view
analytics.pageView("/usluge", "Usluge");

// Track event
analytics.event("button_click", { button_name: "kontakt" });

// Track form submit
analytics.submitForm("kontakt_forma");

// Track conversion
analytics.conversion(1500, "RSD");
```

4. **React Hook**

```jsx
import { useAnalytics } from "@/utils/analytics";

function ContactPage() {
  const { trackForm } = useAnalytics();

  const handleSubmit = () => {
    trackForm("contact_form");
  };
}
```

---

## 🚀 Deployment

### NPM Scripts

```bash
# Development
npm run dev

# Production build (sa sitemap generisanjem)
npm run build

# Production build sa linting
npm run build:prod

# Generiši sitemap
npm run generate:sitemap

# Preview production build
npm run preview
```

### Vercel Deployment

1. **Automatski deployment:**
   - Push na `main` branch automatski deployuje
   - `vercel.json` je već konfigurisan

2. **Environment Variables:**
   - Dodaj u Vercel Dashboard sve `VITE_*` promenljive

### Netlify Deployment

1. **Build Settings:**
   - Build command: `npm run build:prod`
   - Publish directory: `dist`

2. **Headers:**
   - `public/_headers` automatski se primenjuje

### Firebase Hosting

```bash
firebase deploy --only hosting
```

---

## ✅ Checklist Pre-Production

- [ ] Postavi sve environment variable
- [ ] Testiraj sve meta tagove (Facebook Debugger, Twitter Validator)
- [ ] Generiši sitemap.xml
- [ ] Proveri robots.txt
- [ ] Testiraj PWA funkcionalnost
- [ ] Proveri security headers (securityheaders.com)
- [ ] Optimizuj slike (WebP, kompresija)
- [ ] Testiraj Core Web Vitals (PageSpeed Insights)
- [ ] Postavi Google Analytics
- [ ] Proveri 404 stranicu
- [ ] Testiraj responsive dizajn
- [ ] Testiraj accessibility (Lighthouse)

---

## 📚 Korisni Alati

### SEO Testing

- [Google Search Console](https://search.google.com/search-console)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema Markup Validator](https://validator.schema.org/)

### Performance Testing

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Security Testing

- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

---

## 🎓 Best Practices

1. **SEO:**
   - Koristi semantički HTML
   - Dodaj alt text na sve slike
   - Optimizuj title i meta description (50-60 karaktera title, 150-160 description)
   - Koristi heading hijerarhiju (H1 > H2 > H3)
   - Dodaj internal linking

2. **Performance:**
   - Minimizuj broj HTTP zahteva
   - Koristi CDN za statičke resurse
   - Implementiraj lazy loading
   - Optimizuj bundle size
   - Izbegavaj render-blocking resources

3. **Accessibility:**
   - Koristi semantic HTML
   - Dodaj ARIA labels gde je potrebno
   - Obezbedi keyboard navigation
   - Testiraj sa screen reader-ima
   - Obezbedi dovoljan color contrast

---

## 📞 Podrška

Za pitanja i sugestije:

- Email: info@vagabeta.rs
- GitHub Issues: [Open Issue](https://github.com/your-repo/issues)

---

**Verzija:** 1.0.0  
**Poslednja izmena:** Februar 2026  
**Autor:** Vaga Beta Development Team
