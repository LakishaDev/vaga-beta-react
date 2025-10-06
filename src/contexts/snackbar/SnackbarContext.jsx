// src/contexts/snackbar/SnackbarContext.jsx
// Kontekst za snackbar (obaveštenja) u aplikaciji
// Možeš koristiti ovaj kontekst za prikazivanje obaveštenja širom aplikacije
// createContext iz React biblioteke se koristi za kreiranje konteksta
// Inicijalna vrednost je null, što znači da nema aktivnog obaveštenja
// Možeš dodati funkcije za prikazivanje i sakrivanje obaveštenja
import { createContext } from "react";

export const SnackbarContext = createContext();
