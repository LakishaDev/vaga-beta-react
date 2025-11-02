// src/components/AdminPanel/ProductModal.jsx
// ===============================================================================
// PRODUCT MODAL COMPONENT (MOBILE)
// ===============================================================================
// 
// @component ProductModal
// @description Modal za prikaz opcija proizvoda na mobilnim uređajima
// @version 2.0
// @lastmodified 2025-11-02
// 
// FUNKCIONALNOSTI:
// ================
// ✅ Prikaz proizvoda sa slikom i cenom
// ✅ Akcije - izmeni i obriši
// ✅ Backdrop blur efekat
// ✅ Samo za mobile uređaje (lg:hidden)
// 
// ===============================================================================

import ProgressiveImage from "../UI/ProgressiveImage.jsx";

/**
 * ProductModal Component
 * @param {Object} props
 * @param {Object} props.product - Proizvod za prikaz
 * @param {Function} props.formatPrice - Funkcija za formatiranje cene
 * @param {Function} props.onClose - Callback za zatvaranje
 * @param {Function} props.onEdit - Callback za edit
 * @param {Function} props.onDelete - Callback za delete
 */
export default function ProductModal({
  product,
  formatPrice,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
        <div className="text-center">
          <ProgressiveImage
            src={product.imgUrl}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 shadow-lg"
          />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-2">{product.category}</p>
          <p className="font-bold text-green-600 text-2xl mb-6">
            {product.hiddenPrice
              ? formatPrice(product.hiddenPrice) + " RSD (skrivena)"
              : product.price !== null
              ? formatPrice(product.price) + " RSD"
              : "Nema cene"}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onEdit(product);
                onClose();
              }}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Izmeni proizvod
            </button>
            <button
              onClick={() => {
                onDelete(product);
                onClose();
              }}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Obriši proizvod
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 font-semibold"
            >
              Zatvori
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
