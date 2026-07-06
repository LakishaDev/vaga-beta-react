// src/utils/licenseUtils.js
// ===============================================================================
// LICENSE UTILITIES - Pomoćne funkcije za rad sa licencama
// ===============================================================================
//
// @description Generisanje licencnih ključeva i konstante tipova licenci
// @author eVaga Team
// @version 1.1
// @lastmodified 2026-07-06
//
// FUNKCIONALNOSTI:
// ✅ Generisanje jedinstvenog licencnog ključa u formatu EVAGA-XXXX-XXXX-XXXX
// ✅ Definicija tipova licenci (trial, basic, pro, enterprise, custom)
// ✅ Taksonomija modula/funkcionalnosti programa (Kontrola modula)
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
  CUSTOM: "custom",
};

/**
 * Katalog svih funkcionalnosti (modula) eVaga Desktop programa.
 * Ovo je jedini izvor istine — ključevi se 1:1 preslikavaju na desktop
 * `IsModuleEnabled`/`IsFeatureAllowed` gate-ove (OrdinalIgnoreCase, ali
 * čuvamo tačne stringove).
 * @constant {Array<Object>} LICENSE_MODULE_CATALOG
 */
export const LICENSE_MODULE_CATALOG = [
  {
    key: "trenutnoMerenje",
    label: "Trenutno merenje",
    description: "Bruto/tara/neto merenje u realnom vremenu",
    icon: "Scale",
    group: "Merenje",
    type: "FEAT",
  },
  {
    key: "cuvanjeMerenja",
    label: "Čuvanje merenja",
    description: "Trajno čuvanje izmerenih vrednosti",
    icon: "Save",
    group: "Merenje",
    type: "FEAT",
  },
  {
    key: "listaMerenja",
    label: "Lista merenja",
    description: "Pregled istorije svih merenja",
    icon: "List",
    group: "Merenje",
    type: "SISTEM",
  },
  {
    key: "pauzaMerenja",
    label: "Pauziranje merenja",
    description: "Privremeno zaustavljanje aktivnog merenja",
    icon: "Pause",
    group: "Merenje",
    type: "FEAT",
  },
  {
    key: "stampaMerenja",
    label: "Štampanje merenja",
    description: "Štampanje potvrde/izveštaja o merenju",
    icon: "Printer",
    group: "Merenje",
    type: "FEAT",
  },
  {
    key: "upravljanjeAmbalazom",
    label: "Upravljanje ambalažom",
    description: "Definisanje i podešavanje tipova ambalaže",
    icon: "Package",
    group: "Ambalaža i lica",
    type: "SISTEM",
  },
  {
    key: "evidencijaAmbalaze",
    label: "Evidencija ambalaže",
    description: "Praćenje kretanja i stanja ambalaže",
    icon: "ClipboardList",
    group: "Ambalaža i lica",
    type: "SISTEM",
  },
  {
    key: "upravljanjeLicima",
    label: "Upravljanje licima",
    description: "Unos, pregled i Excel izvoz lica",
    icon: "Users",
    group: "Ambalaža i lica",
    type: "SISTEM",
  },
  {
    key: "excelImportLica",
    label: "Excel import lica",
    description: "Uvoz lica iz Excel fajla (submodul Upravljanja licima)",
    icon: "FileSpreadsheet",
    group: "Ambalaža i lica",
    type: "FEAT",
    parentKey: "upravljanjeLicima",
  },
  {
    key: "kontrolaPristupa",
    label: "Kontrola pristupa",
    description: "Upravljanje ulogama i pravima korisnika",
    icon: "Shield",
    group: "Napredno",
    type: "SISTEM",
    enterpriseOnly: true,
  },
  {
    key: "webSocketStreaming",
    label: "WebSocket streaming (APK)",
    description: "Realtime prenos podataka ka mobilnoj aplikaciji",
    icon: "Wifi",
    group: "Napredno",
    type: "FEAT",
    enterpriseOnly: true,
  },
  {
    key: "klijentskaStrana",
    label: "Klijentska strana",
    description: "Zaseban prikaz merenja za klijenta",
    icon: "MonitorSmartphone",
    group: "Napredno",
    type: "SISTEM",
    enterpriseOnly: true,
  },
];

/**
 * Svi ključevi modula (samo stringovi), izvedeni iz kataloga.
 * @constant {string[]} LICENSE_MODULE_KEYS
 */
export const LICENSE_MODULE_KEYS = LICENSE_MODULE_CATALOG.map((m) => m.key);

/**
 * Legacy alias — postojeći importi u kodu koriste `LICENSE_MODULES`.
 * @constant {string[]} LICENSE_MODULES
 */
export const LICENSE_MODULES = LICENSE_MODULE_KEYS;

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
 * Moduli uključeni u svaki paket (BASIC ⊂ PRO ⊂ ENTERPRISE).
 * @constant {Object} PACKAGE_MODULES
 */
