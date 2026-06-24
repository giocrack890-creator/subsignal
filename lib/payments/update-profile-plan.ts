import { backfillDraftsOnUpgrade } from "@/lib/drafts/auto-draft";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/types";

export interface UpdateProfilePlanResult {
  handled: boolean;
  plan?: Plan;
  message: string;
}

export async function updateProfilePlan(input: {
  userId: string;
  plan: Plan;
  customerId?: string | null;
  subscriptionId?: string | null;
}): Promise<UpdateProfilePlanResult> {
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
