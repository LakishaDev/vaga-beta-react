import process from "node:process";

const FIREBASE_PROJECT_ID =
  process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY =
  process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;

if (!FIREBASE_PROJECT_ID || !FIREBASE_API_KEY) {
  console.error(
    "❌ Missing FIREBASE_PROJECT_ID/VITE_FIREBASE_PROJECT_ID or FIREBASE_API_KEY/VITE_FIREBASE_API_KEY",
  );
  process.exit(1);
}

function slugifyName(value = "") {
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

function extractId(path = "") {
  const parts = path.split("/");
  return parts[parts.length - 1] || "";
}

async function fetchAllProducts() {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products?pageSize=500&key=${FIREBASE_API_KEY}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Products fetch failed (${response.status})`);
  }

  const payload = await response.json();
  return payload.documents || [];
}

async function patchProduct(docName, fields) {
  const endpoint = `https://firestore.googleapis.com/v1/${docName}?updateMask.fieldPaths=slug&key=${FIREBASE_API_KEY}`;
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Patch failed (${response.status}): ${details}`);
  }
}

async function createSlugIndex(slug, productId) {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/productSlugs?documentId=${encodeURIComponent(slug)}&key=${FIREBASE_API_KEY}`;
  const now = new Date().toISOString();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        slug: { stringValue: slug },
        productId: { stringValue: productId },
        createdAt: { timestampValue: now },
      },
    }),
  });

  if (response.status === 409) {
    return false;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Slug index create failed (${response.status}): ${details}`,
    );
  }

  return true;
}

async function run() {
  console.log("🔁 Product slug migration started...");
  const documents = await fetchAllProducts();

  if (documents.length === 0) {
    console.log("ℹ️ No products found.");
    return;
  }

  const used = new Set();
  let updated = 0;
  let generated = 0;
  let conflicts = 0;

  for (const doc of documents) {
    const productId = extractId(doc.name);
    const fields = doc.fields || {};
    const baseSlug =
      fields.slug?.stringValue || slugifyName(fields.name?.stringValue || "");

    if (!baseSlug) {
      console.warn(`⚠️ Skip product ${productId}: no valid name for slug`);
      continue;
    }

    let slug = baseSlug;
    let suffix = 2;
    while (used.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
      conflicts += 1;
    }
    used.add(slug);

    if (fields.slug?.stringValue !== slug) {
      await patchProduct(doc.name, {
        slug: { stringValue: slug },
      });
      updated += 1;
    }

    const created = await createSlugIndex(slug, productId);
    if (!created) {
      conflicts += 1;
    }

    generated += 1;
    console.log(`✅ ${productId} -> ${slug}`);
  }

  console.log("\n📊 Migration summary");
  console.log(`   Products processed: ${generated}`);
  console.log(`   Products updated:   ${updated}`);
  console.log(`   Collisions fixed:   ${conflicts}`);
  console.log("✅ Product slug migration finished");
}

run().catch((error) => {
  console.error(`❌ Migration failed: ${error.message}`);
  process.exit(1);
});
