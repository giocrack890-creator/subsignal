import { ProductForm } from "@/components/keywords/product-form";
import { KeywordForm } from "@/components/keywords/keyword-form";
import { KeywordsList } from "@/components/keywords/keywords-list";
import { UpgradeLimitBanner } from "@/components/keywords/upgrade-limit-banner";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { getPlanLimits } from "@/lib/payments/plans";
import { getOnboardingStatus } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Keyword, Plan, UserProduct } from "@/types";

export const dynamic = "force-dynamic";

function formatLimit(max: number): string {
  return max === Infinity ? "∞" : String(max);
}

export default async function KeywordsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const status = await getOnboardingStatus(supabase, user.id);
  if (!status.isComplete) {
    redirect("/onboarding");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;
  const limits = getPlanLimits(plan);
  const maxLabel = formatLimit(limits.maxKeywords);

  const { data: product } = await supabase
    .from("user_products")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const { data: keywords } = await supabase
    .from("keywords")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const keywordList = (keywords as Keyword[]) ?? [];
  const activeCount = keywordList.filter((k) => k.is_active).length;
  const atLimit = activeCount >= limits.maxKeywords;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Keywords
            </h1>
            <PlanBadge plan={plan} />
          </div>
          <p className="mt-1 text-sm text-foreground-secondary">
            Configurá qué términos monitoreamos en Hacker News y otras plataformas.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background-card px-4 py-3 text-center sm:text-right">
          <p className="text-2xl font-bold text-primary">
            {activeCount}
            <span className="text-lg font-normal text-foreground-muted">
              {" "}
              de {maxLabel}
            </span>
          </p>
          <p className="text-xs text-foreground-muted">keywords activas</p>
        </div>
      </div>

      {/* Agregar keyword */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Agregar keyword</h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          La keyword o frase que querés detectar en conversaciones con intención de compra.
        </p>
        <div className="landing-card mt-4 max-w-2xl rounded-2xl p-6">
          {!product ? (
            <p className="text-sm text-foreground-secondary">
              Primero configurá tu producto en la sección de abajo para que la IA entienda el
              contexto al puntuar señales.
            </p>
          ) : atLimit ? (
            <UpgradeLimitBanner plan={plan} maxKeywords={limits.maxKeywords} />
          ) : (
            <KeywordForm productId={product.id} plan={plan} />
          )}
        </div>
      </section>

      {/* Lista de keywords */}
      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tus keywords</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {keywordList.length} en total · {activeCount} activas
            </p>
          </div>
        </div>
        <KeywordsList keywords={keywordList} plan={plan} />
      </section>

      {/* Producto — contexto IA */}
      <section className="mt-12 border-t border-border pt-10">
        <details className="group max-w-2xl">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Contexto de producto
                </h2>
                <p className="mt-1 text-sm text-foreground-secondary">
                  Alimenta los prompts de scoring y borradores de la IA.
                </p>
              </div>
              <span className="text-xs text-primary group-open:rotate-180 transition-transform">
                ▼
              </span>
            </div>
          </summary>
          <div className="landing-card mt-4 rounded-2xl p-6">
            <ProductForm
              product={(product as UserProduct | null) ?? null}
              submitLabel="Guardar cambios"
            />
          </div>
        </details>
      </section>
    </div>
  );
}
