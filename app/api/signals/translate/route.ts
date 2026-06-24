import { NextResponse } from "next/server";
import { translateSignalText } from "@/lib/ai/signal-enrichment";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = (await request.json()) as {
    signalId?: string;
    targetLanguage?: "es" | "en";
  };

  if (!body.signalId) {
    return NextResponse.json({ error: "signalId requerido" }, { status: 400 });
  }

  const { data: signal } = await supabase
    .from("signals")
    .select("id, title, body")
    .eq("id", body.signalId)
    .eq("user_id", user.id)
    .single();

  if (!signal) return NextResponse.json({ error: "Señal no encontrada" }, { status: 404 });

  try {
    const translated = await translateSignalText({
      title: signal.title,
      body: signal.body,
      targetLanguage: body.targetLanguage,
    });

    await supabase
      .from("signals")
      .update({
        translated_title: translated.title,
        translated_body: translated.body,
      })
      .eq("id", signal.id);

    return NextResponse.json({ translated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
