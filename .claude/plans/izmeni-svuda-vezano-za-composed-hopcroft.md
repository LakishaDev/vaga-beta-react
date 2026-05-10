# Plan — Standardi, Klasa I (uskoro), Klasa IIII (25t tegova), ATC SVG pečat

## Context

Stranica `Usluge` trenutno se predstavlja kao akreditovana po više standarda (OIML R76, ISO/IEC 17025, SRPS ISO/IEC 17020, Pravilnik RS) i nudi sve četiri klase vaga (I–IIII). Realno stanje firme:

- Vaga Beta ima **samo** akreditaciju po **SRPS ISO/IEC 17020** (kontrolno telo, broj **ATC 06-373**).
- Firma **ne radi vage Klase I** (specijalna/analitička tačnost) — ovo treba prikazati profesionalno, kao buduću uslugu ("Uskoro u ponudi"), ne kao manjkavost.
- Vaga Beta poseduje **preko 25+ tona etaloniranih tegova** za rad sa Klasom IIII (kamionske, stočarske, industrijske vage) — to je konkretan dokaz kapaciteta koji treba dodati u prezentaciju Klase IIII.
- Postoji nova slika (`public/imgs/usluge/vagabeta-ats-06-373-kontrolno-telo.jpg`) — ATC pečat sa oznakom `06-373`, tekstom `KONTROLNO TELO` i `ISO/IEC 17020`. Treba je rekreirati kao SVG u zlatno-premium varijanti i ugraditi tamo gde najsmislenije gradi poverenje (sekcija `Standards`).

Cilj: uskladiti ceo sadržaj stranice `Usluge` sa realnošću firme, ojačati SEO oko **SRPS ISO/IEC 17020 / kontrolno telo / ATC 06-373 / 25t tegova**, i dati ATC pečatu vizuelno mesto koje deluje sigurno i premium — bez umanjenja efektnosti postojeće stranice.

## Pravilo zamene standarda

- **Zadržati samo:** `SRPS ISO/IEC 17020` (jedini akreditovani standard firme).
- **Ukloniti:** `OIML R76`, `ISO/IEC 17025`, generičku stavku `Pravilnik RS` kao standard.
- **Svuda gde je u tekstu OIML / OIML R76 referencirano** kao izvor klasifikacije ili metrološka osnova — zameniti sa kontekstom **SRPS ISO/IEC 17020** (npr. "Klasifikacija prema metrološkim propisima · u skladu sa SRPS ISO/IEC 17020").
- Ne praviti lažne tvrdnje: SRPS ISO/IEC 17020 ne definiše R76 klase tačnosti — koristiti formulacije tipa "Klasifikacija tačnosti merila" ili "Klase tačnosti vaga (I–IIII)" bez vezivanja za R76. Akreditovani standard za rad kontrolnog tela ostaje SRPS ISO/IEC 17020.
- Pravilnik DMDM (rok važenja žiga 24 meseca) ostaje pomenut **kao zakonska informacija u tekstu** (FAQ, MKO), ali **ne kao "naš standard"** — izbaciti iz `standards` niza.

## Fajlovi za izmenu

### 1. [src/pages/services/usluge/uslugeConfig.js](src/pages/services/usluge/uslugeConfig.js)

**`hero.eyebrow`** (linija 21): `"Akreditovano telo · ISO/IEC 17025"` → `"Akreditovano kontrolno telo · SRPS ISO/IEC 17020 · ATC 06-373"`.

**`standards` niz** (linije 26–51): zameniti celu listu sa **tri kartice koje fokus drže na jednoj akreditaciji** + dva podržavajuća konteksta (ne kao standardi firme, već kao referentni okvir):

