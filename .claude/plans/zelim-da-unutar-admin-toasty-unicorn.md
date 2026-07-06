# Module Control (Kontrola modula) za admin licence — Plan implementacije

## Context

eVaga admin panel (React 19 + Vite + Firebase) upravlja licencama za eVaga Desktop program.
Cilj: u **license drawer-u** (i formi za kreiranje) omogućiti kontrolu koje su funkcionalnosti
programa dozvoljene klijentu — kroz izbor **paketa** (BASIC / PRO / ENTERPRISE / CUSTOM) i/ili
ručno **čekiranje pojedinačnih modula**. Odabir se čuva u `modules` polje license dokumenta, koje
desktop program već čita iz RSA-potpisanog tokena kao **niz stringova**.

Zašto: trenutno postoji samo grubi set od 3 modula (`ambalaza`, `stampa`, `cloud`) koji nigde nije
vezan za konkretne funkcionalnosti, a desktop program (`IsModuleEnabled`) infrastrukturu ima ali je
ne koristi. Uvodimo **kompletnu taksonomiju od 11 funkcionalnosti**, lep i responzivan UI u plavoj
admin paleti, i **optimistic update** (trenutni UI feedback + rollback pri grešci).

Ishod ove (web) sesije: web deo je gotov i deployed. Na kraju plana je **hand-off specifikacija**
za zasebnu desktop sesiju (implementacija `IsFeatureAllowed("key")` gate-ova u C# programu).

### Odluke potvrđene sa korisnikom
- **Funkcionalnost 5 (Upravljanje licima)** → paketi **PRO i ENTERPRISE** (i uvek dostupna u CUSTOM).
- **Obim** → primeniti i na **LicenseDetailsDrawer** i na **LicenseCreateModal**.
- **Backend** → uključiti **ispravku + redeploy** Cloud Function-a `adminUpdateLicense` (nužno da bi se ičta čuvalo; usput popravlja i auto-renew toggle koji danas tiho ne radi).

---

## 1. Taksonomija modula i paketa (SOURCE OF TRUTH)

Ovo je jedini izvor istine i za web i za desktop. Ključevi su stabilni ASCII camelCase (desktop
`IsModuleEnabled` poredi `OrdinalIgnoreCase`, pa je case nebitan, ali držimo se ovih tačnih string-ova).

| # | Ključ (`modules[]`) | Labela (SR) | Grupa | Tip |
|---|--------------------|-------------|-------|-----|
| 1 | `trenutnoMerenje` | Trenutno merenje (bruto/tara/neto) | Merenje | FEAT |
| 2 | `cuvanjeMerenja` | Čuvanje merenja | Merenje | FEAT |
| 3 | `listaMerenja` | Lista merenja | Merenje | SISTEM |
| 4 | `pauzaMerenja` | Pauziranje merenja | Merenje | FEAT |
| 9 | `stampaMerenja` | Štampanje merenja | Merenje | FEAT |
| 6 | `upravljanjeAmbalazom` | Upravljanje ambalažom | Ambalaža i lica | SISTEM |
| 7 | `evidencijaAmbalaze` | Evidencija ambalaže | Ambalaža i lica | SISTEM |
| 5 | `upravljanjeLicima` | Upravljanje licima (unos/pregled/Excel) | Ambalaža i lica | SISTEM |
| 5a | `excelImportLica` | Excel import lica (submodul od `upravljanjeLicima`) | Ambalaža i lica | FEAT |
| 8 | `kontrolaPristupa` | Kontrola pristupa | Napredno | SISTEM |
| 10 | `webSocketStreaming` | WebSocket streaming (APK) | Napredno | FEAT |
| 11 | `klijentskaStrana` | Klijentska strana | Napredno | SISTEM |

`excelImportLica` je **submodul** — ima smisla samo ako je `upravljanjeLicima` uključen. Web UI
(`ModuleControlPanel`) to sprovodi: uključivanjem submodula automatski se uključuje roditelj;
isključivanjem roditelja isključuje se i submodul. Desktop gate treba da proveri **oba** ključa
(`upravljanjeLicima` I `excelImportLica`) pre nego što dozvoli Excel import u `UpravljanjeLicima.cs`.

### Paketi → moduli
- **BASIC** = `trenutnoMerenje, cuvanjeMerenja, listaMerenja, upravljanjeAmbalazom, stampaMerenja`
- **PRO** = BASIC + `pauzaMerenja, evidencijaAmbalaze, upravljanjeLicima, excelImportLica`
- **ENTERPRISE** = PRO + `kontrolaPristupa, webSocketStreaming, klijentskaStrana` (svih 12)
- **CUSTOM** = slobodan izbor bilo kog podskupa (paket se automatski prebacuje na CUSTOM čim korisnik ručno promeni modul van preseta)

Napomena: `licenseType` je **samo web metapodatak** (za presete/labelu). Desktop token payload
NE sadrži `licenseType` — desktop se oslanja isključivo na `modules`. Zato je `custom` bezbedno
kao vrednost `licenseType`.

---

## 2. Frontend izmene

### 2.1 `src/utils/licenseUtils.js` — proširiti taksonomiju (centralno)
Dodati/izmeniti (bez rušenja postojećih export-a koje koriste druge komponente):

- **`LICENSE_MODULE_CATALOG`** — niz objekata `{ key, label, description, icon, group, type, enterpriseOnly? }` za svih 11 modula iz tabele iznad. `icon` = lucide ime (npr. `Scale`, `Save`, `List`, `Pause`, `Users`, `Package`, `ClipboardList`, `Shield`, `Radio`/`Wifi`, `MonitorSmartphone`).
- **`LICENSE_MODULE_KEYS`** = `LICENSE_MODULE_CATALOG.map(m => m.key)`.
- Zameniti staru konstantu: `export const LICENSE_MODULES = LICENSE_MODULE_KEYS;` (da postojeći importi ne puknu; PackageSelector — vidi 2.6).
- Dodati `CUSTOM: "custom"` u **`LICENSE_TYPES`**.
- **`PACKAGE_MODULES`** = `{ [BASIC]: [...], [PRO]: [...], [ENTERPRISE]: LICENSE_MODULE_KEYS }` prema mapiranju iz sekcije 1.
- **`getPackageFromModules(modules)`** → vraća `basic|pro|enterprise|custom` set-jednakošću (sortiran uniq compare); ako ne odgovara nijednom presetu → `custom`.
- **`normalizeModules(modules)`** → uvek vraća niz stringova (obradi slučaj kad je `modules` objekat `{}`, `undefined`, ili već niz). Koristiti svuda gde se čita `license.modules`.
- Ažurirati **`LICENSE_DEFAULTS`** `modules` nizove za `basic/pro/enterprise` na nove ključeve (`trial` → npr. `[trenutnoMerenje, cuvanjeMerenja]`).
- Proširiti **`getLicenseTypeLabel`**: `custom → "Prilagođeno"`.
- Proširiti **`getModuleIcon`** (i dodati `getModuleLabel(key)`) da pokrivaju nove ključeve; zadržati stare `ambalaza/stampa/cloud` kao legacy fallback za prikaz starih licenci.

### 2.2 NOVA komponenta: `src/components/admin/licensing/ModuleControlPanel.jsx`
Deljena, samostalna, reużivana i u drawer-u i u create modal-u.

**Props:** `licenseType`, `modules` (niz), `onChange({ licenseType, modules })`, `disabled` (za trial), opciono `compact`.

**Struktura (odozgo nadole):**
1. **Selektor paketa (= „Tip licence")** — red od 4 „chip" dugmeta: Basic / Pro / Enterprise / Custom. Selektovan izveden iz `getPackageFromModules(modules)` (ili `licenseType`). Klik na Basic/Pro/Enterprise → `onChange({ licenseType: pkg, modules: PACKAGE_MODULES[pkg] })`. „Custom" chip (isprekidana ivica kao signal ručnog režima) → `onChange({ licenseType: 'custom', modules })`.
2. **Moduli grupisani** po `group` (`Merenje`, `Ambalaža i lica`, `Napredno`) — svaka grupa ima mali uppercase naslov (`text-admin-text-muted`) + tanak divider. Unutar grupe grid kartica: `grid-cols-1 xs:grid-cols-2` (responsivno).
3. **Kartica modula** = ikonica u tinted tile-u + labela + kratak opis + vizuelni „check" indikator. Klik toggle-uje modul: novi `modules` niz → `licenseType = getPackageFromModules(newModules)` → `onChange`. `enterpriseOnly` moduli nose mali „Enterprise" pill.

**Ponašanje:** čist prezentacioni komponent — ne zna za Firestore; sav I/O ide kroz `onChange`. Kad je `disabled` (trial), kartice/chipovi su `opacity-50 cursor-not-allowed`.

**Optimistic:** samo lokalno stanje roditelja + `onChange` — persistencija je na roditelju (drawer/modal), vidi 2.3/2.4.

### 2.3 `src/components/admin/licensing/LicenseDetailsDrawer.jsx`
- Dodati prop **`onUpdateModules`** (uz postojeće `onUpdateAutoRenew` itd.).
- Dodati lokalno stanje `const [moduleState, setModuleState] = useState({ licenseType, modules })`; sinhronizovati iz `license` u postojećem `useEffect` (linije 133–143, isti obrazac kao `autoRenew`) koristeći `normalizeModules(license.modules)` i `license.licenseType`.
- **Zameniti** read-only „Dozvoljeni moduli" sekciju (linije ~434–450) novom `DrawerSection` naslova **„Licenca i moduli"** (icon `Package`/`Sparkles`) koja renderuje `<ModuleControlPanel .../>`. `onChange` → `setModuleState(next)` **i** `onUpdateModules(license.id, next)`.
- Ukloniti duplirani read-only „Tip licence" `InfoRow` iz „Informacije o klijentu" (linije ~308–316) — tip je sada vidljiv/edit u novoj sekciji. (Opcionо zadržati kao read-only ako se želi.)
- Obrazac je identičan postojećem auto-renew toggle-u (linije 452–491): lokalno stanje + poziv prop callback-a. Time se rešava i to što `license` prop u drawer-u ostaje „stale" snapshot (page ga ne re-renderuje na optimistic update).
- Usput: „Offline dani" `InfoRow` (linija ~400) čita `license.offlineDaysAllowed`, a čuva se `allowedOfflineDays` — promeniti u `license.allowedOfflineDays ?? license.offlineDaysAllowed`.

### 2.4 `src/components/admin/licensing/LicenseCreateModal.jsx`
- Uvezti i ubaciti **isti `<ModuleControlPanel>`**: zameniti postojeći „Tip licence" 3-dugme selektor (linije ~377–434) **i** „Dozvoljeni moduli" pill blok (linije ~489–536) jednim `ModuleControlPanel`-om vezanim za `formData.licenseType` / `formData.modules`.
- `onChange={({ licenseType, modules }) => setFormData(prev => ({ ...prev, licenseType, modules, ...LICENSE_DEFAULTS[licenseType]?maxActivations/offlineDaysAllowed derive... }))}` — kad je paket preset, popuniti i `maxActivations`/`offlineDaysAllowed`/`expiresAt` iz `LICENSE_DEFAULTS` (postojeći `handleTypeChange` logika, linije 92–102) osim za `custom` gde se te vrednosti ne diraju.
- Trial: kad `formData.isTrial` → `ModuleControlPanel` `disabled`, `modules` = trial default (postojeći `handleTrialToggle`).
- Ostaviti početni `modules` u `useState` na BASIC preset umesto `["ambalaza"]`.

### 2.5 `src/pages/admin/licensing/LicensesPage.jsx`
- Dodati handler po uzoru na `handleUpdateAutoRenew` (linija 145):
  ```js
  const handleUpdateModules = async (licenseId, { modules, licenseType }) => {
    await updateLicense(licenseId, { modules, licenseType });
  };
  ```
- Proslediti `onUpdateModules={handleUpdateModules}` u `<LicenseDetailsDrawer />` (linije 316–326).
- `updateLicense` iz `useLicenseOptimistic` već optimistički merge-uje proizvoljna polja (linije 145–162) — **bez izmena u hook-u**.

### 2.6 `src/components/admin/licensing/PackageSelector.jsx` (verifikovati)
Referiše stare ključeve `ambalaza/stampa/cloud` (`moduleIcons`, tabela poređenja). Pošto `LICENSE_MODULES` sada nosi 11 ključeva, **proveriti gde se `PackageSelector` koristi**: ako renderuje čipove po `LICENSE_MODULES`, ažurirati na `LICENSE_MODULE_CATALOG` (labela+ikonica) ili ograničiti na relevantan podskup. Ako se ne koristi u toku (dead code), samo zabeležiti.

### 2.7 Barrel `src/components/admin/licensing/index.js`
Dodati export `ModuleControlPanel` ako se uvozi preko barela (ili uvoziti direktno).

---

## 3. Backend izmene (`functions/`) + redeploy

### 3.1 `src/services/licenseService.js` — ispraviti mis-wiring
`adminUpdateLicense` (linije 46–48) šalje `{ licenseId, data }`, a CF očekuje ravni `{ licenseKey, ... }`. Promeniti u:
```js
export const adminUpdateLicense = async (licenseId, data) => {
  await fn.updateLicense({ licenseKey: licenseId, ...data });
};
```
(`licenseId` === doc ID === `licenseKey`.) Ovo popravlja i auto-renew toggle.

### 3.2 `functions/src/licenses/adminUpdateLicense.ts` — proširiti whitelistu
Dodati `licenseType` i `autoRenew` u destrukturiranje i update (uz postojeće `modules`):
```ts
const { licenseKey, expiresAt, modules, licenseType, autoRenew, ipLockEnabled, note } = req.data;
...
if (modules) update.modules = modules;
if (licenseType) update.licenseType = licenseType;
if (typeof autoRenew === "boolean") update.autoRenew = autoRenew;
```

### 3.3 `functions/src/licenses/adminCreateLicense.ts` — doslednost
- Default `modules = {}` → **`modules = []`** (niz, u skladu sa desktop tokenom).
- Prihvatiti oba imena za offline dane: `const offline = req.data.allowedOfflineDays ?? req.data.offlineDaysAllowed ?? 7;` i čuvati kao `allowedOfflineDays`.

### 3.4 `functions/src/licenses/licenseActivate.ts` i `licenseVerify.ts` — siguran default
`modules: license.modules ?? {}` → **`modules: Array.isArray(license.modules) ? license.modules : []`** (payload mora imati `modules` kao JSON niz radi RSA verifikacije na desktopu). Redosled ključeva payload-a ostaje netaknut.

### 3.5 Deploy
`cd functions && npm run build && firebase deploy --only functions` (region `europe-west1`). Verifikovati da su `adminUpdateLicense`, `adminCreateLicense`, `licenseActivate`, `licenseVerify` uspešno deployovani.

**Napomena o pravilima:** `firestore.rules` drži `licenses` write=`false`; sve ide kroz admin CF (Admin SDK zaobilazi pravila). Bez izmena pravila.

---

## 4. UI/UX i dizajn (plava admin paleta)

Tokeni iz `src/configs/adminTheme.js` / `tailwind.config.js`:
`admin-primary #2B4ACB`, `admin-accent #4169E1`, `admin-navy #16225A`,
`admin-surface-tint #EEF2FF`, `admin-border #C7D2FE`, `admin-text`, `admin-text-muted`.

- **Paket chip (selektovan):** `border-admin-primary bg-gradient-to-br from-admin-primary/10 to-admin-accent/5 text-admin-primary` + framer `layoutId` klizni highlight (isti obrazac kao `selectedType` u create modal-u). **Custom:** isprekidana ivica.
- **Kartica modula (selektovana):** `border-admin-primary bg-admin-surface-tint`, check-badge `bg-admin-primary text-white`; **neselektovana:** `border-admin-border/60 bg-white hover:border-admin-primary/40`. Ikonica u `bg-admin-surface-tint text-admin-primary` tile-u. Labela `font-semibold text-admin-text`, opis `text-xs text-admin-text-muted`.
- **Responsivno:** paket chipovi `flex-wrap`; kartice `grid-cols-1 xs:grid-cols-2`; min touch target `min-h-[44px]`. Radi u drawer-ovoj `lg:grid-cols-2` levoj koloni i u modal-u.
- **Animacije:** `framer-motion` (`whileHover/whileTap`, check `scale`), isti jezik kao postojeće komponente.
- **Optimistic:** svaki toggle/izbor paketa odmah menja lokalni UI i poziva `updateLicense` (snackbar success + rollback pri grešci kroz `useLicenseOptimistic`), identično auto-renew toggle-u.

---

## 5. Verifikacija (end-to-end)

1. `npm run dev` → admin login → `Upravljanje licencama`.
2. **Create:** „Nova licenca" → izabrati PRO → potvrditi da su čekirani tačno PRO moduli; ručno odčekirati jedan → paket prelazi na „Prilagođeno"; kreirati. U Firestore `licenses/{key}` proveriti da je `modules` **niz** tačnih ključeva i `licenseType` ispravan.
3. **Drawer:** otvoriti licencu → „Licenca i moduli": kliknuti ENTERPRISE → sve kartice čekirane trenutno (optimistic); reload → stanje perzistira (dokaz da CF čuva). Toggle jednog modula → paket „Prilagođeno", perzistira.
4. **Auto-renew regres:** toggle auto-renew → reload → perzistira (dokaz da je mis-wiring rešen).
5. **Rollback:** privremeno simulirati grešku (npr. blokirati mrežu) → toggle → UI se vrati + error snackbar.
6. **Token contract:** `POST` na `/licenseActivate` (test licenca+hwid) → odgovor `payload.modules` je JSON niz očekivanih ključeva.
7. `npm run lint` čist.

---

## 6. HAND-OFF: specifikacija za desktop sesiju (eVaga Desktop, C#)

> Ovo se NE radi u ovoj (web) sesiji. Ovo je ono što web deo garantuje + šta desktop treba da uradi.
> Desktop projekat: `C:\Users\lazar\Desktop\PROJEKTI\VAGA_BETA\Desktop\NekaKoumunikacijaVaga`.

### 6.1 Šta web garantuje (ugovor)
- `licenses/{key}.modules` je **JSON niz stringova** iz kataloga u sekciji 1 (tačni ključevi).
- `licenseActivate` / `licenseVerify` vraćaju potpisani `payload.modules` kao **niz** (redosled ključeva u payload-u ostaje `licenseKey, hwidHash, ip, modules, expiresAt, offlineUntil, issuedAt` — poklapa se sa `LicenseStorage.VerifySignature`). **Nema promene RSA potpisivanja** — već je niz.
- `licenseType` NIJE u tokenu; desktop koristi isključivo `modules`.

### 6.2 Šta desktop treba da uradi
Postoji sva infrastruktura (`Services/Licensing/LicenseManager.cs` → `IsModuleEnabled(string)`, `LicenseHelper.IsFeatureAllowed(string)`), ali se **nigde ne poziva** sa konkretnim ključem. Dodati gate-ove na ulaznim tačkama:

| Modul (ključ) | Desktop ulazna tačka (iz `NekaKoumunikacijaVaga/Glavna.cs` osim gde stoji drugačije) | Gate |
|---|---|---|
| `trenutnoMerenje` | `btnPotvrdi_Click` (1435), `btnStartSerial_Click` (1555), `btn_ZavrsiMerenje_Click` (1713) | onemogući merenje |
| `cuvanjeMerenja` | `btn_ZavrsiMerenje_Click` (1713) → `MerenjeRepository` | `LicenseHelper.CanSave()` + modul |
| `listaMerenja` | `listaMerenjaToolStripMenuItem_Click` (2197) → `ListaMerenja.cs` | sakrij/onemogući meni |
| `pauzaMerenja` | `btnPauzirajMerenje_Click` (2730) i dr. | onemogući pauzu |
| `upravljanjeLicima` | `upravljanjeLicimaToolStripMenuItem_Click` (2275) → `UpravljanjeLicima.cs` | sakrij/onemogući meni |
| `excelImportLica` | dugme/meni za Excel import unutar `UpravljanjeLicima.cs` | sakrij/onemogući dugme; proveriti **oba** `upravljanjeLicima` i `excelImportLica` (submodul ne radi bez roditelja) |
| `upravljanjeAmbalazom` | `ambalazaToolStripMenuItem_Click` (2256) → `AmbalazaManagement.cs` | sakrij/onemogući meni |
| `evidencijaAmbalaze` | `evidencijaAmbalazeToolStripMenuItem_Click` (2301) → `EvidencijaAmbalaze.cs` | sakrij/onemogući meni |
| `kontrolaPristupa` | `kontrolaPristupaToolStripMenuItem_Click` (2241) → `KontrolaPristupa.cs` | modul gate **povrh** postojećeg role gate-a |
| `stampaMerenja` | `btn_Stampaj_Click` (1580) → `MerenjePrinter.cs` | `LicenseHelper.CanPrint()` + modul |
| `webSocketStreaming` | `Services/Implementations/WebSocketServerService.cs` (Fleck start / `REALTIME` broadcast) | ne pokreći WS server bez modula |
| `klijentskaStrana` | ceo `KlijentskaStrana/` app (start/konektovanje) | odbij konekciju/pokretanje bez modula |

Obrazac gate-a: `if (!LicenseManager.Instance.IsModuleEnabled("kljuc")) { /* sakrij meni / disable dugme / rani return */ }`.

### 6.3 Odluka za desktop sesiju
`LicenseManager.cs:347` trenutno tretira **prazan `EnabledModules` = SVE dozvoljeno** (legacy safety). Pošto web sada uvek šalje eksplicitan niz:
- **Preporuka:** zadržati „prazno = sve" kao prelaznu sigurnost za stare `license.dat` tokene, ali čim su svi klijenti reaktivirani (dobiju eksplicitan `modules` niz), promeniti u „prazno = ništa" radi stvarnog gating-a. Odluku doneti u desktop sesiji.

### 6.4 Napomene
- `IsModuleEnabled` je `OrdinalIgnoreCase` — ključevi case-insensitive, ali koristiti tačne string-ove iz sekcije 1.
- Katalog (sekcija 1) je jedini izvor istine — desktop enum/konstante moraju da ga preslikaju 1:1.

---

## Kritični fajlovi (za izmenu)
- `src/utils/licenseUtils.js` — katalog, paketi, helperi (2.1)
- `src/components/admin/licensing/ModuleControlPanel.jsx` — **nova** deljena komponenta (2.2)
- `src/components/admin/licensing/LicenseDetailsDrawer.jsx` — editabilna sekcija + prop (2.3)
- `src/components/admin/licensing/LicenseCreateModal.jsx` — zameniti tip+moduli panelom (2.4)
- `src/pages/admin/licensing/LicensesPage.jsx` — `handleUpdateModules` + prop (2.5)
- `src/services/licenseService.js` — flatten payload (3.1)
- `functions/src/licenses/adminUpdateLicense.ts` — whitelist `licenseType`/`autoRenew` (3.2)
- `functions/src/licenses/adminCreateLicense.ts` — `modules: []`, offline field (3.3)
- `functions/src/licenses/licenseActivate.ts`, `licenseVerify.ts` — `?? []` niz (3.4)
- (verify) `src/components/admin/licensing/PackageSelector.jsx`, `index.js` (2.6/2.7)
