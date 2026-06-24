import { NextResponse } from "next/server";
import { processSignals } from "@/lib/cron/process-signals";
import { createClient } from "@/lib/supabase/server";

/** Escaneo manual para el usuario logueado (máx. 1 cada 5 min por sesión server-side) */
const COOLDOWN_MS = 5 * 60 * 1000;
let lastManualRunAt = 0;

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = Date.now();
  if (now - lastManualRunAt < COOLDOWN_MS) {
    const waitSec = Math.ceil((COOLDOWN_MS - (now - lastManualRunAt)) / 1000);
    return NextResponse.json(
      { error: `Esperá ${waitSec}s antes de escanear de nuevo` },
      { status: 429 }
    );
  }

  lastManualRunAt = now;

  try {
    const result = await processSignals();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
