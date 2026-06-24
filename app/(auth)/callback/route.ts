import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOnboardingStatus } from "@/lib/onboarding/status";
import { applyReferralCode } from "@/lib/referrals";
import { createClient } from "@/lib/supabase/server";

const REFERRAL_COOKIE = "tp_referral_code";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const message =
      error.message.toLowerCase().includes("provider") ||
      error.message.toLowerCase().includes("google")
        ? "google_not_enabled"
        : "auth_callback_failed";
    return NextResponse.redirect(`${origin}/login?error=${message}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const cookieStore = await cookies();
  const referralCode = cookieStore.get(REFERRAL_COOKIE)?.value;
  if (referralCode) {
    await applyReferralCode(user.id, referralCode);
    cookieStore.delete(REFERRAL_COOKIE);
  }

  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const status = await getOnboardingStatus(supabase, user.id);
  const destination = status.isComplete ? "/dashboard" : "/onboarding";

  return NextResponse.redirect(`${origin}${destination}`);
}
