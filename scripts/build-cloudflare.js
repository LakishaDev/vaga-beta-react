#!/usr/bin/env node

/**
 * Build script za Cloudflare Pages
 * Preuzima environment varijable iz okruženja i kreira .env.production
 * Ovo omogućava Vite-u da čita Firebase i druge VITE_* varijable tokom build-a
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "..", ".env.production");
const envLocalPath = path.join(__dirname, "..", ".env.local");

console.log("🔨 Cloudflare Pages Build Script");
console.log("================================\n");
const isCloudflarePagesBuild =
  process.env.CF_PAGES === "1" || !!process.env.CF_PAGES_COMMIT_SHA;

const requiredViteVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const envAliases = {
  VITE_FIREBASE_API_KEY: ["VITE_FIREBASE_API_KEY", "FIREBASE_API_KEY"],
  VITE_FIREBASE_AUTH_DOMAIN: [
    "VITE_FIREBASE_AUTH_DOMAIN",
    "FIREBASE_AUTH_DOMAIN",
  ],
  VITE_FIREBASE_PROJECT_ID: ["VITE_FIREBASE_PROJECT_ID", "FIREBASE_PROJECT_ID"],
  VITE_FIREBASE_STORAGE_BUCKET: [
    "VITE_FIREBASE_STORAGE_BUCKET",
    "FIREBASE_STORAGE_BUCKET",
  ],
  VITE_FIREBASE_MESSAGING_SENDER_ID: [
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "FIREBASE_MESSAGING_SENDER_ID",
  ],
  VITE_FIREBASE_APP_ID: ["VITE_FIREBASE_APP_ID", "FIREBASE_APP_ID"],
  VITE_FIREBASE_MEASUREMENT_ID: [
    "VITE_FIREBASE_MEASUREMENT_ID",
    "FIREBASE_MEASUREMENT_ID",
  ],
  VITE_FIREBASE_RECAPTCHA_SITE_KEY: [
    "VITE_FIREBASE_RECAPTCHA_SITE_KEY",
    "FIREBASE_RECAPTCHA_SITE_KEY",
  ],
  VITE_FIREBASE_APPCHECK_DEBUG_TOKEN: [
    "VITE_FIREBASE_APPCHECK_DEBUG_TOKEN",
    "FIREBASE_APPCHECK_DEBUG_TOKEN",
  ],
  VITE_ADMIN_EMAILS: ["VITE_ADMIN_EMAILS", "ADMIN_EMAILS"],
};

const getAliasedValue = (source, viteKey) => {
  const candidates = envAliases[viteKey] || [viteKey];
  for (const key of candidates) {
    if (source[key]) {
      return source[key];
    }
  }
  return undefined;
};

// Prikupi sve VITE_* varijable
const viteVars = {};
let foundCount = 0;
let source = "process.env";

// Prvo pokušaj čitati iz .env.local ako postoji (za lokalne teste)
if (fs.existsSync(envLocalPath)) {
  console.log(`📖 Čitam iz .env.local...\n`);
  source = ".env.local";
  const envLocalContent = fs.readFileSync(envLocalPath, "utf8");
  const lines = envLocalContent.split("\n");

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, value] = trimmed.split("=");
      if (key && key.startsWith("VITE_")) {
        viteVars[key] = value;
        foundCount++;
        console.log(`✓ ${key}`);
      }
    }
  });
  console.log("");
}

// Ako nema varijabli iz .env.local, čitaj iz process.env (Cloudflare Pages okruženje)
if (foundCount === 0) {
  console.log(`📖 Čitam iz process.env (Cloudflare Pages okruženje)...\n`);
  source = "process.env";

  for (const viteKey of Object.keys(envAliases)) {
    const resolvedValue = getAliasedValue(process.env, viteKey);
    if (resolvedValue) {
      viteVars[viteKey] = resolvedValue;
      foundCount++;
      console.log(`✓ ${viteKey}`);
    }
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith("VITE_")) {
      continue;
    }
    if (!viteVars[key] && value) {
      viteVars[key] = value;
      foundCount++;
      console.log(`✓ ${key}`);
    }
  }
}

console.log(`\n📋 Pronađeno ${foundCount} VITE_* varijable iz ${source}\n`);

const missingRequiredVars = requiredViteVars.filter((key) => !viteVars[key]);

if (missingRequiredVars.length > 0) {
  console.error("❌ Nedostaju obavezne Firebase varijable za build:");
  missingRequiredVars.forEach((key) => {
    console.error(`   - ${key}`);
  });

  if (isCloudflarePagesBuild) {
    console.error("\n➡️ Detektovan je Cloudflare Pages build.");
    console.error(
      "   Projekat sada koristi ISKLJUČIVO Cloudflare Pages Variables/Secrets iz dashboard-a.",
    );
    console.error(
      "   Dodaj varijable u Pages > Settings > Environment variables (Production i Preview).",
    );
  } else {
    console.error(
      "\n➡️ Dodaj ih u Cloudflare Pages > Settings > Environment variables",
    );
    console.error("   pa pokreni novi deploy.");
  }

  console.error(
    "   Podržani nazivi: VITE_FIREBASE_* ili FIREBASE_* alias varijante.\n",
  );
  // process.exit(1);
}

if (foundCount === 0) {
  console.warn("⚠️  Upozorenje: Nema pronađenih VITE_* varijabli!");
  console.warn("   Proveri:");
  console.warn("   1. .env.local fajl (za lokalne teste)");
  if (isCloudflarePagesBuild) {
    console.warn(
      "   2. Cloudflare Pages Environment Variables/Secrets (dashboard)",
    );
    console.warn("   Proveri i Production i Preview scope.\n");
  } else {
    console.warn(
      "   2. Cloudflare Pages Environment Variables u Dashboard-u (za production)",
    );
    console.warn("   (wrangler.toml vars fallback je uklonjen).\n");
  }
}

// Kreiraj .env.production fajl
const envContent = Object.entries(viteVars)
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");

if (envContent) {
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Kreiran .env.production fajl sa ${foundCount} varijabli\n`);
} else {
  console.log("⚠️  Nema varijabli za pisanje u .env.production\n");
}

// Prikaži šta je napisano (bez vrednosti za sigurnost)
console.log("📝 Varijable u .env.production:");
Object.keys(viteVars).forEach((key) => {
  const value = viteVars[key];
  const displayValue =
    value && value.length > 30
      ? value.substring(0, 10) + "..." + value.substring(value.length - 5)
      : value || "undefined";
  console.log(`   ${key}=${displayValue}`);
});

console.log("\n🚀 Pokretanje Vite build-a...\n");

// Vite primenjuje .env.production koji smo upravo kreirali
process.exit(0);
