import { SignalCard } from "@/components/dashboard/signal-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { Plan, Signal } from "@/types";

interface SignalsListProps {
  signals: Signal[];
  hasKeywords: boolean;
  plan: Plan;
}

export function SignalsList({ signals, hasKeywords, plan }: SignalsListProps) {
  if (!hasKeywords) {
    return (
      <EmptyState
        variant="radar"
        title="Configurá tu primera keyword"
        description="Para empezar a detectar conversaciones con intención de compra, agregá al menos una keyword."
        action={{ label: "Agregar keyword", href: "/keywords" }}
      />
    );
  }

  if (signals.length === 0) {
    return (
      <EmptyState
        variant="radar"
        title="Todavía no encontramos señales"
        description="Estamos monitoreando Hacker News con tus keywords. Las conversaciones con score alto van a aparecer acá."
        action={{ label: "Ver keywords", href: "/keywords" }}
      />
    );
  }

  return (
    <ul className="dash-timeline space-y-4">
      {signals.map((signal) => (
        <li key={signal.id} className="dash-timeline-item">
          <SignalCard signal={signal} plan={plan} />
        </li>
      ))}
    </ul>
  );
}
