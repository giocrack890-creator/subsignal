import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Webhook compatible con Zapier / Make — recibe eventos y reenvía a zapier_webhook_url del usuario */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const payload = await request.json();

  const { data: profile } = await supabase
    .from("profiles")
    .select("zapier_webhook_url, api_webhook_url")
    .eq("id", user.id)
    .single();

  const target = profile?.zapier_webhook_url ?? profile?.api_webhook_url;
  if (!target) {
    return NextResponse.json(
      { error: "Configurá tu webhook de Zapier/Make en Settings → Integraciones" },
      { status: 400 }
    );
  }

  const res = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "threadpulse",
      user_id: user.id,
      timestamp: new Date().toISOString(),
      ...((typeof payload === "object" && payload) || {}),
    }),
  });

  return NextResponse.json({ ok: res.ok, status: res.status });
}
