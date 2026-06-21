"use client";

import { useEffect } from "react";
import { PenLine } from "lucide-react";
import { DraftCard } from "@/components/drafts/draft-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { Signal } from "@/types";

interface DraftsListProps {
  signals: Signal[];
  highlightId?: string;
}

export function DraftsList({ signals, highlightId }: DraftsListProps) {
  useEffect(() => {
    if (highlightId) {
      const el = document.getElementById(`draft-${highlightId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId]);

  if (signals.length === 0) {
    return (
      <EmptyState
        icon={PenLine}
        title="Todavía no hay borradores"
        description="Se generan automáticamente cuando el cron encuentra señales de alta intención (plan Starter+). También podés generarlos manualmente desde el feed con el botón «Generar borrador»."
        action={{ label: "Ver señales", href: "/signals" }}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {signals.map((signal) => (
        <li key={signal.id}>
          <DraftCard
            signal={signal}
            highlighted={signal.id === highlightId}
          />
        </li>
      ))}
    </ul>
  );
}
