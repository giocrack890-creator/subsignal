"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UPGRADE_BANNER_DISMISSED_KEY } from "@/components/dashboard/upgrade-top-banner";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    localStorage.removeItem(UPGRADE_BANNER_DISMISSED_KEY);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      Cerrar sesión
    </Button>
  );
}
