import Link from "next/link";
import { redirect } from "next/navigation";
import { UpgradeProvider } from "@/components/billing/upgrade-provider";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { OnboardingRedirect } from "@/components/onboarding/onboarding-redirect";
import { getOnboardingStatus } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/dashboard", label: "Dashboard", tourId: "nav-dashboard" },
  { href: "/signals", label: "Señales", tourId: "nav-signals" },
  { href: "/keywords", label: "Keywords", tourId: "nav-keywords" },
  { href: "/drafts", label: "Borradores", tourId: "nav-drafts" },
  { href: "/analytics", label: "Analytics", tourId: "nav-analytics" },
  { href: "/settings", label: "Settings", tourId: "nav-settings" },
];

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

  return (
    <UpgradeProvider currentPlan={plan}>
      <div className="flex min-h-screen bg-background">
      <OnboardingRedirect isComplete={onboardingStatus.isComplete} />

      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-background-elevated/50 lg:flex">
        <div className="flex items-center gap-2 border-b border-border px-5 py-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            SS
          </span>
          <span className="font-semibold text-foreground">SubSignal</span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-tour={item.tourId}
              className="rounded-xl px-3 py-2 text-sm text-foreground-muted transition hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium text-foreground">
            {profile?.full_name ?? profile?.email ?? user.email}
          </p>
          <p className="text-xs capitalize text-foreground-muted">
            Plan {profile?.plan ?? "free"}
          </p>
          <div className="mt-2">
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <span className="font-semibold text-foreground">SubSignal</span>
          <SignOutButton />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
    </UpgradeProvider>
  );
}
