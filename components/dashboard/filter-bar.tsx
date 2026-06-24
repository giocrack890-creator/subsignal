import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SignalStatus } from "@/types";

export type SignalFilter = "all" | SignalStatus;

const TABS: { value: SignalFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "new", label: "Nuevas" },
  { value: "replied", label: "Respondidas" },
  { value: "dismissed", label: "Descartadas" },
];

interface FilterBarProps {
  basePath: string;
  current: SignalFilter;
  /** Params extra a preservar (ej: welcome=1) */
  preserveParams?: Record<string, string>;
  className?: string;
}

export function FilterBar({
  basePath,
  current,
  preserveParams = {},
  className,
}: FilterBarProps) {
  function buildHref(status: SignalFilter) {
    const params = new URLSearchParams(preserveParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}
      role="tablist"
      aria-label="Filtrar señales"
    >
      {TABS.map((tab) => {
        const active = current === tab.value;
        return (
          <Link
            key={tab.value}
            href={buildHref(tab.value)}
            role="tab"
            aria-selected={active}
            className={cn(
              "dash-pill cursor-pointer",
              active && "dash-pill-active"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
