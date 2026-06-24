import { NextResponse } from "next/server";
import { ingestGoogleAlert } from "@/lib/cron/process-feature-sources";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const secret = request.headers.get("x-ingest-secret");
  let body: { user_id?: string; title?: string; body?: string; url?: string; secret?: string };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const userId = body.user_id?.trim();
  const title = body.title?.trim();
  const url = body.url?.trim();
  const text = body.body?.trim() ?? "";

  if (!userId || !title || !url) {
    return NextResponse.json({ error: "user_id, title y url requeridos" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: source } = await supabase
    .from("feature_sources")
    .select("config")
    .eq("user_id", userId)
    .eq("source_type", "google_alerts")
    .eq("is_active", true)
    .maybeSingle();

  const config = (source?.config ?? {}) as { ingest_secret?: string };
  const expected = config.ingest_secret ?? process.env.GOOGLE_ALERTS_INGEST_SECRET;

  if (!expected || (secret !== expected && body.secret !== expected)) {
    return NextResponse.json({ error: "Secret inválido" }, { status: 401 });
  }

  const result = await ingestGoogleAlert({ userId, title, body: text, url });
  return NextResponse.json(result);
}
