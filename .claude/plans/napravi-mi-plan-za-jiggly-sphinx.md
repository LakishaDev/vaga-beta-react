# Plan: Popravka centriranja Scene Stage na mobilnom (MKO Storyboard)

## Kontekst

Komponenta `Storyboard` unutar `MKOSection.jsx` prikazuje 4 animirane scene (Žig, Period, Status, Servis) u "storyboard" okviru. Na mobilnom (≤600px) sadržaj scene **nije vizuelno centriran** unutar storyboard okvira — beži ulevo i ostavlja čudan prazan prostor desno.

### Uzrok (dijagnoza)

U `uslugeStyles.js` (CSS `USLUGE_RESPONSIVE_CSS`), za breakpoint `@media (max-width: 600px)`:

```css
.u-mko-scene-zoom { transform: scale(0.7) !important; transform-origin: 8% 50% !important; }
```

`transform-origin: 8% 50%` pomera centar skaliranja levo — scene se vizuelno "lepe" za levu ivicu. Pošto su unutrašnje scene (Scene1–Scene4) **fiksne širine** (360/460/520/520 px) i pozicionirane preko `position:absolute; inset:0` + `display:grid; place-items:center`, kombinacija fiksnih px širina + scale + pomerenog origina rezultuje neuravnoteženim layoutom na uskim ekranima.

Sekundarni problemi:
- Na 900–1200px stage je `aspect-ratio: 21/9` (širok), a na ≤900px prelazi u `4/3` što sa `scale(0.72)` ostavlja previše vertikalnog praznog prostora.
- Scene 3 i Scene 4 su 520px široke — ne staju u 360–400px viewport ni sa scale(0.7); previše praznog prostora ostaje desno/dole.
- `u-mko-storycap` postaje `position: relative` na mobilnom (dobro), ali `grid-template-columns: auto 1fr` može da uzrokuje da broj scene zauzme previše leve kolone.

## Cilj

Sadržaj svake scene treba da bude **vizuelno centriran** unutar storyboard okvira na svim širinama, bez velikih praznih ivica, sa očuvanim luksuznim editorial izgledom.

## Kritični fajl

- [src/pages/services/usluge/uslugeStyles.js](src/pages/services/usluge/uslugeStyles.js) — sav fix ide u `USLUGE_RESPONSIVE_CSS` string (linija 810–854). JSX ne dirati.

Opciono za referencu (NE menjati JSX bez razloga):
- [src/pages/services/usluge/MKOSection.jsx](src/pages/services/usluge/MKOSection.jsx) — `SceneStage`, `Storyboard`, scene komponente.

## Konkretne izmene

### 1. Popraviti `transform-origin` na ≤600px (najvažnije)

U `USLUGE_RESPONSIVE_CSS`, breakpoint `@media (max-width: 600px)`:

```css
/* PRE */
.u-mko-scene-zoom { transform: scale(0.7) !important; transform-origin: 8% 50% !important; }

/* POSLE */
.u-mko-scene-zoom { transform: scale(0.58) !important; transform-origin: 50% 50% !important; }
```

**Zašto:** Centriranje skaliranja na 50% rešava lebdenje ulevo. `scale(0.58)` dozvoljava da i najšira scena (520px) stane u ~360px viewport (520 × 0.58 ≈ 302px) sa marginom.

### 2. Smanjiti `scale` i centrirati na 601–900px

```css
/* PRE (u @media (max-width: 900px)) */
.u-mko-scene-zoom { transform: scale(0.72) !important; transform-origin: 50% 50% !important; }

/* POSLE */
.u-mko-scene-zoom { transform: scale(0.68) !important; transform-origin: 50% 50% !important; }
```

`transform-origin: 50% 50%` već postoji — samo blago smanjiti scale da Scene3/Scene4 (520px) imaju dah na tablet širinama.

### 3. Promeniti `aspect-ratio` stagea na mobilnom da bolje odgovara visini sadržaja

```css
/* @media (max-width: 900px) */
.u-mko-stage { aspect-ratio: 4/3 !important; }

/* @media (max-width: 600px) — dodati novo pravilo */
.u-mko-stage { aspect-ratio: 5/4 !important; }
```

**Zašto:** Skoro-kvadratni odnos bolje pakuje skalirani sadržaj scene + ostavlja prostor za relative-pozicioniran storycap ispod (na mobilnom je već `position: relative`).

### 4. Doterati `u-mko-storycap` grid na mobilnom

Caption (broj scene + naslov + telo) već prelazi u 1 kolonu na mobilnom. Dodatno centrirati tekst i smanjiti veliki broj scene:

```css
/* @media (max-width: 600px), dodati / dopuniti */
.u-mko-storycap { text-align: center !important; padding: 16px 18px !important; }
.u-mko-storycap > div:first-child { font-size: 32px !important; opacity: 0.7; }
```

(prvi div u storycap je broj scene `01/02/03/04` — currently 48px; smanjiti)

### 5. Smanjiti horizontalni padding `u-mko-pad` na vrlo uskim ekranima

```css
/* @media (max-width: 600px) */
.u-mko-pad { padding: 0 16px 24px !important; }
```

Daje Storyboard okviru više prostora unutar shell-a.

## Šta NE treba raditi

- **Ne** ekstrahovati fiksne px širine iz Scene1–Scene4 u procente/responsive jedinice. Animacije i SVG koordinate su pažljivo pozicionirane na fiksnim viewBox-ovima — refaktor bi sve polomio. Scale transform je ispravan pristup; samo origin i veličinu treba doterati.
- **Ne** menjati JSX strukturu `Storyboard` / `SceneStage`.
- **Ne** uklanjati `transform: scale(...)` mehanizam — to je ono što omogućava da kompleksne scene "stanu" u okvir.
- **Ne** dirati ZigExplainer (`u-zig-*`) — drugi stage, drugi problem domen.

## Verifikacija

1. Pokrenuti dev: `npm run dev` (port 3000).
2. Otvoriti `/usluge` u browseru.
3. Otvoriti DevTools → Device Toolbar i testirati:
   - **iPhone SE (375×667)** — sve 4 scene moraju biti **horizontalno centrirane** u storyboard okviru, bez vidljivog praznog prostora levo/desno.
   - **iPhone 14 Pro (390×844)** — isto.
   - **iPad Mini (768×1024)** — scale 0.68, centrirano.
   - **Desktop (1440)** — bez regresije, scale 1.0 (nema responsive override-a).
4. Pustiti autoplay storyboarda kroz svih 4 scene; svaka mora biti centrirana i čitljiva.
5. Caption (storycap) ispod scene ne sme da preklapa scenu i mora biti čitljiv (broj scene manji, tekst centriran).
6. Brzi sanity check: `npm run lint` — ne sme uvesti nove warning-e.
