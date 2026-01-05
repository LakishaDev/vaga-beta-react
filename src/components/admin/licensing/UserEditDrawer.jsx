// src/components/admin/licensing/UserEditDrawer.jsx
// ===============================================================================
// USER EDIT DRAWER - Drawer za editovanje korisnika
// ===============================================================================
//
// @version 2.0 - Responsive Optimization (DEO 4)
// @updated 2026-01-05
//
// CHANGES:
// ✅ Now uses ResponsiveDrawer wrapper
// ✅ Responsive grid layouts (1 → 2 cols)
// ✅ Touch-optimized controls (44px min)
// ✅ Mobile-first spacing
// ===============================================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Package,
  AlertCircle,
  Check,
  Save,
} from "lucide-react";
import ResponsiveDrawer from "./ResponsiveDrawer";

/**
 * User Edit Drawer komponenta
 */
export default function UserEditDrawer({ isOpen, user, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    role: "user",
    proizvodi: [],
    isAdmin: false,
    active: true,
  });

  const [errors, setErrors] = useState({});

  // Reset errors when drawer opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  // Postavi podatke kad se user promeni
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        role: user.role || "user",
        proizvodi: user.proizvodi || [],
        isAdmin: user.isAdmin || false,
        active: user.active !== undefined ? user.active : true,
      });
    }
  }, [user]);

  // Validacija
  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName) {
      newErrors.displayName = "Ime je obavezno";
    }

    if (!formData.email) {
      newErrors.email = "Email je obavezan";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email nije validan";
    }

    if (formData.proizvodi.length === 0) {
      newErrors.proizvodi = "Izaberite najmanje jedan proizvod";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit with optimistic behavior
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Close immediately for better UX (optimistic)
    const dataToSubmit = { ...formData };
    const userIdToSubmit = user.id;
    
    // Reset state and close
    setErrors({});
    onClose();

    // Submit in background (after drawer closes)
    try {
      await onSubmit(userIdToSubmit, dataToSubmit);
    } catch (error) {
      console.error("Error updating user:", error);
      // Error toast is already shown by parent component
    }
  };

  // Toggle proizvod
  const toggleProizvod = (proizvod) => {
    setFormData((prev) => ({
      ...prev,
      proizvodi: prev.proizvodi.includes(proizvod)
        ? prev.proizvodi.filter((p) => p !== proizvod)
        : [...prev.proizvodi, proizvod],
    }));
  };

  if (!user) return null;

  return (
    <ResponsiveDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Izmena korisnika"
      subtitle={user.email}
      icon={User}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Error Alert */}
        {errors.submit && (
          <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{errors.submit}</div>
          </div>
        )}

        {/* Display Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ime i prezime *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className={`w-full pl-11 pr-4 py-3 md:py-3.5 border rounded-xl focus:ring-2 focus:ring-bluegreen/20 focus:border-bluegreen transition-all ${
                errors.displayName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Petar Petrović"
            />
          </div>
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
          )}
        </div>

        {/* Email - Read Only */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full pl-11 pr-4 py-3 md:py-3.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Email se ne može menjati</p>
        </div>

        {/* Role - RESPONSIVE GRID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rola *
          </label>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
              { value: "user", label: "User", icon: User },
              { value: "operator", label: "Operator", icon: Shield },
              { value: "admin", label: "Admin", icon: Shield },
            ].map(({ value, label, icon: Icon }) => (
              <motion.button
                key={value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, role: value })}
                className={`p-3 md:p-4 border-2 rounded-xl transition-all min-h-[44px] ${
                  formData.role === value
                    ? "border-bluegreen bg-bluegreen/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`w-5 md:w-6 h-5 md:h-6 mx-auto mb-1 md:mb-2 ${
                    formData.role === value
                      ? "text-bluegreen"
                      : "text-gray-400"
                  }`}
                />
                <div
                  className={`text-xs md:text-sm font-semibold ${
                    formData.role === value
                      ? "text-bluegreen"
                      : "text-gray-700"
                  }`}
                >
                  {label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Proizvodi - RESPONSIVE GRID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Proizvodi *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: "evagahub", label: "eVagaHub", color: "blue" },
              { value: "evagatruck", label: "eVagaTruck", color: "green" },
            ].map(({ value, label, color }) => (
              <motion.button
                key={value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleProizvod(value)}
                className={`p-3 md:p-4 border-2 rounded-xl transition-all flex items-center justify-between min-h-[44px] ${
                  formData.proizvodi.includes(value)
                    ? `border-${color}-500 bg-${color}-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package
                    className={`w-5 h-5 ${
                      formData.proizvodi.includes(value)
                        ? `text-${color}-600`
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-semibold text-sm md:text-base ${
                      formData.proizvodi.includes(value)
                        ? `text-${color}-700`
                        : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {formData.proizvodi.includes(value) && (
                  <Check className={`w-5 h-5 text-${color}-600`} />
                )}
              </motion.button>
            ))}
          </div>
          {errors.proizvodi && (
            <p className="mt-1 text-sm text-red-600">{errors.proizvodi}</p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.isAdmin}
              onChange={(e) =>
                setFormData({ ...formData, isAdmin: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-300 text-bluegreen focus:ring-bluegreen"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Admin privilegije
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Aktivan nalog
            </span>
          </label>
        </div>

        {/* Actions - RESPONSIVE */}
        <div className="flex flex-col-reverse md:flex-row gap-3 pt-4 border-t border-gray-200">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 md:py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors min-h-[44px]"
          >
            Otkaži
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 md:py-3.5 bg-gradient-to-r from-bluegreen to-sheen text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-bluegreen/25 transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            Sačuvaj izmene
          </motion.button>
        </div>
      </form>
    </ResponsiveDrawer>
  );
}
