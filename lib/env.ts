const FALLBACK_SUPABASE_URL = "https://example.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "demo-anon-key";

export type AppEnv = {
  appUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string | null;
  sapoApiKey: string | null;
  sapoApiSecret: string | null;
  sapoOAuthScopes: string[];
  sapoStoreUrl: string | null;
  sapoAccessToken: string | null;
  sapoWebhookSecret: string | null;
};

export function getAppEnv(): AppEnv {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? FALLBACK_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? null,
    sapoApiKey: process.env.SAPO_API_KEY ?? null,
    sapoApiSecret: process.env.SAPO_API_SECRET ?? null,
    sapoOAuthScopes: (process.env.SAPO_OAUTH_SCOPES ?? "read_orders,read_products")
      .split(",")
      .map((scope) => scope.trim())
      .filter(Boolean),
    sapoStoreUrl: process.env.SAPO_STORE_URL ?? null,
    sapoAccessToken: process.env.SAPO_ACCESS_TOKEN ?? null,
    sapoWebhookSecret: process.env.SAPO_WEBHOOK_SECRET ?? null
  };
}

export function hasLiveSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
