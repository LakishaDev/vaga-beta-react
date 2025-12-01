import { onRequest, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { signPayload } from "../crypto/signToken";

export const licenseVerify = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new HttpsError("invalid-argument", "POST required");
    }

    const { licenseKey, hwid, ip, appVersion } = req.body;

    if (!licenseKey || !hwid) {
      throw new HttpsError("invalid-argument", "licenseKey and hwid required");
    }

    const db = getFirestore();
    const ref = db.collection("licenses").doc(licenseKey);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new HttpsError("not-found", "License not found");
    }

    const license = snap.data()!;
    const now = Timestamp.now();

    // Status
    if (license.status !== "active") {
      throw new HttpsError("permission-denied", "License not active");
    }

    // Expiration
    if (license.expiresAt.toDate() < now.toDate()) {
      throw new HttpsError("permission-denied", "License expired");
    }

    // Hardware lock check
    if (!license.hardwareLocked || license.hwidHash !== hwid) {
      throw new HttpsError("permission-denied", "Hardware mismatch");
    }

    // IP lock check
    if (license.ipLockEnabled && license.ipAddress) {
      if (ip !== license.ipAddress) {
        throw new HttpsError("permission-denied", "IP address mismatch");
      }
    }

    // Refresh OFFLINE period
    const offlineUntil = Timestamp.fromDate(
      new Date(Date.now() + license.allowedOfflineDays * 24 * 60 * 60 * 1000)
    );

    // Update last seen activation
    const activations = await db
      .collection("activations")
      .where("licenseKey", "==", licenseKey)
      .where("hwidHash", "==", hwid)
      .orderBy("activatedAt", "desc")
      .limit(1)
      .get();

    if (!activations.empty) {
      activations.docs[0].ref.update({
        lastSeenAt: now,
        appVersion: appVersion ?? "unknown",
      });
    }

    // Token payload
    const payload = {
      licenseKey,
      hwidHash: hwid,
      ip: license.ipLockEnabled ? ip ?? null : null,
      modules: license.modules ?? {},
      expiresAt: license.expiresAt.toDate().toISOString(),
      offlineUntil: offlineUntil.toDate().toISOString(),
      issuedAt: now.toDate().toISOString(),
    };

    const signature = signPayload(payload);

    res.json({
      valid: true,
      payload,
      signature,
    });
  } catch (err: any) {
    console.error("VERIFY ERROR", err);
    res.status(403).json({
      valid: false,
      error: err.message ?? "Verification failed",
    });
  }
});
