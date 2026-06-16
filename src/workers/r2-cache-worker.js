/**
 * Cloudflare Worker - R2 Cache Handler
 * Ovo je worker koji radi sa R2 bucket-om
 * Deploy sa: wrangler deploy
 */

function sanitizeFilename(filename = "") {
  return String(filename)
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\.\.(\/|\\)/g, "")
    .trim();
}

// Namespace ulazi sirov u R2 ključ (`v1/<namespace>/...`); ukloni svaki
// path-traversal pre upotrebe da se ne mogu kreirati ključevi van v1/.
function sanitizeNamespace(namespace = "general") {
  const cleaned = String(namespace)
    .replace(/\\/g, "/")
    .replace(/\.\./g, "")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .trim();
  return cleaned || "general";
}

function getBucketForNamespace(env, namespace = "general") {
  if (namespace === "product-images" && env.R2_CDN) {
    return env.R2_CDN;
  }
  return env.R2_BUCKET;
}

function getBucketForKey(env, key = "") {
  if (String(key).startsWith("v1/product-images/") && env.R2_CDN) {
    return env.R2_CDN;
  }
  return env.R2_BUCKET;
}

function base64urlToBytes(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function verifyFirebaseJWT(token, env) {
  try {
    const projectId = env.FIREBASE_PROJECT_ID;
    if (!projectId) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const header = JSON.parse(
      atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")),
    );
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    if (payload.aud !== projectId) return null;
    if (payload.iss !== `https://securetoken.google.com/${projectId}`)
      return null;
    if (!payload.sub) return null;

    const jwksResp = await fetch(
      "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
      { cf: { cacheTtl: 3600, cacheEverything: true } },
    );
    if (!jwksResp.ok) return null;
    const { keys } = await jwksResp.json();

    const jwk = keys?.find((k) => k.kid === header.kid);
    if (!jwk) return null;

    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const sigInput = `${parts[0]}.${parts[1]}`;
    const sigBytes = base64urlToBytes(parts[2]);
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      sigBytes,
      new TextEncoder().encode(sigInput),
    );

    return valid ? payload.email || payload.sub : null;
  } catch {
    return null;
  }
}

// Vraća dekodovani payload ({ version, app, expiresAt, sig }) ako je token
// validan, inače null. Poziva ga download ruta da veže `app` za putanju.
async function verifyFeedToken(token, env) {
  if (!env.FEED_TOKEN_SECRET || !token) return null;
  try {
    const decoded = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(token.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))
      )
    );
    const { version, app, expiresAt, sig } = decoded;
    if (!version || !app || !expiresAt || !sig) return null;
    if (Math.floor(Date.now() / 1000) > expiresAt) return null;

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(env.FEED_TOKEN_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const payload = `${version}:${app}:${expiresAt}`;
    const sigBytes = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(payload));
    const expectedSig = Array.from(new Uint8Array(sigBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedSig === sig ? decoded : null;
  } catch {
    return null;
  }
}

async function validateAuth(request, env) {
  if (
    request.method === "GET" ||
    request.method === "HEAD" ||
    request.method === "OPTIONS"
  ) {
    return true;
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);

  // 1. Statični API token (za skripte/wrangler)
  if (env.API_TOKEN && token === env.API_TOKEN) return true;

  // 2. Firebase ID token (za prijavljene admin korisnike)
  const identity = await verifyFirebaseJWT(token, env);
  if (!identity) return false;

  if (env.ADMIN_EMAILS) {
    const admins = env.ADMIN_EMAILS.split(",").map((e) => e.trim());
    return admins.includes(identity);
  }

  return true;
}

function getCorsHeaders(request, env) {
  const requestOrigin = request.headers.get("Origin");
  const configuredOrigin = env.CORS_ORIGIN;

  if (!configuredOrigin) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
  }

  const allowOrigin =
    requestOrigin === configuredOrigin ? requestOrigin : "null";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Obrada upload zahteva
 */
