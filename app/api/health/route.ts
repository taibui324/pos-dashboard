import { NextResponse } from "next/server";
import { hasLiveSupabaseEnv } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    mode: hasLiveSupabaseEnv() ? "supabase" : "mock",
    timestamp: new Date().toISOString()
  });
}
