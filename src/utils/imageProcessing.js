import { normalizeSlug } from "./slugUtils";

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image decoding failed."));
    };

    image.src = objectUrl;
  });
}

function toWebPBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("WebP conversion failed."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

export async function resizeAndConvertToWebP(
  file,
  maxWidth,
  maxHeight,
  quality = 0.75,
) {
  if (!(file instanceof File || file instanceof Blob)) {
    throw new Error("Invalid image file.");
  }

  const sourceImage = await loadImageFromFile(file);
  const ratio = Math.min(
    maxWidth / sourceImage.width,
    maxHeight / sourceImage.height,
    1,
  );

  const targetWidth = Math.max(1, Math.round(sourceImage.width * ratio));
  const targetHeight = Math.max(1, Math.round(sourceImage.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    throw new Error("Canvas context is unavailable.");
  }

  ctx.drawImage(sourceImage, 0, 0, targetWidth, targetHeight);
  return toWebPBlob(canvas, quality);
}

export async function convertToWebP(file, quality = 0.85) {
  const sourceImage = await loadImageFromFile(file);
  const canvas = document.createElement("canvas");
  canvas.width = sourceImage.width;
  canvas.height = sourceImage.height;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    throw new Error("Canvas context is unavailable.");
  }

  ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);
  return toWebPBlob(canvas, quality);
}

export async function generateImageVariants(file) {
  const [thumb, medium, original] = await Promise.all([
    resizeAndConvertToWebP(file, 256, 256, 0.75),
    resizeAndConvertToWebP(file, 512, 512, 0.75),
    convertToWebP(file, 0.85),
  ]);

  return { thumb, medium, original };
}

export function generateSeoFilename(productSlug, index, size) {
  const slug = normalizeSlug(productSlug);
  const imageIndex = Number.isFinite(Number(index)) ? Number(index) : 1;
  return `${slug}-${imageIndex}-${size}.webp`;
}
