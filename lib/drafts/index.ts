/** Generación de borradores con Claude + verificación de límites por plan */

import { getAnthropicClient, DRAFT_MODEL } from "@/lib/claude/client";
import { buildDraftUserPrompt, DRAFT_SYSTEM_PROMPT } from "@/lib/claude/prompts";
import { checkAiDraftLimit } from "@/lib/payments/checks";
import { createAdminClient } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/utils/retry";
import type { Plan, Platform, UserProduct } from "@/types";

type ProductContext = Pick<
  UserProduct,
  "name" | "description" | "target_customer" | "pain_points"
>;

interface DraftPostInput {
  title: string | null;
  body: string | null;
  platform: Platform;
  intent_reason?: string | null;
}

export interface DraftLimitCheck {
  allowed: boolean;
  reason?: string;
  used?: number;
  limit?: number | null;
}

export interface GenerateDraftResult {
  success: boolean;
  draft?: string;
  error?: string;
  limitReached?: boolean;
}

function startOfCurrentMonth(): string {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

export async function countDraftsThisMonth(userId: string): Promise<number> {
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("signals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("draft_reply", "is", null)
    .neq("draft_reply", "")
    .gte("found_at", startOfCurrentMonth());

  return count ?? 0;
}

export async function checkDraftLimit(
  plan: Plan,
  userId: string
): Promise<DraftLimitCheck> {
  const used = await countDraftsThisMonth(userId);
  const result = checkAiDraftLimit({ plan, draftsUsedThisMonth: used });

  return {
    allowed: result.allowed,
    limit: result.limit,
    used: result.used,
    reason: result.message,
  };
}

export async function generateDraftReply(input: {
  post: DraftPostInput;
  product: ProductContext;
}): Promise<string> {
  const client = getAnthropicClient();

  return withRetry(
    async () => {
      const message = await client.messages.create({
        model: DRAFT_MODEL,
        max_tokens: 512,
        system: DRAFT_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildDraftUserPrompt(input.post, input.product),
          },
        ],
      });

      const block = message.content.find((b) => b.type === "text");
      if (!block || block.type !== "text") {
        throw new Error("Respuesta vacía de Claude");
      }

      const draft = block.text.trim();
      if (!draft) {
        throw new Error("Borrador vacío");
      }

      return draft;
    },
    { label: "Claude draft generation" }
  );
}

interface SignalDraftRow {
  id: string;
  user_id: string;
  title: string | null;
  body: string | null;
  platform: Platform;
  draft_reply: string | null;
  intent_reason: string | null;
  keywords: {
    user_products: ProductContext;
  } | null;
}

async function loadSignalForDraft(
  signalId: string,
  userId: string
): Promise<{ signal: SignalDraftRow; product: ProductContext } | null> {
  const supabase = createAdminClient();

  const { data: signal, error } = await supabase
    .from("signals")
    .select(
      `
      id,
      user_id,
      title,
      body,
      platform,
      draft_reply,
      intent_reason,
      keywords (
        user_products (
          name,
          description,
          target_customer,
          pain_points
        )
      )
    `
    )
    .eq("id", signalId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !signal) {
    return null;
  }

  const row = signal as unknown as SignalDraftRow;
  const product =
    row.keywords?.user_products ??
    (await loadActiveProduct(userId));

  if (!product) {
    return null;
  }

  return { signal: row, product };
}

async function loadActiveProduct(userId: string): Promise<ProductContext | null> {
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("user_products")
    .select("name, description, target_customer, pain_points")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!product) {
    return null;
  }

  return {
    ...product,
    pain_points: product.pain_points ?? [],
  };
}

export async function generateDraftForSignal(input: {
  signalId: string;
  userId: string;
  plan: Plan;
  regenerate?: boolean;
}): Promise<GenerateDraftResult> {
  const { signalId, userId, plan, regenerate = false } = input;

  const loaded = await loadSignalForDraft(signalId, userId);
  if (!loaded) {
    return { success: false, error: "Señal no encontrada" };
  }

  const { signal, product } = loaded;

  if (signal.draft_reply?.trim() && !regenerate) {
    return { success: true, draft: signal.draft_reply.trim() };
  }

  const limitCheck = await checkDraftLimit(plan, userId);
  if (!limitCheck.allowed) {
    return {
      success: false,
      error: limitCheck.reason,
      limitReached: true,
    };
  }

  let draft: string;
  try {
    draft = await generateDraftReply({
      post: {
        title: signal.title,
        body: signal.body,
        platform: signal.platform,
        intent_reason: signal.intent_reason,
      },
      product,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Error generando borrador: ${msg}` };
  }

  const supabase = createAdminClient();
  const { error: updateError } = await supabase
    .from("signals")
    .update({ draft_reply: draft })
    .eq("id", signalId)
    .eq("user_id", userId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, draft };
}
