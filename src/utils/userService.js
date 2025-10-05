// src/utils/userService.js
import { db, storage, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Kreiranje/ažuriranje korisničkog naloga u Firestore
export const createOrUpdateUserAccount = async (user, additionalData = {}) => {
  if (!user?.uid) throw new Error("Korisnik nije validan");
  const userDocRef = doc(db, 'nalozi', user.uid);

  try {
    const userDocSnap = await getDoc(userDocRef);
    // Osnovni podaci iz Auth
    const userData = {
      authUID: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      updatedAt: serverTimestamp(),
      ...additionalData
    };

    if (!userDocSnap.exists()) {
      // Kreiranje novog korisnika
      await setDoc(userDocRef, {
        ...userData,
        ime: user.displayName?.split(' ')[0] || '',
        prezime: user.displayName?.split(' ')[1] || '',
        username: user.email?.split('@')[0] || '',
        photoURL: user.photoURL || '',
        telefon: '',
        adresa: '',
        grad: '',
        datumRodjenja: null,
        createdAt: serverTimestamp(),
        authMethods: Array.isArray(user.providerData) ? user.providerData.map(p => p.providerId) : [],
        disabled: false,
        preferences: {
          notifications: true,
          newsletter: false,
          theme: 'light'
        }
      });
    } else {
      // Ažuriranje postojećeg - merge!
      await updateDoc(userDocRef, userData);
    }
  } catch (err) {
    throw new Error("Greška prilikom kreiranja/ažuriranja korisnika: " + err.message);
  }
};

// Dohvatanje korisničkih podataka
export const getUserData = async (userUID) => {
  if (!userUID) throw new Error("Nedostaje UID korisnika");
  const userDocRef = doc(db, 'nalozi', userUID);
  try {
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? userDocSnap.data() : null;
  } catch (err) {
    throw new Error("Greška prilikom dohvatanja podataka: " + err.message);
  }
};

// Ažuriranje profila
export const updateUserProfile = async (userUID, updateData) => {
  if (!userUID) throw new Error("Nedostaje UID korisnika");
  if (!updateData || typeof updateData !== 'object') throw new Error("Nisu prosleđeni podaci za ažuriranje");
  const userDocRef = doc(db, 'nalozi', userUID);

  try {
    await updateDoc(userDocRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    throw new Error("Greška prilikom ažuriranja profila: " + err.message);
  }
};

// Upload profilne slike
export const uploadProfileImage = async (userUID, imageFile) => {
  if (!userUID) throw new Error("Nedostaje UID korisnika");
  if (!imageFile) throw new Error("Slika nije selektovana");

  const imageRef = ref(storage, `users/${userUID}/profile.jpg`);
  try {
    await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(imageRef);

    // Ažuriraj photoURL u Firestore
    await updateUserProfile(userUID, { photoURL: downloadURL });
    return downloadURL;
  } catch (err) {
    throw new Error("Greška pri upload-u slike: " + err.message);
  }
};

// Brisanje profilne slike
export const deleteProfileImage = async (userUID) => {
  if (!userUID) throw new Error("Nedostaje UID korisnika");
  const imageRef = ref(storage, `users/${userUID}/profile.jpg`);

  try {
    await deleteObject(imageRef);
    await updateUserProfile(userUID, { photoURL: '' });
  } catch (err) {
    // Slika nije pronađena ili je već obrisana, nije kritična greška
    await updateUserProfile(userUID, { photoURL: '' });
    console.log('Slika nije pronađena ili je već obrisana');
  }
};

// --- BONUS: Briši nalog iz Firestore & Storage ---
export const deleteUserAccount = async (userUID) => {
  if (!userUID) throw new Error("Nedostaje UID korisnika");
  const userDocRef = doc(db, 'nalozi', userUID);
  const imageRef = ref(storage, `users/${userUID}/profile.jpg`);
  
  try {
    await deleteProfileImage(userUID);
  } catch (err) {
    /* ignore */
  }
  try {
    await updateDoc(userDocRef, { disabled: true });
  } catch (err) {
    /* ignore */
  }
  try {
    await deleteObject(imageRef); // možda je već obrisana
  } catch (err) {
    /* ignore */
  }
};
