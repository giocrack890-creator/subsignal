import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

export interface SetupProgressState {
  setupProductDone: boolean;
  setupKeywordDone: boolean;
  setupSignalReceived: boolean;
  setupDraftCopied: boolean;
  setupCompleted: boolean;
}

type DbClient = SupabaseClient<Database>;

function toState(row: {
  setup_product_done: boolean;
  setup_keyword_done: boolean;
  setup_signal_received: boolean;
  setup_draft_copied: boolean;
  setup_completed: boolean;
}): SetupProgressState {
  return {
    setupProductDone: row.setup_product_done,
    setupKeywordDone: row.setup_keyword_done,
    setupSignalReceived: row.setup_signal_received,
    setupDraftCopied: row.setup_draft_copied,
    setupCompleted: row.setup_completed,
  };
}

async function computeSetupFlags(
  supabase: DbClient,
  userId: string
): Promise<Omit<SetupProgressState, "setupCompleted">> {
  const [
    { count: productCount },
    { count: keywordCount },
    { count: signalCount },
    { count: draftCopiedCount },
  ] = await Promise.all([
    supabase
      .from("user_products")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true),
    supabase
      .from("keywords")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true),
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("draft_copied", true),
  ]);

  return {
    setupProductDone: (productCount ?? 0) > 0,
    setupKeywordDone: (keywordCount ?? 0) > 0,
    setupSignalReceived: (signalCount ?? 0) > 0,
    setupDraftCopied: (draftCopiedCount ?? 0) > 0,
  };
}

async function persistSetupProgress(
  supabase: DbClient,
  userId: string,
  flags: Omit<SetupProgressState, "setupCompleted">,
  currentCompleted: boolean
): Promise<SetupProgressState> {
  const allDone =
    flags.setupProductDone &&
    flags.setupKeywordDone &&
    flags.setupSignalReceived &&
    flags.setupDraftCopied;

  const setupCompleted = currentCompleted || allDone;

  await supabase
    .from("profiles")
    .update({
      setup_product_done: flags.setupProductDone,
      setup_keyword_done: flags.setupKeywordDone,
      setup_signal_received: flags.setupSignalReceived,
      setup_draft_copied: flags.setupDraftCopied,
      setup_completed: setupCompleted,
    })
    .eq("id", userId);

  return { ...flags, setupCompleted };
}

export async function syncSetupProgress(
  supabase: DbClient,
  userId: string
): Promise<SetupProgressState> {
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "setup_product_done, setup_keyword_done, setup_signal_received, setup_draft_copied, setup_completed"
    )
    .eq("id", userId)
    .single();

  if (!profile) {
    return {
      setupProductDone: false,
      setupKeywordDone: false,
      setupSignalReceived: false,
      setupDraftCopied: false,
      setupCompleted: false,
    };
  }

  if (profile.setup_completed) {
    return toState(profile);
  }

  const flags = await computeSetupFlags(supabase, userId);
  return persistSetupProgress(supabase, userId, flags, profile.setup_completed);
}

export async function markSetupProductDone(userId: string): Promise<void> {
  const supabase = createAdminClient();
  const flags = await computeSetupFlags(supabase, userId);
  flags.setupProductDone = true;

  const { data: profile } = await supabase
    .from("profiles")
    .select("setup_completed")
    .eq("id", userId)
    .single();

  await persistSetupProgress(
    supabase,
    userId,
    flags,
    profile?.setup_completed ?? false
  );
}

export async function markSetupKeywordDone(userId: string): Promise<void> {
  const supabase = createAdminClient();
  const flags = await computeSetupFlags(supabase, userId);
  flags.setupKeywordDone = true;

  const { data: profile } = await supabase
    .from("profiles")
    .select("setup_completed")
    .eq("id", userId)
    .single();

  await persistSetupProgress(
    supabase,
    userId,
    flags,
    profile?.setup_completed ?? false
  );
}

export async function markSetupSignalReceived(userId: string): Promise<void> {
  const supabase = createAdminClient();
  const flags = await computeSetupFlags(supabase, userId);
  flags.setupSignalReceived = true;

  const { data: profile } = await supabase
    .from("profiles")
    .select("setup_completed")
    .eq("id", userId)
    .single();

  await persistSetupProgress(
    supabase,
    userId,
    flags,
    profile?.setup_completed ?? false
  );
}

export async function markSetupDraftCopied(userId: string): Promise<void> {
  const supabase = createAdminClient();
  const flags = await computeSetupFlags(supabase, userId);
  flags.setupDraftCopied = true;

  const { data: profile } = await supabase
    .from("profiles")
    .select("setup_completed")
    .eq("id", userId)
    .single();

  await persistSetupProgress(
    supabase,
    userId,
    flags,
    profile?.setup_completed ?? false
  );
}
