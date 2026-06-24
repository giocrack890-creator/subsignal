import { Creem } from "creem";
import type { Plan } from "@/types";

export type CreemCheckoutPlan = Extract<Plan, "starter" | "pro">;

export function isCreemTestMode(): boolean {
  const flag = process.env.CREEM_TEST_MODE?.trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}

function parseCreemErrorBody(body: string | undefined): {
  message?: string;
  error?: string;
  code?: string;
} {
  if (!body) return {};
  try {
    const parsed = JSON.parse(body) as {
      message?: string;
      error?: string;
      code?: string;
    };
    return parsed;
  } catch {
    return { message: body };
  }
}

function isAccountNotReadyError(error: unknown): boolean {
  const text = formatCreemErrorForLog(error).toLowerCase();
  const accountHints = [
    "verification",
    "payout",
    "review",
    "not enabled",
    "not approved",
    "account",
    "kyc",
    "kyb",
    "live payments",
    "merchant",
  ];
  return accountHints.some((hint) => text.includes(hint));
}

export function getCreemStarterProductId(): string | undefined {
  return process.env.CREEM_PRODUCT_STARTER ?? process.env.CREEM_PRODUCT_SECRET;
}

export function isCreemConfigured(): boolean {
  return Boolean(
    process.env.CREEM_API_KEY &&
      getCreemStarterProductId() &&
      process.env.CREEM_PRODUCT_PRO
  );
}

export function getCreemClient(): Creem {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    throw new Error("CREEM_API_KEY no configurada");
  }

  return new Creem({
    apiKey,
    server: isCreemTestMode() ? "test" : "prod",
  });
}

export function getCreemProductId(plan: CreemCheckoutPlan): string {
  const productId =
    plan === "starter"
      ? getCreemStarterProductId()
      : process.env.CREEM_PRODUCT_PRO;

  if (!productId) {
    throw new Error(`CREEM_PRODUCT_${plan.toUpperCase()} no configurado`);
  }

  return productId;
}

export function planFromCreemProductId(productId: string): CreemCheckoutPlan | null {
  if (productId === getCreemStarterProductId()) return "starter";
  if (productId === process.env.CREEM_PRODUCT_PRO) return "pro";
  return null;
}

export function getCreemCheckoutErrorCode(error: unknown): string {
  if (isAccountNotReadyError(error)) return "checkout_account";

  if (error && typeof error === "object" && "statusCode" in error) {
    const statusCode = (error as { statusCode: number }).statusCode;
    if (statusCode === 401) return "checkout_auth";
    if (statusCode === 403) return "checkout_account";
    if (statusCode === 404) return "checkout_product";
    if (statusCode === 400) return "checkout_invalid";
  }
  return "checkout";
}

export function formatCreemErrorForLog(error: unknown): string {
  if (error && typeof error === "object") {
    const creemError = error as { message?: string; statusCode?: number; body?: string };
    const parsedBody = parseCreemErrorBody(creemError.body);
    const parts = [
      creemError.message,
      parsedBody.message,
      parsedBody.error,
      parsedBody.code,
      creemError.statusCode ? `status=${creemError.statusCode}` : null,
      creemError.body && !parsedBody.message ? `body=${creemError.body}` : null,
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(" | ");
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

export function parseCreemCheckoutPlan(value: string | null): CreemCheckoutPlan | null {
  if (value === "starter" || value === "pro") return value;
  return null;
}

function getProductIdFromObject(product: { id: string } | string): string {
  return typeof product === "string" ? product : product.id;
}

function getCustomerIdFromObject(
  customer: { id: string } | string | undefined
): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

export function resolvePlanFromMetadata(
  metadata: Record<string, unknown> | undefined,
  product: { id: string } | string
): CreemCheckoutPlan | null {
  const plan = metadata?.plan;
  if (plan === "starter" || plan === "pro") {
    return plan;
  }

  return planFromCreemProductId(getProductIdFromObject(product));
}

export function resolveUserIdFromMetadata(
  metadata: Record<string, unknown> | undefined
): string | null {
  const userId = metadata?.userId;
  return typeof userId === "string" && userId.length > 0 ? userId : null;
}

export async function createCreemCheckoutSession(input: {
  userId: string;
  email?: string | null;
  plan: CreemCheckoutPlan;
}): Promise<string> {
  const creem = getCreemClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkout = await creem.checkouts.create({
    productId: getCreemProductId(input.plan),
    requestId: `threadpulse_${input.userId}_${input.plan}`,
    successUrl: `${appUrl}/billing/success`,
    customer: input.email ? { email: input.email } : undefined,
    metadata: {
      userId: input.userId,
      plan: input.plan,
    },
  });

  if (!checkout.checkoutUrl) {
    throw new Error("Creem no devolvió checkoutUrl");
  }

  return checkout.checkoutUrl;
}

export function extractCreemGrantPayload(input: {
  metadata?: Record<string, unknown>;
  product: { id: string } | string;
  customer?: { id: string } | string;
  subscriptionId?: string | null;
}): { userId: string; plan: CreemCheckoutPlan; customerId: string | null; subscriptionId: string | null } | null {
  const userId = resolveUserIdFromMetadata(input.metadata);
  const plan = resolvePlanFromMetadata(input.metadata, input.product);

  if (!userId || !plan) return null;

  return {
    userId,
    plan,
    customerId: getCustomerIdFromObject(input.customer),
    subscriptionId: input.subscriptionId ?? null,
  };
}

export function toAppPlan(plan: CreemCheckoutPlan): Plan {
  return plan;
}
