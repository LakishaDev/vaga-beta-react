import React, { useState, useEffect } from "react";
import * as deploymentTest from "@/utils/cloudflareDeploymentTest";

/**
 * CloudflareDeploymentDebug - Debug komponenta za Cloudflare Pages deployment
 *
 * Koristi se samo u development-u za testiranje:
 * - Firebase connectivity
 * - R2 bucket access
 * - Google Maps
 * - CSP policy
 *
 * U production-u se automatski isključuje
 */
export function CloudflareDeploymentDebug() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Samo u development-u
  const isDev = import.meta.env.DEV;

  if (!isDev) return null;

  const runTests = async () => {
    setLoading(true);
    const results = await deploymentTest.runAllTests();
    setTestResults(results);
    setLoading(false);
  };

  const exportReport = () => {
    deploymentTest.exportTestReport();
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 z-50"
        title="Otvori Cloudflare deployment debug"
      >
        🔧 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border border-gray-300 rounded shadow-lg overflow-y-auto z-50">
      <div className="sticky top-0 bg-gray-100 border-b p-3 flex justify-between items-center">
        <h3 className="font-bold text-sm">Cloudflare Deployment Debug</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700 font-bold"
        >
          ✕
        </button>
      </div>

      <div className="p-3 space-y-2">
        <button
          onClick={runTests}
          disabled={loading}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Testiranje..." : "Pokreni sve testove"}
        </button>

        {testResults && (
          <>
            <div className="text-xs space-y-1">
              <div className="font-bold mb-2">📊 Rezultati:</div>

              {testResults.results.cspPolicy && (
                <div>
                  <span
                    className={
                      testResults.results.cspPolicy.success
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {testResults.results.cspPolicy.success ? "✅" : "❌"} CSP
                    Policy
                  </span>
                  {testResults.results.cspPolicy.details?.missingDomains
                    ?.length > 0 && (
                    <div className="ml-4 text-red-500 text-xs">
                      Nedostaju:{" "}
                      {testResults.results.cspPolicy.details.missingDomains.join(
                        ", ",
                      )}
                    </div>
                  )}
                </div>
              )}

              {testResults.results.firebase && (
                <div>
                  <span
                    className={
                      testResults.results.firebase.success
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {testResults.results.firebase.success ? "✅" : "❌"}{" "}
                    Firebase
                  </span>
                </div>
              )}

              {testResults.results.r2 && (
                <div>
                  <span
                    className={
                      testResults.results.r2.success
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {testResults.results.r2.success ? "✅" : "❌"} R2 Storage
                  </span>
                </div>
              )}

              {testResults.results.googleMaps && (
                <div>
                  <span
                    className={
                      testResults.results.googleMaps.success
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {testResults.results.googleMaps.success ? "✅" : "❌"}{" "}
                    Google Maps
                  </span>
                </div>
              )}

              {testResults.results.googleAnalytics && (
                <div>
                  <span
                    className={
                      testResults.results.googleAnalytics.success
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {testResults.results.googleAnalytics.success ? "✅" : "⚠️"}{" "}
                    Google Analytics
                  </span>
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500">
                Testiran:{" "}
                {new Date(testResults.timestamp).toLocaleTimeString("sr-RS")}
              </div>
            </div>

            <button
              onClick={exportReport}
              className="w-full px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 mt-2"
            >
              📥 Preuzmi report
            </button>
          </>
        )}

        <div className="text-xs text-gray-500 border-t pt-2 mt-2">
          <p>💡 Saveti:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Otvori Network tab za CORS greške</li>
            <li>Proveri Console za CSP upozorenja</li>
            <li>Proveri Headers u Response-u</li>
            <li>Testiraj sa Firefox DevTools (bolji CORS prikaz)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook za pristup deployment test funkcijama
 */
export function useCloudflareDeploymentTest() {
  return {
    testFirebase: deploymentTest.testFirebase,
    testR2Access: deploymentTest.testR2Access,
    testGoogleMaps: deploymentTest.testGoogleMaps,
    testGoogleAnalytics: deploymentTest.testGoogleAnalytics,
    checkCSPPolicy: deploymentTest.checkCSPPolicy,
    checkHeaders: deploymentTest.checkHeaders,
    runAllTests: deploymentTest.runAllTests,
    getTestResults: deploymentTest.getTestResults,
    clearTestResults: deploymentTest.clearTestResults,
    exportTestReport: deploymentTest.exportTestReport,
  };
}

export default CloudflareDeploymentDebug;
