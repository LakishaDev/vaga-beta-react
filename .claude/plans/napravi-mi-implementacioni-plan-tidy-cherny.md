# Version Control Management — Implementacioni plan

## Context (zašto se ovo radi)

Trenutno desktop aplikacija (eVaga `server` i `client`) preko Cloud Function-a
`updateCheck` ([functions/src/updates/updateCheck.ts](functions/src/updates/updateCheck.ts))
**uvek** dobija najnoviji `published` release u svom kanalu (`isLatest == true`), a
`semverGt` aktivno **blokira downgrade** — verzija može samo da raste. Admin nema nikakvu
kontrolu nad tim koju verziju koji klijent dobija.

Cilj: napraviti **version control management** — admin u Licenses ekranu (i globalno u
Updates ekranu) bira koju verziju klijenti instaliraju ili na koju se **downgrade-uju**, sa
podešavanjem **grace perioda u danima** pre nego što se downgrade forsira. Uz to: admin
(Licenses + Updates) se izdvaja na zaseban poddomen **admin.vagabeta.rs** (postojeća Firebase
auth), Licenses drawer postaje **full-screen**, dodaje se dugme za Updates, i admin dobija
**royal-blue** temu (samo admin, ostatak sajta netaknut).

## Odluke (iz Q&A sa korisnikom)

1. **Hosting:** odmah razdvojiti na poddomen `admin.vagabeta.rs` (host-based routing, postojeća auth).
2. **Dodela verzije:** **globalni default po kanalu** (u Updates) **+ override po licenci** (u Licenses drawer-u). Override pobeđuje default.
3. **Tema:** royal-blue **samo za admin**; marketing + shop ostaju na postojećoj Cobalt Navy paleti.
4. **Scope:** **samo web strana** (Firestore + `updateCheck` + admin UI). Desktop (Velopack downgrade) je zaseban repo — ovde se daje samo response *contract* kao referenca.

> **R2 nije potreban.** Stari `.nupkg` paketi već žive u R2 feed-ovima (`v1/software-updates/{app}/{channel}/`). Downgrade se postiže time što `updateCheck` vrati *stariju* ciljanu verziju + `mandatory/downgrade` flag; binarni artefakti se ne menjaju.

---

## Faza 1 — Poddomen `admin.vagabeta.rs` + Admin App Shell

Cilj: admin app se renderuje samo na admin host-u, čist od marketing/shop chrome-a, uz
postojeću Firebase autentifikaciju. Admin je već CSR-only, tako da nema SSR komplikacija.

**Routing / app split**
- Novi `src/AdminApp.jsx` — `BrowserRouter` sa admin rutama na **čistim** putanjama:
  `/` (dashboard), `/licenses`, `/licenses/orders`, `/updates`, `/login`. Wrap u postojeće
  `AuthProvider` ([src/contexts/shop/auth/AuthProvider.jsx](src/contexts/shop/auth/AuthProvider.jsx))
  + `SnackbarProvider`. Reuse postojećih stranica: `LicensesPage`, `OrdersPage`, `UpdatesPage`
  ([src/pages/admin/](src/pages/admin/)).
- Novi `src/components/admin/AdminLayout.jsx` — zajednički shell (sidebar/topbar + admin guard).
  Guard koristi postojeći `VITE_ADMIN_EMAILS` obrazac (kao u `LicensesPage`/`UpdatesPage`); ako
  nije admin → redirect na `/login`. Sve obmotati u `<div className="admin-shell">` (root za temu, Faza 4).
- [src/App.jsx](src/App.jsx): na vrhu detektovati host i kratko spojiti —
  `if (typeof window !== "undefined" && window.location.hostname.startsWith("admin.")) return <AdminApp />;`
  pre postojeće pathname logike. (SSR-safe: na admin host-u middleware ne SSR-uje — vidi dole.)
