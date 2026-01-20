# 🔐 Secrets Setup - Quick Guide

## Što Trebate

Dve opcije:

### Option 1: Bez Auth-a (SADA - preporuka)

```
Ostanu bez secrets - sve je dostupno javno
Samo CORS headers za sigurnost
```

### Option 2: Sa Auth Token-om

```
API_TOKEN - za zaštitu upload/delete operacija
ALLOWED_ORIGINS - za CORS whitelist
```

---

## Kako Postaviti Secrets

### Korak 1: Lokalno Postaviti (Development)

```bash
# Postavi API token za production
wrangler secret put API_TOKEN --env production

# Kada prosi, unesi token (npr: sk-1234567890abcdef)
```

Ili bez intereaktivnog unosa:

```bash
echo "sk-1234567890abcdef" | wrangler secret put API_TOKEN --env production
```

### Korak 2: Proveri da je Postavljeno

```bash
wrangler secret list --env production
```

Trebalo bi da vidite:

```
API_TOKEN
```

### Korak 3: Koristi u Worker-u

Promeni `wrangler deploy` da koristi ispravljeni worker:

```bash
# Zameni sa verzijom sa secrets
cp src/workers/r2-cache-worker-with-secrets.js src/workers/r2-cache-worker.js
wrangler deploy src/workers/r2-cache-worker.js --env production
```

### Korak 4: Test Upload sa Token-om

```bash
# Bez tokena (neće raditi sa auth-om)
curl -X POST https://vaga-beta-r2.lakisha.workers.dev/upload \
  -F "file=@test.txt" \
  -F "namespace=test"

# Sa token-om (trebalo bi da radi)
curl -X POST https://vaga-beta-r2.lakisha.workers.dev/upload \
  -H "Authorization: Bearer sk-1234567890abcdef" \
  -F "file=@test.txt" \
  -F "namespace=test"
```

---

## Za GitHub Actions (CI/CD)

### 1. Dodaj GitHub Secrets

Settings → Secrets and variables → Actions

```
CLOUDFLARE_API_TOKEN      = tvoj_api_token
CLOUDFLARE_ACCOUNT_ID     = 031ca9685557ca09a945ef3d0ba54f8e
R2_API_TOKEN             = sk-1234567890abcdef (optional)
```

### 2. .github/workflows/deploy-r2.yml

```yaml
- name: Deploy Worker
  uses: cloudflare/wrangler-action@v3
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    # Secret će biti automatski dostupan worker-u
```

---

## Korišćenje sa React App-om

### Sa Token-om

```javascript
import { useR2Cache } from "@/hooks/useR2Cache";

function UploadComponent() {
  const { uploadFile } = useR2Cache();

  const handleUpload = async (file) => {
    // Trebate token iz .env ili auth-a
    const token = import.meta.env.VITE_R2_API_TOKEN;

    await uploadFile(file, {
      namespace: "images",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
  );
}
```

Dodaj u .env:

```env
VITE_R2_API_TOKEN=sk-1234567890abcdef
```

### Bez Token-a (Javno)

```javascript
// Jednostavno - nema potrebe za tokenima
<R2CacheUploader namespace="images" />
```

---

## Preporuke

| Scenario                  | Koristi           |
| ------------------------- | ----------------- |
| **Development**           | Bez auth-a (SADA) |
| **Production - Javna**    | Bez auth-a + CORS |
| **Production - Privatna** | API token auth    |
| **Public API**            | CORS whitelist    |

---

## Sigurnost

✅ **DO:**

- Koristi `wrangler secret put` za secrets
- Koristi GitHub Secrets za CI/CD
- Rotira tokene redovno
- Koristi `Bearer` scheme za auth

❌ **DON'T:**

- Nikada ne commituj secrets u .env
- Nikada ne postavi secrets u wrangler.toml
- Nikada ne deli tokene

---

## Trenutni Status

📝 **Sada:**

- ✅ Worker je aktivan bez auth-a
- ✅ Javno dostupan (CORS enabled)
- ✅ Sve komponente rade

🔒 **Za kasnije:**

- Optionalno: Dodaj API token
- Optionalno: Postavi CORS whitelist

---

## Komande Reference

```bash
# Postavi secret
wrangler secret put API_TOKEN --env production

# Lista secrets
wrangler secret list --env production

# Obriši secret
wrangler secret delete API_TOKEN --env production

# Dev server sa secretima
wrangler dev --env development

# Vidi logs
wrangler tail --env production
```

---

## Za Tvoj Setup

**SADA (bez promene):**

- Worker je live i radi
- Nema potrebe za secretima
- Sve komponente su dostupne

**KASNIJE (ako trebaju):**

```bash
# Samo ako želiš da dodaš auth
wrangler secret put API_TOKEN --env production
cp src/workers/r2-cache-worker-with-secrets.js src/workers/r2-cache-worker.js
wrangler deploy src/workers/r2-cache-worker.js --env production
```

Vise informacija u [SECRETS_SETUP.md](SECRETS_SETUP.md)
