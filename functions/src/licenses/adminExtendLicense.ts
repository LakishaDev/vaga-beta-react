import { onCall } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../utils/db";
import { assertAdmin } from "../utils/auth";

export const adminExtendLicense = onCall(async (req) => {
  assertAdmin(req);

  const { licenseId, days } = req.data;
  const ref = db.doc(`licenses/${licenseId}`);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("License not found");

  let expiry = snap.data()!.expiresAt.toDate();
  if (expiry < new Date()) expiry = new Date();
  expiry.setDate(expiry.getDate() + days);

  await ref.update({
    expiresAt: Timestamp.fromDate(expiry),
    status: "active",
  });
});
