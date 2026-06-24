"use server";

import { revalidatePath } from "next/cache";
import { generateDraftForSignal as generateDraft } from "@/lib/drafts";
import { createClient } from "@/lib/supabase/server";
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

  const { error } = await supabase
    .from("signals")
    .update({
      status: "replied",
      reply_url: trimmedUrl,
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

  revalidatePath("/dashboard");
  revalidatePath("/signals");
  revalidatePath("/drafts");
  return { success: true };
}
