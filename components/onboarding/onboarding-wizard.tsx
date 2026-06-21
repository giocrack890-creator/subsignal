"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { ProductForm } from "@/components/keywords/product-form";
import { KeywordForm } from "@/components/keywords/keyword-form";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import type { Plan, UserProduct } from "@/types";

interface OnboardingWizardProps {
  product: UserProduct | null;
  productId: string | null;
  plan: Plan;
  initialStep: 1 | 2;
  userName?: string;
}

export function OnboardingWizard({
  product,
  productId,
  plan,
  initialStep,
  userName,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(initialStep);
  const [savedProductId, setSavedProductId] = useState<string | null>(productId);
  const [, startTransition] = useTransition();

  function handleProductSaved(id: string) {
    setSavedProductId(id);
    setStep(2);
  }

  function handleKeywordCreated() {
    startTransition(() => {
      router.push("/dashboard?welcome=1");
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-lg">
      {/* Welcome */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-muted-bg">
          <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {step === 1 ? "Bienvenido a SubSignal" : "Casi listo"}
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          {userName ? `Hola, ${userName.split(" ")[0]}. ` : ""}
          {step === 1
            ? "Contanos sobre tu producto para que la IA detecte las señales correctas."
            : "Agregá tu primera keyword y empezamos a monitorear Hacker News."}
        </p>
        <div className="mt-3 flex justify-center">
          <PlanBadge plan={plan} />
        </div>
      </div>

      {/* Card principal */}
      <div className="border-glow-card rounded-2xl bg-background-card p-6 sm:p-8">
        <ProgressBar step={step} />

        {step === 1 ? (
          <>
            <div className="mb-6">
              <StepBadge n={1} total={2} />
              <h2 className="mt-3 text-xl font-semibold text-foreground">
                Contanos sobre tu producto
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                Este contexto alimenta el scoring de intención y los borradores de
                respuesta con IA.
              </p>
            </div>
            <ProductForm
              product={product}
              onSuccess={handleProductSaved}
              submitLabel="Continuar"
            />
          </>
        ) : (
          <>
            <div className="mb-6">
              <StepBadge n={2} total={2} />
              <h2 className="mt-3 text-xl font-semibold text-foreground">
                Tu primera keyword
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                Elegí qué buscar en Hacker News. Podés agregar más después en
                Keywords.
              </p>
            </div>
            {savedProductId && (
              <KeywordForm
                productId={savedProductId}
                plan={plan}
                onSuccess={handleKeywordCreated}
                submitLabel="Empezar a monitorear"
                ctaVariant="accent"
                showArrow
              />
            )}
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-foreground-muted">
        Paso {step} de 2 · El cron escanea HN cada 15 minutos
      </p>
    </div>
  );
}

function StepBadge({ n, total }: { n: number; total: number }) {
  return (
    <span className="inline-flex rounded-full border border-primary/25 bg-primary-muted-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
      Paso {n} de {total}
    </span>
  );
}

function ProgressBar({ step }: { step: 1 | 2 }) {
  const pct = step === 1 ? 50 : 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-xs font-medium">
        <span className={step >= 1 ? "text-primary" : "text-foreground-muted"}>
          Producto
        </span>
        <span className={step >= 2 ? "text-primary" : "text-foreground-muted"}>
          Keyword
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
