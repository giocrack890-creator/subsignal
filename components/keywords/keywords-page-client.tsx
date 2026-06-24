"use client";

import { useState } from "react";
import { KeywordSheet } from "@/components/keywords/keyword-sheet";
import { KeywordsHeaderActions } from "@/components/keywords/keywords-header-actions";
import { KeywordsList } from "@/components/keywords/keywords-list";
import { PageHeader } from "@/components/dashboard/page-header";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { FirstTimeTooltip } from "@/components/ui/FirstTimeTooltip";
import { STARTER_MAX_TWITTER_KEYWORDS } from "@/lib/payments/platforms";
import type { Keyword, Plan, UserProduct } from "@/types";
import type { ReactNode } from "react";

interface KeywordsPageClientProps {
  keywords: Keyword[];
  plan: Plan;
  product: UserProduct | null;
  maxKeywords: number;
  activeCount: number;
  atLimit: boolean;
  activeTwitterCount: number;
  performanceSection?: ReactNode;
  productSection: ReactNode;
}

export function KeywordsPageClient({
  keywords,
  plan,
  product,
  maxKeywords,
  activeCount,
  atLimit,
  activeTwitterCount,
  performanceSection,
  productSection,
}: KeywordsPageClientProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);

  function openAdd() {
    setEditingKeyword(null);
    setSheetOpen(true);
  }

  function openEdit(keyword: Keyword) {
    setEditingKeyword(keyword);
    setSheetOpen(true);
  }

  function closeSheet() {
    setSheetOpen(false);
    window.setTimeout(() => setEditingKeyword(null), 300);
  }

  return (
    <div className="p-6 lg:p-8">
      <FirstTimeTooltip
        id="keywords_page"
        content="Configurá keywords y revisá cuáles generan más señales de alta intención."
        position="bottom"
      >
        <PageHeader
          title="Keywords"
          subtitle="Configurá qué términos monitoreamos en Hacker News y otras plataformas."
          aside={
            <KeywordsHeaderActions
              activeCount={activeCount}
              maxKeywords={maxKeywords}
              atLimit={atLimit}
              hasProduct={Boolean(product)}
              onAdd={openAdd}
            />
          }
        />
      </FirstTimeTooltip>

      <div className="mt-2">
        <PlanBadge plan={plan} />
      </div>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="dash-section-title">Tus keywords</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            {keywords.length} en total · {activeCount} activas
            {plan === "starter" && (
              <> · {activeTwitterCount}/{STARTER_MAX_TWITTER_KEYWORDS} con Twitter/X activas</>
            )}
          </p>
        </div>
        <KeywordsList keywords={keywords} plan={plan} onEdit={openEdit} />
      </section>

      {performanceSection}

      {productSection}

      <KeywordSheet
        product={product}
        plan={plan}
        atLimit={atLimit}
        maxKeywords={maxKeywords}
        activeTwitterCount={activeTwitterCount}
        open={sheetOpen}
        keyword={editingKeyword}
        onClose={closeSheet}
      />
    </div>
  );
}
