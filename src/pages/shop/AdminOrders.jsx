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

import { useEffect, useState, useContext, useRef } from "react";
import { db, auth } from "../../utils/firebase";
import {
  collection,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy as firestoreOrderBy,
} from "firebase/firestore";
import { SnackbarContext } from "../../contexts/snackbar/SnackbarContext";
import ProgressiveImage from "../../components/UI/ProgressiveImage";
import {
  FaCheckCircle,
  FaUserCircle,
  FaEnvelope,
  FaBuilding,
  FaTruck,
  FaBoxes,
  FaHome,
  FaTimes,
  FaExclamationCircle,
  FaEye,
  FaEdit,
  FaSave,
  FaDollarSign,
  FaShippingFast,
} from "react-icons/fa";
import StatusBadge from "../../components/shop/StatusBadge";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../components/UI/Modal";

export default function AdminOrders() {
  const { showSnackbar } = useContext(SnackbarContext);
  const [allowed, setAllowed] = useState(null);
  const [orders, setOrders] = useState([]);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const ORDERS_PER_PAGE = 10;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagingAnimKey, setPagingAnimKey] = useState(1);
  const [otvoriBrisanjeModal, setOtvoriBrisanjeModal] = useState(false);
  const [currectOrderId, setCurrectOrderId] = useState(null);
  const [editingPrices, setEditingPrices] = useState({});
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const initialLoadRef = useRef(true);
  const prevOrderIdsRef = useRef(new Set());

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
        [];
      setAllowed(user && adminEmails.includes(user.email));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!allowed) return;

    initialLoadRef.current = true; // reset na promenu filtera
    setOrdersLoading(true);

    const q = query(
      collection(db, "orders"),
      firestoreOrderBy("createdAt", sort === "desc" ? "desc" : "asc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const snapshotIds = new Set(snapshot.docs.map((doc) => doc.id));
        const newList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Pravi "truly new" porudžbine - nema petlje preko orders
        let trulyNewIds = new Set();
        if (!initialLoadRef.current) {
          for (let doc of snapshot.docs) {
            if (!prevOrderIdsRef.current.has(doc.id)) {
              trulyNewIds.add(doc.id);
            }
          }
        }

        setOrders(newList);
        setOrdersLoading(false);

        if (trulyNewIds.size > 0) {
          setNewOrderIds(trulyNewIds);
          setTimeout(() => setNewOrderIds(new Set()), 1600);
        }

        prevOrderIdsRef.current = snapshotIds;
        initialLoadRef.current = false;
      },
      (error) => {
        showSnackbar("Greška pri učitavanju narudžbina.", "error");
        setOrdersLoading(false);
      }
    );

    return () => unsubscribe();
    // ZAVISNOSTI: nema orders u array-u!
  }, [allowed, sort, showSnackbar]);

  // Kada admin klikne narudžbinu...
  useEffect(() => {
    if (!selectedOrder) return;

    // Delay the auto status update to prevent UI conflicts
    const timeoutId = setTimeout(() => {
      if (selectedOrder && selectedOrder.status === "primljeno") {
        updateOrderStatus(selectedOrder.id, "u obradi");
      }
    }, 300);

    // Učitaj postojeće cene i delivery info
    setDeliveryPrice(selectedOrder.deliveryPrice || "");
    setDeliveryCompany(selectedOrder.deliveryCompany || "");
    const initialPrices = {};
    selectedOrder.cart?.forEach((prod, idx) => {
      if (prod.hiddenPrice && !prod.price) {
        initialPrices[idx] = prod.suggestedPrice || "";
      }
    });
    setEditingPrices(initialPrices);

    // Cleanup timeout on unmount or when selectedOrder changes
    return () => clearTimeout(timeoutId);
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
    } catch (error) {
      console.error("Error updating status:", error);
      showSnackbar("Greška pri ažuriranju statusa.", "error");
      // No need to manually fetch - onSnapshot will update automatically
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

  // Funkcija za prepoznavanje skrivene cene
  const hasHiddenPrice = (product) => {
    return product.hiddenPrice && !product.price;
  };

  // Update suggested prices and delivery info
  const updateOrderPricesAndDelivery = async () => {
    if (!selectedOrder) return;
    try {
      const updatedCart = selectedOrder.cart.map((prod, idx) => {
        if (hasHiddenPrice(prod) && editingPrices[idx] !== undefined) {
          return {
            ...prod,
            suggestedPrice: parseFloat(editingPrices[idx]) || 0,
          };
        }
        return prod;
      });

      await updateDoc(doc(db, "orders", selectedOrder.id), {
        cart: updatedCart,
        deliveryPrice: parseFloat(deliveryPrice) || 0,
        deliveryCompany: deliveryCompany || "",
      });

      showSnackbar("Cene i dostava ažurirani!", "success");
      // No need to manually fetch - onSnapshot will update automatically
      setSelectedOrder(null);
    } catch (error) {
      showSnackbar("Greška pri ažuriranju.", "error");
      console.error(error);
    }
  };

  const copyOriginalPrice = (idx, product) => {
    if (product.hiddenPrice) {
      setEditingPrices((prev) => ({
        ...prev,
        [idx]: product.hiddenPrice,
      }));
    }
  };

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
                <AnimatePresence mode="sync">
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
                    pagedOrders.map((order) => {
                      const isNew = newOrderIds.has(order.id);
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{
                            opacity: 0,
                            y: 18,
                            scale: isNew ? 0.95 : 1,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: isNew ? [0.9, 1.05, 1] : 1,
                            backgroundColor: isNew
                              ? ["rgba(34, 211, 238, 0.2)", "transparent"]
                              : "transparent",
                          }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{
                            ease: [0.48, 0.06, 0.58, 1],
                            type: isNew ? "tween" : "spring",
                            duration: 0.7,
                            stiffness: 120,
                          }}
                          className="hover:bg-bluegreen/10 transition cursor-pointer relative"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-4 py-3 font-semibold relative">
                            {isNew && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className="absolute -left-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg animate-pulse"
                              >
                                NOVA
                              </motion.span>
                            )}
                            <span className={isNew ? "ml-14" : ""}>
                              {order.ime} {order.prezime}
                            </span>
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
                      );
                    })
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
              pagedOrders.map((order) => {
                const isNew = newOrderIds.has(order.id);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 34, scale: isNew ? 0.9 : 1 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isNew ? [0.9, 1] : 1,
                    }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{
                      duration: isNew ? 0.8 : 0.36,
                      ease: [0.45, 0.07, 0.58, 1],
                      type: "spring",
                      stiffness: 120,
                    }}
                    style={{ willChange: "opacity, transform" }}
                    className={`bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3 ring-1 hover:scale-[1.03] hover:shadow-2xl cursor-pointer transition-all relative ${
                      isNew
                        ? "ring-2 ring-bluegreen bg-gradient-to-br from-cyan-50 to-white"
                        : "ring-bluegreen/10"
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    {isNew && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse"
                      >
                        NOVA PORUDŽBINA
                      </motion.div>
                    )}

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
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* --- Modal --- */}
        {/* Detalji narudžbine */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              data-lenis-prevent
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl p-7 mx-auto overflow-y-auto max-h-[90vh] border border-bluegreen/30"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute right-3 top-3 text-bluegreen bg-white/50 rounded-full p-2 hover:bg-bluegreen/20 transition shadow z-10"
                  onClick={() => setSelectedOrder(null)}
                >
                  <FaTimes size={20} />
                </button>
                <motion.h3
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-2xl font-bold text-bluegreen mb-4 flex items-center gap-2"
                >
                  <FaTruck /> Detalji porudžbine - Admin Pregled
                </motion.h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Customer Info */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200/50 backdrop-blur-sm"
                  >
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-bluegreen">
                      <FaUserCircle /> Informacije o kupcu
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FaUserCircle className="text-gray-400" />
                        <span className="font-semibold">
                          {selectedOrder.ime} {selectedOrder.prezime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        <span>{selectedOrder.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHome className="text-gray-400" />
                        <span>
                          {selectedOrder.adresa}, {selectedOrder.grad}
                        </span>
                      </div>
                      {selectedOrder.tip === "pravno" && (
                        <div className="flex items-start gap-2 bg-white/50 p-2 rounded-lg mt-2">
                          <FaBuilding className="text-gray-400 mt-1" />
                          <div className="text-xs">
                            <div>
                              <b>Firma:</b> {selectedOrder.firma}
                            </div>
                            <div>
                              <b>PIB:</b> {selectedOrder.pib}
                            </div>
                            <div>
                              <b>MB:</b> {selectedOrder.matbr}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <b>Telefon:</b> {selectedOrder.telefon}
                      </div>
                      <div className="flex items-center gap-2">
                        <b>Status:</b>{" "}
                        <StatusBadge status={selectedOrder.status} />
                      </div>
                      <div className="text-xs text-gray-400 pt-2">
                        Kreirana:{" "}
                        {selectedOrder.createdAt?.seconds &&
                          formatDate(selectedOrder.createdAt.seconds)}
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column - Delivery Info */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200/50 backdrop-blur-sm"
                  >
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-700">
                      <FaShippingFast /> Dostava
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                          <FaDollarSign size={12} /> Cena dostave (RSD)
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          value={deliveryPrice}
                          onChange={(e) => setDeliveryPrice(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-green-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all bg-white/80 backdrop-blur-sm"
                          placeholder="Unesi cenu dostave"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                          <FaTruck size={12} /> Firma dostavljača
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="text"
                          value={deliveryCompany}
                          onChange={(e) => setDeliveryCompany(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-green-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all bg-white/80 backdrop-blur-sm"
                          placeholder="Ime firme (npr. BEX, DExpress...)"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Products Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-charcoal">
                    <FaBoxes /> Poručeni proizvodi
                  </h4>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                    {selectedOrder.cart?.map((prod, i) => {
                      const isHidden = hasHiddenPrice(prod);
                      return (
                        <motion.div
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * i }}
                          className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl ${
                            isHidden
                              ? "bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200"
                              : "bg-gray-50 border border-gray-200"
                          } backdrop-blur-sm`}
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-sm">
                            <ProgressiveImage
                              src={prod.imgUrl}
                              alt={prod.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-bluegreen flex items-center gap-2 flex-wrap">
                              {prod.name}
                              {isHidden && (
                                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                  <FaEye size={10} /> Skrivena cena
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                              {prod.category}
                            </div>
                            {!isHidden ? (
                              <>
                                <div className="font-bold text-green-600 text-sm">
                                  {prod.price &&
                                    prod.price.toLocaleString("sr-RS")}{" "}
                                  RSD
                                </div>
                                <div className="text-xs text-gray-400">
                                  Količina: {prod.qty || 1}
                                </div>
                              </>
                            ) : (
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-semibold text-gray-600">
                                    Skrivena cena:
                                  </span>
                                  <span className="bg-white px-2 py-1 rounded border border-orange-300 font-mono">
                                    {prod.hiddenPrice?.toLocaleString("sr-RS")}{" "}
                                    RSD
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => copyOriginalPrice(i, prod)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-600 transition-colors"
                                    title="Kopiraj originalnu cenu"
                                  >
                                    <FaDollarSign size={10} /> Koristi
                                    originalnu cenu
                                  </motion.button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs font-semibold text-orange-700 flex items-center gap-1">
                                    <FaEdit size={10} /> Predložena cena:
                                  </label>
                                  <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="number"
                                    value={editingPrices[i] || ""}
                                    onChange={(e) =>
                                      setEditingPrices((prev) => ({
                                        ...prev,
                                        [i]: e.target.value,
                                      }))
                                    }
                                    className="flex-1 px-3 py-1.5 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-sm bg-white/80 w-full max-w-9/12 sm:max-w-full"
                                    placeholder="Unesi predloženu cenu"
                                  />
                                  <span className="text-xs text-gray-500">
                                    RSD
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  Količina: {prod.qty || 1}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={updateOrderPricesAndDelivery}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-bold flex items-center gap-2"
                  >
                    <FaSave /> Sačuvaj izmene
                  </motion.button>

                  {selectedOrder.status !== "završeno" &&
                    selectedOrder.status !== "otkazano" && (
                      <>
                        {selectedOrder.status !== "poslato" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              updateOrderStatus(selectedOrder.id, "poslato")
                            }
                            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow hover:shadow-lg font-bold flex items-center gap-2"
                          >
                            <FaTruck /> Poslato
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            updateOrderStatus(selectedOrder.id, "završeno")
                          }
                          className="bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition shadow hover:shadow-lg font-bold flex items-center gap-2"
                        >
                          <FaCheckCircle /> Završeno
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setOtvoriBrisanjeModal(true);
                            setCurrectOrderId(selectedOrder.id);
                          }}
                          className="bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow hover:shadow-lg font-bold flex items-center gap-2"
                        >
                          <FaExclamationCircle /> Otkaži
                        </motion.button>
                      </>
                    )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
