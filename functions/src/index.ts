/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import "dotenv/config";
import { setGlobalOptions } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";

setGlobalOptions({
  maxInstances: 10,
  region: "europe-west1",
});

initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export { adminCreateLicense } from "./licenses/adminCreateLicense";
export { adminUpdateLicense } from "./licenses/adminUpdateLicense";
export { adminBlockLicense } from "./licenses/adminBlockLicense";
export { adminResetHardware } from "./licenses/adminResetHardware";
export { licenseActivate } from "./licenses/licenseActivate";
export { licenseVerify } from "./licenses/licenseVerify";
export { adminExtendLicense } from "./licenses/adminExtendLicense";
export { adminConvertTrial } from "./licenses/adminConvertTrial";
export { adminRevokeLicense } from "./licenses/adminRevokeLicense";
export { adminUnblockLicense } from "./licenses/adminUnblockLicense";
export { adminRegenerateLicenseKey } from "./licenses/adminRegenerateLicenseKey";
export { adminUpdateOrderStatus } from "./licenses/adminUpdateOrderStatus";

// User management functions
export { adminCreateUser } from "./users/adminCreateUser";
export { adminUpdateUser } from "./users/adminUpdateUser";
export { adminDeleteUser } from "./users/adminDeleteUser";
export { adminChangePassword } from "./users/adminChangePassword";
