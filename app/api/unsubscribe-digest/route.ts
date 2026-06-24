import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  }

  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({ weekly_digest: false })
    .eq("id", userId);

  return new NextResponse(
    "<html><body style='font-family:sans-serif;padding:24px;'><h1>Suscripción cancelada</h1><p>Ya no recibirás el resumen semanal de SubSignal.</p></body></html>",
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
