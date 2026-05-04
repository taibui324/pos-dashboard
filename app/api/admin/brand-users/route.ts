import { NextResponse, type NextRequest } from "next/server";
import { getAppEnv } from "@/lib/env";
import { inviteBrandUserAccount, normalizeBrandUserInviteInput } from "@/lib/services/account-management";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const env = getAppEnv();

  try {
    const normalized = normalizeBrandUserInviteInput(body);

    if (!env.supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          error: "supabase_admin_not_configured",
          previewUser: {
            ...normalized,
            role: "brand_user",
            status: "invited"
          }
        },
        { status: 501 }
      );
    }

    const user = await inviteBrandUserAccount(normalized, `${env.appUrl}/auth/callback?next=/`);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid request"
      },
      { status: 400 }
    );
  }
}
