import type { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { DashboardHomeStats } from "@/lib/dashboard/home-stats";
import type { Plan } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardStatsBarProps {
  stats: DashboardHomeStats;
  plan: Plan;
}

function StatCard({
  label,
  value,
  valueClassName,
  context,
  footer,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  context?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-[10px] border border-border-medio bg-nivel-3 px-5 py-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#6B6B6B]">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={cn(
            "text-[28px] font-bold tabular-nums tracking-[-0.03em]",
            valueClassName
          )}
        >
          {value}
        </span>
        {footer}
      </div>
      {context && (
        <p className="mt-1.5 text-[11px] text-[#6B6B6B]">{context}</p>
      )}
    </div>
  );
}

export function DashboardStatsBar({ stats, plan }: DashboardStatsBarProps) {
  const keywordPct = Math.min(
    (stats.keywordCount / stats.maxKeywords) * 100,
    100
  );
  const isFree = plan === "free";

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Señales nuevas"
        value={stats.newCount}
        valueClassName={stats.newCount > 0 ? "text-accent" : "text-[#6B6B6B]"}
        footer={
          isFree ? (
            <Lock className="h-3.5 w-3.5 text-[#6B6B6B]" aria-label="Plan Free" />
          ) : stats.draftsReady > 0 ? (
            <span className="rounded bg-[rgba(52,211,153,0.1)] px-1.5 py-0.5 text-[10px] font-medium text-accent">
              {stats.draftsReady} draft{stats.draftsReady !== 1 ? "s" : ""}
            </span>
          ) : null
        }
        context={
          isFree ? (
            <>
              Drafts en{" "}
              <Link href="/pricing" className="text-accent hover:underline">
                Starter →
              </Link>
            </>
          ) : (
            "Listas para responder"
          )
        }
      />

      <StatCard
        label="Keywords activas"
        value={stats.keywordCount}
        valueClassName="text-white"
        footer={
          <div className="ml-auto hidden h-1 w-14 overflow-hidden rounded-full bg-nivel-5 sm:block">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${keywordPct}%` }}
            />
          </div>
        }
        context={`${stats.keywordCount} de ${stats.maxKeywords} del plan`}
      />

      <StatCard
        label="Últimas 24h"
        value={stats.signalsLast24h}
        valueClassName={
          stats.signalsLast24h > 0 ? "text-accent" : "text-[#6B6B6B]"
        }
        context="Señales desde ayer"
      />

      <div className="min-w-0 flex-1 rounded-[10px] border border-border-medio bg-nivel-3 px-5 py-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#6B6B6B]">
          Plataforma
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          <span className="text-[28px] font-bold tracking-[-0.03em] text-white">
            HN
          </span>
        </div>
        <p className="mt-1.5 text-[11px] text-[#6B6B6B]">
          {isFree ? "Reddit y X en planes de pago" : "HN y Reddit activos"}
        </p>
      </div>
    </div>
  );
}
