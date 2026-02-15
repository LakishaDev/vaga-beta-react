// scripts/copy-server-build.js
// Kopira server build u functions folder za Cloudflare Pages deployment

import { copyFileSync, existsSync, mkdirSync, cpSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);

const sourceFile = `${projectRoot}/dist/.server/entry-server-cloudflare.js`;
const destFile = `${projectRoot}/functions/ssr-render.js`;
const sourceAssets = `${projectRoot}/dist/.server/assets`;
const destAssets = `${projectRoot}/functions/assets`;

// Proveri da li source postoji
if (!existsSync(sourceFile)) {
  console.error(`❌ Source file not found: ${sourceFile}`);
  console.error("   Run: npm run build:server first");
  process.exit(1);
}

// Kreiraj functions folder ako ne postoji
const functionsDir = dirname(destFile);
if (!existsSync(functionsDir)) {
  mkdirSync(functionsDir, { recursive: true });
}

// Kopiraj fajl
try {
  copyFileSync(sourceFile, destFile);
  console.log(`✅ Copied server build to functions/ssr-render.js`);
} catch (error) {
  console.error(`❌ Failed to copy file: ${error.message}`);
  process.exit(1);
}

// Kopiraj assets folder ako postoji
if (existsSync(sourceAssets)) {
  try {
    cpSync(sourceAssets, destAssets, { recursive: true });
    console.log(`✅ Copied server assets to functions/assets/`);
  } catch (error) {
    console.error(`❌ Failed to copy assets: ${error.message}`);
    process.exit(1);
  }
}
