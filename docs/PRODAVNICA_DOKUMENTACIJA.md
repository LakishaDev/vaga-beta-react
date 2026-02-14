# PRODAVNICA DOKUMENTACIJA

## Redizajn sa Cobalt Navy paletom (Feb 2026)

### Globalni pregled

Vaga Beta Prodavnica (`/prodavnica`) je e-commerce platforma za kupovinu vaga, alata i servisa. Sadrži:

- **Početnu stranicu** - Hero sekcija sa CTA za pregled proizvoda
- **Listu proizvoda** - ProductGrid sa filtriranjem po kategorijama
- **Detalje proizvoda** - ProductDetails sa specifikacijama, garanciјom, cenama
- **Korpu** - Cart sa mogućnostima dodavanja/uklanjanja/edit količine
- **Checkout** - Plaćanje i prosljeđivanje narudžbe
- **Autentifikaciju** - Login/Register za korisnike
- **Admin panel** - Upravljanje proizvodima, narudžbama, statistikom

---

## Arhitektura

### Rute

```
/prodavnica
├── / (HeroSection + ProductGrid)
├── /proizvodi (ProductGrid - sa query parametrima za filter)
├── /proizvod/:id (ProductDetails)
├── /korpa (Cart)
├── /cart (alias za /korpa - ZASTARELO)
├── /checkout (CheckoutForm)
├── /prijava (AuthForm - login/register)
├── /login (alias za /prijava - ZASTARELO)
├── /profil (Profile - korisnikov nalog)
├── /admin (AdminPanel - upravljanje)
├── /admin/narudzbine (AdminOrders - pregled narudžbi)
└── /verify-email (VerifyEmailPage - verifikacija emaila)
```

### Komponente

#### Shop-specifične komponente

1. **HeroSection** (`src/pages/shop/HeroSection.jsx`)
   - Full-screen hero sa gradijentom (trenutno: plavo-zeleni)
   - Logo, naslov, CTA dugme
   - Treba modernizovati: Cobalt Navy paleta, full-width, Framer Motion animacije

2. **ProductGrid** (`src/components/shop/ProductGrid.jsx`)
   - Grid prikaz proizvoda sa karticama
   - Filtriranje po kategorijama
   - Search functionality
   - Pagination
   - Treba: designTokens boje, hover efekti, responsive

3. **ProductDetails** (`src/components/shop/ProductDetails.jsx`)
   - Detaljan prikaz jednog proizvoda
   - Slike, opis, specifikacije, cena, reviews
   - "Dodaj u korpu" dugme
   - Treba: modernizacija UI-ja

4. **Cart** (`src/pages/shop/Cart.jsx`)
   - Prikaz stavki u korpi
   - Edit količine, uklanjanje stavki
   - Procenat dostave, popusti
   - Link na checkout
   - Treba: full-width dizajn

5. **CheckoutForm** (`src/pages/shop/CheckoutForm.jsx`)
   - Forma za unos podataka o dostavi
   - Odabir metode plaćanja
   - Validation i error handling
   - Treba: input styling sa designTokens

6. **AuthForm** (`src/pages/shop/AuthForm.jsx`)
   - Login/Register forma
   - Firebase auth integracija
   - Social login opcije
   - Treba: modernizacija

7. **Profile** (`src/pages/shop/Profile.jsx`)
   - Korisnikov profil
   - Istorija narudžbi
   - Podaci za dostavu
   - Treba: full-width layout

#### Shop utilities

- **Navbar** (`src/components/shop/Navbar.jsx`)
  - Shop-specifična navigacija
  - Korpa ikona sa brojem stavki
  - User menu
  - Search bar

- **CartProvider** (`src/contexts/shop/cart/CartProvider.jsx`)
  - Context za upravljanje korpом
  - Funkcije: add, remove, update quantity, clear cart
  - LocalStorage persistence

- **AuthProvider** (`src/contexts/shop/auth/AuthProvider.jsx`)
  - Firebase auth context
  - Login, logout, register

