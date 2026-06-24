"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { dismissSignalWithReason } from "@/lib/actions/signals";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DISMISS_REASONS = [
  { value: "not_target", label: "No es mi cliente objetivo" },
  { value: "already_replied", label: "Ya respondí este post" },
  { value: "wrong_problem", label: "El problema no es el que resuelvo" },
] as const;

interface DismissSignalButtonProps {
  signalId: string;
  disabled?: boolean;
  onDismissed?: () => void;
  className?: string;
  variant?: "ghost" | "outline";
}

export function DismissSignalButton({
  signalId,
  disabled,
  onDismissed,
  className,
  variant = "ghost",
}: DismissSignalButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleSelect(reason: string) {
    setOpen(false);
    startTransition(async () => {
      await dismissSignalWithReason(signalId, reason);
      onDismissed?.();
    });
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        variant={variant}
        size="sm"
        type="button"
        disabled={disabled || isPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={variant === "ghost" ? "text-foreground-muted" : undefined}
      >
        Descartar
      </Button>
      {open && (
        <div
          className="absolute bottom-full left-0 z-50 mb-1 min-w-[220px] overflow-hidden rounded-lg border border-[#232323] bg-[#1A1A1A] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {DISMISS_REASONS.map((reason) => (
            <button
              key={reason.value}
              type="button"
              className="block w-full px-3.5 py-2 text-left text-sm text-[#B4B4B4] transition-colors hover:bg-[#232323]"
              onClick={() => handleSelect(reason.value)}
            >
              {reason.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
