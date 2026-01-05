// src/components/admin/licensing/LicenseCreateModalResponsive.jsx
// ===============================================================================
// LICENSE CREATE MODAL (RESPONSIVE VERSION) - DEO 3
// ===============================================================================
//
// @description Responsive verzija LicenseCreateModal-a koristeći ResponsiveModal wrapper
// @version 2.0 - Responsive Optimization
//
// RAZLIKE OD ORIGINALA:
// ✅ Koristi ResponsiveModal wrapper
// ✅ Full-screen na mobilnom (<768px)
// ✅ Swipe-to-close gesture
// ✅ Touch-optimized form controls
// ✅Responz grid layout (1 col mobile, 2 cols desktop)
// ===============================================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
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
import ResponsiveModal from "./ResponsiveModal";
import {
  generateLicenseKey,
  LICENSE_TYPES,
  LICENSE_MODULES,
  LICENSE_DEFAULTS,
  getLicenseTypeLabel,
} from "../../../utils/licenseUtils";

export default function LicenseCreateModalResponsive({ isOpen, onClose, onSubmit }) {
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

  const handleModuleToggle = (module) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter((m) => m !== module)
        : [...prev.modules, module],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.licenseKey) newErrors.licenseKey = "Licencni ključ je obavezan";
    if (!formData.expiresAt) newErrors.expiresAt = "Datum isteka je obavezan";
    if (formData.modules.length === 0) newErrors.modules = "Izaberite bar jedan modul";
    if (formData.maxActivations < 1) newErrors.maxActivations = "Minimum 1 aktivacija";
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
      onClose();
    } catch (error) {
      console.error("Greška pri kreiranju licence:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Kreiranje nove licence"
      subtitle="Kreirajte licencu za eVaga Desktop aplikaciju"
      icon={Key}
      maxWidth="2xl"
      fullScreenOnMobile={true}
    >
      <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Trial Toggle */}
        <motion.div
          className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 ${
            formData.isTrial
              ? "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-300 shadow-lg shadow-amber-100"
              : "bg-gradient-to-r from-gray-50 to-white border-gray-200"
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between gap-3">
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
                  className={formData.isTrial ? "text-white" : "text-gray-500"}
                />
              </div>
              <div className="flex-1">
                <span
                  className={`font-bold text-sm md:text-base ${
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
                  7 dana, 1 aktivacija
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleTrialToggle(!formData.isTrial)}
              className={`relative w-14 md:w-16 h-7 md:h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                formData.isTrial
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-200"
                  : "bg-gray-300"
              }`}
            >
              <motion.span
                layout
                className="absolute top-1 w-5 md:w-6 h-5 md:h-6 bg-white rounded-full shadow-md"
                animate={{ x: formData.isTrial ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        {/* Licencni ključ */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-2 md:mb-3">
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
                className="w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl font-mono text-sm md:text-lg tracking-wider focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all"
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
              className="px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-br from-bluegreen to-sheen text-white rounded-xl hover:shadow-lg hover:shadow-bluegreen/25 transition-all min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
              aria-label="Regenerate key"
            >
              <RefreshCw size={20} />
            </motion.button>
          </div>
        </div>

        {/* Klijent info - RESPONSIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-2 md:mb-3">
              <User size={16} className="text-bluegreen" />
              Ime klijenta
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              className="w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all placeholder:text-gray-400"
              placeholder="Ime i prezime"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-2 md:mb-3">
              <Mail size={16} className="text-bluegreen" />
              Email
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) =>
                setFormData({ ...formData, clientEmail: e.target.value })
              }
              className="w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all placeholder:text-gray-400"
              placeholder="email@primer.com"
            />
          </div>
        </div>

        {/* Tip licence - RESPONSIVE GRID */}
        {!formData.isTrial && (
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-2 md:mb-3">
              <Sparkles size={16} className="text-bluegreen" />
              Tip licence
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
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
                  className={`relative p-3 md:p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden min-h-[44px] ${
                    formData.licenseType === type
                      ? "border-bluegreen bg-gradient-to-br from-bluegreen/10 to-sheen/5 shadow-lg shadow-bluegreen/10"
                      : "border-gray-200 hover:border-bluegreen/50 bg-white"
                  }`}
                >
                  <span
                    className={`font-bold text-xs md:text-base ${
                      formData.licenseType === type
                        ? "text-bluegreen"
                        : "text-charcoal"
                    }`}
                  >
                    {getLicenseTypeLabel(type)}
                  </span>
                  {formData.licenseType === type && (
                    <Check
                      size={14}
                      className="absolute top-2 right-2 text-bluegreen"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Datum i aktivacije - RESPONSIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-2 md:mb-3">
              <Calendar size={16} className="text-bluegreen" />
              Datum isteka
            </label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) =>
                setFormData({ ...formData, expiresAt: e.target.value })
              }
              className={`w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all ${
                formData.isTrial ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={formData.isTrial}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-2 md:mb-3">
              <Monitor size={16} className="text-bluegreen" />
              Max aktivacija
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
              className={`w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all ${
                formData.isTrial ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={formData.isTrial}
            />
          </div>
        </div>

        {/* Moduli - RESPONSIVE FLEX WRAP */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-2 md:mb-3">
            <Package size={16} className="text-bluegreen" />
            Moduli
          </label>
          <div className="flex flex-wrap gap-2">
            {LICENSE_MODULES.map((module) => (
              <motion.button
                key={module}
                type="button"
                whileHover={{ scale: formData.isTrial ? 1 : 1.05 }}
                whileTap={{ scale: formData.isTrial ? 1 : 0.95 }}
                onClick={() => !formData.isTrial && handleModuleToggle(module)}
                disabled={formData.isTrial}
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full border-2 transition-all duration-300 font-medium flex items-center gap-2 text-xs md:text-sm min-h-[44px] md:min-h-0 ${
                  formData.modules.includes(module)
                    ? "border-bluegreen bg-gradient-to-r from-bluegreen to-sheen text-white shadow-lg shadow-bluegreen/25"
                    : "border-gray-200 hover:border-bluegreen/50 bg-white text-charcoal"
                } ${formData.isTrial ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {formData.modules.includes(module) && <Check size={16} />}
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Offline dani */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-charcoal mb-2 md:mb-3">
            <Wifi size={16} className="text-bluegreen" />
            Offline dani
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
            className={`w-full px-3 md:px-4 py-3 md:py-3.5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:border-bluegreen focus:ring-4 focus:ring-bluegreen/10 transition-all ${
              formData.isTrial ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={formData.isTrial}
          />
        </div>

        {/* Auto renew */}
        {!formData.isTrial && (
          <motion.div
            className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 ${
              formData.autoRenew
                ? "bg-gradient-to-r from-bluegreen/10 via-sheen/5 to-bluegreen/10 border-bluegreen/30 shadow-lg shadow-bluegreen/5"
                : "bg-gradient-to-r from-gray-50 to-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
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
                    className={formData.autoRenew ? "text-white" : "text-gray-500"}
                  />
                </div>
                <div>
                  <span
                    className={`font-bold text-sm md:text-base ${
                      formData.autoRenew ? "text-bluegreen" : "text-gray-700"
                    }`}
                  >
                    Auto obnavljanje
                  </span>
                  <p
                    className={`text-xs ${
                      formData.autoRenew ? "text-zinc-700/90" : "text-gray-500"
                    }`}
                  >
                    Automatsko produženje
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
                className={`relative w-14 md:w-16 h-7 md:h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                  formData.autoRenew
                    ? "bg-gradient-to-r from-bluegreen to-sheen shadow-lg shadow-bluegreen/20"
                    : "bg-gray-300"
                }`}
              >
                <motion.span
                  layout
                  className="absolute top-1 w-5 md:w-6 h-5 md:h-6 bg-white rounded-full shadow-md"
                  animate={{ x: formData.autoRenew ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </motion.div>
        )}

        {/* Submit buttons - RESPONSIVE */}
        <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 pt-4 border-t border-gray-100">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all min-h-[44px]"
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
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-bluegreen via-sheen to-bluegreen bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-bold shadow-lg shadow-bluegreen/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
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
    </ResponsiveModal>
  );
}
