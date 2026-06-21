"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  success: boolean;
  error?: string;
  productId?: string;
}

function parsePainPoints(raw: string): string[] {
  return raw
    .split(/[,;\n]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 10);
}

export async function saveProduct(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const targetCustomer = (formData.get("target_customer") as string)?.trim();
  const painPointsRaw = (formData.get("pain_points") as string)?.trim() ?? "";

  if (!name || name.length < 2) {
    return { success: false, error: "El nombre del producto es obligatorio" };
  }

  if (!description || description.length < 10) {
    return {
      success: false,
      error: "Describí qué hace tu producto (mínimo 10 caracteres)",
    };
  }

  if (!targetCustomer || targetCustomer.length < 5) {
    return {
      success: false,
      error: "Describí quién es tu cliente ideal",
    };
  }

  const painPoints = parsePainPoints(painPointsRaw);
  if (painPoints.length === 0) {
    return {
      success: false,
      error: "Agregá al menos un problema que resuelve tu producto",
    };
  }

  const { data: existing } = await supabase
    .from("user_products")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("user_products")
      .update({
        name,
        description,
        target_customer: targetCustomer,
        pain_points: painPoints,
      })
      .eq("id", existing.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/onboarding");
    revalidatePath("/keywords");
    return { success: true, productId: existing.id };
  }

  const { data, error } = await supabase
    .from("user_products")
    .insert({
      user_id: user.id,
      name,
      description,
      target_customer: targetCustomer,
      pain_points: painPoints,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/onboarding");
  revalidatePath("/keywords");
  return { success: true, productId: data.id };
}