async function handleUpload(request, env) {
  if (!(await validateAuth(request, env))) {
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
  const namespace = sanitizeNamespace(formData.get("namespace") || "general");
  const customFilename = sanitizeFilename(formData.get("filename") || "");
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
    const filename = customFilename || sanitizeFilename(file.name);
    const key = `v1/${namespace}/${filename}`;
    const bucket = getBucketForNamespace(env, namespace);

    // Upload u R2
    await bucket.put(key, buffer, {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
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
          storageName: filename,
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
        fileName: filename,
        fileSize: file.size,
        url: `${new URL(request.url).origin}/download/${key}`,
        imageUrl:
          namespace === "product-images"
            ? `${new URL(request.url).origin}/images/${encodeURIComponent((filename.split("/")[0] || "").trim())}/${encodeURIComponent((filename.split("/").slice(1).join("/") || "").trim())}`
            : null,
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
 * Obrada batch upload zahteva
 */
async function handleUploadBatch(request, env) {
  if (!(await validateAuth(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }

  const formData = await request.formData();
  const namespace = sanitizeNamespace(formData.get("namespace") || "general");
  const slug = sanitizeFilename(formData.get("slug") || "");
  const cacheControl =
    formData.get("cacheControl") || "public, max-age=31536000, immutable";

  const files = formData.getAll("files");
  const filenames = formData
    .getAll("filenames")
    .map((name) => sanitizeFilename(name));

  if (!files.length) {
    return new Response(JSON.stringify({ error: "No files provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const bucket = getBucketForNamespace(env, namespace);
  const baseUrl = new URL(request.url).origin;
  const uploads = [];

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (!file) continue;

    const fallbackName = sanitizeFilename(file.name || `file-${i + 1}.bin`);
    const selectedName = filenames[i] || fallbackName;
    const filename = slug
      ? sanitizeFilename(`${slug}/${selectedName}`)
      : selectedName;
    const key = `v1/${namespace}/${filename}`;

    const buffer = await file.arrayBuffer();
    await bucket.put(key, buffer, {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
        cacheControl,
      },
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
      },
    });

    const pathSegments = filename.split("/");
    const imageSlug = pathSegments[0] || "";
    const imageName = pathSegments.slice(1).join("/");

    uploads.push({
      key,
      fileName: filename,
      url: `${baseUrl}/download/${key}`,
      imageUrl:
        namespace === "product-images" && imageSlug && imageName
          ? `${baseUrl}/images/${encodeURIComponent(imageSlug)}/${encodeURIComponent(imageName)}`
          : null,
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      count: uploads.length,
      files: uploads,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

/**
 * Obrada download zahteva sa cache headers-ima i Range podrskom
 */
async function handleDownload(request, env, key) {
  try {
    // Key može biti percent-encoded iz URL-a; dekoduj pre pristupa
    const decodedKey = decodeURIComponent(key);
    const bucket = getBucketForKey(env, decodedKey);
    const object = await bucket.get(decodedKey);

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
    const rangedObject = await bucket.get(decodedKey, {
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
 * Clean image route: /images/{slug}/{filename}
 */
async function handleImageDownload(request, env, slug, filename) {
  const decodedSlug = sanitizeFilename(decodeURIComponent(slug || ""));
  const decodedFilename = sanitizeFilename(decodeURIComponent(filename || ""));

  if (!decodedSlug || !decodedFilename) {
    return new Response(JSON.stringify({ error: "Invalid image path" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const bucket = env.R2_CDN || env.R2_BUCKET;

  // Pokušaj subfolder format prvo, pa flat kao fallback
  const keySubfolder = `v1/product-images/${decodedSlug}/${decodedFilename}`;
  const keyFlat = `v1/product-images/${decodedFilename}`;

  let object = await bucket.get(keySubfolder);
  if (!object) {
    object = await bucket.get(keyFlat);
  }

  if (!object) {
    return new Response(JSON.stringify({ error: "Image not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(object.body, {
    status: 200,
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    },
  });
}

/**
 * Obrada delete zahteva
 */
async function handleDelete(request, env, key) {
  if (!(await validateAuth(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }

  try {
    const bucket = getBucketForKey(env, key);
    await bucket.delete(key);

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

    const namespacePrefix = prefix.split("/")[1] || "general";
    const bucket = getBucketForNamespace(env, namespacePrefix);
    const objects = await bucket.list({ prefix });
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
  if (!(await validateAuth(request, env))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request, env),
      },
    });
  }

  try {
    const body = await request.json();
    const filename = sanitizeFilename(body.filename || "");
    const namespace = sanitizeNamespace(body.namespace || "general");
    const expiresIn = body.expiresIn ?? 3600;

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
function handleOptions(request, env) {
  return new Response(null, {
    headers: getCorsHeaders(request, env),
  });
}

function addCorsHeaders(response, request, env) {
  const corsHeaders = getCorsHeaders(request, env);
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    newHeaders.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * Main request handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return handleOptions(request, env);
    }

    let response;
    try {
      // Upload endpoint
      if (path === "/upload" && request.method === "POST") {
        response = await handleUpload(request, env);
      }

      // Batch upload endpoint
      else if (path === "/upload-batch" && request.method === "POST") {
        response = await handleUploadBatch(request, env);
      }

      // Clean image endpoint
      else if (path.startsWith("/images/") && request.method === "GET") {
        const parts = path.replace("/images/", "").split("/");
        const slug = parts.shift();
        const filename = parts.join("/");
        response = await handleImageDownload(request, env, slug, filename);
      }

      // Download endpoint — feed artefakti su pod software-updates/<app>/<channel>/...
      // i traže važeći feedToken čiji `app` mora da odgovara putanji.
      else if (path.startsWith("/download/")) {
        const key = path.replace("/download/", "");
        if (key.startsWith("software-updates/")) {
          const feedToken =
            url.searchParams.get("feedToken") ||
            request.headers.get("X-Feed-Token");
          const decoded = await verifyFeedToken(feedToken, env);
          if (!decoded) {
            response = new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          } else if (decoded.app !== key.split("/")[1]) {
            // Token za "server" ne sme da povuče "client" artefakte i obrnuto
            response = new Response(JSON.stringify({ error: "Forbidden" }), {
              status: 403,
              headers: { "Content-Type": "application/json" },
            });
          } else {
            response = await handleDownload(request, env, key);
          }
        } else {
          response = await handleDownload(request, env, key);
        }
      }

      // Delete endpoint
      else if (path.startsWith("/delete/") && request.method === "DELETE") {
        const key = path.replace("/delete/", "");
        response = await handleDelete(request, env, key);
      }

      // List endpoint
      else if (path === "/list" && request.method === "GET") {
        response = await handleList(request, env);
      }

      // Presigned URL endpoint (za velike fajlove)
      else if (path === "/presigned-upload" && request.method === "POST") {
        response = await handlePresignedUpload(request, env);
      }

      // Health check
      else if (path === "/health") {
        response = new Response(JSON.stringify({ status: "ok" }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      console.error("Worker error:", error);
      response = new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return addCorsHeaders(response, request, env);
  },
};
