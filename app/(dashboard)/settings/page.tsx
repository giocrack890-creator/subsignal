import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
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
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-foreground-secondary">
        Perfil, plan, notificaciones y cuenta.
      </p>
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
