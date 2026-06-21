"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface OnboardingRedirectProps {
  isComplete: boolean;
}

export function OnboardingRedirect({ isComplete }: OnboardingRedirectProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isComplete && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
    if (isComplete && pathname === "/onboarding") {
      router.replace("/dashboard");
    }
  }, [isComplete, pathname, router]);

  return null;
}
