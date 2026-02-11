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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "europe-west1");

// Initialize App Check (optional - only if reCAPTCHA key is set)
let appCheck = null;

if (import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY) {
  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN
  ) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN =
      import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
  }

  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(
        import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY,
      ),
      isTokenAutoRefreshEnabled: true,
    });
    console.log("✅ Firebase App Check initialized");
  } catch (error) {
    console.warn("⚠️ App Check initialization error:", error.message);
  }
} else {
  console.warn(
    "⚠️ VITE_FIREBASE_RECAPTCHA_SITE_KEY not set - App Check disabled",
  );
}

export { appCheck };

console.log("✅ Firebase initialized successfully");
