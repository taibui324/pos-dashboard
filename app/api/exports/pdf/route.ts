import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      error: "pdf_export_unsupported",
      message: "PDF export is not supported in v1. Use the scoped CSV exports instead."
    },
    { status: 501 }
  );
}
