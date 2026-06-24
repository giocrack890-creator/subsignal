"use client";

import { useMemo, useState } from "react";
import { ArrowUp } from "lucide-react";
import type { KeywordPerformance } from "@/lib/keywords/performance";
import { ScoreBadge } from "@/components/dashboard/score-badge";

type Period = "7d" | "30d";
type SortKey = "signals" | "score" | "created";

interface KeywordsPerformanceTableProps {
  rows: KeywordPerformance[];
}

export function KeywordsPerformanceTable({ rows }: KeywordsPerformanceTableProps) {
  const [period, setPeriod] = useState<Period>("7d");
  const [sort, setSort] = useState<SortKey>("signals");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      if (sort === "created") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "score") {
        return (b.avgScore ?? 0) - (a.avgScore ?? 0);
      }
      const aCount = period === "7d" ? a.signals7d : a.signals30d;
      const bCount = period === "7d" ? b.signals7d : b.signals30d;
      return bCount - aCount;
    });
    return copy;
  }, [rows, period, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-[#232323] p-0.5">
          {(["7d", "30d"] as Period[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                period === value
                  ? "bg-[#34D399] text-black"
                  : "text-[#B4B4B4] hover:text-white"
              }`}
            >
              {value === "7d" ? "7 días" : "30 días"}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-[#232323] bg-[#111714] px-3 py-1.5 text-xs text-[#B4B4B4]"
        >
          <option value="signals">Ordenar por señales</option>
          <option value="score">Ordenar por score promedio</option>
          <option value="created">Ordenar por fecha de creación</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#232323]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#111714] text-left text-xs uppercase tracking-wider text-[#6B6B6B]">
            <tr>
              <th className="px-4 py-3">Keyword</th>
              <th className="px-4 py-3">Performance</th>
              <th className="px-4 py-3">Score promedio</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const count = period === "7d" ? row.signals7d : row.signals30d;
              let perfClass = "text-[#6B6B6B]";
              let perfText = "Sin señales en 30 días";

              if (row.signals30d > 0 && row.signals7d === 0 && period === "7d") {
                perfClass = "text-[#FBBF24]";
                perfText = "0 esta semana";
              } else if (count > 0) {
                perfClass = "text-[#34D399]";
                perfText = `${count} señales`;
              } else if (row.signals30d === 0) {
                perfText = "Sin señales en 30 días";
              }

              return (
                <tr key={row.keywordId} className="border-t border-[#232323]">
                  <td className="px-4 py-3 font-semibold text-white">{row.term}</td>
                  <td className={`px-4 py-3 ${perfClass}`}>
                    <span className="inline-flex items-center gap-1">
                      {count > 0 && <ArrowUp className="h-3.5 w-3.5" />}
                      {perfText}
                    </span>
                    {row.signals30d === 0 && (
                      <p className="mt-1 text-xs text-[#6B6B6B]">
                        Considerá cambiar esta keyword por una más específica.
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.avgScore != null ? (
                      <ScoreBadge score={Math.round(row.avgScore)} size="sm" />
                    ) : (
                      <span className="text-[#6B6B6B]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
