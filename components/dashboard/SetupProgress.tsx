"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Check, ChevronDown } from "lucide-react";
import { useOnboardingUiOptional } from "@/components/onboarding/onboarding-ui-provider";
import type { SetupProgressState } from "@/lib/setup/progress";
import { cn } from "@/lib/utils";

interface SetupStep {
  id: string;
  label: string;
  done: boolean;
}

interface SetupProgressProps {
  state: SetupProgressState;
}

export function SetupProgress({ state }: SetupProgressProps) {
  const onboardingUi = useOnboardingUiOptional();
  const [expanded, setExpanded] = useState(false);
  const celebrationSeen = onboardingUi?.setupCelebrationSeen ?? false;
  const [localDismissed, setLocalDismissed] = useState(false);
  const dismissed = celebrationSeen || localDismissed;

  const steps: SetupStep[] = useMemo(
    () => [
      { id: "product", label: "Describí tu producto", done: state.setupProductDone },
      { id: "keyword", label: "Agregá una keyword", done: state.setupKeywordDone },
      { id: "signal", label: "Primera señal recibida", done: state.setupSignalReceived },
      { id: "draft", label: "Copiaste tu primer draft", done: state.setupDraftCopied },
      {
        id: "complete",
        label: "Setup completo",
        done:
          state.setupProductDone &&
          state.setupKeywordDone &&
          state.setupSignalReceived &&
          state.setupDraftCopied,
      },
    ],
    [state]
  );

  const completedCount = steps.filter((step) => step.done).length;
  const progressPercent = (completedCount / steps.length) * 100;
  const nextStep = steps.find((step) => !step.done);

  useEffect(() => {
    if (!state.setupCompleted || dismissed) return;

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.3 },
      colors: ["#34D399", "#86EFAC", "#ffffff"],
    });

    const timer = window.setTimeout(() => {
      setLocalDismissed(true);
      void onboardingUi?.dismissSetupCelebration();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [state.setupCompleted, dismissed, onboardingUi]);

  if (dismissed) return null;

  if (state.setupCompleted) {
    return (
      <div
        className="mt-4 flex items-center gap-3 rounded-lg border border-border-sutil bg-nivel-3/60 px-4 py-2.5"
        aria-live="polite"
      >
        <Check className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
        <p className="text-[12px] text-[#B4B4B4]">
          Setup completo — el monitoreo está activo por vos.
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded-lg border border-border-sutil bg-nivel-3/60"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-medium text-white">
              Completá tu setup
              {!expanded && nextStep && (
                <span className="ml-1.5 font-normal text-[#6B6B6B]">
                  · {nextStep.label}
                </span>
              )}
            </p>
            <span className="shrink-0 text-[11px] tabular-nums text-[#6B6B6B]">
              {completedCount}/{steps.length}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-nivel-5">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#6B6B6B] transition-transform",
            expanded && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <ul className="border-t border-border-sutil px-4 py-3 space-y-2">
          {steps.map((step) => (
            <li
              key={step.id}
              className={cn(
                "flex items-center gap-2 text-[11px]",
                step.done ? "text-white" : "text-[#6B6B6B]"
              )}
            >
              {step.done ? (
                <Check
                  className="h-3 w-3 shrink-0 text-accent"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="inline-flex h-3 w-3 shrink-0 rounded-full border border-[#4B4B4B]"
                  aria-hidden="true"
                />
              )}
              {step.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
