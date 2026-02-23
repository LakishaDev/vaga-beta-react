// @ts-nocheck
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "../utils/db";
import { validateSlug } from "../utils/slug";

function hasAdminAccess(req: any): boolean {
  const isAdminClaim = req.auth?.token?.admin === true;
  if (isAdminClaim) return true;

  const rawAdminEmails =
    process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || "";
  const adminEmails = rawAdminEmails
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const email = String(req.auth?.token?.email || "").toLowerCase();
  return Boolean(email && adminEmails.includes(email));
}

export const validateProductSlug = onCall(async (req: any) => {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "User not authenticated");
  }

  if (!hasAdminAccess(req)) {
    throw new HttpsError("permission-denied", "Admin access required");
  }

  const slugInput = String(req.data?.slug || "");
  const excludeProductId = req.data?.excludeProductId
    ? String(req.data.excludeProductId)
    : "";

  const slugValidation = validateSlug(slugInput);
  if (!slugValidation.valid) {
    return {
      available: false,
      normalizedSlug: slugValidation.normalizedSlug,
      reason: slugValidation.reason,
    };
  }

  const slugRef = db
    .collection("productSlugs")
    .doc(slugValidation.normalizedSlug);
  const slugDoc = await slugRef.get();

  if (slugDoc.exists) {
    const productId = String(slugDoc.data()?.productId || "");
    const isSameProduct = Boolean(
      excludeProductId && productId && excludeProductId === productId,
    );

    if (!isSameProduct) {
      return {
        available: false,
        normalizedSlug: slugValidation.normalizedSlug,
        reason: "Slug je već zauzet.",
      };
    }
  }

  const duplicateProducts = await db
    .collection("products")
    .where("slug", "==", slugValidation.normalizedSlug)
    .limit(1)
    .get();

  if (!duplicateProducts.empty) {
    const existingId = duplicateProducts.docs[0].id;
    if (!excludeProductId || existingId !== excludeProductId) {
      return {
        available: false,
        normalizedSlug: slugValidation.normalizedSlug,
        reason: "Slug je već zauzet.",
      };
    }
  }

  return {
    available: true,
    normalizedSlug: slugValidation.normalizedSlug,
    reason: "",
  };
});
