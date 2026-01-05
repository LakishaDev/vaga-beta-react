# User Management - Quick Reference Guide

## 🎯 Optimistični UI Pattern

### Kreiranje Korisnika

#### Staro ponašanje ❌
```
[Korisnik] Klikne "Kreiraj korisnika"
    ↓
[UI] Prikazuje loading... (blokirano)
    ↓
[Backend] Izvršava Cloud Function (2-3s)
    ↓
[UI] Modal se zatvara
    ↓
[UI] Lista se ažurira
```
**Trajanje**: 2-3 sekunde blokiranja

#### Novo ponašanje ✅
```
[Korisnik] Klikne "Kreiraj korisnika"
    ↓
[UI] Modal se zatvara ODMAH ⚡ (0ms)
    ↓
[UI] Korisnik se dodaje u listu ODMAH ⚡ (0ms)
    |
    └─► [Backend] Izvršava Cloud Function u pozadini
            |
            ├─ Success → 🍞 Toast: "Korisnik uspešno kreiran!"
            └─ Error → ↩️ Rollback + 🍞 Toast: Error poruka
```
**Trajanje percipiranog delaya**: 0ms ⚡

---

## 🔄 Operacije i njihov flow

### 1. CREATE (Dodavanje korisnika)

**User Experience:**
1. Popuni formu
2. Klikni "Kreiraj korisnika"
3. ⚡ Modal se zatvara odmah
4. ⚡ Korisnik se pojavljuje u listi
5. 🍞 Toast potvrđuje uspeh (ili greška)

**Tehnički flow:**
```javascript
handleCreateUser()
  → Add to UI with temp ID
  → Close modal
  → await createUser() [background]
      → Success: toast.success()
      → Error: Remove + toast.error()
```

---

### 2. UPDATE (Ažuriranje korisnika)

**User Experience:**
1. Izmeni podatke
2. Klikni "Sačuvaj izmene"
3. ⚡ Drawer se zatvara odmah
4. ⚡ Podaci se ažuriraju u tabeli
5. 🍞 Toast potvrđuje uspeh (ili greška)

**Tehnički flow:**
```javascript
handleUpdateUser()
  → Save original state
  → Update UI
  → Close drawer
  → await updateUser() [background]
      → Success: toast.success()
      → Error: Rollback + toast.error()
```

---

### 3. DELETE (Brisanje korisnika)

**User Experience:**
1. Klikni "Obriši"
2. Potvrdi brisanje (confirm dialog)
3. ⚡ Korisnik nestaje iz liste
4. 🍞 Toast potvrđuje uspeh (ili greška)

**Tehnički flow:**
```javascript
handleDeleteUser()
  → Confirm dialog
  → Save original state
  → Remove from UI
  → await deleteUser() [background]
      → Success: toast.success()
      → Error: Restore + toast.error()
```

---

### 4. TOGGLE ACTIVE (Promena statusa)

**User Experience:**
1. Klikni na status badge
2. ⚡ Status se menja odmah (zelena ↔ siva)
3. 🍞 Toast potvrđuje uspeh (ili greška)

**Tehnički flow:**
```javascript
handleToggleActive()
  → Save original state
  → Toggle UI status
  → await toggleUserActive() [background]
      → Success: toast.success()
      → Error: Rollback + toast.error()
```

---

### 5. CHANGE PASSWORD (Promena lozinke)

**User Experience:**
1. Klikni "Promeni lozinku"
2. Unesi novu lozinku
3. 🍞 Loading toast: "Promena lozinke..."
4. 🍞 Update toast: Success ili Error

**Tehnički flow:**
```javascript
handleChangePassword()
  → Show prompt
  → const loadingToast = toast.loading()
  → await changePassword() [background]
      → Success: toast.success(id: loadingToast)
      → Error: toast.error(id: loadingToast)
```

---

## 🍞 Toast Notifications

### Tipovi

| Tip | Ikona | Boja | Trajanje | Kada |
|-----|-------|------|----------|------|
| **Success** | ✅ | Zelena | 3s | Uspešna operacija |
| **Error** | ❌ | Crvena | 4s | Greška u operaciji |
| **Loading** | ⏳ | Plava | ∞ | Tokom operacije |

