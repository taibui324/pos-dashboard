import { NextResponse, type NextRequest } from "next/server";
import { getAppEnv } from "@/lib/env";
import { verifySapoWebhookSignature } from "@/lib/domain/webhook";

function sapoSignature(request: NextRequest) {
  return (
    request.headers.get("x-sapo-hmac-sha256") ??
    request.headers.get("x-sapo-webhook-hmac-sha256") ??
    request.headers.get("x-hmac-sha256")
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const env = getAppEnv();
  const secret = env.sapoWebhookSecret ?? "mock-sapo-webhook-secret";

  if (!verifySapoWebhookSignature(rawBody, sapoSignature(request), secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  // The production path will persist a webhook receipt and enqueue `sapo-webhooks`.
  return NextResponse.json(
    {
      accepted: true,
      queue: "sapo-webhooks",
      mode: env.sapoWebhookSecret ? "live-ready" : "mock"
    },
    { status: 202 }
  );
}
