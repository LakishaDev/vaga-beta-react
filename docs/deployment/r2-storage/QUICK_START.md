# 🚀 R2 Cloudflare Cache - Quick Start Vodič

Implementiran je kompletan sistem za Cloudflare R2 cache na vašoj VAGA Beta aplikaciji.

## 📁 Kreirani Fajlovi

### Core Servisi

- **[src/services/R2CacheService.js](src/services/R2CacheService.js)** - Kompletan R2 cache service sa upload, download, delete funkcijama
- **[src/hooks/useR2Cache.js](src/hooks/useR2Cache.js)** - React hooks za R2 operacije
- **[src/contexts/R2CacheContext.jsx](src/contexts/R2CacheContext.jsx)** - React Context za globalni R2 pristup

### Komponente

- **[src/components/R2CacheUploader.jsx](src/components/R2CacheUploader.jsx)** - Drag & drop uploader
- **[src/components/R2CacheComponents.jsx](src/components/R2CacheComponents.jsx)** - Image, File, Video komponente

### Cloudflare Worker

- **[src/workers/r2-cache-worker.js](src/workers/r2-cache-worker.js)** - Cloudflare Worker za R2 handling

### Konfiguracija

- **[wrangler.toml](wrangler.toml)** - Wrangler konfiguracija
- **[.env.example](.env.example)** - Environment variables template
- **[vite.config.r2.example.js](vite.config.r2.example.js)** - Vite optimizacije za R2

### Primeri

- **[src/examples/R2CacheExamples.jsx](src/examples/R2CacheExamples.jsx)** - Kompleti primeri korišćenja
- **[R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md)** - Detaljno uputstvo za setup

## ⚡ Quick Start (5 Minuta)

### 1. Instalacija Dependencija

```bash
npm install
```

Dodane zavisnosti:

- `wrangler` - Cloudflare Workers CLI
- `@cloudflare/workers-sdk` - Cloudflare SDK

### 2. Cloudflare Konfiguracija

**Prikaži Cloudflare Info:**

```bash
wrangler whoami
```

**Kreiraj R2 Bucket:**

```bash
wrangler r2 bucket create vaga-beta-cache
```

**Kreiraj KV Namespace:**

```bash
wrangler kv:namespace create CACHE_METADATA --preview false
```

### 3. Popuni .env

```bash
cp .env.example .env
```

Ažuriraj `.env`:

```env
VITE_R2_WORKER_URL=https://cache.vaga-beta.rs
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
VITE_CLOUDFLARE_API_TOKEN=your_api_token
VITE_R2_BUCKET_NAME=vaga-beta-cache
```

### 4. Ažurira wrangler.toml

Zameni:

- `YOUR_CLOUDFLARE_ACCOUNT_ID` - Tvoj account ID
- `YOUR_CLOUDFLARE_ZONE_ID` - Tvoj zone ID
- `YOUR_KV_NAMESPACE_ID` - KV namespace ID

### 5. Deploy Worker

```bash
wrangler deploy src/workers/r2-cache-worker.js
```

### 6. Test Upload

```bash
# Testiraj health
curl https://cache.vaga-beta.rs/health
```

## 💻 Korišćenje U Aplikaciji

### Jednostavni Upload

```jsx
import { useR2Cache } from "@/hooks/useR2Cache";

function MyComponent() {
  const { uploadFile } = useR2Cache();

  const handleUpload = async (file) => {
    await uploadFile(file, { namespace: "products" });
  };

  return (
    <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
  );
}
```

### Drag & Drop Uploader

```jsx
import R2CacheUploader from "@/components/R2CacheUploader";

function Page() {
  return (
    <R2CacheUploader
      namespace="documents"
      onSuccess={(result) => console.log(result.url)}
    />
  );
}
```

### Lazy Load Images

```jsx
import { R2CacheImage } from "@/components/R2CacheComponents";

function Gallery() {
  return (
    <R2CacheImage
      filename="product.jpg"
      namespace="images"
      className="w-full rounded"
      loading="lazy"
    />
  );
}
```

### Download Link

```jsx
import { R2CacheFile } from "@/components/R2CacheComponents";

function Downloads() {
  return (
    <R2CacheFile
      filename="manual.pdf"
      namespace="documents"
      displayName="📖 Manual"
    />
  );
}
```

### U App.jsx

