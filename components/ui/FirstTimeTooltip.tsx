"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FirstTimeTooltipProps {
  id: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
  className?: string;
}

const POSITION_CLASSES: Record<
  NonNullable<FirstTimeTooltipProps["position"]>,
  string
> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

const ARROW_CLASSES: Record<
  NonNullable<FirstTimeTooltipProps["position"]>,
  string
> = {
  top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-[#1E2D26]",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[#1E2D26]",
  left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-[#1E2D26]",
  right:
    "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-[#1E2D26]",
};

export function FirstTimeTooltip({
  id,
  content,
  position = "bottom",
  children,
  className,
}: FirstTimeTooltipProps) {
  const tooltipId = useId();
  const storageKey = `threadpulse_tooltip_${id}`;
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem(storageKey)) return;
    setVisible(true);
  }, [storageKey]);

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {children}
      {visible && (
        <div
          role="tooltip"
          id={tooltipId}
          className={cn(
            "absolute z-50 w-64 animate-in fade-in zoom-in-95 rounded-lg border border-[rgba(52,211,153,0.4)] bg-[#1E2D26] px-3.5 py-2.5 text-sm leading-relaxed text-[#B4B4B4] shadow-lg duration-200",
            POSITION_CLASSES[position]
          )}
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-1.5 right-1.5 rounded p-0.5 text-[#6B6B6B] hover:text-white"
            aria-label="Cerrar tooltip"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <p className="pr-5">{content}</p>
          <span
            className={cn("absolute h-0 w-0 border-4", ARROW_CLASSES[position])}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
