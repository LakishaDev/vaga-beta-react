// src/components/AdminPanel/DeleteConfirmModal.jsx
// ===============================================================================
// DELETE CONFIRM MODAL COMPONENT
// ===============================================================================
//
// @component DeleteConfirmModal
// @description Modal za potvrdu brisanja proizvoda
// @version 2.0
// @lastmodified 2025-11-02
//
// FUNKCIONALNOSTI:
// ================
// ✅ Prikaz proizvoda za potvrdu brisanja
// ✅ Glassmorphism efekat
// ✅ Akcije - otkaži i obriši
//
// ===============================================================================

/**
 * DeleteConfirmModal Component
 * @param {Object} props
 * @param {Object} props.product - Proizvod za brisanje
 * @param {Function} props.formatPrice - Funkcija za formatiranje cene
 * @param {Function} props.onCancel - Callback za otkazivanje
 * @param {Function} props.onConfirm - Callback za potvrdu brisanja
 */
export default function DeleteConfirmModal({
  product,
  formatPrice,
  onCancel,
  onConfirm,
}) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-white/20 backdrop-blur-md backdrop-saturate-150"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px) saturate(180%)",
        }}
        onClick={onCancel}
      />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-neutral-border animate-scale-up max-w-md w-full mx-4">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-text-primary">
          Potvrda brisanja
        </h3>
        <p className="text-text-muted mb-2 text-center text-sm sm:text-base">
          Da li ste sigurni da želite da obrišete proizvod "{product.name}"?
        </p>
        <p className="font-bold text-brand-primary text-lg mb-6 text-center">
          {product.hiddenPrice
            ? formatPrice(product.hiddenPrice) + " RSD (skrivena)"
            : product.price !== null
              ? formatPrice(product.price) + " RSD"
              : "Nema cene"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all duration-300 font-medium"
          >
            Otkaži
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            className="px-6 py-3 bg-error text-white hover:brightness-95 rounded-xl transition-all duration-300 font-medium hover:scale-105"
          >
            Obriši
          </button>
        </div>
      </div>
    </div>
  );
}
