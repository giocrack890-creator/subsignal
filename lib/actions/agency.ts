"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateAgencyBranding(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const whiteLabelName = (formData.get("white_label_name") as string)?.trim() || null;
  const whiteLabelLogoUrl = (formData.get("white_label_logo_url") as string)?.trim() || null;

  await supabase
    .from("profiles")
    .update({
      white_label_name: whiteLabelName,
      white_label_logo_url: whiteLabelLogoUrl,
    })
    .eq("id", user.id);

  revalidatePath("/settings");
}
