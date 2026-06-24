import { NextResponse } from "next/server";
import { ensureReferralCode } from "@/lib/referrals";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/auth/urls";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const code = await ensureReferralCode(user.id);
  const base = getAppUrl().replace(/\/$/, "");

  const { count } = await supabase
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("referrer_id", user.id);

  return NextResponse.json({
    code,
    link: `${base}/signup?ref=${code}`,
    referrals: count ?? 0,
    reward: "1 mes Pro por cada founder que se registre",
  });
}
