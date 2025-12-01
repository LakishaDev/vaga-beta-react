import { onCall } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../init";
import { assertAdmin } from "../auth";

export const adminRevokeLicense = onCall(
  { region: "europe-west1" },
  async (req) => {
    assertAdmin(req);

    const { licenseId, reason = "" } = req.data;

    await db.doc(`licenses/${licenseId}`).update({
      status: "revoked",
      revokedAt: Timestamp.now(),
      revokeReason: reason,
      isBlocked: true,
    });
  }
);
