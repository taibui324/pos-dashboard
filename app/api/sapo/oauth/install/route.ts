import { NextResponse, type NextRequest } from "next/server";
import { getAppEnv } from "@/lib/env";
import { buildSapoAuthorizeUrl } from "@/lib/sapo/oauth";

export function GET(request: NextRequest) {
  const env = getAppEnv();
  const store = request.nextUrl.searchParams.get("store") ?? env.sapoStoreUrl;

  if (!store || !env.sapoApiKey) {
    return NextResponse.json({ error: "sapo_oauth_not_configured" }, { status: 501 });
  }

  const redirectUri = `${env.appUrl}/api/sapo/oauth/callback`;
  return NextResponse.redirect(
    buildSapoAuthorizeUrl({
      store,
      apiKey: env.sapoApiKey,
      scopes: env.sapoOAuthScopes,
      redirectUri
    })
  );
}
