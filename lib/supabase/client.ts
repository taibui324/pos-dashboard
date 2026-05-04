import { createBrowserClient } from "@supabase/ssr";
import { getAppEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export function createClient() {
  const env = getAppEnv();
  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
