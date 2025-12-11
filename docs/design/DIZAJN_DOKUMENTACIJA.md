# 🎨 Dizajn Dokumentacija - Software Features

## Pregled implementiranih funkcionalnosti

Implementirane su dve nove profesionalne funkcionalnosti sa modernim UI/UX dizajnom:

1. **Markdown Preview u ProductDetails** - GitHub-style dokumentacija za softverske proizvode
2. **Software Badge u ProductCard** - Vizuelna oznaka koja pokazuje da je proizvod softver

---

## 1. Markdown Preview u ProductDetails

### 📍 Pozicija
Sekcija se nalazi **ispod Features & Downloads** u ProductDetails komponenti.

### 🎯 Prikaz
Prikazuje se **samo za proizvode gde je `isSoftware = true`** i postoje `markdownFiles`.

### 🎨 Dizajn Specifikacija

#### Layout i Struktura
```
┌─────────────────────────────────────────┐
│ 📄 Dokumentacija                        │
├─────────────────────────────────────────┤
│ ┌───────────────────────────────────┐   │
│ │ 📄 PRODUCT LAUNCH                 │   │ ← Naslov dokumenta
│ ├───────────────────────────────────┤   │
│ │ Markdown sadržaj                  │   │
│ │ • Naslovi                         │   │
│ │ • Liste                           │   │
│ │ • Code blokovi                    │   │
│ │ • Linkovi, bold, italic...        │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ 📄 INSTALLATION GUIDE             │   │ ← Drugi dokument
│ ├───────────────────────────────────┤   │
│ │ ...                               │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

#### Boje i Stilizacija

**Glavna sekcija:**
- Background: `rgba(37, 56, 105, 0.06)` - Svetlo plavi glassmorphism
- Border: `1.5px solid rgba(110, 174, 162, 0.3)` - Teal border
- Backdrop blur: `blur(10px)`
- Shadow: `shadow-lg`
- Border radius: `rounded-xl`

**Naslovi dokumenta:**
- Background: Gradijent od `#253869/10` do `#6EAEA2/10`
- Border bottom: `border-[#6EAEA2]/30`
- Text color: `#253869` (midnight blue)
- Font: Bold, 16px (text-base)
- Ikona: FileCode (#6EAEA2, 18px)

**Markdown sadržaj container:**
- Background: `bg-white/60` - Polu-transparentna bela
- Border: `border-[#6EAEA2]/30`
- Backdrop blur: `backdrop-blur-sm`
- Padding: `p-4`

**Markdown Typography (Tailwind prose):**
- Headings: `#253869` (midnight blue), bold
  - H1: 20px (text-xl)
  - H2: 18px (text-lg)
  - H3: 16px (text-base)
- Paragraphs: `#1E3E49` (dark teal)
- Links: `#6EAEA2` (bluegreen), hover underline
- Strong/Bold: `#253869`, font-bold
- Code inline: 
  - Text: `#6EAEA2`
  - Background: `#253869/10` (rgba(37, 56, 105, 0.1))
  - Padding: `px-1.5 py-0.5`
  - Border radius: `rounded`
  - Font: mono, 14px (text-sm)
- Code blocks:
  - Background: `#253869` (midnight blue)
  - Text: white
  - Border radius: `rounded-lg`
  - Shadow: `shadow-lg`
- Lists:
  - Disc/Decimal style
  - Text: `#1E3E49`
  - Markers: `#6EAEA2`
- Blockquotes:
  - Border left: `4px solid #6EAEA2`
  - Background: `#6EAEA2/5` (rgba(110, 174, 162, 0.05))
  - Italic text: `#1E3E49/80`
- Images:
  - Border radius: `rounded-lg`
  - Shadow: `shadow-md`
- HR lines: `border-[#6EAEA2]/30`

#### Ikona
**FileCode** iz Lucide React:
- Color: `#6EAEA2` (bluegreen)
- Size: 20px u hederu sekcije, 18px u naslovima dokumenata

#### Animacije (Framer Motion)

**Glavna sekcija:**
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.4 }}
```

**Pojedinačni dokumenti (staggered):**
```jsx
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.5 + idx * 0.15 }}
```
- Svaki dokument ima delay od 0.15s dodatno

#### Funkcionalnost naslov ekstrakcije
Automatski formatira naziv fajla:
- Uklanja timestamp sa početka: `1762106127475_` →
- Uklanja ekstenziju: `.md` →
- Zamenjuje underscore sa razmakom: `_` → ` `
- Primer: `1762106127475_PRODUCT_LAUNCH.md` → `PRODUCT LAUNCH`

---

## 2. Software Badge u ProductCard

### 📍 Pozicija
**Gornji desni ugao kartice** (top-right: `top-4 right-4` na mobilnom, `top-6 right-7` na desktop-u)

### 🎯 Prikaz
Prikazuje se **samo za proizvode gde je `isSoftware = true`**

### 🎨 Dizajn Specifikacija

#### Struktura Badge-a
```
    ┌──────┐
    │ 💻   │  ← Terminal ikona
    └──────┘
      ↓
   "Softver"  ← Tooltip na hover
