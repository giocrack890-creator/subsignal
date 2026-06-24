import { redirect } from "next/navigation";
import { DraftsList } from "@/components/drafts/drafts-list";
import { PublishedResponsesSection } from "@/components/drafts/published-responses-section";
import { PageHeader } from "@/components/dashboard/page-header";
import { ErrorMessage } from "@/components/ui/error-message";
import { FirstTimeTooltip } from "@/components/ui/FirstTimeTooltip";
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

  const [{ data: drafts, error }, { data: published }] = await Promise.all([
    supabase
      .from("signals")
      .select("*")
      .eq("user_id", user.id)
      .not("draft_reply", "is", null)
      .neq("draft_reply", "")
      .order("found_at", { ascending: false }),
    supabase
      .from("signals")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "replied")
      .not("reply_url", "is", null)
      .order("found_at", { ascending: false })
      .limit(20),
  ]);

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader title="Borradores" />
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
      <FirstTimeTooltip
        id="drafts_page"
        content="Editá, copiá y marcá como respondidas tus señales. El historial de publicaciones queda abajo."
        position="bottom"
      >
        <PageHeader
          title="Borradores"
          description="Editá, copiá y publicá tus respuestas a señales de alta intención."
        />
      </FirstTimeTooltip>
      <div className="mt-8 max-w-4xl">
        <DraftsList signals={signals} highlightId={highlightId} />
        <PublishedResponsesSection signals={(published as Signal[]) ?? []} />
      </div>
    </div>
  );
}
