// src/hooks/useUserData.js
// Custom hook za upravljanje podacima o korisniku
// Koristi Firebase Authentication za praćenje stanja prijave korisnika
// Učitava dodatne podatke o korisniku iz Firestore baze podataka
// Omogućava osvežavanje podataka o korisniku
// Vraća informacije o korisniku, dodatne podatke, stanje učitavanja i funkciju za osvežavanje podataka
// Možeš koristiti ovaj hook u bilo kojoj komponenti da bi dobio pristup podacima o korisniku
// Koristi useState i useEffect iz React biblioteke
// Uvozi potrebne funkcije iz Firebase i tvoje korisničke servisne funkcije
// Eksportuj funkciju useUserData
import { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserData, createOrUpdateUserAccount } from "../utils/userService";

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshUserData = async () => {
    if (user) {
      const freshData = await getUserData(user.uid);
      setUserData(freshData);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
        await createOrUpdateUserAccount(authUser);
        const firestoreData = await getUserData(authUser.uid);
        setUserData(firestoreData);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return { user, userData, loading, refreshUserData, setUserData };
};
