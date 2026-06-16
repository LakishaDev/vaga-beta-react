import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { assertAdmin } from "../utils/auth";

export const adminUnpublishRelease = onCall(async (req) => {
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
  if (release.status !== "published") {
    throw new HttpsError("failed-precondition", "Release is not published");
  }

  await ref.update({ status: "draft", isLatest: false, publishedAt: null });

  return { success: true, version, status: "draft" };
});
