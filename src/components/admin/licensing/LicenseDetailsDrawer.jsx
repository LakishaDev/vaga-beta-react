// src/components/admin/licensing/LicenseDetailsDrawer.jsx
// ===============================================================================
// LICENSE DETAILS DRAWER - Drawer sa detaljima licence
// ===============================================================================
//
// @description Profesionalan prikaz svih informacija o licenci sa glassmorphism dizajnom
// @author eVaga Team
// @version 1.1 - UI/UX Polish
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ Prikaz svih podataka o licenci
// ✅ Istorija aktivacija
// ✅ Auto-renew toggle sa animacijom
// ✅ Hardware informacije
// ✅ Istorija produženja
// ✅ Konverzija trial u plaćenu licencu
// ✅ Produženje licence
// ✅ Glassmorphism i gradient dizajn
// ===============================================================================

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Key,
  User,
  Calendar,
  Monitor,
  Lock,
  Unlock,
  RefreshCw,
  ArrowUpRight,
  Package,
  Clock,
  History,
  Server,
  CreditCard,
  Check,
  Cpu,
  Mail,
  Sparkles,
  Shield,
  AlertTriangle,
  GitBranch,
  RotateCcw,
} from "lucide-react";
import {
  formatLicenseDate,
  getLicenseTypeLabel,
  getRemainingDays,
  LICENSE_TYPES,
  PACKAGE_PRICES,
} from "../../../utils/licenseUtils";
import {
  setLicenseVersion,
  clearLicenseVersion,
  subscribePublishedReleases,
} from "../../../services/versionControlService";

/**
 * Sekcija drawer-a sa glassmorphism efektom
 */
