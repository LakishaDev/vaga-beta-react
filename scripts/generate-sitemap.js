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

// Definiši sve stranice na sajtu
const staticPages = [
  {
    url: "",
    changefreq: "daily",
    priority: "1.0",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/usluge",
    changefreq: "weekly",
    priority: "0.9",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/kontakt",
    changefreq: "monthly",
    priority: "0.8",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/onama",
    changefreq: "monthly",
    priority: "0.7",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/aplikacija",
    changefreq: "weekly",
    priority: "0.8",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/evaga-desktop",
    changefreq: "weekly",
    priority: "0.8",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/prodavnica",
    changefreq: "daily",
    priority: "0.9",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/privacy-policy",
    changefreq: "yearly",
    priority: "0.3",
    lastmod: new Date().toISOString().split("T")[0],
  },
];

// Generiši XML sitemap
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return sitemap;
}

// Sačuvaj sitemap u public folderu
function saveSitemap() {
  const sitemap = generateSitemap();
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
  saveSitemap();
  console.log("\n📊 Sitemap statistika:");
  console.log(`   - Ukupno stranica: ${staticPages.length}`);
  console.log(
    `   - Poslednja izmena: ${new Date().toLocaleDateString("sr-RS")}`,
  );
} catch (error) {
  console.error("❌ Greška pri generisanju sitemap-a:", error);
  process.exit(1);
}
