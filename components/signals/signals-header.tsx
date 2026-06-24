"use client";

import { CountUp } from "@/components/signals/count-up";
import { cn } from "@/lib/utils";

interface SignalsHeaderProps {
  totalCount: number;
}

export function SignalsHeader({ totalCount }: SignalsHeaderProps) {
  const hasSignals = totalCount > 0;

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Señales</h1>
        <p className="mt-1.5 text-sm text-[#6B6B6B]">
          Respondé en 30 segundos — cada señal incluye un borrador listo para copiar.
        </p>
      </div>

      <div className="md:text-right">
        <p
          className={cn(
            "text-5xl font-bold tabular-nums leading-none",
            hasSignals ? "text-[#34D399]" : "text-[#6B6B6B]"
          )}
        >
          <CountUp value={totalCount} />
        </p>
        <p className="mt-1 text-xs text-[#6B6B6B]">señales en total</p>
      </div>
    </header>
  );
}
