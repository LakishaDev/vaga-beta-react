# Plan: Responsive za Usluge stranicu (`/usluge`)

## Context

Usluge stranica (`src/pages/services/Usluge.jsx` + `src/pages/services/usluge/*`) je dizajnirana isključivo za desktop. Sve komponente koriste **inline JS stilove** iz `uslugeStyles.js` sa fiksnim grid-ovima (2, 4, 5 kolona) i fiksnim pikselima — nema nijednog media query-ja osim jednog generičkog `padding` override-a u Usluge.jsx za ≤900px.

Glavni vidljivi problemi na manjim ekranima:

1. **ZigExplainer** — `stage` ima `aspectRatio: "16/9"` i caption je `position: absolute; bottom: 28; left/right: 5%`. Caption sadrži veliki `capNum` (56px) + naslov (28px) + body — sve to iscuri ispod slike ili pokrije ceo `stage` na uskim širinama. Korisnik eksplicitno traži da ceo container ZigExplainer-a bude vidljiv.
2. **Hero** — 2-kolonski grid (`1.15fr 0.85fr`) sa SVG vagom desno → na mobilnom je SVG zgnječen.
3. **Services** — 2 kolone na svim širinama.
4. **Klase / Standards** — 4 kolone na svim širinama.
5. **MKO Section** — intro 2col, inner 2col (PCB + StatusPanel), cards 5col, Storyboard 21:9 sa apsolutnim caption-om koji takođe preliva.
6. **Proces** — 4 kolone bez kolapsa, sa horizontalnim konektorima koji pucaju na uskim ekranima.
7. **CTA** — 2-kolonski grid (sadržaj + kontakt karte).

Cilj: napraviti celu stranicu responsivnom kroz **jedan centralizovan CSS sloj** (bez velikog refaktora inline stilova), uz strukturalnu izmenu ZigExplainer-a tako da se caption izvuče ispod slike na mobilnom.

---

## Strategija (jedno odlučenje koje vodi sve ostalo)

**Centralizovani CSS u Usluge.jsx `<style>` bloku + minimalni `className` hook-ovi na ključnim kontejnerima.**

Inline stilovi imaju veću specifičnost od CSS klasa, ali ne i od CSS klasa sa `!important`. Pošto `Usluge.jsx` već koristi `<style>{...padding ... !important}</style>` pattern, samo proširujemo taj pristup — koherentno sa postojećim kodom i bez SSR rizika (čisti CSS radi u `entry-server-cloudflare.jsx` mock helmet-u).

**Zašto ne useMediaQuery hook**: SSR ne zna širinu ekrana, hidration mismatch je realan rizik, a treba nam izmena u ~9 komponenti. CSS pristup je SSR-bezbedan i lokalizovan.

**Breakpoints** (usklađeno sa postojećim 900px pragom):
- `≤1200px` — tablet landscape: smanjenje gap-ova, 4-col → 3-col gde je primenjivo
- `≤900px` — tablet portrait: 2-col → 1-col, 4/5-col → 2-col
- `≤600px` — mobilni: sve 1-col, smanjeni fontovi, sažeti padding-i

---

## Implementacijski koraci (po datoteci)

### 1. `src/pages/services/usluge/uslugeStyles.js`
Dodati na kraj fajla **eksportovanu string konstantu** `USLUGE_RESPONSIVE_CSS` koja sadrži sve `@media` blokove. Ovo drži stilove na jednom mestu (paralelno postojećim JS objektima) i izbegava razvodnjavanje Usluge.jsx-a.

Struktura:
```js
export const USLUGE_RESPONSIVE_CSS = `
  @media (max-width: 1200px) { ... }
  @media (max-width: 900px)  { ... }
  @media (max-width: 600px)  { ... }
`;
```

Selektori ciljaju nove klase (`.u-*`) koje dodajemo u komponente — vidi tačku 3.

