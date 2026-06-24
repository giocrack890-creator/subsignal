"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CronStatus {
  ranAt: string | null;
  status: string | null;
  minutesAgo: number | null;
}

export function CronStatusIndicator() {
  const [status, setStatus] = useState<CronStatus | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/cron/status");
        if (!res.ok) return;
        const data = (await res.json()) as CronStatus;
        setStatus(data);
      } catch {
        setStatus(null);
      }
    }

    load();
    const interval = window.setInterval(load, 5 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  const minutes = status?.minutesAgo;
  let color = "bg-red-500";
  let pulse = false;
  let tooltip = "El monitoreo puede estar pausado. Contactá soporte si persiste.";

  if (minutes != null) {
    if (minutes <= 20) {
      color = "bg-[#34D399]";
      pulse = true;
      tooltip = `Monitoreando activamente — última búsqueda hace ${minutes} minutos`;
    } else if (minutes <= 60) {
      color = "bg-[#FBBF24]";
      tooltip = `Próxima búsqueda en ${Math.max(0, 60 - minutes)} minutos`;
    }
  }

  return (
    <span
      className={cn(
        "ml-auto h-2 w-2 shrink-0 rounded-full",
        color,
        pulse && "animate-pulse"
      )}
      title={tooltip}
      aria-label={tooltip}
    />
  );
}
