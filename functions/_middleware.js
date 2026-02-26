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

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === "/robots.txt") {
    return new Response(
      "User-agent: *\nAllow: /\nSitemap: https://vagabeta.rs/sitemap.xml\n",
      {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=3600",
        },
      },
    );
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
    return next();
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
    if (isProductsListingRoute) {
      // SSR enabled for listing route - do not early return.
    } else {
      return next();
    }
  }

  const SSR_ROUTES = [
    "/pricing",
    "/evaga-desktop",
    "/usluge",
    "/prodavnica/proizvodi",
  ];
  const shouldSSR =
    SSR_ROUTES.includes(pathname) ||
    pathname.startsWith("/usluge/") ||
    isProductDetailsRoute ||
    pathname === "/about" ||
    pathname === "/contact";

  if (!shouldSSR) {
    return next();
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
      return next();
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
      return next();
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
