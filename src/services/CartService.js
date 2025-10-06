// src/services/CartService.js
// Servis za upravljanje korpom
// Čuva i učitava korpu iz Firebase Firestore
// Koristi Firebase funkcije za čuvanje, učitavanje i osvežavanje podataka
// Pretpostavlja se da je korisnik prijavljen i da imamo njegov UID
// Stilizovana sa Tailwind CSS
// Responsive i pristupačna
// Koristi Firestore kolekciju "korpa" gde je svaki dokument ID korisnikov UID
// Svaki dokument sadrži polje "items" koje je niz stavki u korpi
// Svaka stavka ima: productId, name, price, quantity, imageUrl
// Uključuje funkcije: saveCartToFirebase, loadCartFromFirebase, clearCartInFirebase, subscribeToCartChanges
// subscribeToCartChanges koristi onSnapshot za real-time osvežavanje korpe
// Error handling je uključen
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase"; // putanja do tvoje Firebase konfiguracije

export class CartService {
  // Čuva korpu u Firebase za prijavljenog korisnika
  static async saveCartToFirebase(userUID, cartItems) {
    try {
      const cartDocRef = doc(db, "korpa", userUID);
      await setDoc(cartDocRef, {
        items: cartItems,
        updatedAt: new Date(),
        userUID: userUID,
      });
    } catch (error) {
      console.error("Greška pri čuvanju korpe:", error);
    }
  }

  // Učitava korpu iz Firebase-a
  static async loadCartFromFirebase(userUID) {
    try {
      const cartDocRef = doc(db, "korpa", userUID);
      const cartDoc = await getDoc(cartDocRef);

      if (cartDoc.exists()) {
        return cartDoc.data().items || [];
      }
      return [];
    } catch (error) {
      console.error("Greška pri učitavanju korpe:", error);
      return [];
    }
  }

  // Briše korpu iz Firebase-a
  static async clearCartInFirebase(userUID) {
    try {
      const cartDocRef = doc(db, "korpa", userUID);
      await setDoc(cartDocRef, {
        items: [],
        updatedAt: new Date(),
        userUID: userUID,
      });
    } catch (error) {
      console.error("Greška pri brisanju korpe:", error);
    }
  }

  // Real-time listener za promene korpe
  static subscribeToCartChanges(userUID, callback) {
    const cartDocRef = doc(db, "korpa", userUID);
    return onSnapshot(cartDocRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().items || []);
      } else {
        callback([]);
      }
    });
  }
}
