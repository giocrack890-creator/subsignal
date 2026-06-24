import { redirect } from "next/navigation";
import { Suspense } from "react";
import { GuidedTourWrapper } from "@/components/onboarding/guided-tour-wrapper";
import { FilterBar, type SignalFilter } from "@/components/dashboard/filter-bar";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SignalsList } from "@/components/dashboard/signals-list";
import { DashboardFeedSkeleton } from "@/components/dashboard/skeletons";
import { ErrorMessage } from "@/components/ui/error-message";
import { createClient } from "@/lib/supabase/server";
import type { Plan, Signal, SignalStatus } from "@/types";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ welcome?: string; status?: string }>;
}

function parseFilter(status?: string): SignalFilter {
  const allowed: SignalFilter[] = ["all", "new", "viewed", "replied", "dismissed"];
  if (status && allowed.includes(status as SignalFilter)) {
    return status as SignalFilter;
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
  filter: SignalFilter;
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

  const [{ data: signals, error }, { count: last24hCount }, { count: keywordCount }] =
    await Promise.all([
      query,
      supabase
        .from("signals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("found_at", since24h),
      supabase
        .from("keywords")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_active", true),
    ]);

  if (error) {
    return (
      <section className="mt-10">
        <ErrorMessage
          title="No pudimos cargar las señales"
          message={error.message}
        />
      </section>
    );
  }

  const hasKeywords = (keywordCount ?? 0) > 0;

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="dash-section-title">Feed de señales</h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            {last24hCount ?? 0} señales en las últimas 24 hs
          </p>
        </div>
        <FilterBar
          basePath="/dashboard"
          current={filter}
          preserveParams={preserveParams}
        />
      </div>

      <div className="mt-6">
        <SignalsList
          signals={(signals as Signal[]) ?? []}
          hasKeywords={hasKeywords}
          plan={plan}
        />
      </div>
    </section>
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const showTour = params.welcome === "1";
  const filter = parseFilter(params.status);

  const [{ count: newCount }, { count: keywordCount }, { data: profile }] =
    await Promise.all([
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "new"),
    supabase
      .from("keywords")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true),
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
  ]);

  const plan = (profile?.plan ?? "free") as Plan;

  const preserveParams: Record<string, string> = showTour ? { welcome: "1" } : {};

  return (
    <>
      {showTour && user.id && (
        <GuidedTourWrapper userId={user.id} forceShow />
      )}

      <div className="p-6 lg:p-8">
        {showTour && (
          <div className="dash-welcome-toast mb-6">
            <span className="dash-live-dot shrink-0" aria-hidden="true" />
            ¡Listo! Tu monitoreo está configurado. Te mostramos un tour rápido.
          </div>
        )}

        <PageHeader
          title="Dashboard"
          description={
            user.email ? `Bienvenido, ${user.email}` : "Bienvenido."
          }
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <StatCard
            value={newCount ?? 0}
            label="Señales nuevas — con respuesta lista para copiar"
          />
          <StatCard
            value={keywordCount ?? 0}
            label="Keywords activas"
            accent
          />
          <StatCard value="HN" label="Plataforma activa" />
        </div>

        <Suspense fallback={<DashboardFeedSkeleton />}>
          <DashboardFeed
            userId={user.id}
            filter={filter}
            plan={plan}
            preserveParams={preserveParams}
          />
        </Suspense>
      </div>
    </>
  );
}
