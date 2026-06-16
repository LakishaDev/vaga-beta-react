# Kontekst: `src/Prodavnica.jsx`

Dokument namenjen prosleđivanju Claude Design-u za UI/UX redizajn shop dela aplikacije Vaga Beta.

## 1. Šta je `Prodavnica.jsx`

Glavna komponenta **shop dela** aplikacije Vaga Beta — odvojena od marketing sajta. Mountuje se u `src/App.jsx` kada `location.pathname` počinje sa `/prodavnica` ili `/p/`. Sve unutar nje koristi **sopstveni Navbar/Footer i providere** (nezavisno od marketing dela).

**Stack:** React 19 + Vite 7, Tailwind CSS, Framer Motion, Firebase (Auth, Firestore, Storage), react-hot-toast, react-router-dom v6, lucide-react + react-icons.

## 2. Struktura same komponente

```
SnackbarProvider
└── AuthProvider              (Firebase onAuthStateChanged)
    └── CartProvider          (Firestore za logovane, localStorage za guest)
        ├── <Toaster/>        react-hot-toast, top-right, custom style
        ├── <Navbar/>         shop navbar
        ├── <main pt-24/pt-64 zavisno od promo bannera>
        │   └── <RenderBoundary/>   error boundary
        │       └── <Routes/>       15 ruta (vidi ispod)
        └── <Footer/>
```

**Side effect:** `useEffect` — pri svakom loginu poziva `createOrUpdateUserAccount(user)` iz `src/utils/userService.js` (kreira/ažurira `users/{uid}` dokument u Firestore).

**Promo banner integracija:** `usePromo()` iz `src/contexts/PromoContext.jsx` — kad je promo aktivan, glavni `<main>` dobija `pt-64 sm:pt-44`, inače `pt-24 sm:pt-28` (kompenzacija visine navbara + banner trake).

## 3. Rute (sve definisane unutar Prodavnice)

| Path | Komponenta | Namena |
|------|-----------|--------|
| `/prodavnica` | `HeroSectionModern` | landing prodavnice, full-screen hero + stats + features |
| `/prodavnica/proizvodi` | `ProductGrid` | mreža proizvoda sa filterima/sortiranjem |
| `/p/:slug` | `ProductDetails` | detalji proizvoda (SEO-friendly slug URL) |
| `/prodavnica/proizvod/:id` | `ProductDetails` | legacy URL po ID-ju |
| `/prodavnica/korpa` | `Cart` | korpa |
| `/prodavnica/placanje` | `CheckoutForm` | checkout |
| `/prodavnica/prijava` | `AuthForm` | login/register (email, Google, telefon) |
| `/prodavnica/nalog` | `Profile` | korisnički profil + istorija porudžbina |
| `/prodavnica/email-verifikovan` | `VerifyEmailPage` | callback iz Firebase email verifikacije |
| `/prodavnica/reset-password` | `PasswordResetForm` | reset lozinke |
| `/prodavnica/admin` | `AdminPanel` | CRUD proizvoda (samo admin) |
| `/prodavnica/porudzbine` | `AdminOrders` | upravljanje porudžbinama (admin) |
| `/prodavnica/admin/licenses` | `LicensesPage` | upravljanje licencama (admin) |
| `/prodavnica/admin/licenses/orders` | `OrdersPage` | porudžbine licenci (admin) |

Admin pristup se gejtuje preko `VITE_ADMIN_EMAILS` env varijable.

## 4. Konteksti (state management)

### `AuthProvider` — `src/contexts/shop/auth/AuthProvider.jsx`
- Prati `onAuthStateChanged`, izlaže `{ user, loading, login, logout }`.
- SSR-safe: `isClient` guard pre subscribovanja.

### `CartProvider` — `src/contexts/shop/cart/CartProvider.jsx`
- `useReducer` sa akcijama: `SET_CART`, `ADD_TO_CART`, `REMOVE_FROM_CART`, `CLEAR_CART`, `UPDATE_QUANTITY`.
- **Hibridni storage:** prijavljen korisnik → Firestore preko `CartService`; guest → `localStorage`.
- Integriše promo cene preko `getCartPricing` iz `src/utils/promoPricing.js`.
- Izlaže: `cart`, `cartPricing`, `promoInfo`, `addToCart`, `removeFromCart`, `clearCart`, `updateQuantity`.

