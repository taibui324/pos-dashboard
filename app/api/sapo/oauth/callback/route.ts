import { NextResponse, type NextRequest } from "next/server";
import { getAppEnv } from "@/lib/env";
import { exchangeSapoOAuthCode, verifySapoOAuthQuery } from "@/lib/sapo/oauth";

export async function GET(request: NextRequest) {
  const env = getAppEnv();
  const params = request.nextUrl.searchParams;
  const store = params.get("store") ?? env.sapoStoreUrl;
  const code = params.get("code");

  if (!env.sapoApiKey || !env.sapoApiSecret || !store || !code) {
    return NextResponse.json({ error: "missing_sapo_oauth_configuration" }, { status: 400 });
  }

  if (!verifySapoOAuthQuery(params, env.sapoApiSecret)) {
    return NextResponse.json({ error: "invalid_oauth_hmac" }, { status: 401 });
  }

  const token = await exchangeSapoOAuthCode({
    store,
    apiKey: env.sapoApiKey,
    apiSecret: env.sapoApiSecret,
    code
  });

  // Production will persist the token encrypted server-side; never return it to the browser.
  return NextResponse.json({
    ok: true,
    store,
    accessTokenReceived: Boolean(token.accessToken)
  });
}
