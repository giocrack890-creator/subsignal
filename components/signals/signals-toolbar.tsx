"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Platform } from "@/types";
import { buildSignalsUrl } from "@/lib/signals/query";

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="text-[#4B4B4B]"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

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
  return (
    <span
      className="mx-0.5 h-3 w-px shrink-0 bg-border-sutil"
      aria-hidden="true"
    />
  );
}

function FilterPill({
  href,
  active,
  disabled,
  children,
  tooltip,
}: {
  href?: string;
  active: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip?: string;
}) {
  const className = cn(
    "shrink-0 rounded-md px-2 py-1 text-[12px] transition-[color,background] duration-100",
    disabled && "cursor-not-allowed opacity-40",
    !disabled &&
      !active &&
      "text-[#6B6B6B] hover:bg-nivel-4 hover:text-[#B4B4B4]",
    active && "bg-[rgba(52,211,153,0.12)] font-medium text-accent"
  );

  const inner = disabled || !href ? (
    <span className={className}>{children}</span>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{inner}</Tooltip>;
  }

  return inner;
}

export function SignalsToolbar({
  className,
  viewMode,
  onViewModeChange,
}: SignalsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const current = {
    status: searchParams.get("status") ?? "all",
    platform: searchParams.get("platform") ?? "all",
    minScore: searchParams.get("minScore") ?? "all",
    draft: searchParams.get("draft") ?? "all",
    q: searchParams.get("q") ?? "",
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape" || !searchFocused) return;
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.blur();
      }
      const params = {
        status: searchParams.get("status") ?? "all",
        platform: searchParams.get("platform") ?? "all",
        minScore: searchParams.get("minScore") ?? "all",
        draft: searchParams.get("draft") ?? "all",
      };
      router.push(
        buildSignalsUrl(
          {
            status: params.status !== "all" ? params.status : undefined,
            platform: params.platform !== "all" ? params.platform : undefined,
            minScore: params.minScore !== "all" ? params.minScore : undefined,
            draft: params.draft !== "all" ? params.draft : undefined,
          },
          { q: undefined, page: undefined }
        )
      );
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchFocused, router, searchParams]);

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
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            name="q"
            type="search"
            defaultValue={current.q}
            placeholder="Buscar señales..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              "h-9 w-full rounded-lg border bg-nivel-3 pl-9 pr-24 text-sm text-white placeholder:text-[#4B4B4B] transition-[border-color] duration-150 focus:outline-none focus:ring-0",
              searchFocused ? "border-border-activo" : "border-border-medio"
            )}
          />
          {searchFocused && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#6B6B6B]">
              ESC para cerrar
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border-medio bg-nivel-3 p-0.5">
          <Tooltip content="Vista compacta">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150",
                viewMode === "list"
                  ? "bg-[rgba(52,211,153,0.1)] text-accent"
                  : "text-[#6B6B6B] hover:text-[#B4B4B4]"
              )}
              aria-label="Vista lista"
              aria-pressed={viewMode === "list"}
            >
              <List className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Vista expandida">
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150",
                viewMode === "cards"
                  ? "bg-[rgba(52,211,153,0.1)] text-accent"
                  : "text-[#6B6B6B] hover:text-[#B4B4B4]"
              )}
              aria-label="Vista cards"
              aria-pressed={viewMode === "cards"}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </form>

      <div className="signals-filter-scroll flex items-center gap-1 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
        {STATUS_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            href={pillHref({ status: opt.value === "all" ? undefined : opt.value })}
            active={current.status === opt.value}
            tooltip={`Filtrar: ${opt.label}`}
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
            tooltip={opt.disabled ? "Próximamente" : opt.label}
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
            tooltip={`Score ${opt.label}`}
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
            tooltip={opt.label}
          >
            {opt.label}
          </FilterPill>
        ))}
      </div>
    </div>
  );
}
