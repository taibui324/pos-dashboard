import { createHmac, timingSafeEqual } from "node:crypto";

export type SapoOAuthConfig = {
  store: string;
  apiKey: string;
  scopes: string[];
  redirectUri: string;
};

export type SapoTokenExchangeOptions = {
  store: string;
  apiKey: string;
  apiSecret: string;
  code: string;
  fetcher?: typeof fetch;
};

export class SapoOAuthError extends Error {
  status: number;
  responseBody: string;

  constructor(status: number, responseBody: string) {
    super(`Sapo OAuth request failed with status ${status}`);
    this.name = "SapoOAuthError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

export function normalizeSapoStore(store: string) {
  const trimmed = store.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return trimmed.endsWith(".mysapo.net") ? trimmed : `${trimmed}.mysapo.net`;
}

export function buildSapoAuthorizeUrl(config: SapoOAuthConfig) {
  const query = new URLSearchParams({
    client_id: config.apiKey,
    scope: config.scopes.join(" "),
    redirect_uri: config.redirectUri,
    response_type: "code"
  });

  return `https://${normalizeSapoStore(config.store)}/admin/oauth/authorize?${query.toString()}`;
}

function hmacMessage(params: URLSearchParams) {
  return [...params.entries()]
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export function createSapoOAuthHmac(params: URLSearchParams, apiSecret: string) {
  return createHmac("sha256", apiSecret).update(hmacMessage(params), "utf8").digest("hex");
}

export function verifySapoOAuthQuery(params: URLSearchParams, apiSecret: string) {
  const hmac = params.get("hmac");

  if (!hmac || !apiSecret) {
    return false;
  }

  const expected = createSapoOAuthHmac(params, apiSecret);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(hmac);
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export async function exchangeSapoOAuthCode(options: SapoTokenExchangeOptions) {
  const fetcher = options.fetcher ?? fetch;
  const body = {
    client_id: options.apiKey,
    client_secret: options.apiSecret,
    code: options.code
  };

  const response = await fetcher(`https://${normalizeSapoStore(options.store)}/admin/oauth/access_token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new SapoOAuthError(response.status, await response.text());
  }

  const payload = (await response.json()) as { access_token?: string };

  if (!payload.access_token) {
    throw new SapoOAuthError(response.status, "Missing access_token in Sapo OAuth response.");
  }

  return {
    accessToken: payload.access_token
  };
}
