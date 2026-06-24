import { redirect } from "next/navigation";
import { Suspense } from "react";
import { GuidedTourWrapper } from "@/components/onboarding/guided-tour-wrapper";
import { DashboardHomeHeader } from "@/components/dashboard/dashboard-home-header";
import { DashboardHomeActions } from "@/components/dashboard/dashboard-home-actions";
import { DashboardStatsBar } from "@/components/dashboard/dashboard-stats-bar";
import { DashboardNicheStrip } from "@/components/dashboard/dashboard-niche-strip";
import {
  DashboardHomeFeed,
  type DashboardSignalFilter,
} from "@/components/dashboard/dashboard-home-feed";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { DashboardFeedSkeleton } from "@/components/dashboard/skeletons";
import { UpgradeTopBanner } from "@/components/dashboard/upgrade-top-banner";
import { SetupProgress } from "@/components/dashboard/SetupProgress";
import { PushNotificationBanner } from "@/components/dashboard/push-notification-banner";
import { ErrorMessage } from "@/components/ui/error-message";
import { createClient } from "@/lib/supabase/server";
import { fetchDashboardHomeStats } from "@/lib/dashboard/home-stats";
import { fetchNicheWeekInsights } from "@/lib/dashboard/niche-week";
import { fetchSignalsEmptyContext } from "@/lib/signals/page-stats";
import { fetchOnboardingUiPreferences } from "@/lib/onboarding/preferences";
import { syncSetupProgress } from "@/lib/setup/progress";
import type { Plan, Signal, SignalStatus } from "@/types";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ welcome?: string; status?: string }>;
}

function parseFilter(status?: string): DashboardSignalFilter {
  const allowed: DashboardSignalFilter[] = [
    "all",
    "new",
    "replied",
    "dismissed",
  ];
  if (status && allowed.includes(status as DashboardSignalFilter)) {
    return status as DashboardSignalFilter;
  }
  return "all";
}

async function DashboardFeed({
  userId,
  filter,
  plan,
  preserveParams = {},
}: {
  userId: string;
  filter: DashboardSignalFilter;
  plan: Plan;
  preserveParams?: Record<string, string>;
}) {
  const supabase = await createClient();

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("signals")
    .select("*")
    .eq("user_id", userId)
    .order("found_at", { ascending: false })
    .limit(20);

  if (filter !== "all") {
    query = query.eq("status", filter as SignalStatus);
  }

  const [{ data: signals, error }, { count: last24hCount }, emptyContext] =
    await Promise.all([
      query,
      supabase
        .from("signals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("found_at", since24h),
      fetchSignalsEmptyContext(supabase, userId, plan),
    ]);

  if (error) {
    return (
      <ErrorMessage
        title="No pudimos cargar las señales"
        message={error.message}
      />
    );
  }

  const hasKeywords = emptyContext.activeKeywords > 0;

  return (
    <DashboardHomeFeed
      signals={(signals as Signal[]) ?? []}
      plan={plan}
      hasKeywords={hasKeywords}
      filter={filter}
      preserveParams={preserveParams}
      last24hCount={last24hCount ?? 0}
      emptyContext={emptyContext}
    />
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const filter = parseFilter(params.status);

  const [
    { data: profile },
    setupState,
    nicheInsights,
    onboardingUi,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("plan, full_name, email")
      .eq("id", user.id)
      .single(),
    syncSetupProgress(supabase, user.id),
    fetchNicheWeekInsights(supabase, user.id),
    fetchOnboardingUiPreferences(supabase, user.id),
  ]);

  const plan = (profile?.plan ?? "free") as Plan;
  const showTour =
    params.welcome === "1" && !onboardingUi.guidedTourCompleted;
  const homeStats = await fetchDashboardHomeStats(supabase, user.id, plan);
  const displayName =
    profile?.full_name ?? profile?.email ?? user.email ?? "Usuario";
  const preserveParams: Record<string, string> = showTour ? { welcome: "1" } : {};

  return (
    <>
      {showTour && (
        <GuidedTourWrapper
          forceShow
          tourCompleted={onboardingUi.guidedTourCompleted}
        />
      )}

      <div className="p-6 lg:p-8">
        <UpgradeTopBanner plan={plan} />
        <PushNotificationBanner />

        {showTour && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-border-activo bg-[rgba(52,211,153,0.06)] px-3 py-2 text-[12px] text-[#B4B4B4]">
            <span className="dash-live-dot shrink-0" aria-hidden="true" />
            ¡Listo! Tu monitoreo está configurado. Te mostramos un tour rápido.
          </div>
        )}

        <DashboardHomeHeader
          displayName={displayName}
          keywordCount={homeStats.keywordCount}
          totalSignals={homeStats.totalSignals}
          plan={plan}
        />

        <DashboardHomeActions plan={plan} newCount={homeStats.newCount} />

        <DashboardStatsBar stats={homeStats} plan={plan} />

        <SetupProgress state={setupState} />
        <DashboardNicheStrip insights={nicheInsights} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_240px]">
          <Suspense fallback={<DashboardFeedSkeleton />}>
            <DashboardFeed
              userId={user.id}
              filter={filter}
              plan={plan}
              preserveParams={preserveParams}
            />
          </Suspense>

          <DashboardQuickActions
            plan={plan}
            keywordCount={homeStats.keywordCount}
            newCount={homeStats.newCount}
          />
        </div>
      </div>
    </>
  );
}
