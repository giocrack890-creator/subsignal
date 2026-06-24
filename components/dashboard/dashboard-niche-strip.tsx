import Link from "next/link";
import type { NicheWeekInsight } from "@/lib/dashboard/niche-week";

interface DashboardNicheStripProps {
  insights: NicheWeekInsight[];
}

export function DashboardNicheStrip({ insights }: DashboardNicheStripProps) {
  if (insights.length === 0) return null;

  const top = insights[0];

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-sutil bg-nivel-3/60 px-4 py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#B4B4B4]">
        <span className="font-medium text-accent">Esta semana</span>
        <span className="text-[#4B4B4B]">·</span>
        <span>
          {top.count} sobre &apos;{top.term}&apos;
          {top.hasHighIntent && (
            <span className="ml-1.5 text-accent">alta intención</span>
          )}
        </span>
        {insights.length > 1 && (
          <>
            <span className="text-[#4B4B4B]">·</span>
            <span className="text-[#6B6B6B]">
              +{insights.length - 1} keyword{insights.length > 2 ? "s" : ""} más
            </span>
          </>
        )}
      </div>
      <Link
        href="/signals"
        className="shrink-0 text-[11px] font-medium text-accent hover:underline"
      >
        Ver señales →
      </Link>
    </div>
  );
}
