const DIACRITICS_MAP: Record<string, string> = {
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

export function transliterateToAscii(value = ""): string {
  return String(value)
    .split("")
    .map((char) => DIACRITICS_MAP[char] ?? char)
    .join("");
}

export function normalizeSlug(value = ""): string {
  return transliterateToAscii(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlugFormat(slug = ""): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug));
}

export function validateSlug(slug: string): {
  valid: boolean;
  normalizedSlug: string;
  reason: string;
} {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    return {
      valid: false,
      normalizedSlug,
      reason: "Slug je obavezan.",
    };
  }

  if (normalizedSlug.length < 3) {
    return {
      valid: false,
      normalizedSlug,
      reason: "Slug mora imati najmanje 3 karaktera.",
    };
  }

  if (normalizedSlug.length > 120) {
    return {
      valid: false,
      normalizedSlug,
      reason: "Slug može imati najviše 120 karaktera.",
    };
  }

  if (!isValidSlugFormat(normalizedSlug)) {
    return {
      valid: false,
      normalizedSlug,
      reason: "Slug format nije validan.",
    };
  }

  if (RESERVED_PRODUCT_SLUGS.has(normalizedSlug)) {
    return {
      valid: false,
      normalizedSlug,
      reason: "Slug je rezervisan.",
    };
  }

  return {
    valid: true,
    normalizedSlug,
    reason: "",
  };
}
