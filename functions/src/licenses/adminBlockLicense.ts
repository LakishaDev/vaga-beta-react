import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { assertAdmin } from "../auth";

export const adminBlockLicense = onCall(async (req) => {
  assertAdmin(req);

  const { licenseKey } = req.data;
  if (!licenseKey) {
    throw new HttpsError("invalid-argument", "licenseKey required");
  }

  const db = getFirestore();
  await db.collection("licenses").doc(licenseKey).update({
    status: "blocked",
  });

  return { ok: true };
});
