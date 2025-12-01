import { onCall } from "firebase-functions/v2/https";
import { db } from "../init";
import { assertAdmin } from "../auth";
import { generateLicenseKey } from "../utils/generateLicenseKey";

export const adminRegenerateLicenseKey = onCall(
  { region: "europe-west1" },
  async (req) => {
    assertAdmin(req);

    const { licenseId } = req.data;
    const newKey = generateLicenseKey();

    await db.doc(`licenses/${licenseId}`).update({
      licenseKey: newKey,
      regeneratedAt: new Date(),
    });

    return { newLicenseKey: newKey };
  }
);
