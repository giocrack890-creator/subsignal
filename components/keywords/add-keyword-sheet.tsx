"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { KeywordForm } from "@/components/keywords/keyword-form";
import { UpgradeLimitBanner } from "@/components/keywords/upgrade-limit-banner";
import type { Plan } from "@/types";

interface AddKeywordSheetProps {
  productId: string | null;
  plan: Plan;
  atLimit: boolean;
  maxKeywords: number;
  open: boolean;
  onClose: () => void;
}

export function AddKeywordSheet({
  productId,
  plan,
  atLimit,
  maxKeywords,
  open,
  onClose,
}: AddKeywordSheetProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open && !visible) return null;

  return (
    <>
      <div
        className={`dash-sheet-backdrop ${open ? "dash-sheet-backdrop-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`dash-sheet ${open ? "dash-sheet-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-keyword-title"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 id="add-keyword-title" className="text-lg font-bold text-foreground">
              Agregar keyword
            </h2>
            <p className="mt-0.5 text-sm text-foreground-secondary">
              Término o frase a monitorear
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-foreground-muted transition hover:border-white/20 hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!productId ? (
            <p className="text-sm text-foreground-secondary">
              Primero configurá tu producto en la sección de contexto para que la IA
              entienda el scoring.
            </p>
          ) : atLimit ? (
            <UpgradeLimitBanner plan={plan} maxKeywords={maxKeywords} />
          ) : (
            <KeywordForm
              productId={productId}
              plan={plan}
              onSuccess={onClose}
            />
          )}
        </div>
      </aside>
    </>
  );
}
