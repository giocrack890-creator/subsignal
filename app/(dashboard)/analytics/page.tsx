import { redirect } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
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
        <PageHeader title="Analytics" />
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
      <PageHeader
        title="Analytics"
        description="Métricas de señales, respuestas y keywords de los últimos 30 días."
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <StatCard value={data.totalSignals} label="Total señales" />
        <StatCard value={data.repliedCount} label="Respondidas" accent />
        <StatCard value={`${data.responseRate}%`} label="Tasa de respuesta" />
      </div>

      {!data.hasEnoughData ? (
        <EmptyState
          className="mt-8"
          variant="chart"
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
