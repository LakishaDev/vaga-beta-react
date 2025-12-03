import { onCall } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../utils/db";
import { assertAdmin } from "../utils/auth";

export const adminBlockLicense = onCall(async (req) => {
  assertAdmin(req);

  const { licenseId, reason = "" } = req.data;

  await db.doc(`licenses/${licenseId}`).update({
    isBlocked: true,
    status: "blocked",
    blockedAt: Timestamp.now(),
    blockReason: reason,
  });
});