```js
standards: [
  {
    code: "SRPS ISO/IEC 17020",
    title: "Akreditovano kontrolno telo · ATC 06-373",
    body: "Vaga Beta posluje kao akreditovano kontrolno telo tipa C po standardu SRPS ISO/IEC 17020. Akreditaciju dodeljuje Akreditaciono telo Srbije (ATS), registarski broj 06-373 — potvrda nezavisnosti, nepristrasnosti i tehničke kompetentnosti za inspekcijske aktivnosti nad mernom opremom.",
    authority: "ATS · Akreditaciono telo Srbije",
    accent: "primary", // za prikaz ATC SVG pečata u kartici
  },
  {
    code: "Klase tačnosti",
    title: "Verifikacija vaga klasa I–IIII",
    body: "Inspekcijske aktivnosti pokrivaju verifikaciju neautomatskih merila mase u svim klasama tačnosti — od precizne (II) do industrijske (IIII). Klasa I (analitička/etalon) je u pripremi za uskoro proširenje akreditovanog opsega.",
    authority: "Opseg inspekcije · SRPS ISO/IEC 17020",
  },
  {
    code: "Zakonski okvir",
    title: "Pravilnici DMDM i Zakon o metrologiji",
    body: "Sve inspekcijske radnje sprovode se u skladu sa važećim Zakonom o metrologiji Republike Srbije i pravilnicima Direkcije za mere i dragocene metale (DMDM). Rok važenja žiga je po pravilu 24 meseca.",
    authority: "DMDM · Republika Srbija",
  },
],
```

**`klase` niz** (linije 89–110): izmeniti tako da Klasa I dobije profesionalni "uskoro" status, a Klasa IIII naglašava 25t tegova:

```js
klase: [
  {
    roman: "I",
    title: "Specijalna tačnost",
    body: "Analitičke i etalon vage — laboratorijska upotreba.",
    status: "soon",                     // novi flag → vizuelni "Uskoro" tag
    statusLabel: "Uskoro · u pripremi",
    note: "U procesu proširenja akreditovanog opsega.",
  },
  {
    roman: "II",
    title: "Visoka tačnost",
    body: "Zlatarske i precizne tehničke vage. Tehnologija i istraživanja.",
  },
  {
    roman: "III",
    title: "Srednja tačnost",
    body: "Trgovinske, kontrolne i automatske vage. Najčešće u prometu.",
  },
  {
    roman: "IIII",
    title: "Obična tačnost",
    body: "Kamionske, stočarske i grube industrijske vage velikih opterećenja.",
    highlight: "25+ tona etaloniranih tegova",
    note: "Sopstveni park tegova preko 25 t za overu kamionskih i industrijskih vaga na licu mesta.",
  },
],
```

**`services[0].bullets`** (linije 118–123):
- `"Zakonska verifikacija po OIML standardima"` → `"Zakonska verifikacija po SRPS ISO/IEC 17020"`.
- `"Sve klase vaga — od I do IIII"` → `"Klase vaga II, III i IIII (Klasa I uskoro)"`.

**`zigExplainer.frames[2].body`** (linija 80–82): "OIML klasifikuje vage od I (laboratorijska) do IIII (gruba industrijska)..." → "Klase tačnosti idu od I (laboratorijska) do IIII (gruba industrijska). Vaše obaveze zavise od klase i namene."

**`faq`** (linije 164–185):
- Pitanje *"Koje klase vaga overavate?"* → odgovor: "Klase II (precizne tehničke), III (trgovinske) i IIII (industrijske/kamionske, sa sopstvenim parkom 25+ tona tegova). Klasa I (analitičke/etalon) uskoro u akreditovanom opsegu."
- Pitanje *"Da li ste akreditovani?"* → odgovor: "Da. Akreditovani smo kao kontrolno telo tipa C po standardu **SRPS ISO/IEC 17020**, registarski broj **ATC 06-373** (Akreditaciono telo Srbije)."

### 2. [src/pages/services/usluge/Hero.jsx](src/pages/services/usluge/Hero.jsx)

- `statNum` `"I–IIII"` (linija 118) → `"II–IIII"` i `statLbl` "Klase tačnosti · Klasa I uskoro".
- Nema dodatnih izmena u SVG/animaciji.

### 3. [src/pages/services/usluge/Klase.jsx](src/pages/services/usluge/Klase.jsx)

- Eyebrow: `"OIML R76 klasifikacija..."` (linija 19–20) → `"Klase tačnosti neautomatskih merila mase. Kategorija određuje toleranciju, intervale overavanja i zahteve za servis."`
- `klasaTag` (linija 31): `"OIML · Klasa {k.roman}"` → `"Klasa {k.roman} · tačnost"`.
- Dodati uslovni prikaz:
  - Ako `k.status === "soon"`: render polu-transparentne kartice (opacity 0.65), pin "Uskoro" čip u gornjem desnom uglu (zlatna ivica, suptilna pulsacija — reuse `pulse` keyframes iz `Usluge.jsx`), i `note` red ispod taga.
  - Ako `k.highlight` postoji: ispod opisa render premium "stat" red sa zlatnim teksturalnim okvirom (npr. `25+ T` veliki Cormorant kurzivni broj + label "etaloniranih tegova").
