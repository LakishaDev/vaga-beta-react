import { onCall } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../init";
import { assertAdmin } from "../auth";

export const adminUnblockLicense = onCall(
  { region: "europe-west1" },
  async (req) => {
    assertAdmin(req);

    const { licenseId } = req.data;

    await db.doc(`licenses/${licenseId}`).update({
      isBlocked: false,
      status: "active",
      unblockedAt: Timestamp.now(),
    });
  }
);
