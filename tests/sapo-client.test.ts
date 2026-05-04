import { describe, expect, it, vi } from "vitest";
import { createSapoClient, SapoApiError } from "@/lib/sapo/client";

describe("createSapoClient", () => {
  it("sends private app credentials using Basic Authentication", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ orders: [] }), { status: 200 }));
    const client = createSapoClient({
      storeUrl: "https://store.mysapo.net",
      apiKey: "api-key",
      apiSecret: "api-secret",
      fetcher
    });

    await client.getOrders({ limit: 30 });

    expect(fetcher).toHaveBeenCalledWith(
      "https://store.mysapo.net/admin/orders.json?limit=30",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Basic ${Buffer.from("api-key:api-secret").toString("base64")}`
        })
      })
    );
  });

  it("can send an OAuth access token for public app installs", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ orders: [] }), { status: 200 }));
    const client = createSapoClient({
      storeUrl: "https://store.mysapo.net",
      accessToken: "secret-token",
      fetcher
    });

    await client.getOrders({ limit: 30 });

    expect(fetcher).toHaveBeenCalledWith(
      "https://store.mysapo.net/admin/orders.json?limit=30",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Sapo-Access-Token": "secret-token"
        })
      })
    );
  });

  it("raises structured errors for Sapo rate limits", async () => {
    const fetcher = vi.fn(async () => new Response("slow down", { status: 429 }));
    const client = createSapoClient({
      storeUrl: "https://store.mysapo.net",
      accessToken: "secret-token",
      fetcher
    });

    await expect(client.getProducts()).rejects.toMatchObject({
      name: "SapoApiError",
      status: 429,
      code: "rate_limited"
    } satisfies Partial<SapoApiError>);
  });
});
