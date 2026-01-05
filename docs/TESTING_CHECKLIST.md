# Testing Checklist - Optimistic UI Implementation

## ✅ Pre-Testing Setup

- [ ] Pokreni dev server: `npm run dev`
- [ ] Otvori browser i navigiraj na `/prodavnica/admin/licenses`
- [ ] Klikni na "Korisnici" tab
- [ ] Otvori Browser DevTools (F12)
- [ ] Otvori Network tab u DevTools

---

## 🧪 Test 1: CREATE USER (Normalan flow)

### Koraci:
1. [ ] Klikni na "Dodaj korisnika" dugme
2. [ ] Popuni formu:
   - Ime i prezime: "Test Korisnik"
   - Email: "test@example.com"
   - Lozinka: "test123"
   - Potvrdi lozinku: "test123"
   - Rola: User
   - Proizvodi: Izaberi oba
   - Aktivan: Da
3. [ ] Klikni "Kreiraj korisnika"

### Očekivano ponašanje:
- [ ] ⚡ Modal se zatvara **ODMAH** (< 100ms)
- [ ] ⚡ Novi korisnik se pojavljuje na **VRHU** liste odmah
- [ ] 🍞 Toast "Korisnik uspešno kreiran!" se pojavljuje nakon 1-2s
- [ ] ✅ Korisnik ostaje u listi (nema rollback-a)

### Provera u DevTools:
- [ ] Network tab prikazuje `adminCreateUser` Cloud Function call
- [ ] Status: 200 OK
- [ ] Response: `{ success: true, ... }`

---

## 🧪 Test 2: UPDATE USER (Normalan flow)

### Koraci:
1. [ ] Klikni na "⋮" (tri tačkice) pored korisnika
2. [ ] Klikni "Izmeni"
3. [ ] Promeni ime u "Test Korisnik Updated"
4. [ ] Promeni proizvode (dodaj/ukloni jedan)
5. [ ] Klikni "Sačuvaj izmene"

### Očekivano ponašanje:
- [ ] ⚡ Drawer se zatvara **ODMAH** (< 100ms)
- [ ] ⚡ Izmene se prikazuju u tabeli **ODMAH**
- [ ] 🍞 Toast "Korisnik uspešno ažuriran!" nakon 1-2s
- [ ] ✅ Izmene ostaju (nema rollback-a)

### Provera u DevTools:
- [ ] Network tab prikazuje `adminUpdateUser` Cloud Function call
- [ ] Status: 200 OK

---

## 🧪 Test 3: DELETE USER (Normalan flow)

### Koraci:
1. [ ] Klikni na "⋮" pored korisnika
2. [ ] Klikni "Obriši"
3. [ ] Potvrdi brisanje u confirm dialogu

### Očekivano ponašanje:
- [ ] ⚡ Korisnik nestaje iz liste **ODMAH**
- [ ] 🍞 Toast "Korisnik uspešno obrisan!" nakon 1-2s
- [ ] ✅ Korisnik ostaje obrisan (nema rollback-a)

### Provera u DevTools:
- [ ] Network tab prikazuje `adminDeleteUser` Cloud Function call
- [ ] Status: 200 OK

---

## 🧪 Test 4: TOGGLE ACTIVE STATUS (Normalan flow)

### Koraci:
1. [ ] Kreiraj novog korisnika (ako nema)
2. [ ] Klikni na status badge (Aktivan/Neaktivan)

### Očekivano ponašanje:
- [ ] ⚡ Status se menja **ODMAH** (zelena ↔ siva)
- [ ] 🍞 Toast "Korisnik aktiviran/deaktiviran!" nakon 0.5-1s
- [ ] ✅ Status ostaje promenjen (nema rollback-a)

### Provera u DevTools:
- [ ] Network tab prikazuje Firestore update
- [ ] Status: Uspešan

---

## 🧪 Test 5: CHANGE PASSWORD (Normalan flow)

### Koraci:
1. [ ] Klikni na "⋮" pored korisnika
2. [ ] Klikni "Promeni lozinku"
3. [ ] Unesi "newpass123" u prompt
4. [ ] Potvrdi

### Očekivano ponašanje:
- [ ] 🍞 Loading toast: "Promena lozinke..." se prikazuje odmah
- [ ] 🍞 Loading toast se zamenjuje sa "Lozinka uspešno promenjena!" nakon 1-2s
- [ ] ✅ Nema error-a

### Provera u DevTools:
- [ ] Network tab prikazuje `adminChangePassword` Cloud Function call
- [ ] Status: 200 OK

---

## 🧪 Test 6: ERROR SCENARIO - CREATE (Bez interneta)

