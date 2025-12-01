// src/services/licenseService.js
// ===============================================================================
// LICENSE SERVICE - Servis za upravljanje licencama eVaga Desktop aplikacije
// ===============================================================================
//
// @description Servis za CRUD operacije nad licencama preko Firebase
// @author eVaga Team
// @version 1.0
// @lastmodified 2025-12-01
//
// FUNKCIONALNOSTI:
// ✅ CRUD operacije nad licencama (Firestore)
// ✅ Pozivanje Cloud Functions za admin operacije
// ✅ Učitavanje aktivacija i porudžbina
// ✅ Konverzija trial u plaćenu licencu
// ✅ Real-time pretplate na promene
// ===============================================================================

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { generateLicenseKey, LICENSE_DEFAULTS } from "../utils/licenseUtils";

// ===============================================================================
// FIREBASE CLOUD FUNCTIONS - Admin operacije
// ===============================================================================

/**
 * Kreiranje nove licence preko Cloud Function
 * @async
 * @function adminCreateLicense
 * @param {Object} licenseData - Podaci o licenci
 * @param {string} licenseData.clientName - Ime klijenta
 * @param {string} licenseData.clientEmail - Email klijenta
 * @param {string} licenseData.licenseType - Tip licence
 * @param {Date} licenseData.expiresAt - Datum isteka
 * @param {number} licenseData.maxActivations - Maksimalan broj aktivacija
 * @param {string[]} licenseData.modules - Dozvoljeni moduli
 * @param {number} licenseData.offlineDaysAllowed - Broj dana offline korišćenja
 * @param {boolean} licenseData.isTrial - Da li je probna licenca
 * @returns {Promise<Object>} Kreirana licenca
 */
export const adminCreateLicense = async (licenseData) => {
  try {
    // Generisanje ključa ako nije prosleđen
    const licenseKey = licenseData.licenseKey || generateLicenseKey();

    // Priprema podataka za Firestore
    const now = Timestamp.now();
    const expiresAt =
      licenseData.expiresAt instanceof Date
        ? Timestamp.fromDate(licenseData.expiresAt)
        : licenseData.expiresAt;

    const newLicense = {
      licenseKey,
      clientName: licenseData.clientName || "",
      clientEmail: licenseData.clientEmail || "",
      licenseType: licenseData.licenseType,
      status: licenseData.isTrial ? "trial" : "active",
      isTrial: licenseData.isTrial || false,
      maxActivations: licenseData.maxActivations || 1,
      currentActivations: 0,
      modules: licenseData.modules || [],
      offlineDaysAllowed: licenseData.offlineDaysAllowed || 0,
      createdAt: now,
      expiresAt,
      isBlocked: false,
      autoRenew: licenseData.autoRenew || false,
      hardwareId: null,
      lastSeen: null,
      activationHistory: [],
      extensionHistory: [],
    };

    const docRef = await addDoc(collection(db, "licenses"), newLicense);

    return {
      id: docRef.id,
      ...newLicense,
    };
  } catch (error) {
    console.error("Greška pri kreiranju licence:", error);
    throw error;
  }
};

/**
 * Ažuriranje licence
 * @async
 * @function adminUpdateLicense
 * @param {string} licenseId - ID licence
 * @param {Object} data - Podaci za ažuriranje
 * @returns {Promise<void>}
 */
export const adminUpdateLicense = async (licenseId, data) => {
  try {
    const licenseRef = doc(db, "licenses", licenseId);

    // Konvertuj datume u Timestamp ako postoje
    const updateData = { ...data };
    if (updateData.expiresAt instanceof Date) {
      updateData.expiresAt = Timestamp.fromDate(updateData.expiresAt);
    }
    updateData.updatedAt = Timestamp.now();

    await updateDoc(licenseRef, updateData);
  } catch (error) {
    console.error("Greška pri ažuriranju licence:", error);
    throw error;
  }
};

