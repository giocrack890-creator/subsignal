"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";
import type { SetupProgressState } from "@/lib/setup/progress";

const CELEBRATION_KEY = "subsignal_setup_celebrated";

interface SetupStep {
  id: string;
  label: string;
  done: boolean;
}

interface SetupProgressProps {
  state: SetupProgressState;
}

export function SetupProgress({ state }: SetupProgressProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      state.setupCompleted &&
      window.localStorage.getItem(CELEBRATION_KEY) === "1"
    );
  });

  const steps: SetupStep[] = useMemo(
    () => [
      {
        id: "product",
        label: "Describí tu producto",
        done: state.setupProductDone,
      },
      {
        id: "keyword",
        label: "Agregá una keyword",
        done: state.setupKeywordDone,
      },
      {
        id: "signal",
        label: "Primera señal recibida",
        done: state.setupSignalReceived,
      },
      {
        id: "draft",
        label: "Copiaste tu primer draft",
        done: state.setupDraftCopied,
      },
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

  useEffect(() => {
    if (!state.setupCompleted || dismissed) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.25 },
      colors: ["#34D399", "#86EFAC", "#ffffff"],
    });

    const timer = window.setTimeout(() => {
      window.localStorage.setItem(CELEBRATION_KEY, "1");
      setDismissed(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [state.setupCompleted, dismissed]);

  if (dismissed) {
    return null;
  }

  if (state.setupCompleted) {
    return (
      <div
        className="mb-6 rounded-xl border border-[#232323] bg-[#111714] p-4"
        aria-live="polite"
      >
        <div className="text-center">
          <p className="text-sm font-medium text-white">
            ¡Setup completo! SubSignal está trabajando para vos.
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#232323]">
            <div
              className="h-full w-full rounded-full bg-gradient-to-r from-[#34D399] to-[rgba(52,211,153,0.6)] transition-all duration-[600ms] ease-out"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mb-6 rounded-xl border border-[#232323] bg-[#111714] p-4"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white">Completá tu setup</p>
        <p className="text-xs text-[#6B6B6B]">
          {completedCount} de {steps.length} pasos completados
        </p>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#232323]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#34D399] to-[rgba(52,211,153,0.6)] transition-all duration-[600ms] ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-5">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`flex items-center gap-2 text-xs ${
              step.done ? "text-white" : "text-[#6B6B6B]"
            }`}
          >
            {step.done ? (
              <Check
                className="h-3.5 w-3.5 shrink-0 text-[#34D399]"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            ) : (
              <span
                className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-[#6B6B6B] text-[9px]"
                aria-hidden="true"
              >
                ○
              </span>
            )}
            <span className="leading-snug">{step.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
