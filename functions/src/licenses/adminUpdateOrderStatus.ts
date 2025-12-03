import { onCall, HttpsError } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../utils/db";
import { assertAdmin } from "../utils/auth";

export const adminUpdateOrderStatus = onCall(async (req) => {
  assertAdmin(req);

  const { orderId, status } = req.data;

  if (!orderId || !status) {
    throw new HttpsError("invalid-argument", "orderId and status are required");
  }

  const ref = db.doc(`orders/${orderId}`);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new HttpsError("not-found", "Order not found");
  }

  await ref.update({
    status,
    updatedAt: Timestamp.now(),
  });
});
