# eVaga — Sistem za automatsko ažuriranje (Desktop + Web)

## Context

eVaga Desktop se instalira kod klijenata kao dve WinForms aplikacije (**ServerskaStrana** + **KlijentskaStrana**, .NET 8). Trenutno ne postoji mehanizam za isporuku unapređenja: kad Lazar završi novi deo softvera, ne postoji način da klijent na drugom računaru dobije tu verziju osim ručne reinstalacije. Cilj je:

1. **Desktop:** aplikacija sama proverava da li postoji novija verzija, preuzima je i primenjuje (uz minimalno ometanje rada na vagi).
2. **Web:** u postojećem admin delu sajta (`vaga-beta-react`) panel za upravljanje verzijama — pregled, changelog i kontrola objave.
3. **Workflow:** `git tag` → CI build → verzija se pojavi kao **draft** na sajtu → Lazar klikne **Objavi** → klijenti je dobiju.

Sistem se naslanja na **postojeću infrastrukturu**: licencni HTTP klijent (`LicenseApiClient` → Firebase Functions), HWID identifikacija, RSA potpisi (`signPayload` / RSA verifikacija u `LicenseStorage`), Firestore, Cloudflare R2 storage i admin panel obrasci. Update sistem je u suštini „blizanac" licencnog sistema.

## Potvrđene odluke

| Odluka | Izbor |
|--------|-------|
| Updater tehnologija | **Velopack** (moderni .NET auto-updater, CI-buildabilan, delta update-i, install u `%LocalAppData%`) |
| Automatizacija objave | **CI build → DRAFT na R2/Firestore → ručna „Objavi" u admin panelu** |
| Primena na klijentu | **Obavesti + preuzmi u pozadini + primeni na restartu** (ne prekida aktivno merenje) |
| Pristup download-u | **Vezano za licencu** (HWID + licenca, kratkotrajan potpisan feed token) |

**Versioning u koraku (lockstep):** jedan tag `vX.Y.Z` build-uje OBE aplikacije na istoj verziji. Time se rešava i kompatibilnost server↔klijent (isti WS/DB-proxy protokol). Manifest ipak nosi `minServerVersion`/`minClientVersion` kao zaštitu.

## Arhitektura toka

```
   git tag vX.Y.Z (push)
        │
        ▼
   GitHub Actions (desktop repo)
   ├─ dotnet publish ServerskaStrana + KlijentskaStrana (win-x64)
   ├─ vpk pack  (packId: eVagaServer / eVagaKlijent, --channel stable)
   ├─ vpk upload s3  → Cloudflare R2  (software-updates/<app>/stable/…)
   └─ POST ciRegisterRelease (CI token)  → Firestore: releases/<ver> status="draft"
        │
        ▼
   Admin panel  /prodavnica/admin/updates  →  klik "Objavi"  →  status="published"
        │
        ▼
   Klijentski računar (Velopack UpdateManager)
   ├─ updateCheck (license-gated)  → vraća published verziju + potpisan feed-token
   ├─ download delta sa R2 (worker proverava token)
   └─ apply na restartu  →  app na novoj verziji
```

---

# PLAN 1 — Desktop (eVaga, .NET 8 WinForms)

### 1. Jedinstven izvor verzije
- Dodati `<Version>`, `<AssemblyVersion>`, `<FileVersion>` u `NekaKoumunikacijaVaga/ServerskaStrana.csproj` i `KlijentskaStrana/KlijentskaStrana.csproj` (CI će ih override-ovati sa `-p:Version=<tag>` pri publish-u).
- Postojeći `Assembly.GetEntryAssembly()?.GetName().Version` (već se koristi u `LicenseApiClient.GetAppVersion()`) ostaje runtime izvor istine.

### 2. Velopack bootstrap (obavezan, prva linija `Main`)
- NuGet: `Velopack` u oba exe projekta.
- `NekaKoumunikacijaVaga/Program.cs` i `KlijentskaStrana/Program.cs` — `VelopackApp.Build().Run();` **pre** `ApplicationConfiguration.Initialize()`. (Velopack koristi ovaj poziv za hook-ove instalacije/update/uninstall hooke; mora biti prvi.)

