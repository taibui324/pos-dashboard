import { createClient } from "@supabase/supabase-js";
import { getAppEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export function createAdminClient() {
  const env = getAppEnv();

  if (!env.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations.");
  }

  return createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