### 2. `src/pages/services/Usluge.jsx`
- Importovati `USLUGE_RESPONSIVE_CSS`.
- Ubaciti ga u postojeći `<style>` blok ispod postojećih pravila (zameniti trenutni `@media (max-width: 900px)` blok ili ga ostaviti — već radi i ne kolidira).

Bez ikakvih drugih izmena.

### 3. Dodavanje `className`-ova u komponente (samo na kontejnerima koji menjaju layout)

Inline stilovi ostaju netaknuti — samo se **dopisuje `className`** pored `style={...}`. CSS sa `!important` će onda override-ovati samo ono što treba.

Nove klase i datoteke:

| Datoteka | Element | className |
|---|---|---|
| `usluge/Hero.jsx` | `heroStyles.grid` div | `u-hero-grid` |
| `usluge/Hero.jsx` | `heroStyles.stats` div | `u-hero-stats` |
| `usluge/Hero.jsx` | wrapper SVG vage (Hero.jsx:128) | `u-hero-art` |
| `usluge/Services.jsx` | `svcStyles.grid` div | `u-svc-grid` |
| `usluge/Klase.jsx` | `klasaStyles.grid` div | `u-klase-grid` |
| `usluge/Standards.jsx` | `standardsStyles.grid` div | `u-std-grid` |
| `usluge/MKOSection.jsx` | `mkoStyles.intro` div | `u-mko-intro` |
| `usluge/MKOSection.jsx` | `mkoStyles.inner` div | `u-mko-inner` |
| `usluge/MKOSection.jsx` | `mkoStyles.cards` div | `u-mko-cards` |
| `usluge/MKOSection.jsx` | Storyboard outer wrap (MKOSection.jsx:257) | `u-mko-story` |
| `usluge/MKOSection.jsx` | Storyboard `aspectRatio: "21/9"` div (MKOSection.jsx:262) | `u-mko-stage` |
| `usluge/MKOSection.jsx` | padding wrapper `padding: "0 48px 48px"` (MKOSection.jsx:399) | `u-mko-pad` |
| `usluge/Proces.jsx` | `procStyles.list` ol | `u-proc-list` |
| `usluge/CTA.jsx` | `ctaStyles.card` div | `u-cta-card` |
| `usluge/CTA.jsx` | `ctaStyles.side` div | `u-cta-side` |
| `usluge/ZigExplainer.jsx` | header div (ZigExplainer.jsx:73) | `u-zig-header` |
| `usluge/ZigExplainer.jsx` | `explStyles.shell` div | `u-zig-shell` |
| `usluge/ZigExplainer.jsx` | `explStyles.stage` div | `u-zig-stage` |
| `usluge/ZigExplainer.jsx` | imageLayer div (ZigExplainer.jsx:94) | `u-zig-img` |
| `usluge/ZigExplainer.jsx` | caption div (ZigExplainer.jsx:129) | `u-zig-cap` |
| `usluge/ZigExplainer.jsx` | capNum (ZigExplainer.jsx:130) | `u-zig-cap-num` |
| `usluge/ZigExplainer.jsx` | capTitle (ZigExplainer.jsx:131) | `u-zig-cap-title` |
| `usluge/ZigExplainer.jsx` | capBody (ZigExplainer.jsx:132) | `u-zig-cap-body` |
| `usluge/ZigExplainer.jsx` | controls div | `u-zig-controls` |
| `usluge/ZigExplainer.jsx` | legend div | `u-zig-legend` |

### 4. Responsive CSS — konkretna pravila (sadržaj `USLUGE_RESPONSIVE_CSS`)

#### `@media (max-width: 1200px)`
- `.u-klase-grid, .u-std-grid` → `grid-template-columns: repeat(2, 1fr) !important;`
- `.u-mko-cards` → `grid-template-columns: repeat(3, 1fr) !important;`
- `.u-proc-list` → `grid-template-columns: repeat(2, 1fr) !important; gap: 40px 0 !important;` (i sakriti `stepLine` između parova — `.u-proc-list li:nth-child(2n) .step-line` ili jednostavnije: `display: none` za sve linije ispod ovog breakpoint-a)

