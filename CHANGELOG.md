# 📝 Changelog

Sve značajne izmene u projektu Vaga Beta će biti dokumentovane u ovom fajlu.

Format zasnovan na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
i projekat koristi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-11-02

### 🎉 Nove Funkcionalnosti - AdminPanel Component

#### 🔄 Reordering Dodatnih Slika
- **Dodato:** Dugmad za premeštanje slika gore (↑) i dole (↓)
- **Lokacija:** Dostupno u glavnom formu i Edit modalu
- **Funkcije:**
  - `moveImageUp(index)` - Pomera sliku gore u glavnom formu
  - `moveImageDown(index)` - Pomera sliku dole u glavnom formu
  - `moveEditImageUp(index, isNew)` - Pomera sliku gore u edit modu
  - `moveEditImageDown(index, isNew)` - Pomera sliku dole u edit modu
  - `moveEditImageInDirection(index, isNew, direction)` - Helper funkcija (DRY)
- **UI/UX:**
  - Glassmorphism efekti sa gradijentima (#6EAEA2 → #91CEC1)
  - Spring animacije sa hover/tap efektima
  - Disabled state za prve/poslednje slike
  - Responsive: Uvek vidljivo na mobilnom, na hover na desktop-u

#### 💰 Lokalizacija Cene
- **Dodato:** Automatsko formatiranje cene sa srpskim locale-om (sr-RS)
- **Format:** `10000` → `10.000 RSD`
- **Separator:** Tačka (.) za hiljade (srpski standard)
- **Funkcije:**
  - `formatPrice(price)` - Formatira cenu za prikaz
  - `formatPriceInput(value)` - Formatira unos tokom kucanja
  - `parsePriceInput(formattedValue)` - Parsira formatovanu vrednost u broj
- **UI/UX:**
  - RSD badge sa FiDollarSign ikonom
  - Pulsing glow animacija na badge-u
  - Tooltip hint: "💡 Separator za hiljade se dodaje automatski"
  - Glassmorphism efekat: `rgba(110, 174, 162, 0.15)` sa blur-om

#### 🖼️ Modal za Prikaz Slika
- **Dodato:** Klik na dodatnu sliku otvara modal sa zoom preview-om
- **Komponenta:** LepModal (postojeća komponenta)
- **State:** `imageModal` - `{ open: boolean, src: string, text: string }`
- **UI/UX:**
  - Hover overlay sa gradijentom (#6EAEA2/30 → #1E3E49/50)
  - Zoom ikona (FiZoomIn) sa rotacijom (-180° → 0°)
  - Spring animacija: `stiffness: 260, damping: 20`
  - Glow efekat oko slike na hover
- **Dostupno:**
  - Glavni form - dodatne slike
  - Edit modal - postojeće i nove slike

### 🎨 Dizajn Izmene

#### Brendirane Boje
```css
#6EAEA2  /* Bluegreen - Glavni akcenti */
#91CEC1  /* Light Bluegreen - Hover states */
#1E3E49  /* Midnight Blue - Tekst, pozadine */
#AD5637  /* Rust - Delete akcije */
```

#### Glassmorphism Efekti
- Backdrop filter: `blur(10px)`
- Semi-transparent pozadine sa RGBA
- White borders: `rgba(255, 255, 255, 0.3)`
- Drop shadows i glow efekti

#### Framer Motion Animacije
- **Spring animations:** `type: "spring", stiffness: 400, damping: 10`
- **Entrance:** Fade + Scale + Rotate sa delay-om
- **Hover:** Scale + Rotate + Background color
- **Tap:** Scale down za feedback
- **Continuous:** Pulse, rotate za ambient efekte

### 📚 Dokumentacija

#### Novi Fajlovi
- **[ADMINPANEL_DOKUMENTACIJA.md](./ADMINPANEL_DOKUMENTACIJA.md)** ✅
  - 30+ KB tehničke dokumentacije
  - Detaljni opisi svih funkcija sa JSDoc komentarima
  - Primeri upotrebe i best practices
  - Workflow dijagrami
  - Testing scenarios
  - Troubleshooting guide

- **[CHANGELOG.md](./CHANGELOG.md)** ✅
  - Keep a Changelog format
  - Semantic versioning

#### Ažurirani Fajlovi
- **[README.md](./README.md)** ✅
  - Dodato: "Dokumentacija" sekcija sa linkovima
  - Link ka ADMINPANEL_DOKUMENTACIJA.md

- **[AdminPanel.jsx](./src/pages/shop/AdminPanel.jsx)** ✅
  - Header komentar sa verzijom i opisom
  - JSDoc komentari za sve funkcije
  - `@intellisense` tagovi za bolje IntelliSense iskustvo
  - Sekcije sa separatorima za lakšu navigaciju

### 🔧 Tehničke Izmene

#### Code Organization
- Grupisane funkcije po funkcionalnosti:
  - Price Formatting Functions
  - Image Reordering Functions (Main Form)
  - Image Reordering Functions (Edit Modal)
- JSDoc komentari sa `@param`, `@returns`, `@example`, `@note`, `@intellisense`
- Defensive programming - guard clauses
- DRY principle - helper funkcije

#### Performance
- Immutable state updates (spread operator)
- Optimizovane animacije (spring timing)
- Lazy loading slika (ProgressiveImage)
- AnimatePresence za smooth unmounting

### 🐛 Bug Fixes
- ✅ Provera postojanja `editProduct` state-a u `moveEditImageInDirection`
- ✅ Guard clauses sprečavaju invalid operacije
- ✅ Defensive checks za edge cases

### 🔐 Security
- ✅ Email-based autorizacija ostaje nepromenjena
- ✅ Firebase Security Rules primenjuju se

---

## [1.0.0] - Pre 2025-11-02

### Početna Verzija

#### Funkcionalnosti
- ✅ CRUD operacije za proizvode
- ✅ Upload glavne slike
- ✅ Upload dodatnih slika (bez reordering-a)
- ✅ Karakteristike proizvoda (features)
- ✅ Upload datasheets
- ✅ Software toggle sa markdown fajlovima
- ✅ Responsive dizajn
- ✅ Firebase integracija (Firestore + Storage)
- ✅ Email-based autorizacija
- ✅ Snackbar notifikacije
- ✅ 3D animacije na dugmadima

#### Komponente
- AdminPanel.jsx
- FloatingLabelInput
- ProgressiveImage
- ProgressBar
- SoftwareToggle
- LepModal

#### Struktura Projekta
- React 19.1.1
- Vite 7.1.7
- Firebase 12.3.0
- Framer Motion 12.23.22
- Tailwind CSS 4.1.14

---

## 🚀 Planirane Izmene

### [2.1.0] - Sledeća Verzija
- [ ] Drag & drop reordering slika
- [ ] Bulk operacije (select multiple products)
- [ ] Export/Import proizvoda (JSON/CSV)
- [ ] Pretraga i filtriranje proizvoda
- [ ] Kategorije kao dropdown (dinamički)

### [3.0.0] - Buduća Verzija
- [ ] Multi-jezik podrška (EN, DE)
- [ ] Analytics dashboard
- [ ] Template proizvoda
- [ ] SEO metadata polja
- [ ] Crop/resize slika pre upload-a
- [ ] Historie izmena (audit log)

---

## 📋 Notacije

### Tipovi Izmena
- **🆕 Dodato (Added):** Nove funkcionalnosti
- **🔄 Izmenjeno (Changed):** Promene postojećih funkcionalnosti
- **⚠️ Deprecated:** Funkcionalnosti koje će biti uklonjene
- **🗑️ Uklonjeno (Removed):** Uklonjene funkcionalnosti
- **🐛 Ispravljeno (Fixed):** Bug fixes
- **🔐 Sigurnost (Security):** Security patches

### Prioriteti
- **P0:** Kritično (mora se uraditi odmah)
- **P1:** Visok (sledeći release)
- **P2:** Srednji (planirano)
- **P3:** Nizak (možda)

---

**Autor:** Dokumentar Agent  
**Jezik:** Srpski  
**Format:** Markdown (Keep a Changelog)  
**Poslednja izmena:** 2025-11-02
