import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import { SessionRefresh } from "@/components/auth/session-refresh";
import { UpgradeProvider } from "@/components/billing/upgrade-provider";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SignalPanelProvider } from "@/components/dashboard/signal-panel-context";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppLogo } from "@/components/brand/app-logo";
import { OnboardingRedirect } from "@/components/onboarding/onboarding-redirect";
import { OnboardingSurveyGate } from "@/components/onboarding/onboarding-survey-modal";
import { OnboardingUiProvider } from "@/components/onboarding/onboarding-ui-provider";
import { fetchOnboardingUiPreferences } from "@/lib/onboarding/preferences";
import { getOnboardingStatus } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";
import "./dashboard.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  variable: "--font-dashboard",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profileResult, onboardingStatus, onboardingUi] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, plan, onboarding_survey_completed")
      .eq("id", user.id)
      .single(),
    getOnboardingStatus(supabase, user.id),
    fetchOnboardingUiPreferences(supabase, user.id),
  ]);

  const profile = profileResult.data;
  const plan = (profile?.plan ?? "free") as Plan;
  const showOnboardingSurvey =
    onboardingStatus.isComplete && !onboardingUi.onboardingSurveyCompleted;
  const displayName =
    profile?.full_name ?? profile?.email ?? user.email ?? "Usuario";

  return (
    <UpgradeProvider currentPlan={plan}>
      <SignalPanelProvider plan={plan}>
        <OnboardingUiProvider initial={onboardingUi}>
          <SessionRefresh />
          <div
            className={`dashboard-sf ${inter.variable} flex min-h-screen bg-nivel-0 font-[family-name:var(--font-dashboard)]`}
          >
            <OnboardingRedirect isComplete={onboardingStatus.isComplete} />
            <OnboardingSurveyGate
              showSurvey={showOnboardingSurvey}
              dashboardOnly
            />

            <DashboardSidebar
              displayName={displayName}
              email={profile?.email ?? user.email ?? ""}
              plan={plan}
            />

            <div className="flex min-w-0 flex-1 flex-col bg-nivel-2">
              <header className="flex items-center justify-between border-b border-border-sutil bg-nivel-1 px-4 py-3 lg:hidden">
                <AppLogo variant="icon" size="sm" href="/dashboard" />
                <SignOutButton />
              </header>
              <main className="dash-main-content flex-1 overflow-x-hidden">{children}</main>
            </div>
          </div>
        </OnboardingUiProvider>
      </SignalPanelProvider>
    </UpgradeProvider>
  );
}
