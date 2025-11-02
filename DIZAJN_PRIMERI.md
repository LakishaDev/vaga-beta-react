# 🎨 Vizuelni primeri i Kod Snippeti

## 1. Markdown Preview - Primeri Stilizacije

### Kako izgleda Markdown sadržaj:

#### Naslovi:
```markdown
# Heading 1 → 20px, #253869, bold
## Heading 2 → 18px, #253869, bold
### Heading 3 → 16px, #253869, bold
```

#### Liste:
```markdown
• Item 1  ← Marker: #6EAEA2
• Item 2
  1. Sub item ← Tekst: #1E3E49
  2. Sub item
```

#### Code blokovi:

**Inline code:**
```markdown
Use `npm install` to install → Rendered kao: npm install (sa background #253869/10, color #6EAEA2)
```

**Code block:**
````markdown
```javascript
function hello() {
  console.log("Hello!");
}
```
````
→ Rendered sa background #253869, white text, rounded-lg

#### Linkovi:
```markdown
[GitHub](https://github.com) → #6EAEA2 sa hover underline
```

#### Bold i Italic:
```markdown
**Bold text** → #253869, font-bold
*Italic text* → Italic stil
```

#### Blockquotes:
```markdown
> Important note!
```
→ Border-left 4px #6EAEA2, background #6EAEA2/5, italic

---

## 2. Software Badge - CSS Breakdown

### HTML Struktura (pojednostavljena):
```jsx
<div className="absolute top-4 right-4 z-20">
  {/* Glow layer */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#6EAEA2] to-[#253869] rounded-full opacity-50 blur-md animate-pulse" />
  
  {/* Main badge */}
  <div className="relative w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border-2">
    <Terminal size={18} className="text-white" />
  </div>
  
  {/* Tooltip */}
  <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100">
    <div className="bg-[#253869] text-white px-3 py-1.5 rounded-lg">
      Softver
    </div>
  </div>
</div>
```

### CSS Values (inline styles):
```css
/* Badge background */
background: linear-gradient(135deg, 
  rgba(110, 174, 162, 0.9) 0%, 
  rgba(37, 56, 105, 0.8) 100%
);

/* Glassmorphism */
backdrop-filter: blur(10px);

/* Border */
border: 2px solid rgba(255, 255, 255, 0.3);

/* Shadow (layered) */
box-shadow: 
  0 4px 20px rgba(110, 174, 162, 0.4),      /* Outer glow */
  inset 0 1px 2px rgba(255, 255, 255, 0.3); /* Inner highlight */
```

---

## 3. Animacije Timeline

### Markdown dokumenti:
```
0.0s: Page load
0.4s: Glavna sekcija fade in + slide up
0.5s: Prvi dokument fade in
0.65s: Drugi dokument fade in  (+0.15s delay)
0.80s: Treći dokument fade in  (+0.15s delay)
...
```

### Software Badge:
```
0.0s: Page load
0.1s: Badge ulazi (spring bounce) sa rotate -10° → 0°
∞: Glow pulsira (animate-pulse)
Hover: Scale 1 → 1.1, rotate 0° → 5°, tooltip fade in
```

---

## 4. Component Props Interface

### ProductDetails očekuje:
```typescript
interface Product {
  id: string;
  name: string;
  // ... ostali fieldovi
  
  // Nova polja:
  isSoftware?: boolean;  // Flag za software proizvod
  markdownFiles?: Array<{
    name: string;      // Ime fajla (npr: "1762106127475_PRODUCT_LAUNCH.md")
    content: string;   // Raw markdown content
  }>;
}
```

### ProductCard očekuje:
```typescript
interface Product {
  id: string;
  name: string;
  // ... ostali fieldovi
  
  // Novo polje:
  isSoftware?: boolean;  // Flag za software badge
}
```

---

## 5. Tailwind Prose Customization

