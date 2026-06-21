import { NextResponse } from "next/server";
import { getOnboardingStatus } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";

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

  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const status = await getOnboardingStatus(supabase, user.id);
  const destination = status.isComplete ? "/dashboard" : "/onboarding";

  return NextResponse.redirect(`${origin}${destination}`);
}
