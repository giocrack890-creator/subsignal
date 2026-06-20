import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Hacker News monitor — PASO 4" },
    { status: 501 }
  );
}