```jsx
import { R2CacheProvider } from "@/contexts/R2CacheContext";

export default function App() {
  return <R2CacheProvider>{/* Ostatak tvoje aplikacije */}</R2CacheProvider>;
}
```

## 🎯 Namespace Preporuke

Organizuj fajlove u logične namespace-e:

```javascript
// Slike proizvoda
await uploadFile(image, { namespace: "images/products" });

// Thumbnails
await uploadFile(thumb, { namespace: "images/thumbnails" });

// Dokumenti
await uploadFile(doc, { namespace: "documents" });

// Licence
await uploadFile(license, { namespace: "licenses" });

// Videi
await uploadFile(video, { namespace: "videos" });
```

## 🔧 Cache Control Strategije

```javascript
// Statični aseti (1 godinu)
cacheControl: "public, max-age=31536000, immutable";

// Često pristupani (1 sat)
cacheControl: "public, max-age=3600, must-revalidate";

// Dinamički sadržaj (bez cache)
cacheControl: "public, max-age=0, must-revalidate";

// Private sadržaj (samo user)
cacheControl: "private, max-age=3600";
```

## 📊 Monitoring

### Logs

```bash
wrangler tail --env production
```

### Analytics

```bash
wrangler analytics-engine
```

### R2 Bucket Info

```bash
wrangler r2 bucket list
```

## 🔒 Sigurnost

### Zaštita API Tokena

- **NIKADA** ne commituj `.env` u git
- Koristi `.gitignore` za `.env` fajl
- Rotira API tokene redovno

### CORS Configuration

- Proverite `handleOptions()` u worker-u
- Ograniči pristup samo potrebnim domenama

### Rate Limiting

- Implementiraj rate limiting u worker-u
- Monitoring za neobične upload aktivnosti

## 🚨 Troubleshooting

### "Worker Timeout"

```bash
# Proverite bucket status
wrangler r2 bucket list

# Proverite API token permissions
wrangler whoami
```

### "CORS Error"

- Proverite CORS headers u worker-u
- Test sa `curl -i` da vidite response headers

### "IndexedDB Not Available"

- Nije dostupan u private/incognito modu
- Aplikacija će fallback na R2 direktan pristup

### "File Not Found"

- Proverite namespace je ispravan
- Proverite key format: `v1/{namespace}/{filename}`

## 📈 Performance Tips

1. **Koristiti lazy loading** za slike
2. **Immutable cache** za statične asete
3. **KV metadata** za brži pristup info
4. **Chunking** za velike fajlove
5. **CDN caching** sa Cloudflare Edge

## 📚 Dodatni Resursi

- [Cloudflare R2 Dokumentacija](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Dokumentacija](https://developers.cloudflare.com/workers/wrangler/)
- [R2 Pricing](https://www.cloudflare.com/pricing/r2/)
- [Cloudflare Cache API](https://developers.cloudflare.com/cache/)

## 🎓 Naslednje Korake

1. ✅ **Setup** - Završite quick start
2. ✅ **Test** - Testirajte upload/download
3. ✅ **Integracija** - Integrujte u aplikaciju
4. ✅ **Monitoring** - Postavite monitoring
5. ✅ **Scaling** - Optimizujte za produkciju

## 💰 Troškovi

- **R2 Storage**: $0.015/GB/mesec
- **API Requests**: $0.36/milion zahteva
- **Egress**: $0.02/GB prvi 50GB, zatim niže

R2 je **100% jeftiniji** od S3 za egress!

## ❓ FAQ

**P: Gde su fajlovi fizički smešteni?**
A: U Cloudflare R2 (multiple lokacije za redundansu)

**P: Mogu li pristupati fajlovima bez auth-a?**
A: Da, ali možeš ograničiti sa CORS/Rate Limiting

**P: Šta se dešava ako bucket bude obrisan?**
A: Sve slike/fajlovi su izgubljeni - Backup redovno!

**P: Mogu li koristiti sa serverless funkcijama?**
A: Da, R2 API radi sa svim serverless platformama

## 📞 Support

Za dodatnu pomoć:

1. Pročitaj [R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md)
2. Proverite [src/examples/](src/examples/) primere
3. Kontaktiraj Cloudflare podršku

---

**Implementirano**: Januar 20, 2025
**Status**: ✅ Spreman za upotrebu
**Verzija**: 1.0.0
