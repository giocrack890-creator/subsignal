/** Webhook de pagos desacoplado — actualiza profiles.plan vía service role */

import { backfillDraftsOnUpgrade } from "@/lib/drafts/auto-draft";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/types";

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

function verifyWebhookSecret(signature: string | null): boolean {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) return false;
  return signature === secret;
}

async function updateProfilePlan(input: {
  userId: string;
  plan: Plan;
  customerId?: string | null;
  subscriptionId?: string | null;
}): Promise<PaymentWebhookResult> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", input.userId)
    .maybeSingle();

  const previousPlan = (existing?.plan ?? "free") as Plan;

  const { error } = await supabase
    .from("profiles")
    .update({
      plan: input.plan,
      payment_customer_id: input.customerId ?? null,
      payment_subscription_id: input.subscriptionId ?? null,
    })
    .eq("id", input.userId);

  if (error) {
    throw new Error(`Error actualizando plan: ${error.message}`);
  }

  if (previousPlan === "free" && input.plan !== "free") {
    try {
      await backfillDraftsOnUpgrade(input.userId, input.plan);
    } catch {
      // No bloquear el webhook si el backfill falla
    }
  }

  return {
    handled: true,
    plan: input.plan,
    message: `Plan actualizado a ${input.plan}`,
  };
}

/**
 * Procesa eventos del proveedor de pagos.
 * En producción, reemplazar verifyWebhookSecret por la firma del proveedor (Stripe, etc.).
 */
export async function handlePaymentWebhook(
  body: unknown,
  signature: string | null
): Promise<PaymentWebhookResult> {
  if (!verifyWebhookSecret(signature)) {
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
