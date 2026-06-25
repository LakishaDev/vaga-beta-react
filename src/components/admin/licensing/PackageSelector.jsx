// src/components/admin/licensing/PackageSelector.jsx
// ===============================================================================
// PACKAGE SELECTOR - Komponenta za izbor paketa licence
// ===============================================================================
//
// @description Profesionalna komponenta za prikaz i izbor paketa licence
// @author eVaga Team
// @version 1.1 - UI/UX Polish
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ Prikaz tri paketa (Basic, Pro, Enterprise)
// ✅ Uporedni prikaz funkcionalnosti
// ✅ Animacije sa Framer Motion
// ✅ Responsive dizajn
// ✅ Glassmorphism efekat
// ✅ Poboljšani hover efekti
// ===============================================================================

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Check,
  X,
  Package,
  Printer,
  Cloud,
  Zap,
  Crown,
  Star,
  Sparkles,
} from "lucide-react";
import {
  LICENSE_TYPES,
  LICENSE_DEFAULTS,
  PACKAGE_PRICES,
  getLicenseTypeLabel,
} from "../../../utils/licenseUtils";

/**
 * Feature red za poređenje sa poboljšanim dizajnom
 */
const FeatureRow = ({ feature, packages, selectedPackage }) => (
  <tr className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-colors">
    <td className="py-3.5 px-4 text-sm text-gray-700 font-medium">
      {feature.label}
    </td>
    {packages.map((pkg) => (
      <td
        key={pkg}
        className={`py-3.5 px-4 text-center transition-all ${
          selectedPackage === pkg ? "bg-admin-primary/5" : ""
        }`}
      >
        {feature.values[pkg] === true ? (
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
            <Check className="text-green-600" size={14} />
          </div>
        ) : feature.values[pkg] === false ? (
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
            <X className="text-gray-400" size={14} />
          </div>
        ) : (
          <span className="text-sm font-semibold text-admin-text bg-gray-100 px-2 py-0.5 rounded-lg">
            {feature.values[pkg]}
          </span>
        )}
      </td>
    ))}
  </tr>
);

/**
 * Kartica paketa sa glassmorphism efektom
 */