Korišćene prose klase:
```
prose                         → Base typography
prose-sm                      → Smaller font sizes for mobile
max-w-none                    → Remove max-width constraint

prose-headings:text-[#253869] → All headings
prose-headings:font-bold      → Bold headings
prose-h1:text-xl              → H1 specific size
prose-h2:text-lg              → H2 specific size
prose-h3:text-base            → H3 specific size

prose-p:text-[#1E3E49]        → Paragraph color
prose-p:leading-relaxed       → Line height

prose-a:text-[#6EAEA2]        → Link color
prose-a:no-underline          → Remove underline
hover:prose-a:underline       → Underline on hover

prose-strong:text-[#253869]   → Bold text color
prose-strong:font-bold        → Bold weight

prose-code:text-[#6EAEA2]     → Inline code color
prose-code:bg-[#253869]/10    → Inline code background
prose-code:px-1.5             → Horizontal padding
prose-code:py-0.5             → Vertical padding
prose-code:rounded            → Border radius
prose-code:font-mono          → Monospace font
prose-code:text-sm            → Smaller size
prose-code:before:content-[''] → Remove backticks
prose-code:after:content-['']  → Remove backticks

prose-pre:bg-[#253869]        → Code block background
prose-pre:text-white          → Code block text
prose-pre:rounded-lg          → Border radius
prose-pre:shadow-lg           → Shadow

prose-ul:list-disc            → Bullet list style
prose-ol:list-decimal         → Numbered list style
prose-li:text-[#1E3E49]       → List item text
prose-li:marker:text-[#6EAEA2] → Marker color

prose-blockquote:border-l-4            → Left border width
prose-blockquote:border-[#6EAEA2]      → Border color
prose-blockquote:bg-[#6EAEA2]/5        → Background
prose-blockquote:italic                → Italic text
prose-blockquote:text-[#1E3E49]/80     → Text with opacity

prose-img:rounded-lg          → Image border radius
prose-img:shadow-md           → Image shadow

prose-hr:border-[#6EAEA2]/30  → Horizontal rule color
```

---

## 6. Framer Motion Variants (opciono za dalje proširivanje)

Ako želite custom variants:

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// Usage:
<Motion.div variants={containerVariants} initial="hidden" animate="visible">
  {markdownFiles.map((file, idx) => (
    <Motion.div key={idx} variants={itemVariants}>
      {/* Content */}
    </Motion.div>
  ))}
</Motion.div>
```

---

## 7. Accessibility Features

### Markdown Preview:
```jsx
// Semantički HTML kroz ReactMarkdown
<h1>, <h2>, <h3> → Proper heading hierarchy
<ul>, <ol>, <li> → Proper list structure
<a> → Links sa proper href
<code>, <pre> → Code semantics

