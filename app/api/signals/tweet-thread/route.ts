import { NextResponse } from "next/server";
import { generateTweetThread } from "@/lib/ai/signal-enrichment";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = (await request.json()) as { signalId?: string };

  if (!body.signalId) {
    return NextResponse.json({ error: "signalId requerido" }, { status: 400 });
  }

  const { data: signal } = await supabase
    .from("signals")
    .select("id, title, body, platform, keywords(user_products(name))")
    .eq("id", body.signalId)
    .eq("user_id", user.id)
    .single();

  if (!signal) return NextResponse.json({ error: "Señal no encontrada" }, { status: 404 });

  const productName =
    (signal.keywords as { user_products?: { name: string } } | null)?.user_products?.name ??
    "tu producto";

  try {
    const tweets = await generateTweetThread({
      title: signal.title,
      body: signal.body,
      productName,
    });
    return NextResponse.json({ tweets });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
