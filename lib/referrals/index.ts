import { createAdminClient } from "@/lib/supabase/admin";
import { randomBytes } from "crypto";

function generateReferralCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function ensureReferralCode(userId: string): Promise<string> {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .single();

  if (profile?.referral_code) return profile.referral_code;

  let code = generateReferralCode();
  for (let i = 0; i < 5; i++) {
    const { error } = await supabase
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", userId);

    if (!error) return code;
    code = generateReferralCode();
  }

  return code;
}

export async function applyReferralCode(
  newUserId: string,
  code: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient();
  const normalized = code.trim().toUpperCase();

  const { data: referrer } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", normalized)
    .maybeSingle();

  if (!referrer || referrer.id === newUserId) {
    return { ok: false, error: "Código inválido" };
  }

  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_id", newUserId)
    .maybeSingle();

  if (existing) return { ok: false, error: "Ya usaste un código de referido" };

  await supabase.from("referrals").insert({
    referrer_id: referrer.id,
    referred_id: newUserId,
  });

  await supabase
    .from("profiles")
    .update({ referred_by: referrer.id })
    .eq("id", newUserId);

  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 30);

  await supabase
    .from("profiles")
    .update({ plan: "pro", trial_ends_at: trialEnds.toISOString() })
    .eq("id", referrer.id);

  await supabase
    .from("referrals")
    .update({ reward_granted: true })
    .eq("referrer_id", referrer.id)
    .eq("referred_id", newUserId);

  return { ok: true };
}

export async function grantLifetimeDeal(userId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({
      plan: "pro",
      ltd_purchased_at: new Date().toISOString(),
      payment_subscription_id: null,
    })
    .eq("id", userId);
}
