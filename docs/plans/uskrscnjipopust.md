# Plan: Uskršnji Popust na Sajtu (Easter Discount)

## TL;DR

Implementirati site-wide 20% popust sa uskršnjom temom, promo banerom, countdown tajmerom, i admin kontrolom. Popust važi od 09.04.2026 do 19.09.2026. Sistem koristi Firestore za konfiguraciju promocije, sa admin panel UI za upravljanje i automatskim datumskim fallback-om.

---

## Phase 1: Promo Configuration Backend (Firestore + Context)

### Step 1.1 — Firestore promo config document

- Kreirati Firestore kolekciju `promotions` sa dokumentom `active-promo`
- Schema:
  ```
  {
    active: boolean,          // Admin toggle
    type: "sitewide",
    discountPercent: 20,
    startDate: Timestamp,     // 2026-04-09
    endDate: Timestamp,       // 2026-09-19
    theme: "easter",
    bannerText: "Uskršnji popust -20% na sve proizvode!",
    bannerSubtext: "Iskoristite priliku dok traje akcija",
    showCountdown: true
  }
  ```

### Step 1.2 — PromoContext (React Context)

- Novi fajl: `src/contexts/PromoContext.jsx`
- Real-time Firestore listener (`onSnapshot`) na `promotions/active-promo`
- Logika: promo je aktivna ako `active === true` AND `now >= startDate` AND `now <= endDate`
- Exportuje: `usePromo()` hook sa `{ promo, isActive, timeLeft, discountPercent }`
- Wrap u `App.jsx` kao provider

### Step 1.3 — Seed script za Firestore

- Kreirati `scripts/seed-promo.mjs` za inicijalno postavljanje promo dokumenta

---

## Phase 2: Promo Banner + Countdown Timer

### Step 2.1 — PromoBanner component (_parallel with 2.2_)

- Novi fajl: `src/components/PromoBanner.jsx`
- Sticky announcement bar na vrhu stranice (iznad Navbar)
- Uskršnja tema: pastelne boje (lavender, mint, svetlo žuta), uskršnja jaja ikone (SVG/emoji)
- Tekst: konfigurabilno iz Firestore promo config
- Dismiss dugme → localStorage `promo-dismissed` (resetuje se svaki dan)
- Framer Motion animacija za ulaz (slideDown)
- Responsive: kraći tekst na mobilnom

### Step 2.2 — CountdownTimer component (_parallel with 2.1_)

- Novi fajl: `src/components/UI/CountdownTimer.jsx`
- Prikazuje: dana, sati, minuta, sekundi do `endDate`
- Koristi `useEffect` + `setInterval(1000ms)`
- Stilizovan sa uskršnjim bojama
- Ugrađen u PromoBanner i opciono u HeroSectionModern

### Step 2.3 — Integracija bannera u layout

- Dodati `<PromoBanner />` u `src/App.jsx` iznad `<Navbar />`
- Uslovno prikazivanje: samo kada je `isActive === true` iz `usePromo()`

---

## Phase 3: Discount Logic Integration

### Step 3.1 — Modifikacija price display logike

- **`src/components/shop/ProductCard.jsx`**: Kad je promo aktivna, prikazati promo popust (20%) umesto automatskog tiered popusta. Zelena bedž → uskršnja bedž sa "🐣 -20% USKRS"
- **`src/components/shop/ProductDetails.jsx`**: Modifikovati `addDiscountInfo()` da koristi promo popust kad je aktivan. Prikazati originalnu cenu (precrtano) i novu cenu
- Odluka: Promo popust **zamenjuje** postojeći tiered popust (ne kumulira se) — koristiti veći od dva

### Step 3.2 — Cart price integration

- **`src/pages/shop/Cart.jsx`**: Prikazati uštedu od popusta u sumariju korpe
- **`src/contexts/shop/cart/CartProvider.jsx`**: Dodati promo info u cart state za prikaz
- Napomena: Cart čuva originalne cene, popust se primenjuje na prikaz i order total

### Step 3.3 — Checkout integration

- **`src/pages/shop/CheckoutForm.jsx`**: Prikazati primenjeni popust u order summary
- Sačuvati info o popustu u Firestore `orders` dokumentu: `{ promoApplied: "easter-2026", discountPercent: 20 }`

---

## Phase 4: Easter Visual Theme

### Step 4.1 — Easter dekoracije (_parallel with Phase 3_)

