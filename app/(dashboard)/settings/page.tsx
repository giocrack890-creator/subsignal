import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { ErrorMessage } from "@/components/ui/error-message";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader title="Settings" />
        <ErrorMessage
          className="mt-8"
          title="No pudimos cargar tu perfil"
          message={error?.message ?? "Perfil no encontrado"}
        />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Settings"
        description="Perfil, plan, notificaciones y cuenta."
      />
      <div className="mt-8 max-w-2xl">
        <SettingsForm
          profile={profile as Profile}
          userId={user.id}
          email={user.email ?? profile.email ?? ""}
          avatarUrl={profile.avatar_url ?? user.user_metadata?.avatar_url}
        />
      </div>
    </div>
  );
}
