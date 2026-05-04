import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const brandUserInviteInputSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  displayName: z.string().trim().min(1),
  brandId: z.string().trim().min(1, "A Brand User Account must be assigned to exactly one brand.")
});

export type BrandUserInviteInput = z.input<typeof brandUserInviteInputSchema>;
export type NormalizedBrandUserInviteInput = z.output<typeof brandUserInviteInputSchema>;

export function normalizeBrandUserInviteInput(input: BrandUserInviteInput): NormalizedBrandUserInviteInput {
  const parsed = brandUserInviteInputSchema.safeParse(input);

  if (!parsed.success) {
    const brandIssue = parsed.error.issues.find((issue) => issue.path.includes("brandId"));
    if (brandIssue) {
      throw new Error("A Brand User Account must be assigned to exactly one brand.");
    }

    throw new Error(parsed.error.issues[0]?.message ?? "Invalid Brand User Account input.");
  }

  return parsed.data;
}

export async function inviteBrandUserAccount(input: BrandUserInviteInput, redirectTo: string) {
  const normalized = normalizeBrandUserInviteInput(input);
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(normalized.email, {
    data: {
      display_name: normalized.displayName,
      role: "brand_user",
      brand_id: normalized.brandId
    },
    redirectTo
  });

  if (error) {
    throw error;
  }

  return data.user;
}
