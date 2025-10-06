// src/contexts/auth/AuthContext.jsx
// Kontekst za autentifikaciju korisnika
// Možeš koristiti ovaj kontekst za upravljanje stanjem prijave korisnika
// i deljenje podataka o korisniku širom aplikacije
// createContext iz React biblioteke se koristi za kreiranje konteksta
// Po potrebi možeš dodati funkcije za prijavu, odjavu i registraciju korisnika
// Inicijalna vrednost je null, što znači da nema prijavljenog korisnika

import { createContext } from "react";

export const AuthContext = createContext();
