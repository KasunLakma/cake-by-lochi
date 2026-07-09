import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    message: "Local upload decommissioned. Files are processed client-side via Base64.",
  });
}