- Subtle SVG Easter egg dekoracije na HeroSectionModern
- Pastelna paleta overlay kad je promo aktivna: lavender (#E8D5F5), mint (#D5F5E3), svetlo žuta (#FFF9C4)
- Floating Easter egg animacije (Framer Motion) pored postojećih floating shapes
- Modifikovati: `src/pages/shop/HeroSectionModern.jsx`

### Step 4.2 — Product card Easter badge

- Zamena zelene badge sa uskršnjom: pastelna pozadina, 🐣/🥚 emoji, "USKRŠNJI POPUST -20%"
- Subtle border/glow efekat na kartice kad je promo aktivna
- Modifikovati: `src/components/shop/ProductCard.jsx`

---

## Phase 5: Admin Panel — Promo Management

### Step 5.1 — Admin Promo tab (_depends on Phase 1_)

- Novi fajl: `src/components/AdminPanel/PromoManager.jsx`
- UI za:
  - Toggle active/inactive
  - Procenat popusta (input)
  - Start/End datum (date pickers)
  - Banner tekst (input)
  - Tema selekcija (dropdown: easter, summer, winter, generic)
  - Countdown toggle
  - Live preview promo bannera
- Integrisati u `src/pages/shop/AdminPanel.jsx` kao novi tab

### Step 5.2 — Firestore rules update

- Ažurirati `firestore.rules` da dozvoli admin pristup `promotions` kolekciji
- Read: svi korisnici (public)
- Write: samo admin email-ovi

---

## Relevant Files

### Modifikacija postojećih:

- `src/App.jsx` — dodati PromoProvider i PromoBanner
- `src/components/shop/ProductCard.jsx` — Easter badge, promo cena
- `src/components/shop/ProductDetails.jsx` — modifikovati `addDiscountInfo()` za promo
- `src/pages/shop/Cart.jsx` — prikaz uštede
- `src/pages/shop/CheckoutForm.jsx` — promo info u order
- `src/pages/shop/HeroSectionModern.jsx` — Easter dekoracije
- `src/pages/shop/AdminPanel.jsx` — dodati PromoManager tab
- `src/configs/designTokens.js` — Easter tema boje
- `firestore.rules` — pravila za `promotions` kolekciju

### Novi fajlovi:

- `src/contexts/PromoContext.jsx` — promo state management
- `src/components/PromoBanner.jsx` — announcement bar
- `src/components/UI/CountdownTimer.jsx` — countdown timer
- `src/components/AdminPanel/PromoManager.jsx` — admin promo UI
- `scripts/seed-promo.mjs` — Firestore seed script

---

## Verification

1. **Promo aktivacija**: Proveriti da se banner i popusti pojavljuju kad je `active=true` i datum u opsegu
2. **Promo deaktivacija**: Kad je `active=false` ili van datuma → sajt izgleda normalno, tiered popusti se vraćaju
3. **Cene**: Verifikovati da se 20% popust pravilno izračunava za sve cenovne rangove
4. **Cart**: Dodati proizvod u korpu, proveriti da se popust prikazuje u sumariju
5. **Checkout**: Napraviti test order, proveriti da Firestore order sadrži `promoApplied` polje
6. **Admin panel**: Toggle promo on/off, promeniti procenat, verifikovati real-time update
7. **Responsive**: Testirati banner i badge na mobilnom (Chrome DevTools)
8. **Countdown**: Proveriti da tajmer pravilno odbrojava i da se ažurira svake sekunde
9. **Dismiss**: Kliknuti X na banneru, reload stranicu — banner treba da ostane skriven
10. **Firestore rules**: Testirati da ne-admin korisnik ne može menjati `promotions`

---

## Decisions

- Promo popust **zamenjuje** (ne kumulira se sa) postojeći automatski tiered popust — koristi se veći od dva
- Cart čuva originalne cene, popust se primenjuje na prikaz/total (bezbednije, lakše za admin)
- Banner se dismiss-uje na 24h (localStorage timestamp), ne trajno
- Easter tema se primenjuje samo dok je promo aktivna
- Trajanje: 09.04.2026 – 19.09.2026 (po zahtevu korisnika)

## Further Considerations

1. **Email notifikacija**: Da li želiš da se newsletter pretplatnicima pošalje email o akciji? Može se integrisati sa postojećim newsletter sistemom (`/api/newsletter/subscribe`).
2. **Ograničenje popusta**: Da li popust važi i za proizvode sa `hiddenPrice` (cena na upit)? Preporuka: Ne — samo za proizvode sa vidljivom cenom.
3. **Order history**: Da li admin treba da vidi statistiku koliko je narudžbina iskorirlo promo? Može se dodati u Admin panel kao bonus.
