# 🏭 Servis za vage Vaga Beta

Modern e-commerce website for Vaga Beta, a leading Serbian company specializing in professional scales, measuring equipment, and certification services.

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Opis Projekta

Vaga Beta je kompleksna web aplikacija koja predstavlja digitalno prisustvo kompanije specijalizovane za:

- 🏭 **Industrijske vage** - Kamionske, platformske, stočarske vage
- ⚖️ **Precizne vage** - Laboratorijske i analitičke vage
- 📊 **Mernu opremu** - Profesionalni instrumenti za merenje
- 🔧 **Servisne usluge** - Održavanje i kalibracija opreme
- 📜 **Overavanje merila** - Sertifikacija i akreditacija

Aplikacija kombinuje informativni sajt sa funkcionalnom e-commerce platformom, omogućavajući korisnicima da se informišu o uslugama i kupuju opremu online.

## ✨ Ključne Funkcionalnosti

### 🌐 Glavne Stranice

- **Početna** - Predstavljanje kompanije i osnovnih usluga
- **Usluge** - Detaljne informacije o svim uslugama
- **Proizvodi** - Katalog dostupne opreme
- **O nama** - Istorija kompanije i tim
- **Kontakt** - Kontakt informacije i forma

### 🛒 E-commerce Platforma

- **Proizvodi** - Detaljni prikaz sa slikama i specifikacijama
- **Korpa** - Upravljanje narudžbinama
- **Korisnički nalozi** - Registracija, prijava, profil
- **Plaćanje** - Sigurno procesiranje porudžbina
- **Admin panel** - Upravljanje proizvodima i porudžbinama

### 🔐 Autentifikacija i Bezbednost

- Firebase Authentication
- Email verifikacija
- Reset lozinke
- Role-based access control
- Sigurna administracija

## 🛠️ Tehnologije

### Frontend Framework

- **[React 19.1.1](https://reactjs.org/)** - Glavna biblioteka za UI
- **[React Router Dom 7.9.3](https://reactrouter.com/)** - Client-side routing
- **[Vite 7.1.7](https://vitejs.dev/)** - Build tool i development server

### Stilizovanje i UI

- **[Tailwind CSS 4.1.14](https://tailwindcss.com/)** - Utility-first CSS framework
  - [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)
  - [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)
- **[Headless UI 2.2.9](https://headlessui.com/)** - Unstyled, accessible UI components
- **[Heroicons 2.2.0](https://heroicons.com/)** - Beautiful hand-crafted SVG icons
- **[Lucide React 0.544.0](https://lucide.dev/)** - Beautiful & consistent icon toolkit
- **[React Icons 5.5.0](https://react-icons.github.io/react-icons/)** - Popular icons library

### Animacije i Interakcije

- **[Framer Motion 12.23.22](https://www.framer.com/motion/)** - Production-ready motion library
- **[Lenis 1.3.11](https://lenis.studiofreight.com/)** - Smooth scroll library

### 3D Graphics

- **[@react-three/fiber 9.3.0](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)** - React renderer for Three.js
- **[@react-three/drei 10.7.6](https://github.com/pmndrs/drei)** - Useful helpers for react-three-fiber

### Backend i Database

- **[Firebase 12.3.0](https://firebase.google.com/)** - Complete app development platform
  - Firestore Database
  - Authentication
  - Storage
  - Analytics
  - App Check
- **[React Firebase Hooks 5.1.1](https://github.com/CSFrequency/react-firebase-hooks)** - React hooks for Firebase

### Razvojni Alati

- **[ESLint 9.36.0](https://eslint.org/)** - Code linting
- **[PostCSS 8.5.6](https://postcss.org/)** - CSS transformation
- **[Autoprefixer 10.4.21](https://github.com/postcss/autoprefixer)** - CSS vendor prefixing

## 🚀 Instalacija i Pokretanje

### Preduslovi

- Node.js (verzija 18 ili novija)
- npm ili yarn
- Firebase projekat sa konfigurisanim servisima

### 1. Kloniranje Repozitorijuma

```bash
git clone https://github.com/LakishaDev/vaga-beta-react.git
cd vaga-beta-react
```

### 2. Instaliranje Zavisnosti

```bash
npm install
```

### 3. Konfiguracija Environment Varijabli

Kreirajte `.env.local` fajl u root direktorijumu:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=your_debug_token
```

### 4. Firebase Setup

1. Kreirajte Firebase projekat na [Firebase Console](https://console.firebase.google.com/)
2. Omogućite Authentication, Firestore, Storage, i Analytics
3. Konfigurirajte Firebase App Check sa reCAPTCHA v3
4. Postavite security rules za Firestore i Storage

### 5. Pokretanje Development Servera

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`

## 📦 Build i Deployment

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Struktura Projekta

```
src/
├── components/          # Reusable komponente
│   ├── shop/           # E-commerce specifične komponente
│   └── UI/             # Osnovne UI komponente
├── contexts/           # React Context providers
│   ├── shop/          # E-commerce konteksti
│   └── snackbar/      # Notification sistem
├── hooks/             # Custom React hooks
├── pages/             # Glavne stranice
│   └── shop/          # E-commerce stranice
├── services/          # Business logic servisi
├── utils/             # Utility funkcije
└── configs/           # Konfiguracije
```

## 🔥 Firebase Konfiguracija

Aplikacija koristi sledeće Firebase servise:

- **Authentication** - Registracija i prijava korisnika
- **Firestore** - NoSQL baza podataka
- **Storage** - File storage za slike proizvoda
- **Analytics** - Praćenje korisničkih aktivnosti
- **App Check** - Zaštita od zloupotrebe

## 🎨 Design System

Aplikacija koristi custom Tailwind CSS temu sa definisanim bojama:

- **Bone** (#CBCFBB) - Svetla neutralna
- **Midnight** (#1E3E49) - Tamno plava
- **Sheen** (#6EAEA2) - Mint zelena
- **Chestnut** (#8A4D34) - Braon
- **Outer Space** (#1A343D) - Tamna
- **Rust** (#AD5637) - Crveno-braon

## 🤝 Doprinošenje

1. Fork repozitorijum
2. Kreirajte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit izmene (`git commit -m 'Add some AmazingFeature'`)
4. Push na branch (`git push origin feature/AmazingFeature`)
5. Otvorite Pull Request

## 📝 Licenca

Ovaj projekat je vlasništvo Vaga Beta kompanije. Sva prava zadržana.

## 📞 Kontakt

**Vaga Beta**

- Website: [vagabeta.rs](https://vagabeta.rs)
- Email: lazar.cve@gmail.com
- GitHub: [@LakishaDev](https://github.com/LakishaDev)

---

_Izgrađeno sa ❤️ koristeći moderne web tehnologije_
