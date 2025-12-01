// src/pages/admin/licensing/OrdersPage.jsx
// ===============================================================================
// ORDERS PAGE - Stranica za pregled porudžbina licenci
// ===============================================================================
//
// @description Admin stranica za pregled i upravljanje porudžbinama licenci
// @author eVaga Team
// @version 1.1 - UI/UX Polish
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ Lista porudžbina sa statusom
// ✅ Filteri po statusu (paid, pending, failed)
// ✅ Link ka povezanoj licenci
// ✅ Detalji porudžbine
// ✅ Admin autentifikacija
// ✅ Glassmorphism dizajn
// ===============================================================================

import { useState, useEffect, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  CreditCard,
  User,
  Mail,
  Key,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Sparkles,
  Receipt,
} from "lucide-react";
import { auth } from "../../../utils/firebase";
import { SnackbarContext } from "../../../contexts/snackbar/SnackbarContext";
import {
  subscribeOrders,
  updateOrderStatus,
} from "../../../services/licenseService";
import {
  formatLicenseDate,
  getLicenseTypeLabel,
} from "../../../utils/licenseUtils";

/**
 * Status badge komponenta sa profesionalnim dizajnom
 */
const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    paid: {
      label: "Plaćeno",
      icon: CheckCircle,
      className:
        "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 shadow-green-100",
      iconColor: "text-green-600",
    },
    pending: {
      label: "Na čekanju",
      icon: Clock,
      className:
        "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 shadow-amber-100",
      iconColor: "text-amber-600",
    },
    failed: {
      label: "Neuspešno",
      icon: XCircle,
      className:
        "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 shadow-red-100",
      iconColor: "text-red-600",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${config.className}`}
    >
      <Icon size={14} className={config.iconColor} />
      {config.label}
    </span>
  );
};

/**
 * Filter badge komponenta sa profesionalnim dizajnom
 */
const FilterBadge = ({
  label,
  isActive,
  onClick,
  count,
  color = "default",
}) => {
  const colorStyles = {
    default: isActive
      ? "bg-gradient-to-r from-bluegreen to-sheen text-white shadow-lg shadow-bluegreen/25"
      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200",
    paid: isActive
      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200"
      : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200",
    pending: isActive
      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200"
      : "bg-white text-gray-600 hover:bg-amber-50 border border-gray-200",
    failed: isActive
      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200"
      : "bg-white text-gray-600 hover:bg-red-50 border border-gray-200",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${colorStyles[color]}`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            isActive ? "bg-white/25" : "bg-gray-100"
          }`}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
};

/**
 * Mobile kartica za porudžbinu sa poboljšanim dizajnom
 */
const OrderMobileCard = ({ order, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    whileHover={{ y: -4, boxShadow: "0 12px 40px -12px rgba(0,0,0,0.15)" }}
    className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-5 border border-gray-100/80 cursor-pointer transition-all duration-300"
    onClick={() => onSelect(order)}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-gradient-to-br from-bluegreen/10 to-sheen/10">
          <Receipt className="text-bluegreen" size={18} />
        </div>
        <span className="font-mono text-sm font-bold text-charcoal">
          #{order.id.slice(0, 8)}
        </span>
      </div>
      <OrderStatusBadge status={order.status} />
    </div>

    <div className="space-y-2.5 text-sm">
      <div className="flex items-center gap-2.5 text-gray-600 p-2 rounded-lg bg-gray-50/50">
        <User size={14} className="text-charcoal/60" />
        <span className="font-medium">{order.clientName || "Bez imena"}</span>
      </div>

      <div className="flex items-center gap-2.5 text-gray-600 p-2 rounded-lg bg-gray-50/50">
        <CreditCard size={14} className="text-charcoal/60" />
        <span className="font-bold text-charcoal">
          {order.amount?.toLocaleString("sr-RS")} RSD
        </span>
        <span className="text-gray-400">•</span>
        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium">
          {getLicenseTypeLabel(order.licenseType)}
        </span>
      </div>

      <div className="flex items-center gap-2.5 text-gray-600 p-2 rounded-lg bg-gray-50/50">
        <Calendar size={14} className="text-charcoal/60" />
        <span>{formatLicenseDate(order.createdAt)}</span>
      </div>
    </div>

    <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
      <Link
        to="/prodavnica/admin/licenses"
        className="text-bluegreen text-sm font-semibold flex items-center gap-1.5 hover:underline px-3 py-1.5 rounded-lg hover:bg-bluegreen/5 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        Licenca <ExternalLink size={14} />
      </Link>
    </div>
  </motion.div>
);

export default function OrdersPage() {
  // ===============================================================================
  // STATE
  // ===============================================================================
  const { showSnackbar } = useContext(SnackbarContext);
  const [allowed, setAllowed] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ===============================================================================
  // AUTH CHECK
  // ===============================================================================
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
        [];
      setAllowed(user && adminEmails.includes(user.email));
    });
    return () => unsubscribe();
  }, []);

  // ===============================================================================
  // DATA LOADING
  // ===============================================================================
  useEffect(() => {
    if (!allowed) return;

    setLoading(true);
    const unsubscribe = subscribeOrders((data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowed]);

  // ===============================================================================
  // FILTERED DATA
  // ===============================================================================
  const filteredOrders = orders.filter((order) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesId = order.id?.toLowerCase().includes(query);
      const matchesName = order.clientName?.toLowerCase().includes(query);
      const matchesEmail = order.clientEmail?.toLowerCase().includes(query);
      const matchesKey = order.licenseKey?.toLowerCase().includes(query);
      if (!matchesId && !matchesName && !matchesEmail && !matchesKey)
        return false;
    }

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Status counts for badges
  const statusCounts = {
    all: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    pending: orders.filter((o) => o.status === "pending").length,
    failed: orders.filter((o) => o.status === "failed").length,
  };

  // ===============================================================================
  // HANDLERS
  // ===============================================================================
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      showSnackbar("Status porudžbine ažuriran.", "success");
    } catch {
      showSnackbar("Greška pri ažuriranju statusa.", "error");
    }
  };

  // ===============================================================================
  // RENDER
  // ===============================================================================
  if (allowed === null) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-bluegreen/30 rounded-full" />
          <div className="w-20 h-20 border-4 border-bluegreen border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <p className="mt-6 text-gray-500 font-medium">Provera pristupa...</p>
      </div>
    );
  }

  if (allowed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-10 bg-white rounded-3xl shadow-2xl border border-red-100"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <X size={32} className="text-red-600" />
          </div>
          <h2 className="text-red-700 font-black text-2xl mb-2">
            Pristup odbijen
          </h2>
          <p className="text-gray-500">
            Nemate dozvolu za pristup ovoj stranici.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-bluegreen/5">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-8 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-bluegreen to-sheen shadow-lg shadow-bluegreen/25">
              <ShoppingCart className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-charcoal">
                Porudžbine licenci
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Pregled svih porudžbina
              </p>
            </div>
          </div>
          <Link
            to="/prodavnica/admin/licenses"
            className="px-5 py-2.5 bg-white text-charcoal rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
          >
            <Key size={18} />
            Nazad na licence
          </Link>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-5 mb-6 border border-gray-100/50"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži po ID-u, imenu ili emailu..."
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 transition-all"
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 mr-2 text-gray-400">
                <Filter size={18} />
                <span className="text-sm font-medium hidden sm:inline">
                  Filter:
                </span>
              </div>
              <FilterBadge
                label="Sve"
                isActive={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
                count={statusCounts.all}
                color="default"
              />
              <FilterBadge
                label="Plaćene"
                isActive={statusFilter === "paid"}
                onClick={() => setStatusFilter("paid")}
                count={statusCounts.paid}
                color="paid"
              />
              <FilterBadge
                label="Na čekanju"
                isActive={statusFilter === "pending"}
                onClick={() => setStatusFilter("pending")}
                count={statusCounts.pending}
                color="pending"
              />
              <FilterBadge
                label="Neuspešne"
                isActive={statusFilter === "failed"}
                onClick={() => setStatusFilter("failed")}
                count={statusCounts.failed}
                color="failed"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
            <Sparkles size={14} className="text-bluegreen" />
            <span>
              Pronađeno{" "}
              <strong className="text-charcoal">{filteredOrders.length}</strong>{" "}
              porudžbina
              {searchQuery && (
                <span>
                  {" "}
                  za "<strong className="text-bluegreen">{searchQuery}</strong>"
                </span>
              )}
            </span>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-bluegreen/30 rounded-full" />
                <div className="w-16 h-16 border-4 border-bluegreen border-t-transparent rounded-full animate-spin absolute inset-0" />
              </div>
              <p className="mt-4 text-gray-500 font-medium">
                Učitavanje porudžbina...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
              <div className="p-4 rounded-2xl bg-gray-100/50 inline-block mb-4">
                <ShoppingCart size={48} className="text-gray-300" />
              </div>
              <p className="text-lg text-gray-500 font-medium">
                Nema porudžbina za prikaz
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Porudžbine će se pojaviti ovde kada korisnici kupe licence
              </p>
            </div>
          ) : (
            <>
              {/* Desktop tabela */}
              <div className="hidden lg:block overflow-hidden rounded-2xl shadow-lg border border-gray-200/80 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-bluegreen/10 via-sheen/5 to-bluegreen/10">
                      <tr>
                        <th className="py-4 px-5 text-left text-sm font-bold text-charcoal">
                          <div className="flex items-center gap-2">
                            <Receipt size={16} className="text-bluegreen" />
                            ID porudžbine
                          </div>
                        </th>
                        <th className="py-4 px-5 text-left text-sm font-bold text-charcoal">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-bluegreen" />
                            Klijent
                          </div>
                        </th>
                        <th className="py-4 px-5 text-left text-sm font-bold text-charcoal">
                          <div className="flex items-center gap-2">
                            <Key size={16} className="text-bluegreen" />
                            Licencni ključ
                          </div>
                        </th>
                        <th className="py-4 px-5 text-left text-sm font-bold text-charcoal">
                          Paket
                        </th>
                        <th className="py-4 px-5 text-left text-sm font-bold text-charcoal">
                          <div className="flex items-center gap-2">
                            <CreditCard size={16} className="text-bluegreen" />
                            Iznos
                          </div>
                        </th>
                        <th className="py-4 px-5 text-left text-sm font-bold text-charcoal">
                          Status
                        </th>
                        <th className="py-4 px-5 text-left text-sm font-bold text-charcoal">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-bluegreen" />
                            Datum
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <AnimatePresence>
                        {filteredOrders.map((order, index) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.03 }}
                            className={`hover:bg-gradient-to-r hover:from-bluegreen/5 hover:to-transparent transition-all cursor-pointer group ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                            }`}
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="px-5 py-4">
                              <span className="font-mono text-sm font-semibold text-charcoal bg-gray-100 px-2 py-1 rounded-lg group-hover:bg-bluegreen/10 transition-colors">
                                #{order.id.slice(0, 8)}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div>
                                <div className="font-semibold text-charcoal">
                                  {order.clientName || "-"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {order.clientEmail || "-"}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded-lg">
                                {order.licenseKey || "-"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 text-xs font-semibold text-charcoal border border-gray-200">
                                {getLicenseTypeLabel(order.licenseType)}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-bold text-charcoal">
                                {order.amount?.toLocaleString("sr-RS")} RSD
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              {formatLicenseDate(order.createdAt)}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile kartice */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredOrders.map((order) => (
                    <OrderMobileCard
                      key={order.id}
                      order={order}
                      onSelect={setSelectedOrder}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-md"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative gradients */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-bluegreen/20 to-sheen/10 rounded-full blur-3xl" />

                {/* Header */}
                <div className="relative bg-gradient-to-r from-charcoal via-midnight to-charcoal p-5 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-bluegreen/20 via-transparent to-sheen/20" />
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedOrder(null)}
                    className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <X size={18} />
                  </motion.button>

                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-bluegreen to-sheen shadow-lg">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Detalji porudžbine</h3>
                      <p className="text-white/60 text-xs font-mono">
                        #{selectedOrder.id.slice(0, 12)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 p-5 space-y-4">
                  <div className="p-4 bg-gradient-to-br from-gray-50/80 to-white rounded-2xl border border-gray-100/50">
                    <div className="text-xs text-gray-500 mb-1 font-medium">
                      ID porudžbine
                    </div>
                    <div className="font-mono font-bold text-charcoal text-sm">
                      {selectedOrder.id}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gradient-to-br from-gray-50/80 to-white rounded-2xl border border-gray-100/50">
                      <div className="text-xs text-gray-500 mb-2 font-medium">
                        Status
                      </div>
                      <OrderStatusBadge status={selectedOrder.status} />
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50/80 to-white rounded-2xl border border-gray-100/50">
                      <div className="text-xs text-gray-500 mb-1 font-medium">
                        Iznos
                      </div>
                      <div className="font-black text-charcoal text-lg">
                        {selectedOrder.amount?.toLocaleString("sr-RS")}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          RSD
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-gray-50/80 to-white rounded-2xl border border-gray-100/50">
                    <div className="text-xs text-gray-500 mb-3 font-medium">
                      Klijent
                    </div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="p-1.5 rounded-lg bg-gray-100">
                        <User size={12} className="text-gray-500" />
                      </div>
                      <span className="font-semibold text-charcoal">
                        {selectedOrder.clientName || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-gray-100">
                        <Mail size={12} className="text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {selectedOrder.clientEmail || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-gray-50/80 to-white rounded-2xl border border-gray-100/50">
                    <div className="text-xs text-gray-500 mb-3 font-medium">
                      Licenca
                    </div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="p-1.5 rounded-lg bg-bluegreen/10">
                        <Key size={12} className="text-bluegreen" />
                      </div>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded-lg">
                        {selectedOrder.licenseKey || "-"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Paket:{" "}
                      <span className="font-semibold text-charcoal px-2 py-0.5 bg-bluegreen/10 rounded-lg">
                        {getLicenseTypeLabel(selectedOrder.licenseType)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-gray-50/80 to-white rounded-2xl border border-gray-100/50">
                    <div className="text-xs text-gray-500 mb-2 font-medium">
                      Datum kreiranja
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-gray-100">
                        <Calendar size={12} className="text-gray-500" />
                      </div>
                      <span className="font-medium text-charcoal">
                        {formatLicenseDate(selectedOrder.createdAt)}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.paymentMethod && (
                    <div className="p-4 bg-gradient-to-br from-gray-50/80 to-white rounded-2xl border border-gray-100/50">
                      <div className="text-xs text-gray-500 mb-2 font-medium">
                        Način plaćanja
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-gray-100">
                          <CreditCard size={12} className="text-gray-500" />
                        </div>
                        <span className="font-medium text-charcoal">
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status update buttons */}
                  {selectedOrder.status === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, "paid");
                          setSelectedOrder(null);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl font-bold hover:from-green-100 hover:to-emerald-100 transition-all flex items-center justify-center gap-2 border border-green-200 shadow-sm"
                      >
                        <CheckCircle size={16} />
                        Označi kao plaćeno
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, "failed");
                          setSelectedOrder(null);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-xl font-bold hover:from-red-100 hover:to-rose-100 transition-all flex items-center justify-center gap-2 border border-red-200 shadow-sm"
                      >
                        <XCircle size={16} />
                        Neuspešno
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
