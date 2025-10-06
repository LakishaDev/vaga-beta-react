// src/contexts/shop/auth/AuthProvider.jsx
// Kontekst za autentifikaciju korisnika u prodavnici
// Koristi Firebase Authentication za upravljanje prijavom i odjavom korisnika
// Omogućava deljenje podataka o korisniku širom aplikacije
// Koristi AuthContext za deljenje podataka
// Možeš dodati funkcije za prijavu, odjavu i registraciju korisnika
// Inicijalna vrednost korisnika je null, što znači da nema prijavljenog korisnika
// Prati promene stanja autentifikacije pomoću onAuthStateChanged iz Firebase-a
// Eksportuj AuthProvider komponentu koja obavija decu i pruža kontekst

import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../../utils/firebase"; // tvoja firebase instanca

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user, // korisnik ili null
        loading, // status učitavanja
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
