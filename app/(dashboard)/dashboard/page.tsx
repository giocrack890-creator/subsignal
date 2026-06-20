import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { count } = await supabase
    .from("signals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "new");

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Bienvenido{user.email ? `, ${user.email}` : ""}. Tu sesión está activa.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="bento-card rounded-2xl p-5">
          <p className="text-3xl font-bold text-foreground">{count ?? 0}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
            Señales nuevas
          </p>
        </div>
        <div className="bento-card rounded-2xl p-5">
          <p className="text-3xl font-bold text-primary">HN</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
            Plataforma activa
          </p>
        </div>
        <div className="bento-card rounded-2xl p-5">
          <p className="text-3xl font-bold text-foreground">—</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-foreground-muted">
            Keywords configuradas
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm text-foreground-muted">
        Feed completo de señales — PASO 5
      </p>
    </div>
  );
}
