import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import { validateSlug } from "../utils/slugUtils";

export async function checkProductSlugAvailability(slug, options = {}) {
  const { excludeProductId } = options;
  const validation = validateSlug(slug);

  if (!validation.valid) {
    return {
      available: false,
      normalizedSlug: validation.normalizedSlug,
      reason: validation.reason,
    };
  }

  const snapshot = await getDocs(
    query(
      collection(db, "products"),
      where("slug", "==", validation.normalizedSlug),
      limit(1),
    ),
  );

  if (snapshot.empty) {
    return {
      available: true,
      normalizedSlug: validation.normalizedSlug,
      reason: "",
    };
  }

  const matched = snapshot.docs[0];
  if (excludeProductId && matched.id === excludeProductId) {
    return {
      available: true,
      normalizedSlug: validation.normalizedSlug,
      reason: "",
    };
  }

  return {
    available: false,
    normalizedSlug: validation.normalizedSlug,
    reason: "Slug je već zauzet.",
  };
}
