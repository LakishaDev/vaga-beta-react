# Videos Folder

Ovaj folder sadrži video fajlove za aplikaciju.

## Potrebni fajlovi

- `eVaga Program 2026.mp4` - Prezentacija e-Vaga programa (koristi se na Home stranici)

## Napomena

⚠️ **Lokalni video fajlovi su fallback** - koriste se samo kada `VITE_R2_WORKER_URL` nije postavljen.

U produkciji, video fajlovi bi trebali biti hostovani na Cloudflare R2 storage.

## Dodavanje video fajla

1. Dodaj video fajl u ovaj folder: `public/videos/eVaga Program 2026.mp4`
2. Video će biti dostupan na `/videos/eVaga Program 2026.mp4`

## R2 Production Setup

Za production environment, postavi:

```
VITE_R2_WORKER_URL=https://worker.vagabeta.rs
```

Onda upload video na R2 bucket:

```bash
wrangler r2 object put vaga-beta-cache/v1/videos/eVaga\ Program\ 2026.mp4 --file="path/to/video.mp4"
```
