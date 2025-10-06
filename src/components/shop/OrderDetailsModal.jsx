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
} from "lucide-react";
import ProgressiveImage from "../UI/ProgressiveImage";
import StatusBadge from "./StatusBadge";

function srRsd(n) {
  return n.toLocaleString("sr-RS") + " RSD";
}
function srDate(ts) {
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString("sr-RS");
}

export default function OrderDetailsModal({ open, onClose, order }) {
  if (!order) return null;
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
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-2xl max-h-screen relative flex flex-col overflow-hidden my-10"
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
            {/* Glavni sadrzaj */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sekcija proizvodi */}
              <div className="overflow-y-auto max-h-[30vh] sm:max-h-[50vh] custom-scrollbar">
                <h4 className="text-lg font-semibold flex items-center gap-3 mb-4">
                  <PackageSearch size={20} className="text-bluegreen" />{" "}
                  Proizvodi
                </h4>
                <ul className="space-y-3">
                  {order.cart.map((prod) => (
                    <li
                      key={prod.id}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 shadow-sm"
                    >
                      <ProgressiveImage
                        src={prod.imgUrl}
                        alt={prod.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">
                          {prod.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {prod.category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {srRsd(prod.price)} × {prod.qty}
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
                <div className="flex items-center gap-2 text-base text-bluegreen font-bold border-t pt-3 mt-6">
                  <CreditCard size={20} />
                  <span>Ukupno:</span>
                  <span>
                    {srRsd(order.cart.reduce((a, p) => a + p.price * p.qty, 0))}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
