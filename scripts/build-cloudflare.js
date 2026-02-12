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

console.log("🔨 Cloudflare Pages Build Script");
console.log("================================\n");

// Prikupi sve VITE_* varijable iz sistema
const viteVars = {};
let foundCount = 0;

for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("VITE_")) {
    viteVars[key] = value;
    foundCount++;
    console.log(`✓ ${key}`);
  }
}

console.log(`\n📋 Pronađeno ${foundCount} VITE_* varijable\n`);

if (foundCount === 0) {
  console.warn("⚠️  Upozorenje: Nema pronađenih VITE_* varijabli u okruženju!");
  console.warn(
    "   Proveri da li su varijable postavljene u Cloudflare Pages Dashboard",
  );
  console.warn(
    "   ili lokalno - trebale bi da budu dostupne kao plaintext varijable\n",
  );
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
