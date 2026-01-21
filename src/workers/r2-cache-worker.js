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
 * Obrada download zahteva sa cache headers-ima i Range podrskom
 */
async function handleDownload(request, env, key) {
  try {
    // Key može biti percent-encoded iz URL-a; dekoduj pre pristupa
    const decodedKey = decodeURIComponent(key);
    const object = await env.R2_BUCKET.get(decodedKey);

    if (!object) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contentType =
      object.httpMetadata?.contentType || "application/octet-stream";
    const cacheControl =
      object.httpMetadata?.cacheControl || "public, max-age=31536000";
    const fileSize = object.size;
    const rangeHeader = request.headers.get("range");

    // Kreiraj osnove headers
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", cacheControl);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Accept-Ranges", "bytes");

    // Dodaj metadata kao headers
    if (object.customMetadata) {
      headers.set("X-File-Metadata", JSON.stringify(object.customMetadata));
    }

    // Ako nema Range zahteva, vrati ceo fajl
    if (!rangeHeader) {
      headers.set("Content-Length", fileSize);
      return new Response(object.body, {
        status: 200,
        headers,
      });
    }

    // Parse Range header (npr. "bytes=1024-2048" ili "bytes=1024-")
    const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (!rangeMatch) {
      headers.set("Content-Length", fileSize);
      return new Response(object.body, {
        status: 200,
        headers,
      });
    }

    const rangeStart = parseInt(rangeMatch[1], 10);
    const rangeEnd = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileSize - 1;

    // Validacija Range
    if (
      isNaN(rangeStart) ||
      rangeStart < 0 ||
      rangeStart >= fileSize ||
      rangeEnd < rangeStart ||
      rangeEnd >= fileSize
    ) {
      headers.set("Content-Range", `bytes */${fileSize}`);
      return new Response(JSON.stringify({ error: "Invalid range" }), {
        status: 416,
        headers: {
          "Content-Type": "application/json",
          "Content-Range": `bytes */${fileSize}`,
        },
      });
    }

    const rangeLength = rangeEnd - rangeStart + 1;

    // Vrati delimičan odgovor (206 Partial Content)
    headers.set("Content-Length", rangeLength);
    headers.set("Content-Range", `bytes ${rangeStart}-${rangeEnd}/${fileSize}`);

    // Za Range requests, mora se getObject sa range parametrima
    const rangedObject = await env.R2_BUCKET.get(decodedKey, {
      range: {
        offset: rangeStart,
        length: rangeLength,
      },
    });

    return new Response(rangedObject.body, {
      status: 206,
      headers,
    });
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
    const namespace = url.searchParams.get("namespace");
    const customPrefix = url.searchParams.get("prefix");

    // Ako namespace nije prosleđen, default je general; ako je "all" ili "*" listamo sve
    let prefix = "";
    if (customPrefix !== null) {
      prefix = customPrefix;
    } else if (namespace === "all" || namespace === "*") {
      prefix = "";
    } else {
      const ns = namespace || "general";
      prefix = `v1/${ns}/`;
    }

    const objects = await env.R2_BUCKET.list({ prefix });
    const files = objects.objects.map((obj) => ({
      key: obj.key,
      name: obj.key.replace(prefix, ""),
      size: obj.size,
      uploaded: obj.uploaded,
      etag: obj.etag,
    }));

    return new Response(
      JSON.stringify({ files, count: files.length, prefix }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("List error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Generiši presigned URL za direktan upload na R2 (za velike fajlove)
 */
async function handlePresignedUpload(request, env) {
  try {
    const {
      filename,
      namespace = "general",
      expiresIn = 3600,
    } = await request.json();

    if (!filename) {
      return new Response(JSON.stringify({ error: "Filename is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const key = `v1/${namespace}/${filename}`;

    // R2 presigned URL - omogućava direktan upload bez prolaska kroz worker
    const uploadUrl = await env.R2_BUCKET.createMultipartUpload(key);

    return new Response(
      JSON.stringify({
        success: true,
        uploadUrl: uploadUrl.uploadId,
        key,
        expiresIn,
        message: "Use this URL for large file uploads (>100MB)",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Presigned URL error:", error);
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

      // Presigned URL endpoint (za velike fajlove)
      if (path === "/presigned-upload" && request.method === "POST") {
        return handlePresignedUpload(request, env);
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
