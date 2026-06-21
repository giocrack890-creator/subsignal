"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PRICING_FAQ } from "@/lib/payments/plan-comparison";

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl divide-y divide-border rounded-2xl border border-border bg-background-card">
      {PRICING_FAQ.map((item, i) => {
        const isOpen = openIndex === i;

        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-background-card-hover"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="text-[15px] font-semibold text-foreground">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-foreground-muted transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <p className="px-5 pb-4 text-[15px] leading-relaxed text-foreground-secondary">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
