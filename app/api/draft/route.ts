import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Draft endpoint — PASO 5" },
    { status: 501 }
  );
}
