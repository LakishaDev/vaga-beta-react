// src/pages/shop/AdminOrders.jsx
// Stranica za administraciju narudžbina
// Pristup je dozvoljen samo admin korisnicima
// Koristi Firebase Firestore za čuvanje i ažuriranje narudžbina
// Prikazuje tabelu narudžbina sa mogućnošću sortiranja i paginacije
// Omogućava promenu statusa narudžbine (primljeno, u obradi, poslato, završeno, otkazano)
// Prikazuje detalje narudžbine u modalu
// Koristi SnackbarContext za prikazivanje obaveštenja
// Koristi Tailwind CSS za stilizaciju
// Koristi React Icons za ikone
// Koristi Framer Motion za animacije
// Možeš prilagoditi izgled i funkcionalnost po želji
// Admin email-ovi se čitaju iz .env fajla (VITE_ADMIN_EMAILS)

import { useEffect, useState, useContext, useCallback } from "react";
import { db, auth } from "../../utils/firebase";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import {
  FaRegClock,
  FaCheckCircle,
  FaUserCircle,
  FaEnvelope,
  FaBuilding,
  FaTruck,
  FaBoxes,
  FaHome,
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";
import StatusBadge from "../../components/shop/StatusBadge";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../components/UI/Modal";

export default function AdminOrders() {
  const { showSnackbar } = useContext(SnackbarContext);
  const [allowed, setAllowed] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const ORDERS_PER_PAGE = 10;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagingAnimKey, setPagingAnimKey] = useState(1);
  const [otvoriBrisanjeModal, setOtvoriBrisanjeModal] = useState(false);
  const [currectOrderId, setCurrectOrderId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
        [];
      setAllowed(user && adminEmails.includes(user.email));
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      let list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      list = list.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return sort === "desc" ? bTime - aTime : aTime - bTime;
      });
      setOrders(list);
    } catch {
      showSnackbar("Greška pri učitavanju narudžbina.", "error");
    } finally {
      setOrdersLoading(false);
    }
  }, [showSnackbar, sort]);

  useEffect(() => {
    if (allowed) fetchOrders();
  }, [allowed, fetchOrders, sort]);

  // Kada admin klikne narudžbinu...
  useEffect(() => {
    if (selectedOrder && selectedOrder.status === "primljeno") {
      updateOrderStatus(selectedOrder.id, "u obradi");
    }
    // eslint-disable-next-line
  }, [selectedOrder]);

  // Paginacija
  const pagesTotal = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const pagedOrders = orders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  // Animacija paging-a
  useEffect(() => {
    setPagingAnimKey(page * (sort === "desc" ? 1 : -1));
  }, [page, sort, orders.length]);

  // OPTIMISTIC status
  const updateOrderStatus = async (orderId, status) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status }));
      }
      await new Promise((resolve) => setTimeout(resolve, 180));
      await updateDoc(doc(db, "orders", orderId), { status });
      showSnackbar("Status ažuriran!", "success");
    } catch {
      showSnackbar("Greška pri ažuriranju statusa.", "error");
      fetchOrders();
    }
  };

  // Formatiranje datuma
  const formatDate = (seconds) =>
    new Date(seconds * 1000).toLocaleString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const Loader = (
    <div className="flex justify-center items-center py-20">
      <div className="w-16 h-16 border-4 border-bluegreen border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (allowed === null) return Loader;
  if (allowed === false)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-red-700 font-extrabold text-2xl p-7 rounded-xl shadow bg-white">
          Pristup odbijen
        </div>
      </div>
    );

  return (
    <>
      <div className="max-w-7xl mx-auto w-full p-3 sm:p-8 pt-12">
        <h2 className="text-4xl font-black text-center text-charcoal mb-6 tracking-tight">
          <FaTruck className="inline-block mr-2 mb-1 text-bluegreen" />
          Administracija narudžbina
        </h2>

        {/* Sort/paginacija */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-charcoal">Sortiraj:</span>
            <button
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                sort === "desc"
                  ? "bg-bluegreen text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => {
                setSort("desc");
                setPage(1);
              }}
            >
              Najnovije
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                sort === "asc"
                  ? "bg-bluegreen text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => {
                setSort("asc");
                setPage(1);
              }}
            >
              Najstarije
            </button>
          </div>
          <div className="flex gap-2 items-center text-sm">
            <span>Strana:</span>
            {Array.from({ length: pagesTotal }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`rounded px-2 py-1 font-bold transition ${
                  page === pg
                    ? "bg-bluegreen text-white"
                    : "bg-gray-100 text-charcoal hover:bg-bluegreen/20"
                }`}
              >
                {pg}
              </button>
            ))}
          </div>
        </div>

        {/* --- Desktop tabela --- */}
        <div className="hidden md:block overflow-hidden rounded-xl shadow-2xl border border-gray-200 bg-white animate-fade-up">
          {ordersLoading ? (
            Loader
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-bluegreen/10">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-bold text-charcoal">
                    <FaUserCircle className="inline mb-1 mr-1" />
                    Kupac
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-charcoal">
                    <FaEnvelope className="inline mb-1 mr-1" />
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-charcoal">
                    <FaHome className="inline mb-1 mr-1" />
                    Adresa
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-charcoal">
                    Tip
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-charcoal">
                    Status
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-bold text-charcoal">
                    Akcija
                  </th>
                </tr>
              </thead>
              <motion.tbody
                key={pagingAnimKey}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.28, ease: [0.45, 0.06, 0.6, 1] }}
                className="divide-y divide-gray-100"
              >
                <AnimatePresence mode="wait">
                  {pagedOrders.length === 0 ? (
                    <motion.tr
                      key="no-orders"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 14 }}
                      transition={{ duration: 0.28 }}
                    >
                      <td
                        colSpan={6}
                        className="py-16 text-lg text-slate-400 text-center"
                      >
                        Nema narudžbina
                      </td>
                    </motion.tr>
                  ) : (
                    pagedOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                          duration: 0.33,
                          ease: [0.48, 0.06, 0.58, 1],
                        }}
                        className="hover:bg-bluegreen/10 transition cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 py-3 font-semibold">
                          {order.ime} {order.prezime}
                        </td>
                        <td className="px-4 py-3">{order.email}</td>
                        <td
                          className="px-4 py-3 max-w-xs truncate"
                          title={order.adresa}
                        >
                          {order.adresa}
                        </td>
                        <td className="px-4 py-3">
                          {order.tip === "pravno" ? (
                            <>
                              <FaBuilding className="inline-block text-gray-400 mr-1" />
                              Pravno
                            </>
                          ) : (
                            <>Fizičko</>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-center space-x-1">
                          {order.status !== "završeno" &&
                            order.status !== "otkazano" && (
                              <>
                                {order.status !== "poslato" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateOrderStatus(order.id, "poslato");
                                    }}
                                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-all duration-300 shadow hover:scale-105"
                                    title="Označi kao poslato"
                                  >
                                    <FaTruck className="inline mr-1" />
                                    Poslato
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateOrderStatus(order.id, "završeno");
                                  }}
                                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-all duration-300 shadow hover:scale-105"
                                  title="Završeno"
                                >
                                  <FaCheckCircle className="inline mr-1" />
                                  Završeno
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOtvoriBrisanjeModal(true);
                                    setCurrectOrderId(order.id);
                                  }}
                                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-all duration-300 shadow hover:scale-105"
                                  title="Otkaži"
                                >
                                  <FaExclamationCircle className="inline mr-1" />
                                  Otkaži
                                </button>
                              </>
                            )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </motion.tbody>
            </table>
          )}
        </div>

        {/* --- Mobile grid --- */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-7">
          <AnimatePresence>
            {ordersLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="col-span-full"
              >
                {Loader}
              </motion.div>
            ) : pagedOrders.length === 0 ? (
              <motion.div
                key="no-orders"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.33, ease: [0.45, 0.07, 0.58, 1] }}
                className="col-span-full text-center text-lg text-slate-400 py-12 bg-gray-50 rounded-xl"
              >
                Nema narudžbina
              </motion.div>
            ) : (
              pagedOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.36, ease: [0.45, 0.07, 0.58, 1] }}
                  style={{ willChange: "opacity, transform" }}
                  className="bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3 ring-1 ring-bluegreen/10 hover:scale-[1.03] hover:shadow-2xl cursor-pointer transition-all"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex gap-2 items-center">
                    <FaUserCircle className="text-bluegreen" />
                    <span className="font-bold">
                      {order.ime} {order.prezime}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center text-xs text-gray-500">
                    <FaEnvelope /> {order.email}
                  </div>
                  <div className="flex gap-2 items-center text-xs text-gray-500">
                    <FaHome /> {order.adresa}
                  </div>
                  <StatusBadge status={order.status} />
                  <div className="flex items-center gap-2 justify-end mt-2">
                    {order.cart?.length && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-bluegreen/10 text-bluegreen text-xs rounded font-bold">
                        <FaBoxes /> Proizvoda: {order.cart.length}
                      </span>
                    )}
                    {order.status !== "završeno" &&
                      order.status !== "otkazano" && (
                        <>
                          {order.status !== "poslato" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrderStatus(order.id, "poslato");
                              }}
                              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition shadow hover:scale-105 text-xs font-bold"
                            >
                              Poslato
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, "završeno");
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition shadow hover:scale-105 text-xs font-bold"
                          >
                            Završeno
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOtvoriBrisanjeModal(true);
                              setCurrectOrderId(order.id);
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-all duration-300 shadow hover:scale-105"
                            title="Otkaži"
                          >
                            <FaExclamationCircle className="inline mr-1" />
                            Otkaži
                          </button>
                        </>
                      )}
                  </div>
                  <div className="flex justify-end text-xs text-gray-400">
                    {order.createdAt?.seconds &&
                      formatDate(order.createdAt.seconds)}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* --- Modal --- */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadein">
            <div
              className="absolute inset-0"
              onClick={() => setSelectedOrder(null)}
            ></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-[480px] p-7 mx-auto overflow-y-auto max-h-[90vh] animate-popup border border-bluegreen/30">
              <button
                className="absolute right-3 top-3 text-bluegreen bg-white/50 rounded-full p-2 hover:bg-bluegreen/20 transition shadow"
                onClick={() => setSelectedOrder(null)}
              >
                <FaTimes size={20} />
              </button>
              <h3 className="text-2xl font-bold text-bluegreen mb-2 flex items-center gap-2">
                <FaTruck /> Detalji porudžbine
              </h3>
              <div className="mb-3 flex flex-col gap-1">
                <div>
                  <FaUserCircle className="inline mb-1 mr-1 text-gray-400" />{" "}
                  <span className="font-bold">
                    {selectedOrder.ime} {selectedOrder.prezime}
                  </span>
                </div>
                <div>
                  <FaEnvelope className="inline mb-1 mr-1 text-gray-400" />{" "}
                  {selectedOrder.email}
                </div>
                <div>
                  <FaHome className="inline mb-1 mr-1 text-gray-400" />{" "}
                  {selectedOrder.adresa}, {selectedOrder.grad}
                </div>
                {selectedOrder.tip === "pravno" && (
                  <div>
                    <FaBuilding className="inline mb-1 mr-1 text-gray-400" />{" "}
                    Firma: <b>{selectedOrder.firma}</b> PIB:{" "}
                    <b>{selectedOrder.pib}</b> MB: <b>{selectedOrder.matbr}</b>
                  </div>
                )}
                <div>
                  <b>Telefon:</b> {selectedOrder.telefon}
                </div>
                <div>
                  Status: <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <span className="text-xs text-gray-400">
                    Kreirana:{" "}
                    {selectedOrder.createdAt?.seconds &&
                      formatDate(selectedOrder.createdAt.seconds)}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-black mb-2 text-charcoal flex gap-2 items-center text-lg">
                  <FaBoxes /> Poručeni proizvodi
                </h4>
                <div className="flex flex-col gap-3">
                  {selectedOrder.cart?.map((prod, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-bluegreen/10 shadow animate-fadein"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-bluegreen/10">
                        <ProgressiveImage
                          src={prod.imgUrl}
                          alt={prod.name}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      <div className="flex-1 pl-2">
                        <div className="font-bold text-bluegreen">
                          {prod.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {prod.category}
                        </div>
                        <div className="font-bold text-green-600 text-sm">
                          {prod.price && prod.price.toLocaleString("sr-RS")} RSD
                        </div>
                        <div className="text-xs text-gray-400">
                          Količina: {prod.qty || 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-5 justify-end">
                {selectedOrder.status !== "završeno" &&
                  selectedOrder.status !== "otkazano" && (
                    <>
                      {selectedOrder.status !== "poslato" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(selectedOrder.id, "poslato")
                          }
                          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition shadow hover:scale-105 font-bold"
                        >
                          <FaTruck className="inline mr-1" />
                          Označi kao poslato
                        </button>
                      )}
                      <button
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "završeno")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow hover:scale-105 font-bold"
                      >
                        <FaCheckCircle className="inline mr-1" />
                        Označi kao završeno
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOtvoriBrisanjeModal(true);
                          setCurrectOrderId(selectedOrder.id);
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-all duration-300 shadow hover:scale-105"
                        title="Otkaži"
                      >
                        <FaExclamationCircle className="inline mr-1" />
                        Otkaži narudžbinu
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
      {otvoriBrisanjeModal && (
        <Modal
          title={"Brisanje narudžbine #" + (currectOrderId || "")}
          onClose={() => setOtvoriBrisanjeModal(false)}
          onConfirm={() => {
            updateOrderStatus(currectOrderId, "otkazano");
            setOtvoriBrisanjeModal(false);
            setSelectedOrder(null);
            setCurrectOrderId(null);
          }}
          confirmText="Da, otkaži"
          cancelText="Otkaži"
        >
          <p>
            Da li ste sigurni da želite da otkažete ovu narudžbinu? Ova akcija
            se ne može poništiti.
          </p>
        </Modal>
      )}
    </>
  );
}
