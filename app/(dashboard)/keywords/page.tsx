import { ProductForm } from "@/components/keywords/product-form";
import { KeywordsList } from "@/components/keywords/keywords-list";
import { KeywordsHeaderActions } from "@/components/keywords/keywords-header-actions";
import { PageHeader } from "@/components/dashboard/page-header";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { getPlanLimits } from "@/lib/payments/plans";
import { getOnboardingStatus } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Keyword, Plan, UserProduct } from "@/types";

export const dynamic = "force-dynamic";

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
      <PageHeader
        title="Keywords"
        description="Configurá qué términos monitoreamos en Hacker News y otras plataformas."
        aside={
          <KeywordsHeaderActions
            activeCount={activeCount}
            maxKeywords={limits.maxKeywords}
            productId={product?.id ?? null}
            plan={plan}
            atLimit={atLimit}
          />
        }
      />
      <div className="mt-2">
        <PlanBadge plan={plan} />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="dash-section-title">Tus keywords</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {keywordList.length} en total · {activeCount} activas
            </p>
          </div>
        </div>
        <KeywordsList keywords={keywordList} plan={plan} />
      </section>

      <section className="mt-12 border-t border-border pt-10">
        <details className="group max-w-2xl">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="dash-section-title">Contexto de producto</h2>
                <p className="mt-1 text-sm text-foreground-secondary">
                  Alimenta los prompts de scoring y borradores de la IA.
                </p>
              </div>
              <span className="text-xs text-primary group-open:rotate-180 transition-transform">
                ▼
              </span>
            </div>
          </summary>
          <div className="dash-card mt-4 p-6">
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
