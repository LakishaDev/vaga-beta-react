import { onCall } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../init";
import { assertAdmin } from "../auth";

export const adminResetHardware = onCall(
  { region: "europe-west1" },
  async (req) => {
    assertAdmin(req);

    const { licenseId } = req.data;
    const ref = db.doc(`licenses/${licenseId}`);
    const snap = await ref.get();

    if (!snap.exists) throw new Error("License not found");

    const lic = snap.data()!;
    const history = lic.activationHistory || [];

    history.push({
      action: "hwid_reset",
      previousHwid: lic.hardwareId,
      at: Timestamp.now(),
    });

    await ref.update({
      hardwareId: null,
      currentActivations: Math.max(0, (lic.currentActivations || 1) - 1),
      activationHistory: history,
      lastHwidReset: Timestamp.now(),
    });
  }
);
