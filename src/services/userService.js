// src/services/userService.js
// ===============================================================================
// USER SERVICE - Servis za upravljanje korisnicima eVagaClientMobile aplikacije
// ===============================================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../utils/firebase";

const USERS_COLLECTION = "users";

// ===============================================================================
// CRUD OPERACIJE
// ===============================================================================

/**
 * Kreiranje novog korisnika (Auth + Firestore)
 */
export const createUser = async (userData) => {
  try {
    const createUserFn = httpsCallable(functions, "adminCreateUser");
    const result = await createUserFn({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      role: userData.role,
      proizvodi: userData.proizvodi,
      isAdmin: userData.isAdmin,
      active: userData.active,
    });
    return result.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Ažuriranje korisnika
 */
export const updateUser = async (userId, userData) => {
  try {
    const updateUserFn = httpsCallable(functions, "adminUpdateUser");
    const result = await updateUserFn({
      uid: userId,
      ...userData,
    });
    return result.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Brisanje korisnika (Auth + Firestore)
 */
export const deleteUser = async (userId) => {
  try {
    const deleteUserFn = httpsCallable(functions, "adminDeleteUser");
    const result = await deleteUserFn({ uid: userId });
    return result.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * Promena lozinke korisnika
 */
export const changePassword = async (userId, newPassword) => {
  try {
    const changePasswordFn = httpsCallable(functions, "adminChangePassword");
    const result = await changePasswordFn({ uid: userId, newPassword });
    return result.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

/**
 * Dobavljanje jednog korisnika
 */
export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Dobavljanje svih korisnika
 */
export const getAllUsers = async () => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Real-time listener za korisnike
 */
export const subscribeToUsers = (callback) => {
  const q = query(
    collection(db, USERS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(users);
    },
    (error) => {
      console.error("Error in users subscription:", error);
      callback([]);
    }
  );
};

/**
 * Toggle aktivnosti korisnika
 */
export const toggleUserActive = async (userId, currentStatus) => {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      active: !currentStatus,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error toggling user active status:", error);
    throw error;
  }
};

/**
 * Filtriranje korisnika
 */
export const filterUsers = (users, filters) => {
  let filtered = [...users];

  // Filter po status
  if (filters.active !== undefined && filters.active !== "all") {
    filtered = filtered.filter((user) => user.active === filters.active);
  }

  // Filter po roli
  if (filters.role && filters.role !== "all") {
    filtered = filtered.filter((user) => user.role === filters.role);
  }

  // Filter po proizvodima
  if (filters.proizvod && filters.proizvod !== "all") {
    filtered = filtered.filter((user) =>
      user.proizvodi?.includes(filters.proizvod)
    );
  }

  // Pretraga
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchLower) ||
        user.displayName?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};
