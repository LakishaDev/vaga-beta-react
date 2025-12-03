import { onCall } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../utils/db";
import { assertAdmin } from "../utils/auth";

export const adminUnblockLicense = onCall(async (req) => {
  assertAdmin(req);

  const { licenseId } = req.data;

  await db.doc(`licenses/${licenseId}`).update({
    isBlocked: false,
    status: "active",
    unblockedAt: Timestamp.now(),
  });
});
