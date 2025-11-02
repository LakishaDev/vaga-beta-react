// src/components/AdminPanel/ProductList.jsx
// ===============================================================================
// PRODUCT LIST COMPONENT
// ===============================================================================
// 
// @component ProductList
// @description Prikaz liste proizvoda - desktop tabela, mobile kartice
// @version 2.0
// @lastmodified 2025-11-02
// 
// FUNKCIONALNOSTI:
// ================
// ✅ Desktop - tabela sa slikama, info i akcijama
// ✅ Mobile - kartice sa touch interakcijom
// ✅ Formatiranje cena sa separatorom
// ✅ Sakrivene cene badge
// ✅ Responsive dizajn
// 
// ===============================================================================

import ProgressiveImage from "../UI/ProgressiveImage.jsx";

/**
 * ProductList Component
 * @param {Object} props
 * @param {Array} props.products - Array proizvoda
 * @param {Function} props.formatPrice - Funkcija za formatiranje cene
 * @param {Function} props.onEdit - Callback za edit (product)
 * @param {Function} props.onDelete - Callback za delete (product)
 * @param {Function} props.onProductClick - Callback za klik na mobile karticu (product)
 * @param {boolean} props.allowed - Da li je user admin (za prikaz skrivenih cena)
 */
export default function ProductList({
  products = [],
  formatPrice,
  onEdit,
  onDelete,
  onProductClick,
  allowed = false,
}) {
  if (products.length === 0) {
    return (
      <div className="text-center text-xl text-slate-400 py-12 bg-gray-50 rounded-xl">
        Nema proizvoda
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop tabela (lg i veće) */}
      <div className="hidden lg:block overflow-hidden rounded-xl shadow-lg">
        <table className="min-w-full text-center divide-y divide-gray-200 bg-white">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <tr>
              <th className="px-6 py-4 text-lg font-bold text-gray-700">
                Slika
              </th>
              <th className="px-6 py-4 text-lg font-bold text-gray-700">
                Naziv
              </th>
              <th className="px-6 py-4 text-lg font-bold text-gray-700">
                Kategorija
              </th>
              <th className="px-6 py-4 text-lg font-bold text-gray-700">
                Cena (RSD)
              </th>
              <th className="px-6 py-4 text-lg font-bold text-gray-700">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((prod) => (
              <tr
                key={prod.id}
                data-product-id={prod.id}
                className="hover:bg-blue-50 transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
              >
                <td className="py-4">
                  <ProgressiveImage
                    src={prod.imgUrl}
                    alt={prod.name}
                    className="w-20 h-20 object-cover mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  />
                </td>
                <td className="py-4 font-semibold text-gray-800">
                  {prod.name}
                </td>
                <td className="py-4 text-gray-600">{prod.category}</td>
                <td className="py-4 font-bold text-green-600 text-lg">
                  {prod.price !== null ? (
                    formatPrice(prod.price) + " RSD"
                  ) : allowed ? (
                    formatPrice(prod.hiddenPrice) + " RSD"
                  ) : (
                    <span className="italic text-gray-400">
                      Cena skrivena
                    </span>
                  )}
                  {prod.hiddenPrice && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold ml-2 animate-pulse">
                      Sakrivena cena
                    </span>
                  )}
                </td>

                <td className="py-4 space-x-3">
                  <button
                    onClick={() => onEdit(prod)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium"
                  >
                    Izmeni
                  </button>
                  <button
                    onClick={() => onDelete(prod)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg font-medium"
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile kartice (manje od lg) */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            data-product-id={prod.id}
            onClick={() => onProductClick(prod)}
            className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
          >
            <ProgressiveImage
              src={prod.imgUrl}
              alt={prod.name}
              className="w-full h-32 sm:h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1 truncate">
              {prod.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{prod.category}</p>
            <p className="font-bold text-green-600 text-lg">
              {prod.price !== null ? (
                formatPrice(prod.price) + " RSD"
              ) : allowed ? (
                formatPrice(prod.hiddenPrice) + " RSD (skrivena)"
              ) : (
                <span className="italic text-gray-400">Cena skrivena</span>
              )}
              {prod.hiddenPrice && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold ml-2 animate-pulse">
                  Sakrivena cena
                </span>
              )}
            </p>

            <div className="mt-3 text-center">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Kliknite za opcije
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
