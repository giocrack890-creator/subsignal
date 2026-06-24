import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key") ?? request.headers.get("authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return NextResponse.json({ error: "API key requerida" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const keyHash = hashApiKey(apiKey);

  const { data: keyRow } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("key_hash", keyHash)
    .maybeSingle();

  if (!keyRow) {
    return NextResponse.json({ error: "API key inválida" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const minScore = parseInt(searchParams.get("min_score") ?? "7", 10);

  const { data: signals, error } = await supabase
    .from("signals")
    .select("id, title, platform, intent_score, url, found_at, status")
    .eq("user_id", keyRow.user_id)
    .gte("intent_score", minScore)
    .order("found_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  void supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key_hash", keyHash);

  return NextResponse.json({ signals: signals ?? [] });
}
