import { ProductForm } from "@/components/keywords/product-form";
import { KeywordsPageClient } from "@/components/keywords/keywords-page-client";
import { KeywordsPerformanceTable } from "@/components/keywords/keywords-performance-table";
import { getPlanLimits } from "@/lib/payments/plans";
import { fetchKeywordPerformance } from "@/lib/keywords/performance";
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

  const [{ data: keywords }, performanceRows] = await Promise.all([
    supabase
      .from("keywords")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    fetchKeywordPerformance(supabase, user.id),
  ]);

  const keywordList = (keywords as Keyword[]) ?? [];
  const activeCount = keywordList.filter((k) => k.is_active).length;
  const atLimit = activeCount >= limits.maxKeywords;
  const activeTwitterCount = keywordList.filter(
    (k) => k.is_active && k.platforms.includes("twitter")
  ).length;

  const performanceSection =
    performanceRows.length > 0 ? (
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="dash-section-title">Rendimiento por keyword</h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Señales y score promedio de los últimos 7 y 30 días.
        </p>
        <div className="mt-6">
          <KeywordsPerformanceTable rows={performanceRows} />
        </div>
      </section>
    ) : null;

  const productSection = (
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
            <span className="text-xs text-primary transition-transform group-open:rotate-180">
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
  );

  return (
    <KeywordsPageClient
      keywords={keywordList}
      plan={plan}
      product={(product as UserProduct | null) ?? null}
      maxKeywords={limits.maxKeywords}
      activeCount={activeCount}
      atLimit={atLimit}
      activeTwitterCount={activeTwitterCount}
      performanceSection={performanceSection}
      productSection={productSection}
    />
  );
}
