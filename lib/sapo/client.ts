export type SapoClientOptions = {
  storeUrl: string;
  accessToken?: string;
  apiKey?: string;
  apiSecret?: string;
  fetcher?: typeof fetch;
};

export type SapoListParams = {
  limit?: number;
  page?: number;
  updatedAtMin?: string;
  updatedAtMax?: string;
};

export class SapoApiError extends Error {
  status: number;
  code: "rate_limited" | "unauthorized" | "api_error";
  responseBody: string;

  constructor(status: number, responseBody: string) {
    super(`Sapo API request failed with status ${status}`);
    this.name = "SapoApiError";
    this.status = status;
    this.responseBody = responseBody;
    this.code = status === 429 ? "rate_limited" : status === 401 || status === 403 ? "unauthorized" : "api_error";
  }
}

function normalizeBaseUrl(storeUrl: string) {
  return storeUrl.replace(/\/+$/, "");
}

function createAuthHeaders(options: SapoClientOptions): Record<string, string> {
  if (options.apiKey && options.apiSecret) {
    return {
      Authorization: `Basic ${Buffer.from(`${options.apiKey}:${options.apiSecret}`).toString("base64")}`
    };
  }

  if (options.accessToken) {
    return {
      "X-Sapo-Access-Token": options.accessToken
    };
  }

  throw new SapoApiError(401, "Missing Sapo API credentials.");
}

function withParams(path: string, params: SapoListParams = {}) {
  const search = new URLSearchParams();
  if (params.limit) search.set("limit", String(params.limit));
  if (params.page) search.set("page", String(params.page));
  if (params.updatedAtMin) search.set("updated_at_min", params.updatedAtMin);
  if (params.updatedAtMax) search.set("updated_at_max", params.updatedAtMax);
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export function createSapoClient(options: SapoClientOptions) {
  const baseUrl = normalizeBaseUrl(options.storeUrl);
  const fetcher = options.fetcher ?? fetch;
  const authHeaders = createAuthHeaders(options);

  async function request<T>(path: string): Promise<T> {
    const response = await fetcher(`${baseUrl}${path}`, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        ...authHeaders
      }
    });

    if (!response.ok) {
      throw new SapoApiError(response.status, await response.text());
    }

    return response.json() as Promise<T>;
  }

  return {
    getOrders(params?: SapoListParams) {
      return request(withParams("/admin/orders.json", params));
    },
    getProducts(params?: SapoListParams) {
      return request(withParams("/admin/products.json", params));
    },
    getVariants(params?: SapoListParams) {
      return request(withParams("/admin/variants.json", params));
    },
    getLocations(params?: SapoListParams) {
      return request(withParams("/admin/locations.json", params));
    },
    getInventoryLevels(params?: SapoListParams) {
      return request(withParams("/admin/inventory_levels.json", params));
    },
    getInventoryItems(params?: SapoListParams) {
      return request(withParams("/admin/inventory_items.json", params));
    }
  };
}
