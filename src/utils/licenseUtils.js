// src/utils/licenseUtils.js
// ===============================================================================
// LICENSE UTILITIES - Pomoćne funkcije za rad sa licencama
// ===============================================================================
//
// @description Generisanje licencnih ključeva i konstante tipova licenci
// @author eVaga Team
// @version 1.0
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ Generisanje jedinstvenog licencnog ključa u formatu EVAGA-XXXX-XXXX-XXXX
// ✅ Definicija tipova licenci (trial, basic, pro, enterprise)
// ✅ Definicija modula aplikacije
// ✅ Pomoćne funkcije za validaciju i formatiranje
// ===============================================================================

/**
 * Tipovi licenci za eVaga Desktop aplikaciju
 * @constant {Object} LICENSE_TYPES
 */
export const LICENSE_TYPES = {
  TRIAL: "trial",
  BASIC: "basic",
  PRO: "pro",
  ENTERPRISE: "enterprise",
};

/**
 * Dostupni moduli za licenciranje
 * @constant {string[]} LICENSE_MODULES
 */
export const LICENSE_MODULES = ["ambalaza", "stampa", "cloud"];

/**
 * Statusi licenci
 * @constant {Object} LICENSE_STATUS
 */
export const LICENSE_STATUS = {
  ACTIVE: "active",
  BLOCKED: "blocked",
  EXPIRED: "expired",
  TRIAL: "trial",
};

/**
 * Podrazumevane vrednosti za tipove licenci
 * @constant {Object} LICENSE_DEFAULTS
 */
export const LICENSE_DEFAULTS = {
  [LICENSE_TYPES.TRIAL]: {
    durationDays: 7,
    maxActivations: 1,
    offlineDaysAllowed: 0,
    modules: ["ambalaza"],
    canResetHwid: false,
  },
  [LICENSE_TYPES.BASIC]: {
    durationDays: 365,
    maxActivations: 2,
    offlineDaysAllowed: 7,
    modules: ["ambalaza"],
    canResetHwid: true,
  },
  [LICENSE_TYPES.PRO]: {
    durationDays: 365,
    maxActivations: 5,
    offlineDaysAllowed: 14,
    modules: ["ambalaza", "stampa"],
    canResetHwid: true,
  },
  [LICENSE_TYPES.ENTERPRISE]: {
    durationDays: 365,
    maxActivations: 999,
    offlineDaysAllowed: 30,
    modules: ["ambalaza", "stampa", "cloud"],
    canResetHwid: true,
  },
};

/**
 * Cene paketa licenci u RSD
 * @constant {Object} PACKAGE_PRICES
 */
export const PACKAGE_PRICES = {
  [LICENSE_TYPES.BASIC]: 9900,
  [LICENSE_TYPES.PRO]: 19900,
  [LICENSE_TYPES.ENTERPRISE]: 49900,
};

/**
 * Generisanje nasumičnog niza alfanumeričkih karaktera
 * @private
 * @param {number} length - Dužina generisanog niza
 * @returns {string} Nasumični niz velikih slova i brojeva
 */
const generateRandomSegment = (length = 4) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
};

/**
 * Generisanje jedinstvenog licencnog ključa
 * @function generateLicenseKey
 * @returns {string} Licencni ključ u formatu EVAGA-XXXX-XXXX-XXXX
 * @example
 * const key = generateLicenseKey();
 * // "EVAGA-A3K7-M9P2-X4Y8"
 */
export const generateLicenseKey = () => {
  const segment1 = generateRandomSegment(4);
  const segment2 = generateRandomSegment(4);
  const segment3 = generateRandomSegment(4);
  return `EVAGA-${segment1}-${segment2}-${segment3}`;
};

/**
 * Validacija formata licencnog ključa
 * @function validateLicenseKey
 * @param {string} key - Licencni ključ za validaciju
 * @returns {boolean} True ako je format ispravan
 */
export const validateLicenseKey = (key) => {
  if (!key || typeof key !== "string") return false;
  const pattern = /^EVAGA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(key.toUpperCase());
};

/**
 * Formatiranje datuma za prikaz
 * @function formatLicenseDate
 * @param {Date|Object} date - Datum (JavaScript Date ili Firestore Timestamp)
 * @returns {string} Formatiran datum u srpskom formatu
 */
export const formatLicenseDate = (date) => {
  if (!date) return "-";

  let jsDate;
  if (date?.seconds) {
    // Firestore Timestamp
    jsDate = new Date(date.seconds * 1000);
  } else if (date instanceof Date) {
    jsDate = date;
  } else if (typeof date === "string") {
    jsDate = new Date(date);
  } else {
    return "-";
  }

  return jsDate.toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Provera da li je licenca istekla
 * @function isLicenseExpired
 * @param {Date|Object} expiresAt - Datum isteka
 * @returns {boolean} True ako je licenca istekla
 */
export const isLicenseExpired = (expiresAt) => {
  if (!expiresAt) return false;

  let expDate;
  if (expiresAt?.seconds) {
    expDate = new Date(expiresAt.seconds * 1000);
  } else {
    expDate = new Date(expiresAt);
  }

  return expDate < new Date();
};

/**
 * Izračunavanje broja preostalih dana licence
 * @function getRemainingDays
 * @param {Date|Object} expiresAt - Datum isteka
 * @returns {number} Broj preostalih dana (negativan ako je istekla)
 */
export const getRemainingDays = (expiresAt) => {
  if (!expiresAt) return 0;

  let expDate;
  if (expiresAt?.seconds) {
    expDate = new Date(expiresAt.seconds * 1000);
  } else {
    expDate = new Date(expiresAt);
  }

  const now = new Date();
  const diffTime = expDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Dobijanje labele za tip licence
 * @function getLicenseTypeLabel
 * @param {string} type - Tip licence
 * @returns {string} Lokalizovana labela
 */
export const getLicenseTypeLabel = (type) => {
  const labels = {
    [LICENSE_TYPES.TRIAL]: "Probna verzija",
    [LICENSE_TYPES.BASIC]: "Basic",
    [LICENSE_TYPES.PRO]: "Pro",
    [LICENSE_TYPES.ENTERPRISE]: "Enterprise",
  };
  return labels[type] || type;
};

/**
 * Dobijanje boje za status licence
 * @function getStatusColor
 * @param {string} status - Status licence
 * @returns {string} Tailwind CSS klase za boju
 */
export const getStatusColor = (status) => {
  const colors = {
    [LICENSE_STATUS.ACTIVE]: "bg-green-100 text-green-800 border-green-200",
    [LICENSE_STATUS.BLOCKED]: "bg-red-100 text-red-800 border-red-200",
    [LICENSE_STATUS.EXPIRED]: "bg-gray-100 text-gray-800 border-gray-200",
    [LICENSE_STATUS.TRIAL]: "bg-amber-100 text-amber-800 border-amber-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

/**
 * Dobijanje ikone za modul
 * @function getModuleIcon
 * @param {string} module - Naziv modula
 * @returns {string} Naziv ikone za Lucide
 */
export const getModuleIcon = (module) => {
  const icons = {
    ambalaza: "Package",
    stampa: "Printer",
    cloud: "Cloud",
  };
  return icons[module] || "Box";
};