### Koraci:
1. [ ] U DevTools, otvori Network tab
2. [ ] Klikni na "Offline" checkbox (simulira offline mode)
3. [ ] Pokušaj da kreiraš novog korisnika

### Očekivano ponašanje:
- [ ] ⚡ Modal se zatvara odmah
- [ ] ⚡ Korisnik se dodaje u listu odmah
- [ ] ⏳ Nakon 5-10s (network timeout)...
- [ ] ↩️ Korisnik **NESTAJE** iz liste (rollback)
- [ ] 🍞 Error toast: "Greška pri kreiranju korisnika"

### Provera u DevTools:
- [ ] Network tab prikazuje failed request (red color)
- [ ] Console može prikazivati error (normalno)

### Cleanup:
- [ ] Isključi "Offline" mode u DevTools

---

## 🧪 Test 7: SCROLL & data-lenis-prevent

### Test 7a: Modal Scroll
1. [ ] Otvori "Dodaj korisnika" modal
2. [ ] Scroll unutar modala (gore-dole)

**Očekivano:**
- [ ] ✅ Scroll unutar modala je **normalan** (ne Lenis smooth)
- [ ] ✅ Background stranica **NE** scrolluje

### Test 7b: Drawer Scroll
1. [ ] Otvori "Izmeni" drawer
2. [ ] Scroll unutar drawer-a

**Očekivano:**
- [ ] ✅ Scroll unutar drawer-a je **normalan**
- [ ] ✅ Background stranica **NE** scrolluje

### Test 7c: Table Horizontal Scroll
1. [ ] Zatvori modal/drawer
2. [ ] Ako je tabela široka, scroll horizontalno

**Očekivano:**
- [ ] ✅ Horizontal scroll radi normalno
- [ ] ✅ Page scroll je nezavisan

---

## 🧪 Test 8: ANIMATIONS

### Test 8a: Stats Cards (Stagger)
1. [ ] Refresh stranicu
2. [ ] Posmatraj stats kartice

**Očekivano:**
- [ ] ✅ Kartice se pojavljuju jedna po jedna (stagger effect)
- [ ] ✅ Delay: ~0.1s između svake

### Test 8b: Modal Animation
1. [ ] Otvori "Dodaj korisnika"
2. [ ] Zatvori sa X dugmetom

**Očekivano:**
- [ ] ✅ Modal fade-in + scale-up pri otvaranju
- [ ] ✅ Modal fade-out + scale-down pri zatvaranju
- [ ] ✅ Spring animation (mali bounce)

### Test 8c: Drawer Animation
1. [ ] Otvori "Izmeni" drawer
2. [ ] Zatvori

**Očekivano:**
- [ ] ✅ Drawer slide-in sa desna
- [ ] ✅ Drawer slide-out na desno
- [ ] ✅ Spring physics (smooth)

### Test 8d: Table Rows
1. [ ] Dodaj nekoliko korisnika
2. [ ] Posmatraj kako se pojavljuju u tabeli

**Očekivano:**
- [ ] ✅ Redovi se pojavljuju jedan po jedan (sequential fade-in)

### Test 8e: Empty State
1. [ ] Obriši sve korisnike
2. [ ] Posmatraj empty state

**Očekivano:**
- [ ] ✅ Empty state fade-in
- [ ] ✅ Ikona scale-up animation

---

## 🧪 Test 9: LOADING STATES

### Test 9a: Submit Button (Create)
1. [ ] Otvori "Dodaj korisnika"
2. [ ] Popuni formu
3. [ ] Posmatraj dugme tokom submit-a

**Očekivano:**
- [ ] ✅ Dugme prikazuje spinner tokom submit-a
- [ ] ✅ Tekst: "Kreiranje..." sa spinner-om
- [ ] ✅ Dugme je disabled (ne može se kliknuti opet)

### Test 9b: Submit Button (Edit)
1. [ ] Otvori "Izmeni"
2. [ ] Promeni nešto
3. [ ] Posmatraj dugme tokom submit-a

**Očekivano:**
- [ ] ✅ Dugme prikazuje spinner
- [ ] ✅ Tekst: "Čuvanje..." sa spinner-om
- [ ] ✅ Dugme je disabled

---

## 🧪 Test 10: ERROR BOUNDARY

### Način 1: Simuliraj grešku u dev mode
1. [ ] Dodaj `throw new Error("Test error")` na početak UserManagementTabContent komponente
2. [ ] Refresh stranicu

**Očekivano:**
- [ ] ✅ Error Boundary hvata grešku
- [ ] ✅ Prikazuje user-friendly poruku
- [ ] ✅ "Pokušaj ponovo" dugme je vidljivo
- [ ] ✅ Stack trace je vidljiv (dev mode)

