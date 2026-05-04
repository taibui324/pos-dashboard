import { NextResponse } from "next/server";
import { getAppEnv } from "@/lib/env";
import { createSapoClient, SapoApiError } from "@/lib/sapo/client";

export async function GET() {
  const env = getAppEnv();

  const hasPrivateAppCredentials = Boolean(env.sapoApiKey && env.sapoApiSecret);
  const hasOAuthAccessToken = Boolean(env.sapoAccessToken);

  if (!env.sapoStoreUrl || (!hasPrivateAppCredentials && !hasOAuthAccessToken)) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_sapo_credentials",
        nextStep: "Set SAPO_STORE_URL plus SAPO_API_KEY/SAPO_API_SECRET for a Sapo Private App, or set SAPO_ACCESS_TOKEN for OAuth."
      },
      { status: 400 }
    );
  }

  const client = createSapoClient({
    storeUrl: env.sapoStoreUrl,
    apiKey: env.sapoApiKey ?? undefined,
    apiSecret: env.sapoApiSecret ?? undefined,
    accessToken: env.sapoAccessToken ?? undefined
  });

  try {
    const [orders, products, variants, locations, inventoryLevels, inventoryItems] = await Promise.all([
      client.getOrders({ limit: 1 }),
      client.getProducts({ limit: 1 }),
      client.getVariants({ limit: 1 }),
      client.getLocations({ limit: 1 }),
      client.getInventoryLevels({ limit: 1 }),
      client.getInventoryItems({ limit: 1 })
    ]);

    return NextResponse.json({
      ok: true,
      authMode: hasPrivateAppCredentials ? "private_app_basic" : "oauth_access_token",
      checks: {
        orders: Boolean(orders),
        products: Boolean(products),
        variants: Boolean(variants),
        locations: Boolean(locations),
        inventoryLevels: Boolean(inventoryLevels),
        inventoryItems: Boolean(inventoryItems)
      }
    });
  } catch (error) {
    if (error instanceof SapoApiError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.code,
          status: error.status
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "unknown_sapo_error"
      },
      { status: 500 }
    );
  }
}