- [functions/_middleware.js](functions/_middleware.js): na samom početku detektovati admin host
  (`url.hostname.startsWith("admin.")`) → preskočiti SSR + promo injection, servirati statički
  `index.html` shell (isti kao za postojeće CSR rute oko linija 546–605). Bez ovoga middleware bi
  pokušao da SSR-uje marketing na admin host-u.
- Stare rute `/prodavnica/admin/*` ostaju funkcionalne (da se ne lome postojeći linkovi).
  Opciono: dodati redirect sa `/prodavnica/admin/*` na ekvivalent na poddomenu.

**Konfiguracija (radi se u konzolama, nije kod — izlistati za izvršioca)**
- Cloudflare Pages: dodati `admin.vagabeta.rs` kao **custom domain** na isti Pages projekat (isti `dist`), + DNS CNAME.
- Firebase Auth → **Authorized domains**: dodati `admin.vagabeta.rs`.
- App Check / reCAPTCHA v3: registrovati `admin.vagabeta.rs` kao dozvoljeni domen
  (`VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` za lokal već postoji).
- ⚠️ **Gotcha — Firebase Auth persistencija je per-origin.** Login na `vagabeta.rs` se NE prenosi na
  `admin.vagabeta.rs`; admin se loguje zasebno na poddomenu. To je prihvatljivo (čista separacija).

**Kritični fajlovi:** `src/AdminApp.jsx` (novo), `src/components/admin/AdminLayout.jsx` (novo),
[src/App.jsx](src/App.jsx), [functions/_middleware.js](functions/_middleware.js).

---

## Faza 2 — Backend: data model, rules, Cloud Functions

### 2.1 Data model

**Nova polja na `licenses/{licenseKey}` dokumentu** (upisuje **isključivo** Cloud Function):
- `targetVersion: string | null` — tačna verzija na koju je licenca zakovana (null = prati global default).
- `versionMode: "follow" | "pin"` — `follow` = prati `updatePolicies`; `pin` = zaključana na `targetVersion`.
- `versionMandatory: boolean` — da li je promena obavezna (force/downgrade).
- `versionGraceDays: number | null` — uneto u UI (broj dana).
- `downgradeDeadline: Timestamp | null` — izračunato (`now + versionGraceDays`); rok posle kog se downgrade forsira.
- `versionAssignedAt: Timestamp`, `versionAssignedBy: string` (admin email).

**Nova kolekcija `updatePolicies/{channel}`** (`channel` = `"stable"` | `"beta"`):
- `targetVersion: string | null` — null = ponašanje kao danas (najnoviji `isLatest`).
- `mandatory: boolean`
- `defaultGraceDays: number` — grace za globalni downgrade, meren od `updatedAt`.
- `updatedAt: Timestamp`, `updatedBy: string`.

