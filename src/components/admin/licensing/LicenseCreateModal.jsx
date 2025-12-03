// src/components/admin/licensing/LicenseCreateModal.jsx
// ===============================================================================
// LICENSE CREATE MODAL - Modal za kreiranje nove licence
// ===============================================================================
//
// @description Profesionalna forma za kreiranje licence sa glassmorphism dizajnom
// @author eVaga Team
// @version 1.1 - UI/UX Polish
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ Auto-generisanje licencnog ključa
// ✅ Izbor tipa licence sa vizuelnim feedbackom
// ✅ Podešavanje datuma isteka
// ✅ Konfiguracija maksimalnog broja aktivacija
// ✅ Izbor modula sa toggle dizajnom
// ✅ Trial licenca opcija (7 dana, 1 aktivacija)
// ✅ Glassmorphism efekat
// ✅ Animirani toggle switches
// ===============================================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Key,
  User,
  Mail,
  Calendar,
  Package,
  Monitor,
  RefreshCw,
  Wifi,
  Check,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";
import {
  generateLicenseKey,
  LICENSE_TYPES,
  LICENSE_MODULES,
  LICENSE_DEFAULTS,
  getLicenseTypeLabel,
} from "../../../utils/licenseUtils";

export default function LicenseCreateModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    licenseKey: "",
    clientName: "",
    clientEmail: "",
    licenseType: LICENSE_TYPES.BASIC,
    expiresAt: "",
    maxActivations: 2,
    modules: ["ambalaza"],
    offlineDaysAllowed: 7,
    isTrial: false,
    autoRenew: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Generisanje ključa pri otvaranju
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        licenseKey: generateLicenseKey(),
        expiresAt: getDefaultExpiryDate(LICENSE_TYPES.BASIC),
      }));
      setErrors({});
    }
  }, [isOpen]);

  // Generisanje novog ključa
  const regenerateKey = () => {
    setFormData((prev) => ({
      ...prev,
      licenseKey: generateLicenseKey(),
    }));
  };

  // Dobijanje podrazumevanog datuma isteka
  const getDefaultExpiryDate = (type, isTrial = false) => {
    const days = isTrial ? 7 : LICENSE_DEFAULTS[type]?.durationDays || 365;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  // Ažuriranje tipa licence - primeni podrazumevane vrednosti
  const handleTypeChange = (type) => {
    const defaults = LICENSE_DEFAULTS[type] || {};
    setFormData((prev) => ({
      ...prev,
      licenseType: type,
      maxActivations: defaults.maxActivations || 2,
      offlineDaysAllowed: defaults.offlineDaysAllowed || 7,
      modules: defaults.modules || ["ambalaza"],
      expiresAt: getDefaultExpiryDate(type, prev.isTrial),
    }));
  };

  // Toggle trial mode
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
        ? ["ambalaza"]
        : LICENSE_DEFAULTS[LICENSE_TYPES.BASIC]?.modules || ["ambalaza"],
      expiresAt: getDefaultExpiryDate(
        isTrial ? LICENSE_TYPES.TRIAL : LICENSE_TYPES.BASIC,
        isTrial
      ),
    }));
  };

  // Toggle modul
  const handleModuleToggle = (module) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter((m) => m !== module)
        : [...prev.modules, module],
    }));
  };

  // Validacija forme
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

  // Submit forme
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        expiresAt: new Date(formData.expiresAt),
      });
      onClose();
    } catch (error) {
      console.error("Greška pri kreiranju licence:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-md"
        onClick={onClose}
        data-lenis-prevent
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative gradients */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-bluegreen/30 to-sheen/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-sheen/30 to-bluegreen/20 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative bg-gradient-to-r from-charcoal via-midnight to-charcoal p-6 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-bluegreen/20 via-transparent to-sheen/20" />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:rotate-90 duration-300 z-30"
            >
              <X size={20} />
            </button>
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-bluegreen to-sheen shadow-lg">
                <Key size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Kreiranje nove licence</h2>
                <p className="text-white/70 text-sm mt-0.5">
                  Kreirajte licencu za eVaga Desktop aplikaciju
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 p-6 space-y-6 max-h-[70vh] overflow-y-auto"
          >
            {/* Trial Toggle - Premium design */}
            <motion.div
              className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
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
                  onClick={() => handleTrialToggle(!formData.isTrial)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                    formData.isTrial
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-200"
                      : "bg-gray-300"
                  }`}
                >
                  <motion.span
                    layout
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ x: formData.isTrial ? 3.5 : -28 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    whileHover={{
                      backgroundColor: formData.isTrial ? "#FFEDD5" : "#E5E7EB",
                    }}
                  />
                </button>
              </div>
            </motion.div>

            {/* Licencni ključ */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-3">
                <Key size={16} className="text-bluegreen" />
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
                    className="w-full px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl font-mono text-lg tracking-wider focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all"
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Shield size={18} className="text-green-500" />
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, speed: 0.1 }}
                  onClick={regenerateKey}
                  className="px-4 py-3.5 bg-gradient-to-br from-bluegreen to-sheen text-white rounded-xl hover:shadow-lg hover:shadow-bluegreen/25 transition-all"
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
                <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-3">
                  <User size={16} className="text-bluegreen" />
                  Ime klijenta
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all placeholder:text-gray-400"
                  placeholder="Ime i prezime ili naziv firme"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-3">
                  <Mail size={16} className="text-bluegreen" />
                  Email klijenta
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all placeholder:text-gray-400"
                  placeholder="email@primer.com"
                />
              </div>
            </div>

            {/* Tip licence */}
            {!formData.isTrial && (
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-3">
                  <Sparkles size={16} className="text-bluegreen" />
                  Tip licence
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    LICENSE_TYPES.BASIC,
                    LICENSE_TYPES.PRO,
                    LICENSE_TYPES.ENTERPRISE,
                  ].map((type) => (
                    <motion.button
                      key={type}
                      type="button"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleTypeChange(type)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                        formData.licenseType === type
                          ? "border-bluegreen bg-gradient-to-br from-bluegreen/10 to-sheen/5 shadow-lg shadow-bluegreen/10"
                          : "border-gray-200 hover:border-bluegreen/50 bg-white"
                      }`}
                    >
                      {formData.licenseType === type && (
                        <motion.div
                          layoutId="selectedType"
                          className="absolute inset-0 bg-gradient-to-br from-bluegreen/10 to-sheen/5"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <div className="relative z-10">
                        <span
                          className={`font-bold ${
                            formData.licenseType === type
                              ? "text-bluegreen"
                              : "text-charcoal"
                          }`}
                        >
                          {getLicenseTypeLabel(type)}
                        </span>
                        {formData.licenseType === type && (
                          <Check
                            size={16}
                            className="absolute -top-1 -right-1 text-bluegreen"
                          />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Datum isteka i aktivacije */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-3">
                  <Calendar size={16} className="text-bluegreen" />
                  Datum isteka
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className={`w-full px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all ${
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
                <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-3">
                  <Monitor size={16} className="text-bluegreen" />
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
                  className={`w-full px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all ${
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

            {/* Moduli */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-3">
                <Package size={16} className="text-bluegreen" />
                Dozvoljeni moduli
              </label>
              <div className="flex flex-wrap gap-3">
                {LICENSE_MODULES.map((module) => (
                  <motion.button
                    key={module}
                    type="button"
                    whileHover={{ scale: formData.isTrial ? 1 : 1.05 }}
                    whileTap={{ scale: formData.isTrial ? 1 : 0.95 }}
                    onClick={() =>
                      !formData.isTrial && handleModuleToggle(module)
                    }
                    disabled={formData.isTrial}
                    className={`px-5 py-2.5 rounded-full border-2 transition-all duration-300 font-medium flex items-center gap-2 ${
                      formData.modules.includes(module)
                        ? "border-bluegreen bg-gradient-to-r from-bluegreen to-sheen text-white shadow-lg shadow-bluegreen/25"
                        : "border-gray-200 hover:border-bluegreen/50 bg-white text-charcoal"
                    } ${
                      formData.isTrial ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {formData.modules.includes(module) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <Check size={16} />
                      </motion.span>
                    )}
                    {module.charAt(0).toUpperCase() + module.slice(1)}
                  </motion.button>
                ))}
              </div>
              {errors.modules && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <X size={12} /> {errors.modules}
                </p>
              )}
            </div>

            {/* Offline dani */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-3">
                <Wifi size={16} className="text-bluegreen" />
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
                className={`w-full px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all ${
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
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                  formData.autoRenew
                    ? "bg-gradient-to-r from-bluegreen/10 via-sheen/5 to-bluegreen/10 border-bluegreen/30 shadow-lg shadow-bluegreen/5"
                    : "bg-gradient-to-r from-gray-50 to-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        formData.autoRenew
                          ? "bg-gradient-to-br from-bluegreen to-sheen"
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
                        className={`font-bold ${
                          formData.autoRenew
                            ? "text-bluegreen"
                            : "text-gray-700"
                        }`}
                      >
                        Automatsko obnavljanje
                      </span>
                      <p
                        className={`text-xs ${
                          formData.autoRenew
                            ? "text-zinc-700/90"
                            : "text-gray-500"
                        }`}
                      >
                        Licenca se automatski produžava po isteku
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        autoRenew: !formData.autoRenew,
                      })
                    }
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                      formData.autoRenew
                        ? "bg-gradient-to-r from-bluegreen to-sheen shadow-lg shadow-bluegreen/20"
                        : "bg-gray-300"
                    }`}
                  >
                    <motion.span
                      layout
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                      animate={{ x: formData.autoRenew ? 3.5 : -28 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Submit */}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Odustani
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -15px rgba(110, 174, 162, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-bluegreen via-sheen to-bluegreen bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-bold shadow-lg shadow-bluegreen/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundSize: "200% 100%" }}
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
      </motion.div>
    </AnimatePresence>
  );
}
