# Design System Testing Guide

## 🚀 Kako pristupiti Demo stranici

Demo stranica je dostupna na: **`http://localhost:3000/design-system-demo`**

Takođe možete pristupiti preko Navbar menija - kliknite na **"Design"** link (ikona palete).

---

## ✅ Testing Checklist

### 1. Visual Testing - Desktop

**Rezolucije za testiranje:**

- [ ] 1920px (Full HD)
- [ ] 1440px (MacBook Pro 16")
- [ ] 1280px (Standard desktop)
- [ ] 1024px (Tablet landscape)

**Šta proveriti:**

- [ ] Sve boje se pravilno prikazuju (Cobalt Navy paleta)
- [ ] Tipografija je čitljiva (Inter za body, Manrope za headings)
- [ ] Spacing je konzistentan (8pt grid)
- [ ] Shadows i border radius pravilno renderovani
- [ ] Card hover efekti rade smooth
- [ ] Button hover states rade pravilno

---

### 2. Visual Testing - Mobile & Tablet

**Rezolucije za testiranje:**

- [ ] 375px (iPhone SE, small phones)
- [ ] 390px (iPhone 12/13/14/15)
- [ ] 414px (iPhone Plus models)
- [ ] 768px (iPad portrait)
- [ ] 834px (iPad Air landscape)

**Kako testirati:**

1. Otvorite Chrome DevTools (`F12`)
2. Kliknite na toggle device toolbar (`Ctrl+Shift+M`)
3. Izaberite uređaj ili unesite custom dimenzije
4. Testirajte scroll, tap, i gesture interakcije

**Šta proveriti:**

- [ ] Stepper se prikazuje pravilno na mobilnom
- [ ] Cards se prilagođavaju na grid (1 column na mobile, 2-3 na tablet)
- [ ] Buttons su dovoljno veliki za touch (minimum 44x44px)
- [ ] Modal se prikazuje full screen na malom ekranu
- [ ] Inputs imaju dovoljno prostora za touch target
- [ ] Hamburger menu radi pravilno

---

### 3. Keyboard Navigation Testing

**Testovi:**

- [ ] **Tab Navigation**: Pritisnite `Tab` i proverite da focus ide redom kroz sve interaktivne elemente
- [ ] **Shift+Tab**: Reverse tab navigation radi
- [ ] **Enter**: Aktivira dugmad i linkove
- [ ] **Space**: Aktivira dugmad (ali ne linkove - to je očekivano)
- [ ] **Esc**: Zatvara modal dialog
- [ ] **Arrow Keys**: U Stepper-u, `←` i `→` navigiraju između koraka

**Fokus Ring Provera:**

- [ ] Svi dugmad imaju vidljiv fokus ring
- [ ] Svi input-i imaju vidljiv fokus ring
- [ ] Linkovi imaju vidljiv fokus ring
- [ ] Modal fokus je "zarobljen" (ne može tab-ovati van modala)
- [ ] Fokus ring boja je brand-secondary (#1D4ED8)

**Kako testirati:**

1. Nemojte koristiti miš - samo tastaturu!
2. Pritisnite `Tab` od vrha stranice
3. Proverite da vidite gde je fokus u svakom momentu
4. Testirajte sve interakcije samo sa tastaturom

---

### 4. Screen Reader Testing

**Tools:**

- **Windows**: [NVDA](https://www.nvaccess.org/) (besplatno)
- **Windows**: JAWS (komercijalno)
- **macOS**: VoiceOver (ugrađeno - `Cmd+F5`)
- **Chrome Extension**: [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn)

**Šta testirati:**

- [ ] **Buttons**: Screen reader čita tekst dugmeta + stanje (disabled, loading)
- [ ] **Inputs**: Screen reader čita label + error poruke + helper text
- [ ] **Modal**: Screen reader najavljuje otvaranje i naziv dialoga
- [ ] **Stepper**: Screen reader čita trenutni korak i broj koraka
- [ ] **Badges**: Screen reader čita sadržaj badge-a
- [ ] **Cards**: Screen reader logično prolazi kroz card strukturu
- [ ] **Images**: Alt text je prisutan i smislen

**Osnovne NVDA komande:**

- `NVDA + Down Arrow`: Čitaj sledeću liniju
- `Tab`: Skok na sledeći interaktivni element
- `NVDA + T`: Čitaj naslov
- `NVDA + Space`: Aktiviraj element

---

### 5. Color Contrast Testing

**Tools za proveru:**

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (App)](https://www.tpgi.com/color-contrast-checker/)
- Chrome DevTools (Lighthouse report)

**Minimalni standardi (WCAG AA):**

- Normal text (< 18px): **4.5:1**
- Large text (≥ 18px ili ≥ 14px bold): **3:1**
- UI components (icons, borders): **3:1**

**Naša paleta (već verifikovana):**

- ✅ White on Primary (#0B3A8D): **10.48:1** (AAA)
- ✅ White on Secondary (#1D4ED8): **6.70:1** (AA)
- ✅ White on Accent (#0E7490): **5.36:1** (AA)
- ✅ Text Primary on Background: **21:1** (AAA)

**Dodatno testirati:**

- [ ] Success badge kontrast
- [ ] Warning badge kontrast
- [ ] Error badge kontrast
- [ ] Info badge kontrast
- [ ] Text secondary na surface

---

### 6. Browser Compatibility Testing

**Browsers za testiranje:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS/iOS - ako imate pristup)
- [ ] Edge (latest)

**Šta proveriti:**

- [ ] Sve komponente se renderuju identično
- [ ] Google Fonts se učitavaju pravilno
- [ ] CSS Grid i Flexbox rade
- [ ] Transitions i animations rade smooth
- [ ] Focus states rade u svim browser-ima
- [ ] Modal backdrop blur radi (može biti različit u Safari)

---

### 7. Performance Testing

**Chrome DevTools - Lighthouse:**

1. Otvorite DevTools (`F12`)
2. Kliknite na "Lighthouse" tab
3. Izaberite kategorije:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Kliknite "Analyze page load"

**Target skorovi:**

- [ ] Performance: **90+**
- [ ] Accessibility: **95+**
- [ ] Best Practices: **95+**
- [ ] SEO: **90+** (CSR limitacija, SSR će rešiti)

**Core Web Vitals (očekivane vrednosti):**

- [ ] LCP (Largest Contentful Paint): **< 2.5s**
- [ ] FID/INP (First Input Delay/Interaction to Next Paint): **< 200ms**
- [ ] CLS (Cumulative Layout Shift): **< 0.1**

**Kako testirati CWV:**

1. Lighthouse report prikazuje LCP, CLS
2. Ili koristite [web.dev/measure](https://web.dev/measure/)
3. Ili Chrome DevTools > Performance > Record

---

### 8. Accessibility Audit Tools

**Automatski alati:**

1. **axe DevTools Extension** (preporuka)
   - [Chrome Extension](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
   - Kako: F12 > axe DevTools tab > Scan
   - Target: **0 critical issues**, **0 serious issues**

2. **WAVE Extension**
   - [Chrome Extension](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
   - Vizualni prikaz accessibility problema

3. **Lighthouse** (već pomenuto)
   - Accessibility score 95+

**Ručni accessibility testovi:**

- [ ] Svi interactive elementi su dostupni tastaturom
- [ ] Skip to content link (nije implementiran - možda dodati)
- [ ] Headings hijerarhija (h1 > h2 > h3)
- [ ] Alt text na slikama
- [ ] Form labels povezani sa input-ima
- [ ] Error poruke se čitaju screen reader-om
- [ ] Fokus management u modal-u

---

### 9. User Experience (UX) Testing

**Intuitivnost:**

- [ ] Da li su button pozivi na akciju jasni?
- [ ] Da li je stepper lako razumeti i koristiti?
- [ ] Da li error poruke pomažu korisniku?
- [ ] Da li hover states jasno pokazuju šta je klikabilno?

**Konzistentnost:**

- [ ] Da li su svi primary buttons iste boje?
- [ ] Da li su svi spacing values konzistentni (8pt grid)?
- [ ] Da li svi input-i izgledaju isto?
- [ ] Da li svi card-ovi prate isti stil?

**Responsive ponašanje:**

- [ ] Da li se layout prirodno prilagođava?
- [ ] Da li je tekst čitljiv na svim veličinama?
- [ ] Da li su touch targeti dovoljno veliki?

---

### 10. Edge Cases & Error States

**Testirati:**

- [ ] **Dugačak tekst u Input**: Šta se dešava sa ultra dugim tekstom?
- [ ] **Prazno stanje**: Prazni Card-ovi, Input-i bez vrednosti
- [ ] **Loading state**: Button sa loading spinner
- [ ] **Disabled state**: Disabled button, disabled input
- [ ] **Error state**: Input sa error porukom
- [ ] **Success validation**: Input sa success porukom (ako implementirano)
- [ ] **Veliki broj Badge-ova**: Wrap behavior
- [ ] **Modal overflow**: Veliki sadržaj u Modal-u (scroll radi?)
- [ ] **Stepper sa mnogo koraka**: Responsive na mobilnom?

---

## 🐛 Reporting Issues

Ako pronađete probleme, dokumentujte:

1. **Screenshot** ili screen recording
2. **Browser** i verzija (npr. Chrome 120)
3. **OS** (Windows 11, macOS, etc.)
4. **Rezolucija ekrana** ili device (iPhone 14, 1920x1080)
5. **Koraci za reprodukciju**
6. **Očekivano ponašanje** vs **trenutno ponašanje**

---

## ✨ Quick Test Script (CLI)

Za brzo testiranje, možete pokrenuti:

```bash
# Dev server
npm run dev

# Build za production
npm run build

# Preview production build
npm run preview

# Lighthouse CI (ako konfigurisano)
npm run lighthouse
```

---

## 📚 Resursi

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Chrome DevTools Accessibility](https://developer.chrome.com/docs/devtools/accessibility/reference/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)

---

**Verzija:** 1.0.0  
**Datum:** Februar 2026  
**Autor:** Vaga Beta Development Team  
**Status:** ✅ Ready for Testing