### 3. `UpdateService` (novo) — `Services/Updates/`
Ogledalo `LicenseApiClient` obrasca (HttpClient + Newtonsoft + HWID + IP):
- `Services/Updates/UpdateApiClient.cs` — `POST {baseUrl}/updateCheck` sa `{ licenseKey, hwid, ip, appVersion, app: "server"|"client", channel: "stable" }`. Reuse `HardwareIdentifier.GetHwid()`, `IpHelper.GetPublicIpAddressAsync()`, isti `GetConfiguredBaseUrl()` pristup (env `EVAGA_LICENSE_SERVER_URL` / App.config / default `https://europe-west1-vaga-beta-sajt.cloudfunctions.net`).
- `Services/Updates/UpdateCheckResult.cs` — model odgovora: `updateAvailable`, `version`, `feedUrl` (R2 base), `feedToken` (kratkotrajan), `notes`, `mandatory`, `minServerVersion`/`minClientVersion`, `signature`.
- `Services/Updates/IUpdateService.cs` + `UpdateService.cs` — orkestrira: poziv `UpdateApiClient` → konstruiše Velopack `UpdateManager` → `CheckForUpdatesAsync` / `DownloadUpdatesAsync` / `WaitExitThenApplyUpdate`. Registruje se u `ServiceContainer`, koristi `ILoggingService` (kategorija `NETWORK`/`SYSTEM`).

### 4. License-gated feed source
- `Services/Updates/LicensedUpdateSource.cs` — tanak `IUpdateSource` (ili `SimpleWebSource` + custom `IFileDownloader`) koji uz svaki HTTP zahtev ka R2 feed-u kači `feedToken` (header/query) dobijen iz `updateCheck`. Tako Velopack preuzima `releases.stable.json` + `.nupkg` sa R2, a Cloudflare worker propušta samo validan token.
- Opciono: verifikovati `signature` iz `updateCheck` postojećim RSA javnim ključem (isti kao u `LicenseStorage`) pre preuzimanja — sprečava lažni feed.

### 5. Wiring u startup + UX (obavesti + primeni na restartu)
- `SplashForm.cs` (oba projekta) — popuniti **postojeći** `StartupStep.UpdateCheck` korak (trenutno no-op `Task.Delay(300)` na `SplashForm.cs:48`):
  - Pozvati `UpdateService.CheckAndDownloadAsync()` u pozadini (timeout kratak, npr. 5–8s; ako nema neta → tiho preskoči, app radi offline).
  - Ako je update preuzet: postaviti flag; po izlasku iz `Glavna` (`main.FormClosed`) pozvati `ApplyUpdatesAndRestart`. Tako se **ne prekida aktivno merenje** — primenjuje se tek na zatvaranju.
  - Ako je `mandatory == true` ili je verzija ispod `minServerVersion`/`minClientVersion` (nekompatibilan protokol) → prikazati `ShowConfirmDialog` i tražiti odmah update/restart pre ulaska u `Glavna`.
- Ručni put: dugme „Proveri ažuriranja" u glavnom meniju (npr. „Pomoć/O programu") koje pokreće isti `UpdateService` + prikaže `ShowInfoMessage` rezultat. Koristiti `BaseForm` helpere i `SetEnabledSafe`/`SetTextSafe` (thread-safe UI).

### 6. Konfiguracija
- Nova `[Updates]` sekcija u INI (`%USERPROFILE%\Documents\eVaga\serverPostavke.ini` / `klijentPostavke.ini`) preko `IConfigurationService`/`AppSettingsManager`: `AutoCheck` (bool), `Channel` (default `stable`), `FeedBaseUrl` override. Kanal `stable` je default; ostavlja prostor za `beta` kanal kasnije.

### 7. Pakovanje — zamena `.vdproj` Velopack-om
- `.vdproj` installeri (`InstalacijaZaServerSide`, `eVagaKlijent`) se **gase** za nove build-ove; zamenjuje ih Velopack `Setup.exe` (proizvod `vpk pack`). `vpk` generiše i `Setup.exe` (prva instalacija) i delta/full pakete (update).
- `packId`: `eVagaServer` i `eVagaKlijent` (odvojeni feed-ovi po aplikaciji).

