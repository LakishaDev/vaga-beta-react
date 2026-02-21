const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const SUCCESS_MESSAGE = "Hvala! Proverite email za potvrdu prijave.";
const GENERIC_ERROR_MESSAGE = "Server error";

const rateLimitStore = globalThis.__newsletterRateLimitStore || new Map();
globalThis.__newsletterRateLimitStore = rateLimitStore;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function getClientIp(request) {
  const cfIp = request.headers.get("CF-Connecting-IP");
  if (cfIp) return cfIp;

  const forwardedFor = request.headers.get("X-Forwarded-For");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return "unknown";
}

function normalizeBody(raw) {
  return {
    email: String(raw?.email || "")
      .trim()
      .toLowerCase(),
    consent: raw?.consent === true,
    source: String(raw?.source || "")
      .trim()
      .slice(0, 120),
    honeypot: String(raw?.honeypot || "").trim(),
  };
}

async function sha256Hex(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function shouldBlockRateLimit(ipHash, now) {
  const existing = rateLimitStore.get(ipHash) || [];
  const fresh = existing.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (fresh.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ipHash, fresh);
    return true;
  }

  fresh.push(now);
  rateLimitStore.set(ipHash, fresh);
  return false;
}

async function logEvent({ ipHash, emailHash, outcome }) {
  const entry = {
    timestamp: new Date().toISOString(),
    ipHash,
    emailHash,
    outcome,
  };

  console.log("newsletter_subscribe", JSON.stringify(entry));
}

async function callBrevo({ env, email, source }) {
  const apiKey = env.BREVO_API_KEY;
  const listIdRaw = env.BREVO_LIST_ID;
  const listId = Number(listIdRaw);

  if (!apiKey || !listIdRaw || !Number.isInteger(listId)) {
    return {
      ok: false,
      status: 500,
      message: GENERIC_ERROR_MESSAGE,
      outcome: "error_config",
    };
  }

  const payload = {
    email,
    listIds: [listId],
    updateEnabled: true,
    attributes: {
      SOURCE: source || "unknown",
    },
  };

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return {
      ok: true,
      status: 200,
      message: SUCCESS_MESSAGE,
      outcome: "ok",
    };
  }

  const errorPayload = await response.json().catch(() => ({}));
  const errorMessage = String(errorPayload?.message || "");
  const errorCode = String(errorPayload?.code || "").toLowerCase();
  const normalizedMessage = errorMessage.toLowerCase();

  const isAlreadySubscribed =
    response.status === 409 ||
    errorCode.includes("duplicate") ||
    normalizedMessage.includes("already") ||
    normalizedMessage.includes("exist");

  if (isAlreadySubscribed) {
    return {
      ok: false,
      status: 409,
      message: "Already subscribed",
      outcome: "duplicate",
    };
  }

  if (response.status >= 400 && response.status < 500) {
    return {
      ok: false,
      status: 400,
      message: "Invalid email",
      outcome: "invalid_provider",
    };
  }

  return {
    ok: false,
    status: 500,
    message: GENERIC_ERROR_MESSAGE,
    outcome: "error_provider",
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let rawBody = null;
  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body" }, 400);
  }

  const body = normalizeBody(rawBody);
  const ip = getClientIp(request);
  const hashSalt = env.LOG_HASH_SALT || "newsletter_hash_salt";

  const ipHash = await sha256Hex(`${ip}:${hashSalt}`);
  const emailHash = await sha256Hex(`${body.email}:${hashSalt}`);

  if (shouldBlockRateLimit(ipHash, Date.now())) {
    await logEvent({ ipHash, emailHash, outcome: "blocked" });
    return jsonResponse({ ok: false, message: "Too many requests" }, 429);
  }

  if (!body.email || !isValidEmail(body.email)) {
    await logEvent({ ipHash, emailHash, outcome: "invalid_email" });
    return jsonResponse({ ok: false, message: "Invalid email" }, 400);
  }

  if (!body.consent) {
    await logEvent({ ipHash, emailHash, outcome: "missing_consent" });
    return jsonResponse({ ok: false, message: "Consent required" }, 400);
  }

  if (body.honeypot) {
    await logEvent({ ipHash, emailHash, outcome: "honeypot" });
    return jsonResponse({ ok: true, message: SUCCESS_MESSAGE }, 200);
  }

  try {
    const brevoResult = await callBrevo({
      env,
      email: body.email,
      source: body.source,
    });

    await logEvent({ ipHash, emailHash, outcome: brevoResult.outcome });

    return jsonResponse(
      { ok: brevoResult.ok, message: brevoResult.message },
      brevoResult.status,
    );
  } catch {
    await logEvent({ ipHash, emailHash, outcome: "error_unhandled" });
    return jsonResponse({ ok: false, message: GENERIC_ERROR_MESSAGE }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
    },
  });
}
