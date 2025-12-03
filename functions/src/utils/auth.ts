import { HttpsError } from "firebase-functions/v2/https";

export function assertAdmin(context: any) {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "User not authenticated");
  }

  if (!context.auth.token?.admin) {
    throw new HttpsError("permission-denied", "Admin privileges required");
  }
}
