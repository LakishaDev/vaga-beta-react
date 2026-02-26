# SEO Go-Live Checklist (Cloudflare)

## 1) Pre-build (lokalno ili CI)

- Pokreni env proveru:

```bash
npm run env:check
```

- Pokreni lokalni SEO smoke (sitemap strukturna validacija):

```bash
npm run seo:smoke:local
```

## 2) Build & Deploy

- Build:

```bash
npm run build:cloudflare
```

- Deploy:

```bash
npm run deploy:cloudflare
```

## 3) Post-deploy (live validacija)

- Pokreni live smoke:

```bash
npm run verify:live
```

Očekivano:

- `robots.txt` je dostupan (`200`) i `content-type` je `text/plain`
- `sitemap.xml` je dostupan i sadrži product URL-ove (`/p/...`)
- listing ruta `/prodavnica/proizvodi` ima canonical + `CollectionPage` JSON-LD
- testirani `/p/...` URL-ovi imaju canonical + `Product` JSON-LD
- ključne slike vraćaju validan image content-type

## 4) Google Search Console

1. Submituj `https://vagabeta.rs/sitemap.xml`
2. Uradi URL inspection za minimum 3 proizvoda
3. Klikni "Request indexing"
4. Prati: Indexed pages, Excluded pages, Core Web Vitals

## 5) Lighthouse spot check (mobile)

Proveri minimum:

- Home
- `/prodavnica/proizvodi`
- jedan `/p/:slug`

Cilj:

- SEO score 90+
- CLS < 0.1
