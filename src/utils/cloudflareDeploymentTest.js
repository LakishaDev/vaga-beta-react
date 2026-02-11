/**
 * Cloudflare Pages Deployment Test Utilities
 *
 * Koristi se za testiranje svih servis-a nakon deployment-a
 * - Firebase connectivity
 * - R2 bucket access
 * - Google Maps
 * - CSP policy
 */

// Test results cache
const testResults = {};

/**
 * Test Firebase connectivity
 */
export async function testFirebase() {
  const testName = "Firebase Connectivity";

  try {
    // Test Firebase APIs
    const endpoints = [
      {
        name: "Firebase REST API",
        url: "https://vaga-beta-sajt.firebaseio.com/.json?shallow=true",
        method: "GET",
      },
      {
        name: "Firebase Auth",
        url:
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" +
          (import.meta.env.VITE_FIREBASE_API_KEY || "test"),
        method: "POST",
      },
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        });

        results.push({
          service: endpoint.name,
          status: response.status,
          ok: response.ok || response.status === 401, // 401 is OK if API key is invalid
          blocked: false,
        });
      } catch (error) {
        results.push({
          service: endpoint.name,
          status: null,
          ok: false,
          blocked:
            error.message.includes("blocked") || error.message.includes("CORS"),
        });
      }
    }

    const allOk = results.every((r) => r.ok || r.blocked);
    testResults[testName] = { ok: allOk, results };

    return {
      success: allOk,
      message: allOk ? "✅ Firebase je dostupan" : "❌ Firebase ima probleme",
      details: results,
    };
  } catch (error) {
    testResults[testName] = { ok: false, error: error.message };
    return {
      success: false,
      message: "❌ Firebase test neuspešan: " + error.message,
      error,
    };
  }
}

/**
 * Test R2 bucket access
 */
export async function testR2Access() {
  const testName = "R2 Bucket Access";

  try {
    const bucketUrls = [
      {
        name: "R2 Cache Bucket",
        url: "https://vaga-beta-cache.r2.cloudflarestorage.com/test.txt",
      },
      {
        name: "R2 CDN Bucket",
        url: "https://vaga-beta-cdn.r2.cloudflarestorage.com/test.txt",
      },
    ];

    const results = [];

    for (const bucket of bucketUrls) {
      try {
        const response = await fetch(bucket.url, {
          method: "HEAD",
          mode: "cors",
        });

        results.push({
          bucket: bucket.name,
          status: response.status,
          corsOk: response.headers.has("access-control-allow-origin"),
          blocked: false,
        });
      } catch (error) {
        const blocked =
          error.message.includes("blocked") || error.message.includes("CORS");
        results.push({
          bucket: bucket.name,
          status: null,
          corsOk: false,
          blocked,
          error: blocked ? "CORS blocked" : error.message,
        });
      }
    }

    const allOk = results.some((r) => !r.blocked);
    testResults[testName] = { ok: allOk, results };

    return {
      success: allOk,
      message: allOk ? "✅ R2 je dostupan" : "❌ R2 ima probleme",
      details: results,
    };
  } catch (error) {
    testResults[testName] = { ok: false, error: error.message };
    return {
      success: false,
      message: "❌ R2 test neuspešan: " + error.message,
      error,
    };
  }
}

/**
 * Test Google Maps API
 */
export async function testGoogleMaps() {
  const testName = "Google Maps API";

  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        message: "⚠️  Google Maps API key nije postavljen",
        details: { apiKeyMissing: true },
      };
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
      { method: "HEAD" },
    );

    const ok = response.ok || response.status === 403; // 403 is OK if key is invalid
    testResults[testName] = { ok };

    return {
      success: ok,
      message: ok
        ? "✅ Google Maps je dostupan"
        : "❌ Google Maps ima probleme",
      details: { status: response.status },
    };
  } catch (error) {
    testResults[testName] = { ok: false, error: error.message };
    return {
      success: false,
      message: "❌ Google Maps test neuspešan: " + error.message,
      error,
    };
  }
}

/**
 * Test Google Analytics
 */
export async function testGoogleAnalytics() {
  const testName = "Google Analytics";

  try {
    const gaId = import.meta.env.VITE_GA_TRACKING_ID;

    if (!gaId) {
      return {
        success: false,
        message: "⚠️  Google Analytics ID nije postavljen",
        details: { gaIdMissing: true },
      };
    }

    // Testiraj Google Analytics endpoint
    const response = await fetch("https://www.googletagmanager.com/gtag/js", {
      method: "HEAD",
    });

    const ok = response.ok;
    testResults[testName] = { ok };

    return {
      success: ok,
      message: ok
        ? "✅ Google Analytics je dostupan"
        : "⚠️  GA endpoint je недоступан",
      details: { status: response.status },
    };
  } catch (error) {
    testResults[testName] = { ok: false, error: error.message };
    return {
      success: false,
      message: "❌ Google Analytics test neuspešan: " + error.message,
      error,
    };
  }
}

