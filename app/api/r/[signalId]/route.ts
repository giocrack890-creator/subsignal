import { NextResponse } from "next/server";
import { recordSignalClick } from "@/lib/conversions/track";
import { checkConversionTracking } from "@/lib/payments/checks";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ signalId: string }> }
) {
  const { signalId } = await params;
  const supabase = createAdminClient();

  const { data: signal } = await supabase
    .from("signals")
    .select("id, user_id, url")
    .eq("id", signalId)
    .maybeSingle();

  if (!signal?.url) {
    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", signal.user_id)
    .maybeSingle();

  const plan = (profile?.plan ?? "free") as Plan;
  if (!checkConversionTracking({ plan }).allowed) {
    return NextResponse.redirect(signal.url, { status: 302 });
  }

  const targetUrl = await recordSignalClick(signalId);
  if (!targetUrl) {
    return NextResponse.redirect(signal.url, { status: 302 });
  }

  return NextResponse.redirect(targetUrl, { status: 302 });
}
