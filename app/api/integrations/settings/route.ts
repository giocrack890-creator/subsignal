import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("zapier_webhook_url, api_webhook_url")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? {});
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = (await request.json()) as {
    zapier_webhook_url?: string;
    api_webhook_url?: string;
  };

  const update: { zapier_webhook_url?: string | null; api_webhook_url?: string | null } = {};

  if (body.zapier_webhook_url !== undefined) {
    update.zapier_webhook_url = body.zapier_webhook_url.trim() || null;
  }
  if (body.api_webhook_url !== undefined) {
    update.api_webhook_url = body.api_webhook_url.trim() || null;
  }

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
