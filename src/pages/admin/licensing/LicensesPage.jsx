// src/pages/admin/licensing/LicensesPage.jsx
// ===============================================================================
// LICENSES PAGE - Glavna stranica za upravljanje licencama
// ===============================================================================
//
// @description Admin stranica za pregled i upravljanje svim licencama
// @author eVaga Team
// @version 1.1 - UI/UX Polish
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ Tabela sa svim licencama
// ✅ Filteri po statusu (active, blocked, expired, trial)
// ✅ Pretraga po ključu ili imenu klijenta
// ✅ Akcije: pregled detalja, blokiranje, reset HWID
// ✅ Kreiranje nove licence
// ✅ Analytics panel
// ✅ Admin autentifikacija
// ✅ Glassmorphism dizajn
// ===============================================================================

import { useState, useEffect } from "react";
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
  LicenseCreateModal,
  LicenseDetailsDrawer,
  LicenseAnalyticsPanel,
} from "../../../components/admin/licensing";

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
  // Boje za različite tipove filtera
  const colorStyles = {
    default: isActive
      ? "bg-gradient-to-r from-bluegreen to-sheen text-white shadow-lg shadow-bluegreen/25"
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

export default function LicensesPage() {
  // ===============================================================================
  // STATE
  // ===============================================================================
  const [allowed, setAllowed] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Optimistic updates hook
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
  } = useLicenseOptimistic(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );

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
  // FILTERED DATA
  // ===============================================================================
  const filteredLicenses = licenses.filter((license) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesKey = license.licenseKey?.toLowerCase().includes(query);
      const matchesName = license.clientName?.toLowerCase().includes(query);
      const matchesEmail = license.clientEmail?.toLowerCase().includes(query);
      if (!matchesKey && !matchesName && !matchesEmail) return false;
    }

    // Status filter (already applied in subscription, but double-check)
    if (statusFilter !== "all") {
      if (statusFilter === "trial") {
        return license.isTrial;
      }
      return license.status === statusFilter;
    }

    return true;
  });

  // Status counts for badges
  const statusCounts = {
    all: licenses.length,
    active: licenses.filter((l) => l.status === "active" && !l.isTrial).length,
    blocked: licenses.filter((l) => l.status === "blocked" || l.isBlocked)
      .length,
    expired: licenses.filter((l) => l.status === "expired").length,
    trial: licenses.filter((l) => l.isTrial).length,
  };

  // ===============================================================================
  // HANDLERS - Koriste optimistic updates iz hooka
  // ===============================================================================
  const handleCreateLicense = async (licenseData) => {
    const success = await createLicense(licenseData);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const handleBlockLicense = async (licenseId) => {
    const success = await blockLicense(licenseId);
    if (success) {
      setSelectedLicense(null);
    }
  };

  const handleUnblockLicense = async (licenseId) => {
    const success = await unblockLicense(licenseId);
    if (success) {
      setSelectedLicense(null);
    }
  };

  const handleResetHwid = async (licenseId) => {
    await resetHardware(licenseId);
  };

  const handleExtendLicense = async (licenseId, days) => {
    await extendLicenseOpt(licenseId, days);
  };

  const handleConvertToPaid = async (licenseId, orderData) => {
    const success = await convertTrialToPaidOpt(licenseId, orderData);
    if (success) {
      setSelectedLicense(null);
    }
  };

  const handleUpdateAutoRenew = async (licenseId, autoRenew) => {
    await updateLicense(licenseId, { autoRenew });
  };

  const handleViewLicense = (license) => {
    setSelectedLicense(license);
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
              <Key className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-charcoal">
                Upravljanje licencama
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                eVaga Desktop License Manager
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm ${
                showAnalytics
                  ? "bg-gradient-to-r from-bluegreen to-sheen text-white shadow-lg shadow-bluegreen/25"
                  : "bg-white text-charcoal hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {showAnalytics ? <List size={18} /> : <BarChart3 size={18} />}
              {showAnalytics ? "Lista" : "Analitika"}
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 20px 40px -15px rgba(110, 174, 162, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-bluegreen via-sheen to-bluegreen text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-bluegreen/25 transition-all"
              style={{ backgroundSize: "200% 100%" }}
            >
              <Plus size={18} />
              Nova licenca
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
                placeholder="Pretraži po ključu, imenu ili emailu..."
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
                label="Aktivne"
                isActive={statusFilter === "active"}
                onClick={() => setStatusFilter("active")}
                count={statusCounts.active}
                color="active"
              />
              <FilterBadge
                label="Blokirane"
                isActive={statusFilter === "blocked"}
                onClick={() => setStatusFilter("blocked")}
                count={statusCounts.blocked}
                color="blocked"
              />
              <FilterBadge
                label="Istekle"
                isActive={statusFilter === "expired"}
                onClick={() => setStatusFilter("expired")}
                count={statusCounts.expired}
                color="expired"
              />
              <FilterBadge
                label="Trial"
                isActive={statusFilter === "trial"}
                onClick={() => setStatusFilter("trial")}
                count={statusCounts.trial}
                color="trial"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
            <Sparkles size={14} className="text-bluegreen" />
            <span>
              Pronađeno{" "}
              <strong className="text-charcoal">
                {filteredLicenses.length}
              </strong>{" "}
              licenci
              {searchQuery && (
                <span>
                  {" "}
                  za "<strong className="text-bluegreen">{searchQuery}</strong>"
                </span>
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
            onView={handleViewLicense}
            onBlock={handleBlockLicense}
            onUnblock={handleUnblockLicense}
            onResetHwid={handleResetHwid}
          />
        </motion.div>

        {/* Create Modal */}
        <LicenseCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLicense}
        />

        {/* Details Drawer */}
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
        />
      </div>
    </div>
  );
}
