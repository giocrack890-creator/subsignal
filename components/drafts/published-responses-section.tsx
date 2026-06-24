"use client";

import { useState } from "react";
import Link from "next/link";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { ScoreBadge } from "@/components/dashboard/score-badge";
import { formatRelativeTime } from "@/lib/utils";
import type { Platform, Signal } from "@/types";

interface PublishedResponsesSectionProps {
  signals: Signal[];
}

export function PublishedResponsesSection({
  signals,
}: PublishedResponsesSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (signals.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-white">Respuestas publicadas</h2>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Tu registro de actividad community-led
        </p>
        <div className="mt-6 rounded-xl border border-[#232323] bg-[#111714] p-6 text-sm text-[#B4B4B4]">
          Todavía no marcaste ninguna señal como respondida. Cuando lo hagas,
          aparecen acá como registro de tu actividad.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-white">Respuestas publicadas</h2>
      <p className="mt-1 text-sm text-[#6B6B6B]">
        Tu registro de actividad community-led
      </p>

      <ul className="mt-6 space-y-3">
        {signals.map((signal) => {
          const expanded = expandedId === signal.id;
          return (
            <li
              key={signal.id}
              className="rounded-xl border border-[#232323] bg-[#111714] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <PlatformBadge platform={signal.platform as Platform} />
                {signal.intent_score != null && (
                  <ScoreBadge score={signal.intent_score} size="sm" />
                )}
                <span className="text-xs text-[#6B6B6B]">
                  {formatRelativeTime(signal.found_at)}
                </span>
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-white">
                {signal.title ?? "Sin título"}
              </p>
              {signal.reply_url && (
                <Link
                  href={signal.reply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-[#34D399] hover:underline"
                >
                  Ver respuesta ↗
                </Link>
              )}
              {signal.draft_reply && (
                <button
                  type="button"
                  className="mt-3 text-xs text-[#6B6B6B] hover:text-white"
                  onClick={() => setExpandedId(expanded ? null : signal.id)}
                >
                  {expanded ? "Ocultar draft" : "Ver draft publicado"}
                </button>
              )}
              {expanded && signal.draft_reply && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-[#B4B4B4]">
                  {signal.draft_reply}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