- **SnackbarProvider** (`src/contexts/snackbar/SnackbarProvider.jsx`)
  - Toast notifikacije za akcije

---

## Proizvodi - Struktura podataka

Proizvodi se čuvaju u Firebase Firestore kolekciji `products`:

```javascript
{
  id: "prod-001",
  name: "Industrijska paletna vaga",
  category: "paletne-vage",
  description: "...",
  price: 15000, // RSD
  oldPrice: 18000,
  currency: "RSD",
  image: "/imgs/products/vaga-1.jpg",
  images: ["...", "...", "..."],
  specifications: {
    capacity: "3000 kg",
    accuracy: "±100 g",
    material: "čelik",
    warranty: "2 godine"
  },
  stock: 5,
  rating: 4.5, // 1-5
  reviews: 12,
  tags: ["industrijska", "heavy-duty", "servis"],
  featured: true,
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2026-02-13T14:45:00Z"
}
```

### Kategorije proizvoda

- `paletne-vage` - Paletne/industrijske vage
- `laboratorijske-vage` - Laboratorijske vage za precizna merenja
- `trade-vage` - Vage za maloprodaju/trgovinu
- `softver` - Softver i licence
- `delovi-pristup` - Rezervni delovi i pribor
- `servisi` - Servisi (žigosanje, kalibracija, servis)

---

## Cobalt Navy Paleta - Shop primena

```javascript
// colors.brand.primary: #0B3A8D (Cobalt Navy)
// Upotreba: Hero gradient, primary CTA, highlights

// colors.brand.secondary: #1D4ED8 (Svetlo plavo)
// Upotreba: Secondary buttons, info sections

// colors.brand.accent: #0E7490 (Tirkizna)
// Upotreba: Akcenti, sale badges, star ratings

// colors.neutral.bg: #F8FAFC (Svetla pozadina)
// Upotreba: ProductGrid background, sekcije

// colors.neutral.surface: #FFFFFF (Bela)
// Upotreba: Kartice, forme, modali
```

---

## Redizajn plan - Full-width modernizacija

### FAZA 1: HeroSection → HeroSectionModern

**Lokacija:** `src/pages/shop/HeroSectionModern.jsx`

Karakteristike:

- Full-screen hero sa Cobalt Navy + Secondary Blue gradijentom
- Animated background (Framer Motion)
- Logo + naslov + subheading
- Dva CTA dugmeta: "Vidi proizvode" + "Saznaj više"
- Statistics sekcija ispod (X proizvoda, X klijenti, X godima)
- Responsive design bez max-width ograničenja

```jsx
<section className="relative h-screen w-full flex items-center">
  // Gradient background // Logo sa rotation animation // Main heading sa
  staggered text animation // Two CTA buttons sa hover efektima // Stats grid
  (bottom)
</section>
```

### FAZA 2: ProductGrid → ProductGridModern

**Lokacija:** `src/components/shop/ProductGridModern.jsx`

Karakteristike:

- Responsive grid (1→2→3→4 kolone) bez max-width
- Product cards sa designTokens bojama
- Kategorije kao horizontalni filter (sticky na scroll)
- Search bar sa live filtering
- Sort options (cena, popularnost, novo)
- Loading skeleton tokom učitavanja
- Lazy loading slike

```jsx
<div className="w-full px-4 md:px-8 lg:px-16 py-12">
  // Filter bar (sticky) // Search + sort // Product grid (responsive) //
  Pagination / Load more
</div>
```

### FAZA 3: Cart & Checkout

Modernizovani Cart.jsx i CheckoutForm.jsx sa:

- Full-width layout
- designTokens boje i gradijent backgrounds
- Stepper komponenta za process (kao u Booking)
- Error/success notifikacije sa proper styling

### FAZA 4: Integracione izmene

- Ažuriranje `src/Prodavnica.jsx` da koristi moderne komponente
- Ažuriranje routes za nove moderne stranice
- CSS animacije i Framer Motion gde je potrebno

