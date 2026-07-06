import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { assertAdmin } from "../utils/auth";

export const adminUpdateLicense = onCall(async (req) => {
  assertAdmin(req);

  const {
    licenseKey,
    expiresAt,
    modules,
    licenseType,
    autoRenew,
    ipLockEnabled,
    note,
  } = req.data;

  if (!licenseKey) {
    throw new HttpsError("invalid-argument", "licenseKey required");
  }

  const db = getFirestore();
  const ref = db.collection("licenses").doc(licenseKey);

  const update: any = {};

  if (expiresAt) update.expiresAt = Timestamp.fromDate(new Date(expiresAt));
  if (modules) update.modules = modules;
  if (licenseType) update.licenseType = licenseType;
  if (typeof autoRenew === "boolean") update.autoRenew = autoRenew;
  if (typeof ipLockEnabled === "boolean") update.ipLockEnabled = ipLockEnabled;
  if (note !== undefined) update.note = note;

  await ref.update(update);

  return { ok: true };
});
