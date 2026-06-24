"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { KeywordForm } from "@/components/keywords/keyword-form";
import { UpgradeLimitBanner } from "@/components/keywords/upgrade-limit-banner";
import type { Keyword, Plan, UserProduct } from "@/types";

interface KeywordSheetProps {
  product: UserProduct | null;
  plan: Plan;
  atLimit: boolean;
  maxKeywords: number;
  activeTwitterCount: number;
  open: boolean;
  keyword?: Keyword | null;
  onClose: () => void;
}

export function KeywordSheet({
  product,
  plan,
  atLimit,
  maxKeywords,
  activeTwitterCount,
  open,
  keyword = null,
  onClose,
}: KeywordSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const isEdit = Boolean(keyword);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setVisible(false);
    window.setTimeout(onClose, 250);
  }, [onClose]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!mounted || !open) return null;

  const title = isEdit ? "Editar keyword" : "Agregar keyword";
  const subtitle = isEdit
    ? "Actualizá plataformas, subreddits o el término"
    : "Término o frase a monitorear";

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#111714] shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyword-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 id="keyword-sheet-title" className="text-lg font-bold text-foreground">
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-foreground-secondary">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-foreground-muted transition hover:border-white/20 hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!product ? (
            <p className="text-sm text-foreground-secondary">
              Primero configurá tu producto en la sección de contexto para que la
              IA entienda el scoring.
            </p>
          ) : !isEdit && atLimit ? (
            <UpgradeLimitBanner plan={plan} maxKeywords={maxKeywords} />
          ) : (
            <KeywordForm
              key={keyword?.id ?? "new"}
              productId={product.id}
              plan={plan}
              keyword={keyword}
              productName={product.name}
              productDescription={product.description ?? undefined}
              targetCustomer={product.target_customer ?? undefined}
              painPoints={product.pain_points?.join(", ")}
              activeTwitterCount={activeTwitterCount}
              onSuccess={handleClose}
              submitLabel={isEdit ? "Guardar cambios" : "Agregar keyword"}
            />
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}
