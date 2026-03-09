// functions/_middleware.js
// Cloudflare Pages SSR Middleware - Hybrid Approach
// SSR samo za marketing stranice, CSR za ostale

export const config = {
  compatibility_flags: ["nodejs_compat"],
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getEnvVar(env, ...keys) {
  for (const key of keys) {
    const value = env?.[key];
    if (value) return value;
  }
  return undefined;
}

function getFirestoreString(fields, key) {
  return fields?.[key]?.stringValue || "";
}

function getFirestoreNumber(fields, key) {
  const raw = fields?.[key]?.integerValue || fields?.[key]?.doubleValue;
  if (raw === undefined || raw === null) return 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getFirestoreStringArray(fields, key) {
  const values = fields?.[key]?.arrayValue?.values || [];
  return values.map((v) => v?.stringValue).filter(Boolean);
}

function extractDocId(documentName = "") {
  const parts = documentName.split("/");
  return parts[parts.length - 1] || null;
}

function normalizeCanonicalPath(pathname = "/") {
  const normalized = String(pathname).replace(/\/+$/, "");
  return normalized || "/";
}

function getCanonicalProductPath(product = null, fallbackPath = "/") {
  const productSlug = normalizeSlug(product?.slug || product?.name || "");
  if (productSlug) {
    return `/p/${productSlug}`;
  }
  return normalizeCanonicalPath(fallbackPath);
}

function normalizeSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseFirestoreValue(value) {
  if (!value || typeof value !== "object") return null;

  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return Boolean(value.booleanValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;

  if ("arrayValue" in value) {
    const values = value.arrayValue?.values || [];
    return values.map(parseFirestoreValue);
  }

  if ("mapValue" in value) {
    const fields = value.mapValue?.fields || {};
    return Object.entries(fields).reduce((acc, [key, fieldValue]) => {
      acc[key] = parseFirestoreValue(fieldValue);
      return acc;
    }, {});
  }

  return null;
}

function parseFirestoreFields(fields = {}) {
  return Object.entries(fields).reduce((acc, [key, value]) => {
    acc[key] = parseFirestoreValue(value);
    return acc;
  }, {});
}

function toAbsoluteAssetUrl(url, origin) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function fetchProductSeoData(productId, env, origin) {
  const projectId = getEnvVar(
    env,
    "VITE_FIREBASE_PROJECT_ID",
    "FIREBASE_PROJECT_ID",
  );
  const apiKey = getEnvVar(env, "VITE_FIREBASE_API_KEY", "FIREBASE_API_KEY");

  if (!projectId || !apiKey || !productId) return null;

  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products/${encodeURIComponent(productId)}?key=${apiKey}`;

  const response = await fetch(endpoint);
  if (!response.ok) return null;

  const payload = await response.json();
  const product = {
    id: extractDocId(payload?.name) || productId,
    ...parseFirestoreFields(payload?.fields || {}),
  };
  const fields = payload?.fields || {};

  const name = product.name || getFirestoreString(fields, "name") || "Proizvod";
  const description =
    product.description ||
    getFirestoreString(fields, "description") ||
    `${name} | Vaga Beta Shop`;
  const imgUrl = product.imgUrl || getFirestoreString(fields, "imgUrl");
  const images =
    (Array.isArray(product.images)
      ? product.images.filter((image) => typeof image === "string")
      : null) || getFirestoreStringArray(fields, "images");
  const primaryImage = toAbsoluteAssetUrl(imgUrl || images[0] || "", origin);
  const price = Number(product.price) || Number(product.hiddenPrice) || 0;
  const stock = Number(product.stock) || 0;
  const category = product.category || getFirestoreString(fields, "category");

  return {
    product,
    name,
    description,
    image: primaryImage,
    price,
    stock,
    category,
  };
}

async function fetchProductSeoDataBySlug(slug, env, origin) {
  const projectId = getEnvVar(
    env,
    "VITE_FIREBASE_PROJECT_ID",
    "FIREBASE_PROJECT_ID",
  );
  const apiKey = getEnvVar(env, "VITE_FIREBASE_API_KEY", "FIREBASE_API_KEY");

  if (!projectId || !apiKey || !slug) return null;

  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=1&key=${apiKey}&mask.fieldPaths=name&mask.fieldPaths=description&mask.fieldPaths=imgUrl&mask.fieldPaths=images&mask.fieldPaths=price&mask.fieldPaths=hiddenPrice&mask.fieldPaths=stock&mask.fieldPaths=category&mask.fieldPaths=slug`;

  const wherePayload = {
    structuredQuery: {
      from: [{ collectionId: "products" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "slug" },
          op: "EQUAL",
          value: { stringValue: slug },
        },
      },
      limit: 1,
    },
  };

  const runQueryEndpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
  const response = await fetch(runQueryEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wherePayload),
  });

  if (!response.ok) return null;
  const payload = await response.json();
  const firstMatch = Array.isArray(payload)
    ? payload.find((item) => item?.document)
    : null;

  if (!firstMatch?.document) return null;

  const productId = extractDocId(firstMatch.document.name);
  if (!productId) return null;

  return fetchProductSeoData(productId, env, origin);
}

