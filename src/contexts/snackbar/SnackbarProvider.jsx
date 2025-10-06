// src/contexts/snackbar/SnackbarProvider.jsx
// Kontekst za snackbar (obaveštenja) u aplikaciji
// Omogućava prikazivanje obaveštenja širom aplikacije
// Koristi SnackbarContext za deljenje funkcije showSnackbar
// Upravlja stanjem obaveštenja (niz obaveštenja)
// Funkcija showSnackbar dodaje novo obaveštenje u niz
// Funkcija removeSnackbar uklanja obaveštenje iz niza po ID-u
// Eksportuj SnackbarProvider komponentu koja obavija decu i pruža kontekst
// Uključi SnackbarStack komponentu za prikazivanje obaveštenja
import { useState, useCallback } from "react";
import { SnackbarContext } from "./SnackbarContext";
import SnackbarStack from "../../components/UI/SnackbarStack";

export function SnackbarProvider({ children }) {
  const [snacks, setSnacks] = useState([]);

  const showSnackbar = useCallback((message, type) => {
    const id = Math.random().toString(36).slice(2, 10);
    setSnacks((snacks) => [
      ...snacks,
      { message, id, show: true, type: type || "info" },
    ]);
  }, []);

  const removeSnackbar = useCallback((id) => {
    setSnacks((snacks) => snacks.filter((s) => s.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarStack messages={snacks} removeSnackbar={removeSnackbar} />
    </SnackbarContext.Provider>
  );
}
