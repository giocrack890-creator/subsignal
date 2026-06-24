"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";
import type { Plan } from "@/types";

export const UPGRADE_BANNER_DISMISSED_KEY = "subsignal_upgrade_banner_dismissed";

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
    <div
      className="-mx-6 -mt-6 mb-6 flex items-center justify-between gap-4 border-b px-6 py-2.5 lg:-mx-8 lg:-mt-8"
      style={{
        backgroundColor: "rgba(52, 211, 153, 0.06)",
        borderColor: "rgba(52, 211, 153, 0.2)",
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Zap
          className="h-4 w-4 shrink-0 text-[#34D399]"
          aria-hidden="true"
        />
        <p className="text-sm leading-snug text-[#B4B4B4]">
          Estás en el plan Free — los drafts de respuesta y más plataformas están
          disponibles en Starter ($14.99/mes)
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/pricing"
          className="rounded-full bg-[#34D399] px-3.5 py-1.5 text-xs font-bold text-black transition-colors hover:bg-[#2bb88a]"
        >
          Ver planes
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[#6B6B6B] transition-colors hover:bg-white/5 hover:text-[#B4B4B4]"
          aria-label="Cerrar banner"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