/**
 * Blokiranje licence
 * @async
 * @function adminBlockLicense
 * @param {string} licenseId - ID licence
 * @param {string} reason - Razlog blokiranja
 * @returns {Promise<void>}
 */
export const adminBlockLicense = async (licenseId, reason = "") => {
  try {
    const licenseRef = doc(db, "licenses", licenseId);
    await updateDoc(licenseRef, {
      isBlocked: true,
      status: "blocked",
      blockedAt: Timestamp.now(),
      blockReason: reason,
    });
  } catch (error) {
    console.error("Greška pri blokiranju licence:", error);
    throw error;
  }
};

/**
 * Odblokiranje licence
 * @async
 * @function adminUnblockLicense
 * @param {string} licenseId - ID licence
 * @returns {Promise<void>}
 */
export const adminUnblockLicense = async (licenseId) => {
  try {
    const licenseRef = doc(db, "licenses", licenseId);
    await updateDoc(licenseRef, {
      isBlocked: false,
      status: "active",
      unblockedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Greška pri odblokiranju licence:", error);
    throw error;
  }
};

/**
 * Resetovanje Hardware ID-a
 * @async
 * @function adminResetHardware
 * @param {string} licenseId - ID licence
 * @returns {Promise<void>}
 */
export const adminResetHardware = async (licenseId) => {
  try {
    const licenseRef = doc(db, "licenses", licenseId);
    const licenseDoc = await getDoc(licenseRef);

    if (!licenseDoc.exists()) {
      throw new Error("Licenca nije pronađena");
    }

    const licenseData = licenseDoc.data();
    const activationHistory = licenseData.activationHistory || [];

    // Dodaj reset u istoriju
    activationHistory.push({
      action: "hwid_reset",
      timestamp: Timestamp.now(),
      previousHwid: licenseData.hardwareId,
    });

    await updateDoc(licenseRef, {
      hardwareId: null,
      currentActivations: Math.max(0, (licenseData.currentActivations || 1) - 1),
      activationHistory,
      lastHwidReset: Timestamp.now(),
    });
  } catch (error) {
    console.error("Greška pri resetovanju HWID-a:", error);
    throw error;
  }
};

// ===============================================================================
// FIRESTORE QUERIES - Učitavanje podataka
// ===============================================================================

/**
 * Učitavanje svih licenci
 * @async
 * @function getLicenses
 * @param {Object} filters - Filteri za pretragu
 * @returns {Promise<Array>} Lista licenci
 */
export const getLicenses = async (filters = {}) => {
  try {
    let q = collection(db, "licenses");
    const constraints = [];

    // Dodaj filtere
    if (filters.status && filters.status !== "all") {
      constraints.push(where("status", "==", filters.status));
    }

    if (filters.isTrial !== undefined) {
      constraints.push(where("isTrial", "==", filters.isTrial));
    }

    if (filters.licenseType) {
      constraints.push(where("licenseType", "==", filters.licenseType));
    }

    // Sortiraj po datumu kreiranja
    constraints.push(orderBy("createdAt", "desc"));

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Greška pri učitavanju licenci:", error);
    throw error;
  }
};

/**
 * Učitavanje jedne licence
 * @async
 * @function getLicenseById
 * @param {string} licenseId - ID licence
 * @returns {Promise<Object|null>} Licenca ili null
 */
export const getLicenseById = async (licenseId) => {
  try {
    const licenseRef = doc(db, "licenses", licenseId);
    const licenseDoc = await getDoc(licenseRef);

    if (!licenseDoc.exists()) {
      return null;
    }

    return {
      id: licenseDoc.id,
      ...licenseDoc.data(),
    };
  } catch (error) {
    console.error("Greška pri učitavanju licence:", error);
    throw error;
  }
};

/**
 * Pretplata na promene licenci u realnom vremenu
 * @function subscribeLicenses
 * @param {Function} callback - Funkcija za obradu promena
 * @param {Object} filters - Filteri
 * @returns {Function} Funkcija za otkazivanje pretplate
 */
export const subscribeLicenses = (callback, filters = {}) => {
  let q = collection(db, "licenses");
  const constraints = [];

  if (filters.status && filters.status !== "all") {
    constraints.push(where("status", "==", filters.status));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (constraints.length > 0) {
    q = query(q, ...constraints);
  }

  return onSnapshot(q, (snapshot) => {
    const licenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(licenses);
  });
};

/**
 * Učitavanje aktivacija
 * @async
 * @function getActivations
 * @param {string} licenseId - ID licence (opciono)
 * @returns {Promise<Array>} Lista aktivacija
 */
export const getActivations = async (licenseId = null) => {
  try {
    let q = collection(db, "activations");

    if (licenseId) {
      q = query(q, where("licenseId", "==", licenseId));
    }

    q = query(q, orderBy("activatedAt", "desc"));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Greška pri učitavanju aktivacija:", error);
    return [];
  }
};

/**
 * Učitavanje porudžbina licenci
 * @async
 * @function getOrders
 * @param {Object} filters - Filteri
 * @returns {Promise<Array>} Lista porudžbina
 */
export const getOrders = async (filters = {}) => {
  try {
    let q = collection(db, "licenseOrders");
    const constraints = [];

    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }

    constraints.push(orderBy("createdAt", "desc"));

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Greška pri učitavanju porudžbina:", error);
    return [];
  }
};

/**
 * Pretplata na promene porudžbina
 * @function subscribeOrders
 * @param {Function} callback - Funkcija za obradu promena
 * @returns {Function} Funkcija za otkazivanje pretplate
 */
export const subscribeOrders = (callback) => {
  const q = query(
    collection(db, "licenseOrders"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(orders);
  });
};

/**
 * Konverzija trial licence u plaćenu
 * @async
 * @function convertTrialToPaid
 * @param {string} licenseId - ID licence
 * @param {Object} orderData - Podaci o narudžbini
 * @returns {Promise<void>}
 */
export const convertTrialToPaid = async (licenseId, orderData) => {
  try {
    const licenseRef = doc(db, "licenses", licenseId);
    const licenseDoc = await getDoc(licenseRef);

    if (!licenseDoc.exists()) {
      throw new Error("Licenca nije pronađena");
    }

    const licenseData = licenseDoc.data();
    const defaults = LICENSE_DEFAULTS[orderData.licenseType];

    // Izračunaj novi datum isteka
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + (defaults?.durationDays || 365));

    const extensionHistory = licenseData.extensionHistory || [];
    extensionHistory.push({
      action: "trial_to_paid",
      from: licenseData.licenseType,
      to: orderData.licenseType,
      timestamp: Timestamp.now(),
      orderId: orderData.orderId,
    });

    await updateDoc(licenseRef, {
      isTrial: false,
      licenseType: orderData.licenseType,
      status: "active",
      expiresAt: Timestamp.fromDate(newExpiresAt),
      maxActivations: defaults?.maxActivations || 2,
      modules: defaults?.modules || licenseData.modules,
      offlineDaysAllowed: defaults?.offlineDaysAllowed || 7,
      extensionHistory,
      convertedAt: Timestamp.now(),
    });

    // Kreiraj porudžbinu
    await addDoc(collection(db, "licenseOrders"), {
      licenseId,
      licenseKey: licenseData.licenseKey,
      clientName: licenseData.clientName,
      clientEmail: licenseData.clientEmail,
      licenseType: orderData.licenseType,
      amount: orderData.amount,
      status: "paid",
      createdAt: Timestamp.now(),
      paymentMethod: orderData.paymentMethod,
    });
  } catch (error) {
    console.error("Greška pri konverziji licence:", error);
    throw error;
  }
};

/**
 * Ažuriranje statusa porudžbine
 * @async
 * @function updateOrderStatus
 * @param {string} orderId - ID porudžbine
 * @param {string} status - Novi status
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, "licenseOrders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Greška pri ažuriranju porudžbine:", error);
    throw error;
  }
};

/**
 * Produženje licence
 * @async
 * @function extendLicense
 * @param {string} licenseId - ID licence
 * @param {number} days - Broj dana za produženje
 * @returns {Promise<void>}
 */
export const extendLicense = async (licenseId, days) => {
  try {
    const licenseRef = doc(db, "licenses", licenseId);
    const licenseDoc = await getDoc(licenseRef);

    if (!licenseDoc.exists()) {
      throw new Error("Licenca nije pronađena");
    }

    const licenseData = licenseDoc.data();

    // Izračunaj novi datum isteka
    let currentExpiry;
    if (licenseData.expiresAt?.seconds) {
      currentExpiry = new Date(licenseData.expiresAt.seconds * 1000);
    } else {
      currentExpiry = new Date();
    }

    // Ako je istekla, računaj od danas
    if (currentExpiry < new Date()) {
      currentExpiry = new Date();
    }

    currentExpiry.setDate(currentExpiry.getDate() + days);

    const extensionHistory = licenseData.extensionHistory || [];
    extensionHistory.push({
      action: "extension",
      days,
      timestamp: Timestamp.now(),
      previousExpiry: licenseData.expiresAt,
    });

    await updateDoc(licenseRef, {
      expiresAt: Timestamp.fromDate(currentExpiry),
      status: "active",
      extensionHistory,
    });
  } catch (error) {
    console.error("Greška pri produženju licence:", error);
    throw error;
  }
};

// ===============================================================================
// STATISTIKE
// ===============================================================================

/**
 * Učitavanje statistike licenci
 * @async
 * @function getLicenseStats
 * @param {number} days - Broj dana za analizu
 * @returns {Promise<Object>} Statistički podaci
 */
export const getLicenseStats = async (days = 30) => {
  try {
    const licenses = await getLicenses();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let totalLicenses = licenses.length;
    let activeLicenses = 0;
    let blockedLicenses = 0;
    let expiredLicenses = 0;
    let trialLicenses = 0;
    let paidLicenses = 0;
    let totalActivations = 0;
    let recentlyActive = 0;

    licenses.forEach((license) => {
      // Status counting
      if (license.isBlocked || license.status === "blocked") {
        blockedLicenses++;
      } else if (license.status === "expired") {
        expiredLicenses++;
      } else if (license.status === "active") {
        activeLicenses++;
      }

      // Trial vs Paid
      if (license.isTrial) {
        trialLicenses++;
      } else {
        paidLicenses++;
      }

      // Aktivacije
      totalActivations += license.currentActivations || 0;

      // Recently active (lastSeen in last `days` days)
      if (license.lastSeen?.seconds) {
        const lastSeenDate = new Date(license.lastSeen.seconds * 1000);
        if (lastSeenDate >= cutoffDate) {
          recentlyActive++;
        }
      }
    });

    return {
      totalLicenses,
      activeLicenses,
      blockedLicenses,
      expiredLicenses,
      trialLicenses,
      paidLicenses,
      totalActivations,
      recentlyActive,
      avgActivationsPerLicense:
        totalLicenses > 0 ? (totalActivations / totalLicenses).toFixed(1) : 0,
      trialToPaidRatio:
        paidLicenses > 0 ? (trialLicenses / paidLicenses).toFixed(2) : 0,
    };
  } catch (error) {
    console.error("Greška pri učitavanju statistike:", error);
    return {
      totalLicenses: 0,
      activeLicenses: 0,
      blockedLicenses: 0,
      expiredLicenses: 0,
      trialLicenses: 0,
      paidLicenses: 0,
      totalActivations: 0,
      recentlyActive: 0,
      avgActivationsPerLicense: 0,
      trialToPaidRatio: 0,
    };
  }
};
