
# Vaga Beta – SEO & Performance Recovery Plan
Tehnički plan za agenta (Frontend / SEO / DevOps)

---

# CILJ

1. Omogućiti pravilno indeksiranje svih product stranica  
2. Omogućiti prikaz proizvoda u Google Images  
3. Podići SEO score sa 59 na 90+  
4. Smanjiti CLS sa 0.363 na <0.1  
5. Smanjiti payload i JS execution time  
6. Stabilizovati Core Web Vitals  

---

# FAZA 1 – KRITIČNO (INDEX + CRAWL + RENDER)

## 1.1 Popraviti robots.txt

### Provera
- https://vagabeta.rs/robots.txt mora vraćati:
  - HTTP 200
  - Content-Type: text/plain
  - Validan format bez HTML

### Minimalna ispravna verzija

User-agent: *
Disallow:

Sitemap: https://vagabeta.rs/sitemap.xml

### Nakon izmene
- Testirati u Google Search Console
- Submitovati sitemap ponovo

---

## 1.2 Omogućiti Server-Side Rendering za proizvode

Trenutno listing stranica zahteva JavaScript.  
Google mora dobiti kompletan HTML bez renderovanja JS.

### Ako je Next.js
- Product listing: koristiti SSG (generateStaticParams / getStaticProps)
- Product pages /p/[slug]:
  - Pre-render at build time
  - Ili SSR ako su podaci dinamički

### Ako je React SPA
- Implementirati prerender:
  - prerender.io
  - react-snap
  - static export build
- Alternativa: migracija na Next.js

### HTML mora sadržati bez JS:
- H1 naziv proizvoda
- Opis
- Slike
- Linkove ka drugim proizvodima

---

# FAZA 2 – STRUCTURED DATA

## 2.1 Product Schema JSON-LD

Na svakoj /p/... stranici dodati Product structured data (JSON-LD):
- @type: Product
- name
- image (lista slika)
- description
- brand
- offers

Testirati na:
https://search.google.com/test/rich-results

---

# FAZA 3 – CORE WEB VITALS (CLS 0.363 → <0.1)

## 3.1 Fiksirati CLS

### Agent mora:

1. Svim slikama dodati:
   - width
   - height
   - ili CSS aspect-ratio

2. Header i banner sekcije:
   - Rezervisati prostor unapred
   - Izbegavati dinamičko ubacivanje elemenata

3. Fontovi:
   - font-display: swap
   - Preload samo primarni font

---

# FAZA 4 – OPTIMIZACIJA SLIKA (Images Ranking)

## 4.1 Prebaciti slike na sopstveni domen

Preporuka:
- Hostovati na:
  https://vagabeta.rs/img/products/
- Koristiti WebP ili AVIF
- Maks 200-300kb po slici

## 4.2 Image SEO pravila

- Naziv fajla: mk-3729-digitalna-vaga.webp
- ALT: MK-3729 digitalna vaga - Vaga Beta Beograd
- Dodati caption gde je moguće

---

# FAZA 5 – PERFORMANCE OPTIMIZACIJA

## 5.1 Smanjiti JS

- Code splitting
- Dynamic imports
- Ukloniti nepotrebne biblioteke
- Minifikacija
- Tree-shaking

## 5.2 Smanjiti payload (4.8MB → <2MB)

- Lazy load slike ispod fold-a
- CDN caching (1 year cache header za statičke fajlove)
- Gzip/Brotli kompresija

---

# FAZA 6 – INTERNI LINKING

## 6.1 Homepage

Dodati sekciju:
- Najprodavaniji proizvodi
- Grid sa slikama
- Direktni linkovi ka /p/...

## 6.2 Prodavnica listing

Mora sadržati:
- Crawlable <a href="/p/...">
- Ne samo onClick navigaciju

---

# FAZA 7 – META OPTIMIZACIJA

## 7.1 Title

Format:
Naziv proizvoda | Vaga Beta

## 7.2 Meta description

120–160 karaktera  
Unikatan za svaki proizvod

---

# FAZA 8 – GOOGLE SEARCH CONSOLE WORKFLOW

1. Submit sitemap
2. URL inspection za 3 proizvoda
3. Request indexing
4. Pratiti:
   - Pages → Indexed
   - Page indexing → Excluded
   - Core Web Vitals report

---

# FAZA 9 – DODATNE PREPORUKE (NAPREDNO)

- Open Graph tags
- Twitter cards
- FAQ schema
- Breadcrumb schema
- Blog sekcija za autoritet
- Google Business Profile proizvodi

---

# PRIORITET REDOSLED

1. Robots.txt
2. SSR / Prerender proizvoda
3. CLS fix
4. Product schema
5. Image optimizacija
6. JS smanjenje
7. Interni linkovi
8. Search Console monitoring

---

# NAPOMENA

Bez SSR/prerender-a, svi ostali SEO zahvati imaju ograničen efekat.  
To je trenutno najkritičnija tačka sistema.