### 2.2 Firestore rules — [firestore.rules](firestore.rules)
Dodati blok (admin read, write samo iz Cloud Functions; isti obrazac kao `releases` na liniji 172):
```
match /updatePolicies/{channel} {
  allow read: if isAdmin();
  allow write: if false;
}
```
`licenses` blok ([firestore.rules:42-45](firestore.rules#L42-L45)) ostaje `write: if false` — nova
polja upisuju samo funkcije. Nema promene za `releases`.

### 2.3 Nove Cloud Functions (TS u `functions/src/`, pa rebuild u `functions/lib/`)
Obrazac: `onCall` + `assertAdmin(req)` (vidi [adminUpdateLicense.ts](functions/src/licenses/adminUpdateLicense.ts) i [adminPublishRelease.ts](functions/src/updates/adminPublishRelease.ts)).

- `functions/src/updates/adminSetVersionPolicy.ts` — args `{ channel, targetVersion, mandatory, defaultGraceDays }`.
  `assertAdmin`. Ako `targetVersion != null` → validirati da `releases/{targetVersion}` postoji i `status == "published"`.
  Upis u `updatePolicies/{channel}` (+ `updatedAt`, `updatedBy`).
- `functions/src/licenses/adminSetLicenseVersion.ts` — args `{ licenseKey, targetVersion, mode, graceDays, mandatory }`.
  `assertAdmin`. Ako `targetVersion != null` → validirati published release. Ako `graceDays` dat →
  `downgradeDeadline = Timestamp.fromMillis(Date.now() + graceDays*86400000)`. Upis novih polja na license doc.
  `targetVersion: null` + `mode: "follow"` = reset na globalni default (ujedno čisti `downgradeDeadline`).
- Registrovati obe u [functions/src/index.ts](functions/src/index.ts) (pa `npm run build` u `functions/`).

### 2.4 Rewrite rezolucije u `updateCheck` — [functions/src/updates/updateCheck.ts](functions/src/updates/updateCheck.ts)
Posle postojeće validacije licence (linije 38–56), zameniti blok "najnoviji isLatest" (59–81) sledećom logikom:

1. **Razreši efektivni target:**
   - Ako `license.versionMode === "pin" && license.targetVersion` → `target = license.targetVersion`,
     `mandatory = license.versionMandatory`, `deadline = license.downgradeDeadline`.
   - Inače učitaj `updatePolicies/{channel}`. Ako `policy.targetVersion` →
     `target = policy.targetVersion`, `mandatory = policy.mandatory`,
     `deadline = policy.updatedAt + policy.defaultGraceDays`.
   - Inače (ništa zadato) → fallback na postojeće ponašanje: najnoviji `isLatest published` (ili `updateAvailable:false` ako ga nema).
2. Učitaj `releases/{target}`; ako ne postoji ili nije `published` → `{ updateAvailable: false }`.
3. **Uporedi** `target` vs `appVersion` preko nove `semverCompare(a,b) → -1|0|1` (proširi postojeći `semverGt`):
   - `== 0` → `{ updateAvailable: false, version: target }`.
   - `> 0` (upgrade) → `updateAvailable: true`, `mandatory`.
   - `< 0` (**downgrade**):
     - ako `deadline && now < deadline` → `{ updateAvailable: false, pending: true, scheduledVersion: target, downgradeAt: deadline }` (klijent ostaje na trenutnoj verziji do roka),
     - inače → `updateAvailable: true`, `mandatory: true`, `downgrade: true`.
4. Artefakti se grade iz **target release dokumenta** (`releaseDoc.artifacts[app]`), ne više iz `isLatest`.
   `feedToken = generateFeedToken(target, app)`, `feedUrl`, i `signature = signString(\`${target}:${feedUrl}:${feedToken}\`)`
   ostaju po postojećem obrascu (linije 84–106). Dodati `downgrade`/`pending`/`downgradeAt` u response payload.

**Kritični fajlovi:** [firestore.rules](firestore.rules), `functions/src/updates/adminSetVersionPolicy.ts` (novo),
`functions/src/licenses/adminSetLicenseVersion.ts` (novo), [functions/src/index.ts](functions/src/index.ts),
[functions/src/updates/updateCheck.ts](functions/src/updates/updateCheck.ts).

---

## Faza 3 — Frontend: service layer + admin UI (funkcionalnost, bez finalnog stila)

### 3.1 Service layer
Novi `src/services/versionControlService.js` (obrazac iz [licenseService.js](src/services/licenseService.js)):
- `setVersionPolicy(channel, data)` → `httpsCallable(functions, "adminSetVersionPolicy")`.
- `setLicenseVersion(licenseKey, data)` → `httpsCallable(functions, "adminSetLicenseVersion")`.
- `clearLicenseVersion(licenseKey)` → poziv gornje sa `{ targetVersion: null, mode: "follow" }`.
- `subscribeVersionPolicies(cb)` → `onSnapshot` nad `updatePolicies`.
- `subscribePublishedReleases(cb)` → `onSnapshot` nad `releases` `where status=="published"` `orderBy createdAt desc` (za dropdown izbora verzije). Izdvojiti iz postojećeg listenera u [UpdatesPage.jsx](src/pages/admin/updates/UpdatesPage.jsx).

### 3.2 Updates ekran — globalni default
U [src/pages/admin/updates/UpdatesPage.jsx](src/pages/admin/updates/UpdatesPage.jsx) dodati sekciju
**"Globalna politika verzija"** (po kanalu `stable`/`beta`):
- Dropdown: izbor `published` verzije kao default (ili "Najnoviji" = `null`).
- Toggle `mandatory`, input `defaultGraceDays` (broj dana).
- "Sačuvaj" → `setVersionPolicy(channel, ...)`; prikaz trenutne politike iz `subscribeVersionPolicies`.

### 3.3 Licenses ekran — per-license override + navigacija
- [src/pages/admin/licensing/LicensesPage.jsx](src/pages/admin/licensing/LicensesPage.jsx): u header dodati
  **dugme "Updates"** koje vodi na `/updates` (na poddomenu).
- U full-screen drawer-u (kostur sada, stil u Fazi 4) dodati sekciju **"Kontrola verzije"** u
  [LicenseDetailsDrawer.jsx](src/components/admin/licensing/LicenseDetailsDrawer.jsx) (obrazac postojećih
  `DrawerSection` + inline forma kao `showExtendForm`, linije ~101–130):
  - Status: prati li global default ili je `pin`-ovana; prikaz trenutne `targetVersion` i, ako postoji,
    countdown do `downgradeDeadline`.
  - Dropdown izbor target verzije (iz `subscribePublishedReleases`), toggle `mandatory`,
    **input "Dani pre downgrade-a"** (`graceDays`).
  - Dugmad: "Primeni verziju" → `setLicenseVersion(license.id, ...)`; "Vrati na globalni default" → `clearLicenseVersion(license.id)`.
  - Optimistic update preko postojećeg [useLicenseOptimistic.js](src/hooks/useLicenseOptimistic.js) obrasca.

**Kritični fajlovi:** `src/services/versionControlService.js` (novo),
[UpdatesPage.jsx](src/pages/admin/updates/UpdatesPage.jsx),
[LicensesPage.jsx](src/pages/admin/licensing/LicensesPage.jsx),
[LicenseDetailsDrawer.jsx](src/components/admin/licensing/LicenseDetailsDrawer.jsx).

---

## Faza 4 — (ZASEBAN AGENT ZADATAK) UI/UX, royal-blue admin tema, full-screen drawer, responsivnost

> Ovo je samostalan brief za UI/dizajn agenta. **Samo vizuelno/UX — bez izmene business logike,
> props-a, handler-a, imena funkcija ili Firestore poziva.** Diraju se isključivo `className`,
> markup raspored i tema-fajlovi. Pokreće se TEK po završetku Faza 1–3.

**Zadaci:**
1. **Royal-blue admin tema (samo admin).** Napraviti `src/configs/adminTheme.js` (paleta ispod),
   proširiti [tailwind.config.js](tailwind.config.js) `admin` color namespace-om, i definisati CSS varijable
   na `.admin-shell` root-u. Migrirati admin komponente sa legacy tokena (`bluegreen`, `sheen`,
   `charcoal`, `midnight`, `brand-secondary`) na `admin-*` tokene: `LicensesPage`, `UpdatesPage`,
   `OrdersPage`, `LicenseDetailsDrawer`, modali/drawer-i u
   [src/components/admin/licensing/](src/components/admin/licensing/), i novi `AdminLayout`.
   Marketing/shop tokeni u [designTokens.js](src/configs/designTokens.js) se **ne diraju**.
2. **Full-screen drawer.** Konvertovati [LicenseDetailsDrawer.jsx](src/components/admin/licensing/LicenseDetailsDrawer.jsx)
   iz `max-w-lg` slide-in u **full-screen** panel (`fixed inset-0`, `max-w-none`, puna visina): na `lg+`
   multi-kolonski grid (levo detalji/istorija, desno akcije + "Kontrola verzije"), na mobilnom stacked.
   Sve postojeće funkcionalne sekcije + nova "Kontrola verzije" (iz Faze 3) ostaju netaknute po ponašanju.
3. **Admin layout/nav.** Stilizovati `AdminLayout` (sidebar/topbar royal-blue) i "Updates" dugme u Licenses.
4. **Responsivnost.** xs→2xl (breakpoint-i u [designTokens.js](src/configs/designTokens.js#L182-L189)),
   touch targets ≥44px, mobilni fallback preko postojećih `ResponsiveDrawer`/`BottomSheet`.

**Predložena paleta (royal blue, WCAG-svesno — bela tekst na solid površinama):**
| token | hex | upotreba |
|------|------|----------|
| `admin.primary` | `#2B4ACB` | glavni CTA (bela tekst ~5:1 ✅ AA) |
| `admin.primaryHover` | `#223C9E` | hover |
| `admin.primaryActive` | `#1A2F7A` | active |
| `admin.accent` | `#4169E1` | royalblue akcenat/gradijenti (krupna tipografija) |
| `admin.navy` | `#16225A` | header/sidebar pozadina |
| `admin.surfaceTint` | `#EEF2FF` | tintovana površina |
| `admin.border` | `#C7D2FE` | borderi |
Status boje (success/warning/error/trial) ostaju kao sada.

---

## Desktop contract (web-side referenca — implementacija je van scope-a)
`updateCheck` response prema desktop-u (server/client app), nova/izmenjena polja:
- `updateAvailable: boolean`, `version: string`, `mandatory: boolean`
- `downgrade?: boolean` — ciljana verzija je niža od trenutne; desktop mora da primeni stariji `.nupkg`.
- `pending?: boolean`, `scheduledVersion?: string`, `downgradeAt?: ISO string` — downgrade zakazan ali grace još traje.
- Postojeća polja (`feedUrl`, `feedToken`, `setupUrl`, `notes`, `signature`, `minServerVersion`, `minClientVersion`) ostaju.

Desktop tim mora da podrži primenu **niže** verzije (Velopack downgrade) i poštovanje `mandatory/downgrade`. To je zaseban repo.

---

## Otvorene zavisnosti / gotchas
- Firebase Auth je **per-origin** → admin se loguje zasebno na `admin.vagabeta.rs`.
- `admin.vagabeta.rs` dodati u: Cloudflare Pages custom domain (+DNS), Firebase Authorized domains, reCAPTCHA/App Check domene.
- Cloud Functions menjaju TS u `functions/src/` → **obavezan rebuild** (`npm run build` u `functions/`) pre deploy-a; `functions/lib/` je build output.
- `releases` upiti koriste indekse; novi upit po `targetVersion` ide preko `doc(version)` (bez novog indeksa). Globalna politika fallback i dalje koristi postojeći `status+channel+isLatest` upit.

## Verifikacija (end-to-end)
1. **Lokalno:** `npm run dev` (admin host se testira preko `/etc/hosts` ili Cloudflare preview) + Firebase emulator za funkcije; potvrditi da `AdminApp` renderuje na admin host-u, a marketing/shop na glavnom.
2. **updateCheck (downgrade):** postaviti `pin` na licenci sa starijom `targetVersion` + `graceDays>0`; `POST` na `updateCheck` mora vratiti `pending:true` pre roka, pa `updateAvailable:true, downgrade:true` posle roka (testirati skraćivanjem deadline-a). Potvrditi da `semverCompare` ispravno barata upgrade/downgrade/jednako.
3. **Global default:** postaviti `updatePolicies/stable.targetVersion`; licenca u `follow` modu dobija tu verziju; licenca sa `pin` override-om ignoriše global.
4. **Rules:** potvrditi da non-admin ne čita `updatePolicies`, i da frontend ne može pisati po `licenses`/`updatePolicies` (samo funkcije).
5. **SEO/SSR regresija:** `npm run build:cloudflare` + `npm run seo:smoke:local` da admin host split nije pokvario SSR marketing strana.
6. **Tema (Faza 4):** vizuelno potvrditi royal-blue samo na adminu; marketing/shop nepromenjeni; full-screen drawer responzivan xs→2xl.
