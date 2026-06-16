# Feed download — usklađivanje putanja + sigurnosni fix

**Datum:** 2026-06-16
**Fajlovi:** `src/workers/r2-cache-worker.js`, `functions/src/updates/ciRegisterRelease.ts`

## Problem

Ručni test feed download-a vraćao je `404 File not found`:

```bash
curl "https://worker.vagabeta.rs/download/server/releases.stable.json" -H "X-Feed-Token: <token>"
# → 404 {"error":"File not found"}
```

Dijagnoza:

1. **404, ne 401** → `verifyFeedToken` je prošao; token verifikacija radi. Problem je što u R2 ne postoji objekat na traženom ključu.
2. Listanje bucket-a (`/list`) pokazalo je da su prefiksi `server/`, `client/` i `software-updates/` **prazni** — feed artefakti nikad nisu uploadovani.
3. Putanje su bile **nedosledne** kroz slojeve:
   - worker je kao feed prihvatao `software-updates/`, `server/` i `client/`,
   - default `feedPath` u `ciRegisterRelease` je bio samo `server` / `client`,
   - plan dokument definiše `software-updates/<app>/<channel>/`.
4. **Sigurnosni nalaz:** u bucket-u su pronađena dva objekta sa tragom path-traversal napada (upload 2026-03-23):
   ```
   v1/general/../../../../../../../../etc/cron.d/srv   (49 B)
   v1/general/../../../../../../../../server.mjs       (4487 B)
   ```
   Uzrok: `namespace` u upload handlerima ulazio je **sirov** u R2 ključ (`v1/<namespace>/<filename>`), bez sanitizacije, pa je `namespace="general/../../etc/cron.d"` kreirao ključ van očekivanog `v1/` prostora.

## Odluka

Kanonski layout = **ugnježdeno, po planu**:

```
software-updates/<app>/<channel>/...
  software-updates/server/stable/releases.stable.json
  software-updates/server/stable/eVagaServer-<ver>-full.nupkg
  software-updates/server/stable/eVagaServer-<ver>-delta.nupkg
  software-updates/client/stable/releases.stable.json
  ...
```

Kanali su odvojeni u foldere (čistije za beta/stable i lakše brisanje po kanalu).

## Izmene

### 1. `ciRegisterRelease.ts` — default `feedPath`

Više nije placeholder `server` / `client`, nego prati plan:

```ts
server.feedPath ?? `software-updates/server/${channel}`
client.feedPath ?? `software-updates/client/${channel}`
```

### 2. Worker — download ruta (feed gate)

Feed se sada prepoznaje **samo** po `software-updates/` prefiksu (uklonjeni nedosledni standalone `server/` / `client/`). Dodato je vezivanje tokena za aplikaciju iz putanje:

```js
if (key.startsWith("software-updates/")) {
  const decoded = await verifyFeedToken(feedToken, env);
  if (!decoded) → 401 Unauthorized
  else if (decoded.app !== key.split("/")[1]) → 403 Forbidden   // server-token ne sme client-artefakte
  else → handleDownload(key)
}
```

### 3. Worker — `verifyFeedToken`

Sada vraća **dekodovani payload** (`{ version, app, expiresAt, sig }`) na uspeh, odnosno `null` na neuspeh (ranije `true/false`), da bi ruta mogla da proveri `app`.

### 4. Worker — sanitizacija `namespace` (sigurnosni fix)

Nova funkcija uklanja path-traversal:

```js
function sanitizeNamespace(namespace = "general") {
  const cleaned = String(namespace)
    .replace(/\\/g, "/")
    .replace(/\.\./g, "")        // ukloni svaki ".."
    .replace(/\/{2,}/g, "/")     // collapse dvostrukih slash-eva
    .replace(/^\/+|\/+$/g, "")   // strip leading/trailing slash
    .trim();
  return cleaned || "general";
}
```

Primenjena na `namespace` u `handleUpload`, `handleUploadBatch` i `handlePresignedUpload`. U `handlePresignedUpload` je usput sanitizovan i `filename` (ranije je išao sirov u ključ).

## Konzistentnost (lanac koji se sad poklapa)

| Sloj | Vrednost |
|---|---|
| CI `vpk upload s3 --prefix` | `software-updates/server/stable` |
| `feedPath` (Firestore) | `software-updates/server/stable` |
| `feedUrl` (`updateCheck`) | `WORKER/download/software-updates/server/stable` |
| Velopack traži | `<feedUrl>/releases.stable.json` → ključ `software-updates/server/stable/releases.stable.json` |
| Worker | `software-updates/` → verifikuje token → `token.app === <app>` segment → serve iz R2 |

## Preostali koraci (deploy + ops)

1. Obrisati dva traversal objekta iz R2 (vektor je sada zatvoren u kodu).
2. Deploy worker-a: `wrangler deploy -c wrangler.workers.toml`.
3. Deploy funkcija: `firebase deploy --only functions` (novi `feedPath` default).
4. CI (`vpk upload s3`) mora da gađa `software-updates/<app>/stable`; ako šalje `artifacts.<app>.feedPath` u `ciRegisterRelease`, postaviti istu vrednost.
5. Test: koristiti `feedUrl` iz odgovora `updateCheck` (ne hardkodovati putanju) + `X-Feed-Token`.

## Napomene

- Deployuje se `src/workers/r2-cache-worker.js` (`main` u `wrangler.workers.toml`); `r2-cache-worker-with-secrets.js` se ne deployuje.
- Lint greška `'ctx' is defined but never used` je postojeća (javlja se kroz ceo repo), nije iz ovih izmena.