---

## Integracija sa ostatkom sajta

### Veze sa glavnim stranicama

- **Home.jsx** → "Prodavnica" link u Navbar-u → `/prodavnica`
- **Usluge.jsx** → CTA "Pogledaj proizvode" → `/prodavnica/proizvodi`
- **Navbar** → Shopping cart ikona → `/prodavnica/korpa`

### Korisnički tok

```
Početna stranica
  ↓
Prodavnica (Hero + proizvodi uz sebe)
  ↓
Proizvod (detalji)
  ↓
Korpa
  ↓
Prijava (ako nije ulogovan)
  ↓
Checkout (dostava + plaćanje)
  ↓
Potvrda narudžbe
  ↓
Profile (istorija narudžbi)
```

---

## Specijalne stranice

### AdminPanel (`src/pages/shop/AdminPanel.jsx`)

Dostupno samo za admin korisnike (`isAdmin: true`). Omogućava:

- Dodavanje/ažuriranje/brisanje proizvoda
- Upravljanje zalihom
- Pregled narudžbi
- Statistika prodaje
- Upravljanje kuponima i popustima

Trebalo bi: modernizacija UI-ja sa dashboard grid-om, charts-ima

### AdminOrders (`src/pages/shop/AdminOrders.jsx`)

Pregled svih narudžbi sa:

- Status tracking
- Filter po datumu/korisniku
- Export opcije
- Communication tools

---

## Firebase integracija

### Kolekcije

- **products** - Svi dostupni proizvodi
- **orders** - Narudžbe korisnika
- **users** - Korisničke informacije (radi `createOrUpdateUserAccount`)
- **cart** (opciono) - Možda remote cart ako je potrebno multi-device sinhronizacija

### Auth flow

1. Korisnik se login-uje → Firebase Auth
2. `createOrUpdateUserAccount()` kreira/ažurira user dokument u Firestore
3. User config se čuva: name, email, phone, shipping address, preferences
4. Cart se čuva u LocalStorage (opcionalno: Firebase)

---

## SEO - Prodavnica

Važne meta informacije:

- **Canonical URLs**: `/prodavnica` za home, `/prodavnica/proizvodi` za listing
- **Sitemap**: Dinamički uključuje sve proizvode
- **Open Graph**: Za product sharing na društvenim mrežama
  - `og:title`: Naziv proizvoda
  - `og:description`: Kratak opis
  - `og:image`: Glavna slika proizvoda
  - `og:price`: Cena

- **Structured Data (JSON-LD)**:
  - `Product` schema za svaki proizvod
  - `Organization` schema za shop
  - `AggregateOffer` za cene

---

## Performance - Optimizacije

1. **Slike**: ProgressiveImage komponenta sa lazy loading
2. **Code splitting**: Rute se lazy-load-uju u App.jsx
3. **Bundle**: ProductGrid i Cart su kritični → chunk separation
4. **Caching**: Products cache sa revalidation timer-om
5. **Search**: Debounced search requests za live filtering

---

## Buduća poboljšanja

1. **Wishlist** - Korisnici mogu sačuvati proizvode za kasnije
2. **Recenzije** - Rating sistem sa fotografijama
3. **Preporuke** - "Kupci su takođe kupili" sekcija
4. **Email notifikacije** - Obaveštenja o popustima, novim proizvodima
5. **Reviews slider** - Carousel sa aktivnim review-ima
6. **Size/variant selection** - Ako se dodam različite veličine/boje
7. **Kuponi i voucher-i** - Promo code aplikacija na checkout
8. **Gift cards** - Mogućnost kupovine gift card-ova
9. **Subscription** - Periodična dostava/abonement

---

## Zadnja ažuriranja

- **13.2.2026** - Osnovna dokumentacija kreirana
- Moderna HeroSection čeka implementaciju
- Moderan ProductGrid čeka implementaciju
- Booking.jsx Firebase import greške - ISPRAVLJENO (useAuth → onAuthStateChanged)
