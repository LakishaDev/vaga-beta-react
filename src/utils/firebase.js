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
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN =
    import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
}

export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY
  ),
  isTokenAutoRefreshEnabled: true,
});

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
