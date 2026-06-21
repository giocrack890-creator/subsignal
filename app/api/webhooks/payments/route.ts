import { NextResponse } from "next/server";
import {
  handlePaymentWebhook,
  isPaymentWebhookConfigured,
} from "@/lib/payments/webhook";

export async function POST(request: Request) {
  if (!isPaymentWebhookConfigured()) {
    return NextResponse.json(
      {
        message:
          "Webhook de pagos no configurado. Definí PAYMENT_WEBHOOK_SECRET en .env.local",
        example: {
          type: "subscription.updated",
          userId: "<uuid>",
          plan: "starter",
          customerId: "cus_...",
          subscriptionId: "sub_...",
        },
      },
      { status: 501 }
    );
  }

  const signature = request.headers.get("x-payment-signature");
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    const result = await handlePaymentWebhook(body, signature);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    const status = message.includes("no autorizado") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
