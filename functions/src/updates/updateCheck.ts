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

/**
 * Poredi dve semver verzije.
 * @returns 1 ako je a > b, -1 ako je a < b, 0 ako su jednake
 */
function semverCompare(a: string, b: string): 1 | 0 | -1 {
  const parse = (v: string) => v.replace(/^v/, "").split(".").map(Number);
  const [aMaj, aMin, aPat] = parse(a);
  const [bMaj, bMin, bPat] = parse(b);
  if (aMaj !== bMaj) return aMaj > bMaj ? 1 : -1;
  if (aMin !== bMin) return aMin > bMin ? 1 : -1;
  if (aPat !== bPat) return aPat > bPat ? 1 : -1;
  return 0;
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

    // ── Validacija licence ────────────────────────────────────────────────────
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

    // ── Razreši efektivni target ──────────────────────────────────────────────
    let targetVersion: string | null = null;
    let mandatory = false;
    let deadlineTs: Timestamp | null = null;

    if (license.versionMode === "pin" && license.targetVersion) {
      // Per-license pin
      targetVersion = license.targetVersion as string;
      mandatory = license.versionMandatory ?? false;
      deadlineTs = license.downgradeDeadline ?? null;
    } else {
      // Globalni default po kanalu
      const policySnap = await db.collection("updatePolicies").doc(channel).get();
      if (policySnap.exists) {
        const policy = policySnap.data()!;
        if (policy.targetVersion) {
          targetVersion = policy.targetVersion as string;
          mandatory = policy.mandatory ?? false;
          // Grace: updatedAt + defaultGraceDays
          if (policy.updatedAt && policy.defaultGraceDays > 0) {
            const updatedAtMs = (policy.updatedAt as Timestamp).toMillis();
            deadlineTs = Timestamp.fromMillis(
              updatedAtMs + (policy.defaultGraceDays as number) * 86_400_000
            );
          }
        }
      }
    }

    // ── Fallback: najnoviji isLatest published release ────────────────────────
    if (!targetVersion) {
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
      const cmp = semverCompare(latestVersion, appVersion ?? "0.0.0");

      if (cmp <= 0) {
        res.json({ updateAvailable: false, version: latestVersion });
        return;
      }

      // Upgrade — stari kod path
      const artifact = app === "server" ? release.artifacts?.server : release.artifacts?.client;
      const feedToken = generateFeedToken(latestVersion, app);
      const feedUrl = artifact?.feedPath
        ? `${R2_WORKER_URL}/download/${artifact.feedPath}`
        : null;
      const setupUrl = artifact?.setupUrl ?? null;
      const signature = signString(`${latestVersion}:${feedUrl}:${feedToken}`);

      res.json({
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
        signature,
      });
      return;
    }

    // ── Target je zadan (pin ili global policy) ───────────────────────────────
    const releaseSnap = await db.collection("releases").doc(targetVersion).get();
    if (!releaseSnap.exists || releaseSnap.data()!.status !== "published") {
      res.json({ updateAvailable: false });
      return;
    }
    const release = releaseSnap.data()!;

    const cmp = semverCompare(targetVersion, appVersion ?? "0.0.0");

    if (cmp === 0) {
      // Već na ciljanoj verziji
      res.json({ updateAvailable: false, version: targetVersion });
      return;
    }

    const artifact = app === "server" ? release.artifacts?.server : release.artifacts?.client;
    const feedToken = generateFeedToken(targetVersion, app);
    const feedUrl = artifact?.feedPath
      ? `${R2_WORKER_URL}/download/${artifact.feedPath}`
      : null;
    const setupUrl = artifact?.setupUrl ?? null;
    const signature = signString(`${targetVersion}:${feedUrl}:${feedToken}`);

    const basePayload = {
      version: targetVersion,
      channel,
      feedUrl,
      feedToken,
      setupUrl,
      notes: release.notes ?? "",
      mandatory,
      minServerVersion: release.minServerVersion ?? "0.0.0",
      minClientVersion: release.minClientVersion ?? "0.0.0",
      issuedAt: now.toDate().toISOString(),
      signature,
    };

    if (cmp > 0) {
      // Upgrade
      res.json({ updateAvailable: true, ...basePayload });
      return;
    }

    // Downgrade (cmp < 0)
    if (deadlineTs && now.toMillis() < deadlineTs.toMillis()) {
      // Grace period još traje — klijent ostaje na trenutnoj verziji
      res.json({
        updateAvailable: false,
        pending: true,
        scheduledVersion: targetVersion,
        downgradeAt: deadlineTs.toDate().toISOString(),
      });
      return;
    }

    // Grace istekao ili nije zadan — forsiran downgrade
    res.json({
      updateAvailable: true,
      downgrade: true,
      ...basePayload,
      mandatory: true,
    });
  } catch (err: any) {
    console.error("UPDATE_CHECK ERROR", err);
    res.status(403).json({
      updateAvailable: false,
      error: err.message ?? "Update check failed",
    });
  }
});
