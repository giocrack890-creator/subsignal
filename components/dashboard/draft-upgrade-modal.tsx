"use client";

import Link from "next/link";

interface DraftUpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function DraftUpgradeModal({ open, onClose }: DraftUpgradeModalProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.7)]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[min(100%,480px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[rgba(52,211,153,0.4)] bg-[#111714] p-8 shadow-[0_0_40px_rgba(52,211,153,0.12)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-upgrade-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center text-4xl" aria-hidden="true">
          🔒
        </p>
        <h2
          id="draft-upgrade-title"
          className="mt-4 text-center text-xl font-bold text-white"
        >
          Los drafts son para planes de pago
        </h2>
        <p className="mt-3 text-center text-base leading-relaxed text-[#B4B4B4]">
          Con Starter ($14.99/mes) cada señal incluye un borrador de respuesta listo
          para copiar y publicar desde tu cuenta. Sin spam, sin auto-post.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href="/pricing"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#34D399] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[#2bb88a] sm:w-auto"
          >
            Ver Starter — $14.99/mes
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-sm text-[#6B6B6B] transition-colors hover:text-[#B4B4B4]"
          >
            Cerrar
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-[#6B6B6B]">
          Cancelás cuando querés. Sin contratos.
        </p>
      </div>
    </>
  );
}
