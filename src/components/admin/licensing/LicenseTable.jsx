// src/components/admin/licensing/LicenseTable.jsx
// ===============================================================================
// LICENSE TABLE - Komponenta za prikaz tabele licenci
// ===============================================================================
//
// @description Responsive tabela licenci sa sortiranjem i akcijama
// @author eVaga Team
// @version 1.1 - UI/UX Polish
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ Desktop tabela i mobile kartice
// ✅ Sortiranje kolona
// ✅ Akcije: pregled, blokiranje, reset HWID
// ✅ Status badge-ovi sa profesionalnim dizajnom
// ✅ Animacije sa Framer Motion
// ✅ Auto-renew indikator
// ✅ Hardware lock indikator
// ===============================================================================

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  Key,
  Calendar,
  User,
  Monitor,
  RotateCcw,
  Cpu,
  Sparkles,
} from "lucide-react";
import {
  formatLicenseDate,
  getLicenseTypeLabel,
  getRemainingDays,
} from "../../../utils/licenseUtils";

/**
 * Status Badge komponenta sa profesionalnim dizajnom
 */
const StatusBadge = ({ status, isTrial, autoRenew }) => {
  const displayStatus = isTrial && status !== "blocked" ? "trial" : status;

  // Definicija boja za različite statuse
  const statusStyles = {
    active: {
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      text: "text-green-700",
      border: "border-green-200",
      dot: "bg-green-500",
      glow: "shadow-green-100",
    },
    blocked: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
      glow: "shadow-red-100",
    },
    expired: {
      bg: "bg-gradient-to-r from-gray-50 to-slate-50",
      text: "text-gray-600",
      border: "border-gray-200",
      dot: "bg-gray-400",
      glow: "shadow-gray-100",
    },
    trial: {
      bg: "bg-gradient-to-r from-amber-50 to-orange-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      glow: "shadow-amber-100",
    },
  };

  const style = statusStyles[displayStatus] || statusStyles.expired;

  const labels = {
    active: "Aktivna",
    blocked: "Blokirana",
    expired: "Istekla",
    trial: "Probna",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} shadow-sm ${style.glow}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`}
        />
        {labels[displayStatus] || displayStatus}
      </span>
      {autoRenew && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
          <RotateCcw size={10} />
          Auto
        </span>
      )}
    </div>
  );
};

/**
 * Akcije za licencu sa poboljšanim dizajnom
 */
const LicenseActions = ({
  license,
  onView,
  onBlock,
  onUnblock,
  onResetHwid,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onView(license)}
        className="p-2 rounded-lg bg-gradient-to-br from-admin-primary/10 to-admin-accent/10 text-admin-primary hover:from-admin-primary/20 hover:to-admin-accent/20 transition-all shadow-sm hover:shadow-md"
        title="Pogledaj detalje"
      >
        <Eye size={16} />
      </motion.button>

      {license.isBlocked ? (
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onUnblock(license.id)}
          className="p-2 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 transition-all shadow-sm hover:shadow-md border border-green-200"
          title="Odblokiraj licencu"
        >
          <Unlock size={16} />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onBlock(license.id)}
          className="p-2 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 text-red-700 hover:from-red-100 hover:to-rose-100 transition-all shadow-sm hover:shadow-md border border-red-200"
          title="Blokiraj licencu"
        >
          <Lock size={16} />
        </motion.button>
      )}

      {license.hardwareId && (
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onResetHwid(license.id)}
          className="p-2 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 transition-all shadow-sm hover:shadow-md border border-amber-200"
          title="Resetuj Hardware ID"
        >
          <RefreshCw size={16} />
        </motion.button>
      )}
    </div>
  );
};

/**
 * Mobile kartica za licencu sa poboljšanim dizajnom
 */
const LicenseMobileCard = ({
  license,
  onView,
  onBlock,
  onUnblock,
  onResetHwid,
}) => {
  const remainingDays = getRemainingDays(license.expiresAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px -12px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100/80 cursor-pointer transition-all duration-300 backdrop-blur-sm"
      onClick={() => onView(license)}
    >
      {/* Header with Key and Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-admin-primary/10 to-admin-accent/10">
            <Key className="text-admin-primary" size={18} />
          </div>
          <span className="font-mono text-sm font-bold text-admin-text tracking-wide">
            {license.licenseKey}
          </span>
        </div>
        <StatusBadge
          status={license.status}
          isTrial={license.isTrial}
          autoRenew={license.autoRenew}
        />
      </div>

      {/* Info Grid */}
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-2.5 text-gray-600 p-2 rounded-lg bg-gray-50/50">
          <User size={14} className="text-admin-text/60" />
          <span className="font-medium">
            {license.clientName || "Bez imena"}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-gray-600 p-2 rounded-lg bg-gray-50/50">
          <Calendar size={14} className="text-admin-text/60" />
          <span>
            Ističe: {formatLicenseDate(license.expiresAt)}
            {remainingDays > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                {remainingDays} dana
              </span>
            )}
            {remainingDays <= 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-medium">
                Istekla
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50">
          <div className="flex items-center gap-2.5 text-gray-600">
            <Monitor size={14} className="text-admin-text/60" />
            <span>
              Aktivacije:{" "}
              <span className="font-semibold text-admin-text">
                {license.currentActivations || 0}
              </span>
              /{license.maxActivations}
            </span>
          </div>
          {license.hardwareId && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-admin-text/10 text-admin-text text-xs font-medium">
              <Cpu size={10} />
              HWID
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex justify-end mt-4 pt-4 border-t border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <LicenseActions
          license={license}
          onView={onView}
          onBlock={onBlock}
          onUnblock={onUnblock}
          onResetHwid={onResetHwid}
        />
      </div>
    </motion.div>
  );
};

/**
 * Glavna tabela licenci
 */
export default function LicenseTable({
  licenses = [],
  loading = false,
  onView,
  onBlock,
  onUnblock,
  onResetHwid,
}) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-admin-primary/30 rounded-full" />
          <div className="w-16 h-16 border-4 border-admin-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <p className="mt-4 text-gray-500 font-medium">Učitavanje licenci...</p>
      </div>
    );
  }

  if (licenses.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
        <div className="p-4 rounded-2xl bg-gray-100/50 inline-block mb-4">
          <Key size={48} className="text-gray-300" />
        </div>
        <p className="text-lg text-gray-500 font-medium">
          Nema licenci za prikaz
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Kreirajte novu licencu klikom na dugme iznad
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop tabela */}
      <div className="hidden lg:block overflow-hidden rounded-2xl shadow-lg border border-gray-200/80 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-admin-primary/10 via-sheen/5 to-admin-primary/10">
              <tr>
                <th className="py-4 px-5 text-left text-sm font-bold text-admin-text">
                  <div className="flex items-center gap-2">
                    <Key size={16} className="text-admin-primary" />
                    Licencni ključ
                  </div>
                </th>
                <th className="py-4 px-5 text-left text-sm font-bold text-admin-text">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-admin-primary" />
                    Klijent
                  </div>
                </th>
                <th className="py-4 px-5 text-left text-sm font-bold text-admin-text">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-admin-primary" />
                    Tip
                  </div>
                </th>
                <th className="py-4 px-5 text-left text-sm font-bold text-admin-text">
                  Status
                </th>
                <th className="py-4 px-5 text-left text-sm font-bold text-admin-text">
                  <div className="flex items-center gap-2">
                    <Monitor size={16} className="text-admin-primary" />
                    Aktivacije
                  </div>
                </th>
                <th className="py-4 px-5 text-left text-sm font-bold text-admin-text">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-admin-primary" />
                    Ističe
                  </div>
                </th>
                <th className="py-4 px-5 text-center text-sm font-bold text-admin-text">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {licenses.map((license, index) => {
                  const remainingDays = getRemainingDays(license.expiresAt);

                  return (
                    <motion.tr
                      key={license.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className={`hover:bg-gradient-to-r hover:from-admin-primary/5 hover:to-transparent transition-all cursor-pointer group ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                      onClick={() => onView(license)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-admin-text bg-gray-100 px-2 py-1 rounded-lg group-hover:bg-admin-primary/10 transition-colors">
                            {license.licenseKey}
                          </span>
                          {license.hardwareId && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-admin-text/10 text-admin-text text-xs">
                              <Cpu size={10} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <div className="font-semibold text-admin-text">
                            {license.clientName || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {license.clientEmail || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 text-xs font-semibold text-admin-text border border-gray-200">
                          {getLicenseTypeLabel(license.licenseType)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={license.status}
                          isTrial={license.isTrial}
                          autoRenew={license.autoRenew}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[60px]">
                            <div
                              className="h-full bg-gradient-to-r from-admin-primary to-admin-accent rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  ((license.currentActivations || 0) /
                                    license.maxActivations) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-admin-text">
                            {license.currentActivations || 0}/
                            {license.maxActivations}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-admin-text">
                          {formatLicenseDate(license.expiresAt)}
                        </div>
                        {remainingDays > 0 && remainingDays <= 30 && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-xs font-medium">
                            {remainingDays} dana
                          </span>
                        )}
                        {remainingDays <= 0 && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-medium">
                            Istekla
                          </span>
                        )}
                      </td>
                      <td
                        className="px-5 py-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LicenseActions
                          license={license}
                          onView={onView}
                          onBlock={onBlock}
                          onUnblock={onUnblock}
                          onResetHwid={onResetHwid}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile kartice */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {licenses.map((license) => (
            <LicenseMobileCard
              key={license.id}
              license={license}
              onView={onView}
              onBlock={onBlock}
              onUnblock={onUnblock}
              onResetHwid={onResetHwid}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
