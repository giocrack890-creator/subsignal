"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  const slackWebhook = (formData.get("slack_webhook_url") as string)?.trim() || null;
  const minScoreRaw = parseInt(formData.get("min_intent_score") as string, 10);
  const minIntentScore = Number.isInteger(minScoreRaw)
    ? Math.min(10, Math.max(1, minScoreRaw))
    : 7;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      notify_email: notifyEmail,
      notify_slack: notifySlack,
      slack_webhook_url: notifySlack ? slackWebhook : null,
      min_intent_score: minIntentScore,
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
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
