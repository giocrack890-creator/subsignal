import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Twitter monitor — pendiente de definir método de fetch" },
    { status: 501 }
  );
}
