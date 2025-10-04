import { db, storage, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Kreiranje/ažuriranje korisničkog naloga u Firestore
export const createOrUpdateUserAccount = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userDocRef = doc(db, 'nalozi', user.uid);
  const userDoc = await getDoc(userDocRef);
  
  // Osnovni podaci iz Auth
  const userData = {
    authUID: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    updatedAt: serverTimestamp(),
    ...additionalData
  };
  
  if (!userDoc.exists()) {
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
      authMethods: user.providerData.map(p => p.providerId),
      disabled: false,
      preferences: {
        notifications: true,
        newsletter: false,
        theme: 'light'
      }
    });
  } else {
    // Ažuriranje postojećeg
    await updateDoc(userDocRef, userData);
  }
};

// Dohvatanje korisničkih podataka
export const getUserData = async (userUID) => {
  const userDocRef = doc(db, 'nalozi', userUID);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists() ? userDoc.data() : null;
};

// Ažuriranje profila
export const updateUserProfile = async (userUID, updateData) => {
  const userDocRef = doc(db, 'nalozi', userUID);
  await updateDoc(userDocRef, {
    ...updateData,
    updatedAt: serverTimestamp()
  });
};

// Upload profilne slike
export const uploadProfileImage = async (userUID, imageFile) => {
  const imageRef = ref(storage, `users/${userUID}/profile.jpg`);
  await uploadBytes(imageRef, imageFile);
  const downloadURL = await getDownloadURL(imageRef);
  
  // Ažuriraj photoURL u Firestore
  await updateUserProfile(userUID, { photoURL: downloadURL });
  
  return downloadURL;
};

// Brisanje profilne slike
export const deleteProfileImage = async (userUID) => {
  const imageRef = ref(storage, `users/${userUID}/profile.jpg`);
  try {
    await deleteObject(imageRef);
    await updateUserProfile(userUID, { photoURL: '' });
  } catch (error) {
    console.log('Slika nije pronađena ili je već obrisana');
  }
};
