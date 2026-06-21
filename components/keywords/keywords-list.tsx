"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteKeyword, toggleKeyword } from "@/lib/actions/keywords";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Search } from "lucide-react";
import type { Keyword, Plan, Platform } from "@/types";

interface KeywordsListProps {
  keywords: Keyword[];
  plan: Plan;
}

export function KeywordsList({ keywords, plan }: KeywordsListProps) {
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  if (keywords.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No tenés keywords todavía"
        description="Agregá tu primera keyword arriba para empezar a monitorear conversaciones en Hacker News."
      />
    );
  }

  function handleToggle(id: string, current: boolean) {
    setActionError(null);
    startTransition(async () => {
      const result = await toggleKeyword(id, !current);
      if (!result.success) {
        setActionError(result.error ?? "No se pudo actualizar la keyword");
      }
    });
  }

  function handleDelete(id: string, term: string) {
    if (!confirm(`¿Eliminar la keyword "${term}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setActionError(null);
    startTransition(async () => {
      const result = await deleteKeyword(id);
      if (!result.success) {
        setActionError(result.error ?? "No se pudo eliminar la keyword");
      }
    });
  }

  return (
    <div className="space-y-3">
      {actionError && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </p>
      )}

      <ul className="space-y-3">
        {keywords.map((kw) => (
          <li
            key={kw.id}
            className={`landing-card rounded-2xl p-5 transition-opacity ${isPending ? "opacity-70" : ""} ${!kw.is_active ? "opacity-80" : ""}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-base font-semibold ${kw.is_active ? "text-foreground" : "text-foreground-secondary"}`}
                  >
                    {kw.term}
                  </h3>
                  {!kw.is_active && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
                      Pausada
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {kw.platforms.map((p) => (
                    <PlatformBadge key={p} platform={p as Platform} />
                  ))}
                </div>
                {plan === "free" && kw.platforms.length === 1 && kw.platforms[0] === "hn" && (
                  <p className="mt-2 text-xs text-foreground-muted">
                    Monitoreo HN · escaneo cada 15 min
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={kw.is_active}
                    onChange={() => handleToggle(kw.id, kw.is_active)}
                    disabled={isPending}
                    aria-label={`${kw.is_active ? "Pausar" : "Activar"} keyword ${kw.term}`}
                  />
                  <span className="text-xs text-foreground-muted">
                    {kw.is_active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleDelete(kw.id, kw.term)}
                  className="gap-1.5 text-destructive hover:text-destructive"
                  aria-label={`Eliminar keyword ${kw.term}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Eliminar</span>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
