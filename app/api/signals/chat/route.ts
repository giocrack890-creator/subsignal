import { NextResponse } from "next/server";
import { getAnthropicClient, SCORING_MODEL } from "@/lib/claude/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as { question?: string };
  const question = body.question?.trim();

  if (!question) {
    return NextResponse.json({ error: "Pregunta requerida" }, { status: 400 });
  }

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data: signals } = await supabase
    .from("signals")
    .select("title, body, intent_score, semantic_cluster, platform")
    .eq("user_id", user.id)
    .gte("found_at", since.toISOString())
    .order("intent_score", { ascending: false })
    .limit(30);

  if (!signals?.length) {
    return NextResponse.json({
      answer: "No hay señales esta semana para analizar. Activá keywords y esperá el próximo scan.",
    });
  }

  const context = signals
    .map(
      (s, i) =>
        `${i + 1}. [${s.platform} ${s.intent_score}/10${s.semantic_cluster ? ` · ${s.semantic_cluster}` : ""}] ${s.title ?? ""}\n${(s.body ?? "").slice(0, 200)}`
    )
    .join("\n\n");

  try {
    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: SCORING_MODEL,
      max_tokens: 512,
      system:
        "Sos un analista de señales para founders SaaS. Respondé en español, conciso, con bullets si ayuda.",
      messages: [
        {
          role: "user",
          content: `Señales de la última semana:\n\n${context}\n\nPregunta del founder: ${question}`,
        },
      ],
    });

    const block = message.content.find((b) => b.type === "text");
    const answer = block?.type === "text" ? block.text : "Sin respuesta";

    return NextResponse.json({ answer });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error de IA";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
