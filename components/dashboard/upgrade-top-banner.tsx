"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";
import type { Plan } from "@/types";

export const UPGRADE_BANNER_DISMISSED_KEY = "threadpulse_upgrade_banner_dismissed";

interface UpgradeTopBannerProps {
  plan: Plan;
}

export function UpgradeTopBanner({ plan }: UpgradeTopBannerProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (plan !== "free") {
      setDismissed(true);
      return;
    }

    setDismissed(localStorage.getItem(UPGRADE_BANNER_DISMISSED_KEY) === "1");
  }, [plan]);

  if (plan !== "free" || dismissed) {
    return null;
  }

  function handleDismiss() {
    localStorage.setItem(UPGRADE_BANNER_DISMISSED_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-border-sutil bg-nivel-3/80 px-3 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Zap className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-[11px] leading-snug text-[#6B6B6B]">
          Plan Free — drafts y Reddit en{" "}
          <Link href="/pricing" className="text-accent hover:underline">
            Starter
          </Link>
        </p>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#4B4B4B] transition-colors hover:bg-nivel-4 hover:text-[#B4B4B4]"
        aria-label="Cerrar banner"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
