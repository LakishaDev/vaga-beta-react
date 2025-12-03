import { onCall } from "firebase-functions/v2/https";
import { db } from "../utils/db";
import { assertAdmin } from "../utils/auth";
import { generateLicenseKey } from "../utils/generateLicenseKey";

export const adminRegenerateLicenseKey = onCall(async (req) => {
  assertAdmin(req);

  const { licenseId } = req.data;
  const newKey = generateLicenseKey();

  await db.doc(`licenses/${licenseId}`).update({
    licenseKey: newKey,
    regeneratedAt: new Date(),
  });

  return { newLicenseKey: newKey };
});
