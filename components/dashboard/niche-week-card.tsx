import Link from "next/link";
import type { NicheWeekInsight } from "@/lib/dashboard/niche-week";

interface NicheWeekCardProps {
  insights: NicheWeekInsight[];
}

export function NicheWeekCard({ insights }: NicheWeekCardProps) {
  if (insights.length === 0) return null;

  return (
    <section className="mb-6 rounded-xl border border-[rgba(52,211,153,0.15)] bg-[#0D1A11] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#34D399]">Esta semana en tu nicho</p>
        <span className="rounded-full bg-[#111714] px-2 py-0.5 text-[10px] text-[#6B6B6B]">
          Últimos 7 días
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {insights.map((insight) => (
          <li
            key={insight.keywordId}
            className="flex flex-wrap items-center gap-2 text-sm text-[#B4B4B4]"
          >
            <span aria-hidden="true">🔍</span>
            <span>
              {insight.count} personas preguntaron sobre &apos;{insight.term}&apos;
            </span>
            {insight.hasHighIntent && (
              <span className="rounded-full bg-[rgba(52,211,153,0.12)] px-2 py-0.5 text-[10px] font-medium text-[#34D399]">
                🔥 Alta intención
              </span>
            )}
          </li>
        ))}
      </ul>

      <Link
        href="/signals"
        className="mt-4 inline-block text-sm font-medium text-[#34D399] hover:underline"
      >
        Ver todas las señales →
      </Link>
    </section>
  );
}