```

#### Dimenzije
- Mobilni: `w-10 h-10` (40x40px)
- Desktop: `w-12 h-12` (48x48px)
- Ikona: 18px osnovno, 20px na desktop (`sm:w-5 sm:h-5`)

#### Boje i Slojevi

**Glow efekat (pozadina):**
- Background: Gradijent od `#6EAEA2` do `#253869`
- Opacity: 50% (70% na hover)
- Blur: `blur-md`
- Animation: `animate-pulse` (konstantno)

**Glavni badge (glassmorphism):**
- Background: Gradijent `linear-gradient(135deg, rgba(110, 174, 162, 0.9) 0%, rgba(37, 56, 105, 0.8) 100%)`
- Backdrop filter: `blur(10px)`
- Border: `2px solid rgba(255, 255, 255, 0.3)`
- Border radius: `rounded-full` (krug)
- Box shadow: 
  - Outer: `0 4px 20px rgba(110, 174, 162, 0.4)`
  - Inner (inset): `0 1px 2px rgba(255, 255, 255, 0.3)`

**Tooltip:**
- Background: `#253869` (midnight blue)
- Text: White, bold, 12px (text-xs)
- Padding: `px-3 py-1.5`
- Border radius: `rounded-lg`
- Border: `border-[#6EAEA2]/30`
- Shadow: `shadow-lg`
- Strelica (arrow): Border trikot pokazujući na badge

#### Ikona
**Terminal** iz Lucide React:
- Color: White
- Size: 18px (20px na desktop)
- Stroke width: 2.5 (deblje linije za bolju vidljivost)
- Drop shadow: `drop-shadow-md`

#### Animacije (Framer Motion)

**Ulazna animacija:**
```jsx
initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
animate={{ opacity: 1, scale: 1, rotate: 0 }}
transition={{ 
  type: "spring", 
  stiffness: 260, 
  damping: 20,
  delay: 0.1 
}}
```
- "Spring" efekat sa bounce
- Opacity fade-in
- Scale od 0.8 do 1
- Rotacija od -10° do 0°
- Delay 0.1s

**Hover animacija:**
```jsx
whileHover={{ 
  scale: 1.1, 
  rotate: 5,
  transition: { duration: 0.2 }
}}
```
- Scale povećanje na 110%
- Rotacija +5°
- Brzi transition (0.2s)

**Tooltip animacija:**
- Opacity: 0 → 1 na hover
- Transition: `transition-opacity`
- Pointer events: none (ne ometa klik)

#### Z-Index Hijerarhija
- Badge: `z-20`
- Popust badge: `z-20`
- Cena badge: `z-10`
- Badge ne prekriva druge elemente zbog pametnog pozicioniranja

---

## 📦 Struktura podataka

### Za Markdown Preview:
```javascript
product: {
  isSoftware: true,  // Boolean flag
  markdownFiles: [
    {
      name: "1762106127475_PRODUCT_LAUNCH.md",
      content: "# Product Launch\n\n..."  // Raw markdown string
    },
    {
      name: "INSTALLATION_GUIDE.md",
      content: "## Installation\n\n..."
    }
  ]
}
```