### Način 2: Test "Pokušaj ponovo" dugme
1. [ ] Klikni "Pokušaj ponovo"

**Očekivano:**
- [ ] ✅ Error boundary se resetuje
- [ ] ✅ Komponenta se ponovo renderuje

### Cleanup:
- [ ] Ukloni `throw new Error()` liniju

---

## 🧪 Test 11: TOAST NOTIFICATIONS

### Test 11a: Pozicija
**Očekivano:**
- [ ] ✅ Toasts se pojavljuju u **top-right** uglu
- [ ] ✅ Multiple toasts stack-uju se vertikalno

### Test 11b: Styling
**Očekivano:**
- [ ] ✅ Success toast: Zelena ivica + zelena ikona
- [ ] ✅ Error toast: Crvena ivica + crvena ikona
- [ ] ✅ Loading toast: Plava spinner ikona
- [ ] ✅ Rounded corners + shadow

### Test 11c: Trajanje
1. [ ] Pokreni neku operaciju
2. [ ] Meri vreme trajanja toast-a

**Očekivano:**
- [ ] ✅ Success: ~3s
- [ ] ✅ Error: ~4s
- [ ] ✅ Loading: Dok se ne zameni sa success/error

### Test 11d: Auto-dismiss
**Očekivano:**
- [ ] ✅ Toast automatski nestaje nakon trajanja
- [ ] ✅ Fade-out animacija

---

## 🧪 Test 12: MULTIPLE CONCURRENT OPERATIONS

### Koraci:
1. [ ] Dodaj korisnika
2. [ ] Odmah nakon toga, dodaj još jednog
3. [ ] Zatim odmah izmeni prvog

**Očekivano:**
- [ ] ✅ Sve operacije se izvršavaju u pozadini
- [ ] ✅ UI ostaje odzivan
- [ ] ✅ Multiple toasts stack-uju se lepo
- [ ] ✅ Nema race condition-a

---

## 🧪 Test 13: FORM VALIDATION

### Test 13a: Create Modal
1. [ ] Otvori "Dodaj korisnika"
2. [ ] Ostavi sva polja prazna
3. [ ] Klikni "Kreiraj korisnika"

**Očekivano:**
- [ ] ✅ Modal se **NE** zatvara
- [ ] ✅ Validation errors se prikazuju crveno
- [ ] ✅ Nema optimistic update-a

### Test 13b: Password mismatch
1. [ ] Unesi različite lozinke u "Lozinka" i "Potvrdi lozinku"
2. [ ] Submit

**Očekivano:**
- [ ] ✅ Error: "Lozinke se ne poklapaju"

### Test 13c: Invalid email
1. [ ] Unesi "invalid-email" kao email
2. [ ] Submit

**Očekivano:**
- [ ] ✅ Error: "Email nije validan"

---

## 📊 Performance Test

### Metrika 1: Perceived Delay
1. [ ] Meri vreme od klika do UI update-a
2. [ ] Uporedi sa starim ponašanjem (ako imaš snimak)

**Očekivano:**
- [ ] ✅ < 100ms (instant)

### Metrika 2: Actual Backend Time
1. [ ] Proveri Network tab, vidi koliko traje Cloud Function

**Očekivano:**
- [ ] ✅ 1-3s (nepromenjeno, ali korisnik ne čeka)

---

## 🎯 Final Checklist

### User Experience
- [ ] ✅ UI je instant responsive
- [ ] ✅ Nema blokiranja tokom operacija
- [ ] ✅ Toast notifications daju feedback
- [ ] ✅ Rollback radi kod error-a
- [ ] ✅ Animacije su smooth i prijatne

### Technical
- [ ] ✅ Optimistic updates implementirani
- [ ] ✅ Error handling sa rollback
- [ ] ✅ data-lenis-prevent na svim scroll area-ma
- [ ] ✅ Error boundary postavljen
- [ ] ✅ Toaster konfigurisan
- [ ] ✅ Loading states na dugmadima

### Edge Cases
- [ ] ✅ Offline mode - Rollback radi
- [ ] ✅ Multiple operacije - Nema race conditions
- [ ] ✅ Validation - Ne dozvoljava invalid submit
- [ ] ✅ Scroll conflicts - Rešeni sa data-lenis-prevent

---

## 🐛 Known Issues (ako pronađeš)

Dokumentuj ovde ako nešto ne radi:

```
Issue #1:
- Opis:
- Steps to reproduce:
- Expected:
- Actual:
- Priority: Low/Medium/High
```

---

## ✅ Sign-off

**Tester:** _________________  
**Datum:** _________________  
**Status:** Pass / Fail  
**Notes:**

---

**Total Tests:** 13 categories, ~80+ individual checks
**Estimated Time:** 30-45 minuta za kompletno testiranje
