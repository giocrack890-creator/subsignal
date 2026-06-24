import { getScoreColor } from "@/components/dashboard/score-badge";
import type { SignalsPageStats } from "@/lib/signals/page-stats";
import { cn } from "@/lib/utils";

interface SignalsStatsBarProps {
  stats: SignalsPageStats;
}

function StatCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex-1 rounded-xl border border-[#1E1E1E] bg-[#111714] px-[18px] py-[14px]"
      style={{ minWidth: 0 }}
    >
      <p className="text-xs uppercase tracking-[0.05em] text-[#6B6B6B]">{label}</p>
      <div className="mt-1.5 flex items-center gap-1.5">{children}</div>
    </div>
  );
}

export function SignalsStatsBar({ stats }: SignalsStatsBarProps) {
  const avgDisplay =
    stats.avgScore !== null ? stats.avgScore.toFixed(1) : "—";
  const avgColor =
    stats.avgScore !== null ? getScoreColor(stats.avgScore) : "#6B6B6B";

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 md:flex md:gap-3">
      <StatCard label="Esta semana">
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            stats.signalsThisWeek > 0 ? "text-[#34D399]" : "text-[#6B6B6B]"
          )}
        >
          {stats.signalsThisWeek}
        </span>
      </StatCard>

      <StatCard label="Score promedio">
        <span className="text-2xl font-bold tabular-nums" style={{ color: avgColor }}>
          {avgDisplay}
        </span>
      </StatCard>

      <StatCard label="Con draft listo">
        <span className="text-base" aria-hidden="true">
          ✍️
        </span>
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            stats.draftsReady > 0 ? "text-[#34D399]" : "text-[#6B6B6B]"
          )}
        >
          {stats.draftsReady}
        </span>
      </StatCard>

      <StatCard label="Respondidas">
        <span className="text-base text-[#34D399]" aria-hidden="true">
          ✓
        </span>
        <span className="text-2xl font-bold tabular-nums text-white">
          {stats.repliedCount}
        </span>
      </StatCard>
    </div>
  );
}
