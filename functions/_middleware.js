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
  const fields = payload?.fields || {};

  const name = getFirestoreString(fields, "name") || "Proizvod";
  const description =
    getFirestoreString(fields, "description") || `${name} | Vaga Beta Shop`;
  const imgUrl = getFirestoreString(fields, "imgUrl");
  const images = getFirestoreStringArray(fields, "images");
  const primaryImage = toAbsoluteAssetUrl(imgUrl || images[0] || "", origin);
  const price =
    getFirestoreNumber(fields, "price") ||
    getFirestoreNumber(fields, "hiddenPrice") ||
    0;
  const stock = getFirestoreNumber(fields, "stock");
  const category = getFirestoreString(fields, "category");

  return {
    name,
    description,
    image: primaryImage,
    price,
    stock,
    category,
  };
}

function replaceOrInsertHeadTag(template, pattern, replacement) {
  if (pattern.test(template)) {
    return template.replace(pattern, replacement);
  }
  return template.replace("</head>", `${replacement}\n</head>`);
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

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

  const isProductDetailsRoute = pathname.startsWith("/prodavnica/proizvod/");
  const productId = isProductDetailsRoute
    ? decodeURIComponent(pathname.split("/").pop() || "")
    : null;

  const isCSRRoute = CSR_ROUTES.some((route) => pathname.startsWith(route));
  if (isCSRRoute && !isProductDetailsRoute) {
    return next();
  }

  const SSR_ROUTES = ["/", "/pricing", "/evaga-desktop", "/usluge"];
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
    if (isProductDetailsRoute && productId) {
      productSeoData = await fetchProductSeoData(productId, env, url.origin);
    }

    if (!render) {
      console.error("SSR render function not found");
      return next();
    }

    const { html, helmet } = await render(pathname);
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
      if (helmet.title) headContent += helmet.title.toString();
      if (helmet.meta) headContent += helmet.meta.toString();
      if (helmet.link) headContent += helmet.link.toString();
      template = template.replace("</head>", `${headContent}\n</head>`);
    }

    if (isProductDetailsRoute && productSeoData) {
      const currentUrl = `${url.origin}${pathname}`;
      const pageTitle = `${productSeoData.name} | Vaga Beta Shop`;
      const pageDescription = productSeoData.description;
      const canonicalTag = `<link rel="canonical" href="${escapeHtml(currentUrl)}" />`;

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
      template = replaceOrInsertHeadTag(
        template,
        /<link\s+rel=["']canonical["'][^>]*>/i,
        canonicalTag,
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

      template = template.replace(
        "</head>",
        `<script type="application/ld+json" id="product-jsonld-ssr">${JSON.stringify(productSchema)}</script>\n</head>`,
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
