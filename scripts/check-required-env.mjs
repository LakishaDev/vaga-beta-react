#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const REQUIRED_GROUPS = [
  ["VITE_FIREBASE_API_KEY", "FIREBASE_API_KEY"],
  ["VITE_FIREBASE_AUTH_DOMAIN", "FIREBASE_AUTH_DOMAIN"],
  ["VITE_FIREBASE_PROJECT_ID", "FIREBASE_PROJECT_ID"],
  ["VITE_FIREBASE_STORAGE_BUCKET", "FIREBASE_STORAGE_BUCKET"],
  ["VITE_FIREBASE_MESSAGING_SENDER_ID", "FIREBASE_MESSAGING_SENDER_ID"],
  ["VITE_FIREBASE_APP_ID", "FIREBASE_APP_ID"],
];

const OPTIONAL_FILES = [
  path.join(projectRoot, ".env.local"),
  path.join(projectRoot, ".env.production"),
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!key) continue;

    env[key] = value.replace(/^['\"]|['\"]$/g, "");
  }

  return env;
}

function getMergedEnv() {
  const merged = { ...process.env };

  for (const envFile of OPTIONAL_FILES) {
    const parsed = parseEnvFile(envFile);
    Object.assign(merged, parsed);
  }

  return merged;
}

function resolveValue(envMap, candidates) {
  for (const key of candidates) {
    const value = envMap[key];
    if (typeof value === "string" && value.trim()) {
      return { key, value };
    }
  }
  return null;
}

function run() {
  const envMap = getMergedEnv();
  const missing = [];

  console.log("🔍 Checking required Firebase env variables...\n");

  for (const group of REQUIRED_GROUPS) {
    const resolved = resolveValue(envMap, group);

    if (!resolved) {
      missing.push(group);
      console.log(`❌ Missing: ${group.join(" OR ")}`);
      continue;
    }

    console.log(`✅ ${resolved.key}`);
  }

  if (missing.length > 0) {
    console.error("\n❌ Environment validation failed.");
    console.error(
      "Required variables are missing for sitemap + SEO build pipeline.",
    );
    process.exit(1);
  }

  console.log("\n✅ Environment validation passed");
}

run();