const PackageCard = ({ type, isSelected, onSelect, isPopular = false }) => {
  const defaults = LICENSE_DEFAULTS[type];
  const price = PACKAGE_PRICES[type];

  const moduleIcons = {
    ambalaza: Package,
    stampa: Printer,
    cloud: Cloud,
  };

  // Ikone za tipove paketa
  const packageIcons = {
    [LICENSE_TYPES.BASIC]: Star,
    [LICENSE_TYPES.PRO]: Crown,
    [LICENSE_TYPES.ENTERPRISE]: Sparkles,
  };

  const PackageIcon = packageIcons[type] || Star;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(type)}
      className={`relative cursor-pointer rounded-3xl p-6 transition-all duration-300 overflow-hidden ${
        isSelected
          ? "bg-gradient-to-br from-charcoal via-midnight to-charcoal text-white shadow-2xl shadow-charcoal/30 ring-4 ring-admin-primary/30"
          : "bg-white/90 backdrop-blur-xl border-2 border-gray-200 hover:border-admin-primary/50 hover:shadow-xl"
      }`}
    >
      {/* Decorative elements */}
      {isSelected && (
        <>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-admin-primary/30 to-admin-accent/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-admin-accent/30 to-admin-primary/20 rounded-full blur-2xl" />
        </>
      )}

      {/* Popular badge */}
      {isPopular && (
        <motion.div
          className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-amber-200/50 flex items-center gap-1.5">
            <Zap size={12} className="animate-pulse" />
            Najpopularniji
          </span>
        </motion.div>
      )}

      <div className="relative z-10">
        {/* Icon and Name */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2.5 rounded-xl ${
              isSelected
                ? "bg-gradient-to-br from-admin-primary to-admin-accent"
                : "bg-gray-100"
            } transition-all`}
          >
            <PackageIcon
              size={22}
              className={isSelected ? "text-white" : "text-gray-600"}
            />
          </div>
          <h3
            className={`text-xl font-black ${
              isSelected ? "text-white" : "text-admin-text"
            }`}
          >
            {getLicenseTypeLabel(type)}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl font-black ${
                isSelected ? "text-white" : "text-admin-primary"
              }`}
            >
              {price?.toLocaleString("sr-RS")}
            </span>
            <span
              className={`text-lg ${
                isSelected ? "text-white/80" : "text-gray-500"
              }`}
            >
              RSD
            </span>
          </div>
          <span
            className={`text-sm ${
              isSelected ? "text-white/60" : "text-gray-400"
            }`}
          >
            godišnje
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-5">
          <li
            className={`flex items-center gap-2.5 text-sm ${
              isSelected ? "text-white/90" : "text-gray-600"
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                isSelected ? "bg-admin-primary/30" : "bg-green-100"
              }`}
            >
              <Check
                size={12}
                className={isSelected ? "text-admin-primary" : "text-green-600"}
              />
            </div>
            <span>
              <strong>{defaults?.maxActivations}</strong> aktivacije
            </span>
          </li>
          <li
            className={`flex items-center gap-2.5 text-sm ${
              isSelected ? "text-white/90" : "text-gray-600"
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                isSelected ? "bg-admin-primary/30" : "bg-green-100"
              }`}
            >
              <Check
                size={12}
                className={isSelected ? "text-admin-primary" : "text-green-600"}
              />
            </div>
            <span>
              <strong>{defaults?.offlineDaysAllowed}</strong> dana offline
            </span>
          </li>
          <li
            className={`flex items-center gap-2.5 text-sm ${
              isSelected ? "text-white/90" : "text-gray-600"
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                isSelected ? "bg-admin-primary/30" : "bg-green-100"
              }`}
            >
              <Check
                size={12}
                className={isSelected ? "text-admin-primary" : "text-green-600"}
              />
            </div>
            <span>
              <strong>{defaults?.durationDays}</strong> dana trajanja
            </span>
          </li>
        </ul>

        {/* Modules */}
        <div
          className={`pt-4 border-t ${
            isSelected ? "border-white/20" : "border-gray-100"
          }`}
        >
          <p
            className={`text-xs font-bold mb-3 ${
              isSelected ? "text-white/70" : "text-gray-500"
            }`}
          >
            Uključeni moduli:
          </p>
          <div className="flex flex-wrap gap-2">
            {defaults?.modules?.map((module) => {
              const Icon = moduleIcons[module] || Package;
              return (
                <span
                  key={module}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-white/15 text-white border border-white/10"
                      : "bg-admin-primary/10 text-admin-primary border border-admin-primary/20"
                  }`}
                >
                  <Icon size={12} />
                  {module.charAt(0).toUpperCase() + module.slice(1)}
                </span>
              );
            })}
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4"
          >
            <div className="p-2 rounded-full bg-gradient-to-br from-admin-primary to-admin-accent shadow-lg">
              <Check size={16} className="text-white" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Glavna komponenta za izbor paketa
 */
export default function PackageSelector({
  selectedPackage,
  onSelectPackage,
  showComparison = true,
}) {
  const packages = [
    LICENSE_TYPES.BASIC,
    LICENSE_TYPES.PRO,
    LICENSE_TYPES.ENTERPRISE,
  ];

  const features = [
    {
      label: "Maksimalan broj aktivacija",
      values: {
        [LICENSE_TYPES.BASIC]: "2",
        [LICENSE_TYPES.PRO]: "5",
        [LICENSE_TYPES.ENTERPRISE]: "Neograničeno",
      },
    },
    {
      label: "Offline dani",
      values: {
        [LICENSE_TYPES.BASIC]: "7",
        [LICENSE_TYPES.PRO]: "14",
        [LICENSE_TYPES.ENTERPRISE]: "30",
      },
    },
    {
      label: "Trajanje licence",
      values: {
        [LICENSE_TYPES.BASIC]: "365 dana",
        [LICENSE_TYPES.PRO]: "365 dana",
        [LICENSE_TYPES.ENTERPRISE]: "365 dana",
      },
    },
    {
      label: "Modul Ambalaza",
      values: {
        [LICENSE_TYPES.BASIC]: true,
        [LICENSE_TYPES.PRO]: true,
        [LICENSE_TYPES.ENTERPRISE]: true,
      },
    },
    {
      label: "Modul Štampa",
      values: {
        [LICENSE_TYPES.BASIC]: false,
        [LICENSE_TYPES.PRO]: true,
        [LICENSE_TYPES.ENTERPRISE]: true,
      },
    },
    {
      label: "Modul Cloud",
      values: {
        [LICENSE_TYPES.BASIC]: false,
        [LICENSE_TYPES.PRO]: false,
        [LICENSE_TYPES.ENTERPRISE]: true,
      },
    },
    {
      label: "Reset Hardware ID",
      values: {
        [LICENSE_TYPES.BASIC]: true,
        [LICENSE_TYPES.PRO]: true,
        [LICENSE_TYPES.ENTERPRISE]: true,
      },
    },
    {
      label: "Prioritetna podrška",
      values: {
        [LICENSE_TYPES.BASIC]: false,
        [LICENSE_TYPES.PRO]: true,
        [LICENSE_TYPES.ENTERPRISE]: true,
      },
    },
    {
      label: "Pristup novim funkcijama",
      values: {
        [LICENSE_TYPES.BASIC]: false,
        [LICENSE_TYPES.PRO]: false,
        [LICENSE_TYPES.ENTERPRISE]: true,
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((type, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PackageCard
              type={type}
              isSelected={selectedPackage === type}
              onSelect={onSelectPackage}
              isPopular={type === LICENSE_TYPES.PRO}
            />
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-gray-100/80"
        >
          <div className="p-5 bg-gradient-to-r from-admin-primary/10 via-sheen/5 to-admin-primary/10 border-b border-gray-100/50">
            <h4 className="font-black text-admin-text flex items-center gap-2">
              <Sparkles size={18} className="text-admin-primary" />
              Uporedni prikaz funkcionalnosti
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="py-4 px-4 text-left text-sm font-bold text-admin-text w-1/4">
                    Funkcionalnost
                  </th>
                  {packages.map((pkg) => (
                    <th
                      key={pkg}
                      className={`py-4 px-4 text-center text-sm font-bold transition-all ${
                        selectedPackage === pkg
                          ? "bg-gradient-to-b from-admin-primary/15 to-admin-primary/5 text-admin-primary"
                          : "text-admin-text"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{getLicenseTypeLabel(pkg)}</span>
                        {selectedPackage === pkg && (
                          <span className="text-xs font-normal bg-admin-primary/20 px-2 py-0.5 rounded-full">
                            Izabrano
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <FeatureRow
                    key={index}
                    feature={feature}
                    packages={packages}
                    selectedPackage={selectedPackage}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