- Nijedna nova zavisnost — samo inline stilovi u istom maniru kao postojeće kartice.

### 4. [src/pages/services/usluge/Standards.jsx](src/pages/services/usluge/Standards.jsx)

- Grid: kada je `standards.length === 3`, `gridTemplateColumns: repeat(3, 1fr)` ostaje radi (već je dinamično — linija 21).
- Prva kartica (`s.accent === "primary"`): umesto običnog `code` headera, render **`<ATCSeal />` komponentu** (vidi #6) levo, a `code` + `title` desno (dvokolonski layout unutar kartice). Kartica dobija jaču zlatnu ivicu i suptilan `linear-gradient` overlay (champagne 6%).
- Ostale dve kartice ostaju kao trenutne (pulseDot · code · title · body · authority).
- Dodati jasan SEO `<dl>` blok sa mikropodacima ispod glavne mreže (vidi #7).

### 5. [src/pages/services/usluge/MKOSection.jsx](src/pages/services/usluge/MKOSection.jsx)

- Tekst u PCB SVG (linija 72): `"PWR 3.3V · OIML R76 · MADE IN RS"` → `"PWR 3.3V · SRPS ISO/IEC 17020 · MADE IN RS"`.

### 6. **Nova komponenta** [src/pages/services/usluge/ATCSeal.jsx](src/pages/services/usluge/ATCSeal.jsx) (kreirati)

SVG rekonstrukcija pečata `ATC 06-373 · KONTROLNO TELO · ISO/IEC 17020` u zlatno-premium varijanti koja se uklapa u paletu stranice (`--champagne #d4b574`, `--bone #f0ebe2`, midnight pozadina).

Struktura SVG-a (viewBox `0 0 200 250`, default `width=180`, prop `size`):
- Spoljna **kartuš ivica**: zaobljeni pravougaonik sa duplom linijom (champagne stroke, unutrašnji bone hairline) — drop-shadow `0 30px 60px rgba(0,0,0,0.45)`.
- Vrh: stilizovana **dijamant-strelica nadole** (originalni logo ima crveni trougao i plavi šestougaonik — u našoj varijanti: gornji deo champagne dijamant + ispod njega stilizovana inverted-V od dva preklapajuća V-oblika u dve nijanse zlata, čuvajući prepoznatljivost ATC simbola bez umanjenja premium estetike). Implementirati kao dva `<path>` sa `url(#goldStroke)` linear gradient (kao u `Hero.jsx`).
- `<text>` blokovi sa `Cormorant Garamond` (italic, za prestizne reči) i `JetBrains Mono` (za serijski broj, letterspaced):
  - "ATC" — JetBrains Mono, fontSize 22, letterSpacing 0.32em, champagne.
  - "06-373" — JetBrains Mono, fontSize 18, bone.
  - tanka horizontalna gold-stroke razdelnica.
  - "KONTROLNO TELO" — Cormorant Garamond italic, fontSize 16, dva reda centirano, bone.
  - "SRPS ISO/IEC 17020" — JetBrains Mono, fontSize 10, letterSpacing 0.22em, champagne.
- Suptilna **holografska tekstura**: `<radialGradient>` overlay sa rotirajućom konusnom maskom (reuse pattern iz `MKOSection.jsx` `chipGlow` radial gradient).
- Pulsirajući zlatni dot u uglu pečata (`pulse` keyframes već postoji u `Usluge.jsx`).
- Default export: `function ATCSeal({ size = 180, withGlow = true })`.
- `aria-label="Pečat akreditovanog kontrolnog tela ATC 06-373 · SRPS ISO/IEC 17020"`.

Reuse:
- `linearGradient#goldStroke` — već definisan u `Hero.jsx` (linije 36–40); u `ATCSeal` definisati lokalnu kopiju (komponenta mora biti samodovoljna).
- Tipografija/boje već postoje u CSS varijablama `usluge-page` (linije 50–60 u [Usluge.jsx](src/pages/services/Usluge.jsx)).

### 7. SEO ojačanje

#### [src/configs/seoConfigs.js](src/configs/seoConfigs.js) — `usluge` ključ

- `title` → `"Akreditovano kontrolno telo ATC 06-373 — SRPS ISO/IEC 17020 | Vaga Beta"`.
- `description` → "Akreditovano kontrolno telo (ATC 06-373) po SRPS ISO/IEC 17020 — zakonsko overavanje, žigosanje, servis i kalibracija vaga klasa II, III i IIII. Sopstveni park 25+ tona etaloniranih tegova. Brz odziv 24h, pokrivamo celu Srbiju."
- `keywords` — ukloniti `"OIML R76"`, `"ISO 17025"`; dodati `"SRPS ISO/IEC 17020"`, `"ATC 06-373"`, `"akreditovano kontrolno telo"`, `"kontrolno telo tipa C"`, `"etalonirani tegovi"`, `"25 tona tegova"`, `"kamionska vaga overa"`.
- `structuredData[0].hasCredential` (linije 49–53): zadržati **samo** `{ name: "SRPS ISO/IEC 17020", identifier: "ATC 06-373" }`.
- Dodati `structuredData[0].identifier = [{ "@type": "PropertyValue", propertyID: "ATS Accreditation No.", value: "06-373" }]`.

#### [src/pages/services/usluge/Standards.jsx](src/pages/services/usluge/Standards.jsx)

- Ispod glavne mreže dodati skriveno-vidljiv `<dl>` sa mašinski čitljivim parovima (npr. `<dt>Akreditacioni broj</dt><dt>06-373</dt>`, `<dt>Standard</dt><dd>SRPS ISO/IEC 17020</dd>`, `<dt>Telo akreditacije</dt><dd>Akreditaciono telo Srbije (ATS)</dd>`). Vizuelno: tanak monospace gold-on-midnight kartuš ispod kartica — pojačava E-E-A-T signal bez vizuelnog šuma.

## Kritični fajlovi

- [src/pages/services/usluge/uslugeConfig.js](src/pages/services/usluge/uslugeConfig.js) — sav copy/SoT.
- [src/pages/services/usluge/Standards.jsx](src/pages/services/usluge/Standards.jsx) — render ATC pečata + SEO `<dl>`.
- [src/pages/services/usluge/Klase.jsx](src/pages/services/usluge/Klase.jsx) — "Uskoro" stanje + "25t tegova" highlight.
- [src/pages/services/usluge/Hero.jsx](src/pages/services/usluge/Hero.jsx) — eyebrow + stats.
- [src/pages/services/usluge/MKOSection.jsx](src/pages/services/usluge/MKOSection.jsx) — PCB tekst.
- [src/pages/services/usluge/ATCSeal.jsx](src/pages/services/usluge/ATCSeal.jsx) — nova SVG komponenta.
- [src/configs/seoConfigs.js](src/configs/seoConfigs.js) — meta i JSON-LD.

`uslugeStyles.js` i `icons.jsx` ostaju netaknuti (svi novi stilovi su inline kontekstualni; SVG je samodovoljan).

## Verifikacija

1. `npm run dev` → otvoriti `http://localhost:3000/usluge`.
2. Vizuelno: hero eyebrow nosi `ATC 06-373`, sekcija Standardi ima samo 3 kartice sa prvom kao zlatni pečat, Klasa I deluje "uskoro" (čip + zatamnjena kartica), Klasa IIII pokazuje `25+ T` blok, MKO PCB tekst je `SRPS ISO/IEC 17020`.
3. `Ctrl+F` pretraga u DevTools po izrenderovanom DOM-u: 0 pogodaka za `OIML`, 0 za `ISO/IEC 17025`. Pogoci za `SRPS ISO/IEC 17020` ≥ 4, za `06-373` ≥ 2.
4. View-source/SSR: `npm run build:hybrid && npm run preview:hybrid` → kroz `curl http://localhost:8788/usluge` proveriti da JSON-LD u HTML-u ima `SRPS ISO/IEC 17020` i `06-373` (server-render bez OIML).
5. SEO smoke: `npm run seo:smoke:local` — mora proći (title/meta description dužine i ključne reči nisu uklonjene).
6. `npm run lint` — bez novih grešaka/warninga.
7. SSR sanity: novi `ATCSeal.jsx` ne sme da pristupa `window`/`document` (čista SVG komponenta) — proveriti.
8. Lighthouse / a11y: ATCSeal `aria-label` čita screen reader; kontrast `champagne` na `midnight` ostaje AAA.