### Pozicija
```
┌─────────────────────────────────┐
│                          [Toast]│ ← top-right
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

---

## 🎨 Animacije

### Modal (Create)
```javascript
initial={{ opacity: 0, scale: 0.9, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.9, y: 20 }}
transition={{ type: "spring", damping: 25, stiffness: 300 }}
```
**Effect**: Fade in + scale up + slight bounce

### Drawer (Edit)
```javascript
initial={{ x: "100%" }}
animate={{ x: 0 }}
exit={{ x: "100%" }}
transition={{ type: "spring", damping: 25, stiffness: 250 }}
```
**Effect**: Slide from right with spring physics

### Stats Cards
```javascript
// Stagger effect
transition={{ delay: index * 0.1, duration: 0.3 }}
```
**Effect**: Cards appear one by one (0.1s delay between each)

### Table Rows
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.05 }}
```
**Effect**: Rows fade in sequentially

---

## 🖱️ data-lenis-prevent

Sprečava Lenis smooth scroll da utiče na scrollable oblasti unutar komponenti:

```html
<!-- Modal Form -->
<form data-lenis-prevent>...</form>

<!-- Drawer -->
<div data-lenis-prevent>...</div>

<!-- Table (horizontal scroll) -->
<div className="overflow-x-auto" data-lenis-prevent>...</div>
```

**Zašto?** Bez ovoga, Lenis bi "ukrao" scroll event i scroll bi bio spor/laggy u modalima.

---

## 🛡️ Error Boundary

Hvata React greške i prikazuje user-friendly poruku:

```jsx
<ErrorBoundary>
  <UserManagementTabContent />
</ErrorBoundary>
```

**Kada se aktivira:**
- Uncaught exception u render metodi
- Greška u lifecycle metodama
- Greška u children komponentama

**Šta prikazuje:**
- ❌ Error ikona
- 📝 User-friendly poruka
- 🔄 "Pokušaj ponovo" dugme
- 🐛 Stack trace (samo dev mode)

---

## 📊 Performance Metrics

| Operacija | Staro (blokirajuće) | Novo (optimistično) | Unapređenje |
|-----------|---------------------|---------------------|-------------|
| Create | 2-3s delay | 0ms perceived | ⚡ 100% |
| Update | 1-2s delay | 0ms perceived | ⚡ 100% |
| Delete | 1-2s delay | 0ms perceived | ⚡ 100% |
| Toggle | 0.5-1s delay | 0ms perceived | ⚡ 100% |

**Actual backend performance:** Nepromenjen
**Perceived performance:** ⚡ Drastično bolji

---

## 🧪 Kako testirati

### Test 1: Normalan flow (sa internetom)
```
1. Dodaj korisnika → Odmah se pojavljuje → Toast success ✅
2. Izmeni korisnika → Odmah se ažurira → Toast success ✅
3. Obriši korisnika → Odmah nestaje → Toast success ✅
```

### Test 2: Error scenario (bez interneta)
```
1. Ugasi internet
2. Dodaj korisnika → Odmah se pojavljuje
3. Nakon 5-10s → Korisnik nestaje → Toast error ❌
```
**Rezultat:** UI se gracefully vraća na prethodno stanje

### Test 3: Scroll test
```
1. Otvori modal/drawer
2. Scroll unutar modala → Treba biti glatko
3. Scroll background stranice → Treba biti blokiran
```
**Rezultat:** data-lenis-prevent radi kako treba

---

## 💡 Best Practices

### ✅ DO
- Uvek čuvaj original state pre optimističkog update-a
- Implementiraj rollback u catch bloku
- Prikaži toast nakon backend odgovora
- Koristi loading states za submit dugmad
- Dodaj data-lenis-prevent na scrollable oblasti

### ❌ DON'T
- Ne blokiraj UI dok čekaš backend
- Ne zaboravi rollback na error
- Ne ostavi korisnika bez feedback-a
- Ne dozvoli submit više puta (disabled state)
- Ne ignoriši errors (uvek prikaži toast)

---

## 🚀 Budući razvoj

Moguća poboljšanja:
1. **Offline support** - Čuvaj operacije dok nema neta, sync later
2. **Batch operations** - Omogući multiple operacije odjednom
3. **Undo/Redo** - Implementiraj "Vrati radnju" funkcionalnost
4. **Optimistic search** - Filter/search bez čekanja backend-a
5. **Background sync indicator** - Prikaži broj pending operacija

---

**Verzija:** 1.0
**Datum:** 2026-01-05
**Status:** ✅ Production Ready
