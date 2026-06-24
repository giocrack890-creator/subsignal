"use client";

import { useState, useTransition } from "react";
import { updateSignalLead, markSignalConverted } from "@/lib/actions/signals";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { LeadStage, Signal } from "@/types";

const STAGES: LeadStage[] = ["new", "contacted", "qualified", "won", "lost"];

export function CrmLitePanel({ signal }: { signal: Signal }) {
  const [notes, setNotes] = useState(signal.lead_notes ?? "");
  const [stage, setStage] = useState<LeadStage | "">(signal.lead_stage ?? "");
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await updateSignalLead(signal.id, {
        isLead: true,
        leadStage: stage || "new",
        leadNotes: notes,
      });
    });
  }

  function markWon() {
    startTransition(async () => {
      await markSignalConverted(signal.id, signal.draft_reply ?? "");
    });
  }

  return (
    <div className="mt-4 rounded-xl border border-border-medio bg-nivel-2 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
        CRM lite
      </p>
      <div>
        <Label htmlFor={`lead-stage-${signal.id}`}>Etapa</Label>
        <select
          id={`lead-stage-${signal.id}`}
          value={stage}
          onChange={(e) => setStage(e.target.value as LeadStage)}
          className="mt-1 w-full rounded-lg border border-border-medio bg-nivel-3 px-3 py-2 text-sm"
        >
          <option value="">Seleccionar…</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={`lead-notes-${signal.id}`}>Notas</Label>
        <textarea
          id={`lead-notes-${signal.id}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-border-medio bg-nivel-3 px-3 py-2 text-sm"
          placeholder="Contexto del lead…"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={isPending} onClick={save}>
          Guardar lead
        </Button>
        <Button type="button" size="sm" variant="accent" disabled={isPending} onClick={markWon}>
          Marcó como convirtió
        </Button>
      </div>
    </div>
  );
}
