"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { OnboardingUiPreferences } from "@/lib/onboarding/preferences";

interface OnboardingUiContextValue extends OnboardingUiPreferences {
  dismissTooltip: (tooltipId: string) => Promise<void>;
  completeTour: () => Promise<void>;
  dismissSetupCelebration: () => Promise<void>;
}

const OnboardingUiContext = createContext<OnboardingUiContextValue | null>(
  null
);

export function useOnboardingUi() {
  const ctx = useContext(OnboardingUiContext);
  if (!ctx) {
    throw new Error("useOnboardingUi debe usarse dentro de OnboardingUiProvider");
  }
  return ctx;
}

export function useOnboardingUiOptional() {
  return useContext(OnboardingUiContext);
}

async function postPreference(
  body: Record<string, string>
): Promise<void> {
  const res = await fetch("/api/onboarding/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("No se pudo guardar la preferencia");
  }
}

interface OnboardingUiProviderProps {
  initial: OnboardingUiPreferences;
  children: ReactNode;
}

export function OnboardingUiProvider({
  initial,
  children,
}: OnboardingUiProviderProps) {
  const [prefs, setPrefs] = useState(initial);

  const dismissTooltip = useCallback(async (tooltipId: string) => {
    setPrefs((prev) => ({
      ...prev,
      tooltipsDismissed: prev.tooltipsDismissed.includes(tooltipId)
        ? prev.tooltipsDismissed
        : [...prev.tooltipsDismissed, tooltipId],
    }));
    await postPreference({ type: "dismiss_tooltip", tooltipId });
  }, []);

  const completeTour = useCallback(async () => {
    setPrefs((prev) => ({ ...prev, guidedTourCompleted: true }));
    await postPreference({ type: "complete_tour" });
  }, []);

  const dismissSetupCelebration = useCallback(async () => {
    setPrefs((prev) => ({ ...prev, setupCelebrationSeen: true }));
    await postPreference({ type: "dismiss_setup_celebration" });
  }, []);

  const value = useMemo(
    () => ({
      ...prefs,
      dismissTooltip,
      completeTour,
      dismissSetupCelebration,
    }),
    [prefs, dismissTooltip, completeTour, dismissSetupCelebration]
  );

  return (
    <OnboardingUiContext.Provider value={value}>
      {children}
    </OnboardingUiContext.Provider>
  );
}
