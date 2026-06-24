import Link from "next/link";
import { SignalListCard } from "@/components/signals/signal-list-card";
import { SignalsEmptyState } from "@/components/signals/signals-empty-state";
import type { SignalsEmptyContext } from "@/lib/signals/page-stats";
import type { Plan, Signal, SignalStatus } from "@/types";
import { cn } from "@/lib/utils";

export type DashboardSignalFilter = "all" | SignalStatus;

const FILTERS: { value: DashboardSignalFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "new", label: "Nuevas" },
  { value: "replied", label: "Respondidas" },
  { value: "dismissed", label: "Descartadas" },
];

interface DashboardHomeFeedProps {
  signals: Signal[];
  plan: Plan;
  hasKeywords: boolean;
  filter: DashboardSignalFilter;
  basePath?: string;
  preserveParams?: Record<string, string>;
  last24hCount: number;
  emptyContext: SignalsEmptyContext;
}

export function DashboardHomeFeed({
  signals,
  plan,
  hasKeywords,
  filter,
  basePath = "/dashboard",
  preserveParams = {},
  last24hCount,
  emptyContext,
}: DashboardHomeFeedProps) {
  const preview = signals.slice(0, 6);

  function buildHref(status: DashboardSignalFilter) {
    const params = new URLSearchParams(preserveParams);
    if (status === "all") params.delete("status");
    else params.set("status", status);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-white">
            Señales recientes
          </h2>
          <p className="mt-0.5 text-[12px] text-[#6B6B6B]">
            {last24hCount} en las últimas 24 hs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {FILTERS.map((tab) => (
            <Link
              key={tab.value}
              href={buildHref(tab.value)}
              className={cn(
                "rounded-md px-2 py-1 text-[12px] transition-colors duration-100",
                filter === tab.value
                  ? "bg-[rgba(52,211,153,0.12)] font-medium text-accent"
                  : "text-[#6B6B6B] hover:bg-nivel-4 hover:text-[#B4B4B4]"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {!hasKeywords ? (
          <SignalsEmptyState context={emptyContext} variant="no-signals" />
        ) : preview.length === 0 ? (
          <SignalsEmptyState context={emptyContext} variant="no-signals" />
        ) : (
          <>
            <ul className="space-y-2">
              {preview.map((signal, index) => (
                <li key={signal.id}>
                  <SignalListCard
                    signal={signal}
                    plan={plan}
                    view="list"
                    animationDelay={Math.min(index * 40, 200)}
                  />
                </li>
              ))}
            </ul>

            {signals.length > 6 && (
              <div className="mt-4 text-center">
                <Link
                  href="/signals"
                  className="text-[12px] font-medium text-accent hover:underline"
                >
                  Ver todas las señales ({signals.length}) →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