function replaceOrInsertHeadTag(template, pattern, replacement) {
  if (pattern.test(template)) {
    return template.replace(pattern, replacement);
  }
  return template.replace("</head>", `${replacement}\n</head>`);
}

function replaceOrInsertJsonLd(template, id, payload) {
  const script = `<script type="application/ld+json" id="${id}">${JSON.stringify(payload)}</script>`;
  return replaceOrInsertHeadTag(
    template,
    new RegExp(
      `<script\\s+type=["']application/ld\\+json["']\\s+id=["']${id}["'][\\s\\S]*?<\\/script>`,
      "i",
    ),
    script,
  );
}

const SITEMAP_STATIC_PAGES = [
  { url: "", priority: "1.0", changefreq: "daily" },
  { url: "/usluge", priority: "0.9", changefreq: "weekly" },
  { url: "/kontakt", priority: "0.8", changefreq: "monthly" },
  { url: "/onama", priority: "0.7", changefreq: "monthly" },
  { url: "/aplikacija", priority: "0.8", changefreq: "weekly" },
  { url: "/newsletter", priority: "0.8", changefreq: "weekly" },
  { url: "/evaga-desktop", priority: "0.8", changefreq: "weekly" },
  { url: "/prodavnica", priority: "0.9", changefreq: "daily" },
  { url: "/prodavnica/proizvodi", priority: "0.9", changefreq: "daily" },
  { url: "/privacy", priority: "0.3", changefreq: "yearly" },
];

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function fetchAllProductsForSitemap(env) {
  const projectId = getEnvVar(
    env,
    "VITE_FIREBASE_PROJECT_ID",
    "FIREBASE_PROJECT_ID",
  );
  const apiKey = getEnvVar(env, "VITE_FIREBASE_API_KEY", "FIREBASE_API_KEY");
  if (!projectId || !apiKey) return [];

  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=500&key=${apiKey}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) return [];
    const payload = await response.json();
    return payload.documents || [];
  } catch {
    return [];
  }
}

