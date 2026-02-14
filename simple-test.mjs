// simple-test.mjs - Simple module load test
console.log("🔄 Loading entry-server-cloudflare module...");

try {
  const module = require("./dist/server/entry-server-cloudflare.js");
  console.log("✅ Module loaded with require");
  console.log("Export keys:", Object.keys(module));
} catch (err) {
  console.log("⚠️ require failed, trying import");

  import("./dist/server/entry-server-cloudflare.js")
    .then((module) => {
      console.log("✅ Module loaded with import");
      console.log("Export keys:", Object.keys(module));

      if (module.render) {
        console.log("🎯 render function found!");
        process.exit(0);
      } else {
        console.log("❌ render function NOT found");
        process.exit(1);
      }
    })
    .catch((importErr) => {
      console.error("❌ Failed to load module:", importErr.message);
      process.exit(1);
    });
}
