"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, List, Search } from "lucide-react";
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
  { value: "hn", label: "HN" },
  { value: "reddit", label: "Reddit", disabled: true },
  { value: "twitter", label: "X", disabled: true },
  { value: "ih", label: "IH", disabled: true },
];

const SCORE_OPTIONS = [
  { value: "all", label: "Todo" },
  { value: "7", label: "7+" },
  { value: "9", label: "9+" },
] as const;

const DRAFT_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "with", label: "Con draft" },
  { value: "without", label: "Sin draft" },
] as const;

export type SignalsViewMode = "list" | "cards";

interface SignalsToolbarProps {
  className?: string;
  viewMode: SignalsViewMode;
  onViewModeChange: (mode: SignalsViewMode) => void;
}

function FilterSeparator() {
  return <span className="mx-1 h-4 w-px shrink-0 bg-[#232323]" aria-hidden="true" />;
}

function FilterPill({
  href,
  active,
  disabled,
  children,
  title,
}: {
  href?: string;
  active: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  const className = cn(
    "shrink-0 rounded-full px-2.5 py-1 text-xs transition-colors duration-150",
    disabled && "cursor-not-allowed opacity-40",
    !disabled && !active && "border border-[#232323] text-[#6B6B6B] hover:bg-[rgba(52,211,153,0.1)] hover:text-[#34D399]",
    active && "bg-[#34D399] font-medium text-[#0A0A0A]"
  );

  if (disabled || !href) {
    return (
      <span className={className} title={title}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} title={title}>
      {children}
    </Link>
  );
}

export function SignalsToolbar({
  className,
  viewMode,
  onViewModeChange,
}: SignalsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = {
    status: searchParams.get("status") ?? "all",
    platform: searchParams.get("platform") ?? "all",
    minScore: searchParams.get("minScore") ?? "all",
    draft: searchParams.get("draft") ?? "all",
    q: searchParams.get("q") ?? "",
  };

  function baseParams() {
    return {
      status: current.status !== "all" ? current.status : undefined,
      platform: current.platform !== "all" ? current.platform : undefined,
      minScore: current.minScore !== "all" ? current.minScore : undefined,
      draft: current.draft !== "all" ? current.draft : undefined,
      q: current.q || undefined,
    };
  }

  function pillHref(overrides: Record<string, string | undefined>) {
    return buildSignalsUrl(baseParams(), { ...overrides, page: undefined });
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = (form.get("q") as string)?.trim();
    router.push(buildSignalsUrl(baseParams(), { q: q || undefined, page: undefined }));
  }

  return (
    <div className={cn("mt-8 space-y-4", className)}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
            aria-hidden="true"
          />
          <input
            name="q"
            type="search"
            defaultValue={current.q}
            placeholder="Buscar en señales..."
            className="h-10 w-full rounded-[10px] border border-[#232323] bg-[#111714] pl-10 pr-4 text-sm text-white placeholder:text-[#6B6B6B] transition-colors focus:border-[rgba(52,211,153,0.4)] focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-[10px] border border-[#232323] bg-[#111714] p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              viewMode === "list"
                ? "bg-[rgba(52,211,153,0.1)] text-[#34D399]"
                : "text-[#6B6B6B] hover:text-[#B4B4B4]"
            )}
            aria-label="Vista lista"
            aria-pressed={viewMode === "list"}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              viewMode === "cards"
                ? "bg-[rgba(52,211,153,0.1)] text-[#34D399]"
                : "text-[#6B6B6B] hover:text-[#B4B4B4]"
            )}
            aria-label="Vista cards"
            aria-pressed={viewMode === "cards"}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="signals-filter-scroll flex items-center gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
        {STATUS_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            href={pillHref({ status: opt.value === "all" ? undefined : opt.value })}
            active={current.status === opt.value}
          >
            {opt.label}
          </FilterPill>
        ))}

        <FilterSeparator />

        {PLATFORM_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            href={
              opt.disabled
                ? undefined
                : pillHref({
                    platform: current.platform === opt.value ? undefined : opt.value,
                  })
            }
            active={current.platform === opt.value}
            disabled={opt.disabled}
            title={opt.disabled ? "Próximamente" : undefined}
          >
            {opt.label}
          </FilterPill>
        ))}

        <FilterSeparator />

        {SCORE_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
          <FilterPill
            key={opt.value}
            href={pillHref({
              minScore: current.minScore === opt.value ? undefined : opt.value,
            })}
            active={current.minScore === opt.value}
          >
            {opt.label}
          </FilterPill>
        ))}

        <FilterSeparator />

        {DRAFT_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
          <FilterPill
            key={opt.value}
            href={pillHref({
              draft: current.draft === opt.value ? undefined : opt.value,
            })}
            active={current.draft === opt.value}
          >
            {opt.label}
          </FilterPill>
        ))}
      </div>
    </div>
  );
}
