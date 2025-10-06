import { useContext } from "react";
import { AuthContext } from "../contexts/shop/auth/AuthContext";

// Custom hook za još lakši pristup
export function useAuth() {
  return useContext(AuthContext);
}