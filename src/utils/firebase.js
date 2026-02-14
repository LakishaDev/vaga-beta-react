// src/utils/firebase.js
// Firebase konfiguracija i inicijalizacija
// Uključuje Firestore, Auth, Storage, Analytics, App Check
// Konfiguracija koristi environment varijable
// App Check koristi reCAPTCHA v3
// Eksportuje app, db, auth, storage, analytics, appCheck, functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Helper da čita varijable sa fallback na process.env tokom build-a
const getEnvVar = (key) => {
  // Prvo pokušaj import.meta.env (Vite production)
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  // Fallback na process.env (Cloudflare Pages build environment)
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    console.log(`ℹ️  Čitam ${key} iz process.env (Cloudflare deployment)`);
    return process.env[key];
  }
  return undefined;
};

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

  const missing = required.filter((key) => !getEnvVar(key));

  if (missing.length > 0) {
    console.error("❌ Missing Firebase environment variables:", missing);
    console.error(
      "Please set these in Cloudflare Pages Environment Variables (as Plaintext, NOT Secret)",
    );
    throw new Error(`Missing Firebase config: ${missing.join(", ")}`);
  }

  return true;
};

// Validate before initialization
validateConfig();

const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID"),
  measurementId: getEnvVar("VITE_FIREBASE_MEASUREMENT_ID"),
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Analytics se inicijalizuje samo u browser okruženju (client-side)
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "europe-west1");

// Initialize App Check (optional - only if reCAPTCHA key is set)
// App Check se inicijalizuje samo u browser okruženju
let appCheck = null;

const recaptchaKey = getEnvVar("VITE_FIREBASE_RECAPTCHA_SITE_KEY");
const appCheckDebugToken = getEnvVar("VITE_FIREBASE_APPCHECK_DEBUG_TOKEN");

if (typeof window !== "undefined" && recaptchaKey) {
  if (import.meta.env.DEV && appCheckDebugToken) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckDebugToken;
  }

  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaKey),
      isTokenAutoRefreshEnabled: true,
    });
    console.log("✅ Firebase App Check initialized");
  } catch (error) {
    console.warn("⚠️ App Check initialization error:", error.message);
  }
} else {
  if (typeof window !== "undefined") {
    console.warn(
      "⚠️ VITE_FIREBASE_RECAPTCHA_SITE_KEY not set - App Check disabled",
    );
  }
}

export { appCheck };

console.log("✅ Firebase initialized successfully");
