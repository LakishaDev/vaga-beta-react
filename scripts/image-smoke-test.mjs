#!/usr/bin/env node

const baseUrl =
  process.env.IMAGE_SMOKE_BASE_URL ||
  process.env.VITE_APP_URL ||
  "https://vagabeta.rs";
const targets = ["/imgs/vaga-logo.png", "/imgs/home/slika8.jpg"];

async function fetchWithFallback(url) {
  let response = await fetch(url, { method: "HEAD" });

  if (response.status === 405 || response.status === 501) {
    response = await fetch(url, { method: "GET" });
  }

  return response;
}

function printResult(url, response) {
  const status = response.status;
  const contentType = response.headers.get("content-type") || "-";
  const cacheControl = response.headers.get("cache-control") || "-";
  const cacheStatus = response.headers.get("cf-cache-status") || "-";
  const age = response.headers.get("age") || "-";

  console.log(`\n${status >= 200 && status < 400 ? "✅" : "❌"} ${url}`);
  console.log(`   status: ${status}`);
  console.log(`   content-type: ${contentType}`);
  console.log(`   cache-control: ${cacheControl}`);
  console.log(`   cf-cache-status: ${cacheStatus}`);
  console.log(`   age: ${age}`);
}

async function run() {
  console.log("🧪 Image smoke test");
  console.log(`Base URL: ${baseUrl}`);

  let failed = 0;

  for (const path of targets) {
    const url = `${baseUrl}${path}`;

    try {
      const response = await fetchWithFallback(url);
      printResult(url, response);

      const isOk = response.status >= 200 && response.status < 400;
      const isImage = (response.headers.get("content-type") || "").startsWith(
        "image/",
      );

      if (!isOk || !isImage) {
        failed += 1;
      }
    } catch (error) {
      failed += 1;
      console.log(`\n❌ ${url}`);
      console.log(`   error: ${error.message}`);
    }
  }

  if (failed > 0) {
    console.error(`\n❌ Image smoke failed (${failed}/${targets.length})`);
    process.exit(1);
  }

  console.log(`\n✅ Image smoke passed (${targets.length}/${targets.length})`);
}

run().catch((error) => {
  console.error("❌ Image smoke crashed:", error);
  process.exit(1);
});
