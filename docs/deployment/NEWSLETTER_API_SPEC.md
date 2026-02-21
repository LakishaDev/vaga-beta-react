# Newsletter Subscribe API Spec

## Overview

Frontend salje prijavu na backend endpoint, backend upisuje kontakt u Brevo listu.

- Frontend endpoint: `POST /api/newsletter/subscribe`
- Backend provider: `POST https://api.brevo.com/v3/contacts`
- Deployment target: Cloudflare Pages Functions (`functions/api/newsletter/subscribe.js`)

## Request Contract

Content-Type: `application/json`

```json
{
  "email": "user@domain.com",
  "consent": true,
  "source": "optional",
  "honeypot": ""
}
```

Validation rules:

- `email` required, valid email format
- `consent` must be `true`
- `honeypot` must be empty string
- `source` optional string (max 120 chars recommended)

## Response Contract

- `200`:

```json
{ "ok": true, "message": "Hvala! Proverite email za potvrdu prijave." }
```

- `400`:

```json
{ "ok": false, "message": "Invalid email" }
```

- `409`:

```json
{ "ok": false, "message": "Already subscribed" }
```

- `500`:

```json
{ "ok": false, "message": "Server error" }
```

## Brevo API Call

Endpoint:

- `POST https://api.brevo.com/v3/contacts`

Headers:

- `api-key: ${BREVO_API_KEY}`
- `Content-Type: application/json`

Body:

```json
{
  "email": "user@domain.com",
  "listIds": [123],
  "updateEnabled": true,
  "attributes": {
    "SOURCE": "footer"
  }
}
```

Env vars:

- `BREVO_API_KEY`
- `BREVO_LIST_ID`

Security rule:

- API key nikad ne sme biti u frontendu

## Anti-abuse Requirements

- Rate limit po IP: 10 request / hour
- Honeypot check: ako je `honeypot` popunjen, vrati success-like odgovor bez slanja ka Brevo (silent drop)
- Optional: cooldown po email hash (npr. 1 min)

## Logging (minimal)

Loguj samo:

- timestamp
- ip hash (npr. SHA-256(ip + salt))
- email hash (SHA-256(lowercase(email) + salt))
- outcome status (`ok`, `invalid`, `duplicate`, `error`, `blocked`)

Nemoj logovati raw email, API key, niti puni IP.

## Double Opt-In

Ako je DOI podesen u Brevo automations/forms:

- Frontend poruka treba da bude:
  - `Hvala! Proverite email za potvrdu prijave.`

## Notes for Local Development

- U `npm run dev` poziv ka `/api/newsletter/subscribe` zahteva lokalni backend route/proxy.
- Ako endpoint nije aktivan lokalno, frontend ce prikazati genericnu error poruku.
