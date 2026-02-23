import process from "node:process";

const BASE_URL = (process.env.SEO_BASE_URL || "https://vagabeta.rs").replace(
  /\/+$/,
  "",
);
const TIMEOUT_MS = Number.parseInt(process.env.SEO_TIMEOUT_MS || "15000", 10);
const MAX_PRODUCTS = Number.parseInt(process.env.SEO_MAX_PRODUCTS || "5", 10);

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
  console.log(`🔎 SEO smoke test start: ${BASE_URL}`);

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

  const productUrls = sitemapUrls.filter((item) => item.includes("/p/"));

  if (productUrls.length === 0) {
    throw new Error("Sitemap has no product detail URLs");
  }

  const sampledUrls = productUrls.slice(0, Math.max(1, MAX_PRODUCTS));
  console.log(
    `📄 Sitemap URLs: ${sitemapUrls.length} | Product URLs: ${productUrls.length} | Testing: ${sampledUrls.length}`,
  );

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
