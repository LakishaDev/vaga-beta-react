import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { assertAdmin } from "../utils/auth";

export const adminSetVersionPolicy = onCall(async (req) => {
  assertAdmin(req);

  const { channel, targetVersion, mandatory, defaultGraceDays } = req.data as {
    channel: string;
    targetVersion: string | null;
    mandatory: boolean;
    defaultGraceDays: number;
  };

  if (channel !== "stable" && channel !== "beta") {
    throw new HttpsError("invalid-argument", "channel must be 'stable' or 'beta'");
  }
  if (typeof mandatory !== "boolean") {
    throw new HttpsError("invalid-argument", "mandatory must be boolean");
  }
  if (typeof defaultGraceDays !== "number" || defaultGraceDays < 0) {
    throw new HttpsError("invalid-argument", "defaultGraceDays must be a non-negative number");
  }

  const db = getFirestore();

  if (targetVersion !== null && targetVersion !== undefined) {
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
  await db.collection("updatePolicies").doc(channel).set({
    targetVersion: targetVersion ?? null,
    mandatory,
    defaultGraceDays,
    updatedAt: now,
    updatedBy: req.auth?.token?.email ?? req.auth?.uid ?? "unknown",
  });

  return { ok: true, channel, targetVersion };
});
