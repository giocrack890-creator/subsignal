"use client";

import { useEffect } from "react";
import type { Signal } from "@/types";

interface SignalKeyboardNavProps {
  signals: Signal[];
  onCopyDraft: (signal: Signal) => void;
  onOpen: (signal: Signal) => void;
}

export function SignalKeyboardNav({
  signals,
  onCopyDraft,
  onOpen,
}: SignalKeyboardNavProps) {
  useEffect(() => {
    let index = 0;

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key === "j") {
        e.preventDefault();
        index = Math.min(signals.length - 1, index + 1);
        onOpen(signals[index]);
      } else if (e.key === "k") {
        e.preventDefault();
        index = Math.max(0, index - 1);
        onOpen(signals[index]);
      } else if (e.key === "c") {
        e.preventDefault();
        const signal = signals[index];
        if (signal?.draft_reply) onCopyDraft(signal);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [signals, onCopyDraft, onOpen]);

  return (
    <p className="hidden text-xs text-foreground-secondary lg:block">
      Atajos: <kbd className="rounded bg-nivel-3 px-1">j</kbd>/
      <kbd className="rounded bg-nivel-3 px-1">k</kbd> navegar ·{" "}
      <kbd className="rounded bg-nivel-3 px-1">c</kbd> copiar draft
    </p>
  );
}
