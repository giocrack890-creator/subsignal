"use server";

import { revalidatePath } from "next/cache";
import { generateDraftForSignal as generateDraft } from "@/lib/drafts";
import { computeFollowUpReminderAt } from "@/lib/cron/follow-up-reminders";
import { createClient } from "@/lib/supabase/server";
import { markSetupDraftCopied } from "@/lib/setup/progress";
import type { Plan, SignalStatus } from "@/types";
import type { ActionResult } from "./product";

export interface DraftActionResult extends ActionResult {
  draft?: string;
  limitReached?: boolean;
}

export async function updateSignalStatus(
  signalId: string,
  status: SignalStatus
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .from("signals")
    .update({ status })
    .eq("id", signalId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/signals");
  revalidatePath("/drafts");
  revalidatePath("/analytics");
  return { success: true };
}

export async function dismissSignal(signalId: string): Promise<ActionResult> {
  return updateSignalStatus(signalId, "dismissed");
}

export async function dismissSignalWithReason(
  signalId: string,
  reason: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { data: existing } = await supabase
    .from("signals")
    .select("status")
    .eq("id", signalId)
    .eq("user_id", user.id)
    .single();

  const { error } = await supabase
    .from("signals")
    .update({
      status: "dismissed",
      dismiss_reason: reason,
      previous_status: existing?.status ?? "new",
    })
    .eq("id", signalId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/signals");
  revalidatePath("/drafts");
  revalidatePath("/analytics");
  return { success: true };
}

export async function undoDismissSignal(signalId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { data: signal } = await supabase
    .from("signals")
    .select("previous_status, status")
    .eq("id", signalId)
    .eq("user_id", user.id)
    .single();

  if (!signal || signal.status !== "dismissed") {
    return { success: false, error: "Esta señal no está descartada" };
  }

  const restoreStatus = signal.previous_status ?? "new";

  const { error } = await supabase
    .from("signals")
    .update({
      status: restoreStatus,
      dismiss_reason: null,
      previous_status: null,
    })
    .eq("id", signalId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/signals");
  return { success: true };
}

export async function updateSignalLead(
  signalId: string,
  input: {
    isLead?: boolean;
    leadStage?: string | null;
    leadNotes?: string | null;
    assignedTo?: string | null;
  }
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const update: {
    is_lead?: boolean;
    lead_stage?: string | null;
    lead_notes?: string | null;
    assigned_to?: string | null;
  } = {};
  if (input.isLead !== undefined) update.is_lead = input.isLead;
  if (input.leadStage !== undefined) update.lead_stage = input.leadStage;
  if (input.leadNotes !== undefined) update.lead_notes = input.leadNotes;
  if (input.assignedTo !== undefined) update.assigned_to = input.assignedTo;

  const { error } = await supabase
    .from("signals")
    .update(update)
    .eq("id", signalId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/signals");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markSignalConverted(
  signalId: string,
  draftBody: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { data: signal } = await supabase
    .from("signals")
    .select("title, platform, draft_reply")
    .eq("id", signalId)
    .eq("user_id", user.id)
    .single();

  if (!signal) {
    return { success: false, error: "Señal no encontrada" };
  }

  const body = draftBody.trim() || signal.draft_reply?.trim();
  if (!body) {
    return { success: false, error: "No hay draft para guardar" };
  }

  await supabase.from("winning_responses").insert({
    user_id: user.id,
    signal_id: signalId,
    title: signal.title,
    body,
    platform: signal.platform,
    converted: true,
  });

  const { error } = await supabase
    .from("signals")
    .update({ converted: true, is_lead: true, lead_stage: "won" })
    .eq("id", signalId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/signals");
  revalidatePath("/drafts");
  revalidatePath("/analytics");
  return { success: true, message: "Guardado en biblioteca de respuestas ganadoras" };
}

export async function markSignalViewed(signalId: string): Promise<ActionResult> {
  return updateSignalStatus(signalId, "viewed");
}

export async function generateDraftForSignal(
  signalId: string,
  options?: { regenerate?: boolean }
): Promise<DraftActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;

  const result = await generateDraft({
    signalId,
    userId: user.id,
    plan,
    regenerate: options?.regenerate === true,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      limitReached: result.limitReached,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/signals");
  revalidatePath("/drafts");

  return { success: true, draft: result.draft };
}

export async function saveDraftReply(
  signalId: string,
  draftReply: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .from("signals")
    .update({ draft_reply: draftReply.trim() })
    .eq("id", signalId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/drafts");
  revalidatePath("/dashboard");
  revalidatePath("/signals");
  return { success: true };
}

export async function markSignalReplied(
  signalId: string,
  replyUrl: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const trimmedUrl = replyUrl.trim();
  if (!trimmedUrl.startsWith("http")) {
    return { success: false, error: "URL inválida" };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("signals")
    .update({
      status: "replied",
      reply_url: trimmedUrl,
      replied_at: now,
      follow_up_reminder_at: computeFollowUpReminderAt(new Date()),
    })
    .eq("id", signalId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/drafts");
  revalidatePath("/dashboard");
  revalidatePath("/signals");
  revalidatePath("/analytics");
  return { success: true };
}

export async function markDraftCopied(
  signalId: string,
  draftText?: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const now = new Date().toISOString();
  const update: {
    draft_copied: boolean;
    draft_copied_at: string;
    draft_reply?: string;
  } = {
    draft_copied: true,
    draft_copied_at: now,
  };

  if (draftText?.trim()) {
    update.draft_reply = draftText.trim();
  }

  const { error } = await supabase
    .from("signals")
    .update(update)
    .eq("id", signalId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await markSetupDraftCopied(user.id);

  revalidatePath("/dashboard");
  revalidatePath("/signals");
  revalidatePath("/drafts");
  return { success: true };
}
