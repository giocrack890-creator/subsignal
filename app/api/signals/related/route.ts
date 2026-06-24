import { NextResponse, type NextRequest } from "next/server";
import { fetchRelatedSignals } from "@/lib/signals/related";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const signalId = request.nextUrl.searchParams.get("signalId");
  if (!signalId) {
    return NextResponse.json({ error: "signalId requerido" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: signal } = await supabase
    .from("signals")
    .select("id, keyword_id")
    .eq("id", signalId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!signal) {
    return NextResponse.json({ signals: [] });
  }

  const related = await fetchRelatedSignals(supabase, user.id, signal);
  return NextResponse.json({ signals: related });
}
