"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types";
import { buildSignalsUrl } from "@/lib/signals/query";

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "new", label: "Nuevas" },
  { value: "viewed", label: "Vistas" },
  { value: "replied", label: "Respondidas" },
  { value: "dismissed", label: "Descartadas" },
] as const;

const PLATFORM_OPTIONS: { value: Platform | "all"; label: string; disabled?: boolean }[] = [
  { value: "all", label: "Todas" },
  { value: "hn", label: "HN" },
  { value: "reddit", label: "Reddit", disabled: true },
  { value: "twitter", label: "X", disabled: true },
  { value: "ih", label: "IH", disabled: true },
];

const SCORE_OPTIONS = [
  { value: "all", label: "Todo score" },
  { value: "7", label: "7+" },
  { value: "9", label: "9+" },
];

interface SignalsToolbarProps {
  className?: string;
}

export function SignalsToolbar({ className }: SignalsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = {
    status: searchParams.get("status") ?? "all",
    platform: searchParams.get("platform") ?? "all",
    minScore: searchParams.get("minScore") ?? "all",
    q: searchParams.get("q") ?? "",
    sort: searchParams.get("sort") ?? "date",
    page: searchParams.get("page") ?? "1",
  };

  function baseParams() {
    return {
      status: current.status !== "all" ? current.status : undefined,
      platform: current.platform !== "all" ? current.platform : undefined,
      minScore: current.minScore !== "all" ? current.minScore : undefined,
      q: current.q || undefined,
      sort: current.sort !== "date" ? current.sort : undefined,
    };
  }

  function pillHref(overrides: Record<string, string | undefined>) {
    return buildSignalsUrl(baseParams(), { ...overrides, page: undefined });
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = (form.get("q") as string)?.trim();
    router.push(
      buildSignalsUrl(baseParams(), { q: q || undefined, page: undefined })
    );
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(
      buildSignalsUrl(baseParams(), {
        sort: e.target.value === "score" ? "score" : undefined,
        page: undefined,
      })
    );
  }

  return (
    <div className={cn("dash-toolbar-sticky", className)}>
      <div className="space-y-4">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
            aria-hidden="true"
          />
          <input
            name="q"
            type="search"
            defaultValue={current.q}
            placeholder="Buscar en título o contenido…"
            className="h-10 w-full rounded-[10px] border border-border bg-background-card pl-10 pr-4 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-foreground-muted" aria-hidden="true" />
          <select
            value={current.sort}
            onChange={handleSortChange}
            aria-label="Ordenar señales"
            className="h-10 cursor-pointer rounded-[10px] border border-border bg-background-card px-4 text-sm text-foreground-secondary focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
          >
            <option value="date">Más recientes</option>
            <option value="score">Mayor score</option>
          </select>
          <button
            type="submit"
            className="h-10 cursor-pointer rounded-[10px] border border-border-strong bg-background-card px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/30"
          >
            Buscar
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="mr-1 self-center text-xs font-medium uppercase tracking-wider text-foreground-muted">
          Status
        </span>
        {STATUS_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={pillHref({ status: opt.value === "all" ? undefined : opt.value })}
            className={cn(
              "dash-pill cursor-pointer !px-3 !py-1 !text-xs",
              current.status === opt.value && "dash-pill-active"
            )}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="mr-1 self-center text-xs font-medium uppercase tracking-wider text-foreground-muted">
          Plataforma
        </span>
        {PLATFORM_OPTIONS.map((opt) =>
          opt.disabled ? (
            <span
              key={opt.value}
              className="cursor-not-allowed rounded-full border border-border bg-background-card px-3 py-1 text-xs text-foreground-muted opacity-50"
              title="Próximamente"
            >
              {opt.label}
            </span>
          ) : (
            <Link
              key={opt.value}
              href={pillHref({
                platform: opt.value === "all" ? undefined : opt.value,
              })}
              className={cn(
                "dash-pill cursor-pointer !px-3 !py-1 !text-xs",
                current.platform === opt.value && "dash-pill-active"
              )}
            >
              {opt.label}
            </Link>
          )
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="mr-1 self-center text-xs font-medium uppercase tracking-wider text-foreground-muted">
          Score
        </span>
        {SCORE_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={pillHref({
              minScore: opt.value === "all" ? undefined : opt.value,
            })}
            className={cn(
              "dash-pill cursor-pointer !px-3 !py-1 !text-xs",
              current.minScore === opt.value && "dash-pill-active"
            )}
          >
            {opt.label}
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
}