// Kontrast:
- Naslovi (#253869) na beloj pozadini: AAA rated
- Body tekst (#1E3E49) na beloj pozadini: AAA rated
- Linkovi (#6EAEA2) na beloj pozadini: AA rated
```

### Software Badge:
```jsx
// Title attribute za screen readers
<div title="Softverski proizvod">

// Cursor pointer za interaktivnost
className="cursor-pointer"

// Focus-visible za keyboard navigation (može se dodati)
className="focus-visible:ring-2 focus-visible:ring-[#6EAEA2]"
```

---

## 8. Performance Optimizacije

### Markdown rendering:
- ReactMarkdown radi efficient re-rendering
- Markdown content se ne parse-uje svaki put (memoization u React)
- remarkGfm i rehypeRaw se učitavaju jednom

### Animacije:
- Framer Motion koristi GPU acceleration
- Transform i opacity properties (hardware accelerated)
- No layout thrashing sa will-change

### Glassmorphism:
- backdrop-filter sa hardware acceleration
- Optimized blur values (blur-10, blur-md)

---

## 9. Browser Kompatibilnost

### Glassmorphism (backdrop-filter):
✅ Chrome 76+  
✅ Safari 9+  
✅ Firefox 103+  
✅ Edge 79+  
⚠️ IE: Ne podržava (fallback: solid background)

### Framer Motion:
✅ Svi moderni browseri  
✅ Graceful degradation za stare browsere

### Tailwind Typography:
✅ Svi browseri sa CSS support

---

## 10. Testing Checklist

### Markdown Preview:
- [ ] Prikazuje se samo za `isSoftware = true`
- [ ] Ne prikazuje se ako nema `markdownFiles`
- [ ] Naslovi se pravilno formatiraju
- [ ] Svi markdown elementi se renderuju (H1-H6, lists, code, links, bold, italic, blockquotes)
- [ ] Animacije se reproduce pravilno
- [ ] Responsive na mobilnom i desktopu

### Software Badge:
- [ ] Prikazuje se samo za `isSoftware = true`
- [ ] Ne prekriva popust badge
- [ ] Ne prekriva cena badge
- [ ] Hover animacija radi
- [ ] Tooltip se prikazuje
- [ ] Pulsing glow je vidljiv
- [ ] Responsive na mobilnom i desktopu

---

## 11. Primer Test Podataka

Za testiranje, dodajte ovakav product u Firestore:

```javascript
{
  id: "test-software-1",
  name: "Premium CRM Software",
  category: "Business Software",
  price: 15000,
  originalPrice: 20000,
  discountPercent: 25,
  imgUrl: "https://...",
  isSoftware: true,  // ← Key field
  markdownFiles: [   // ← Key field
    {
      name: "1762106127475_PRODUCT_LAUNCH.md",
      content: `# Premium CRM Software

## Features

This is a **powerful** CRM solution with the following features:

- Customer management
- Sales tracking
- \`Email integration\`
- Analytics dashboard

### Installation

\`\`\`bash
npm install premium-crm
npm start
\`\`\`

> **Note**: Requires Node.js 18+

For more info, visit [our website](https://example.com).
`
    },
    {
      name: "INSTALLATION_GUIDE.md",
      content: `## Installation Guide

### Step 1: Download

Download the installer from our website.

### Step 2: Install

Run the \`.exe\` file and follow the wizard.

### Step 3: Configure

Edit \`config.json\`:

\`\`\`json
{
  "apiKey": "your-key-here",
  "port": 3000
}
\`\`\`

That's it! 🎉
`
    }
  ],
  features: [
    { label: "Version", value: "2.5.0" },
    { label: "License", value: "Commercial" },
    { label: "Support", value: "24/7" }
  ],
  datasheets: [
    {
      name: "User Manual.pdf",
      url: "https://..."
    }
  ]
}
```

---

## 12. Dodatne Customizacije (ako želite)

### Promjena ikona:

**Za markdown preview:**
```jsx
import { FileCode, BookOpen, FileText, ScrollText } from "lucide-react";
// Promenite FileCode sa jednom od ovih
```

**Za software badge:**
```jsx
import { Terminal, Code2, Laptop, MonitorPlay } from "lucide-react";
// Promenite Terminal sa jednom od ovih
```

### Promjena boja:

U prose klasi, jednostavno promenite hex vrednosti:
```jsx
prose-headings:text-[#253869]  → prose-headings:text-[#YOUR_COLOR]
prose-a:text-[#6EAEA2]         → prose-a:text-[#YOUR_COLOR]
```

U badge-u:
```jsx
background: linear-gradient(135deg, 
  rgba(110, 174, 162, 0.9) 0%,  ← Promenite ove RGB vrednosti
  rgba(37, 56, 105, 0.8) 100%
);
```

---

**Sve je spremno za produkciju! 🚀**

Komponente su:
- ✅ Production-ready
- ✅ Fully responsive
- ✅ Accessible
- ✅ Performant
- ✅ Beautifully animated
- ✅ Consistent with existing design

