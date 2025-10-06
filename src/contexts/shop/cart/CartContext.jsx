// src/contexts/shop/cart/CartContext.jsx
// Kontekst za korpu u prodavnici
// Možeš koristiti ovaj kontekst za upravljanje stanjem korpe
// i deljenje podataka o proizvodima u korpi širom aplikacije
// createContext iz React biblioteke se koristi za kreiranje konteksta
// Inicijalna vrednost je prazan niz, što znači da nema proizvoda u korpi

import { createContext } from "react";

export const CartContext = createContext();
