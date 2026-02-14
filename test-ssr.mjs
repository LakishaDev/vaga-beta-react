// test-ssr.mjs - Test SSR render function
import("./dist/server/entry-server-cloudflare.js")
  .then(async (module) => {
    console.log("✅ SSR module loaded successfully");
    console.log("Available exports:", Object.keys(module));

    if (module.render) {
      console.log("🎯 Testing render function...");
      try {
        const result = await module.render("/");
        console.log("✅ Render executed successfully");
        console.log("📄 HTML length:", result.html?.length || 0, "bytes");
        console.log(
          "🏷️  Helmet tags count:",
          Object.keys(result.helmet || {}).length,
        );

        // Prikaži first 500 chars of HTML
        if (result.html) {
          console.log("\n📑 First 500 chars of rendered HTML:");
          console.log(result.html.substring(0, 500));
        }
      } catch (error) {
        console.error("❌ Error during render:", error.message);
      }
    } else {
      console.error("❌ render function not found in module");
    }
  })
  .catch((error) => {
    console.error("❌ Failed to load SSR module:", error.message);
    process.exit(1);
  });
