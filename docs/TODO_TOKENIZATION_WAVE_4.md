# 🎨 TODO: Tokenization Wave 4 - Admin Licensing Components

**Status**: Planirana, nije početna  
**Datum kreiranja**: 14. februar 2026.  
**Preostalo**: ~40-50 legacy color instanci u 6 admin/licensing fajlova

---

## 📊 Preostali Fajlovi

### 1. **UserTable.jsx** (~2 instance)

**Lokacija**: `src/components/admin/licensing/UserTable.jsx`

**Legacy colors**:

- **Line 286**: Avatar gradient circle
  - `from-bluegreen to-sheen` → `from-brand-secondary to-brand-accent`

---

### 2. **UserMobileCard.jsx** (~2 instance)

**Lokacija**: `src/components/admin/licensing/UserMobileCard.jsx`

**Legacy colors**:

- **Line 40**: Avatar gradient circle
  - `from-bluegreen to-sheen` → `from-brand-secondary to-brand-accent`

---

### 3. **UserManagementTab.jsx** (~10 instanci)

**Lokacija**: `src/components/admin/licensing/UserManagementTab.jsx`

**Legacy colors**:

- **Line 82**: Tab button active state (3 instances)
  - `from-bluegreen to-sheen` → `from-brand-secondary to-brand-accent`
  - `shadow-bluegreen/25` → `shadow-brand-secondary/25`
- **Line 275, 276**: Loading spinner borders (2 instances)
  - `border-bluegreen/20` → `border-brand-secondary/20`
  - `border-bluegreen` → `border-brand-secondary`
- **Line 343**: Search input focus state (2 instances)
  - `ring-bluegreen/20` → `ring-brand-secondary/20`
  - `border-bluegreen` → `border-brand-secondary`
- **Line 352**: Add user button (3 instances)
  - `from-bluegreen to-sheen` → `from-brand-secondary to-brand-accent`
  - `shadow-bluegreen/25` → `shadow-brand-secondary/25`

---

### 4. **UserEditDrawer.jsx** (~10 instanci)

**Lokacija**: `src/components/admin/licensing/UserEditDrawer.jsx`

**Legacy colors**:

- **Line 155**: Input focus state (2 instances)
  - `ring-bluegreen/20` → `ring-brand-secondary/20`
  - `border-bluegreen` → `border-brand-secondary`
- **Line 202**: Role selection card active state (2 instances)
  - `border-bluegreen` → `border-brand-secondary`
  - `bg-bluegreen/5` → `bg-brand-secondary/5`
- **Line 209, 216**: Role selection icons (2 instances)
  - `text-bluegreen` → `text-brand-secondary`
- **Line 287**: Checkbox styling (2 instances)
  - `text-bluegreen` → `text-brand-secondary`
  - `focus:ring-bluegreen` → `focus:ring-brand-secondary`
- **Line 324**: Submit button (3 instances)
  - `from-bluegreen to-sheen` → `from-brand-secondary to-brand-accent`
  - `shadow-bluegreen/25` → `shadow-brand-secondary/25`

---

### 5. **UserCreateModal.jsx** (~15 instanci)

**Lokacija**: `src/components/admin/licensing/UserCreateModal.jsx`

**Legacy colors**:

- **Line 163, 187, 212, 238**: Input fields focus states (8 instances total)
  - `ring-bluegreen/20` → `ring-brand-secondary/20`
  - `border-bluegreen` → `border-brand-secondary`
- **Line 273**: Role selection active state (2 instances)
  - `border-bluegreen` → `border-brand-secondary`
  - `bg-bluegreen/5` → `bg-brand-secondary/5`
- **Line 280, 287**: Role selection icons (2 instances)
  - `text-bluegreen` → `text-brand-secondary`
- **Line 358**: Checkbox styling (2 instances)
  - `text-bluegreen` → `text-brand-secondary`
  - `focus:ring-bluegreen` → `focus:ring-brand-secondary`
- **Line 395**: Create button (3 instances)
  - `from-bluegreen to-sheen` → `from-brand-secondary to-brand-accent`
  - `shadow-bluegreen/25` → `shadow-brand-secondary/25`

---

### 6. **ResponsiveModal.jsx** (~5 instanci)

**Lokacija**: `src/components/admin/licensing/ResponsiveModal.jsx`

**Legacy colors**:

- **Line 73**: Modal backdrop overlay
  - `bg-charcoal/40` → `bg-text-primary/40`
