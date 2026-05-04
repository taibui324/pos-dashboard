import { describe, expect, it, vi } from "vitest";
import {
  buildSapoAuthorizeUrl,
  createSapoOAuthHmac,
  exchangeSapoOAuthCode,
  verifySapoOAuthQuery
} from "@/lib/sapo/oauth";

describe("Sapo OAuth helpers", () => {
  it("builds the install URL using the Sapo client SDK OAuth shape", () => {
    const url = buildSapoAuthorizeUrl({
      store: "daspace",
      apiKey: "api-key",
      scopes: ["read_orders", "read_products"],
      redirectUri: "https://app.example.com/api/sapo/oauth/callback"
    });

    expect(url).toBe(
      "https://daspace.mysapo.net/admin/oauth/authorize?client_id=api-key&scope=read_orders+read_products&redirect_uri=https%3A%2F%2Fapp.example.com%2Fapi%2Fsapo%2Foauth%2Fcallback&response_type=code"
    );
  });

  it("verifies callback HMAC by sorting all query params except hmac and signature", () => {
    const query = new URLSearchParams({
      store: "daspace.mysapo.net",
      code: "authorization-code",
      timestamp: "1716543000",
      signature: "legacy-signature"
    });
    query.set("hmac", createSapoOAuthHmac(query, "secret"));

    expect(verifySapoOAuthQuery(query, "secret")).toBe(true);
    expect(verifySapoOAuthQuery(query, "wrong-secret")).toBe(false);
  });

  it("exchanges an authorization code without logging or returning the secret", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ access_token: "token-123" }), { status: 200 }));

    const result = await exchangeSapoOAuthCode({
      store: "daspace",
      apiKey: "api-key",
      apiSecret: "secret",
      code: "authorization-code",
      fetcher
    });

    expect(result).toEqual({ accessToken: "token-123" });
    expect(fetcher).toHaveBeenCalledWith(
      "https://daspace.mysapo.net/admin/oauth/access_token",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          client_id: "api-key",
          client_secret: "secret",
          code: "authorization-code"
        })
      })
    );
  });
});
