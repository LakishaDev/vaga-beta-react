# Cloudflare R2 Cache Setup Vodič

Kompletan vodič za postavljanje R2 cache-a na vašoj React aplikaciji.

## 📋 Preduslov

1. Cloudflare nalog sa R2 pristupom
2. Wrangler CLI instaliran
3. Node.js verzija 16+

## 🚀 Setup Koraci

### 1. Instalacija Dependencija

```bash
npm install
```

### 2. Konfiguracija Cloudflare Nalog

#### a) Prikaži Cloudflare ID-eve

```bash
wrangler whoami
```

#### b) Kreiraj R2 bucket

```bash
wrangler r2 bucket create vaga-beta-cache
```

#### c) Kreiraj API Token

1. Idi na Cloudflare Dashboard
2. Account → API Tokens → Create Token
3. Koristiti template "Edit Cloudflare Workers"
4. Dodaj R2 permissions
5. Kopiraj token

### 3. Konfigurira .env Fajl

```bash
cp .env.example .env
```

Popuni sa tvojim Cloudflare podacima:

```
VITE_R2_WORKER_URL=https://cache.vaga-beta.rs
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
VITE_CLOUDFLARE_API_TOKEN=your_api_token
VITE_R2_BUCKET_NAME=vaga-beta-cache
```

### 4. Konfigurira wrangler.toml

Otvorite `wrangler.toml` i zameni:

- `YOUR_CLOUDFLARE_ACCOUNT_ID` - tvoj account ID
- `YOUR_CLOUDFLARE_ZONE_ID` - tvoj zone ID (iz DNS settings)
- `YOUR_KV_NAMESPACE_ID` - kreiraj KV namespace

Kreiraj KV Namespace:

```bash
wrangler kv:namespace create CACHE_METADATA
```

### 5. Deploy Cloudflare Worker

```bash
wrangler deploy src/workers/r2-cache-worker.js
```

## 📝 Korišćenje

### U React Komponentama

#### Jednostavna upotreba

```jsx
import { useR2Cache } from "@/hooks/useR2Cache";

function MyComponent() {
  const { uploadFile, getFile, loading, error } = useR2Cache();

  const handleUpload = async (file) => {
    try {
      const result = await uploadFile(file, {
        namespace: "images",
        cacheControl: "public, max-age=31536000",
      });
      console.log("Uploaded:", result);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
        disabled={loading}
      />
    </div>
  );
}
```

#### Sa Progress Indikatorom

```jsx
import { useR2Upload } from "@/hooks/useR2Cache";

function UploadWithProgress() {
  const { progress, uploading, upload } = useR2Upload();

  const handleUpload = async (file) => {
    await upload(file, { namespace: "documents" });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <progress value={progress} max="100"></progress>}
    </div>
  );
}
```

#### Lazy Loading Fajlova

```jsx
import { useR2LazyLoad } from "@/hooks/useR2Cache";

function ImageViewer() {
  const { file, loading, load } = useR2LazyLoad("my-image.jpg", "images");

  return (
    <div>
      <button onClick={() => load()}>
        {loading ? "Učitavanje..." : "Učitaj sliku"}
      </button>
      {file && <img src={URL.createObjectURL(file)} alt="preview" />}
    </div>
  );
}
```

#### Direktan URL

```jsx
import R2CacheService from "@/services/R2CacheService";

function DirectLink() {
  const url = R2CacheService.getFileUrl("document.pdf", "documents");

  return (
    <a href={url} download>
      Preuzmi PDF
    </a>
  );
}
```

## 🔧 Naprednija Konfiguracija

### Custom Cache Control Headers

```javascript
// Cache na 1 godinu (za slike, CSS, JS)
await uploadFile(file, {
  cacheControl: "public, max-age=31536000, immutable",
});

// Cache na 1 sat (za često menjane sadržaje)
await uploadFile(file, {
  cacheControl: "public, max-age=3600, must-revalidate",
});

// Bez cache-a (za dinamički sadržaj)
await uploadFile(file, {
  cacheControl: "public, max-age=0, must-revalidate",
});
```

### Namespace Organizacija

```javascript
// Slike
await uploadFile(image, { namespace: "images" });

// Dokumenti
await uploadFile(doc, { namespace: "documents" });

// Proizvodi
await uploadFile(productData, { namespace: "products" });

// Licenca
await uploadFile(license, { namespace: "licenses" });
```

### Metadata

```javascript
await uploadFile(file, {
  customMetadata: {
    userId: user.id,
    productId: product.id,
    version: "1.0",
    category: "images",
  },
});
```

## 📊 Monitoring

### Proveri Upload Log

```bash
wrangler tail --env production
```

### Analitika

```bash
wrangler analytics-engine
```

## 🔒 Sigurnost

### Ograniči Pristup

```javascript
// U wrangler.toml dodaj:
[[routes]]
pattern = "https://vaga-beta.rs/cache/*"
zone_id = "YOUR_ZONE_ID"

# Samo GET zahtevi za javnost, POST/DELETE zahtevi sa auth tokenom
```

### API Token Scope

Koristi najuži mogući scope:

- `Account.R2` - pristup R2
- `Zone.Cache Purge` - cache purge
- `Workers.r2 object:read:vaga-beta-cache`
- `Workers.r2 object:write:vaga-beta-cache`

## 🧹 Održavanje

### Očisti Stari Cache

```javascript
// Automatski se čisti, ali može ručno:
await R2CacheService.clearOldCache(30); // 30 dana
```

### Monitoruj Kapacitet

```bash
wrangler r2 bucket list
```

## 🐛 Troubleshooting

### "Worker timeout"

- Proverite da je R2 bucket kreiraj
- Proverite API token permisije

### "CORS error"

- Proverite da `handleOptions()` vraća ispravne headers
- Proverite `Access-Control-Allow-Origin`

### "IndexedDB error"

- Nije dostupan u privatnom/incognito modusu
- Fallback na R2 direktan pristup

## 📚 Dodatni Resursi

- [Cloudflare R2 Dokumentacija](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Dokumentacija](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Cache Strategije](https://developers.cloudflare.com/cache/)

## 💡 Best Practices

1. **Različiti namespace-i** za različite tipove fajlova
2. **Immutable cache** za statične asete (slike, CSS, JS)
3. **KV metadata** za brži pristup info o fajlovima
4. **Regular cleanup** starog cache-a
5. **Monitoring** trafika i troškova
6. **Version kontrola** za fajlove (v1/, v2/ prefiks)

## 📞 Podrška

Za dodatnu pomoć, kontaktiraj Cloudflare podršku ili proverite dokumentaciju.
