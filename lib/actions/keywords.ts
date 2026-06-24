"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_PLATFORMS } from "@/lib/monitors/types";
import { checkKeywordLimit } from "@/lib/payments/checks";
import { markSetupKeywordDone } from "@/lib/setup/progress";
import type { Plan, Platform } from "@/types";
import type { ActionResult } from "./product";

const ALL_PLATFORMS: Platform[] = ["hn", "reddit", "twitter", "ih"];

function parseSubreddits(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim().replace(/^r\//i, ""))
    .filter(Boolean)
    .slice(0, 10);
}

export async function createKeyword(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const term = (formData.get("term") as string)?.trim();
  const productId = (formData.get("product_id") as string)?.trim();
  const subredditsRaw = (formData.get("subreddits") as string)?.trim() ?? "";
  const selectedPlatforms = ALL_PLATFORMS.filter(
    (p) => formData.get(`platform_${p}`) === "on"
  );

  if (!term || term.length < 2) {
    return { success: false, error: "La keyword debe tener al menos 2 caracteres" };
  }

  if (!productId) {
    return { success: false, error: "Configurá tu producto primero" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;

  const { count: activeCount } = await supabase
    .from("keywords")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_active", true);

  const keywordLimit = checkKeywordLimit({
    plan,
    activeKeywordCount: activeCount ?? 0,
  });

  if (!keywordLimit.allowed) {
    return {
      success: false,
      error: keywordLimit.message ?? "Límite de keywords alcanzado",
    };
  }

  // Plan free: solo Hacker News
  let platforms: Platform[] =
    plan === "free"
      ? selectedPlatforms.filter((p) => p === "hn")
      : selectedPlatforms.filter((p) => ACTIVE_PLATFORMS.includes(p));

  if (platforms.length === 0) {
    platforms = ["hn"];
  }

  const subreddits =
    platforms.includes("reddit") && ACTIVE_PLATFORMS.includes("reddit")
      ? parseSubreddits(subredditsRaw)
      : [];

  const { error } = await supabase.from("keywords").insert({
    user_id: user.id,
    product_id: productId,
    term,
    platforms,
    subreddits,
    is_active: true,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  await markSetupKeywordDone(user.id);

  revalidatePath("/onboarding");
  revalidatePath("/keywords");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleKeyword(
  keywordId: string,
  isActive: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  if (isActive) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const plan = (profile?.plan ?? "free") as Plan;

    const { count } = await supabase
      .from("keywords")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    const keywordLimit = checkKeywordLimit({
      plan,
      activeKeywordCount: count ?? 0,
    });

    if (!keywordLimit.allowed) {
      return {
        success: false,
        error: keywordLimit.message ?? "Límite de keywords alcanzado",
      };
    }
  }

  const { error } = await supabase
    .from("keywords")
    .update({ is_active: isActive })
    .eq("id", keywordId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/keywords");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteKeyword(keywordId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .from("keywords")
    .delete()
    .eq("id", keywordId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/keywords");
  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return { success: true };
}
