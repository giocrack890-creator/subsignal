import { NextResponse } from "next/server";
import { applyReferralCode } from "@/lib/referrals";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = (await request.json()) as { code?: string };
  if (!body.code?.trim()) {
    return NextResponse.json({ error: "Código requerido" }, { status: 400 });
  }

  const result = await applyReferralCode(user.id, body.code);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Código aplicado" });
}
