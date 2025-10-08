// components/shop/OrderDetailsModal.jsx
// Modal za prikaz detalja o narudžbini
// Prikazuje informacije o naručiocu, proizvodima, statusu i ukupnoj ceni
// Koristi framer-motion za animacije otvaranja i zatvaranja
// Props: open (boolean), onClose (function), order (object sa detaljima narudžbine)

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  CreditCard,
  PackageSearch,
  Store,
  User2,
  MapPin,
  Mail,
  Phone,
  DollarSign,
} from "lucide-react";
import ProgressiveImage from "../UI/ProgressiveImage";
import StatusBadge from "./StatusBadge";
import { FaShippingFast } from "react-icons/fa";

function srRsd(n) {
  return n ? n.toLocaleString("sr-RS") + " RSD" : "Cena na upit";
}

function srDate(ts) {
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString("sr-RS");
}

// Pomoćne funkcije za rad sa skrivenim cenama
function hasHiddenPrice(product) {
  return product.hiddenPrice && !product.price;
}

function getProductPrice(product) {
  return product.price || product.hiddenPrice || 0;
}

export default function OrderDetailsModal({ open, onClose, order }) {
  if (!order) return null;

  // Proveri da li narudžbina sadrži proizvode sa skrivenom cenom
  const hasHiddenItems = order.cart.some(hasHiddenPrice);

  // Računaj ukupno za vidljive cene
  const visibleTotal = order.cart.reduce((acc, prod) => {
    return prod.price ? acc + prod.price * prod.qty : acc;
  }, 0);

  // Ukupno svih proizvoda (uključujući skrivene cene)
  const fullTotal = order.cart.reduce((acc, prod) => {
    return acc + getProductPrice(prod) * prod.qty;
  }, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1010] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-2xl max-h-11/12 relative flex flex-col overflow-y-auto my-20"
            initial={{ scale: 0.88, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 bg-gray-50 rounded-full p-2 text-gray-600 hover:bg-gray-200 shadow transition-colors z-10"
              onClick={onClose}
              aria-label="Zatvori"
            >
              <X size={24} />
            </button>
            {/* Zaglavlje */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 items-start p-6 border-b">
              <StatusBadge status={order.status} />
              <div className="flex gap-3 py-1 px-1 items-center text-sm text-gray-500">
                <Calendar size={18} /> <span>{srDate(order.createdAt)}</span>
              </div>
              <div className="flex gap-3 py-1 px-1 items-center text-sm text-gray-500">
                <CreditCard size={18} />{" "}
                <span>{order.paymentType || "Plaćanje pouzećem"}</span>
              </div>
              <div className="flex-1" />
              <span className="text-base mr-11 px-2 py-1 rounded bg-blue-50 text-bluegreen font-bold whitespace-nowrap">
                #{order.id || order.createdAt?.seconds}
              </span>
            </div>

            {/* Obaveštenje o skrivenim cenama */}
            {hasHiddenItems && (
              <div className="mx-6 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-center gap-2 text-orange-700">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold text-sm">Napomena:</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  Ova narudžbina sadrži proizvode sa skrivenom cenom. Finalna
                  cena će biti određena nakon kontakta.
                </p>
              </div>
            )}

            {/* Glavni sadrzaj */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sekcija proizvodi */}
              <div className="overflow-y-auto max-h-[30vh] sm:max-h-[50vh]">
                <h4 className="text-lg font-semibold flex items-center gap-3 mb-4">
                  <PackageSearch size={20} className="text-bluegreen" />{" "}
                  Proizvodi
                </h4>
                <ul className="space-y-3">
                  {order.cart.map((prod) => (
                    <li
                      key={prod.id}
                      className={`flex items-center gap-3 bg-gray-50 rounded-xl p-2 shadow-sm ${
                        hasHiddenPrice(prod)
                          ? "border-l-4 border-orange-400"
                          : ""
                      }`}
                    >
                      <ProgressiveImage
                        src={prod.imgUrl}
                        alt={prod.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate flex items-center gap-2">
                          {prod.name}
                          {hasHiddenPrice(prod) && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full animate-pulse">
                              Skrivena cena
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {prod.category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {hasHiddenPrice(prod) ? (
                            <div className="space-y-1">
                              <span className="italic text-orange-600">
                                Cena na upit × {prod.qty}
                              </span>
                              {prod.suggestedPrice && (
                                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-1 w-fit">
                                  <DollarSign size={12} />
                                  <span className="font-semibold">
                                    Predložena cena:{" "}
                                    {prod.suggestedPrice.toLocaleString(
                                      "sr-RS"
                                    )}{" "}
                                    RSD × {prod.qty}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            `${srRsd(getProductPrice(prod))} × ${prod.qty}`
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Sekcija detalji */}
              <div className="flex flex-col gap-4">
                <h4 className="text-lg font-semibold flex items-center gap-3 mb-4">
                  <Store size={20} className="text-bluegreen" /> Podaci o
                  naručiocu
                </h4>
                <div className="flex items-center gap-3 text-gray-700">
                  <User2 size={20} />
                  <span>{order.ime + " " + order.prezime || "Nepoznato"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} />{" "}
                  <span className="break-all">{order.email}</span>
                </div>
                {order.telefon && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone size={18} /> <span>{order.telefon}</span>
                  </div>
                )}
                {order.adresa && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin size={18} />{" "}
                    <span>{order.adresa + ", " + order.grad}</span>
                  </div>
                )}

                {/* Dostava */}
                {(order.deliveryPrice || order.deliveryCompany) && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 mt-4">
                    <div className="flex items-center gap-2 text-bluegreen font-bold mb-2">
                      <FaShippingFast size={18} />
                      <span>Dostava</span>
                    </div>
                    {order.deliveryCompany && (
                      <div className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="font-medium">Dostavljač:</span>
                        <span className="bg-white px-2 py-1 rounded border border-blue-200">
                          {order.deliveryCompany}
                        </span>
                      </div>
                    )}
                    {order.deliveryPrice && (
                      <div className="text-sm text-gray-700 flex items-center gap-2 mt-1">
                        <span className="font-medium">Cena dostave:</span>
                        <span className="bg-white px-2 py-1 rounded border border-blue-200 font-semibold">
                          {order.deliveryPrice.toLocaleString("sr-RS")} RSD
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Ukupna cena - prilagođeno za skrivene cene */}
                <div className="flex flex-col gap-2 text-base text-bluegreen font-bold border-t pt-3 mt-6">
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} />
                    <span>Ukupno:</span>
                  </div>
                  {hasHiddenItems ? (
                    <div className="flex flex-col gap-1 ml-7">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Vidljive cene:
                        </span>
                        <span className="text-bluegreen">
                          {srRsd(visibleTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-orange-600">
                          Artikli na upit:
                        </span>
                        <span className="text-orange-600 italic">
                          {order.cart
                            .filter(hasHiddenPrice)
                            .some((p) => p.suggestedPrice)
                            ? `${order.cart
                                .filter(hasHiddenPrice)
                                .reduce(
                                  (acc, p) =>
                                    acc + (p.suggestedPrice || 0) * p.qty,
                                  0
                                )
                                .toLocaleString("sr-RS")} RSD (predloženo)`
                            : "Dogovor"}
                        </span>
                      </div>
                      {order.deliveryPrice && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-blue-600">
                            Dostava:
                          </span>
                          <span className="text-blue-600">
                            {order.deliveryPrice.toLocaleString("sr-RS")} RSD
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-1 mt-1 flex justify-between">
                        <span className="font-bold">Finalna cena:</span>
                        <span className="text-orange-600 italic">
                          {order.cart
                            .filter(hasHiddenPrice)
                            .every((p) => p.suggestedPrice)
                            ? `${(
                                visibleTotal +
                                order.cart
                                  .filter(hasHiddenPrice)
                                  .reduce(
                                    (acc, p) =>
                                      acc + (p.suggestedPrice || 0) * p.qty,
                                    0
                                  ) +
                                (order.deliveryPrice || 0)
                              ).toLocaleString("sr-RS")} RSD (orjentaciono)`
                            : "Na dogovor"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-7 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Proizvodi:
                        </span>
                        <span>{srRsd(fullTotal)}</span>
                      </div>
                      {order.deliveryPrice && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-blue-600">
                            Dostava:
                          </span>
                          <span className="text-blue-600">
                            {order.deliveryPrice.toLocaleString("sr-RS")} RSD
                          </span>
                        </div>
                      )}
                      {order.deliveryPrice && (
                        <div className="flex justify-between items-center border-t pt-1">
                          <span className="font-bold">Ukupno sa dostavom:</span>
                          <span>
                            {(fullTotal + order.deliveryPrice).toLocaleString(
                              "sr-RS"
                            )}{" "}
                            RSD
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
