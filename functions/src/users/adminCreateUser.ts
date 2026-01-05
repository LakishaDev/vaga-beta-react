import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

interface CreateUserRequest {
  email: string;
  password: string;
  displayName: string;
  role: "operator" | "user" | "admin";
  proizvodi: ("evagahub" | "evagatruck")[];
  isAdmin: boolean;
  active: boolean;
}

export const adminCreateUser = onCall(async (req) => {
  // Check if user is authenticated
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  // Check if caller is admin
  const callerDoc = await admin
    .firestore()
    .collection("nalozi")
    .doc(req.auth.uid)
    .get();

  if (!callerDoc.exists || !callerDoc.data()?.isAdmin) {
    throw new HttpsError("permission-denied", "Nemate admin privilegije");
  }

  const data = req.data as CreateUserRequest;

  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    });

    // Create user document in Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      proizvodi: data.proizvodi,
      isAdmin: data.isAdmin,
      active: data.active,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      uid: userRecord.uid,
      message: "User created successfully",
    };
  } catch (error: any) {
    throw new HttpsError("internal", `Failed to create user: ${error.message}`);
  }
});
