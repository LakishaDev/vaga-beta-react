import { onCall } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../init";
import { assertAdmin } from "../auth";

export const adminConvertTrial = onCall(
  { region: "europe-west1" },
  async (req) => {
    assertAdmin(req);

    const { licenseId, order } = req.data;

    await db.doc(`licenses/${licenseId}`).update({
      isTrial: false,
      licenseType: order.licenseType,
      status: "active",
      convertedAt: Timestamp.now(),
    });

    await db.collection("orders").add({
      licenseId,
      ...order,
      createdAt: Timestamp.now(),
      status: "paid",
    });
  }
);