const DrawerSection = ({ title, icon: Icon, children, className = "" }) => (
  <motion.div
    className={`mb-6 ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h4 className="text-sm font-bold text-admin-text mb-3 flex items-center gap-2">
      {Icon && (
        <div className="p-1.5 rounded-lg bg-admin-surface-tint border border-admin-border">
          <Icon size={14} className="text-admin-primary" />
        </div>
      )}
      {title}
    </h4>
    {children}
  </motion.div>
);

/**
 * Info red sa poboljšanim dizajnom
 */
const InfoRow = ({ label, value, className = "", icon: Icon }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-gray-100/50 last:border-0">
    <span className="text-gray-500 text-sm flex items-center gap-2">
      {Icon && <Icon size={14} className="text-gray-400" />}
      {label}
    </span>
    <span className={`font-medium text-sm ${className}`}>{value}</span>
  </div>
);

export default function LicenseDetailsDrawer({
  license,
  isOpen,
  onClose,
  onBlock,
  onUnblock,
  onResetHwid,
  onExtend,
  onConvertToPaid,
  onUpdateAutoRenew,
}) {
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [extendDays, setExtendDays] = useState(30);
  const [showConvertForm, setShowConvertForm] = useState(false);
  const [convertType, setConvertType] = useState(LICENSE_TYPES.BASIC);
  const [loading, setLoading] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);

  // Version control state
  const [publishedReleases, setPublishedReleases] = useState([]);
  const [versionForm, setVersionForm] = useState({
    targetVersion: "",
    mandatory: false,
    graceDays: 0,
  });
  const [versionLoading, setVersionLoading] = useState(false);
  const [versionMsg, setVersionMsg] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribePublishedReleases(setPublishedReleases);
    return () => unsub();
  }, [isOpen]);

  // Sync form i autoRenew s podacima licence kad se otvori
  useEffect(() => {
    if (isOpen && license) {
      setVersionForm({
        targetVersion: license.targetVersion ?? "",
        mandatory: license.versionMandatory ?? false,
        graceDays: license.versionGraceDays ?? 0,
      });
      setAutoRenew(license.autoRenew ?? false);
      setVersionMsg(null);
    }
  }, [isOpen, license]);

  // Zaključaj body scroll i sakrij sticky navbar dok je drawer otvoren
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!license) return null;

  const remainingDays = getRemainingDays(license.expiresAt);

  // Definicija boja za status
  const getStatusStyles = (status, isTrial) => {
    const displayStatus = isTrial && status !== "blocked" ? "trial" : status;
    const styles = {
      active: { bg: "bg-green-500", text: "Aktivna", icon: Shield },
      blocked: { bg: "bg-red-500", text: "Blokirana", icon: AlertTriangle },
      expired: { bg: "bg-gray-500", text: "Istekla", icon: Clock },
      trial: { bg: "bg-amber-500", text: "Probna verzija", icon: Clock },
    };
    return styles[displayStatus] || styles.expired;
  };

  const statusInfo = getStatusStyles(license.status, license.isTrial);
  const StatusIcon = statusInfo.icon;

  const handleExtend = async () => {
    setLoading(true);
    try {
      await onExtend(license.id, extendDays);
      setShowExtendForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    setLoading(true);
    try {
      await onConvertToPaid(license.id, {
        licenseType: convertType,
        amount: PACKAGE_PRICES[convertType],
        paymentMethod: "admin",
      });
      setShowConvertForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVersion = async () => {
    setVersionLoading(true);
    setVersionMsg(null);
    try {
      await setLicenseVersion(license.licenseKey, {
        targetVersion: versionForm.targetVersion || null,
        mode: versionForm.targetVersion ? "pin" : "follow",
        mandatory: versionForm.mandatory,
        graceDays: Number(versionForm.graceDays) || null,
      });
      setVersionMsg({ text: "Verzija je primenjena.", type: "success" });
    } catch (err) {
      setVersionMsg({ text: err.message ?? "Greška", type: "error" });
    } finally {
      setVersionLoading(false);
    }
  };

  const handleClearVersion = async () => {
    setVersionLoading(true);
    setVersionMsg(null);
    try {
      await clearLicenseVersion(license.licenseKey);
      setVersionForm({ targetVersion: "", mandatory: false, graceDays: 0 });
      setVersionMsg({
        text: "Verzija resetovana na globalni default.",
        type: "success",
      });
    } catch (err) {
      setVersionMsg({ text: err.message ?? "Greška", type: "error" });
    } finally {
      setVersionLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-screen panel */}
          <motion.div
            key="license-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-admin-surface-tint overflow-y-auto"
            data-lenis-prevent
          >
            {/* Header */}
            <div className="bg-admin-navy px-4 sm:px-8 py-3 text-white sticky top-0 z-10 shadow-lg shadow-admin-navy/30">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-admin-primary shadow-lg flex-shrink-0">
                      <Key size={20} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold truncate">
                      Detalji licence
                    </h3>
                    <div className="font-mono text-xs sm:text-sm bg-white/15 px-3 py-1.5 rounded-lg border border-white/10 truncate max-w-[200px] sm:max-w-none">
                      {license.licenseKey}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusInfo.bg} rounded-full text-xs font-bold text-white shadow-lg flex-shrink-0`}
                    >
                      <StatusIcon size={12} />
                      {statusInfo.text}
                    </span>

                    {license.autoRenew && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-admin-accent/80 rounded-full text-xs font-medium text-white flex-shrink-0">
                        <RefreshCw size={10} />
                        Auto-renew
                      </span>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Content — lg+ two-column grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
              {/* LEFT column: info sekcije + istorija */}
              <div>
                {/* Klijent info */}
                <DrawerSection title="Informacije o klijentu" icon={User}>
                  <div className="bg-gradient-to-br from-gray-50/80 to-white rounded-2xl p-4 border border-gray-100/50 shadow-sm">
                    <InfoRow
                      label="Ime"
                      value={license.clientName || "-"}
                      icon={User}
                    />
                    <InfoRow
                      label="Email"
                      value={license.clientEmail || "-"}
                      icon={Mail}
                    />
                    <InfoRow
                      label="Tip licence"
                      value={
                        <span className="px-2 py-0.5 rounded-lg bg-admin-surface-tint text-admin-primary font-semibold text-xs">
                          {getLicenseTypeLabel(license.licenseType)}
                        </span>
                      }
                      icon={Sparkles}
                    />
                  </div>
                </DrawerSection>

                {/* Status i trajanje */}
                <DrawerSection title="Status i trajanje" icon={Calendar}>
                  <div className="bg-gradient-to-br from-gray-50/80 to-white rounded-2xl p-4 border border-gray-100/50 shadow-sm">
                    <InfoRow
                      label="Kreirana"
                      value={formatLicenseDate(license.createdAt)}
                      icon={Calendar}
                    />
                    <InfoRow
                      label="Ističe"
                      value={formatLicenseDate(license.expiresAt)}
                      className={
                        remainingDays <= 7 ? "text-red-600 font-bold" : ""
                      }
                      icon={Clock}
                    />
                    <InfoRow
                      label="Preostalo dana"
                      value={
                        remainingDays > 0 ? (
                          <span
                            className={`px-2 py-0.5 rounded-lg ${
                              remainingDays <= 7
                                ? "bg-red-100 text-red-700"
                                : remainingDays <= 30
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                            } font-semibold text-xs`}
                          >
                            {remainingDays} dana
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-semibold text-xs">
                            Istekla
                          </span>
                        )
                      }
                    />
                    <InfoRow
                      label="Probna verzija"
                      value={
                        license.isTrial ? (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 font-semibold text-xs">
                            Da
                          </span>
                        ) : (
                          <span className="text-gray-500">Ne</span>
                        )
                      }
                    />
                  </div>
                </DrawerSection>

                {/* Aktivacije */}
                <DrawerSection title="Aktivacije" icon={Monitor}>
                  <div className="bg-gradient-to-br from-gray-50/80 to-white rounded-2xl p-4 border border-gray-100/50 shadow-sm">
                    <div className="flex items-center justify-between py-2 mb-2">
                      <span className="text-gray-500 text-sm">Iskorišćeno</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-admin-primary rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                ((license.currentActivations || 0) /
                                  license.maxActivations) *
                                  100,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="font-bold text-admin-text">
                          {license.currentActivations || 0}/
                          {license.maxActivations}
                        </span>
                      </div>
                    </div>
                    <InfoRow
                      label="Offline dani"
                      value={`${license.offlineDaysAllowed || 0} dana`}
                    />
                    <InfoRow
                      label="Poslednja aktivnost"
                      value={formatLicenseDate(license.lastSeen) || "-"}
                      icon={Clock}
                    />
                  </div>
                </DrawerSection>

                {/* Hardware */}
                {license.hardwareId && (
                  <DrawerSection title="Hardware" icon={Cpu}>
                    <div className="bg-gradient-to-br from-gray-50/80 to-white rounded-2xl p-4 border border-gray-100/50 shadow-sm">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100/50">
                        <span className="text-gray-500 text-sm flex items-center gap-2">
                          <Cpu size={14} className="text-gray-400" />
                          Hardware ID
                        </span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg">
                          {license.hardwareId.slice(0, 24)}...
                        </span>
                      </div>
                      {license.lastHwidReset && (
                        <InfoRow
                          label="Poslednji reset HWID"
                          value={formatLicenseDate(license.lastHwidReset)}
                          icon={RefreshCw}
                        />
                      )}
                    </div>
                  </DrawerSection>
                )}

                {/* Moduli */}
                <DrawerSection title="Dozvoljeni moduli" icon={Package}>
                  <div className="flex flex-wrap gap-2">
                    {(license.modules || []).map((module) => (
                      <motion.span
                        key={module}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-admin-surface-tint text-admin-primary rounded-xl text-sm font-semibold border border-admin-border shadow-sm"
                      >
                        {module.charAt(0).toUpperCase() + module.slice(1)}
                      </motion.span>
                    ))}
                    {(!license.modules || license.modules.length === 0) && (
                      <span className="text-gray-400 text-sm">Nema modula</span>
                    )}
                  </div>
                </DrawerSection>

                {/* Auto renew toggle */}
                <DrawerSection title="Automatsko obnavljanje" icon={RefreshCw}>
                  <motion.div
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                      autoRenew
                        ? "bg-admin-surface-tint border-admin-border"
                        : "bg-gradient-to-r from-gray-50 to-white border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        autoRenew ? "text-admin-primary" : "text-gray-600"
                      }`}
                    >
                      Automatski produži licencu po isteku
                    </span>
                    <button
                      onClick={() => {
                        const next = !autoRenew;
                        setAutoRenew(next);
                        onUpdateAutoRenew(license.id, next);
                      }}
                      className={`relative w-15 h-6 rounded-full transition-all duration-300 ${
                        autoRenew
                          ? "bg-admin-primary shadow-lg shadow-admin-primary/20"
                          : "bg-gray-300"
                      }`}
                    >
                      <motion.span
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: autoRenew ? 27 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                      />
                    </button>
                  </motion.div>
                </DrawerSection>

                {/* Istorija aktivacija */}
                {license.activationHistory &&
                  license.activationHistory.length > 0 && (
                    <DrawerSection title="Istorija aktivacija" icon={History}>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {license.activationHistory
                          .slice(-5)
                          .map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl text-xs border border-gray-100/50"
                            >
                              <div className="p-1.5 rounded-lg bg-gray-100">
                                <Clock size={12} className="text-gray-500" />
                              </div>
                              <span className="flex-1 font-medium text-admin-text">
                                {item.action === "hwid_reset"
                                  ? "HWID Reset"
                                  : item.action}
                              </span>
                              <span className="text-gray-400">
                                {formatLicenseDate(item.timestamp)}
                              </span>
                            </motion.div>
                          ))}
                      </div>
                    </DrawerSection>
                  )}

                {/* Istorija produženja */}
                {license.extensionHistory &&
                  license.extensionHistory.length > 0 && (
                    <DrawerSection
                      title="Istorija produženja"
                      icon={ArrowUpRight}
                    >
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {license.extensionHistory
                          .slice(-5)
                          .map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-white rounded-xl text-xs border border-green-100/50"
                            >
                              <div className="p-1.5 rounded-lg bg-green-100">
                                <Calendar
                                  size={12}
                                  className="text-green-600"
                                />
                              </div>
                              <span className="flex-1 font-medium text-admin-text">
                                {item.action === "trial_to_paid"
                                  ? `Konvertovana u ${item.to}`
                                  : `Produžena za ${item.days} dana`}
                              </span>
                              <span className="text-gray-400">
                                {formatLicenseDate(item.timestamp)}
                              </span>
                            </motion.div>
                          ))}
                      </div>
                    </DrawerSection>
                  )}
              </div>
              {/* end left column */}

              {/* RIGHT column: Kontrola verzije + Akcije */}
              <div>
                {/* Kontrola verzije */}
                <DrawerSection title="Kontrola verzije" icon={GitBranch}>
                  <div className="bg-gradient-to-br from-gray-50/80 to-white rounded-2xl p-4 border border-gray-100/50 shadow-sm space-y-3">
                    {/* Trenutni status */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Režim</span>
                      <span
                        className={`px-2 py-0.5 rounded-lg font-semibold ${license.versionMode === "pin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {license.versionMode === "pin"
                          ? `Pin: v${license.targetVersion}`
                          : "Global default"}
                      </span>
                    </div>
                    {license.downgradeDeadline && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          Downgrade deadline
                        </span>
                        <span className="text-amber-700 font-medium">
                          {formatLicenseDate(license.downgradeDeadline)}
                        </span>
                      </div>
                    )}

                    {/* Forma za pin */}
                    <div className="space-y-2 pt-1">
                      <label className="text-xs text-gray-500 font-medium">
                        Ciljna verzija
                      </label>
                      <select
                        value={versionForm.targetVersion}
                        onChange={(e) =>
                          setVersionForm((f) => ({
                            ...f,
                            targetVersion: e.target.value,
                          }))
                        }
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-admin-primary bg-white"
                      >
                        <option value="">— Prati globalni default —</option>
                        {publishedReleases.map((r) => (
                          <option key={r.id} value={r.version}>
                            v{r.version}
                            {r.isLatest ? " (najnoviji)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-gray-500 font-medium">
                          Grace period (dana)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={versionForm.graceDays}
                          onChange={(e) =>
                            setVersionForm((f) => ({
                              ...f,
                              graceDays: e.target.value,
                            }))
                          }
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-admin-primary"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer mt-5">
                        <input
                          type="checkbox"
                          checked={versionForm.mandatory}
                          onChange={(e) =>
                            setVersionForm((f) => ({
                              ...f,
                              mandatory: e.target.checked,
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">Obavezna</span>
                      </label>
                    </div>

                    {/* Poruka */}
                    {versionMsg && (
                      <p
                        className={`text-xs font-medium ${versionMsg.type === "error" ? "text-red-600" : "text-emerald-600"}`}
                      >
                        {versionMsg.text}
                      </p>
                    )}

                    {/* Dugmad */}
                    <div className="flex gap-2 pt-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApplyVersion}
                        disabled={versionLoading}
                        className="flex-1 py-2.5 rounded-xl bg-admin-primary hover:bg-admin-primary-hover text-white text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-60 shadow-sm transition-colors min-h-[44px]"
                      >
                        <Check size={14} />
                        {versionLoading ? "..." : "Primeni verziju"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClearVersion}
                        disabled={versionLoading}
                        className="px-3 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-60 flex items-center gap-1.5"
                      >
                        <RotateCcw size={14} />
                        Reset
                      </motion.button>
                    </div>
                  </div>
                </DrawerSection>

                {/* Akcije */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-admin-text mb-3">
                    Akcije
                  </h4>

                  {/* Blokiraj/Odblokiraj */}
                  {license.isBlocked ? (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUnblock(license.id)}
                      className="w-full px-4 py-3.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl font-semibold hover:from-green-100 hover:to-emerald-100 transition-all flex items-center justify-center gap-2 border border-green-200 shadow-sm"
                    >
                      <Unlock size={18} />
                      Odblokiraj licencu
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onBlock(license.id)}
                      className="w-full px-4 py-3.5 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-xl font-semibold hover:from-red-100 hover:to-rose-100 transition-all flex items-center justify-center gap-2 border border-red-200 shadow-sm"
                    >
                      <Lock size={18} />
                      Blokiraj licencu
                    </motion.button>
                  )}

                  {/* Reset HWID */}
                  {license.hardwareId && !license.isTrial && (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onResetHwid(license.id)}
                      className="w-full px-4 py-3.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-xl font-semibold hover:from-amber-100 hover:to-orange-100 transition-all flex items-center justify-center gap-2 border border-amber-200 shadow-sm"
                    >
                      <RefreshCw size={18} />
                      Reset Hardware ID
                    </motion.button>
                  )}

                  {/* Produži licencu */}
                  {!showExtendForm ? (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowExtendForm(true)}
                      className="w-full px-4 py-3.5 bg-admin-surface-tint text-admin-primary rounded-xl font-semibold hover:bg-admin-border/30 transition-all flex items-center justify-center gap-2 border border-admin-border min-h-[44px]"
                    >
                      <ArrowUpRight size={18} />
                      Produži licencu
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-admin-surface-tint rounded-2xl border border-admin-border"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={extendDays}
                          onChange={(e) =>
                            setExtendDays(parseInt(e.target.value) || 30)
                          }
                          className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-admin-primary focus:ring-4 focus:ring-admin-primary/10 transition-all"
                        />
                        <span className="text-gray-500 font-medium">dana</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowExtendForm(false)}
                          className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                        >
                          Odustani
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleExtend}
                          disabled={loading}
                          className="flex-1 px-4 py-2.5 bg-admin-primary hover:bg-admin-primary-hover text-white rounded-xl font-semibold disabled:opacity-50 shadow-lg shadow-admin-primary/20 transition-colors min-h-[44px]"
                        >
                          {loading ? "..." : "Produži"}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Konvertuj trial u plaćenu */}
                  {license.isTrial && !showConvertForm && (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowConvertForm(true)}
                      className="w-full px-4 py-3.5 bg-admin-primary hover:bg-admin-primary-hover text-white rounded-xl font-bold shadow-lg shadow-admin-primary/25 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <CreditCard size={18} />
                      Konvertuj u plaćenu licencu
                    </motion.button>
                  )}

                  {showConvertForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-admin-surface-tint rounded-2xl border border-admin-border"
                    >
                      <h5 className="font-bold text-admin-text mb-4 flex items-center gap-2">
                        <Sparkles size={16} className="text-admin-primary" />
                        Izaberite paket:
                      </h5>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          LICENSE_TYPES.BASIC,
                          LICENSE_TYPES.PRO,
                          LICENSE_TYPES.ENTERPRISE,
                        ].map((type) => (
                          <motion.button
                            key={type}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setConvertType(type)}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              convertType === type
                                ? "border-admin-primary bg-admin-surface-tint shadow-lg"
                                : "border-gray-200 hover:border-admin-border bg-white"
                            }`}
                          >
                            <div
                              className={`font-bold text-sm ${
                                convertType === type
                                  ? "text-admin-primary"
                                  : "text-admin-text"
                              }`}
                            >
                              {getLicenseTypeLabel(type)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {PACKAGE_PRICES[type]?.toLocaleString("sr-RS")}{" "}
                              RSD
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowConvertForm(false)}
                          className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                        >
                          Odustani
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleConvert}
                          disabled={loading}
                          className="flex-1 px-4 py-2.5 bg-admin-primary hover:bg-admin-primary-hover text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 font-semibold shadow-lg shadow-admin-primary/20 transition-colors min-h-[44px]"
                        >
                          {loading ? (
                            "..."
                          ) : (
                            <>
                              <Check size={16} /> Konvertuj
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
                {/* end akcije */}
              </div>
              {/* end right column */}
            </div>
            {/* end grid */}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
