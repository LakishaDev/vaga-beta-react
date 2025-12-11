# 🤖 GitHub Copilot Agents - Vaga Beta React

Ovi agenti su specijalizovani AI asistenti dizajnirani da pomognu u razvoju Vaga Beta React aplikacije. Svaki agent ima specifičnu ekspertizu i razumevanje projekta.

## 📋 Dostupni Agenti

### 1. 🧩 React Expert (`@react-expert`)
**Specijalizacija**: React 19+ komponente, hooks, Context API, React Router

**Koristi za**:
- Kreiranje novih React komponenti
- Implementaciju custom hooks
- Refaktorisanje komponenti
- Optimizaciju performansi
- Rad sa React Context
- React Router navigacija

**Primer**: 
```
@react-expert Napravi custom hook za upravljanje formom sa validacijom
```

---

### 2. 🔥 Firebase Expert (`@firebase-expert`)
**Specijalizacija**: Firebase Authentication, Firestore, Storage, React Firebase Hooks

**Koristi za**:
- Firestore CRUD operacije
- Firebase Authentication tokove
- Upload slika u Firebase Storage
- Real-time listeners
- Security rules
- Firebase App Check

**Primer**:
```
@firebase-expert Implementiraj real-time listener za products kolekciju
```

---

### 3. 🎨 UI & Styling Expert (`@ui-styling-expert`)
**Specijalizacija**: Tailwind CSS, Framer Motion, Headless UI, responsive design

**Koristi za**:
- Responsive layouts
- Animacije sa Framer Motion
- Pristupačne UI komponente
- Custom Tailwind styling
- Modal dialogs
- Icon integracija
- Smooth scroll efekti

**Primer**:
```
@ui-styling-expert Napravi animirani modal sa smooth transitions
```

---

### 4. 🛒 E-commerce Expert (`@ecommerce-expert`)
**Specijalizacija**: Shopping cart, product management, admin panel, order processing

**Koristi za**:
- Shopping cart funkcionalnost
- Product CRUD operacije
- Admin panel features
- Pricing i formatiranje (RSD)
- Image gallery management
- Order processing
- Inventory management

**Primer**:
```
@ecommerce-expert Dodaj funkcionalnost za bulk edit proizvoda u admin panelu
```

---

### 5. 📚 Documentation Expert (`@documentation-expert`)
**Specijalizacija**: Tehnička dokumentacija na srpskom jeziku, code comments, guides

**Koristi za**:
- Pisanje tehničke dokumentacije
- Ažuriranje README fajlova
- Code komentare na srpskom
- API dokumentaciju
- Migration guides
- Quick start guides

**Primer**:
```
@documentation-expert Napiši dokumentaciju za novi CartContext sa primerima
```

---

### 6. 🧪 Testing Expert (`@testing-expert`)
**Specijalizacija**: Testing, debugging, quality assurance, ESLint

**Koristi za**:
- Setup testing framework-a
- Pisanje unit testova
- Component testing
- E2E test scenariji
- Debugging React komponenti
- ESLint konfiguracija
- Performance profiling

**Primer**:
```
@testing-expert Setup Vitest i napiši testove za CartService
```

---

### 7. 📁 Documentation Manager (`@docs-manager`)
**Specijalizacija**: Organizacija i održavanje dokumentacije, struktura foldera

**Koristi za**:
- Organizaciju dokumentacije u foldere
- Premeštanje i kategorisanje .md fajlova
- Kreiranje index/README fajlova
- Održavanje cross-reference linkova
- Arhiviranje zastarele dokumentacije
- Kreiranje dokumentacionih template-a
- CHANGELOG održavanje

**Primer**:
```
@docs-manager Organizuj novu feature dokumentaciju i ažuriraj index
```

---

### 8. 💻 Desktop Software Expert (`@desktop-software-expert`)
**Specijalizacija**: C# .NET desktop aplikacije, industrijski sistemi, marketing desktop softvera

**Koristi za**:
- Kreiranje marketing sadržaja za desktop softver
- Pisanje feature opisa za industrijske sisteme
- Cenovnik i pricing strategija
- Tehnička dokumentacija desktop aplikacija
- Prodajna prezentacija softvera
- FAQ i support dokumentacija
- Integracija desktop proizvoda u web

**Primer**:
```
@desktop-software-expert Napiši prodajnu stranicu za eVaga Desktop sa cenovnikom
```

---

## 🚀 Kako Koristiti Agente

### 1. Mention Agenta u Komentaru
```javascript
// @react-expert Kako da optimizujem ovu komponentu za bolje performanse?
const MyComponent = () => {
  // ...
};
```

### 2. Chat sa Agentom
U GitHub Copilot chatu:
```
@firebase-expert Pomoć sa implementacijom batch upload-a slika
```

### 3. Kombinovanje Agenata
```
@react-expert @ui-styling-expert Napravi modal komponentu sa animacijama
```

## 📖 Best Practices

### ✅ Dobro
- Biti specifičan o zadatku
- Referencirati postojeći kod i komponente
- Tražiti objašnjenja u komentarima
- Koristiti odgovarajućeg agenta za zadatak

### ❌ Izbegavati
- Previše generičke upite
- Tražiti agente da rade van svoje ekspertize
- Ignorisati projekt kontekst
- Postavljati vague pitanja

## 🔧 Tehnički Stack (Referenca)

- **Frontend**: React 19.1.1, Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.14, Framer Motion 12.23.22
- **Backend**: Firebase 12.3.0 (Firestore, Auth, Storage)
- **Routing**: React Router Dom 7.9.3
- **Icons**: Heroicons, Lucide React, React Icons
- **Forms**: @tailwindcss/forms, Headless UI

## 📂 Projekt Struktura

```
src/
├── components/          # React komponente
│   ├── shop/           # E-commerce komponente
│   ├── AdminPanel/     # Admin panel komponente
│   └── UI/             # Reusable UI komponente
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Glavne stranice (routes)
├── services/           # Business logic servisi
├── utils/              # Utility funkcije
└── configs/            # Konfiguracije (Firebase, itd.)
```

## 🌐 Jezik

- **Kod**: Engleski (promenljive, funkcije, komponente)
- **Komentari**: Srpski jezik
- **Dokumentacija**: Srpski jezik
- **UI Text**: Srpski jezik

## 🆘 Pomoć

Ako niste sigurni koji agent da koristite:

| Zadatak | Agent |
|---------|-------|
| React komponenta | `@react-expert` |
| Firebase operacija | `@firebase-expert` |
| Dizajn/styling | `@ui-styling-expert` |
| Shopping/admin funkcionalnost | `@ecommerce-expert` |
| Pisanje dokumentacije | `@documentation-expert` |
| Organizacija dokumentacije | `@docs-manager` |
| Testing/debugging | `@testing-expert` |
| Desktop software marketing | `@desktop-software-expert` |

---

**Verzija**: 1.0  
**Poslednja izmena**: 2025-12-11  
**Autor**: Vaga Beta Development Team
