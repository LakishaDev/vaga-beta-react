import * as crypto from "crypto";

const PRIVATE_KEY = process.env.LICENSE_PRIVATE_KEY!.replace(/\\n/g, "\n");

export function signPayload(payload: any): string {
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(JSON.stringify(payload));
  sign.end();
  return sign.sign(PRIVATE_KEY, "base64");
}
