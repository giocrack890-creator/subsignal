import { redirect } from "next/navigation";
import { DraftsList } from "@/components/drafts/drafts-list";
import { ErrorMessage } from "@/components/ui/error-message";
import { createClient } from "@/lib/supabase/server";
import type { Signal } from "@/types";

export const dynamic = "force-dynamic";

interface DraftsPageProps {
  searchParams: Promise<{ signal?: string }>;
}

export default async function DraftsPage({ searchParams }: DraftsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const highlightId = params.signal;

  const { data: drafts, error } = await supabase
    .from("signals")
    .select("*")
    .eq("user_id", user.id)
    .not("draft_reply", "is", null)
    .neq("draft_reply", "")
    .order("found_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Borradores</h1>
        <ErrorMessage
          className="mt-8"
          title="No pudimos cargar borradores"
          message={error.message}
        />
      </div>
    );
  }

  let signals = (drafts as Signal[]) ?? [];

  if (highlightId && !signals.some((s) => s.id === highlightId)) {
    const { data: highlighted } = await supabase
      .from("signals")
      .select("*")
      .eq("id", highlightId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (highlighted) {
      signals = [highlighted as Signal, ...signals];
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Borradores</h1>
      <p className="mt-1 text-sm text-foreground-secondary">
        Editá, copiá y publicá tus respuestas a señales de alta intención.
      </p>
      <div className="mt-8 max-w-3xl">
        <DraftsList signals={signals} highlightId={highlightId} />
      </div>
    </div>
  );
}