**Kritični desktop fajlovi:**
`NekaKoumunikacijaVaga/Program.cs`, `KlijentskaStrana/Program.cs`, `NekaKoumunikacijaVaga/SplashForm.cs`, `KlijentskaStrana/SplashForm.cs`, oba `.csproj`; novo: `Services/Updates/*`; reuse: `Services/Licensing/HardwareIdentifier.cs`, `IpHelper.cs`, `LicenseApiClient.cs` (kao šablon), `LicenseStorage.cs` (RSA verifikacija), `Services/Interfaces/IConfigurationService.cs`, `ILoggingService.cs`, `Podaci/StartupProgress.cs`.

---

# PLAN 2 — Web (vaga-beta-react: React 19 + Firebase + Cloudflare)

### 1. Firestore — kolekcija `releases`
Jedan dokument po verziji (lockstep nosi oba artefakta):
```
releases/{version} = {
  version: "1.2.0",
  channel: "stable",
  status: "draft" | "published",
  isLatest: boolean,
  notes: string (markdown changelog),
  minServerVersion, minClientVersion: string,
  artifacts: {
    server: { feedPath, setupUrl, fullSize, deltaSize, sha256 },
    client: { feedPath, setupUrl, fullSize, deltaSize, sha256 }
  },
  createdAt, publishedAt, createdBy
}
```
- `firestore.rules`: `releases/{id}` — **public read samo za `status=="published"`** (ili read samo preko funkcije), write isključivo admin/Cloud Functions. Obrazac kao postojeći `licenses` blok.

### 2. Cloudflare R2 — namespace `software-updates`
- Velopack feed po aplikaciji/kanalu: `software-updates/server/stable/` i `software-updates/client/stable/` (svaki sadrži `releases.stable.json`, full + delta `.nupkg`, `Setup.exe`).
- R2 worker (`VITE_R2_WORKER_URL`, već postoji i autentikuje Firebase ID token-om): dodati rutu/režim koji za putanje pod `software-updates/` prihvata **kratkotrajan update-token** (HMAC/JWT koji izdaje `updateCheck`) umesto Firebase login-a — tako Velopack na desktopu može da povuče fajlove bez korisničkog login-a, ali samo sa validnim tokenom.

### 3. Cloud Functions (`functions/src/`)
Pratiti postojeći obrazac (`licenseVerify.ts` za public, `assertAdmin` za admin, `signPayload` za potpis):
- **`updates/updateCheck.ts`** (`onRequest`, public, **license-gated**) — kao `licenseVerify`: validira `licenseKey`+`hwid` protiv `licenses`, pa nađe `releases` gde `status=="published"` & `isLatest` za traženi `app`/`channel`. Vraća `{ updateAvailable, version, feedUrl, feedToken, notes, mandatory, minServerVersion, minClientVersion, signature }`. `feedToken` = kratkotrajan potpisan token za R2 worker; `signature` = `signPayload(...)`.
- **`updates/adminPublishRelease.ts`** / **`adminUnpublishRelease.ts`** / **`adminDeleteRelease.ts`** (`onCall` + `assertAdmin`) — menjaju `status`/`isLatest`, brišu draft + R2 fajlove.
- **`updates/ciRegisterRelease.ts`** (`onRequest`, autentikacija preko **CI bearer tokena** iz env secret-a) — GitHub Action ga zove posle upload-a da kreira `releases/{version}` sa `status="draft"` i metapodacima artefakata.
- Registrovati sve u `functions/src/index.ts` (kao postojeće `export { licenseVerify } …`).

### 4. Admin UI — `/prodavnica/admin/updates`
- Nova strana `src/pages/admin/updates/UpdatesPage.jsx` po uzoru na `src/pages/admin/licensing/LicensesPage.jsx` (isti email-whitelist guard preko `VITE_ADMIN_EMAILS`).
- Ruta u `src/Prodavnica.jsx` (kao `/prodavnica/admin/licenses`).
- Komponente (reuse drawer/modal obrazaca iz `src/components/admin/licensing/`): tabela release-ova (verzija, status, datum, veličine), dugmad **Objavi / Povuci / Obriši**, **markdown editor changelog-a**, prikaz `sha256`/veličina, toggle **„Postavi kao najnoviju"**. Pozivi ka Cloud Functions preko `httpsCallable`.
- Link u admin navigaciji pored „Licence".

