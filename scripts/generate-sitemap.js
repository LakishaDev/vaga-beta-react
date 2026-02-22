/**
 * Sitemap Generator za Vaga Beta
 * Generiše sitemap.xml za bolje SEO
 * Pokreni: node scripts/generate-sitemap.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://vagabeta.rs";
const DEFAULT_LASTMOD = new Date().toISOString().split("T")[0];

// Definiši sve stranice na sajtu
const staticPages = [
  {
    url: "",
    changefreq: "daily",
    priority: "1.0",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/usluge",
    changefreq: "weekly",
    priority: "0.9",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/kontakt",
    changefreq: "monthly",
    priority: "0.8",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/onama",
    changefreq: "monthly",
    priority: "0.7",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/aplikacija",
    changefreq: "weekly",
    priority: "0.8",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/newsletter",
    changefreq: "weekly",
    priority: "0.8",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/evaga-desktop",
    changefreq: "weekly",
    priority: "0.8",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/prodavnica",
    changefreq: "daily",
    priority: "0.9",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/prodavnica/proizvodi",
    changefreq: "daily",
    priority: "0.9",
    lastmod: DEFAULT_LASTMOD,
  },
  {
    url: "/privacy-policy",
    changefreq: "yearly",
    priority: "0.3",
    lastmod: DEFAULT_LASTMOD,
  },
];

function extractDocId(documentName = "") {
  const parts = documentName.split("/");
  return parts[parts.length - 1] || null;
}

function toAbsoluteUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function extractProductImages(fields = {}) {
  const imageSet = new Set();

  const imgUrl = fields.imgUrl?.stringValue;
  if (imgUrl) {
    imageSet.add(toAbsoluteUrl(imgUrl));
  }

  const imageValues = fields.images?.arrayValue?.values || [];
  imageValues.forEach((value) => {
    const imageUrl = value?.stringValue;
    if (imageUrl) {
      imageSet.add(toAbsoluteUrl(imageUrl));
    }
  });

  return Array.from(imageSet).filter(Boolean);
}

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function fetchProductPages() {
  const projectId =
    process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const apiKey =
    process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    console.warn(
      "⚠️  FIREBASE env nije dostupan, preskačem dinamičke product URL-ove u sitemap-u.",
    );
    return [];
  }

  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=500&key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.warn(
        `⚠️  Firestore fetch nije uspeo (${response.status}), preskačem product URL-ove.`,
      );
      return [];
    }

    const payload = await response.json();
    const documents = payload.documents || [];

    return documents
      .map((doc) => {
        const id = extractDocId(doc.name);
        if (!id) return null;

        return {
          url: `/prodavnica/proizvod/${id}`,
          changefreq: "daily",
          priority: "0.8",
          lastmod: DEFAULT_LASTMOD,
          images: extractProductImages(doc.fields),
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.warn(
      "⚠️  Greška pri čitanju proizvoda za sitemap, nastavljam bez product URL-ova:",
      error.message,
    );
    return [];
  }
}

// Generiši XML sitemap
function generateSitemap(pages) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(`${BASE_URL}${page.url}`)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${(page.images || [])
  .map(
    (imageUrl) =>
      `    <image:image>\n      <image:loc>${escapeXml(imageUrl)}</image:loc>\n    </image:image>`,
  )
  .join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return sitemap;
}

// Sačuvaj sitemap u public folderu
async function saveSitemap() {
  const productPages = await fetchProductPages();
  const pages = [...staticPages, ...productPages];
  const sitemap = generateSitemap(pages);
  const publicDir = path.join(__dirname, "..", "public");
  const sitemapPath = path.join(publicDir, "sitemap.xml");

  // Proveri da li postoji public folder
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, sitemap, "utf-8");
  console.log("✅ Sitemap.xml uspešno generisan!");
  console.log(`📍 Lokacija: ${sitemapPath}`);
  console.log(`🔗 URL: ${BASE_URL}/sitemap.xml`);
  console.log(`🛍️  Dodato product URL-ova: ${productPages.length}`);

  return pages.length;
}

// Generiši robots.txt reference (opciono)
function generateRobotsTxt() {
  const robotsContent = `# Generisano automatski
User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

  const publicDir = path.join(__dirname, "..", "public");
  const robotsPath = path.join(publicDir, "robots-generated.txt");

  fs.writeFileSync(robotsPath, robotsContent, "utf-8");
  console.log("✅ robots-generated.txt kreiran!");
}

// Pokreni generisanje
try {
  const totalPages = await saveSitemap();
  console.log("\n📊 Sitemap statistika:");
  console.log(`   - Ukupno stranica: ${totalPages}`);
  console.log(
    `   - Poslednja izmena: ${new Date().toLocaleDateString("sr-RS")}`,
  );
} catch (error) {
  console.error("❌ Greška pri generisanju sitemap-a:", error);
  process.exit(1);
}
