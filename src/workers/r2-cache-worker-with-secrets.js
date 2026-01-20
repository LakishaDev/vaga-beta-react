/**
 * Cloudflare Worker - R2 Cache Handler sa Secrets
 * Deploy sa: wrangler deploy
 *
 * Secrets su dostupni kao env varijable:
 * - env.API_TOKEN (optional - za API auth)
 * - env.ALLOWED_ORIGINS (optional - za CORS)
 */

/**
 * Validira API token ako je postavljen
 */
function validateAuth(request, env) {
  // Ako nema API_TOKEN secret, nema auth zahteva
  if (!env.API_TOKEN) return true;

  // Za read operacije (GET) nema zahteva za auth
  if (
    request.method === "GET" ||
    request.method === "HEAD" ||
    request.method === "OPTIONS"
  ) {
    return true;
  }

  // Za write operacije (POST, DELETE), proveri token
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  return token === env.API_TOKEN;
}

/**
 * Generiši CORS headers
 */
function getCorsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "*";

  // Ako nema ALLOWED_ORIGINS, dozvoli sve
  if (!env.ALLOWED_ORIGINS) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
  }

  // Ako je ALLOWED_ORIGINS postavljen, proveri origin
  const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  const isAllowed =
    allowedOrigins.includes(origin) || allowedOrigins.includes("*");

  if (isAllowed) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
  }

  return {
    "Access-Control-Allow-Origin": "null",
  };
}

/**
 * Obrada upload zahteva
 */
async function handleUpload(request, env) {
  // Validate auth
  if (!validateAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const namespace = formData.get("namespace") || "general";
  const cacheControl =
    formData.get("cacheControl") || "public, max-age=31536000";
  const metadata = JSON.parse(formData.get("metadata") || "{}");

  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }

  try {
    const buffer = await file.arrayBuffer();
    const key = `v1/${namespace}/${file.name}`;

    // Upload u R2
    await env.R2_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl,
      },
      customMetadata: {
        ...metadata,
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
      },
    });

    // Spremi metadata u KV za brži pristup
    if (env.CACHE_METADATA) {
      await env.CACHE_METADATA.put(
        key,
        JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          namespace,
          ...metadata,
        }),
        { expirationTtl: 86400 * 30 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        key,
        fileName: file.name,
        fileSize: file.size,
        url: `${new URL(request.url).origin}/download/${key}`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...getCorsHeaders(request, env),
        },
      },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }
}

/**
 * Obrada download zahteva sa cache headers-ima
 */
async function handleDownload(request, env, key) {
  try {
    const object = await env.R2_BUCKET.get(key);

    if (!object) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...getCorsHeaders(request, env),
        },
      });
    }

    // Kreiraj odgovor sa cache headers-ima
    const headers = new Headers({
      "Content-Type":
        object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control":
        object.httpMetadata?.cacheControl || "public, max-age=31536000",
      "Content-Length": object.size,
      ...getCorsHeaders(request, env),
    });

    // Dodaj metadata kao headers
    if (object.customMetadata) {
      headers.set("X-File-Metadata", JSON.stringify(object.customMetadata));
    }

    return new Response(object.body, { headers });
  } catch (error) {
    console.error("Download error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }
}

/**
 * Obrada delete zahteva
 */
async function handleDelete(request, env, key) {
  // Validate auth za delete
  if (!validateAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }

  try {
    await env.R2_BUCKET.delete(key);

    // Obriši metadata iz KV
    if (env.CACHE_METADATA) {
      await env.CACHE_METADATA.delete(key);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }
}

/**
 * Obrada list zahteva
 */
async function handleList(request, env) {
  try {
    const url = new URL(request.url);
    const namespace = url.searchParams.get("namespace") || "general";
    const prefix = `v1/${namespace}/`;

    const objects = await env.R2_BUCKET.list({ prefix });
    const files = objects.objects.map((obj) => ({
      key: obj.key,
      name: obj.key.replace(prefix, ""),
      size: obj.size,
      uploaded: obj.uploaded,
      etag: obj.etag,
    }));

    return new Response(JSON.stringify({ files, count: files.length }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  } catch (error) {
    console.error("List error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }
}

/**
 * CORS preflight
 */
function handleOptions(request, env) {
  return new Response(null, {
    headers: getCorsHeaders(request, env),
  });
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS
    if (request.method === "OPTIONS") {
      return handleOptions(request, env);
    }

    try {
      // Upload endpoint
      if (path === "/upload" && request.method === "POST") {
        return handleUpload(request, env);
      }

      // Download endpoint
      if (path.startsWith("/download/")) {
        const key = path.replace("/download/", "");
        return handleDownload(request, env, key);
      }

      // Delete endpoint
      if (path.startsWith("/delete/") && request.method === "DELETE") {
        const key = path.replace("/delete/", "");
        return handleDelete(request, env, key);
      }

      // List endpoint
      if (path === "/list" && request.method === "GET") {
        return handleList(request, env);
      }

      // Health check
      if (path === "/health") {
        return new Response(
          JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
          {
            headers: {
              "Content-Type": "application/json",
              ...getCorsHeaders(request, env),
            },
          },
        );
      }

      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...getCorsHeaders(request, env),
        },
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...getCorsHeaders(request, env),
        },
      });
    }
  },
};
