/**
 * Firebase Cloud Function - Admin Change Password
 * Allows admin to change any user's password
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

interface ChangePasswordData {
  uid: string;
  newPassword: string;
}

export const adminChangePassword = onCall(async (request) => {
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

  const data = request.data as ChangePasswordData;

  if (!data.uid || !data.newPassword) {
    throw new HttpsError("invalid-argument", "UID i nova lozinka su obavezni");
  }

  if (data.newPassword.length < 6) {
    throw new HttpsError(
      "invalid-argument",
      "Lozinka mora imati minimum 6 karaktera"
    );
  }

  try {
    const auth = getAuth();

    await auth.updateUser(data.uid, {
      password: data.newPassword,
    });

    return {
      success: true,
      message: "Lozinka uspešno promenjena",
    };
  } catch (error: any) {
    console.error("Error changing password:", error);
    throw new HttpsError(
      "internal",
      `Greška pri promeni lozinke: ${error.message}`
    );
  }
});
