import { onRequest, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { signPayload } from "../crypto/signToken";

export const licenseActivate = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new HttpsError("invalid-argument", "POST required");
    }

    const { licenseKey, hwid, ip, appVersion } = req.body;

    if (!licenseKey || !hwid) {
      throw new HttpsError("invalid-argument", "licenseKey and hwid required");
    }

    const db = getFirestore();
    const licenseRef = db.collection("licenses").doc(licenseKey);
    const snap = await licenseRef.get();

    if (!snap.exists) {
      throw new HttpsError("not-found", "License not found");
    }

    const license = snap.data()!;

    if (license.status !== "active") {
      throw new HttpsError("permission-denied", "License not active");
    }

    const now = Timestamp.now();
    if (license.expiresAt.toDate() < now.toDate()) {
      throw new HttpsError("permission-denied", "License expired");
    }

    // HARDWARE LOCK
    if (license.hardwareLocked) {
      if (license.hwidHash !== hwid) {
        throw new HttpsError(
          "permission-denied",
          "License locked to other hardware"
        );
      }
    } else {
      await licenseRef.update({
        hardwareLocked: true,
        hwidHash: hwid,
        ipAddress: license.ipLockEnabled ? ip ?? null : null,
      });
    }

    // IP LOCK (opciono)
    if (license.ipLockEnabled && license.ipAddress) {
      if (ip !== license.ipAddress) {
        throw new HttpsError("permission-denied", "IP address mismatch");
      }
    }

    // OFFLINE WINDOW
    const offlineUntil = Timestamp.fromDate(
      new Date(Date.now() + license.allowedOfflineDays * 24 * 60 * 60 * 1000)
    );

    // Aktivacija zapis
    await db.collection("activations").add({
      licenseKey,
      hwidHash: hwid,
      ip: ip ?? null,
      appVersion: appVersion ?? "unknown",
      activatedAt: now,
      lastSeenAt: now,
    });

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
    console.error(err);
    res.status(403).json({
      valid: false,
      error: err.message ?? "Activation failed",
    });
  }
});
