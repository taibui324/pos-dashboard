import { describe, expect, it } from "vitest";
import { createSapoWebhookSignature, verifySapoWebhookSignature } from "@/lib/domain/webhook";

describe("Sapo webhook signature verification", () => {
  it("accepts the expected HMAC SHA-256 signature", () => {
    const body = JSON.stringify({ order_id: 123, event: "orders/update" });
    const signature = createSapoWebhookSignature(body, "secret");

    expect(verifySapoWebhookSignature(body, signature, "secret")).toBe(true);
  });

  it("rejects invalid or missing signatures", () => {
    const body = JSON.stringify({ order_id: 123, event: "orders/update" });

    expect(verifySapoWebhookSignature(body, "bad-signature", "secret")).toBe(false);
    expect(verifySapoWebhookSignature(body, "", "secret")).toBe(false);
  });
});
