import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { assertAdmin } from "../auth";

export const adminResetHardware = onCall(async (req) => {
  assertAdmin(req);

  const { licenseKey } = req.data;
  if (!licenseKey) {
    throw new HttpsError("invalid-argument", "licenseKey required");
  }

  const db = getFirestore();
  const ref = db.collection("licenses").doc(licenseKey);

  await ref.update({
    hardwareLocked: false,
    hwidHash: null,
    ipAddress: null,
  });

  return { ok: true };
});