function buildSitemapXml(documents) {
  const BASE_URL = "https://vagabeta.rs";
  const today = new Date().toISOString().split("T")[0];

  const staticEntries = SITEMAP_STATIC_PAGES.map(
    (page) => `  <url>
    <loc>${escapeXml(`${BASE_URL}${page.url}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  ).join("\n");

  const productEntries = documents
    .map((doc) => {
      const fields = doc.fields || {};
      const slug = fields.slug?.stringValue;
      if (!slug) return null;

      const imgUrl = fields.imgUrl?.stringValue || "";
      const extraImages = (fields.images?.arrayValue?.values || [])
        .map((v) => v?.stringValue)
        .filter(Boolean);
      const allImages = [...new Set([imgUrl, ...extraImages].filter(Boolean))];

      const imageTags = allImages
        .map(
          (u) =>
            `    <image:image>\n      <image:loc>${escapeXml(u)}</image:loc>\n    </image:image>`,
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(`${BASE_URL}/p/${encodeURIComponent(slug)}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
${imageTags}
  </url>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticEntries}
${productEntries}
</urlset>`;
}

function normalizeHelmetFragment(fragment, kind) {
  if (!fragment) return "";

  const value = String(fragment).trim();
  if (!value) return "";

  if (value.startsWith("<")) {
    return value;
  }

  if (kind === "title") {
    return `<title>${escapeHtml(value)}</title>`;
  }

  return "";
}

const LEGACY_PATH_REDIRECTS = {
  "/about": "/onama",
  "/contact": "/kontakt",
  "/proizvodi": "/prodavnica/proizvodi",
  "/prodavnica/products": "/prodavnica/proizvodi",
  "/prodavnica/cart": "/prodavnica/korpa",
  "/prodavnica/login": "/prodavnica/prijava",
  "/prodavnica/profile": "/prodavnica/nalog",
  "/search": "/prodavnica/proizvodi",
};

const NOINDEX_PATH_PREFIXES = [
  "/prodavnica/korpa",
  "/prodavnica/placanje",
  "/prodavnica/prijava",
  "/prodavnica/nalog",
  "/prodavnica/admin",
  "/prodavnica/porudzbine",
  "/prodavnica/reset-password",
  "/prodavnica/email-verifikovan",
];

const STATIC_PAGE_META = {
  "/kontakt": {
    title: "Kontakt | Vaga Beta",
    description:
      "Kontaktirajte Vaga Beta tim za servis, overavanje i prodaju vaga. Brz odgovor i stručna podrška.",
  },
  "/onama": {
    title: "O nama | Vaga Beta",
    description:
      "Saznajte više o Vaga Beta timu, iskustvu i stručnosti u oblasti vaga, servisa i metrologije.",
  },
  "/prodavnica": {
    title: "Online prodavnica | Vaga Beta",
    description:
      "Online prodavnica opreme i softvera za vage. Pregledajte ponudu i izaberite rešenje za vaše poslovanje.",
  },
  "/newsletter": {
    title: "Newsletter | Vaga Beta",
    description:
      "Prijavite se na Vaga Beta newsletter i dobijajte korisne novosti, akcije i ponude.",
  },
};

function isNoindexPath(pathname) {
  return NOINDEX_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function nextWithIndexingHeaders(next, pathname) {
  const response = await next();
  if (!isNoindexPath(pathname)) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  let pathname = url.pathname;

  const normalizedPathname =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
  const isProtocolOrHostNonCanonical =
    url.protocol !== "https:" || url.hostname.startsWith("www.");

  if (isProtocolOrHostNonCanonical || normalizedPathname !== pathname) {
    const redirectUrl = new URL(url.toString());
    redirectUrl.protocol = "https:";
    redirectUrl.hostname = redirectUrl.hostname.replace(/^www\./, "");
    redirectUrl.pathname = normalizedPathname;
    return Response.redirect(redirectUrl.toString(), 301);
  }

  pathname = normalizedPathname;

  const legacyRedirectTarget = LEGACY_PATH_REDIRECTS[pathname];
  if (legacyRedirectTarget) {
    const redirectUrl = new URL(url.toString());
    redirectUrl.pathname = legacyRedirectTarget;
    return Response.redirect(redirectUrl.toString(), 301);
  }

  if (pathname === "/robots.txt") {
    return new Response(
      "User-agent: *\nAllow: /\nDisallow: /search\nDisallow: /cdn-cgi/\nSitemap: https://vagabeta.rs/sitemap.xml\n",
      {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      },
    );
  }

  if (pathname === "/sitemap.xml") {
    const documents = await fetchAllProductsForSitemap(env);
    const xml = buildSitemapXml(documents);
    return new Response(xml, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  }

  if (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/imgs/") ||
    pathname.startsWith("/3d/") ||
    pathname.startsWith("/videos/") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/.well-known/") ||
    pathname.match(
      /\.(js|css|png|jpg|jpeg|svg|ico|json|webp|woff|woff2|ttf|mp4|webm|xml|txt)$/i,
    )
  ) {
    return nextWithIndexingHeaders(next, pathname);
  }

  const CSR_ROUTES = [
    "/prodavnica",
    "/admin",
    "/dashboard",
    "/profil",
    "/auth",
    "/login",
    "/register",
    "/checkout",
    "/cart",
    "/orders",
    "/shop",
  ];

  const isShortProductRoute = pathname.startsWith("/p/");
  const isLegacyProductRoute = pathname.startsWith("/prodavnica/proizvod/");
  const isProductsListingRoute = pathname === "/prodavnica/proizvodi";
  const isProductDetailsRoute = isShortProductRoute || isLegacyProductRoute;
  const productRouteParam = isProductDetailsRoute
    ? decodeURIComponent(pathname.split("/").pop() || "")
    : null;
  const productSlug = isShortProductRoute
    ? normalizeSlug(productRouteParam || "")
    : null;
  const productId = isLegacyProductRoute ? productRouteParam : null;
  const canonicalPath = normalizeCanonicalPath(pathname);

  const isCSRRoute = CSR_ROUTES.some((route) => pathname.startsWith(route));
  if (isCSRRoute && !isProductDetailsRoute) {
    if (isProductsListingRoute || pathname === "/prodavnica") {
      // SSR enabled for listing route - do not early return.
    } else {
      return nextWithIndexingHeaders(next, pathname);
    }
  }

  const SSR_ROUTES = [
    "/",
    "/pricing",
    "/evaga-desktop",
    "/usluge",
    "/kontakt",
    "/onama",
    "/aplikacija",
    "/booking",
    "/newsletter",
    "/privacy",
    "/prodavnica",
    "/prodavnica/proizvodi",
  ];
  const shouldSSR =
    SSR_ROUTES.includes(pathname) ||
    pathname.startsWith("/usluge/") ||
    isProductDetailsRoute ||
    pathname === "/about" ||
    pathname === "/contact";

  if (!shouldSSR) {
    return nextWithIndexingHeaders(next, pathname);
  }

  try {
    const { render } = await import("./ssr-render.js");

    let productSeoData = null;
    let productSSRData = null;
    if (isProductDetailsRoute) {
      if (isShortProductRoute && productSlug) {
        productSeoData = await fetchProductSeoDataBySlug(
          productSlug,
          env,
          url.origin,
        );
      }

      if (!productSeoData && isLegacyProductRoute && productId) {
        productSeoData = await fetchProductSeoData(productId, env, url.origin);
      }

      productSSRData = productSeoData?.product || null;
    }

    if (isLegacyProductRoute && productSSRData) {
      const targetPath = getCanonicalProductPath(productSSRData, canonicalPath);
      const redirectUrl = `${url.origin}${targetPath}`;
      return Response.redirect(redirectUrl, 301);
    }

    if (isShortProductRoute && productSSRData) {
      const targetPath = getCanonicalProductPath(productSSRData, canonicalPath);
      if (targetPath !== canonicalPath) {
        const redirectUrl = `${url.origin}${targetPath}`;
        return Response.redirect(redirectUrl, 301);
      }
    }

    if (!render) {
      console.error("SSR render function not found");
      return nextWithIndexingHeaders(next, pathname);
    }

    const ssrProductDataKey = "__VAGA_SSR_PRODUCT__";
    const previousSSRData = globalThis[ssrProductDataKey];

    if (isProductDetailsRoute && productSSRData) {
      globalThis[ssrProductDataKey] = productSSRData;
    } else {
      delete globalThis[ssrProductDataKey];
    }

    let html;
    let helmet;
    try {
      const renderResult = await render(pathname);
      html = renderResult.html;
      helmet = renderResult.helmet;
    } finally {
      if (previousSSRData === undefined) {
        delete globalThis[ssrProductDataKey];
      } else {
        globalThis[ssrProductDataKey] = previousSSRData;
      }
    }

    const templateResponse = await env.ASSETS.fetch(
      new URL("/index.html", request.url),
    );

    if (!templateResponse.ok) {
      console.error("Failed to fetch template");
      return nextWithIndexingHeaders(next, pathname);
    }

    let template = await templateResponse.text();
    template = template.replace("<!--ssr-outlet-->", html);

    if (helmet) {
      let headContent = "";
      if (helmet.title) {
        headContent += normalizeHelmetFragment(
          helmet.title.toString(),
          "title",
        );
      }
      if (helmet.meta) {
        headContent += normalizeHelmetFragment(helmet.meta.toString(), "meta");
      }
      if (helmet.link) {
        headContent += normalizeHelmetFragment(helmet.link.toString(), "link");
      }
      template = template.replace("</head>", `${headContent}\n</head>`);
    }

    const canonicalUrl = `https://vagabeta.rs${canonicalPath}`;
    const robotsValue = isNoindexPath(pathname)
      ? "noindex, nofollow"
      : "index, follow";

    template = replaceOrInsertHeadTag(
      template,
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    );
    template = replaceOrInsertHeadTag(
      template,
      /<meta\s+name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="${escapeHtml(robotsValue)}" />`,
    );

    const staticMeta = STATIC_PAGE_META[pathname];
    if (staticMeta) {
      template = replaceOrInsertHeadTag(
        template,
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeHtml(staticMeta.title)}</title>`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+name=["']description["'][^>]*>/i,
        `<meta name="description" content="${escapeHtml(staticMeta.description)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:title["'][^>]*>/i,
        `<meta property="og:title" content="${escapeHtml(staticMeta.title)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:description["'][^>]*>/i,
        `<meta property="og:description" content="${escapeHtml(staticMeta.description)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:url["'][^>]*>/i,
        `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+name=["']twitter:title["'][^>]*>/i,
        `<meta name="twitter:title" content="${escapeHtml(staticMeta.title)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+name=["']twitter:description["'][^>]*>/i,
        `<meta name="twitter:description" content="${escapeHtml(staticMeta.description)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+name=["']twitter:url["'][^>]*>/i,
        `<meta name="twitter:url" content="${escapeHtml(canonicalUrl)}" />`,
      );
    }

    if (isProductDetailsRoute) {
      const canonicalProductPath = getCanonicalProductPath(
        productSSRData,
        canonicalPath,
      );
      const currentUrl = `${url.origin}${canonicalProductPath}`;
      const canonicalTag = `<link rel="canonical" href="${escapeHtml(currentUrl)}" />`;

      template = replaceOrInsertHeadTag(
        template,
        /<link\s+rel=["']canonical["'][^>]*>/i,
        canonicalTag,
      );

      if (productSSRData) {
        const serializedProductData = JSON.stringify(productSSRData).replaceAll(
          "<",
          "\\u003c",
        );
        const preloadScript = `<script id="product-ssr-data">window.__VAGA_SSR_PRODUCT__=${serializedProductData};</script>`;
        template = replaceOrInsertHeadTag(
          template,
          /<script\s+id=["']product-ssr-data["'][\s\S]*?<\/script>/i,
          preloadScript,
        );
      }
    }

    if (isProductDetailsRoute && productSeoData) {
      const canonicalProductPath = getCanonicalProductPath(
        productSeoData?.product,
        canonicalPath,
      );
      const currentUrl = `${url.origin}${canonicalProductPath}`;
      const pageTitle = `${productSeoData.name} | Vaga Beta`;
      const pageDescription = productSeoData.description;

      template = replaceOrInsertHeadTag(
        template,
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeHtml(pageTitle)}</title>`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+name=["']description["'][^>]*>/i,
        `<meta name="description" content="${escapeHtml(pageDescription)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:title["'][^>]*>/i,
        `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:description["'][^>]*>/i,
        `<meta property="og:description" content="${escapeHtml(pageDescription)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:url["'][^>]*>/i,
        `<meta property="og:url" content="${escapeHtml(currentUrl)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+name=["']twitter:title["'][^>]*>/i,
        `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+name=["']twitter:description["'][^>]*>/i,
        `<meta name="twitter:description" content="${escapeHtml(pageDescription)}" />`,
      );

      if (productSeoData.image) {
        template = replaceOrInsertHeadTag(
          template,
          /<meta\s+property=["']og:image["'][^>]*>/i,
          `<meta property="og:image" content="${escapeHtml(productSeoData.image)}" />`,
        );
        template = replaceOrInsertHeadTag(
          template,
          /<meta\s+name=["']twitter:image["'][^>]*>/i,
          `<meta name="twitter:image" content="${escapeHtml(productSeoData.image)}" />`,
        );
      }

      const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: productSeoData.name,
        description: productSeoData.description,
        image: productSeoData.image ? [productSeoData.image] : undefined,
        category: productSeoData.category || undefined,
        brand: {
          "@type": "Brand",
          name: "Vaga Beta",
        },
        offers: {
          "@type": "Offer",
          url: currentUrl,
          priceCurrency: "RSD",
          price: String(productSeoData.price || 0),
          availability:
            productSeoData.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      };

      if (!productSchema.image) delete productSchema.image;
      if (!productSchema.category) delete productSchema.category;

      template = replaceOrInsertJsonLd(
        template,
        "product-jsonld-ssr",
        productSchema,
      );
    }

    if (isProductsListingRoute) {
      const listingUrl = `${url.origin}/prodavnica/proizvodi`;
      const listingTitle = "Proizvodi | Vaga Beta";
      const listingDescription =
        "Pregled svih proizvoda u Vaga Beta prodavnici: industrijske, precizne i softverske vage sa detaljnim specifikacijama.";

      template = replaceOrInsertHeadTag(
        template,
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeHtml(listingTitle)}</title>`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+name=["']description["'][^>]*>/i,
        `<meta name="description" content="${escapeHtml(listingDescription)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:title["'][^>]*>/i,
        `<meta property="og:title" content="${escapeHtml(listingTitle)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:description["'][^>]*>/i,
        `<meta property="og:description" content="${escapeHtml(listingDescription)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<meta\s+property=["']og:url["'][^>]*>/i,
        `<meta property="og:url" content="${escapeHtml(listingUrl)}" />`,
      );
      template = replaceOrInsertHeadTag(
        template,
        /<link\s+rel=["']canonical["'][^>]*>/i,
        `<link rel="canonical" href="${escapeHtml(listingUrl)}" />`,
      );

      const listingSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Vaga Beta proizvodi",
        url: listingUrl,
        description: listingDescription,
      };

      template = replaceOrInsertJsonLd(
        template,
        "product-list-jsonld-ssr",
        listingSchema,
      );
    }

    return new Response(template, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "max-age=3600",
        "X-Robots-Tag": robotsValue,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  } catch (error) {
    console.error("SSR Error:", error);
    const fallbackResponse = await next();
    const newHeaders = new Headers(fallbackResponse.headers);
    newHeaders.set(
      "X-SSR-Error",
      String(error?.message || "SSR failed").slice(0, 100),
    );

    return new Response(fallbackResponse.body, {
      status: fallbackResponse.status,
      headers: newHeaders,
    });
  }
}
