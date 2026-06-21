import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export interface OnboardingStatus {
  hasProduct: boolean;
  keywordCount: number;
  isComplete: boolean;
  productId: string | null;
}

export async function getOnboardingStatus(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<OnboardingStatus> {
  const { data: product } = await supabase
    .from("user_products")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  const { count } = await supabase
    .from("keywords")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const keywordCount = count ?? 0;

  return {
    hasProduct: !!product,
    keywordCount,
    isComplete: !!product && keywordCount > 0,
    productId: product?.id ?? null,
  };
}