#### `@media (max-width: 900px)`
- `.u-hero-grid` → `grid-template-columns: 1fr !important; gap: 40px !important;`
- `.u-hero-art` → `max-width: 360px; margin: 0 auto;`
- `.u-hero-stats` → `grid-template-columns: repeat(2, 1fr) !important;`
- `.u-svc-grid` → `grid-template-columns: 1fr !important;`
- `.u-mko-intro` → `grid-template-columns: 1fr !important; gap: 24px !important; align-items: start !important;`
- `.u-mko-inner` → `grid-template-columns: 1fr !important; padding: 32px !important;`
- `.u-mko-cards` → `grid-template-columns: repeat(2, 1fr) !important;`
- `.u-mko-pad` → `padding: 0 24px 32px !important;`
- `.u-cta-card` → `grid-template-columns: 1fr !important; padding: 48px 32px !important;`
- **ZigExplainer (ključni fix):**
  - `.u-zig-header` → `flex-direction: column !important; align-items: flex-start !important; gap: 20px !important;`
  - `.u-zig-stage` → `aspect-ratio: auto !important; display: flex !important; flex-direction: column !important;`
  - `.u-zig-img` → `position: relative !important; aspect-ratio: 4/3 !important; width: 100% !important; inset: auto !important;`
  - `.u-zig-stage > div[style*="vignette"], .u-zig-stage > div[style*="scanline"]` ne mogu se selektovati po inline stilu — umesto toga dodati klase `u-zig-vignette` i `u-zig-scanline` i pravilo: `position: absolute; inset: 0; height: auto; pointer-events: none;` (već su takvi; ali bitno: kad imageLayer postane `position: relative`, vignette/scanline treba da se ograniče na njegov box — to se postiže ili da se vignette/scanline ugnezde unutar imageLayer-a, ili (lakše) da se imageLayer drži `position: relative` ali da je njegov roditelj `position: relative` takođe — što već jeste). Stoga je dovoljno staviti vignette/scanline da targetuju `top: 0; height: var(--zig-img-h)` — ali pošto je već `inset: 0` na flex parentu, pokrivaće samo vidljivi imageLayer kad je on prvi flex item iste visine. **Prosto rešenje**: ostaviti vignette/scanline `position: absolute; inset: 0`, ali ograničiti im visinu kroz override: `.u-zig-vignette, .u-zig-scanline { bottom: auto !important; aspect-ratio: 4/3 !important; }`.
  - `.u-zig-cap` → `position: relative !important; left: 0 !important; right: 0 !important; bottom: 0 !important; border-radius: 0 !important; border-left: none !important; border-right: none !important; grid-template-columns: 1fr !important; row-gap: 6px !important; padding: 18px 22px !important; backdrop-filter: none !important; background: rgba(5,13,34,0.7) !important;`
  - `.u-zig-cap-num` → `font-size: 36px !important;`
  - `.u-zig-cap-title` → `font-size: 22px !important;`
  - `.u-zig-cap-body` → `grid-column: 1 !important; font-size: 13.5px !important;`
  - `.u-zig-controls, .u-zig-legend` → `padding: 14px 20px !important;`

#### `@media (max-width: 600px)`
- `.u-hero-stats` → `grid-template-columns: 1fr !important;`
- `.u-klase-grid, .u-std-grid, .u-mko-cards` → `grid-template-columns: 1fr !important;`
- `.u-proc-list` → `grid-template-columns: 1fr !important; gap: 32px 0 !important;` (`.u-proc-list .step-line { display: none !important; }`)
- `.u-cta-side` → `gap: 12px !important;`
- `.u-cta-card` → `padding: 36px 22px !important;`
- `.u-zig-img` → `aspect-ratio: 3/2 !important;`
- Smanjiti naslove: `.u-zig-header h2, .u-mko-intro h2, .u-cta-card h2` već koriste `clamp()` — proveriti, dodati `font-size: clamp(28px, 8vw, 40px) !important;` ako je potrebno fino-podešavanje.
- `.usluge-page > *` postojeći override-uje padding na 22px (≤900) — proširiti za ≤600: `padding-left: 16px !important; padding-right: 16px !important;`.

