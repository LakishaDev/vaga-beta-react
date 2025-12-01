// src/services/licenseService.js
// ==============================================================================
// eVaga Licensing Service (ADMIN)
// Backend-driven architecture via Firebase Cloud Functions
// ==============================================================================

import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../utils/firebase";

// ==============================================================================
// CLOUD FUNCTIONS (ADMIN)
// ==============================================================================

const fn = {
  createLicense: httpsCallable(functions, "adminCreateLicense"),
  updateLicense: httpsCallable(functions, "adminUpdateLicense"),
  blockLicense: httpsCallable(functions, "adminBlockLicense"),
  unblockLicense: httpsCallable(functions, "adminUnblockLicense"),
  resetHardware: httpsCallable(functions, "adminResetHardware"),
  extendLicense: httpsCallable(functions, "adminExtendLicense"),
  convertTrial: httpsCallable(functions, "adminConvertTrial"),
  revokeLicense: httpsCallable(functions, "adminRevokeLicense"),
  regenerateKey: httpsCallable(functions, "adminRegenerateLicenseKey"),
  updateOrderStatus: httpsCallable(functions, "adminUpdateOrderStatus"),
};

// ==============================================================================
// ADMIN COMMANDS
// ==============================================================================

export const adminCreateLicense = async (payload) => {
  const res = await fn.createLicense(payload);
  return res.data;
};

export const adminUpdateLicense = async (licenseId, data) => {
  await fn.updateLicense({ licenseId, data });
};

export const adminBlockLicense = async (licenseId, reason = "") => {
  await fn.blockLicense({ licenseId, reason });
};

export const adminUnblockLicense = async (licenseId) => {
  await fn.unblockLicense({ licenseId });
};

export const adminResetHardware = async (licenseId) => {
  await fn.resetHardware({ licenseId });
};

export const extendLicense = async (licenseId, days) => {
  await fn.extendLicense({ licenseId, days });
};

export const convertTrialToPaid = async (licenseId, order) => {
  await fn.convertTrial({ licenseId, order });
};

export const revokeLicense = async (licenseId, reason = "") => {
  await fn.revokeLicense({ licenseId, reason });
};

export const regenerateLicenseKey = async (licenseId) => {
  const res = await fn.regenerateKey({ licenseId });
  return res.data.newLicenseKey;
};

// ==============================================================================
// READ-ONLY FIRESTORE ACCESS
// ==============================================================================

export const getLicenses = async (filters = {}) => {
  let q = collection(db, "licenses");
  const constraints = [];

  if (filters.status && filters.status !== "all") {
    constraints.push(where("status", "==", filters.status));
  }

  if (filters.isTrial !== undefined) {
    constraints.push(where("isTrial", "==", filters.isTrial));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (constraints.length) {
    q = query(q, ...constraints);
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getLicenseById = async (licenseId) => {
  const ref = doc(db, "licenses", licenseId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const subscribeLicenses = (callback, filters = {}) => {
  let q = collection(db, "licenses");
  const constraints = [];

  if (filters.status && filters.status !== "all") {
    constraints.push(where("status", "==", filters.status));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (constraints.length) {
    q = query(q, ...constraints);
  }

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

// ==============================================================================
// ACTIVATIONS & ORDERS (READ ONLY)
// ==============================================================================

export const getActivations = async (licenseId = null) => {
  let q = collection(db, "activations");
  if (licenseId) q = query(q, where("licenseId", "==", licenseId));
  q = query(q, orderBy("activatedAt", "desc"));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getOrders = async () => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const subscribeOrders = (callback) => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const updateOrderStatus = async (orderId, status) => {
  await fn.updateOrderStatus({ orderId, status });
};
