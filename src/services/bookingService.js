// src/services/bookingService.js
// CRUD operacije za booking sistem
// Koristi Firebase Firestore za persistence
// Senduje notifikacije kroz Cloud Functions

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Firestore kolekcija
const BOOKINGS_COLLECTION = "bookings";

/**
 * Kreiraj novi booking zahtev
 * @param {Object} bookingData - Booking podaci
 * @returns {Promise<string>} Booking ID
 */
export async function createBooking(bookingData) {
  try {
    const bookingWithDefaults = {
      ...bookingData,
      status: "primljeno", // primljeno, u_obradi, zakazano, zavrseno
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      seen: false, // Vidjen od strane admina
    };

    const docRef = await addDoc(
      collection(db, BOOKINGS_COLLECTION),
      bookingWithDefaults,
    );

    console.log("✅ Booking kreiran:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Greška pri kreiranju booking-a:", error);
    throw error;
  }
}

/**
 * Učitaj sve booking-e korisnika
 * @param {string} userId - Firebase UID korisnika
 * @returns {Promise<Array>} Lista booking-a
 */
export async function getUserBookings(userId) {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Greška pri učitavanju booking-a:", error);
    return [];
  }
}

/**
 * Učitaj jedan booking po ID-u
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object|null>} Booking objekat
 */
export async function getBooking(bookingId) {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("❌ Greška pri učitavanju booking-a:", error);
    return null;
  }
}

/**
 * Ažuriraj status booking-a
 * @param {string} bookingId - Booking ID
 * @param {string} status - Novi status (primljeno, u_obradi, zakazano, zavrseno)
 * @param {Object} additionalData - Dodatni podaci za ažuriranje
 */
export async function updateBookingStatus(
  bookingId,
  status,
  additionalData = {},
) {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData,
    });

    console.log("✅ Booking status ažuriran:", status);
  } catch (error) {
    console.error("❌ Greška pri ažuriranju booking-a:", error);
    throw error;
  }
}

/**
 * Označi booking kao vidjen
 * @param {string} bookingId - Booking ID
 */
export async function markBookingAsSeen(bookingId) {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      seen: true,
      seenAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Greška pri označavanju booking-a kao vidjen:", error);
  }
}

/**
 * Obriši booking zahtev (samo nepokrenut status)
 * @param {string} bookingId - Booking ID
 */
export async function deleteBooking(bookingId) {
  try {
    const booking = await getBooking(bookingId);

    // Može se obrisati samo ako je u "primljeno" statusu
    if (booking?.status !== "primljeno") {
      throw new Error("Mogu se brisati samo zahtevi u 'primljeno' statusu");
    }

    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await deleteDoc(docRef);

    console.log("✅ Booking obrisan:", bookingId);
  } catch (error) {
    console.error("❌ Greška pri brisanju booking-a:", error);
    throw error;
  }
}

/**
 * Učitaj sve booking-e (za admin panel)
 * @returns {Promise<Array>} Svi booking-i sortirani po datumu
 */
export async function getAllBookings() {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Greška pri učitavanju svih booking-a:", error);
    return [];
  }
}

/**
 * Učitaj booking-e po statusu (za admin)
 * @param {string} status - Status filter
 * @returns {Promise<Array>} Filtrirani booking-i
 */
export async function getBookingsByStatus(status) {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Greška pri učitavanju booking-a po statusu:", error);
    return [];
  }
}

/**
 * Statistika booking-a
 * @returns {Promise<Object>} Broj booking-a po statusu
 */
export async function getBookingStats() {
  try {
    const allBookings = await getAllBookings();

    return {
      total: allBookings.length,
      primljeno: allBookings.filter((b) => b.status === "primljeno").length,
      u_obradi: allBookings.filter((b) => b.status === "u_obradi").length,
      zakazano: allBookings.filter((b) => b.status === "zakazano").length,
      zavrseno: allBookings.filter((b) => b.status === "zavrseno").length,
      unseen: allBookings.filter((b) => !b.seen).length,
    };
  } catch (error) {
    console.error("❌ Greška pri računanju statistike:", error);
    return {
      total: 0,
      primljeno: 0,
      u_obradi: 0,
      zakazano: 0,
      zavrseno: 0,
      unseen: 0,
    };
  }
}

// Zamena za mapiranje statusa
export const BOOKING_STATUS = {
  RECEIVED: "primljeno",
  PROCESSING: "u_obradi",
  SCHEDULED: "zakazano",
  COMPLETED: "zavrseno",
};

export const BOOKING_STATUS_LABELS = {
  primljeno: "Primljen zahtev",
  u_obradi: "U obradi",
  zakazano: "Zakazano",
  zavrseno: "Završeno",
};

export const BOOKING_STATUS_COLORS = {
  primljeno: "bg-blue-100 text-blue-800 border-blue-300",
  u_obradi: "bg-yellow-100 text-yellow-800 border-yellow-300",
  zakazano: "bg-purple-100 text-purple-800 border-purple-300",
  zavrseno: "bg-green-100 text-green-800 border-green-300",
};

// Booking schema za Firestore
export const createBookingSchema = {
  // Korisnik
  userId: "string", // Firebase UID
  userName: "string", // Korisnicko ime
  userEmail: "string", // Email
  userPhone: "string", // Telefon

  // Usluga
  service: "string", // Tip usluge (servis, žigosanje, overavanje)
  serviceDetails: "string", // Detaljniji opis

  // Vaga
  scaleType: "string", // Tip vage (paletna, laboratorijska, desktop)
  scaleModel: "string", // Model vage
  scaleSerialNumber: "string", // Serijski broj (opciono)

  // Lokacija
  location: "string", // Gde je vaga (adresa)
  deliveryRequired: "boolean", // Da li je dostava potrebna

  // Datum
  preferredDate: "date/timestamp", // Željeni datum
  notes: "string", // Napomene

  // Status
  status: "string enum: primljeno|u_obradi|zakazano|zavrseno",
  statusHistory: [
    {
      status: "string",
      changedAt: "timestamp",
      changedBy: "string", // Admin ID
      notes: "string",
    },
  ],

  // Metadata
  createdAt: "timestamp",
  updatedAt: "timestamp",
  seen: "boolean", // Vidjen od strane admina
  seenAt: "timestamp",

  // Rezultat
  completion: {
    completedAt: "timestamp",
    resultFile: "string", // Storage path
    notes: "string",
  },
};
