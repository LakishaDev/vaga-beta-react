import R2CacheService from "./R2CacheService";
import {
  generateImageVariants,
  generateSeoFilename,
} from "../utils/imageProcessing";

const PRODUCT_IMAGE_NAMESPACE = "product-images";

function toWebPFile(blob, filename) {
  return new File([blob], filename, { type: "image/webp" });
}

function buildPublicImageUrl(workerUrl, slug, filename) {
  const baseUrl = String(workerUrl || "").replace(/\/+$/, "");
  return `${baseUrl}/images/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`;
}

async function uploadVariant(slug, filename, blob, customMetadata = {}) {
  const file = toWebPFile(blob, filename);

  const result = await R2CacheService.uploadFile(file, {
    namespace: PRODUCT_IMAGE_NAMESPACE,
    filename: `${slug}/${filename}`,
    cacheControl: "public, max-age=31536000, immutable",
    customMetadata,
  });

  if (!result?.success) {
    throw new Error(result?.error || "R2 upload failed");
  }

  return buildPublicImageUrl(R2CacheService.workerUrl, slug, filename);
}

async function uploadImageWithVariants(slug, file, index) {
  const variants = await generateImageVariants(file);

  const thumbFilename = generateSeoFilename(slug, index, "thumb");
  const mediumFilename = generateSeoFilename(slug, index, "medium");
  const originalFilename = generateSeoFilename(slug, index, "original");

  const [thumb, medium, original] = await Promise.all([
    uploadVariant(slug, thumbFilename, variants.thumb, {
      size: "thumb",
      index,
    }),
    uploadVariant(slug, mediumFilename, variants.medium, {
      size: "medium",
      index,
    }),
    uploadVariant(slug, originalFilename, variants.original, {
      size: "original",
      index,
    }),
  ]);

  return { thumb, medium, original };
}

class ProductImageService {
  async uploadMainImage(slug, mainImage, index = 1) {
    if (!mainImage) return null;
    return uploadImageWithVariants(slug, mainImage, index);
  }

  async uploadGalleryImages(slug, galleryImages = [], startIndex = 2) {
    const files = Array.isArray(galleryImages) ? galleryImages : [];
    if (files.length === 0) return [];

    const uploaded = [];
    for (let i = 0; i < files.length; i += 1) {
      uploaded.push(
        await uploadImageWithVariants(slug, files[i], startIndex + i),
      );
    }

    return uploaded;
  }

  async uploadProductImages(slug, mainImage, galleryImages = []) {
    const [mainImageVariants, galleryImageVariants] = await Promise.all([
      this.uploadMainImage(slug, mainImage, 1),
      this.uploadGalleryImages(slug, galleryImages, 2),
    ]);

    return {
      mainImage: mainImageVariants,
      galleryImages: galleryImageVariants,
    };
  }

  async deleteProductImages(slug) {
    const listResponse = await R2CacheService.listFiles(
      PRODUCT_IMAGE_NAMESPACE,
    );
    const files = Array.isArray(listResponse?.files) ? listResponse.files : [];
    const prefix = `v1/${PRODUCT_IMAGE_NAMESPACE}/${slug}/`;

    const deletions = files
      .filter(
        (item) => typeof item?.key === "string" && item.key.startsWith(prefix),
      )
      .map((item) => {
        const filename = item.key.replace(`v1/${PRODUCT_IMAGE_NAMESPACE}/`, "");
        return R2CacheService.deleteFile(filename, PRODUCT_IMAGE_NAMESPACE);
      });

    await Promise.allSettled(deletions);
  }
}

export default new ProductImageService();
