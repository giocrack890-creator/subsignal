import { redirect } from "next/navigation";
import { OnboardingEntry } from "@/components/onboarding/onboarding-entry";
import { getOnboardingStatus } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";
import type { Plan, UserProduct } from "@/types";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const status = await getOnboardingStatus(supabase, user.id);

  if (status.isComplete) {
    redirect("/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, full_name, email, onboarding_survey_completed")
    .eq("id", user.id)
    .single();

  const { data: product } = await supabase
    .from("user_products")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const plan = (profile?.plan ?? "free") as Plan;
  const initialStep = status.hasProduct ? 2 : 1;
  const showSurvey = !profile?.onboarding_survey_completed;

  return (
    <OnboardingEntry
      showSurvey={showSurvey}
      product={(product as UserProduct | null) ?? null}
      productId={status.productId}
      plan={plan}
      initialStep={initialStep}
      userName={profile?.full_name ?? profile?.email ?? user.email ?? undefined}
    />
  );
}
