import { onCall, HttpsError } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../init";
import { assertAdmin } from "../auth";
import { generateLicenseKey } from "../utils/generateLicenseKey";

export const adminCreateLicense = onCall(
  { region: "europe-west1" },
  async (req) => {
    assertAdmin(req);

    const {
      clientName,
      clientEmail,
      licenseType,
      expiresAt,
      maxActivations = 1,
      modules = {},
      offlineDaysAllowed = 7,
      isTrial = false,
      autoRenew = false,
    } = req.data;

    if (!licenseType) {
      throw new HttpsError("invalid-argument", "licenseType required");
    }

    const licenseKey = generateLicenseKey();
    const now = Timestamp.now();

    const doc = {
      licenseKey,
      clientName: clientName ?? "",
      clientEmail: clientEmail ?? "",
      licenseType,
      status: isTrial ? "trial" : "active",
      isTrial,
      maxActivations,
      currentActivations: 0,
      modules,
      offlineDaysAllowed,
      createdAt: now,
      expiresAt: Timestamp.fromDate(new Date(expiresAt)),
      isBlocked: false,
      autoRenew,
      hardwareId: null,
      lastSeen: null,
      activationHistory: [],
      extensionHistory: [],
    };

    const ref = await db.collection("licenses").add(doc);

    return { id: ref.id, licenseKey };
  }
);
