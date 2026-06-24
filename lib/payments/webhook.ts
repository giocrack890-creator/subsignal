/** Webhook de pagos desacoplado — actualiza profiles.plan vía service role */

import type { Plan } from "@/types";
import { updateProfilePlan } from "@/lib/payments/update-profile-plan";

const VALID_PLANS: Plan[] = ["free", "starter", "growth", "pro"];

export interface PaymentWebhookEvent {
  type: string;
  customerId?: string;
  subscriptionId?: string;
  userId?: string;
  plan?: string;
}

export interface PaymentWebhookResult {
  handled: boolean;
  plan?: Plan;
  message: string;
}

function parsePlan(value: string | undefined): Plan | null {
  if (!value || !VALID_PLANS.includes(value as Plan)) {
    return null;
  }
  return value as Plan;
}

export async function handlePaymentWebhook(
  body: unknown,
  signature: string | null
): Promise<PaymentWebhookResult> {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret || signature !== secret) {
    throw new Error("Webhook no autorizado");
  }

  const event = body as PaymentWebhookEvent;
  const plan = parsePlan(event.plan);

  if (!plan) {
    return {
      handled: false,
      message: "Evento ignorado: plan inválido o ausente",
    };
  }

  if (!event.userId) {
    return {
      handled: false,
      message: "Evento ignorado: falta userId",
    };
  }

  return updateProfilePlan({
    userId: event.userId,
    plan,
    customerId: event.customerId ?? null,
    subscriptionId: event.subscriptionId ?? null,
  });
}

/** Indica si el webhook está listo para recibir eventos reales */
export function isPaymentWebhookConfigured(): boolean {
  return Boolean(process.env.PAYMENT_WEBHOOK_SECRET);
}
