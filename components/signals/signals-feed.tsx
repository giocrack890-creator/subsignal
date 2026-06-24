"use client";

import { useCallback, useEffect, useState } from "react";
import { LoadMoreSignals } from "@/components/dashboard/load-more-signals";
import { SignalListCard } from "@/components/signals/signal-list-card";
import { SignalChatPanel } from "@/components/signals/signal-chat-panel";
import { SignalKeyboardNav } from "@/components/signals/signal-keyboard-nav";
import { useSignalPanelOptional } from "@/components/dashboard/signal-panel-context";
import {
  SignalsToolbar,
  type SignalsViewMode,
} from "@/components/signals/signals-toolbar";
import { SignalsEmptyState } from "@/components/signals/signals-empty-state";
import type { SignalsEmptyContext } from "@/lib/signals/page-stats";
import type { Plan, Signal } from "@/types";

const VIEW_STORAGE_KEY = "threadpulse_signals_view";

interface SignalsFeedProps {
  signals: Signal[];
  total: number;
  hasActiveFilters: boolean;
  hasMore: boolean;
  currentPage: number;
  baseParams: Record<string, string | undefined>;
  plan: Plan;
  emptyContext: SignalsEmptyContext;
  error?: string | null;
}

function getInitialView(): SignalsViewMode {
  if (typeof window === "undefined") return "cards";
  const stored = localStorage.getItem(VIEW_STORAGE_KEY);
  if (stored === "list" || stored === "cards") return stored;
  return window.innerWidth < 768 ? "list" : "cards";
}

export function SignalsFeed({
  signals,
  total,
  hasActiveFilters,
  hasMore,
  currentPage,
  baseParams,
  plan,
  emptyContext,
  error,
}: SignalsFeedProps) {
  const [viewMode, setViewMode] = useState<SignalsViewMode>("cards");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setViewMode(getInitialView());
    setHydrated(true);
  }, []);

  const handleViewChange = useCallback((mode: SignalsViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }, []);

  const panel = useSignalPanelOptional();

  const handleOpen = useCallback(
    (signal: Signal) => {
      panel?.openSignal(signal);
    },
    [panel]
  );

  const handleCopyDraft = useCallback((signal: Signal) => {
    if (signal.draft_reply) {
      void navigator.clipboard.writeText(signal.draft_reply);
    }
  }, []);

  if (error) {
    return (
      <>
        <SignalsToolbar
          viewMode={viewMode}
          onViewModeChange={handleViewChange}
        />
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-sm text-destructive">
          No pudimos cargar las señales: {error}
        </div>
      </>
    );
  }

  if (signals.length === 0 && hasActiveFilters) {
    return (
      <>
        <SignalsToolbar
          viewMode={viewMode}
          onViewModeChange={handleViewChange}
        />
        <SignalsEmptyState context={emptyContext} variant="no-results" />
      </>
    );
  }

  if (signals.length === 0) {
    return (
      <>
        <SignalsToolbar
          viewMode={viewMode}
          onViewModeChange={handleViewChange}
        />
        <SignalsEmptyState context={emptyContext} variant="no-signals" />
      </>
    );
  }

  const effectiveView = hydrated ? viewMode : "cards";
  const maxDelay = Math.min((signals.length - 1) * 50, 300);

  return (
    <>
      <SignalChatPanel />
      <SignalKeyboardNav
        signals={signals}
        onOpen={handleOpen}
        onCopyDraft={handleCopyDraft}
      />
      <SignalsToolbar
        viewMode={effectiveView}
        onViewModeChange={handleViewChange}
      />

      <ul className="mt-6 space-y-3">
        {signals.map((signal, index) => {
          const delay = Math.min(index * 50, maxDelay);
          return (
            <li key={signal.id}>
              <SignalListCard
                signal={signal}
                plan={plan}
                view={effectiveView}
                animationDelay={delay}
              />
            </li>
          );
        })}
      </ul>

      <LoadMoreSignals
        currentPage={currentPage}
        hasMore={hasMore}
        baseParams={baseParams}
      />

      {total > signals.length && (
        <p className="mt-4 text-center text-xs text-[#6B6B6B]">
          Mostrando {signals.length} de {total} señales
        </p>
      )}
    </>
  );
}
