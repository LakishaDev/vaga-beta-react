const DIACRITICS_MAP = {
  đ: "dj",
  Đ: "dj",
  ž: "z",
  Ž: "z",
  š: "s",
  Š: "s",
  č: "c",
  Č: "c",
  ć: "c",
  Ć: "c",
};

export const RESERVED_PRODUCT_SLUGS = new Set([
  "admin",
  "api",
  "kontakt",
  "usluge",
  "newsletter",
  "privacy",
  "prodavnica",
  "proizvod",
  "proizvodi",
  "search",
  "booking",
  "onama",
  "aplikacija",
  "evaga-desktop",
  "p",
]);

export function transliterateToAscii(value = "") {
  return String(value)
    .split("")
    .map((char) => DIACRITICS_MAP[char] ?? char)
    .join("");
}

export function normalizeSlug(value = "") {
  return transliterateToAscii(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugifyProductName(name = "") {
  return normalizeSlug(name);
}

export function isReservedSlug(slug = "") {
  return RESERVED_PRODUCT_SLUGS.has(String(slug).toLowerCase());
}

export function isValidSlugFormat(slug = "") {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug));
}

export function validateSlug(slug = "") {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    return { valid: false, reason: "Slug je obavezan.", normalizedSlug };
  }

  if (normalizedSlug.length < 3) {
    return {
      valid: false,
      reason: "Slug mora imati najmanje 3 karaktera.",
      normalizedSlug,
    };
  }

  if (normalizedSlug.length > 120) {
    return {
      valid: false,
      reason: "Slug može imati najviše 120 karaktera.",
      normalizedSlug,
    };
  }

  if (!isValidSlugFormat(normalizedSlug)) {
    return {
      valid: false,
      reason: "Slug može sadržati samo mala slova, brojeve i crtice.",
      normalizedSlug,
    };
  }

  if (isReservedSlug(normalizedSlug)) {
    return {
      valid: false,
      reason: "Ovaj slug je rezervisan.",
      normalizedSlug,
    };
  }

  return { valid: true, reason: "", normalizedSlug };
}

export function getProductPath(slug, fallbackId = "") {
  const normalizedSlug = normalizeSlug(slug || "");
  if (normalizedSlug) {
    return `/p/${normalizedSlug}`;
  }

  if (fallbackId) {
    return `/prodavnica/proizvod/${encodeURIComponent(fallbackId)}`;
  }

  return "/prodavnica/proizvodi";
}
