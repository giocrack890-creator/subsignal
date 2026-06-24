/** Checkout desacoplado — redirige a Creem cuando está configurado */

import type { Plan } from "@/types";
import { isCreemConfigured } from "./creem";

export interface CheckoutSession {
  url: string;
  plan: Plan;
}

export function getCheckoutUrl(targetPlan: Plan): string {
  if (targetPlan === "free") {
    return "/signup";
  }

  if (isCreemConfigured() && (targetPlan === "starter" || targetPlan === "pro")) {
    return `/api/billing/checkout?plan=${targetPlan}`;
  }

  return `/pricing?upgrade=${targetPlan}`;
}

export async function createCheckoutSession(
  targetPlan: Plan
): Promise<CheckoutSession> {
  if (targetPlan === "free") {
    throw new Error("No se puede hacer checkout del plan Free");
  }

  return {
    plan: targetPlan,
    url: getCheckoutUrl(targetPlan),
  };
}