### `SnackbarProvider` — `src/contexts/snackbar/SnackbarProvider.jsx`
- Custom snackbar (paralelno postoji i `react-hot-toast` Toaster).

### `PromoContext` — `src/contexts/PromoContext.jsx`
- `{ isActive, discountPercent }` — globalna promocija, čita iz Firestore (injektovana iz SSR middleware-a).

## 5. Strane (pages) — detalji za dizajn

### `HeroSectionModern` — `src/pages/shop/HeroSectionModern.jsx`
- Full-screen hero (`h-screen`), gradient background, Framer Motion animacije.
- **Stats:** 500+ klijenata, 1000+ proizvoda, 20+ godina iskustva.
- **Features:** Brza dostava (24-48h Srbija), Top kvalitet, Jednostavna kupovina.
- Koristi paletu **Cobalt Navy** iz `src/configs/designTokens.js`.
- CTA → `/prodavnica/proizvodi`.

### `ProductGrid` — `src/components/shop/ProductGrid.jsx`
- Učitava proizvode iz Firestore preko `onSnapshot` (real-time).
- **Filteri:** kategorije, opseg cene, search po imenu.
- **Sortiranje:** najnoviji, najjeftiniji, najskuplji.
- Optimizovan: `useMemo`, `useCallback`, `React.memo`.
- Smooth scroll preko **Lenis**.
- Renderuje `ProductCard` za svaki proizvod.

### `ProductCard` — `src/components/shop/ProductCard.jsx`
- Hover state, `ProgressiveImage` za slike, support za **image variants** (multi-format) i **hidden price** (cena na upit).
- "Dodaj u korpu" dugme → `addToCart` + snackbar.
- Link na detalje proizvoda preko slug-a.

### `ProductDetails` — `src/components/shop/ProductDetails.jsx`
- Galerija slika sa `ImageModal` zoom-om.
- Markdown opis (`MarkdownPreview`).
- Datasheet download, software opcija, karakteristike (key-value).
- Helmet meta tagovi (SEO).

### `Cart` — `src/pages/shop/Cart.jsx`
- Lista stavki, +/- qty, brisanje, čišćenje korpe.
- Modal potvrda za destruktivne akcije.
- Cena formatirana `sr-RS` lokalom, prikaz popusta iz `cartPricing`.

### `CheckoutForm` — `src/pages/shop/CheckoutForm.jsx`
- Polja: ime, prezime, email, telefon, adresa, grad, PIB/MB (pravna lica), poštanski broj, napomena.
- Auto-popunjava polja iz user profila ako je logovan.
- Validacija po polju, Framer Motion animacije.
- Šalje porudžbinu u Firestore `orders` kolekciju + `serverTimestamp`.

### `AuthForm` — `src/pages/shop/AuthForm.jsx`
- Tri metode: **email/password**, **Google** (popup), **telefon** (SMS, reCAPTCHA).
- Toggle login/register, slanje email verifikacije, modal za reset lozinke.

### `Profile` — `src/pages/shop/Profile.jsx`
- Avatar upload (Firebase Storage), ime/prezime/telefon/adresa edit.
- Lista porudžbina sa `StatusBadge` i `OrderDetailsModal`.
- Akcije: verifikacija emaila, verifikacija telefona (`PhoneVerifyModal`), reset lozinke (`PasswordResetModal`), brisanje naloga (`DeleteAccountModal`), logout.

### `AdminPanel` — `src/pages/shop/AdminPanel.jsx` (v3.0, refactor 2025-11)
- CRUD proizvoda, glavna slika + dodatne slike sa **reorderingom**, lokalizovan unos cene (sr-RS separator).
- Modal za zoom pregled, karakteristike (key-value), upload datasheets (PDF/DOC).
- Software toggle sa markdown dokumentacijom.
- Glassmorphism + 3D Framer Motion animacije.

### `AdminOrders` — `src/pages/shop/AdminOrders.jsx`
- Tabela porudžbina, real-time `onSnapshot`, sortiranje, paginacija.
- Status workflow: primljeno → u obradi → poslato → završeno / otkazano.
- Inline edit i `OrderDetailsModal`.

