import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Reddit monitor — pendiente de definir método de fetch" },
    { status: 501 }
  );
}
