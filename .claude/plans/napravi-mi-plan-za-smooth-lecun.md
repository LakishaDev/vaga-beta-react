# Plan: Implementacija novog dizajna za stranicu Usluge + SEO

## Context

Trenutna `/usluge` stranica (`src/pages/services/UslugaModern.jsx`) treba da se zameni novim, premium "luxury-tech" dizajnom koji već postoji kao prototip u `.claude.design/usluge-design/` (Hero + ZigExplainer + Services + Klase I–IIII + MKO modul + Proces + CTA). Pored portovanja UI-ja, plan uvodi i pravu SEO infrastrukturu za stranicu — JSON-LD structured data, proširen `seoConfigs.js`, dinamički brojač godina iskustva (firma osnovana 1991), i prikaz ISO/OIML standarda. Cilj je: jača konverzija (premium vizual + jasan CTA), pretraživa stranica za upite tipa "overavanje vaga", "akreditovan servis vaga", "OIML R76 Srbija", "ISO 17025 vage".

---

## 1. Strukturne promene fajlova

### Novi fajlovi

- `src/pages/services/Usluge.jsx` — root komponenta stranice (mounts sve sekcije, učitava SEO).
- `src/pages/services/usluge/Hero.jsx` — bez topbar/nav (globalni Navbar ostaje), zadržava animiranu `BalanceScale` SVG.
- `src/pages/services/usluge/ZigExplainer.jsx` — interaktivni storyboard nad slikom žiga.
- `src/pages/services/usluge/Services.jsx` — dve glavne usluge (Overavanje, Servis).
- `src/pages/services/usluge/Klase.jsx` — 4 kartice (I–IIII).
- `src/pages/services/usluge/MKOSection.jsx` — eVaga MKO modul (PCB + StatusPanel + Storyboard + cards).
- `src/pages/services/usluge/Proces.jsx` — 4-step timeline.
- `src/pages/services/usluge/CTA.jsx` — kontakt sekcija sa telefon/email/lokacija karticama.
- `src/pages/services/usluge/Standards.jsx` — **nova sekcija** koja vizuelno prikazuje OIML R76 / ISO/IEC 17025 / ISO 9001 logo-pločice + objašnjenja.
- `src/pages/services/usluge/icons.jsx` — port `IconSeal/IconWrench/IconScale/IconShield/IconBolt/IconArrow/IconCheck/IconTruck/IconLab` u ESM export.
- `src/pages/services/usluge/uslugeConfig.js` — **konfiguracioni fajl stranice** (vidi sekciju 4).
- `src/pages/services/usluge/uslugeStyles.js` — izdvojeni `glass`, `heroStyles`, `svcStyles`, `klasaStyles`, `procStyles`, `ctaStyles`, `mkoStyles`, `explStyles` objekti (CSS-in-JS, kao u prototipu).

### Izmene

