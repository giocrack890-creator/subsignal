import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignalHighlightHandler } from "@/components/dashboard/signal-highlight-handler";
import { FirstTimeTooltip } from "@/components/ui/FirstTimeTooltip";
import { SignalsFeed } from "@/components/signals/signals-feed";
import { SignalsHeader } from "@/components/signals/signals-header";
import { SignalsSkeleton } from "@/components/signals/signals-skeleton";
import { SignalsStatsBar } from "@/components/signals/signals-stats-bar";
import {
  fetchSignalsEmptyContext,
  fetchSignalsPageStats,
} from "@/lib/signals/page-stats";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";
import {
  fetchSignals,
  parseSignalsQuery,
  type SignalsSearchParams,
} from "@/lib/signals/query";
import "@/components/signals/signals-page.css";

export const dynamic = "force-dynamic";

interface SignalsPageProps {
  searchParams: Promise<SignalsSearchParams>;
}

async function SignalsFeedLoader({
  userId,
  plan,
  params,
  emptyContext,
}: {
  userId: string;
  plan: Plan;
  params: SignalsSearchParams;
  emptyContext: Awaited<ReturnType<typeof fetchSignalsEmptyContext>>;
}) {
  const supabase = await createClient();
  const parsed = parseSignalsQuery(params);
  const { signals, total, error } = await fetchSignals(supabase, userId, parsed);

  const baseParams = {
    status: parsed.status !== "all" ? parsed.status : undefined,
    platform: parsed.platform !== "all" ? parsed.platform : undefined,
    minScore: parsed.minScore !== null ? String(parsed.minScore) : undefined,
    draft: parsed.draft !== "all" ? parsed.draft : undefined,
    q: parsed.q || undefined,
    sort: parsed.sort !== "date" ? parsed.sort : undefined,
    buyers: parsed.buyersOnly ? "1" : undefined,
    cluster: parsed.clusterOnly ? "1" : undefined,
    focus: parsed.focusMode ? "1" : undefined,
  };

  return (
    <SignalsFeed
      signals={signals}
      total={total}
      hasActiveFilters={parsed.hasActiveFilters}
      hasMore={total > parsed.limit}
      currentPage={parsed.page}
      baseParams={baseParams}
      plan={plan}
      emptyContext={emptyContext}
      error={error}
    />
  );
}

export default async function SignalsPage({ searchParams }: SignalsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;

  const [{ data: profile }, stats] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    fetchSignalsPageStats(supabase, user.id),
  ]);

  const plan = (profile?.plan ?? "free") as Plan;
  const emptyContext = await fetchSignalsEmptyContext(supabase, user.id, plan);

  return (
    <div className="p-6 lg:p-8">
      <Suspense fallback={null}>
        <SignalHighlightHandler />
      </Suspense>

      <FirstTimeTooltip
        id="signals_page"
        content="Acá ves todo tu historial. Hacé click en una señal para abrir el panel lateral con el draft y acciones."
        position="bottom"
      >
        <SignalsHeader totalCount={stats.totalCount} />
      </FirstTimeTooltip>

      <SignalsStatsBar stats={stats} />

      <Suspense fallback={<SignalsSkeleton />}>
        <SignalsFeedLoader
          userId={user.id}
          plan={plan}
          params={params}
          emptyContext={emptyContext}
        />
      </Suspense>
    </div>
  );
}
