"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { DraftTone } from "@/lib/claude/tone";
import { cancelCreemSubscription } from "@/lib/payments/creem";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "./product";

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const fullName = (formData.get("full_name") as string)?.trim() || null;
  const notifyEmail = formData.get("notify_email") === "on";
  const notifySlack = formData.get("notify_slack") === "on";
  const notifyPush = formData.get("notify_push") === "on";
  const weeklyDigest = formData.get("weekly_digest") === "on";
  const slackWebhook = (formData.get("slack_webhook_url") as string)?.trim() || null;
  const minScoreRaw = parseInt(formData.get("min_intent_score") as string, 10);
  const minIntentScore = Number.isInteger(minScoreRaw)
    ? Math.min(10, Math.max(1, minScoreRaw))
    : 7;

  const scoreAdjustment = parseInt(formData.get("score_adjustment") as string, 10) || 0;
  const buyersOnlyDefault = formData.get("buyers_only_default") === "on";
  const anonymousDraftMode = formData.get("anonymous_draft_mode") === "on";
  const focusMode = formData.get("focus_mode") === "on";
  const sandboxMode = formData.get("sandbox_mode") === "on";
  const languageFilter = (formData.get("language_filter") as string) || "any";
  const apiWebhookUrl = (formData.get("api_webhook_url") as string)?.trim() || null;
  const onboardingVertical = (formData.get("onboarding_vertical") as string)?.trim() || null;
  const uiTheme = (formData.get("ui_theme") as string) || "dark";

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      notify_email: notifyEmail,
      notify_slack: notifySlack,
      notify_push: notifyPush,
      weekly_digest: weeklyDigest,
      slack_webhook_url: notifySlack ? slackWebhook : null,
      min_intent_score: minIntentScore,
      score_adjustment: Math.min(3, Math.max(0, scoreAdjustment)),
      buyers_only_default: buyersOnlyDefault,
      anonymous_draft_mode: anonymousDraftMode,
      focus_mode: focusMode,
      sandbox_mode: sandboxMode,
      language_filter: ["en", "es"].includes(languageFilter) ? languageFilter : "any",
      api_webhook_url: apiWebhookUrl,
      onboarding_vertical: ["saas_b2b", "agency", "indie"].includes(onboardingVertical ?? "")
        ? onboardingVertical
        : null,
      ui_theme: ["dark", "light", "hn"].includes(uiTheme) ? uiTheme : "dark",
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateDraftTone(tone: DraftTone): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ draft_tone: tone })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function cancelSubscription(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("payment_subscription_id")
    .eq("id", user.id)
    .single();

  const subscriptionId = profile?.payment_subscription_id;
  if (!subscriptionId) {
    return { success: false, error: "No tenés una suscripción activa para cancelar" };
  }

  try {
    await cancelCreemSubscription(subscriptionId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo cancelar en Creem";
    return { success: false, error: message };
  }

  revalidatePath("/settings");
  return {
    success: true,
    message:
      "Suscripción cancelada al final del período de facturación. Seguís con acceso hasta entonces.",
  };
}

export async function deleteAccount(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.auth.signOut();
  redirect("/");
}
