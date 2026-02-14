// functions/_middleware.js
// Cloudflare Pages SSR Middleware - Hybrid Approach
// SSR samo za marketing stranice, CSR za ostale
//
export const config = {
  compatibility_flags: ["nodejs_compat"],
};

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ====================
  // SKIP SSR ZA ASSETS
  // ====================
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

  // ====================
  // SKIP SSR ZA ADMIN & AUTHENTICATED (CSR only)
  // ====================
  const CSR_ROUTES = [
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

  const isCSRRoute = CSR_ROUTES.some((route) => pathname.startsWith(route));
  if (isCSRRoute) {
    return next();
  }

  // ====================
  // HYBRID SSR ZA MARKETING STRANICE
  // ====================
  const SSR_ROUTES = ["/", "/pricing", "/evaga-desktop", "/usluge"];

  // Proveri da li je stranica u SSR_ROUTES ili počinje sa /usluge/
  const shouldSSR =
    SSR_ROUTES.includes(pathname) ||
    pathname.startsWith("/usluge/") ||
    pathname === "/about" ||
    pathname === "/contact";

  if (!shouldSSR) {
    return next(); // CSR fallback
  }

  try {
    // Dinamički import SSR render funkcije
    const { render } =
      await import("../dist/server/entry-server-cloudflare.js");

    if (!render) {
      console.error("SSR render function not found");
      return next();
    }

    // Renderuj React app server-side
    const { html, helmet } = await render(pathname);

    // Fetch HTML template iz assets
    const templateResponse = await env.ASSETS.fetch(
      new URL("/index.html", request.url),
    );

    if (!templateResponse.ok) {
      console.error("Failed to fetch template");
      return next();
    }

    let template = await templateResponse.text();

    // ===== INJECT SSR HTML =====
    template = template.replace("<!--ssr-outlet-->", html);

    // ===== INJECT HELMET META TAGS =====
    if (helmet) {
      let headContent = "";

      // Title
      if (helmet.title) {
        headContent += helmet.title.toString();
      }

      // Meta tags
      if (helmet.meta) {
        headContent += helmet.meta.toString();
      }

      // Link tags
      if (helmet.link) {
        headContent += helmet.link.toString();
      }

      template = template.replace("</head>", `${headContent}\n</head>`);
    }

    // Vrati HTML sa edge caching
    return new Response(template, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        // Edge cache za 1 sat, revalidate-uj u pozadini
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "max-age=3600",
        // Security headers
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  } catch (error) {
    console.error("SSR Error:", error);

    // Fallback na CSR u slučaju greške
    const fallbackResponse = await next();

    // Dodaj header da označiš da je SSR failovao
    const newHeaders = new Headers(fallbackResponse.headers);
    newHeaders.set("X-SSR-Error", error.message.substring(0, 100));

    return new Response(fallbackResponse.body, {
      status: fallbackResponse.status,
      headers: newHeaders,
    });
  }
}
