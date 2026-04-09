import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import admin from "firebase-admin";

async function getServiceAccount() {
  const customPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const fallbackPath = resolve(
    process.cwd(),
    "functions/serviceAccountKey.json",
  );
  const filePath = customPath || fallbackPath;

  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function seedPromo() {
  const serviceAccount = await getServiceAccount();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = admin.firestore();

  const payload = {
    active: true,
    type: "sitewide",
    discountPercent: 20,
    startDate: admin.firestore.Timestamp.fromDate(
      new Date("2026-04-09T00:00:00+02:00"),
    ),
    endDate: admin.firestore.Timestamp.fromDate(
      new Date("2026-09-19T23:59:59+02:00"),
    ),
    theme: "easter",
    bannerText: "Uskrsnji popust -20% na sve proizvode!",
    bannerSubtext: "Iskoristite priliku dok traje akcija",
    showCountdown: true,
    promoCode: "easter-2026",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db
    .collection("promotions")
    .doc("active-promo")
    .set(payload, { merge: true });
  console.log("Promotions/active-promo je uspesno seedovan.");
}

seedPromo().catch((error) => {
  console.error("Seed promo error:", error.message);
  process.exitCode = 1;
});