### Za Software Badge:
```javascript
product: {
  isSoftware: true  // Boolean flag - dovoljno za prikaz badge-a
}
```

---

## 🛠️ Tehnička implementacija

### Instalovani paketi:
```bash
npm install react-markdown remark-gfm rehype-raw
```

### Importi (ProductDetails):
```javascript
import { FileCode } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
```

### Importi (ProductCard):
```javascript
import { Terminal } from "lucide-react";
import { motion as Motion } from "framer-motion";
```

### Plugins:
- **remark-gfm**: GitHub Flavored Markdown podrška (tabele, task liste, strikethrough)
- **rehype-raw**: Dozvoljava HTML u markdown-u
- **@tailwindcss/typography**: Prose styling za markdown

---

## 🎯 UX Razmatranja

### Markdown Preview:
✅ GitHub-style formatiranje poznat programerima  
✅ Čist, čitljiv dizajn  
✅ Staggered animacije za prijatan UX  
✅ Separacija dokumenata sa jasnim naslovima  
✅ Palete boja usklađene sa brendom (#253869, #6EAEA2, #1E3E49)  
✅ Dobra čitljivost sa contrast ratiom  

### Software Badge:
✅ Ne ometa ostale badge-ove (popust, cena)  
✅ Odmah primetljiv ali ne agresivan  
✅ Intuitivan tooltip na hover  
✅ Smooth animacije (spring, pulse)  
✅ Odlična vidljivost na svim pozadinama  
✅ Responsive dizajn (različite veličine)  

---

## 📱 Responsive ponašanje

### Markdown Preview:
- **Mobilni**: Prose prose-sm (manji font za mobilne)
- **Desktop**: Isti layout, veći paddinzi
- Automatski responsive zahvaljujući prose utility

### Software Badge:
- **Mobilni**: 40x40px badge, 18px ikona
- **Desktop**: 48x48px badge, 20px ikona
- Tooltip ostaje isti, pozicioniran desno

---

## 🔍 Dodatne ideje (implementirane u kodu)

### Markdown Preview:
1. ✅ Glow efekat na code blokovima
2. ✅ Hover efekti na linkovima
3. ✅ Blockquote sa border-left accent
4. ✅ Automatsko formatiranje naslova fajlova
5. ✅ Staggered entrance animacije

### Software Badge:
1. ✅ Pulsing glow u pozadini (ambient efekat)
2. ✅ Tooltip sa strelicom
3. ✅ Bounce entrance animacija
4. ✅ Hover rotate + scale efekat
5. ✅ Glassmorphism sa multi-layer dizajnom
6. ✅ White inner shadow za depth

---

## 🎨 Paleta boja (korištene)

```css
#253869  /* Midnight Blue - Naslovi, dark UI */
#6EAEA2  /* Bluegreen - Akcenti, linkovi, ikone */
#1E3E49  /* Dark Teal - Tekst, border */
#91CEC1  /* Light Bluegreen - Hover states */
#2F5363  /* Charcoal - Secondary text */

/* Transparentnosti: */
rgba(37, 56, 105, 0.06)   /* Background sekcija */
rgba(110, 174, 162, 0.3)  /* Border */
rgba(255, 255, 255, 0.6)  /* White overlay */
```

---

## ✨ Finalni rezultat

Dizajn je **profesionalan, moderan i koherentan** sa postojećim stilom aplikacije:
- ✅ Glassmorphism efekat u svim komponentama
- ✅ Konzistentne boje iz palete
- ✅ Smooth Framer Motion animacije
- ✅ Lucide React ikone
- ✅ Tailwind CSS utility classes
- ✅ GitHub-style markdown formatting
- ✅ Responsive na svim uređajima
- ✅ Accessibility friendly (tooltips, aria labels)

---

**Autor**: Dizajner Agent  
**Datum**: 2025-11-02  
**Verzija**: 1.0  