**Kritični web fajlovi:**
`functions/src/index.ts`, `functions/src/utils/auth.ts`, `functions/src/crypto/signToken.ts`, `firestore.rules`, `src/Prodavnica.jsx`, `src/services/R2CacheService.js`; novo: `functions/src/updates/*`, `src/pages/admin/updates/UpdatesPage.jsx`; reuse šablon: `functions/src/licenses/licenseVerify.ts`, `src/pages/admin/licensing/LicensesPage.jsx`.

---

# CI/CD spona — GitHub Actions (u desktop repo-u)

`.github/workflows/release.yml` — trigger `on: push: tags: ['v*']`:
1. `actions/setup-dotnet` (.NET 8) → `dotnet tool install -g vpk`.
2. Za svaku app: `dotnet publish -c Release -r win-x64 --self-contained -p:Version=${TAG} -o publish/<app>`.
3. `vpk download s3 …` (prethodni release sa R2, za delta) → `vpk pack --packId eVagaServer|eVagaKlijent --packVersion ${TAG} --packDir publish/<app> --mainExe <exe> --channel stable`.
4. `vpk upload s3 …` → Cloudflare R2 (S3-kompatibilan endpoint; `vpk` ima ugrađen S3 upload).
5. `curl POST …/ciRegisterRelease` sa CI tokenom + verzija + metapodaci + changelog (iz tag poruke / `CHANGELOG.md`) → kreira **draft**.

**CI secrets:** R2 S3 `ACCESS_KEY`/`SECRET`/`endpoint`/`bucket`, `CI_REGISTER_TOKEN`, (opciono) code-signing sertifikat.

---

# Rizici i migracija (bitno)

- **Jednokratna migracija sa MSI na Velopack:** postojeći klijenti instalirani preko `.vdproj` MSI-a **neće** automatski preći na Velopack. Potrebna je **jedna ručna reinstalacija** novim `Setup.exe` (Velopack instalira u `%LocalAppData%\eVagaServer` / `…\eVagaKlijent`). Posle toga su svi update-i automatski. Stare MSI verzije po želji deinstalirati. Putanje podataka (`%USERPROFILE%\Documents\eVaga`, `%ProgramData%\eVaga\license.dat`, SQL Server, WS port 5000) **nisu** pogođene lokacijom exe-a.
- **Server vs klijent kompatibilnost:** lockstep verzionisanje + `minServerVersion`/`minClientVersion` u manifestu; ako su nekompatibilni, klijent traži obavezan update pre rada.
- **Ne prekidati merenje:** auto-primena samo na restartu; `mandatory` update pita korisnika.
- **Code signing (opciono, preporuka kasnije):** bez potpisa Windows SmartScreen može upozoravati na prvom `Setup.exe`. Velopack podržava potpisivanje preko `vpk` flag-ova.
- **Rollback:** Velopack čuva prethodnu verziju; moguć povratak ako nova zakaže.

---

# Verifikacija (end-to-end)

1. **Lokalni Velopack smoke test (desktop):** `dotnet publish` + `vpk pack` v1.0.0 → instalirati `Setup.exe` → `vpk pack` v1.0.1 → `vpk upload`/lokalni folder → pokrenuti app v1.0.0 → potvrditi da `UpdateService` detektuje, preuzme i na restartu pređe na v1.0.1 (`SimpleWebSource("file:///…")` ili `http://localhost`).
2. **Web funkcije:** Firebase emulator — pozvati `updateCheck` sa važećom/nevažećom licencom (očekivano: gated), `adminPublishRelease` kao admin/ne-admin (`assertAdmin`).
3. **Admin UI:** lokalni `npm run dev` → `/prodavnica/admin/updates` → draft se vidi, „Objavi" menja status, klijent posle toga dobija update; pre objave klijent NE dobija.
4. **CI dry-run:** push test tag-a `v0.0.1-test` na granu → proveriti da Action build-uje, upload-uje na R2 (test prefix) i kreira draft; obrisati posle.
5. **Pun ciklus:** `git tag v1.0.1 && git push --tags` → draft na sajtu → „Objavi" → klijentska mašina sa drugom verzijom dobije i primeni update na restartu.
