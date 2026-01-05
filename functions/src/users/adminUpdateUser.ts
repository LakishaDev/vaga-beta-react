/**
 * Firebase Cloud Function - Admin Update User
 * Updates user data in Firestore and optionally in Auth
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

interface UpdateUserData {
  uid: string;
  displayName?: string;
  email?: string;
  role?: "operator" | "user" | "admin";
  proizvodi?: string[];
  isAdmin?: boolean;
  active?: boolean;
}

export const adminUpdateUser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Morate biti prijavljeni");
  }

  // Check if caller is admin
  const callerDoc = await admin
    .firestore()
    .collection("nalozi")
    .doc(request.auth.uid)
    .get();

  if (!callerDoc.exists || !callerDoc.data()?.isAdmin) {
    throw new HttpsError("permission-denied", "Nemate admin privilegije");
  }

  const data = request.data as UpdateUserData;

  if (!data.uid) {
    throw new HttpsError("invalid-argument", "UID korisnika je obavezan");
  }

  try {
    const auth = getAuth();
    const db = getFirestore();

    // Update Auth if email or displayName changed
    const authUpdates: any = {};
    if (data.email) authUpdates.email = data.email;
    if (data.displayName) authUpdates.displayName = data.displayName;

    if (Object.keys(authUpdates).length > 0) {
      await auth.updateUser(data.uid, authUpdates);
    }

    // Update Firestore
    const firestoreUpdates: any = {
      updatedAt: new Date().toISOString(),
      updatedBy: request.auth.uid,
    };

    if (data.displayName !== undefined)
      firestoreUpdates.displayName = data.displayName;
    if (data.email !== undefined) firestoreUpdates.email = data.email;
    if (data.role !== undefined) firestoreUpdates.role = data.role;
    if (data.proizvodi !== undefined)
      firestoreUpdates.proizvodi = data.proizvodi;
    if (data.isAdmin !== undefined) firestoreUpdates.isAdmin = data.isAdmin;
    if (data.active !== undefined) firestoreUpdates.active = data.active;

    await db.collection("users").doc(data.uid).update(firestoreUpdates);

    return {
      success: true,
      message: "Korisnik uspešno ažuriran",
    };
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new HttpsError(
      "internal",
      `Greška pri ažuriranju korisnika: ${error.message}`
    );
  }
});
