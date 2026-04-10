export function isImageVariantsObject(value) {
  return !!(
    value &&
    typeof value === "object" &&
    (typeof value.thumb === "string" ||
      typeof value.medium === "string" ||
      typeof value.original === "string")
  );
}

export function toImageVariants(value) {
  if (!isImageVariantsObject(value)) return null;
  return {
    thumb: value.thumb || "",
    medium: value.medium || "",
    original: value.original || "",
  };
}

export function getImageUrl(
  value,
  preference = ["medium", "thumb", "original"],
) {
  if (!value) return "";
  if (typeof value === "string") return value;

  const variants = toImageVariants(value);
  if (!variants) return "";

  for (const key of preference) {
    if (variants[key]) return variants[key];
  }

  return "";
}

export function getImageOriginalUrl(value) {
  return getImageUrl(value, ["original", "medium", "thumb"]);
}

export function getImageDisplayUrl(value) {
  return getImageUrl(value, ["medium", "thumb", "original"]);
}

export function normalizeImageArray(images) {
  if (!Array.isArray(images)) return [];
  return images.filter(Boolean);
}
