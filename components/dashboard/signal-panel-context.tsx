"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SignalPanel } from "@/components/dashboard/SignalPanel";
import type { Plan, Signal } from "@/types";

interface SignalPanelContextValue {
  openSignal: (signal: Signal) => void;
  closePanel: () => void;
  activeSignal: Signal | null;
}

const SignalPanelContext = createContext<SignalPanelContextValue | null>(null);

export function SignalPanelProvider({
  children,
  plan,
}: {
  children: ReactNode;
  plan: Plan;
}) {
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);

  const openSignal = useCallback((signal: Signal) => {
    setActiveSignal(signal);
  }, []);

  const closePanel = useCallback(() => {
    setActiveSignal(null);
  }, []);

  const value = useMemo(
    () => ({ openSignal, closePanel, activeSignal }),
    [openSignal, closePanel, activeSignal]
  );

  return (
    <SignalPanelContext.Provider value={value}>
      {children}
      <SignalPanel
        signal={activeSignal}
        plan={plan}
        onClose={closePanel}
        onSignalChange={setActiveSignal}
      />
    </SignalPanelContext.Provider>
  );
}

export function useSignalPanel() {
  const ctx = useContext(SignalPanelContext);
  if (!ctx) {
    throw new Error("useSignalPanel debe usarse dentro de SignalPanelProvider");
  }
  return ctx;
}

export function useSignalPanelOptional() {
  return useContext(SignalPanelContext);
}