export const PACKAGE_MODULES = {
  [LICENSE_TYPES.BASIC]: [
    "trenutnoMerenje",
    "cuvanjeMerenja",
    "listaMerenja",
    "upravljanjeAmbalazom",
    "stampaMerenja",
  ],
  [LICENSE_TYPES.PRO]: [
    "trenutnoMerenje",
    "cuvanjeMerenja",
    "listaMerenja",
    "upravljanjeAmbalazom",
    "stampaMerenja",
    "pauzaMerenja",
    "evidencijaAmbalaze",
    "upravljanjeLicima",
    "excelImportLica",
  ],
  [LICENSE_TYPES.ENTERPRISE]: LICENSE_MODULE_KEYS,
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
    modules: ["trenutnoMerenje", "cuvanjeMerenja"],
    canResetHwid: false,
  },
  [LICENSE_TYPES.BASIC]: {
    durationDays: 365,
    maxActivations: 2,
    offlineDaysAllowed: 7,
    modules: PACKAGE_MODULES[LICENSE_TYPES.BASIC],
    canResetHwid: true,
  },
  [LICENSE_TYPES.PRO]: {
    durationDays: 365,
    maxActivations: 5,
    offlineDaysAllowed: 14,
    modules: PACKAGE_MODULES[LICENSE_TYPES.PRO],
    canResetHwid: true,
  },
  [LICENSE_TYPES.ENTERPRISE]: {
    durationDays: 365,
    maxActivations: 999,
    offlineDaysAllowed: 30,
    modules: PACKAGE_MODULES[LICENSE_TYPES.ENTERPRISE],
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
 * Normalizuje `modules` u niz stringova bez obzira na ulazni oblik
 * (undefined, stari objekat oblik, ili već ispravan niz).
 * @function normalizeModules
 * @param {string[]|Object|undefined|null} modules
 * @returns {string[]}
 */
export const normalizeModules = (modules) => {
  if (Array.isArray(modules)) return modules;
  if (modules && typeof modules === "object") {
    return Object.keys(modules).filter((k) => modules[k]);
  }
  return [];
};

const sortedUniqueEqual = (a, b) => {
  const aSorted = [...new Set(a)].sort();
  const bSorted = [...new Set(b)].sort();
  if (aSorted.length !== bSorted.length) return false;
  return aSorted.every((v, i) => v === bSorted[i]);
};

/**
 * Izvodi naziv paketa (basic|pro|enterprise|custom) iz seta modula, poređenjem
 * sa `PACKAGE_MODULES`. Ako se ne poklapa ni sa jednim presetom → "custom".
 * @function getPackageFromModules
 * @param {string[]|Object} modules
 * @returns {string}
 */
export const getPackageFromModules = (modules) => {
  const list = normalizeModules(modules);
  if (sortedUniqueEqual(list, PACKAGE_MODULES[LICENSE_TYPES.ENTERPRISE])) {
    return LICENSE_TYPES.ENTERPRISE;
  }
  if (sortedUniqueEqual(list, PACKAGE_MODULES[LICENSE_TYPES.PRO])) {
    return LICENSE_TYPES.PRO;
  }
  if (sortedUniqueEqual(list, PACKAGE_MODULES[LICENSE_TYPES.BASIC])) {
    return LICENSE_TYPES.BASIC;
  }
  return LICENSE_TYPES.CUSTOM;
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
    [LICENSE_TYPES.CUSTOM]: "Prilagođeno",
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
 * Dobijanje ikone za modul (pokriva novu taksonomiju + legacy ključeve za
 * prikaz starih licenci koje još imaju `ambalaza/stampa/cloud`).
 * @function getModuleIcon
 * @param {string} module - Naziv modula
 * @returns {string} Naziv ikone za Lucide
 */
export const getModuleIcon = (module) => {
  const catalogEntry = LICENSE_MODULE_CATALOG.find((m) => m.key === module);
  if (catalogEntry) return catalogEntry.icon;

  const legacyIcons = {
    ambalaza: "Package",
    stampa: "Printer",
    cloud: "Cloud",
  };
  return legacyIcons[module] || "Box";
};

/**
 * Dobijanje labele za modul (pokriva novu taksonomiju + legacy ključeve).
 * @function getModuleLabel
 * @param {string} module - Naziv modula
 * @returns {string} Prikazna labela
 */
export const getModuleLabel = (module) => {
  const catalogEntry = LICENSE_MODULE_CATALOG.find((m) => m.key === module);
  if (catalogEntry) return catalogEntry.label;

  const legacyLabels = {
    ambalaza: "Ambalaža",
    stampa: "Štampa",
    cloud: "Cloud",
  };
  return legacyLabels[module] || module;
};
