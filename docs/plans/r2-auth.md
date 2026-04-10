# Plan: R2 Worker Authentication

## Context

- Active worker: `src/workers/r2-cache-worker.js` (no auth, wildcard CORS)
- Auth variant exists: `src/workers/r2-cache-worker-with-secrets.js` (has auth but NOT the deployed main)
- `wrangler.workers.toml` → already has `CORS_ORIGIN=https://vagabeta.rs` under `[env.production]`
- `handleOptions()` at line 458 — currently no `env` param, returns wildcard CORS
- Router: `export default { async fetch(request, env, ctx) }` at line 472

## Decisions

- Auth: API key via `env.API_TOKEN` (Bearer token, wrangler secret)
- Protected: POST /upload, /upload-batch, /presigned-upload, DELETE /delete/\*
- CORS: Restrict to `env.CORS_ORIGIN` (vagabeta.rs in prod, fallback to \* in dev)
- Strategy: Merge into r2-cache-worker.js (single file)

## Steps

### Phase 1: Add auth + CORS helpers (r2-cache-worker.js, top of file)

1. Add `validateAuth(request, env)` — copied from r2-cache-worker-with-secrets.js (lines 13-31)
2. Add `getCorsHeaders(request, env)` — adapted to use `env.CORS_ORIGIN` (single string, not comma-list) instead of `env.ALLOWED_ORIGINS`
3. Update `handleOptions` signature to `handleOptions(request, env)` and use `getCorsHeaders`
4. Update router call at line 479: `return handleOptions(request, env)`

### Phase 2: Protect write handlers

5. `handleUpload` (line ~30) — add validateAuth check, return 401 + getCorsHeaders on failure
6. `handleUploadBatch` (line ~113) — same
7. `handleDelete` (line ~337) — same
8. `handlePresignedUpload` (line ~410) — same

### Phase 3: Set wrangler secret

9. `wrangler secret put API_TOKEN --config wrangler.workers.toml --env production`
10. Redeploy: `wrangler deploy --config wrangler.workers.toml --env production`

## Verification

1. Without token: `curl -X POST https://<worker>/upload` → 401 Unauthorized
2. With valid token: `curl -X POST -H "Authorization: Bearer <token>" ...` → success
3. GET /images/... without token → 200 (reads remain open)
4. CORS preflight from vagabeta.rs → allowed; from unauthorized origin → blocked

## Files Modified

- `src/workers/r2-cache-worker.js` — only file to change
- `wrangler.workers.toml` — no changes needed (CORS_ORIGIN already set)