### `VerifyEmailPage` — `src/pages/shop/VerifyEmailPage.jsx`
- Callback iz Firebase action URL-a. Razlikuje `verifyEmail` i `resetPassword` mode.
- Loader → `EmailVerifiedSuccess` ili redirect na reset.

### `LicensesPage` + `OrdersPage` — `src/pages/admin/licensing/`
- Pregled licenci (status: active/blocked/expired/trial), pretraga, kreiranje, reset HWID-a.
- Pregled porudžbina licenci (paid/pending/failed), link ka licenci.
- Već prošli **UI/UX Polish v1.1** (glassmorphism).

## 6. Deljene komponente koje shop koristi

- `src/components/UI/ProgressiveImage.jsx` — lazy + blur-up + image variants.
- `src/components/UI/Modal.jsx`, `ImageModal`, `MarkdownPreview`, `AnimatedInput`, `AnimatedSelect`.
- `src/components/Loader.jsx`, `src/components/RenderBoundary.jsx`.
- `src/components/Navbar.jsx` i `src/components/Footer.jsx` — **napomena:** Prodavnica importuje glavni Navbar/Footer (ne shop-specific `components/shop/Navbar.jsx`, koji postoji ali se trenutno ne koristi u Prodavnici).

## 7. Servisi i utili

- `src/services/CartService.js` — Firestore sync korpe.
- `src/services/productSlugService.js` + `src/utils/slugUtils.js` — SEO slug-ovi (`/p/:slug`).
- `src/utils/promoPricing.js` — `applyPromoPricing`, `getCartPricing`.
- `src/utils/userService.js` — kreiranje/ažuriranje `users/{uid}`, upload avatara.
- `src/utils/imageVariants.js` — multi-format slike (avif/webp/jpg).
- `src/hooks/useAuth.js`, `src/hooks/useUserData.js`, `src/hooks/useLicenseOptimistic.js`.

## 8. SSR napomene relevantne za dizajn

- Cela Prodavnica je u suštini **CSR** (Firebase real-time, auth, korpa) — marketing deo ide preko SSR-a (Cloudflare Workers), ali shop se hidrira na klijentu.
- `AuthProvider` i `CartProvider` imaju `isClient` guard — ne pristupaju Firebase/localStorage dok DOM nije na klijentu.
- `react-helmet-async` je isključen iz SSR-a (vidi CLAUDE.md), ali ProductDetails ipak koristi `<Helmet>` za client-side meta.

## 9. Dizajn tokeni i postojeća paleta

- `src/configs/designTokens.js` — **Cobalt Navy** paleta je trenutni shop standard (HeroSectionModern).
- Toaster style već definisan inline: bele toast kartice, border-radius 12px, soft shadow, success zeleni (#10b981), error crveni (#ef4444), loading plavi (#3b82f6).
- AdminPanel i licensing stranice koriste **glassmorphism + Framer Motion 3D**.

## 10. Šta dizajner treba da zna pre redizajna

1. **Dva odvojena vizuelna jezika** trenutno žive u shop-u: moderni Cobalt Navy (hero, grid) vs. glassmorphism (admin/licensing). Razmotriti unifikaciju.
2. **Promo banner** menja layout offset — sve gornje sekcije moraju ostati pomerljive (ne fiksne).
3. **Mobile-first je obavezan** — `sm:` breakpointi se već koriste svuda.
4. **Sve copy je na srpskom** (sr-RS), uključujući format cena (`toLocaleString("sr-RS")`).
5. **Pristupačnost:** komponente već koriste semantički HTML i Framer Motion sa `prefers-reduced-motion` razmatranjima — održati.
6. **Real-time UX:** ProductGrid i AdminOrders rade preko `onSnapshot` (proizvodi/porudžbine mogu da se ažuriraju dok korisnik gleda) — dizajn mora da podnese in-place state promene bez loader-a.
7. Postoji `docs/design/` folder sa prethodnim design odlukama — vredi ga konsultovati (`DESIGN_TOKENS.md`, `DIZAJN_DOKUMENTACIJA.md`, `UI_IMPROVEMENTS.md`).
