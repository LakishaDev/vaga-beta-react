// src/services/versionControlService.js
// Service layer za version control management (admin only)

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../utils/firebase";

const fn = {
  setVersionPolicy: httpsCallable(functions, "adminSetVersionPolicy"),
  setLicenseVersion: httpsCallable(functions, "adminSetLicenseVersion"),
};

/**
 * Postavi globalnu politiku verzija za kanal (stable/beta).
 * @param {string} channel
 * @param {{ targetVersion: string|null, mandatory: boolean, defaultGraceDays: number }} data
 */
export async function setVersionPolicy(channel, data) {
  const res = await fn.setVersionPolicy({ channel, ...data });
  return res.data;
}

/**
 * Zakači licencu na specifičnu verziju (pin) ili vrati na global default (follow).
 * @param {string} licenseKey
 * @param {{ targetVersion: string|null, mode: 'follow'|'pin', graceDays?: number, mandatory?: boolean }} data
 */
export async function setLicenseVersion(licenseKey, data) {
  const res = await fn.setLicenseVersion({ licenseKey, ...data });
  return res.data;
}

/**
 * Resetuj licencu na globalni default (shortcut za mode=follow).
 * @param {string} licenseKey
 */
export async function clearLicenseVersion(licenseKey) {
  return setLicenseVersion(licenseKey, {
    targetVersion: null,
    mode: "follow",
    graceDays: null,
    mandatory: false,
  });
}

/**
 * Pretplati se na updatePolicies kolekciju (oba kanala).
 * @param {(policies: Record<string, any>) => void} cb
 * @returns unsubscribe fn
 */
export function subscribeVersionPolicies(cb) {
  return onSnapshot(collection(db, "updatePolicies"), (snap) => {
    const policies = {};
    snap.forEach((doc) => {
      policies[doc.id] = { id: doc.id, ...doc.data() };
    });
    cb(policies);
  });
}

/**
 * Pretplati se na published releases (za dropdown izbora verzije).
 * @param {(releases: any[]) => void} cb
 * @returns unsubscribe fn
 */
export function subscribePublishedReleases(cb) {
  const q = query(
    collection(db, "releases"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const releases = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    cb(releases);
  });
}
