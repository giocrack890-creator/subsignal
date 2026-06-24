import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import type { FeatureSourceConfig, FeatureSourceType } from "@/lib/sources";

const VALID_TYPES: FeatureSourceType[] = [
  "google_alerts",
  "rss",
  "github",
  "app_store",
  "slack_community",
  "devto",
  "medium",
];

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data, error } = await supabase
    .from("feature_sources")
    .select("*")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sources: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = (await request.json()) as {
    source_type?: FeatureSourceType;
    config?: FeatureSourceConfig;
    is_active?: boolean;
  };

  if (!body.source_type || !VALID_TYPES.includes(body.source_type)) {
    return NextResponse.json({ error: "source_type inválido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("feature_sources")
    .upsert(
      {
        user_id: user.id,
        source_type: body.source_type,
        config: (body.config ?? {}) as Json,
        is_active: body.is_active ?? true,
      },
      { onConflict: "user_id,source_type" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ source: data });
}
