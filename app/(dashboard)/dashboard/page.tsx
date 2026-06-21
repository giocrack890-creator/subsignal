import { redirect } from "next/navigation";
import { Suspense } from "react";
import { GuidedTourWrapper } from "@/components/onboarding/guided-tour-wrapper";
import { FilterBar, type SignalFilter } from "@/components/dashboard/filter-bar";
import { SignalsList } from "@/components/dashboard/signals-list";
import { DashboardFeedSkeleton } from "@/components/dashboard/skeletons";
import { ErrorMessage } from "@/components/ui/error-message";
import { createClient } from "@/lib/supabase/server";
import type { Signal, SignalStatus } from "@/types";

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
  preserveParams = {},
}: {
  userId: string;
  filter: SignalFilter;
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
          <h2 className="text-lg font-semibold text-foreground">Feed de señales</h2>
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

  const [{ count: newCount }, { count: keywordCount }] = await Promise.all([
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
  ]);

  const preserveParams: Record<string, string> = showTour ? { welcome: "1" } : {};

  return (
    <>
      {showTour && user.id && (
        <GuidedTourWrapper userId={user.id} forceShow />
      )}

      <div className="p-6 lg:p-8">
        {showTour && (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-primary-muted-bg px-4 py-3 text-sm text-primary">
            ¡Listo! Tu monitoreo está configurado. Te mostramos un tour rápido.
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          Bienvenido{user.email ? `, ${user.email}` : ""}.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="bento-card rounded-2xl p-5">
            <p className="text-3xl font-bold text-foreground">{newCount ?? 0}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
              Señales nuevas
            </p>
          </div>
          <div className="bento-card rounded-2xl p-5">
            <p className="text-3xl font-bold text-primary">{keywordCount ?? 0}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
              Keywords activas
            </p>
          </div>
          <div className="bento-card rounded-2xl p-5">
            <p className="text-3xl font-bold text-foreground">HN</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
              Plataforma activa
            </p>
          </div>
        </div>

        <Suspense fallback={<DashboardFeedSkeleton />}>
          <DashboardFeed
            userId={user.id}
            filter={filter}
            preserveParams={preserveParams}
          />
        </Suspense>
      </div>
    </>
  );
}
