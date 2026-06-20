import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Payments webhook — proveedor pendiente de definir" },
    { status: 501 }
  );
}
