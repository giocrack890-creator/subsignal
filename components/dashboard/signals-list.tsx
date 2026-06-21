import { SignalCard } from "@/components/dashboard/signal-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Radar } from "lucide-react";
import type { Signal } from "@/types";

interface SignalsListProps {
  signals: Signal[];
  hasKeywords: boolean;
}

export function SignalsList({ signals, hasKeywords }: SignalsListProps) {
  if (!hasKeywords) {
    return (
      <EmptyState
        icon={Radar}
        title="Configurá tu primera keyword"
        description="Para empezar a detectar conversaciones con intención de compra, agregá al menos una keyword en la sección de configuración."
        action={{ label: "Configurá tu primera keyword", href: "/keywords" }}
      />
    );
  }

  if (signals.length === 0) {
    return (
      <EmptyState
        icon={Radar}
        title="Todavía no encontramos señales"
        description="Estamos monitoreando Hacker News una vez al día con tus keywords. Las conversaciones con score alto van a aparecer acá."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {signals.map((signal) => (
        <li key={signal.id}>
          <SignalCard signal={signal} />
        </li>
      ))}
    </ul>
  );
}
