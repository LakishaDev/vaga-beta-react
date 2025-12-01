import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { assertAdmin } from "../auth";

export const adminCreateLicense = onCall(async (req) => {
  assertAdmin(req);

  const {
    licenseKey,
    expiresAt,
    maxActivations = 1,
    allowedOfflineDays = 14,
    ipLockEnabled = false,
    modules = {},
    note = "",
  } = req.data;

  if (!licenseKey || !expiresAt) {
    throw new HttpsError(
      "invalid-argument",
      "licenseKey and expiresAt are required"
    );
  }

  const db = getFirestore();
  const ref = db.collection("licenses").doc(licenseKey);
  const snap = await ref.get();

  if (snap.exists) {
    throw new HttpsError("already-exists", "License already exists");
  }

  await ref.set({
    licenseKey,
    status: "active",
    expiresAt: Timestamp.fromDate(new Date(expiresAt)),
    createdAt: Timestamp.now(),

    maxActivations,
    allowedOfflineDays,

    hardwareLocked: false,
    hwidHash: null,

    ipLockEnabled,
    ipAddress: null,

    modules,
    note,
  });

  return { ok: true };
});
