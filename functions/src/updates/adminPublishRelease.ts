import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { assertAdmin } from "../utils/auth";

export const adminPublishRelease = onCall(async (req) => {
  assertAdmin(req);

  const { version } = req.data;
  if (!version) {
    throw new HttpsError("invalid-argument", "version required");
  }

  const db = getFirestore();
  const ref = db.collection("releases").doc(version);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new HttpsError("not-found", `Release ${version} not found`);
  }

  const release = snap.data()!;
  if (release.status === "published") {
    throw new HttpsError("already-exists", "Release already published");
  }

  const batch = db.batch();
  const now = Timestamp.now();

  // Skini isLatest sa prethodne published verzije
  const prevSnap = await db
    .collection("releases")
    .where("status", "==", "published")
    .where("channel", "==", release.channel)
    .where("isLatest", "==", true)
    .limit(1)
    .get();

  if (!prevSnap.empty) {
    batch.update(prevSnap.docs[0].ref, { isLatest: false });
  }

  batch.update(ref, {
    status: "published",
    isLatest: true,
    publishedAt: now,
  });

  await batch.commit();

  return { success: true, version, status: "published" };
});
