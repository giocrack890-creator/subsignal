import { redirect } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorMessage } from "@/components/ui/error-message";
import { fetchAnalytics } from "@/lib/analytics/queries";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error: analyticsError } = await fetchAnalytics(supabase, user.id);

  if (analyticsError || !data) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <ErrorMessage
          className="mt-8"
          title="No pudimos cargar analytics"
          message={analyticsError ?? "Error desconocido"}
        />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
      <p className="mt-1 text-sm text-foreground-secondary">
        Métricas de señales, respuestas y keywords de los últimos 30 días.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="bento-card rounded-2xl p-5">
          <p className="text-3xl font-bold text-foreground">{data.totalSignals}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
            Total señales
          </p>
        </div>
        <div className="bento-card rounded-2xl p-5">
          <p className="text-3xl font-bold text-primary">{data.repliedCount}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
            Respondidas
          </p>
        </div>
        <div className="bento-card rounded-2xl p-5">
          <p className="text-3xl font-bold text-foreground">{data.responseRate}%</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
            Tasa de respuesta
          </p>
        </div>
      </div>

      {!data.hasEnoughData ? (
        <EmptyState
          className="mt-8"
          icon={BarChart3}
          title="Todavía no hay suficientes datos"
          description="Vas a ver tus estadísticas acá cuando tengas más actividad. Necesitamos al menos unas pocas señales para graficar tendencias con sentido."
          action={{ label: "Ir al dashboard", href: "/dashboard" }}
        />
      ) : (
        <AnalyticsCharts data={data} />
      )}
    </div>
  );
}
