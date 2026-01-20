/**
 * Cloudflare Worker - R2 Cache Handler
 * Ovo je worker koji radi sa R2 bucket-om
 * Deploy sa: wrangler deploy
 */

/**
 * Obrada upload zahteva
 */
async function handleUpload(request, env) {
  const formData = await request.formData();
  const file = formData.get("file");
  const namespace = formData.get("namespace") || "general";
  const cacheControl =
    formData.get("cacheControl") || "public, max-age=31536000";
  const metadata = JSON.parse(formData.get("metadata") || "{}");

  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
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
        { expirationTtl: 86400 * 30 }, // 30 dana
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
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
      });
    }

    // Kreiraj odgovor sa cache headers-ima
    const headers = new Headers();
    headers.set(
      "Content-Type",
      object.httpMetadata?.contentType || "application/octet-stream",
    );
    headers.set(
      "Cache-Control",
      object.httpMetadata?.cacheControl || "public, max-age=31536000",
    );
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Content-Length", object.size);

    // Dodaj metadata kao headers
    if (object.customMetadata) {
      headers.set("X-File-Metadata", JSON.stringify(object.customMetadata));
    }

    return new Response(object.body, { headers });
  } catch (error) {
    console.error("Download error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Obrada delete zahteva
 */
async function handleDelete(request, env, key) {
  try {
    await env.R2_BUCKET.delete(key);

    // Obriši metadata iz KV
    if (env.CACHE_METADATA) {
      await env.CACHE_METADATA.delete(key);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("List error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * CORS preflight
 */
function handleOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
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
      return handleOptions();
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
        return new Response(JSON.stringify({ status: "ok" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
