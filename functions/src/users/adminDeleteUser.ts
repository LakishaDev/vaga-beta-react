/**
 * Firebase Cloud Function - Admin Delete User
 * Deletes user from Firebase Auth and Firestore
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

interface DeleteUserData {
  uid: string;
}

export const adminDeleteUser = onCall(async (request) => {
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

  const data = request.data as DeleteUserData;

  if (!data.uid) {
    throw new HttpsError("invalid-argument", "UID korisnika je obavezan");
  }

  // Prevent deleting yourself
  if (data.uid === request.auth.uid) {
    throw new HttpsError("permission-denied", "Ne možete obrisati svoj nalog");
  }

  try {
    const auth = getAuth();
    const db = getFirestore();

    // Delete from Firestore first
    await db.collection("users").doc(data.uid).delete();

    // Then delete from Auth
    await auth.deleteUser(data.uid);

    return {
      success: true,
      message: "Korisnik uspešno obrisan",
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new HttpsError(
      "internal",
      `Greška pri brisanju korisnika: ${error.message}`
    );
  }
});
