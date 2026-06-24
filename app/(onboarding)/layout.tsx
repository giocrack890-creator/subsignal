import { AppLogo } from "@/components/brand/app-logo";
import { redirect } from "next/navigation";
import { FxBackground } from "@/components/marketing/landing/fx-background";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <FxBackground intensity="subtle" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-10">
        <AppLogo variant="icon" size="md" href="/" />
        <span className="rounded-full border border-border bg-background-card px-3 py-1 text-xs text-foreground-secondary">
          Configuración inicial
        </span>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12 pt-4">
        {children}
      </main>
    </div>
  );
}
