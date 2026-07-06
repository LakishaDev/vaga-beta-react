import { useState, useEffect, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Plus,
  Search,
  Filter,
  BarChart3,
  List,
  X,
  Sparkles,
} from "lucide-react";
import { auth } from "../../../utils/firebase";
import { useLicenseOptimistic } from "../../../hooks/useLicenseOptimistic";
import {
  LicenseTable,
  LicenseDetailsDrawer,
  LicenseAnalyticsPanel,
} from "../../../components/admin/licensing";
import LicenseCreatePage from "./LicenseCreatePage";

const FilterBadge = ({ label, isActive, onClick, count, color = "default" }) => {
  const colorStyles = {
    default: isActive
      ? "bg-admin-primary text-white shadow-lg shadow-admin-primary/25"
      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200",
    active: isActive
      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200"
      : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200",
    blocked: isActive
      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200"
      : "bg-white text-gray-600 hover:bg-red-50 border border-gray-200",
    expired: isActive
      ? "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-200"
      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200",
    trial: isActive
      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200"
      : "bg-white text-gray-600 hover:bg-amber-50 border border-gray-200",
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
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/25" : "bg-gray-100"}`}>
          {count}
        </span>
      )}
    </motion.button>
  );
};

export default function LicensesPage() {
  const [allowed, setAllowed] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" | "create"

  const filters = useMemo(() => {
    return statusFilter !== "all" ? { status: statusFilter } : {};
  }, [statusFilter]);

  const {
    licenses,
    loading,
    operations: {
      createLicense,
      updateLicense,
      blockLicense,
      unblockLicense,
      resetHardware,
      extendLicense: extendLicenseOpt,
      convertTrialToPaid: convertTrialToPaidOpt,
    },
  } = useLicenseOptimistic(filters);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
      setAllowed(user && adminEmails.includes(user.email));
    });
    return () => unsubscribe();
  }, []);

  const filteredLicenses = licenses.filter((license) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesKey = license.licenseKey?.toLowerCase().includes(query);
      const matchesName = license.clientName?.toLowerCase().includes(query);
      const matchesEmail = license.clientEmail?.toLowerCase().includes(query);
      if (!matchesKey && !matchesName && !matchesEmail) return false;
    }
    if (statusFilter !== "all") {
      if (statusFilter === "trial") return license.isTrial;
      return license.status === statusFilter;
    }
    return true;
  });

  const statusCounts = {
    all: licenses.length,
    active: licenses.filter((l) => l.status === "active" && !l.isTrial).length,
    blocked: licenses.filter((l) => l.status === "blocked" || l.isBlocked).length,
    expired: licenses.filter((l) => l.status === "expired").length,
    trial: licenses.filter((l) => l.isTrial).length,
  };

  const handleCreateLicense = async (licenseData) => {
    const success = await createLicense(licenseData);
    if (success) setViewMode("list");
  };

  const handleBlockLicense = async (licenseId) => {
    const success = await blockLicense(licenseId);
    if (success) setSelectedLicense(null);
  };

  const handleUnblockLicense = async (licenseId) => {
    const success = await unblockLicense(licenseId);
    if (success) setSelectedLicense(null);
  };

  const handleResetHwid = async (licenseId) => {
    await resetHardware(licenseId);
  };

  const handleExtendLicense = async (licenseId, days) => {
    await extendLicenseOpt(licenseId, days);
  };

  const handleConvertToPaid = async (licenseId, orderData) => {
    const success = await convertTrialToPaidOpt(licenseId, orderData);
    if (success) setSelectedLicense(null);
  };

  const handleUpdateAutoRenew = async (licenseId, autoRenew) => {
    await updateLicense(licenseId, { autoRenew });
  };

  const handleUpdateModules = async (licenseId, { modules, licenseType }) => {
    await updateLicense(licenseId, { modules, licenseType });
  };

  if (allowed === null) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-admin-primary/30 rounded-full" />
          <div className="w-20 h-20 border-4 border-admin-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
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
          <h2 className="text-red-700 font-black text-2xl mb-2">Pristup odbijen</h2>
          <p className="text-gray-500">Nemate dozvolu za pristup ovoj stranici.</p>
        </motion.div>
      </div>
    );
  }

  if (viewMode === "create") {
    return (
      <div className="min-h-screen bg-admin-surface-tint">
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-8 pt-8">
          <LicenseCreatePage
            onBack={() => setViewMode("list")}
            onSubmit={handleCreateLicense}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-surface-tint">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-8 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-admin-primary shadow-lg shadow-admin-primary/25">
              <Key className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-text-primary">
                Upravljanje licencama
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">eVaga Desktop License Manager</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm min-h-[44px] ${
                showAnalytics
                  ? "bg-admin-primary text-white shadow-lg shadow-admin-primary/25"
                  : "bg-white text-admin-text hover:bg-admin-surface-tint border border-admin-border"
              }`}
            >
              {showAnalytics ? <List size={18} /> : <BarChart3 size={18} />}
              <span className="hidden sm:inline">{showAnalytics ? "Lista" : "Analitika"}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("create")}
              className="px-4 py-2.5 bg-admin-primary hover:bg-admin-primary-hover text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-admin-primary/25 transition-colors min-h-[44px]"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova licenca</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Panel */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <LicenseAnalyticsPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-5 mb-6 border border-gray-100/50"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži po ključu, imenu ili emailu..."
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-admin-primary focus:ring-4 focus:ring-admin-primary/10 transition-all placeholder:text-gray-400"
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

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 mr-2 text-gray-400">
                <Filter size={18} />
                <span className="text-sm font-medium hidden sm:inline">Filter:</span>
              </div>
              <FilterBadge label="Sve" isActive={statusFilter === "all"} onClick={() => setStatusFilter("all")} count={statusCounts.all} color="default" />
              <FilterBadge label="Aktivne" isActive={statusFilter === "active"} onClick={() => setStatusFilter("active")} count={statusCounts.active} color="active" />
              <FilterBadge label="Blokirane" isActive={statusFilter === "blocked"} onClick={() => setStatusFilter("blocked")} count={statusCounts.blocked} color="blocked" />
              <FilterBadge label="Istekle" isActive={statusFilter === "expired"} onClick={() => setStatusFilter("expired")} count={statusCounts.expired} color="expired" />
              <FilterBadge label="Trial" isActive={statusFilter === "trial"} onClick={() => setStatusFilter("trial")} count={statusCounts.trial} color="trial" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
            <Sparkles size={14} className="text-admin-primary" />
            <span>
              Pronađeno{" "}
              <strong className="text-text-primary">{filteredLicenses.length}</strong>{" "}
              licenci
              {searchQuery && (
                <span> za "<strong className="text-admin-primary">{searchQuery}</strong>"</span>
              )}
            </span>
          </div>
        </motion.div>

        {/* License Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LicenseTable
            licenses={filteredLicenses}
            loading={loading}
            onView={(license) => setSelectedLicense(license)}
            onBlock={handleBlockLicense}
            onUnblock={handleUnblockLicense}
            onResetHwid={handleResetHwid}
          />
        </motion.div>

        <LicenseDetailsDrawer
          license={selectedLicense}
          isOpen={!!selectedLicense}
          onClose={() => setSelectedLicense(null)}
          onBlock={handleBlockLicense}
          onUnblock={handleUnblockLicense}
          onResetHwid={handleResetHwid}
          onExtend={handleExtendLicense}
          onConvertToPaid={handleConvertToPaid}
          onUpdateAutoRenew={handleUpdateAutoRenew}
          onUpdateModules={handleUpdateModules}
        />
      </div>
    </div>
  );
}
