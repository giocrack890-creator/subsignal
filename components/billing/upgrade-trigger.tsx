"use client";

import { useUpgradeModal } from "@/components/billing/upgrade-provider";
import { Button } from "@/components/ui/button";
import type { LimitFeature } from "@/lib/payments/plans";

interface UpgradeTriggerProps {
  feature: LimitFeature;
  message?: string;
  label?: string;
  variant?: "accent" | "outline" | "ghost";
  size?: "sm" | "md";
}

export function UpgradeTrigger({
  feature,
  message,
  label = "Actualizar plan",
  variant = "accent",
  size = "sm",
}: UpgradeTriggerProps) {
  const { openUpgrade } = useUpgradeModal();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => openUpgrade(feature, message)}
    >
      {label}
    </Button>
  );
}
