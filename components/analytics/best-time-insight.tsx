import { formatBestTimeRange, type BestTimeInsight } from "@/lib/analytics/best-time";

interface BestTimeInsightCardProps {
  insight: BestTimeInsight | null;
  signalCount: number;
}

export function BestTimeInsightCard({
  insight,
  signalCount,
}: BestTimeInsightCardProps) {
  if (signalCount < 20 || !insight) {
    return (
      <section className="dash-card mt-8 p-5">
        <p className="text-sm leading-relaxed text-[#B4B4B4]">
          Necesitamos más datos para calcular tu mejor momento. Te avisamos cuando
          tengamos suficiente historial.
        </p>
      </section>
    );
  }

  return (
    <section className="dash-card mt-8 p-5">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          ⏰
        </span>
        <div>
          <h2 className="text-base font-semibold text-white">
            Mejor momento para responder
          </h2>
          <p className="mt-2 text-lg font-bold text-[#34D399]">
            {formatBestTimeRange(insight)}
          </p>
          <p className="mt-2 text-sm text-[#B4B4B4]">
            Tus señales más fuertes aparecen en este horario. Respondé mientras la
            conversación está activa.
          </p>
          <p className="mt-2 text-xs text-[#6B6B6B]">
            Score promedio: {insight.avgScore}/10
          </p>
        </div>
      </div>
    </section>
  );
}
