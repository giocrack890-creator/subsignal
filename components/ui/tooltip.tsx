"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 120);
  }

  function hide() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-border-medio bg-nivel-4 px-2.5 py-1.5 text-[11px] text-[#B4B4B4] animate-in fade-in duration-100",
            side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2 -translate-y-0.5",
            side === "bottom" && "top-full left-1/2 mt-2 -translate-x-1/2 translate-y-0.5",
            side === "left" && "right-full top-1/2 mr-2 -translate-y-1/2",
            side === "right" && "left-full top-1/2 ml-2 -translate-y-1/2"
          )}
        >
          {content}
          <span
            className={cn(
              "absolute left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-transparent",
              side === "top" &&
                "top-full border-t-nivel-4 border-l-transparent border-r-transparent border-b-transparent",
              side === "bottom" &&
                "bottom-full border-b-nivel-4 border-l-transparent border-r-transparent border-t-transparent",
              side === "left" &&
                "left-full top-1/2 -translate-y-1/2 border-l-nivel-4 border-t-transparent border-b-transparent border-r-transparent",
              side === "right" &&
                "right-full top-1/2 -translate-y-1/2 border-r-nivel-4 border-t-transparent border-b-transparent border-l-transparent"
            )}
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
}
