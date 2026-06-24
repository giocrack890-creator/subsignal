import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignalCard } from "@/components/dashboard/signal-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { SignalsToolbar } from "@/components/dashboard/signals-toolbar";
import { LoadMoreSignals } from "@/components/dashboard/load-more-signals";
import { DashboardFeedSkeleton } from "@/components/dashboard/skeletons";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";
import {
  fetchSignals,
  parseSignalsQuery,
  type SignalsSearchParams,
} from "@/lib/signals/query";

export const dynamic = "force-dynamic";

interface SignalsPageProps {
  searchParams: Promise<SignalsSearchParams>;
}

async function SignalsContent({
  userId,
  plan,
  params,
}: {
  userId: string;
  plan: Plan;
  params: SignalsSearchParams;
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
  };

  if (error) {
    return (
      <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-sm text-destructive">
        No pudimos cargar las señales: {error}
      </div>
    );
  }

  const hasMore = total > parsed.limit;

  if (signals.length === 0 && parsed.hasActiveFilters) {
    return (
      <>
        <SignalsToolbar className="mt-8" />
        <EmptyState
          className="mt-6"
          variant="radar"
          title="No hay señales que coincidan"
          description="Probá con otros filtros o limpiá la búsqueda para ver todo tu historial."
          action={{ label: "Limpiar filtros", href: "/signals" }}
        />
      </>
    );
  }

  if (signals.length === 0) {
    return (
      <>
        <SignalsToolbar className="mt-8" />
        <EmptyState
          className="mt-6"
          variant="radar"
          title="Todavía no hay señales"
          description="Cuando el monitor detecte conversaciones con intención de compra, van a aparecer acá con todo el historial."
        />
      </>
    );
  }

  return (
    <>
      <SignalsToolbar className="mt-8" />
      <ul className="dash-timeline mt-6 space-y-4">
        {signals.map((signal) => (
          <li key={signal.id} className="dash-timeline-item">
            <SignalCard signal={signal} plan={plan} />
          </li>
        ))}
      </ul>
      <LoadMoreSignals
        currentPage={parsed.page}
        hasMore={hasMore}
        baseParams={baseParams}
      />
    </>
  );
}

export default async function SignalsPage({ searchParams }: SignalsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;

  const [{ count: totalCount }, { data: profile }] = await Promise.all([
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
  ]);

  const plan = (profile?.plan ?? "free") as Plan;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Señales encontradas"
        description="Respondé en 30 segundos — cada señal puede incluir un borrador listo para copiar."
        aside={
          <p className="text-sm text-foreground-muted">
            <span className="font-bold text-foreground">{totalCount ?? 0}</span> en
            total
          </p>
        }
      />

      <Suspense fallback={<DashboardFeedSkeleton />}>
        <SignalsContent userId={user.id} plan={plan} params={params} />
      </Suspense>
    </div>
  );
}
