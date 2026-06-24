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

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data: signals } = await supabase
    .from("signals")
    .select("title, platform, intent_score, status, found_at, semantic_cluster")
    .eq("user_id", user.id)
    .gte("found_at", since.toISOString())
    .order("intent_score", { ascending: false })
    .limit(50);

  const rows = signals ?? [];
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>ThreadPulse — Standup semanal</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; color: #111; }
    h1 { font-size: 1.5rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; font-size: 0.85rem; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .meta { color: #666; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>ThreadPulse — Standup semanal</h1>
  <p class="meta">${rows.length} señales · ${since.toLocaleDateString("es-AR")} — ${new Date().toLocaleDateString("es-AR")}</p>
  <table>
    <thead><tr><th>Score</th><th>Plataforma</th><th>Título</th><th>Estado</th><th>Tema</th></tr></thead>
    <tbody>
      ${rows
        .map(
          (s) =>
            `<tr><td>${s.intent_score ?? "—"}</td><td>${s.platform}</td><td>${(s.title ?? "").replace(/</g, "&lt;")}</td><td>${s.status}</td><td>${s.semantic_cluster ?? "—"}</td></tr>`
        )
        .join("")}
    </tbody>
  </table>
  <p class="meta" style="margin-top:2rem">Imprimí esta página como PDF (Cmd+P → Guardar como PDF)</p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'inline; filename="threadpulse-standup.html"',
    },
  });
}
