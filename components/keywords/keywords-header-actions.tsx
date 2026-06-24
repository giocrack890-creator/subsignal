"use client";

import { Plus } from "lucide-react";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { Button } from "@/components/ui/button";

interface KeywordsHeaderActionsProps {
  activeCount: number;
  maxKeywords: number;
  atLimit: boolean;
  hasProduct: boolean;
  onAdd: () => void;
}

export function KeywordsHeaderActions({
  activeCount,
  maxKeywords,
  atLimit,
  hasProduct,
  onAdd,
}: KeywordsHeaderActionsProps) {
  return (
    <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center">
      <ProgressRing value={activeCount} max={maxKeywords} />
      <Button
        type="button"
        variant="accent"
        size="md"
        onClick={onAdd}
        disabled={!hasProduct || atLimit}
        className="dash-btn-neon gap-2"
        title={
          atLimit
            ? "Alcanzaste el límite de keywords de tu plan"
            : !hasProduct
              ? "Configurá tu producto primero"
              : undefined
        }
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Agregar keyword
      </Button>
    </div>
  );
}
