import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { assertAdmin } from "../utils/auth";

export const adminSetLicenseVersion = onCall(async (req) => {
  assertAdmin(req);

  const { licenseKey, targetVersion, mode, graceDays, mandatory } = req.data as {
    licenseKey: string;
    targetVersion: string | null;
    mode: "follow" | "pin";
    graceDays?: number | null;
    mandatory?: boolean;
  };

  if (!licenseKey) {
    throw new HttpsError("invalid-argument", "licenseKey required");
  }
  if (mode !== "follow" && mode !== "pin") {
    throw new HttpsError("invalid-argument", "mode must be 'follow' or 'pin'");
  }
  if (mode === "pin" && !targetVersion) {
    throw new HttpsError("invalid-argument", "targetVersion required when mode is 'pin'");
  }

  const db = getFirestore();

  // Validacija da licenca postoji
  const licenseRef = db.collection("licenses").doc(licenseKey);
  const licenseSnap = await licenseRef.get();
  if (!licenseSnap.exists) {
    throw new HttpsError("not-found", `License ${licenseKey} not found`);
  }

  // Validacija da release postoji i da je published (samo ako se pinuje)
  if (targetVersion) {
    const releaseSnap = await db.collection("releases").doc(targetVersion).get();
    if (!releaseSnap.exists) {
      throw new HttpsError("not-found", `Release ${targetVersion} not found`);
    }
    const releaseData = releaseSnap.data()!;
    if (releaseData.status !== "published") {
      throw new HttpsError("failed-precondition", `Release ${targetVersion} is not published`);
    }
  }

  const now = Timestamp.now();
  const adminEmail = req.auth?.token?.email ?? req.auth?.uid ?? "unknown";

  const update: Record<string, unknown> = {
    versionMode: mode,
    targetVersion: targetVersion ?? null,
    versionMandatory: mandatory ?? false,
    versionAssignedAt: now,
    versionAssignedBy: adminEmail,
  };

  if (mode === "follow") {
    // Reset — ukloni downgrade deadline
    update.versionGraceDays = null;
    update.downgradeDeadline = null;
  } else if (graceDays != null && graceDays > 0) {
    update.versionGraceDays = graceDays;
    update.downgradeDeadline = Timestamp.fromMillis(
      Date.now() + graceDays * 86_400_000
    );
  } else {
    update.versionGraceDays = null;
    update.downgradeDeadline = null;
  }

  await licenseRef.update(update);

  return { ok: true, licenseKey, targetVersion, mode };
});
