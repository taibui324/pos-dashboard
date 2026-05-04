import { resolveDashboardAccess, type AccountProfile } from "@/lib/domain/access";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentDashboardAccess() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return resolveDashboardAccess(null);
  }

  const { data: profile } = await supabase
    .from("account_profiles")
    .select("user_id,email,role,status,brand_id,created_by_admin")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!profile) {
    return resolveDashboardAccess(null);
  }

  return resolveDashboardAccess({
    userId: profile.user_id,
    email: profile.email,
    role: profile.role,
    status: profile.status,
    brandId: profile.brand_id,
    createdByAdmin: profile.created_by_admin
  } satisfies AccountProfile);
}
