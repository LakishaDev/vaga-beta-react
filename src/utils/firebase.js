import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Vaša Firebase konfiguracija
const firebaseConfig = {
  apiKey: "AIzaSyCi4Dv4xX0uLr5texK-UoQMgAx6LYyLRGk",
  authDomain: "vaga-beta-sajt.firebaseapp.com",
  projectId: "vaga-beta-sajt",
  storageBucket: "vaga-beta-sajt.firebasestorage.app",      // Ispravi: .app → .app**spot.com**
  messagingSenderId: "128255475317",
  appId: "1:128255475317:web:940cd944e6f1f762b9423c",
  measurementId: "G-WQFDTPZEXB"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
