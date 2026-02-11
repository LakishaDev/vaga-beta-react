# 🔐 Cloudflare Secrets Setup

## Kako Postaviti Secrets

### 1. Lokalno (za development)

Kreiraj `.env.production.secrets` fajl:

```env
API_TOKEN=tvoj_api_token
ALLOWED_ORIGINS=https://vaga-beta.rs,https://localhost:5173
```

Ili koristi wrangler:

```bash
# Production
wrangler secret put API_TOKEN --env production
# Kada prosi, prosleđi vrednost

wrangler secret put ALLOWED_ORIGINS --env production
```

### 2. U GitHub Actions

Dodaj GitHub Secrets:

1. Idi na **Settings → Secrets and variables → Actions**
2. Klikni **New repository secret**
3. Dodaj:

```
Name: CLOUDFLARE_API_TOKEN
Value: tvoj_token

Name: CLOUDFLARE_ACCOUNT_ID
Value: 031ca9685557ca09a945ef3d0ba54f8e

Name: ALLOWED_ORIGINS
Value: https://vaga-beta.rs,https://localhost:5173
```

### 3. Korišćenje u Worker-u

Secrets se pristupaju kao `env` varijable:

```javascript
export default {
  async fetch(request, env, ctx) {
    // Vars (javne - u wrangler.toml)
    const logLevel = env.LOG_LEVEL; // "info"

    // Secrets (privatne - sa wrangler secret put)
    const apiToken = env.API_TOKEN;
    const allowedOrigins = env.ALLOWED_ORIGINS?.split(",") || [];

    // Check API token
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${apiToken}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response("OK");
  },
};
```

## wrangler.toml - Vars vs Secrets

```toml
# VARS - javne vrednosti (u repo fajlu)
[vars]
LOG_LEVEL = "info"
MAX_FILE_SIZE = "52428800"

# SECRETS - privatne vrednosti (NIKADA u repo)
# Postavlja se sa: wrangler secret put NAZIV --env production
```

## CLI Komande

```bash
# Put secret
wrangler secret put API_TOKEN --env production

# List secrets (samo nazive)
wrangler secret list --env production

# Delete secret
wrangler secret delete API_TOKEN --env production

# Test sa secret
wrangler dev --env development
```

## Environment-Specific Secrets

```bash
# Production secret
wrangler secret put API_TOKEN --env production

# Development secret (drugačija vrednost)
wrangler secret put API_TOKEN --env development
```

## Primer sa API Token Validacijom

Dodaj u r2-cache-worker.js:

```javascript
async function validateAuth(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  return token === env.API_TOKEN;
}

// U handler-ima
if (request.method === "DELETE" || request.method === "POST") {
  if (!(await validateAuth(request, env))) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

## CORS sa Secrets

```javascript
const ALLOWED_ORIGINS = (env.ALLOWED_ORIGINS || "").split(",");

function getCorsHeaders(origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }
  return {};
}
```

## .env vs .wrangler.toml Razlika

|                | .env               | wrangler.toml (vars) | Secrets      |
| -------------- | ------------------ | -------------------- | ------------ |
| **Tip**        | Lokalni config     | Javno dostupno       | Privatno     |
| **Sadržaj**    | Senzitivne podatke | Konfiguracija        | API ključevi |
| **U repo**     | ❌ Ne              | ✅ Da                | ❌ Ne        |
| **Korišćenje** | React kod          | Worker kod           | Worker kod   |
| **Pristup**    | `import.meta.env`  | `env.VAR`            | `env.SECRET` |

## Sigurnosni Checklist

- ✅ Nikada ne commituj `.env` fajl
- ✅ Nikada ne commituj secrets
- ✅ Koristi `.gitignore` za sensitive fajlove
- ✅ Rotira tokene redovno
- ✅ Koristi environment-specific secrets
- ✅ Validira API tokene u worker-u
- ✅ Log pristupe (bez tokena vrednosti!)

## Debugging

Vidi secret vrednosti (lokalno):

```bash
wrangler secret list --env production
```

Test worker sa secretima:

```bash
wrangler dev --env development
```

Proverite logs:

```bash
wrangler tail --env production
```

## Primena na Tvoj Setup

Za tvoj R2 cache worker, trebaju samo:

```bash
# Opciono - za API protection
wrangler secret put API_TOKEN --env production

# Opciono - za CORS
wrangler secret put ALLOWED_ORIGINS --env production
```

Ili ostane bez auth-a (sada je javno dostupan).

---

**Siguran način**:

1. Postavi secrets sa `wrangler secret put`
2. Pristupa kao `env.NAZIV` u worker-u
3. Nikada ne commituj secrets
4. Koristi GitHub Secrets za CI/CD