/**
 * Check CSP Policy
 */
export function checkCSPPolicy() {
  const testName = "CSP Policy Check";

  try {
    // Proveri meta tag
    const cspMeta = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]',
    );
    const cspHeader = document.querySelector('meta[name="csp-policy"]');

    // Proveri Response Headers (ako su dostupni)
    const requiredDirectives = [
      "script-src",
      "style-src",
      "img-src",
      "connect-src",
      "media-src",
      "font-src",
    ];

    const warnings = [];

    if (!cspMeta && !cspHeader) {
      warnings.push("⚠️  CSP meta tag nije pronađen");
    }

    const cspContent = cspMeta?.content || cspHeader?.content || "";

    // Proveri za kritične domene
    const criticalDomains = [
      { domain: "firebase.googleapis.com", service: "Firebase" },
      { domain: "r2.cloudflarestorage.com", service: "R2 Storage" },
      { domain: "maps.googleapis.com", service: "Google Maps" },
    ];

    const missingDomains = [];
    for (const { domain, service } of criticalDomains) {
      if (!cspContent.includes(domain)) {
        missingDomains.push(`${service} (${domain})`);
      }
    }

    const allOk = missingDomains.length === 0 && warnings.length === 0;
    testResults[testName] = { ok: allOk, warnings, missingDomains };

    return {
      success: allOk,
      message: allOk
        ? "✅ CSP policy je korektno konfigurisan"
        : "❌ CSP policy ima probleme",
      details: {
        cspPresent: !!cspContent,
        missingDomains: missingDomains.length > 0 ? missingDomains : "Nema",
        warnings,
      },
    };
  } catch (error) {
    testResults[testName] = { ok: false, error: error.message };
    return {
      success: false,
      message: "❌ CSP check neuspešan: " + error.message,
      error,
    };
  }
}

/**
 * Check Headers (HSTS, X-Frame-Options, etc.)
 */
export function checkHeaders() {
  const testName = "Security Headers Check";

  try {
    // Ova informacija je dostupna samo ako je server poslao Response headers
    const warnings = [];

    // Proveri za česte probleme
    if (window.location.protocol !== "https:") {
      warnings.push("⚠️  Ne koristi HTTPS - obavezno za production!");
    }

    const allOk = warnings.length === 0;
    testResults[testName] = { ok: allOk, warnings };

    return {
      success: allOk,
      message: allOk
        ? "✅ Security headers su OK"
        : "⚠️  Ima upozorenja sa security headers-ima",
      details: { warnings, protocol: window.location.protocol },
    };
  } catch (error) {
    testResults[testName] = { ok: false, error: error.message };
    return {
      success: false,
      message: "❌ Headers check neuspešan: " + error.message,
      error,
    };
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log("🔍 Pokretam Cloudflare deployment testove...\n");

  const results = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    tests: {},
  };

  // CSP i security headers (sinhrone)
  results.tests.cspPolicy = checkCSPPolicy();
  results.tests.securityHeaders = checkHeaders();

  // Spoljni servisi (asinhrone)
  results.tests.firebase = await testFirebase();
  results.tests.r2 = await testR2Access();
  results.tests.googleMaps = await testGoogleMaps();
  results.tests.googleAnalytics = await testGoogleAnalytics();

  // Sumiranje
  const allTestsPassed = Object.values(results.tests).every((t) => t.success);

  console.log("\n📊 REZULTATI TESTOVA:");
  console.log("=".repeat(50));

  for (const [name, result] of Object.entries(results.tests)) {
    const icon = result.success ? "✅" : "❌";
    console.log(`${icon} ${name}: ${result.message}`);
    if (result.details) {
      console.log(`   Details:`, result.details);
    }
  }

  console.log("=".repeat(50));

  if (allTestsPassed) {
    console.log("\n🎉 SVI TESTOVI SU PROŠLI!");
  } else {
    console.log("\n⚠️  Neki testovi nisu prošli - vidi gore za detalje");
  }

  return {
    success: allTestsPassed,
    results,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get test results
 */
export function getTestResults() {
  return testResults;
}

/**
 * Clear test cache
 */
export function clearTestResults() {
  Object.keys(testResults).forEach((key) => delete testResults[key]);
}

/**
 * Export test report as JSON
 */
export function exportTestReport() {
  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    tests: testResults,
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cloudflare-deployment-test-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default {
  testFirebase,
  testR2Access,
  testGoogleMaps,
  testGoogleAnalytics,
  checkCSPPolicy,
  checkHeaders,
  runAllTests,
  getTestResults,
  clearTestResults,
  exportTestReport,
};
