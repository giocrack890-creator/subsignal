import { NextResponse } from "next/server";
import { generateDraftForSignal } from "@/lib/drafts";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";

interface DraftRequestBody {
  signalId?: string;
  regenerate?: boolean;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: DraftRequestBody;
  try {
    body = (await request.json()) as DraftRequestBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const signalId = body.signalId?.trim();
  if (!signalId) {
    return NextResponse.json({ error: "Falta signalId" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;

  const result = await generateDraftForSignal({
    signalId,
    userId: user.id,
    plan,
    regenerate: body.regenerate === true,
  });

  if (!result.success) {
    const status = result.limitReached ? 403 : 400;
    return NextResponse.json(
      { error: result.error, limitReached: result.limitReached ?? false },
      { status }
    );
  }

  return NextResponse.json({ draft: result.draft, signalId });
}
