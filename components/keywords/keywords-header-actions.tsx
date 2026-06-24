"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddKeywordSheet } from "@/components/keywords/add-keyword-sheet";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/types";

interface KeywordsHeaderActionsProps {
  activeCount: number;
  maxKeywords: number;
  productId: string | null;
  plan: Plan;
  atLimit: boolean;
}

export function KeywordsHeaderActions({
  activeCount,
  maxKeywords,
  productId,
  plan,
  atLimit,
}: KeywordsHeaderActionsProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center">
        <ProgressRing value={activeCount} max={maxKeywords} />
        <Button
          type="button"
          variant="accent"
          size="md"
          onClick={() => setSheetOpen(true)}
          disabled={!productId}
          className="dash-btn-neon gap-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Agregar keyword
        </Button>
      </div>
      <AddKeywordSheet
        productId={productId}
        plan={plan}
        atLimit={atLimit}
        maxKeywords={maxKeywords}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
