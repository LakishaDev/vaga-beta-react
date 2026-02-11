// src/utils/firebase.js
// Firebase konfiguracija i inicijalizacija
// Uključuje Firestore, Auth, Storage, Analytics, App Check
// Konfiguracija koristi environment varijable iz .env fajla
// App Check koristi reCAPTCHA v3
// Inicijalizacija je podešena za automatsko osvežavanje tokena
// Uključuje error handling i debug mod za App Check
// Eksportuje app, db, auth, storage, analytics, appCheck
// Koristi Firebase v9 modularni SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Validuj environment varijable
const validateConfig = () => {
  const required = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing Firebase env vars:", missing);
    return false;
  }

  return true;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "0",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "0:0:web:0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

let app = null;
let analytics = null;
let db = null;
let auth = null;
let storage = null;
let functions = null;
let appCheck = null;
let isInitialized = false;

const initServices = () => {
  if (isInitialized || !app) return;

  if (!validateConfig()) {
    console.warn("⚠️ Firebase config incomplete - using mock services");
    // Create mock services to prevent null errors
    db = { type: "mock-firestore" };
    auth = { type: "mock-auth" };
    storage = { type: "mock-storage" };
    functions = { type: "mock-functions" };
    analytics = { type: "mock-analytics" };
    isInitialized = true; // Mark as initialized even with mocks
    return;
  }

  try {
    analytics = getAnalytics(app);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    functions = getFunctions(app, "europe-west1");
    isInitialized = true;
    console.log("✅ Firebase services initialized");
  } catch (error) {
    console.warn("⚠️ Firebase services init error:", error.message);
    // Create mocks on error
    db = { type: "mock-firestore" };
    auth = { type: "mock-auth" };
    storage = { type: "mock-storage" };
    functions = { type: "mock-functions" };
    analytics = { type: "mock-analytics" };
    isInitialized = true;
  }
};

try {
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized");
  // Try to init services immediately, but fail gracefully
  initServices();
} catch (error) {
  console.error("❌ Firebase app error:", error.message);
}

// Retry initialization if failed
export function initializeFirebaseIfNeeded() {
  if (isInitialized && db && auth) return;
  initServices();
}

export function initializeAppCheckIfNeeded() {
  if (appCheck || !app) return appCheck;

  const siteKey = import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    console.warn("⚠️ VITE_FIREBASE_RECAPTCHA_SITE_KEY unavailable");
    return null;
  }

  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN
  ) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN =
      import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
  }

  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    console.log("✅ App Check initialized");
    return appCheck;
  } catch (error) {
    console.warn("⚠️ App Check error:", error.message);
    return null;
  }
}

// Export with safe fallbacks
export { app };
export { analytics };
export { db };
export { auth };
export { storage };
export { functions };

// Export initialization status
export const isFirebaseInitialized = () => isInitialized && auth && !auth.type;

// Export helper to check if using real Firebase or mocks
export const isUsingMockFirebase = () => auth?.type === "mock-auth";
