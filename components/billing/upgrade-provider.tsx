"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import type { LimitFeature } from "@/lib/payments/plans";
import type { Plan } from "@/types";

interface UpgradeState {
  feature: LimitFeature;
  message?: string;
}

interface UpgradeContextValue {
  currentPlan: Plan;
  openUpgrade: (feature: LimitFeature, message?: string) => void;
  closeUpgrade: () => void;
}

const UpgradeContext = createContext<UpgradeContextValue | null>(null);

interface UpgradeProviderProps {
  currentPlan: Plan;
  children: ReactNode;
}

export function UpgradeProvider({ currentPlan, children }: UpgradeProviderProps) {
  const [state, setState] = useState<UpgradeState | null>(null);

  const openUpgrade = useCallback((feature: LimitFeature, message?: string) => {
    setState({ feature, message });
  }, []);

  const closeUpgrade = useCallback(() => {
    setState(null);
  }, []);

  const value = useMemo(
    () => ({ currentPlan, openUpgrade, closeUpgrade }),
    [currentPlan, openUpgrade, closeUpgrade]
  );

  return (
    <UpgradeContext.Provider value={value}>
      {children}
      {state && (
        <UpgradeModal
          currentPlan={currentPlan}
          feature={state.feature}
          message={state.message}
          onClose={closeUpgrade}
        />
      )}
    </UpgradeContext.Provider>
  );
}

export function useUpgradeModal(): UpgradeContextValue {
  const context = useContext(UpgradeContext);
  if (!context) {
    throw new Error("useUpgradeModal debe usarse dentro de UpgradeProvider");
  }
  return context;
}

/** Hook seguro fuera del provider (no abre modal) */
export function useUpgradeModalOptional(): UpgradeContextValue | null {
  return useContext(UpgradeContext);
}
