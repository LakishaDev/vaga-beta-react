import process from "node:process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = (process.env.SEO_BASE_URL || "https://vagabeta.rs").replace(
  /\/+$/,
  "",
);
const TIMEOUT_MS = Number.parseInt(process.env.SEO_TIMEOUT_MS || "15000", 10);
const MAX_PRODUCTS = Number.parseInt(process.env.SEO_MAX_PRODUCTS || "5", 10);
const MODE = (process.env.SEO_SMOKE_MODE || "live").toLowerCase();
const ALLOW_EMPTY_PRODUCTS =
  String(process.env.SEO_ALLOW_EMPTY_PRODUCTS || "false").toLowerCase() ===
  "true";

function normalizeCleanUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  const cleanPath = parsed.pathname.replace(/\/+$/, "") || "/";
  return `${parsed.origin}${cleanPath}`;
}

function parseLocsFromSitemap(xmlText) {
  const locRegex = /<loc>(.*?)<\/loc>/gim;
  const urls = [];
  let match = locRegex.exec(xmlText);

  while (match) {
    const value = match[1]?.trim();
    if (value) {
      urls.push(value);
    }
    match = locRegex.exec(xmlText);
  }

  return urls;
}

function isProductDetailUrl(url = "") {
  return url.includes("/p/") || url.includes("/prodavnica/proizvod/");
}

function extractCanonical(html) {
  const canonicalRegex =
    /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i;
  const match = html.match(canonicalRegex);
  return match?.[1] || null;
}

function hasProductJsonLd(html) {
  const productSchemaRegex =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"Product"[\s\S]*?<\/script>/i;
  return productSchemaRegex.test(html);
}

function hasCollectionPageJsonLd(html) {
  const collectionSchemaRegex =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"CollectionPage"[\s\S]*?<\/script>/i;
  return collectionSchemaRegex.test(html);
}

async function fetchText(url, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const text = await response.text();
    return { response, text };
  } catch (error) {
    throw new Error(`${label}: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function run() {
  console.log(`🔎 SEO smoke test start (${MODE}): ${BASE_URL}`);

  if (MODE === "local") {
    const sitemapPath = path.resolve(__dirname, "..", "public", "sitemap.xml");

    if (!fs.existsSync(sitemapPath)) {
      throw new Error(`Local sitemap not found at ${sitemapPath}`);
    }

    const sitemapText = fs.readFileSync(sitemapPath, "utf-8");
    const sitemapUrls = parseLocsFromSitemap(sitemapText);

    if (sitemapUrls.length === 0) {
      throw new Error("Local sitemap has no URLs");
    }

    const productUrls = sitemapUrls.filter((item) => isProductDetailUrl(item));
    if (productUrls.length === 0) {
      if (ALLOW_EMPTY_PRODUCTS) {
        console.warn(
          "⚠️ Local sitemap has no product detail URLs, continuing because SEO_ALLOW_EMPTY_PRODUCTS=true",
        );
        return;
      }
      throw new Error(
        "Local sitemap has no product detail URLs (/p/ or /prodavnica/proizvod/)",
      );
    }

    console.log(
      `✅ Local sitemap check passed | URLs: ${sitemapUrls.length} | Product URLs: ${productUrls.length}`,
    );
    return;
  }

  const robotsUrl = `${BASE_URL}/robots.txt`;
  const { response: robotsResponse, text: robotsText } = await fetchText(
    robotsUrl,
    "Robots request failed",
  );

  if (!robotsResponse.ok) {
    throw new Error(`robots.txt is not reachable (${robotsResponse.status})`);
  }

  const robotsContentType = (
    robotsResponse.headers.get("content-type") || ""
  ).toLowerCase();
  if (!robotsContentType.includes("text/plain")) {
    throw new Error(
      `robots.txt has invalid content-type (${robotsContentType || "missing"})`,
    );
  }

  if (!/User-agent:\s*\*/i.test(robotsText)) {
    throw new Error("robots.txt missing 'User-agent: *'");
  }

  if (!/Sitemap:\s*https:\/\/vagabeta\.rs\/sitemap\.xml/i.test(robotsText)) {
    throw new Error("robots.txt missing canonical sitemap directive");
  }

  const sitemapUrl = `${BASE_URL}/sitemap.xml`;
  const { response: sitemapResponse, text: sitemapText } = await fetchText(
    sitemapUrl,
    "Sitemap request failed",
  );

  if (!sitemapResponse.ok) {
    throw new Error(`Sitemap is not reachable (${sitemapResponse.status})`);
  }

  const sitemapUrls = parseLocsFromSitemap(sitemapText);
  if (sitemapUrls.length === 0) {
    throw new Error("Sitemap has no URLs");
  }

  const productUrls = sitemapUrls.filter((item) => isProductDetailUrl(item));

  if (productUrls.length === 0) {
    throw new Error(
      "Sitemap has no product detail URLs (/p/ or /prodavnica/proizvod/)",
    );
  }

  const sampledUrls = productUrls.slice(0, Math.max(1, MAX_PRODUCTS));
  console.log(
    `📄 Sitemap URLs: ${sitemapUrls.length} | Product URLs: ${productUrls.length} | Testing: ${sampledUrls.length}`,
  );

  const listingUrl = `${BASE_URL}/prodavnica/proizvodi`;
  const { response: listingResponse, text: listingHtml } = await fetchText(
    listingUrl,
    "Listing request failed",
  );

  if (listingResponse.status !== 200) {
    throw new Error(
      `Listing route is not reachable (${listingResponse.status})`,
    );
  }

  const listingCanonical = extractCanonical(listingHtml);
  const listingCanonicalOk =
    listingCanonical &&
    normalizeCleanUrl(listingCanonical) === normalizeCleanUrl(listingUrl);
  const listingSchemaOk = hasCollectionPageJsonLd(listingHtml);

  if (!listingCanonicalOk || !listingSchemaOk) {
    throw new Error(
      `Listing validation failed (canonical: ${listingCanonicalOk ? "ok" : "missing/mismatch"}, collection-jsonld: ${listingSchemaOk ? "ok" : "missing"})`,
    );
  }

  console.log(`✅ ${listingUrl}`);

  let failures = 0;

  for (const productUrl of sampledUrls) {
    const expectedCanonical = normalizeCleanUrl(productUrl);

    try {
      const { response, text } = await fetchText(
        productUrl,
        "Product request failed",
      );

      if (response.status !== 200) {
        failures += 1;
        console.error(`❌ ${productUrl} -> status ${response.status}`);
        continue;
      }

      const canonical = extractCanonical(text);
      const normalizedCanonical = canonical
        ? normalizeCleanUrl(canonical)
        : null;
      const canonicalOk = normalizedCanonical === expectedCanonical;
      const productSchemaOk = hasProductJsonLd(text);

      if (!canonicalOk || !productSchemaOk) {
        failures += 1;
        console.error(
          `❌ ${productUrl} -> canonical: ${canonicalOk ? "ok" : "missing/mismatch"}, product-jsonld: ${productSchemaOk ? "ok" : "missing"}`,
        );
      } else {
        console.log(`✅ ${productUrl}`);
      }
    } catch (error) {
      failures += 1;
      console.error(`❌ ${productUrl} -> ${error.message}`);
    }
  }

  if (failures > 0) {
    throw new Error(`SEO smoke test failed on ${failures} URL(s)`);
  }

  console.log("✅ SEO smoke test passed");
}

run().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});