- [src/App.jsx](src/App.jsx#L19) — `lazy(() => import("./pages/services/Usluge"))` umesto `UslugaModern`.
- [src/configs/seoConfigs.js](src/configs/seoConfigs.js#L16) — proširi `usluge` blok (vidi sekciju 3).
- [src/components/SEO.jsx](src/components/SEO.jsx) — proširi sa opcionim `structuredData` propom (JSON-LD `<script type="application/ld+json">` injekcija u `<head>`, sa `data-seo-jsonld` atributom radi cleanup-a na unmount).

### Brisanje

- `src/pages/services/UslugaModern.jsx` — zameniti novom komponentom.
- `src/pages/Usluge.jsx` — stari fajl, više se nigde ne importuje.

### Asset-i

- Iskoristiti postojeći `public/imgs/usluge/slika1.jpg` (ne kopirati `.claude.design/.../scale.jpg`). Koordinate `box {left, top, width, height}` u `FRAMES` moraju biti rekalibrisane za `slika1.jpg` (vidi sekciju 5).
- Dodati `public/imgs/usluge/og-usluge.jpg` (1200×630) za Open Graph — koristi screenshot Hero sekcije iz Figma/dizajna ili eksportuj jednu od scena.

---

## 2. SSR-bezbednost (Cloudflare hybrid)

Komponente koriste `requestAnimationFrame`, `performance.now()`, `Math.sin` u animacijama. Sve `useEffect` blokove staviti tako da se animacioni RAF ne pokreće dok prozor ne postoji:

```jsx
useEffect(() => {
  if (typeof window === "undefined") return;
  // ... rAF logika
}, [...]);
```

`BalanceScale`, `ZigExplainer`, `Storyboard`, `StatusPanel`, `PCBModule` — svi drže lokalni `useState` koji se inicijalizuje na statičnu vrednost (npr. `tilt = 0`, `idx = 0`, `phase = 0`) tako da SSR render daje stabilan prvi frame; hydration nastavlja animaciju. Dodati `suppressHydrationWarning` na elemente čiji se sadržaj namerno menja kroz `useEffect` (npr. counter "Godina iskustva" — vidi sekciju 6).

---

## 3. SEO: proširenje `seoConfigs.js` i `SEO.jsx`

### 3.1 `src/configs/seoConfigs.js` — `usluge` blok (zameni postojeći)

```js
usluge: {
  title: "Usluge — Akreditovano overavanje, žigosanje i servis vaga | Vaga Beta",
  description:
    "Akreditovano kontrolno telo za zakonsko overavanje, žigosanje, servis i kalibraciju vaga svih klasa (I–IIII) po OIML R76 i ISO/IEC 17025. Brz odziv 24h, pokrivamo celu Srbiju, preko 30 godina iskustva.",
  keywords: [
    "overavanje vaga", "žigosanje vaga", "servis vaga", "kalibracija vaga",
    "akreditovano kontrolno telo", "OIML R76", "ISO 17025",
    "kamionske vage", "industrijske vage", "laboratorijske vage",
    "trgovinske vage", "klasa tačnosti vage", "verifikacija vage Srbija",
    "Vaga Beta usluge", "metrološki servis", "etaloniranje vaga",
    "MKO modul kontrole overe", "eVaga"
  ].join(", "),
  url: "https://vagabeta.rs/usluge",
  image: "https://vagabeta.rs/imgs/usluge/og-usluge.jpg",
  structuredData: [
    // ProfessionalService + OfferCatalog
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Vaga Beta — Akreditovano kontrolno telo",
      "url": "https://vagabeta.rs/usluge",
      "image": "https://vagabeta.rs/imgs/usluge/og-usluge.jpg",
      "telephone": "+381-XX-XXX-XXXX", // popuniti pravim brojem
      "email": "info@vagabeta.rs",
      "priceRange": "$$",
      "areaServed": { "@type": "Country", "name": "Srbija" },
      "foundingDate": "1991",
      "slogan": "Tačnost koja ima zakonsku težinu.",
      "address": { /* popuniti */ },
      "hasCredential": [
        { "@type": "EducationalOccupationalCredential", "name": "OIML R76" },
        { "@type": "EducationalOccupationalCredential", "name": "ISO/IEC 17025" }
      ],
      "serviceType": [
        "Zakonsko overavanje vaga",
        "Žigosanje vaga",
        "Servis vaga",
        "Kalibracija vaga"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Usluge Vaga Beta",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Zakonsko overavanje i žigosanje vaga", "serviceType": "Metrološka verifikacija" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Servis i kalibracija vaga", "serviceType": "Tehničko održavanje" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "eVaga MKO — Modul kontrole overe", "serviceType": "Digitalno praćenje overe" }}
        ]
      }
    },
    // BreadcrumbList
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Početna", "item": "https://vagabeta.rs/" },
        { "@type": "ListItem", "position": 2, "name": "Usluge", "item": "https://vagabeta.rs/usluge" }
      ]
    },
    // FAQPage (popunjava se iz uslugeConfig.faq — vidi 4)
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [/* mapirano iz uslugeConfig.faq */]
    }
  ]
}
```

### 3.2 `src/components/SEO.jsx` — proširenja

- Novi prop `structuredData` (`object | array<object>`) — injektuje `<script type="application/ld+json" data-seo-jsonld>`.
- Novi prop `ogLocaleAlternate: ["sr_Latn_RS"]` (već postoji `og:locale`).
- `keywords` accept i `string` i `array<string>` (ako je array, `.join(", ")`).
- Cleanup u `return` blok — ukloni sve `script[data-seo-jsonld]` koji je ova instanca dodala (referencom).

---

## 4. `uslugeConfig.js` — single source of truth za stranicu

Sve što se može tweak-ovati bez diranja JSX-a:

```js
export const USLUGE_CONFIG = {
  // Firma
  foundedYear: 1991, // koristi se za dinamički counter
  responseTimeHours: 24,
  coverage: "celu Srbiju",
  contact: {
    phone: "+381 XX XXX XXXX",
    email: "info@vagabeta.rs",
    location: "Ruma · Srbija",
  },

  // Hero
  hero: {
    eyebrow: "Akreditovano telo · OIML R76 · ISO/IEC 17025",
    titleLines: ["Tačnost koja", "ima {italic:zakonsku}", "težinu."],
    lede: "Servis, kalibracija i zakonsko overavanje vaga svih klasa — od preciznih laboratorijskih do kamionskih sistema. Brinemo o tačnosti i zakonitosti svakog javnog merenja u Srbiji već {italic:preko {years} godina}.",
    primaryCta: { label: "Zakaži intervenciju", href: "#kontakt" },
    secondaryCta: { label: "Pogledaj usluge", href: "#usluge" },
    statClassesLabel: "I–IIII",
    statClassesSub: "Sve klase tačnosti",
  },

  // ISO / OIML standardi (sekcija + structured data)
  standards: [
    {
      code: "OIML R76",
      title: "Neavtomatska merila mase",
      body: "Međunarodna metrološka preporuka po kojoj se overavaju sve neautomatske vage — definiše klase tačnosti I–IIII, dozvoljene greške i postupak verifikacije.",
      authority: "OIML — Organisation Internationale de Métrologie Légale",
    },
    {
      code: "ISO/IEC 17025",
      title: "Kompetentnost laboratorija za ispitivanje i etaloniranje",
      body: "Standard koji dokazuje tehničku osposobljenost akreditovanog tela za sprovođenje overavanja i kalibracije.",
      authority: "ISO / IEC",
    },
    {
      code: "Pravilnik o vagama RS",
      title: "Zakonski okvir Republike Srbije",
      body: "Direkcija za mere i dragocene metale (DMDM) — propisuje obavezu overavanja vaga u javnom prometu i rok važenja žiga (24 meseca za većinu klasa).",
      authority: "DMDM · Republika Srbija",
    },
  ],

  // Žig explainer — koordinate boxova nad slika1.jpg (vidi sekciju 5)
  zigExplainer: {
    image: "/imgs/usluge/slika1.jpg",
    imageAlt:
      "Vaga sa zakonskim žigom akreditovanog kontrolnog tela — Vaga Beta",
    frames: [
      {
        label: "01 — Tipska pločica",
        title: "...",
        body: "...",
        scale: 1.0,
        x: 0,
        y: 0,
        box: null,
      },
      {
        label: "02 — Žig overavanja",
        title: "Ovo je žig.",
        body: "...",
        scale: 2.6,
        x: -38,
        y: 12,
        box: { left: 7, top: 33, width: 14, height: 22 },
      },
      {
        label: "03 — Plomba akreditovanog tela",
        title: "...",
        body: "...",
        scale: 2.4,
        x: 38,
        y: 4,
        box: { left: 80, top: 50, width: 13, height: 28 },
      },
      {
        label: "04 — Klasa tačnosti",
        title: "...",
        body: "...",
        scale: 2.3,
        x: 0,
        y: -8,
        box: { left: 50, top: 48, width: 24, height: 14 },
      },
    ],
    framesMs: 6500,
  },

  // Klase (može se proširiti / izmeniti tekst bez diranja JSX-a)
  klase: [
    /* I, II, III, IIII — kao u prototipu */
  ],

  // Servisne kartice
  services: [
    /* Overavanje, Servis */
  ],

  // MKO storyboard scene + cards + status panel default values
  mko: {
    /* scenes, cards, statusPanelInitial */
  },

  // Proces 4 koraka
  steps: [
    /* Prijava, Pregled, Intervencija, Žigosanje */
  ],

  // FAQ (renderuje se kao accordion + ide u FAQPage JSON-LD)
  faq: [
    {
      q: "Koliko važi žig na vagi?",
      a: "Po pravilu 24 meseca od datuma overavanja, ali rok zavisi od klase i namene merila.",
    },
    {
      q: "Da li dolazite na lokaciju?",
      a: "Da, pokrivamo celu Srbiju. Tehničar dolazi na lokaciju ili vagu primamo u radionicu.",
    },
    {
      q: "Šta ako mi je istekao žig?",
      a: "Vaga ne sme biti u javnom prometu dok se ne izvrši ponovno overavanje. Pozovite nas — zakazujemo u toku radnog dana.",
    },
    {
      q: "Koje klase vaga overavate?",
      a: "Sve klase po OIML R76: I (laboratorijske), II (precizne tehničke), III (trgovinske), IIII (industrijske/kamionske).",
    },
    {
      q: "Da li ste akreditovani?",
      a: "Da, poslujemo kao akreditovano kontrolno telo po standardu ISO/IEC 17025.",
    },
  ],
};
```

`Usluge.jsx` mapira `USLUGE_CONFIG.faq` u `structuredData[2].mainEntity` pre nego što ga prosledi `<SEO>` komponenti — dakle FAQ se piše na jednom mestu i automatski ide i u UI accordion i u JSON-LD.

---

## 5. Žig Explainer — koordinate boxova za `slika1.jpg`

Originalne koordinate u prototipu (`scale.jpg`, 1600×831) **ne odgovaraju** našoj `slika1.jpg`. Postojeći `Usluge.jsx` već markira žig na toj slici sa Tailwind klasama `top-[33%] left-[7%] w-25 h-25` (~14% širine slike) — to je naš referentni "žig" frame. Predlog početnih vrednosti (preporuka — fino štelovati u browseru):

| Frame               | left %       | top %  | width % | height % | scale | x % | y % |
| ------------------- | ------------ | ------ | ------- | -------- | ----- | --- | --- |
| 01 — Tipska pločica | (cela slika) | —      | —       | —        | 1.0   | 0   | 0   |
| 02 — Žig overavanja | **7**        | **33** | **14**  | **22**   | 2.6   | -32 | 8   |
| 03 — Plomba         | 80           | 50     | 13      | 28       | 2.4   | 38  | 4   |
| 04 — Klasa tačnosti | 50           | 48     | 24      | 14       | 2.3   | 0   | -8  |

Frame 02 je sigurno tačan (preuzet iz aktivne stranice). Frame 03 i 04 zahtevaju verifikaciju — uradi se tako što se pokrene `npm run dev`, otvori `/usluge`, i kroz DevTools doteruje box sve dok se ne poklopi sa stvarnim elementom na slici. Vrednosti se onda commit-uju u `uslugeConfig.zigExplainer.frames`.

> Napomena: ako se ispostavi da na `slika1.jpg` nema vidljive plombe ili oznake klase, smanjiti broj frame-ova na 2 (pločica + žig) ili dodati second image (`slika2.jpg`) i razgranati `frame.image` polje.

---

## 6. Dinamički counter "Godina iskustva"

Postojeći prototip prikazuje `22+`. Prelazimo na **live** broj:

```jsx
// Hero.jsx
const yearsOfExperience = new Date().getFullYear() - USLUGE_CONFIG.foundedYear;
// 2026 → 35
<div style={heroStyles.statNum} suppressHydrationWarning>{yearsOfExperience}+</div>
<div style={heroStyles.statLbl}>Godina iskustva</div>
```

Isti broj se interpolira i u `lede` tekst preko `{years}` placeholder-a iz configa: "...već **preko 35 godina**" (zaokruživanje po 5 ako je preferirano: `Math.floor(years / 5) * 5` → "preko 35 godina").

Foundation date `1991` ide i u `ProfessionalService.foundingDate` u JSON-LD.

---

## 7. Nova sekcija: Standards (između Klase i MKO)

Renderuje `USLUGE_CONFIG.standards` kao 3 glass kartice u istom vizuelnom jeziku kao Klase:

- Veliki monogram koda (`OIML R76`, `ISO 17025`, `Pravilnik RS`) u Cormorant Garamond italic.
- Authority labela ispod (mono font).
- Body kao kratak opis.
- Subtle "akreditacija" pulse dot u uglu kartice.

Razlog: Eksplicitno SEO i konverzija — posetilac koji traži "akreditovan servis vaga" i vidi ISO/OIML logo+kod odmah dobija signal poverenja, a Google čita ove tagove kao relevantan content za upite "ISO 17025 vage Srbija".

---

## 8. Globalni stilovi (Cobalt/Champagne paleta)

Prototip definiše CSS varijable u `<style>` u `Usluge.html` (`--abyss`, `--royal`, `--champagne`, `--bone`, ...). Ovo dodajemo u **lokalni** `<style>` tag unutar `Usluge.jsx` (scope-ovan na `.usluge-page` root) tako da paleta ne curi u ostatak sajta. Background gradient + noise overlay ide na isti `.usluge-page` root.

Fontovi (`Cormorant Garamond`, `DM Sans`, `JetBrains Mono`) se već učitavaju iz Google Fonts u prototipu — preselimo `<link rel="preconnect">` i `<link href="...&display=swap">` u `index.html` jednom (a ne per-render) ili koristiti dinamičko ubacivanje preko useEffect samo ako stranica `/usluge` aktivna.

---

## 9. Verifikacija

Pre PR-a:

1. **Razvojni server**:

   ```powershell
   npm run dev
   ```

   Otvori `http://localhost:3000/usluge` — proveri:
   - Hero se renderuje sa pravim brojem godina (35+ za 2026).
   - `BalanceScale` SVG se nežno klati i smiruje.
   - `ZigExplainer` auto-advance kroz 4 frame-a, box ostaje poravnat sa žigom (frame 02 obavezno).
   - MKO sekcija — PCB modul puls, StatusPanel rotira, Storyboard kroz 4 scene bez glitch-a.
   - Globalni Navbar/Footer prisutan iznad/ispod (nije duplikat iz dizajna).
   - Mobile (≤900px) — padding fallback iz `app.jsx` aplikovan, sve sekcije čitljive.

2. **SSR build**:

   ```powershell
   npm run build:hybrid
   npm run preview:hybrid
   ```

   Proveri da:
   - Build prolazi bez errora (animacije ne pucaju jer rAF gard čuva SSR).
   - `view-source:` na `/usluge` sadrži: title, description, JSON-LD blok sa `ProfessionalService`, `BreadcrumbList`, `FAQPage`.
   - Hydration prolazi bez `Hydration mismatch` warning-a (counter ima `suppressHydrationWarning`).

3. **SEO smoke test**:

   ```powershell
   npm run seo:smoke:local
   ```

   I ručno:
   - https://search.google.com/test/rich-results — paste URL → očekuje se `Organization`/`ProfessionalService`, `Breadcrumbs`, `FAQ`.
   - https://validator.schema.org — paste source.

4. **Lighthouse** (Chrome DevTools → Lighthouse, Mobile + Desktop): cilj Performance ≥ 85, SEO 100, Accessibility ≥ 90.

5. **Vizuelno štelovanje koordinata** žig explainer-a u browseru (vidi sekciju 5).

---

## Kritični fajlovi za izmenu (sažetak)

- **NEW**: `src/pages/services/Usluge.jsx` + `src/pages/services/usluge/*` (10 fajlova)
- **EDIT**: [src/App.jsx:19](src/App.jsx#L19) — promena lazy importa
- **EDIT**: [src/configs/seoConfigs.js:16-23](src/configs/seoConfigs.js#L16-L23) — proširen `usluge` blok sa structuredData
- **EDIT**: [src/components/SEO.jsx](src/components/SEO.jsx) — `structuredData` prop + array keywords
- **DELETE**: [src/pages/services/UslugaModern.jsx](src/pages/services/UslugaModern.jsx), [src/pages/Usluge.jsx](src/pages/Usluge.jsx)
- **NEW asset**: `public/imgs/usluge/og-usluge.jpg` (1200×630, screenshot Hero ili kompozicija)
- **REUSE**: `public/imgs/usluge/slika1.jpg` (žig explainer)

## Otvorena pitanja koja treba odgovoriti pre/tokom implementacije

1. Tačan **broj telefona** i **fizička adresa** firme za JSON-LD (`telephone`, `address`) i CTA kontakt karticu.
   - brojevi telefona: 063 810 63 22, 063 833 9686, 066 887 8889
   - adresa: Ive Andrica 14, Nis, Srbija
   - email: vaga.beta@yahoo.com
2. Da li firma poseduje **ISO 9001** (quality management) — ako da, dodaje se kao 4. standard u Standards sekciju.
   - SRPS ISO/IEC 17020:2012 — akreditacija inspekcionog tela (ne odnosi se direktno na usluge koje pružaju, ali je relevantna za poverenje)
3. Verifikacija da li se na `slika1.jpg` jasno vide plomba i oznaka klase (frame 03 i 04). Ako ne, smanjiti FRAMES na 2.

- Vide se oznaka klase, i zig blomba se trenutno ne vidi
