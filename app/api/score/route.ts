import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Scoring endpoint — PASO 4" },
    { status: 501 }
  );
}