### 5. Proces step-line cleanup
U `Proces.jsx` (Proces.jsx:21) dodati klasu `step-line` na `procStyles.stepLine` div (uz postojeći inline style) tako da CSS može da je sakrije po breakpoint-u.

### 6. MKO Storyboard caption
`MKOSection.jsx:264` — caption sa `position: absolute; left: 32; right: 32; bottom: 28` će takođe iscureti na mobilnom (slično ZigExplainer-u). Dodati klasu `u-mko-storycap` i u CSS-u ≤900px: `position: relative !important; left: 0 !important; right: 0 !important; bottom: 0 !important; margin: 16px !important; grid-template-columns: 1fr !important;`. Takođe `.u-mko-stage` → `aspect-ratio: 4/3 !important;` na mobilnom, te `display: flex; flex-direction: column;` kako bi caption legao ispod scene.

SceneStage zoom faktor (`scale(1 + phase*0.08)`) je u redu i radi.

### 7. Hero BalanceScale SVG
SVG već koristi `width: 100%; height: auto` (Hero.jsx:34) i `preserveAspectRatio` (default) → automatski se skalira. Samo limit širine kroz `.u-hero-art { max-width: 360px; margin: 0 auto; }` na mobilnom.

---

## Datoteke koje se menjaju

1. `src/pages/services/usluge/uslugeStyles.js` — dodati `USLUGE_RESPONSIVE_CSS` export
2. `src/pages/services/Usluge.jsx` — injektovati responsive CSS u `<style>` blok
3. `src/pages/services/usluge/Hero.jsx` — 3× `className`
4. `src/pages/services/usluge/Services.jsx` — 1× `className`
5. `src/pages/services/usluge/Klase.jsx` — 1× `className`
6. `src/pages/services/usluge/Standards.jsx` — 1× `className` (proveri da grid postoji — verujem da koristi `standardsStyles.grid`)
7. `src/pages/services/usluge/MKOSection.jsx` — 6× `className` + 1× na storyboard caption
8. `src/pages/services/usluge/Proces.jsx` — 2× `className`
9. `src/pages/services/usluge/CTA.jsx` — 2× `className`
10. `src/pages/services/usluge/ZigExplainer.jsx` — 10× `className`

Bez izmena: `uslugeConfig.js`, `icons.jsx`, `ATCSeal.jsx`.

---

## Verifikacija

1. `npm run dev` (Vite, port 3000) → otvori `/usluge`.
2. DevTools Responsive Mode — testirati širine: **1440, 1200, 1024, 900, 768, 600, 414, 360**.
3. Posebno proveriti **ZigExplainer**:
   - Na svim širinama: cela slika `image-i-svetlo.png` vidljiva, kao i caption — bez preklapanja.
   - Highlight box-ovi (žuti uglovi) ostaju u proporciji slike.
   - Controls i legend ne preklapaju jedan drugog.
4. **MKO Storyboard** — proveriti da scene (Scene1–Scene4) i caption ne iscure (SVG-ovi imaju fiksne dimenzije 360×240 / 460 / 520 / 520 — proveriti horizontalni overflow i po potrebi dodati `max-width: 100%`).
5. **SSR smoke**: `npm run build:hybrid && npm run preview:hybrid` → otvori `/usluge`, proveri View Source da SSR HTML nema hydration warning-a (CSS pristup nema JS-uslovljene grane).
6. `npm run lint`.
7. `npm run seo:smoke:local` ako se ne menja markup van className-a, treba da prođe.
