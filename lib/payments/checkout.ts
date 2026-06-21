/** Checkout desacoplado — conectar Stripe/Lemon/Paddle cuando se elija proveedor */

import type { Plan } from "@/types";
import { getPlanCatalog } from "./plans";

export interface CheckoutSession {
  url: string;
  plan: Plan;
}

/**
 * URL de checkout o pricing según el proveedor configurado.
 * Hoy redirige a /pricing hasta conectar pagos reales.
 */
export function getCheckoutUrl(targetPlan: Plan): string {
  const provider = process.env.PAYMENT_PROVIDER;

  if (provider === "stripe" && process.env.STRIPE_CHECKOUT_ENABLED === "true") {
    // Placeholder para integración futura con Stripe Checkout
    return `/api/billing/checkout?plan=${targetPlan}`;
  }

  return `/pricing?upgrade=${targetPlan}`;
}

export async function createCheckoutSession(
  targetPlan: Plan
): Promise<CheckoutSession> {
  const plan = getPlanCatalog(targetPlan);

  if (plan.id === "free") {
    throw new Error("No se puede hacer checkout del plan Free");
  }

  return {
    plan: targetPlan,
    url: getCheckoutUrl(targetPlan),
  };
}
