import { onCall, HttpsError } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../utils/db";
import { assertAdmin } from "../utils/auth";
import { generateLicenseKey } from "../utils/generateLicenseKey";

export const adminCreateLicense = onCall(async (req) => {
  assertAdmin(req);

  const {
    clientName,
    clientEmail,
    licenseType,
    expiresAt,
    maxActivations = 1,
    modules = [],
    isTrial = false,
    autoRenew = false,
  } = req.data;

  const allowedOfflineDays =
    req.data.allowedOfflineDays ?? req.data.offlineDaysAllowed ?? 7;

  if (!licenseType) {
    throw new HttpsError("invalid-argument", "licenseType required");
  }

  const licenseKey = generateLicenseKey(); // <- biće ID dokumenta
  const now = Timestamp.now();

  const docData = {
    licenseKey,
    clientName: clientName ?? "",
    clientEmail: clientEmail ?? "",
    licenseType,
    status: isTrial ? "trial" : "active",
    isTrial,
    maxActivations,
    currentActivations: 0,
    modules,
    allowedOfflineDays,
    createdAt: now,
    expiresAt: Timestamp.fromDate(new Date(expiresAt)),
    isBlocked: false,
    autoRenew,
    hardwareId: null,
    lastSeen: null,
    activationHistory: [],
    extensionHistory: [],
  };

  // ✅ ID dokumenta = licenseKey
  const ref = db.collection("licenses").doc(licenseKey);
  await ref.set(docData);

  return {
    id: licenseKey,
    licenseKey,
  };
});
