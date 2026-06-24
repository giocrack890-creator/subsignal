/** Webhook de pagos — actualiza profiles.plan vía service role */

import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/types";
import {
  getStripe,
  isStripeWebhookConfigured,
  planFromStripePriceId,
} from "./stripe";
import { backfillDraftsOnUpgrade } from "@/lib/drafts/auto-draft";

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

async function resolveUserIdFromCustomer(customerId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("payment_customer_id", customerId)
    .maybeSingle();

  return data?.id ?? null;
}

function getSubscriptionPriceId(subscription: Stripe.Subscription): string | null {
  const priceId = subscription.items.data[0]?.price?.id;
  return priceId ?? null;
}

function stripeId(
  value: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if ("id" in value && typeof value.id === "string") return value.id;
  return null;
}

/**
 * Procesa eventos del proveedor genérico (testing / manual).
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

/**
 * Procesa webhooks firmados de Stripe.
 */
export async function handleStripeWebhook(
  rawBody: string,
  signature: string | null
): Promise<PaymentWebhookResult> {
  if (!isStripeWebhookConfigured() || !signature) {
    throw new Error("Webhook no autorizado");
  }

  const stripe = getStripe();
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = parsePlan(session.metadata?.plan);

      if (!userId || !plan) {
        return {
          handled: false,
          message: "checkout.session.completed sin userId o plan en metadata",
        };
      }

      return updateProfilePlan({
        userId,
        plan,
        customerId: stripeId(session.customer as string | null),
        subscriptionId: stripeId(session.subscription as string | null),
      });
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId =
        subscription.metadata?.userId ??
        (await resolveUserIdFromCustomer(stripeId(subscription.customer as string) ?? ""));

      if (!userId) {
        return {
          handled: false,
          message: "subscription.updated sin usuario asociado",
        };
      }

      if (subscription.status === "canceled" || subscription.status === "unpaid") {
        return updateProfilePlan({
          userId,
          plan: "free",
          customerId: stripeId(subscription.customer as string),
          subscriptionId: null,
        });
      }

      const priceId = getSubscriptionPriceId(subscription);
      const plan = priceId ? planFromStripePriceId(priceId) : null;

      if (!plan) {
        return {
          handled: false,
          message: "subscription.updated con price desconocido",
        };
      }

      return updateProfilePlan({
        userId,
        plan,
        customerId: stripeId(subscription.customer as string),
        subscriptionId: subscription.id,
      });
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId =
        subscription.metadata?.userId ??
        (await resolveUserIdFromCustomer(stripeId(subscription.customer as string) ?? ""));

      if (!userId) {
        return {
          handled: false,
          message: "subscription.deleted sin usuario asociado",
        };
      }

      return updateProfilePlan({
        userId,
        plan: "free",
        customerId: stripeId(subscription.customer as string),
        subscriptionId: null,
      });
    }

    default:
      return {
        handled: false,
        message: `Evento Stripe ignorado: ${event.type}`,
      };
  }
}

/** Indica si el webhook genérico está listo para recibir eventos */
export function isPaymentWebhookConfigured(): boolean {
  return Boolean(process.env.PAYMENT_WEBHOOK_SECRET);
}
