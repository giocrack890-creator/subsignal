import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import { UpgradeProvider } from "@/components/billing/upgrade-provider";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { OnboardingRedirect } from "@/components/onboarding/onboarding-redirect";
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

  const [profileResult, onboardingStatus] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, plan")
      .eq("id", user.id)
      .single(),
    getOnboardingStatus(supabase, user.id),
  ]);

  const profile = profileResult.data;
  const plan = (profile?.plan ?? "free") as Plan;
  const displayName =
    profile?.full_name ?? profile?.email ?? user.email ?? "Usuario";

  return (
    <UpgradeProvider currentPlan={plan}>
      <div
        className={`dashboard-sf ${inter.variable} flex min-h-screen bg-background font-[family-name:var(--font-dashboard)]`}
      >
        <OnboardingRedirect isComplete={onboardingStatus.isComplete} />

        <DashboardSidebar displayName={displayName} plan={plan} />

        <div className="flex flex-1 flex-col min-w-0">
          <header className="flex items-center justify-between border-b border-border bg-background-elevated/50 px-4 py-3 backdrop-blur-md lg:hidden">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-black text-primary-foreground">
                SS
              </span>
              <span className="font-bold tracking-tight text-foreground">
                SubSignal
              </span>
            </div>
            <SignOutButton />
          </header>
          <main className="dash-main-content flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </UpgradeProvider>
  );
}
