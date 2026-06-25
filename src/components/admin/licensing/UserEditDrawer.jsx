import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Package,
  AlertCircle,
  Check,
  Save,
  X,
  Key,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const ROLES = [
  { value: "user", label: "User", icon: User, color: "emerald" },
  { value: "operator", label: "Operator", icon: Shield, color: "blue" },
  { value: "admin", label: "Admin", icon: Shield, color: "purple" },
];

const PRODUCTS = [
  { value: "evagahub", label: "eVagaHub", color: "blue" },
  { value: "evagatruck", label: "eVagaTruck", color: "green" },
];

const colorMap = {
  emerald: {
    border: "border-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: "text-emerald-600",
  },
  blue: {
    border: "border-admin-primary",
    bg: "bg-admin-surface-tint",
    text: "text-admin-primary",
    icon: "text-admin-primary",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "text-purple-600",
  },
  green: {
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    icon: "text-green-600",
  },
};

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-admin-text-muted">{label}</span>
      <span className="text-sm font-medium text-admin-text">
        {value || "—"}
      </span>
    </div>
  );
}

export default function UserEditDrawer({
  isOpen,
  user,
  onClose,
  onSubmit,
  onDelete,
  onChangePassword,
  onToggleActive,
}) {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    role: "user",
    proizvodi: [],
    isAdmin: false,
    active: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

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

  const validate = () => {
    const e = {};
    if (!formData.displayName.trim()) e.displayName = "Ime je obavezno";
    if (!formData.email.trim()) e.email = "Email je obavezan";
    if (formData.proizvodi.length === 0)
      e.proizvodi = "Izaberite najmanje jedan proizvod";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const data = { ...formData };
    const id = user.id;
    setErrors({});
    onClose();
    try {
      await onSubmit(id, data);
    } finally {
      setSaving(false);
    }
  };

  const toggleProizvod = (val) => {
    setFormData((prev) => ({
      ...prev,
      proizvodi: prev.proizvodi.includes(val)
        ? prev.proizvodi.filter((p) => p !== val)
        : [...prev.proizvodi, val],
    }));
  };

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="user-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-admin-surface-tint overflow-y-auto"
          data-lenis-prevent
        >
          {/* Header */}
          <div className="bg-admin-navy px-4 sm:px-8 py-3 text-white sticky top-0 z-10 shadow-lg shadow-admin-navy/30">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-admin-primary flex items-center justify-center font-bold text-sm shadow-lg flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">
                    {user.displayName || "Korisnik"}
                  </h3>
                  <p className="text-sm text-white/60">{user.email}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          {/* Content — lg+ two-column */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
            {/* LEFT — info + brze akcije */}
            <div>
              {/* Status card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                <h4 className="text-sm font-bold text-admin-text mb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-admin-surface-tint border border-admin-border">
                    <User size={14} className="text-admin-primary" />
                  </div>
                  Informacije
                </h4>
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Rola" value={user.role} />
                <InfoRow
                  label="Status"
                  value={user.active ? "Aktivan" : "Neaktivan"}
                />
                <InfoRow label="Admin" value={user.isAdmin ? "Da" : "Ne"} />
                {user.createdAt && (
                  <InfoRow
                    label="Kreiran"
                    value={(
                      user.createdAt?.toDate?.() ?? new Date(user.createdAt)
                    ).toLocaleDateString("sr-RS")}
                  />
                )}
              </div>

              {/* Brze akcije */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h4 className="text-sm font-bold text-admin-text mb-3 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-admin-surface-tint border border-admin-border">
                    <Shield size={14} className="text-admin-primary" />
                  </div>
                  Akcije
                </h4>

                {/* Toggle active */}
                {onToggleActive && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      onToggleActive(user);
                      onClose();
                    }}
                    className={`w-full px-4 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border min-h-[44px] transition-all ${
                      user.active
                        ? "bg-gray-50 text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    }`}
                  >
                    {user.active ? (
                      <ToggleLeft size={18} />
                    ) : (
                      <ToggleRight size={18} />
                    )}
                    {user.active ? "Deaktiviraj nalog" : "Aktiviraj nalog"}
                  </motion.button>
                )}

                {/* Promeni lozinku */}
                {onChangePassword && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      onChangePassword(user);
                      onClose();
                    }}
                    className="w-full px-4 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border border-admin-border bg-admin-surface-tint text-admin-primary hover:bg-admin-border/30 transition-all min-h-[44px]"
                  >
                    <Key size={18} />
                    Promeni lozinku
                  </motion.button>
                )}

                {/* Obriši */}
                {onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      onClose();
                      onDelete(user);
                    }}
                    className="w-full px-4 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all min-h-[44px]"
                  >
                    <Trash2 size={18} />
                    Obriši korisnika
                  </motion.button>
                )}
              </div>
            </div>

            {/* RIGHT — forma */}
            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5"
              >
                <h4 className="text-sm font-bold text-admin-text flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-admin-surface-tint border border-admin-border">
                    <Save size={14} className="text-admin-primary" />
                  </div>
                  Izmena podataka
                </h4>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-700">{errors.submit}</div>
                  </div>
                )}

                {/* Ime */}
                <div>
                  <label className="block text-sm font-semibold text-admin-text mb-1.5">
                    Ime i prezime *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayName: e.target.value,
                        })
                      }
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all text-sm ${
                        errors.displayName
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      placeholder="Petar Petrović"
                    />
                  </div>
                  {errors.displayName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.displayName}
                    </p>
                  )}
                </div>

                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-semibold text-admin-text mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-admin-text-muted">
                    Email se ne može menjati
                  </p>
                </div>

                {/* Rola */}
                <div>
                  <label className="block text-sm font-semibold text-admin-text mb-1.5">
                    Rola *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map(({ value, label, icon: Icon, color }) => {
                      const c = colorMap[color];
                      const active = formData.role === value;
                      return (
                        <motion.button
                          key={value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setFormData({ ...formData, role: value })
                          }
                          className={`p-3 border-2 rounded-xl transition-all min-h-[44px] text-center ${
                            active
                              ? `${c.border} ${c.bg}`
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 mx-auto mb-1 ${active ? c.icon : "text-gray-400"}`}
                          />
                          <div
                            className={`text-xs font-semibold ${active ? c.text : "text-gray-600"}`}
                          >
                            {label}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Proizvodi */}
                <div>
                  <label className="block text-sm font-semibold text-admin-text mb-1.5">
                    Proizvodi *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRODUCTS.map(({ value, label, color }) => {
                      const c = colorMap[color];
                      const active = formData.proizvodi.includes(value);
                      return (
                        <motion.button
                          key={value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleProizvod(value)}
                          className={`p-3 border-2 rounded-xl transition-all flex items-center justify-between min-h-[44px] ${
                            active
                              ? `${c.border} ${c.bg}`
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Package
                              className={`w-4 h-4 ${active ? c.icon : "text-gray-400"}`}
                            />
                            <span
                              className={`text-sm font-semibold ${active ? c.text : "text-gray-600"}`}
                            >
                              {label}
                            </span>
                          </div>
                          {active && <Check className={`w-4 h-4 ${c.icon}`} />}
                        </motion.button>
                      );
                    })}
                  </div>
                  {errors.proizvodi && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.proizvodi}
                    </p>
                  )}
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isAdmin}
                      onChange={(e) =>
                        setFormData({ ...formData, isAdmin: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                    />
                    <div>
                      <div className="text-sm font-medium text-admin-text">
                        Admin privilegije
                      </div>
                      <div className="text-xs text-admin-text-muted">
                        Pristup admin panelu
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-admin-text">
                        Aktivan nalog
                      </div>
                      <div className="text-xs text-admin-text-muted">
                        Korisnik može da se prijavi
                      </div>
                    </div>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-5 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors min-h-[44px] text-sm"
                  >
                    Otkaži
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={saving}
                    className="flex-1 px-5 py-3 bg-admin-primary hover:bg-admin-primary-hover text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 min-h-[44px] text-sm disabled:opacity-60 shadow-lg shadow-admin-primary/20"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Čuvanje..." : "Sačuvaj"}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
