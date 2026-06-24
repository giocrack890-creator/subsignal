import { getScoreColor } from "@/components/dashboard/score-badge";
import type { SignalsPageStats } from "@/lib/signals/page-stats";
import { cn } from "@/lib/utils";

interface SignalsStatsBarProps {
  stats: SignalsPageStats;
}

function DraftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 text-[#6B6B6B]"
      aria-hidden="true"
    >
      <path
        d="M2 11.5h10M4 2.5h4l3.5 3.5V11H4V2.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8 2.5v3.5h3.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ScoreDots({ score }: { score: number }) {
  const filled = Math.round((score / 10) * 5);
  return (
    <div className="mt-2 flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            i < filled ? "bg-accent" : "bg-nivel-5"
          )}
        />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName,
  valueStyle,
  context,
  footer,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  valueStyle?: React.CSSProperties;
  context?: string;
  footer?: React.ReactNode;
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
          style={valueStyle}
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

export function SignalsStatsBar({ stats }: SignalsStatsBarProps) {
  const avgDisplay = stats.avgScore !== null ? stats.avgScore.toFixed(1) : "—";
  const avgColor =
    stats.avgScore !== null ? getScoreColor(stats.avgScore) : "#6B6B6B";
  const weekBarWidth = Math.min((stats.signalsThisWeek / 20) * 100, 100);

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 md:flex md:gap-3">
      <StatCard
        label="Esta semana"
        value={stats.signalsThisWeek}
        valueClassName={
          stats.signalsThisWeek > 0 ? "text-accent" : "text-[#6B6B6B]"
        }
        footer={
          <div className="ml-auto hidden h-1 w-16 overflow-hidden rounded-full bg-nivel-5 sm:block">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${weekBarWidth}%` }}
            />
          </div>
        }
        context={
          stats.signalsThisWeek > 0
            ? `${Math.round(weekBarWidth)}% del máximo semanal`
            : "Sin actividad esta semana"
        }
      />

      <div className="min-w-0 flex-1 rounded-[10px] border border-border-medio bg-nivel-3 px-5 py-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#6B6B6B]">
          Score promedio
        </p>
        <p
          className="mt-2 text-[28px] font-bold tabular-nums tracking-[-0.03em]"
          style={{ color: avgColor }}
        >
          {avgDisplay}
        </p>
        {stats.avgScore !== null && <ScoreDots score={stats.avgScore} />}
        <p className="mt-1.5 text-[11px] text-[#6B6B6B]">Últimos 30 días</p>
      </div>

      <StatCard
        label="Con draft listo"
        value={stats.draftsReady}
        valueClassName={
          stats.draftsReady > 0 ? "text-accent" : "text-[#6B6B6B]"
        }
        footer={
          <>
            <DraftIcon />
            {stats.draftsReady > 0 && (
              <span className="rounded bg-[rgba(52,211,153,0.1)] px-1.5 py-0.5 text-[10px] font-medium text-accent">
                listo
              </span>
            )}
          </>
        }
        context="Pendientes de copiar"
      />

      <StatCard
        label="Respondidas"
        value={stats.repliedCount}
        valueClassName="text-white"
        context={
          stats.repliedCount > 0
            ? `de ${stats.totalCount} señales en total`
            : "Marcá señales al publicar"
        }
      />
    </div>
  );
}
