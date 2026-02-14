// scripts/generate-sitemap-ssr.js
// Generiše sitemap.xml iz Firestore podataka
// Za SSR - koristi Firebase Admin SDK da direktno čita bazu

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Putanje za static rute
const STATIC_ROUTES = [
  { url: "", priority: 1.0, changefreq: "weekly" },
  { url: "/usluge", priority: 0.9, changefreq: "monthly" },
  { url: "/kontakt", priority: 0.8, changefreq: "monthly" },
  { url: "/onama", priority: 0.7, changefreq: "yearly" },
  { url: "/aplikacija", priority: 0.6, changefreq: "monthly" },
  { url: "/evaga-desktop", priority: 0.6, changefreq: "monthly" },
];

const generateSitemap = async () => {
  try {
    // Inicijalizuj Firebase Admin
    const serviceAccountPath = path.resolve(
      projectRoot,
      "functions/serviceAccountKey.json",
    );

    if (!fs.existsSync(serviceAccountPath)) {
      console.warn(
        "⚠️  serviceAccountKey.json nije pronađen. Generiši samo static rute.",
      );
      generateStaticSitemap();
      return;
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8"),
    );

    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    const db = getFirestore(app);

    // Učitaj proizvode iz Firestore
    const productsSnapshot = await db.collection("products").get();
    const productRoutes = productsSnapshot.docs.map((doc) => ({
      url: `/prodavnica/${doc.id}`,
      priority: 0.8,
      changefreq: "weekly",
    }));

    // Kreira sitemap XML
    const allRoutes = [...STATIC_ROUTES, ...productRoutes];
    const sitemapXml = generateSitemapXml(allRoutes);

    // Napiši sitemap.xml
    const sitemapPath = path.resolve(projectRoot, "public/sitemap.xml");
    fs.writeFileSync(sitemapPath, sitemapXml, "utf8");

    console.log(
      `✅ Sitemap je generisan sa ${allRoutes.length} ruta: ${sitemapPath}`,
    );

    // Zatvori Firebase app
    await app.delete();
  } catch (error) {
    console.error("❌ Greška pri generisanju sitemap-a:", error);
    process.exit(1);
  }
};

const generateSitemapXml = (routes) => {
  const baseUrl = "https://vagabeta.rs";
  const today = new Date().toISOString().split("T")[0];

  const urlEntries = routes
    .map(
      (route) =>
        `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

const generateStaticSitemap = () => {
  const sitemapXml = generateSitemapXml(STATIC_ROUTES);
  const sitemapPath = path.resolve(projectRoot, "public/sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemapXml, "utf8");
  console.log(`✅ Static sitemap je generisan: ${sitemapPath}`);
};

generateSitemap();
