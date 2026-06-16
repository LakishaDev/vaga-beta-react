import * as crypto from "crypto";

const PRIVATE_KEY = process.env.LICENSE_PRIVATE_KEY!.replace(/\\n/g, "\n");

export function signPayload(payload: any): string {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(JSON.stringify(payload));
  sign.end();
  return sign.sign(PRIVATE_KEY, "base64");
}

// Potpisuje sirov string (bez JSON.stringify) — koristi se kad klijent
// verifikuje deterministički string (npr. `version:feedUrl:feedToken`)
// preko RSA VerifyData(SHA256, Pkcs1), bez rekonstrukcije JSON-a.
export function signString(data: string): string {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(data);
  sign.end();
  return sign.sign(PRIVATE_KEY, "base64");
}
