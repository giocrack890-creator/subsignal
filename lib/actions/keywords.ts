"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_PLATFORMS } from "@/lib/monitors/types";
import {
  checkKeywordLimit,
  checkTwitterKeywordLimit,
} from "@/lib/payments/checks";
import { filterPlatformsForPlan } from "@/lib/payments/platforms";
import { markSetupKeywordDone } from "@/lib/setup/progress";
import { parseExcludeTerms } from "@/lib/intelligence/negative-keywords";
import { expandSynonyms } from "@/lib/intelligence/synonyms";
import type { KeywordType, LanguageFilter, Plan, Platform } from "@/types";
import type { ActionResult } from "./product";

const ALL_PLATFORMS: Platform[] = ["hn", "reddit", "twitter", "ih"];

function parseSubreddits(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim().replace(/^r\//i, ""))
    .filter(Boolean)
    .slice(0, 10);
}

function parseKeywordType(formData: FormData): KeywordType {
  const raw = (formData.get("keyword_type") as string)?.trim();
  return raw === "competitor" ? "competitor" : "product";
}

function parseLanguage(formData: FormData): LanguageFilter {
  const raw = (formData.get("language") as string)?.trim();
  if (raw === "en" || raw === "es") return raw;
  return "any";
}

function parseExcludeFromForm(formData: FormData): string[] {
  const raw = (formData.get("exclude_terms") as string)?.trim() ?? "";
  return parseExcludeTerms(raw);
}

function parseSelectedPlatforms(formData: FormData): Platform[] {
  return ALL_PLATFORMS.filter((p) => formData.get(`platform_${p}`) === "on");
}

async function countActiveTwitterKeywords(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  excludeKeywordId?: string
): Promise<number> {
  let query = supabase
    .from("keywords")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_active", true)
    .contains("platforms", ["twitter"]);

  if (excludeKeywordId) {
    query = query.neq("id", excludeKeywordId);
  }

  const { count } = await query;
  return count ?? 0;
}

async function resolveKeywordPlatforms(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  plan: Plan,
  selectedPlatforms: Platform[],
  options: {
    excludeKeywordId?: string;
    willBeActive: boolean;
  }
): Promise<{ platforms: Platform[] } | { error: string }> {
  let platforms = filterPlatformsForPlan(
    plan,
    selectedPlatforms.filter((p) => ACTIVE_PLATFORMS.includes(p))
  );

  if (platforms.length === 0) {
    platforms = ["hn"];
  }

  if (platforms.includes("twitter") && options.willBeActive) {
    const twitterKeywordCount = await countActiveTwitterKeywords(
      supabase,
      userId,
      options.excludeKeywordId
    );

    const twitterLimit = checkTwitterKeywordLimit({
      plan,
      twitterKeywordCount,
    });

    if (!twitterLimit.allowed) {
      return {
        error: twitterLimit.message ?? "Límite de Twitter/X alcanzado",
      };
    }
  }

  return { platforms };
}

async function ensureUniqueTerm(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  term: string,
  excludeKeywordId?: string
): Promise<ActionResult | null> {
  let query = supabase
    .from("keywords")
    .select("id")
    .eq("user_id", userId)
    .ilike("term", term);

  if (excludeKeywordId) {
    query = query.neq("id", excludeKeywordId);
  }

  const { data: existing } = await query.maybeSingle();

  if (existing) {
    return {
      success: false,
      error: "Ya tenés una keyword con ese término",
    };
  }

  return null;
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
  const selectedPlatforms = parseSelectedPlatforms(formData);

  if (!term || term.length < 2) {
    return { success: false, error: "La keyword debe tener al menos 2 caracteres" };
  }

  if (!productId) {
    return { success: false, error: "Configurá tu producto primero" };
  }

  const duplicate = await ensureUniqueTerm(supabase, user.id, term);
  if (duplicate) return duplicate;

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

  const platformResult = await resolveKeywordPlatforms(
    supabase,
    user.id,
    plan,
    selectedPlatforms,
    { willBeActive: true }
  );

  if ("error" in platformResult) {
    return { success: false, error: platformResult.error };
  }

  const { platforms } = platformResult;

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
    keyword_type: parseKeywordType(formData),
    exclude_terms: parseExcludeFromForm(formData),
    synonyms: expandSynonyms(term),
    language: parseLanguage(formData),
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

export async function updateKeyword(
  keywordId: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const term = (formData.get("term") as string)?.trim();
  const subredditsRaw = (formData.get("subreddits") as string)?.trim() ?? "";
  const selectedPlatforms = parseSelectedPlatforms(formData);

  if (!term || term.length < 2) {
    return { success: false, error: "La keyword debe tener al menos 2 caracteres" };
  }

  const { data: existing } = await supabase
    .from("keywords")
    .select("id, is_active, product_id")
    .eq("id", keywordId)
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    return { success: false, error: "Keyword no encontrada" };
  }

  const duplicate = await ensureUniqueTerm(supabase, user.id, term, keywordId);
  if (duplicate) return duplicate;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;

  const platformResult = await resolveKeywordPlatforms(
    supabase,
    user.id,
    plan,
    selectedPlatforms,
    {
      excludeKeywordId: keywordId,
      willBeActive: existing.is_active,
    }
  );

  if ("error" in platformResult) {
    return { success: false, error: platformResult.error };
  }

  const { platforms } = platformResult;

  const subreddits =
    platforms.includes("reddit") && ACTIVE_PLATFORMS.includes("reddit")
      ? parseSubreddits(subredditsRaw)
      : [];

  const { error } = await supabase
    .from("keywords")
    .update({
      term,
      platforms,
      subreddits,
      keyword_type: parseKeywordType(formData),
      exclude_terms: parseExcludeFromForm(formData),
      synonyms: expandSynonyms(term),
      language: parseLanguage(formData),
    })
    .eq("id", keywordId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

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

  const { data: keyword } = await supabase
    .from("keywords")
    .select("platforms")
    .eq("id", keywordId)
    .eq("user_id", user.id)
    .single();

  if (!keyword) {
    return { success: false, error: "Keyword no encontrada" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as Plan;

  if (isActive) {
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

    const platforms = keyword.platforms as Platform[];
    if (platforms.includes("twitter")) {
      const twitterKeywordCount = await countActiveTwitterKeywords(
        supabase,
        user.id,
        keywordId
      );

      const twitterLimit = checkTwitterKeywordLimit({
        plan,
        twitterKeywordCount,
      });

      if (!twitterLimit.allowed) {
        return {
          success: false,
          error: twitterLimit.message ?? "Límite de Twitter/X alcanzado",
        };
      }
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
