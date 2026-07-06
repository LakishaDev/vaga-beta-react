// src/pages/admin/licensing/LicenseCreatePage.jsx
// ===============================================================================
// LICENSE CREATE PAGE - Sadržaj za kreiranje nove licence (full-page, ne modal)
// ===============================================================================
//
// @description Profesionalna forma za kreiranje licence sa glassmorphism dizajnom.
//              Renderuje se kao deo LicensesPage (view mode "create"), ne kao ruta.
// @version 2.1 - Full-page sadržaj bez sopstvene rute
// ===============================================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Key,
  User,
  Mail,
  Calendar,
  Monitor,
  RefreshCw,
  Wifi,
  Sparkles,
  Clock,
  Shield,
  X,
} from "lucide-react";
import {
  generateLicenseKey,
  LICENSE_TYPES,
  LICENSE_DEFAULTS,
  PACKAGE_MODULES,
} from "../../../utils/licenseUtils";
import { ModuleControlPanel } from "../../../components/admin/licensing";

export default function LicenseCreatePage({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    licenseKey: "",
    clientName: "",
    clientEmail: "",
    licenseType: LICENSE_TYPES.BASIC,
    expiresAt: "",
    maxActivations: 2,
    modules: PACKAGE_MODULES[LICENSE_TYPES.BASIC],
    offlineDaysAllowed: 7,
    isTrial: false,
    autoRenew: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // null = nema animacije u toku; inače drži vrednost dok se knob ne pomeri
  const [isTrialPending, setIsTrialPending] = useState(null);
  const [autoRenewPending, setAutoRenewPending] = useState(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      licenseKey: generateLicenseKey(),
      expiresAt: getDefaultExpiryDate(LICENSE_TYPES.BASIC),
    }));
  }, []);

  const regenerateKey = () => {
    setFormData((prev) => ({
      ...prev,
      licenseKey: generateLicenseKey(),
    }));
  };

  const getDefaultExpiryDate = (type, isTrial = false) => {
    const days = isTrial ? 7 : LICENSE_DEFAULTS[type]?.durationDays || 365;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const handleModuleControlChange = ({ licenseType, modules }) => {
    const defaults = LICENSE_DEFAULTS[licenseType];
    setFormData((prev) => ({
      ...prev,
      licenseType,
      modules,
      ...(licenseType !== LICENSE_TYPES.CUSTOM && defaults
        ? {
            maxActivations: defaults.maxActivations,
            offlineDaysAllowed: defaults.offlineDaysAllowed,
            expiresAt: getDefaultExpiryDate(licenseType, prev.isTrial),
          }
        : {}),
    }));
  };

  const handleTrialToggle = (isTrial) => {
    setFormData((prev) => ({
      ...prev,
      isTrial,
      licenseType: isTrial ? LICENSE_TYPES.TRIAL : LICENSE_TYPES.BASIC,
      maxActivations: isTrial
        ? 1
        : LICENSE_DEFAULTS[LICENSE_TYPES.BASIC]?.maxActivations || 2,
      offlineDaysAllowed: isTrial
        ? 0
        : LICENSE_DEFAULTS[LICENSE_TYPES.BASIC]?.offlineDaysAllowed || 7,
      modules: isTrial
        ? LICENSE_DEFAULTS[LICENSE_TYPES.TRIAL]?.modules || []
        : LICENSE_DEFAULTS[LICENSE_TYPES.BASIC]?.modules || [],
      expiresAt: getDefaultExpiryDate(
        isTrial ? LICENSE_TYPES.TRIAL : LICENSE_TYPES.BASIC,
        isTrial,
      ),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.licenseKey) {
      newErrors.licenseKey = "Licencni ključ je obavezan";
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = "Datum isteka je obavezan";
    }

    if (formData.modules.length === 0) {
      newErrors.modules = "Izaberite bar jedan modul";
    }

    if (formData.maxActivations < 1) {
      newErrors.maxActivations = "Minimum 1 aktivacija";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        expiresAt: new Date(formData.expiresAt),
      });
    } catch (error) {
      console.error("Greška pri kreiranju licence:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-3 rounded-2xl bg-white border border-admin-border text-admin-text hover:bg-admin-surface-tint transition-all shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Nazad na licence"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div className="p-3 rounded-2xl bg-admin-primary shadow-lg shadow-admin-primary/25">
          <Key className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-text-primary">
            Kreiranje nove licence
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Kreirajte licencu za eVaga Desktop aplikaciju
          </p>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        {/* Decorative gradients */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-admin-primary/30 to-admin-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-admin-accent/30 to-admin-primary/20 rounded-full blur-3xl pointer-events-none" />

        <form
          onSubmit={handleSubmit}
          className="relative z-10 p-4 md:p-6 space-y-4 md:space-y-6"
        >
          {/* Trial Toggle - Premium design */}
          <motion.div
            className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 ${
              formData.isTrial
                ? "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-300 shadow-lg shadow-amber-100"
                : "bg-gradient-to-r from-gray-50 to-white border-gray-200"
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    formData.isTrial
                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                      : "bg-gray-200"
                  } transition-all duration-300`}
                >
                  <Clock
                    size={20}
                    className={
                      formData.isTrial ? "text-white" : "text-gray-500"
                    }
                  />
                </div>
                <div>
                  <span
                    className={`font-bold ${
                      formData.isTrial ? "text-amber-800" : "text-gray-700"
                    }`}
                  >
                    Probna licenca (Trial)
                  </span>
                  <p
                    className={`text-xs ${
                      formData.isTrial ? "text-amber-600" : "text-gray-500"
                    }`}
                  >
                    7 dana, 1 aktivacija, bez reset HWID opcije
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTrialPending(!formData.isTrial)}
                className={`relative w-14 md:w-15 h-7 md:h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                  (isTrialPending ?? formData.isTrial)
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-200"
                    : "bg-gray-300"
                }`}
              >
                <motion.span
                  layout
                  className="absolute top-1 left-1 w-5 md:w-5 h-5 md:h-5 bg-white rounded-full shadow-md"
                  animate={{ x: (isTrialPending ?? formData.isTrial) ? 27 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  whileHover={{
                    backgroundColor:
                      (isTrialPending ?? formData.isTrial)
                        ? "#FFEDD5"
                        : "#E5E7EB",
                  }}
                  onAnimationComplete={() => {
                    if (isTrialPending !== null) {
                      handleTrialToggle(isTrialPending);
                      setIsTrialPending(null);
                    }
                  }}
                />
              </button>
            </div>
          </motion.div>

          {/* Licencni ključ */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-admin-text mb-2 md:mb-3">
              <Key size={16} className="text-admin-primary" />
              Licencni ključ
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.licenseKey}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseKey: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl font-mono text-sm md:text-lg tracking-wider focus:border-admin-primary focus:ring-4 focus:ring-admin-primary/10 transition-all"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Shield size={18} className="text-green-500" />
                </div>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={regenerateKey}
                className="px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-br from-admin-primary to-admin-accent text-white rounded-xl hover:shadow-lg hover:shadow-admin-primary/25 transition-all min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
                aria-label="Regeneriši ključ"
              >
                <motion.span
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  className="flex items-center justify-center"
                  transition={{
                    type: "tween",
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                >
                  <RefreshCw size={20} />
                </motion.span>
              </motion.button>
            </div>
            {errors.licenseKey && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <X size={12} /> {errors.licenseKey}
              </p>
            )}
          </div>

          {/* Klijent info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-admin-text mb-2 md:mb-3">
                <User size={16} className="text-admin-primary" />
                Ime klijenta
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                className="w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-admin-primary focus:ring-4 focus:ring-admin-primary/10 transition-all placeholder:text-gray-400"
                placeholder="Ime i prezime ili naziv firme"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-admin-text mb-2 md:mb-3">
                <Mail size={16} className="text-admin-primary" />
                Email klijenta
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, clientEmail: e.target.value })
                }
                className="w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-admin-primary focus:ring-4 focus:ring-admin-primary/10 transition-all placeholder:text-gray-400"
                placeholder="email@primer.com"
              />
            </div>
          </div>

          {/* Licenca i moduli */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-admin-text mb-2 md:mb-3">
              <Sparkles size={16} className="text-admin-primary" />
              Licenca i moduli
            </label>
            <ModuleControlPanel
              licenseType={formData.licenseType}
              modules={formData.modules}
              disabled={formData.isTrial}
              onChange={handleModuleControlChange}
            />
            {errors.modules && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <X size={12} /> {errors.modules}
              </p>
            )}
          </div>

          {/* Datum isteka i aktivacije */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-admin-text mb-2 md:mb-3">
                <Calendar size={16} className="text-admin-primary" />
                Datum isteka
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
                className={`w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-admin-primary focus:ring-4 focus:ring-admin-primary/10 transition-all ${
                  formData.isTrial ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={formData.isTrial}
              />
              {errors.expiresAt && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <X size={12} /> {errors.expiresAt}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-admin-text mb-2 md:mb-3">
                <Monitor size={16} className="text-admin-primary" />
                Maksimalan broj aktivacija
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={formData.maxActivations}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxActivations: parseInt(e.target.value) || 1,
                  })
                }
                className={`w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-admin-primary focus:ring-4 focus:ring-admin-primary/10 transition-all ${
                  formData.isTrial ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={formData.isTrial}
              />
              {errors.maxActivations && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <X size={12} /> {errors.maxActivations}
                </p>
              )}
            </div>
          </div>

          {/* Offline dani */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-admin-text mb-2 md:mb-3">
              <Wifi size={16} className="text-admin-primary" />
              Dozvoljeni offline dani
            </label>
            <input
              type="number"
              min="0"
              max="365"
              value={formData.offlineDaysAllowed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  offlineDaysAllowed: parseInt(e.target.value) || 0,
                })
              }
              className={`w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-admin-primary focus:ring-4 focus:ring-admin-primary/10 transition-all ${
                formData.isTrial ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={formData.isTrial}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Wifi size={12} className="text-gray-400" />
              Broj dana koliko aplikacija može raditi bez internet konekcije
            </p>
          </div>

          {/* Auto renew toggle */}
          {!formData.isTrial && (
            <motion.div
              className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 ${
                formData.autoRenew
                  ? "bg-admin-surface-tint border-admin-border shadow-lg shadow-admin-primary/5"
                  : "bg-gradient-to-r from-gray-50 to-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      formData.autoRenew
                        ? "bg-gradient-to-br from-admin-primary to-admin-accent"
                        : "bg-gray-200"
                    }`}
                  >
                    <RefreshCw
                      size={20}
                      className={
                        formData.autoRenew ? "text-white" : "text-gray-500"
                      }
                    />
                  </div>
                  <div>
                    <span
                      className={`font-bold text-sm md:text-base ${
                        formData.autoRenew
                          ? "text-admin-primary"
                          : "text-gray-700"
                      }`}
                    >
                      Automatsko obnavljanje
                    </span>
                    <p
                      className={`text-xs ${
                        formData.autoRenew
                          ? "text-admin-text/70"
                          : "text-gray-500"
                      }`}
                    >
                      Licenca se automatski produžava po isteku
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRenewPending(!formData.autoRenew)}
                  className={`relative w-14 md:w-15 h-7 md:h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                    (autoRenewPending ?? formData.autoRenew)
                      ? "bg-gradient-to-r from-admin-primary to-admin-accent shadow-lg shadow-admin-primary/20"
                      : "bg-gray-300"
                  }`}
                >
                  <motion.span
                    layout
                    className="absolute top-1 left-1 w-5 md:w-5 h-5 md:h-5 bg-white rounded-full shadow-md"
                    animate={{
                      x: (autoRenewPending ?? formData.autoRenew) ? 27 : 0,
                    }}
                    transition={{
                      type: "tween",
                      duration: 0.4,
                      ease: "backInOut",
                    }}
                    onAnimationComplete={() => {
                      if (autoRenewPending !== null) {
                        setFormData((prev) => ({
                          ...prev,
                          autoRenew: autoRenewPending,
                        }));
                        setAutoRenewPending(null);
                      }
                    }}
                  />
                </button>
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 pt-4 border-t border-gray-100">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex-1 px-6 py-3 md:py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all min-h-[44px]"
            >
              Odustani
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex-1 px-6 py-3 md:py-3.5 bg-gradient-to-r from-admin-primary to-admin-accent text-white rounded-xl font-bold shadow-lg shadow-admin-primary/25 hover:shadow-xl hover:shadow-admin-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw size={18} className="animate-spin" />
                  Kreiranje...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={18} />
                  Kreiraj licencu
                </span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
