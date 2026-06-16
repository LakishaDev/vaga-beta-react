import { onRequest, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as crypto from "crypto";
import { signString } from "../crypto/signToken";

const FEED_TOKEN_SECRET = process.env.FEED_TOKEN_SECRET!;
const R2_WORKER_URL = (process.env.R2_WORKER_URL ?? "https://worker.vagabeta.rs").replace(/\/$/, "");
const FEED_TOKEN_TTL_SECONDS = 3600; // 1h

function generateFeedToken(version: string, app: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + FEED_TOKEN_TTL_SECONDS;
  const payload = `${version}:${app}:${expiresAt}`;
  const sig = crypto
    .createHmac("sha256", FEED_TOKEN_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(JSON.stringify({ version, app, expiresAt, sig })).toString("base64url");
}

export const updateCheck = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      throw new HttpsError("invalid-argument", "POST required");
    }

    const { licenseKey, hwid, ip, appVersion, app, channel = "stable" } = req.body;

    if (!licenseKey || !hwid || !app) {
      throw new HttpsError("invalid-argument", "licenseKey, hwid and app required");
    }
    if (app !== "server" && app !== "client") {
      throw new HttpsError("invalid-argument", "app must be 'server' or 'client'");
    }

    const db = getFirestore();

    // Validacija licence (isti obrazac kao licenseVerify)
    const licenseSnap = await db.collection("licenses").doc(licenseKey).get();
    if (!licenseSnap.exists) {
      throw new HttpsError("not-found", "License not found");
    }
    const license = licenseSnap.data()!;
    const now = Timestamp.now();

    if (license.status !== "active") {
      throw new HttpsError("permission-denied", "License not active");
    }
    if (license.expiresAt.toDate() < now.toDate()) {
      throw new HttpsError("permission-denied", "License expired");
    }
    if (!license.hardwareLocked || license.hwidHash !== hwid) {
      throw new HttpsError("permission-denied", "Hardware mismatch");
    }
    if (license.ipLockEnabled && license.ipAddress && ip !== license.ipAddress) {
      throw new HttpsError("permission-denied", "IP address mismatch");
    }

    // Pronađi najnoviji published release za traženi kanal
    const releasesSnap = await db
      .collection("releases")
      .where("status", "==", "published")
      .where("channel", "==", channel)
      .where("isLatest", "==", true)
      .limit(1)
      .get();

    if (releasesSnap.empty) {
      res.json({ updateAvailable: false });
      return;
    }

    const release = releasesSnap.docs[0].data();
    const latestVersion: string = release.version;

    // Jednostavna semver komparacija (major.minor.patch)
    const updateAvailable = latestVersion !== appVersion && semverGt(latestVersion, appVersion ?? "0.0.0");

    if (!updateAvailable) {
      res.json({ updateAvailable: false, version: latestVersion });
      return;
    }

    const artifact = app === "server" ? release.artifacts?.server : release.artifacts?.client;
    const feedToken = generateFeedToken(latestVersion, app);
    const feedUrl = artifact?.feedPath
      ? `${R2_WORKER_URL}/download/${artifact.feedPath}`
      : null;
    const setupUrl = artifact?.setupUrl ?? null;

    const payload = {
      updateAvailable: true,
      version: latestVersion,
      channel,
      feedUrl,
      feedToken,
      setupUrl,
      notes: release.notes ?? "",
      mandatory: release.mandatory ?? false,
      minServerVersion: release.minServerVersion ?? "0.0.0",
      minClientVersion: release.minClientVersion ?? "0.0.0",
      issuedAt: now.toDate().toISOString(),
    };

    // Potpisuje se isti deterministički string koji desktop klijent
    // verifikuje (UpdateService: `${version}:${feedUrl}:${feedToken}`).
    const signature = signString(`${latestVersion}:${feedUrl}:${feedToken}`);

    res.json({ ...payload, signature });
  } catch (err: any) {
    console.error("UPDATE_CHECK ERROR", err);
    res.status(403).json({
      updateAvailable: false,
      error: err.message ?? "Update check failed",
    });
  }
});

function semverGt(a: string, b: string): boolean {
  const parse = (v: string) => v.replace(/^v/, "").split(".").map(Number);
  const [aMaj, aMin, aPat] = parse(a);
  const [bMaj, bMin, bPat] = parse(b);
  if (aMaj !== bMaj) return aMaj > bMaj;
  if (aMin !== bMin) return aMin > bMin;
  return aPat > bPat;
}
