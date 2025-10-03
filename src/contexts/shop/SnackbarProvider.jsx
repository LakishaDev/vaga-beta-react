import { useState, useCallback } from "react";
import { SnackbarContext } from "./SnackbarContext";
import Snackbar from "../../components/shop/Snackbar";

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ message: "", show: false });

  // Funkcija za prikaz Snackbar-a
  const showSnackbar = useCallback((message) => {
    setSnackbar({ message, show: true });
  }, []);

  // Funkcija za zatvaranje Snackbar-a
  const closeSnackbar = useCallback(() => {
    setSnackbar(s => ({ ...s, show: false }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        message={snackbar.message}
        show={snackbar.show}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
}
