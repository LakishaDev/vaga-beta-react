// functions/_middleware.js
// Privremeno: potpuno isključen SSR middleware (CSR-only deploy)

export const config = {
  compatibility_flags: ["nodejs_compat"],
};

export async function onRequest(context) {
  const response = await context.next();

  if (response.status !== 404) {
    return response;
  }

  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const acceptHeader = context.request.headers.get("accept") || "";
  const isHtmlRequest = acceptHeader.includes("text/html");
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);

  if (!isHtmlRequest || hasFileExtension) {
    return response;
  }

  const indexResponse = await context.env.ASSETS.fetch(
    new Request(new URL("/index.html", context.request.url), context.request),
  );

  if (!indexResponse.ok) {
    return response;
  }

  return new Response(indexResponse.body, {
    status: 200,
    headers: indexResponse.headers,
  });
}
