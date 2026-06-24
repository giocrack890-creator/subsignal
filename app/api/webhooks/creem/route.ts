import { NextResponse } from "next/server";
import { constructWebhookEventEntity } from "creem/webhooks";
import {
  extractCreemGrantPayload,
  toAppPlan,
} from "@/lib/payments/creem";
import { updateProfilePlan } from "@/lib/payments/update-profile-plan";

export async function POST(request: Request) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "CREEM_WEBHOOK_SECRET no configurado" },
      { status: 501 }
    );
  }

  const body = await request.text();

  let event;

  try {
    event = await constructWebhookEventEntity(body, request.headers, {
      secret,
    });
  } catch (error) {
    console.error("[webhooks/creem] Firma inválida:", error);
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  try {
    switch (event.eventType) {
      case "checkout.completed": {
        const payload = extractCreemGrantPayload({
          metadata: event.object.metadata,
          product: event.object.product,
          customer: event.object.customer,
          subscriptionId:
            typeof event.object.subscription === "string"
              ? event.object.subscription
              : event.object.subscription?.id ?? null,
        });

        if (payload) {
          await updateProfilePlan({
            userId: payload.userId,
            plan: toAppPlan(payload.plan),
            customerId: payload.customerId,
            subscriptionId: payload.subscriptionId,
          });
        }
        break;
      }

      case "subscription.active": {
        const payload = extractCreemGrantPayload({
          metadata: event.object.metadata,
          product: event.object.product,
          customer: event.object.customer,
          subscriptionId: event.object.id,
        });

        if (payload) {
          await updateProfilePlan({
            userId: payload.userId,
            plan: toAppPlan(payload.plan),
            customerId: payload.customerId,
            subscriptionId: payload.subscriptionId,
          });
        }
        break;
      }

      case "subscription.expired":
      case "subscription.canceled": {
        const userId = extractCreemGrantPayload({
          metadata: event.object.metadata,
          product: event.object.product,
          customer: event.object.customer,
          subscriptionId: event.object.id,
        })?.userId;

        if (userId) {
          await updateProfilePlan({
            userId,
            plan: "free",
            customerId:
              typeof event.object.customer === "string"
                ? event.object.customer
                : event.object.customer.id,
            subscriptionId: null,
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("[webhooks/creem] Error procesando evento:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
