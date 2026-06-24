"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOnboardingUiOptional } from "@/components/onboarding/onboarding-ui-provider";

const STEPS = [
  {
    target: "[data-tour='nav-dashboard']",
    title: "Tu feed de señales",
    body: "Acá aparecen las conversaciones de alta intención, ordenadas por score. Filtrá por estado o abrí el post original.",
  },
  {
    target: "[data-tour='nav-keywords']",
    title: "Keywords y producto",
    body: "Configurá qué monitorear y el contexto de tu producto para que la IA puntúe y redacte mejor.",
  },
  {
    target: "[data-tour='nav-signals']",
    title: "Historial completo",
    body: "Todas las señales encontradas, con búsqueda, filtros por plataforma y paginación.",
  },
  {
    target: "[data-tour='nav-drafts']",
    title: "Borradores IA",
    body: "Editá, copiá y marcá como publicadas las respuestas generadas para cada señal.",
  },
  {
    target: "[data-tour='nav-analytics']",
    title: "Analytics",
    body: "Seguí señales por día, distribución de scores y qué keywords rinden más.",
  },
  {
    target: "[data-tour='nav-settings']",
    title: "Settings",
    body: "Alertas por email o Slack, umbral de score mínimo y tu plan actual.",
  },
];

interface GuidedTourProps {
  forceShow?: boolean;
  tourCompleted?: boolean;
}

export function GuidedTour({
  forceShow = false,
  tourCompleted = false,
}: GuidedTourProps) {
  const router = useRouter();
  const onboardingUi = useOnboardingUiOptional();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const completed = tourCompleted || onboardingUi?.guidedTourCompleted;

  useEffect(() => {
    if (forceShow && !completed) {
      setVisible(true);
      setStep(0);
    }
  }, [forceShow, completed]);

  useEffect(() => {
    if (!visible) return;

    const target = document.querySelector(STEPS[step]?.target);
    if (target) {
      const r = target.getBoundingClientRect();
      setRect(r);
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [step, visible]);

  async function finish() {
    setVisible(false);
    if (onboardingUi) {
      await onboardingUi.completeTour();
    }
    router.replace("/dashboard");
  }

  function next() {
    if (step >= STEPS.length - 1) {
      void finish();
      return;
    }
    setStep((s) => s + 1);
  }

  if (!visible || !STEPS[step]) return null;

  const current = STEPS[step];

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px]"
        onClick={() => void finish()}
        aria-hidden="true"
      />

      {rect && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl ring-2 ring-primary shadow-[0_0_32px_rgba(52,211,153,0.35)]"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
          }}
        />
      )}

      <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
        <div className="border-glow-card rounded-2xl bg-background-card p-5 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Tour · {step + 1}/{STEPS.length}
          </p>
          <h3 className="mt-2 text-base font-semibold text-foreground">
            {current.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
            {current.body}
          </p>
          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => void finish()}
              className="cursor-pointer text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Saltar
            </button>
            <Button variant="accent" size="sm" onClick={next}>
              {step >= STEPS.length - 1 ? "Listo" : "Siguiente"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
