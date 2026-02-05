/**
 * Security Headers Configuration
 * Koristi se sa netlify.toml, vercel.json, ili kao middleware
 * Ovi headeri štite aplikaciju od različitih napada
 */

export const securityHeaders = {
  // Content Security Policy - Sprečava XSS napade
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.firebase.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://www.google-analytics.com",
    "frame-src 'self' https://www.youtube.com https://www.facebook.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),

  // Sprečava clickjacking napade
  "X-Frame-Options": "DENY",

  // Sprečava MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // XSS Protection za starije browsere
  "X-XSS-Protection": "1; mode=block",

  // Referrer Policy - kontroliše koliko info se šalje u referrer headeru
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions Policy - kontroliše koje browser features su dozvoljene
  "Permissions-Policy": [
    "camera=()",
    "microphone=()",
    "geolocation=(self)",
    "interest-cohort=()",
  ].join(", "),

  // Strict Transport Security - forsira HTTPS
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

  // Očekivani tip sadržaja
  "X-Permitted-Cross-Domain-Policies": "none",
};

/**
 * Netlify konfiguracija (_headers file)
 */
export const netlifyHeaders = `
/*
  ${Object.entries(securityHeaders)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n  ")}
`;

/**
 * Vercel konfiguracija (vercel.json)
 */
export const vercelConfig = {
  headers: [
    {
      source: "/(.*)",
      headers: Object.entries(securityHeaders).map(([key, value]) => ({
        key,
        value,
      })),
    },
  ],
};

/**
 * Firebase Hosting konfiguracija (firebase.json)
 */
export const firebaseHeaders = [
  {
    source: "**",
    headers: Object.entries(securityHeaders).map(([key, value]) => ({
      key,
      value,
    })),
  },
];

/**
 * Cloudflare Workers / Pages konfiguracija
 */
export function addSecurityHeaders(response) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export default securityHeaders;
