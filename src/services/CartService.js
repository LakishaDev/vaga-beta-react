// src/services/CartService.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../utils/firebase'; // putanja do tvoje Firebase konfiguracije

export class CartService {
  
  // Čuva korpu u Firebase za prijavljenog korisnika
  static async saveCartToFirebase(userUID, cartItems) {
    try {
      const cartDocRef = doc(db, 'korpa', userUID);
      await setDoc(cartDocRef, {
        items: cartItems,
        updatedAt: new Date(),
        userUID: userUID
      });
    } catch (error) {
      console.error('Greška pri čuvanju korpe:', error);
    }
  }

  // Učitava korpu iz Firebase-a
  static async loadCartFromFirebase(userUID) {
    try {
      const cartDocRef = doc(db, 'korpa', userUID);
      const cartDoc = await getDoc(cartDocRef);
      
      if (cartDoc.exists()) {
        return cartDoc.data().items || [];
      }
      return [];
    } catch (error) {
      console.error('Greška pri učitavanju korpe:', error);
      return [];
    }
  }

  // Briše korpu iz Firebase-a
  static async clearCartInFirebase(userUID) {
    try {
      const cartDocRef = doc(db, 'korpa', userUID);
      await setDoc(cartDocRef, {
        items: [],
        updatedAt: new Date(),
        userUID: userUID
      });
    } catch (error) {
      console.error('Greška pri brisanju korpe:', error);
    }
  }

  // Real-time listener za promene korpe
  static subscribeToCartChanges(userUID, callback) {
    const cartDocRef = doc(db, 'korpa', userUID);
    return onSnapshot(cartDocRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().items || []);
      } else {
        callback([]);
      }
    });
  }
}
