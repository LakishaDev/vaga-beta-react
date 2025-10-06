// src/hooks/useAuth.js
// Custom hook za pristup AuthContext-u
// Omogućava lakši pristup informacijama o korisniku širom aplikacije
// Koristi useContext iz React biblioteke
// Uvozi AuthContext iz odgovarajućeg fajla
// Eksportuj funkciju useAuth koja vraća vrednost iz AuthContext-a
import { useContext } from "react";
import { AuthContext } from "../contexts/shop/auth/AuthContext";

// Custom hook za još lakši pristup
export function useAuth() {
  return useContext(AuthContext);
}