- **Line 121**: Top-right decorative gradient (2 instances)
  - `from-bluegreen/30 to-sheen/20` → `from-brand-secondary/30 to-brand-accent/20`
- **Line 122**: Bottom-left decorative gradient (2 instances)
  - `from-sheen/30 to-bluegreen/20` → `from-brand-accent/30 to-brand-secondary/20`

---

### 7. **Aplikacija.jsx** (NIZAK PRIORITET - samo dokumentacija)

**Lokacija**: `src/pages/Aplikacija.jsx`

**Legacy colors**:

- **Line 8**: Komentar sa hex vrednostima legacy pallete (8 upomena u jednoj liniji)
  - Ovo je **dokumentacioni komentar**, ne aktivni kod
  - Može ostati ili se ažurirati da referencira nove token nazive

---

## 🎯 Design Token Mapiranja

### Brand Colors

- `bluegreen` → `brand-secondary` (#91CEC1)
- `sheen` → `brand-accent` (#6EAEA2)

### Text Colors

- `charcoal` → `text-primary` (#2F5363)

### Tipski Paterni

**Avatar Gradijenti**:

```jsx
// Pre:
className = "bg-gradient-to-br from-bluegreen to-sheen";

// Posle:
className = "bg-gradient-to-br from-brand-secondary to-brand-accent";
```

**Input Focus States**:

```jsx
// Pre:
className = "focus:ring-2 focus:ring-bluegreen/20 focus:border-bluegreen";

// Posle:
className =
  "focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary";
```

**Button Gradijenti sa Shadow**:

```jsx
// Pre:
className =
  "bg-gradient-to-r from-bluegreen to-sheen hover:shadow-lg hover:shadow-bluegreen/25";

// Posle:
className =
  "bg-gradient-to-r from-brand-secondary to-brand-accent hover:shadow-lg hover:shadow-brand-secondary/25";
```

**Modal Backdrop**:

```jsx
// Pre:
className = "bg-charcoal/40";

// Posle:
className = "bg-text-primary/40";
```

---

## 📝 Plan Izvršenja (kada se nastavi)

### Batch 1: Avatar komponente (brzo)

1. UserTable.jsx (line 286)
2. UserMobileCard.jsx (line 40)

### Batch 2: UserManagementTab.jsx (srednje)

1. Tab buttons (line 82)
2. Loading spinners (lines 275-276)
3. Search input (line 343)
4. Add user button (line 352)

### Batch 3: Form modals (složenije - više instanci)

1. UserEditDrawer.jsx (lines 155, 202, 209, 216, 287, 324)
2. UserCreateModal.jsx (lines 163, 187, 212, 238, 273, 280, 287, 358, 395)

### Batch 4: ResponsiveModal.jsx (dekoracije)

1. Modal backdrop (line 73)
2. Decorative gradients (lines 121-122)

### Batch 5: Final validation

1. `npm run build` - production build
2. `get_errors` - lint check svih fajlova
3. Final grep search za preostale legacy boje

---

## ✅ Završeni Talasi

### Wave 1 (Prethodni sesija)

✅ Shop, Auth, Cart, Profile  
✅ Core admin components

### Wave 2 (Nedavno završeno)

✅ OrdersPage.jsx (100+ instances)  
✅ LicensesPage.jsx (40+ instances)  
✅ EVagaDesktop.jsx (41+ instances)  
✅ MarkdownPreview.jsx (50+ instances)  
✅ TypingText, Snackbar, ProgressiveImage, FloatingLabelInput

### Wave 3 (Upravo završeno)

✅ LepModal.jsx (3 decorative circles)  
✅ AnimatedSelect.jsx (11 instances)  
✅ AnimatedInput.jsx (4 instances)  
✅ Loader.jsx (5 instances)  
✅ ErrorBoundary.jsx (4 instances)  
✅ Build validation: 8.70s, 0 errors

---

## 🔍 Kada Nastaviti

**Komanda za početak**:

```bash
# Prvo pregledaj ovaj dokument
cat docs/TODO_TOKENIZATION_WAVE_4.md

# Započni Wave 4
# (Agent će pročitati ovaj fajl i sistematski obraditi sve fajlove)
```

**Očekivano trajanje**: ~20-30 minuta  
**Broj fajlova**: 6-7 fajlova  
**Broj izmena**: ~40-50 replacements  
**Build validacija**: Nakon svake batch grupe

---

**Kreirano**: 14. februar 2026.  
**Zadnji ažurirano**: Wave 3 završen sa 0 errors
