import { httpsCallable } from "firebase/functions";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db, functions } from "../utils/firebase";
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

  try {
    const callable = httpsCallable(functions, "validateProductSlug");
    const response = await callable({
      slug: validation.normalizedSlug,
      excludeProductId: excludeProductId || null,
    });

    return {
      available: Boolean(response?.data?.available),
      normalizedSlug:
        response?.data?.normalizedSlug || validation.normalizedSlug,
      reason: response?.data?.reason || "",
    };
  } catch (error) {
    console.warn(
      "Slug callable check failed, using Firestore fallback:",
      error,
    );

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
}
