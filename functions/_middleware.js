// functions/_middleware.js
// Cloudflare Pages SSR Middleware - Hybrid Approach
// SSR samo za marketing stranice, CSR za ostale

export const config = {
  compatibility_flags: ["nodejs_compat"],
};

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

  const isCSRRoute = CSR_ROUTES.some((route) => pathname.startsWith(route));
  if (isCSRRoute) {
    return next();
  }

  const SSR_ROUTES = ["/", "/pricing", "/evaga-desktop", "/usluge"];
  const shouldSSR =
    SSR_ROUTES.includes(pathname) ||
    pathname.startsWith("/usluge/") ||
    pathname === "/about" ||
    pathname === "/contact";

  if (!shouldSSR) {
    return next();
  }

  try {
    const { render } = await import("./ssr-render.js");

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
