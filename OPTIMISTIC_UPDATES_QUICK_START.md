# Optimistic Updates - Quick Start Guide

## 🚀 Kako Koristiti

### U Komponenti

```javascript
import { useLicenseOptimistic } from '../../../hooks/useLicenseOptimistic';

function YourComponent() {
  // 1. Koristi hook
  const {
    licenses,       // Lista licenci
    loading,        // Loading status
    operations: {
      createLicense,
      updateLicense,
      blockLicense,
      unblockLicense,
      resetHardware,
      extendLicense,
      convertTrialToPaid,
    }
  } = useLicenseOptimistic();

  // 2. Pozovi operacije direktno - optimistic updates su automatski!
  const handleBlock = async (id) => {
    const success = await blockLicense(id);
    // UI se već promenio! ✨
    if (success) {
      // Dodatna logika ako treba
    }
  };

  return (
    <div>
      {licenses.map(license => (
        <div key={license.id}>
          {license.licenseKey}
          <button onClick={() => handleBlock(license.id)}>
            Block
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 📖 Sve Operacije

### 1. Create License
```javascript
await createLicense({
  licenseKey: "XXXX-XXXX",
  clientName: "John Doe",
  clientEmail: "john@example.com",
  licenseType: "premium",
  maxActivations: 1,
  expiresAt: "2025-12-31",
  isTrial: false
});
// ✅ Licenca se odmah pojavljuje u listi
```

### 2. Update License
```javascript
await updateLicense(licenseId, { 
  autoRenew: true,
  clientName: "New Name"
});
// ✅ Promene se odmah vide
```

### 3. Block License
```javascript
await blockLicense(licenseId, "Payment failed");
// ✅ Status badge se odmah menja u "Blocked"
```

### 4. Unblock License
```javascript
await unblockLicense(licenseId);
// ✅ Status badge se odmah menja u "Active"
```

### 5. Reset Hardware
```javascript
await resetHardware(licenseId);
// ✅ Hardware ID indikator odmah nestaje
```

### 6. Extend License
```javascript
await extendLicense(licenseId, 30); // 30 dana
// ✅ Expiry date se odmah ažurira
```

### 7. Convert Trial to Paid
```javascript
await convertTrialToPaid(licenseId, {
  orderId: "ORDER-123",
  amount: 99.99
});
// ✅ Trial badge odmah nestaje
```

## ⚙️ Sa Filterima

```javascript
// Filter po statusu
const { licenses } = useLicenseOptimistic({ 
  status: "active" 
});

// Filter po trial
const { licenses } = useLicenseOptimistic({ 
  isTrial: true 
});
```

## 🎯 Best Practices

### ✅ DOBRO
```javascript
// Koristi hook operacije
const { operations } = useLicenseOptimistic();
await operations.blockLicense(id);
```

### ❌ LOŠE
```javascript
// Ne pozivaj direktno cloud functions
import { adminBlockLicense } from '../services/licenseService';
await adminBlockLicense(id); // ❌ Nema optimistic updates!
```

## 🔍 Debugging

```javascript
const {
  licenses,
  loading,
  operations
} = useLicenseOptimistic();

console.log('Licenses:', licenses);
console.log('Loading:', loading);

// Ako operacija ne uspe, hook automatski:
// 1. Rollback-uje UI
// 2. Prikazuje error notifikaciju
// 3. Vraća false
const success = await operations.blockLicense(id);
if (!success) {
  console.log('Operation failed, already rolled back');
}
```

## 🎨 UI Patterns

### Loading State
```javascript
const { loading } = useLicenseOptimistic();

if (loading) {
  return <Spinner />;
}
```

### Success Handling
```javascript
const handleBlock = async (id) => {
  const success = await blockLicense(id);
  if (success) {
    closeModal();  // Zatvori modal samo ako je uspelo
  }
  // Error je automatski prikazan notifikacijom!
};
```

## 📚 Više Informacija

- **Puna dokumentacija:** `OPTIMISTIC_UPDATES_DOKUMENTACIJA.md`
- **Implementation details:** `OPTIMISTIC_UPDATES_IMPLEMENTATION.md`
- **Hook source:** `src/hooks/useLicenseOptimistic.js`
- **Primer upotrebe:** `src/pages/admin/licensing/LicensesPage.jsx`

## 🆘 Troubleshooting

### Problem: Operacija ne radi
**Rešenje:** Proveri da li koristiš hook operaciju umesto direktnog cloud function poziva

### Problem: UI se ne rollback-uje
**Rešenje:** Hook automatski rollback-uje. Proveri browser console za error log.

### Problem: Notifikacije se ne prikazuju
**Rešenje:** Proveri da je `SnackbarProvider` wrapper prisutan u App.jsx

---

**Pitanja?** Pogledaj punu dokumentaciju ili kontaktiraj eVaga tim.
