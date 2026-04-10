import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { config } from "dotenv";
import sharp from "sharp";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

config();

const ROOT = process.cwd();
const SERVICE_ACCOUNT_PATH = path.join(
  ROOT,
  "functions",
  "serviceAccountKey.json",
);
const WORKER_URL = process.env.VITE_R2_WORKER_URL || process.env.R2_WORKER_URL;

function parseArgs(argv) {
  const args = {
    dryRun: false,
    productId: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--dry-run") {
      args.dryRun = true;
    }

    if (argv[i] === "--product-id" && argv[i + 1]) {
      args.productId = argv[i + 1];
      i += 1;
    }
  }

  return args;
}

function normalizeSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[đ]/g, "dj")
    .replace(/[ž]/g, "z")
    .replace(/[š]/g, "s")
    .replace(/[č]/g, "c")
    .replace(/[ć]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeFilename(slug, index, size) {
  return `${slug}-${index}-${size}.webp`;
}

function buildImageUrl(workerUrl, slug, filename) {
  return `${String(workerUrl).replace(/\/+$/, "")}/images/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`;
}

async function fetchBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}) ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function createVariants(buffer) {
  const [thumb, medium, original] = await Promise.all([
    sharp(buffer)
      .resize({
        width: 256,
        height: 256,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toBuffer(),
    sharp(buffer)
      .resize({
        width: 512,
        height: 512,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toBuffer(),
    sharp(buffer).webp({ quality: 85 }).toBuffer(),
  ]);

  return { thumb, medium, original };
}

async function uploadVariant(workerUrl, slug, filename, buffer) {
  const blob = new Blob([buffer], { type: "image/webp" });

  const formData = new FormData();
  formData.append("file", blob, filename);
  formData.append("namespace", "product-images");
  formData.append("filename", `${slug}/${filename}`);
  formData.append("cacheControl", "public, max-age=31536000, immutable");
  formData.append(
    "metadata",
    JSON.stringify({
      migratedAt: new Date().toISOString(),
      slug,
    }),
  );

  const response = await fetch(`${workerUrl.replace(/\/+$/, "")}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Upload failed (${response.status}): ${details}`);
  }

  return buildImageUrl(workerUrl, slug, filename);
}

function extractImageList(product) {
  const rawImages = Array.isArray(product?.images) ? product.images : [];
  return [product?.imgUrl, ...rawImages].filter(
    (item) => typeof item === "string" && item.startsWith("http"),
  );
}

async function migrateSingleProduct(
  workerUrl,
  productId,
  product,
  dryRun = false,
) {
  const slug = normalizeSlug(product.slug || product.name || productId);
  if (!slug) {
    throw new Error("Product has no valid slug/name.");
  }

  const sourceImages = extractImageList(product);
  if (sourceImages.length === 0) {
    return { skipped: true, reason: "No string-based source images." };
  }

  if (dryRun) {
    return {
      dryRun: true,
      slug,
      sourceCount: sourceImages.length,
    };
  }

  const migrated = [];

  for (let i = 0; i < sourceImages.length; i += 1) {
    const sourceUrl = sourceImages[i];
    const index = i + 1;

    const sourceBuffer = await fetchBuffer(sourceUrl);
    const variants = await createVariants(sourceBuffer);

    const [thumb, medium, original] = await Promise.all([
      uploadVariant(
        workerUrl,
        slug,
        makeFilename(slug, index, "thumb"),
        variants.thumb,
      ),
      uploadVariant(
        workerUrl,
        slug,
        makeFilename(slug, index, "medium"),
        variants.medium,
      ),
      uploadVariant(
        workerUrl,
        slug,
        makeFilename(slug, index, "original"),
        variants.original,
      ),
    ]);

    migrated.push({ thumb, medium, original });
  }

  return {
    slug,
    mainImage: migrated[0],
    galleryImages: migrated.slice(1),
  };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  if (!WORKER_URL) {
    throw new Error("Missing VITE_R2_WORKER_URL or R2_WORKER_URL env var.");
  }

  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error(`Missing service account file: ${SERVICE_ACCOUNT_PATH}`);
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"),
  );
  const app = initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore(app);

  const productDocs = args.productId
    ? [await db.collection("products").doc(args.productId).get()].filter(
        (doc) => doc.exists,
      )
    : (await db.collection("products").get()).docs;

  if (productDocs.length === 0) {
    console.log("No products found for migration.");
    await app.delete();
    return;
  }

  const failures = [];

  for (let i = 0; i < productDocs.length; i += 1) {
    const doc = productDocs[i];
    const product = doc.data() || {};

    try {
      const result = await migrateSingleProduct(
        WORKER_URL,
        doc.id,
        product,
        args.dryRun,
      );

      if (result.skipped) {
        console.log(
          `[${i + 1}/${productDocs.length}] Skipped: ${doc.id} (${result.reason})`,
        );
        continue;
      }

      if (result.dryRun) {
        console.log(
          `[${i + 1}/${productDocs.length}] Dry-run: ${result.slug} (${result.sourceCount} images)`,
        );
        continue;
      }

      await db.collection("products").doc(doc.id).update({
        imgUrl: result.mainImage,
        images: result.galleryImages,
      });

      console.log(`[${i + 1}/${productDocs.length}] Migrated: ${result.slug}`);
    } catch (error) {
      failures.push({ productId: doc.id, error: error.message });
      console.error(
        `[${i + 1}/${productDocs.length}] Failed: ${doc.id} - ${error.message}`,
      );
    }
  }

  if (failures.length > 0) {
    console.log("\nMigration failures:");
    failures.forEach((failure) => {
      console.log(`- ${failure.productId}: ${failure.error}`);
    });
  }

  await app.delete();
}

run().catch((error) => {
  console.error(`Migration aborted: ${error.message}`);
  process.exit(1);
});
