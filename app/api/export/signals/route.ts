import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: signals, error } = await supabase
    .from("signals")
    .select(
      "id, title, platform, intent_score, status, found_at, semantic_cluster, is_buyer_intent, hot_score, is_lead, lead_stage, converted"
    )
    .eq("user_id", user.id)
    .order("found_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = [
    "id",
    "title",
    "platform",
    "intent_score",
    "status",
    "found_at",
    "semantic_cluster",
    "is_buyer_intent",
    "hot_score",
    "is_lead",
    "lead_stage",
    "converted",
  ].join(",");

  const rows = (signals ?? []).map((s) =>
    [
      s.id,
      `"${(s.title ?? "").replace(/"/g, '""')}"`,
      s.platform,
      s.intent_score,
      s.status,
      s.found_at,
      s.semantic_cluster ?? "",
      s.is_buyer_intent,
      s.hot_score ?? "",
      s.is_lead,
      s.lead_stage ?? "",
      s.converted,
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="threadpulse-signals.csv"',
    },
  });
}
