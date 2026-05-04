import { createHmac, timingSafeEqual } from "node:crypto";

export function createSapoWebhookSignature(rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
}

export function verifySapoWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) {
    return false;
  }

  const expected = createSapoWebhookSignature(rawBody, secret);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}
