import Link from "next/link";
import { RadarIcon } from "@/components/dashboard/radar-icon";
import type { SignalsEmptyContext } from "@/lib/signals/page-stats";
import { cn } from "@/lib/utils";

interface SignalsEmptyStateProps {
  context: SignalsEmptyContext;
  variant?: "no-signals" | "no-results";
  className?: string;
}

function CheckItem({
  icon,
  iconColor,
  children,
}: {
  icon: string;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-sm"
        style={{ color: iconColor }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="text-sm text-[#B4B4B4]">{children}</span>
    </li>
  );
}

export function SignalsEmptyState({
  context,
  variant = "no-signals",
  className,
}: SignalsEmptyStateProps) {
  if (variant === "no-results") {
    return (
      <div
        className={cn(
          "mx-auto mt-10 max-w-[520px] rounded-2xl border border-[#1E1E1E] bg-[#111714] px-8 py-12 text-center",
          className
        )}
      >
        <RadarIcon />
        <h3 className="mt-6 text-xl font-semibold text-white">
          No hay señales que coincidan
        </h3>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Probá con otros filtros o limpiá la búsqueda para ver todo tu historial.
        </p>
        <Link
          href="/signals"
          className="mt-6 inline-block text-sm font-medium text-[#34D399] hover:underline"
        >
          Limpiar filtros →
        </Link>
      </div>
    );
  }

  const hasKeywords = context.activeKeywords > 0;

  return (
    <div
      className={cn(
        "mx-auto mt-10 max-w-[520px] rounded-2xl border border-[#1E1E1E] bg-[#111714] px-8 py-12 text-center",
        className
      )}
    >
      <RadarIcon />
      <h3 className="mt-6 text-xl font-semibold text-white">
        Todavía no hay señales
      </h3>
      <p className="mt-2 text-sm text-[#6B6B6B]">
        SubSignal busca automáticamente cada 15 minutos. Estas son las causas más
        comunes:
      </p>

      <ul className="mt-8 space-y-3 text-left">
        <CheckItem icon={hasKeywords ? "✓" : "✗"} iconColor={hasKeywords ? "#34D399" : "#EF4444"}>
          {hasKeywords ? (
            <>
              Keywords configuradas —{" "}
              <span className="text-white">
                {context.activeKeywords} keyword
                {context.activeKeywords !== 1 ? "s" : ""} activa
                {context.activeKeywords !== 1 ? "s" : ""}
              </span>
            </>
          ) : (
            <>
              Necesitás al menos 1 keyword.{" "}
              <Link href="/keywords" className="text-[#34D399] hover:underline">
                Configurar keywords →
              </Link>
            </>
          )}
        </CheckItem>

        <CheckItem
          icon={context.monitoringActive ? "✓" : "⚠️"}
          iconColor={context.monitoringActive ? "#34D399" : "#FBBF24"}
        >
          {context.monitoringActive
            ? "Monitoreando activamente"
            : "El monitor puede estar iniciando. Esperá unos minutos."}
        </CheckItem>

        <CheckItem icon="✓" iconColor="#34D399">
          Plataformas habilitadas — {context.platformsLabel}
        </CheckItem>
      </ul>
    </div>
  );
}
