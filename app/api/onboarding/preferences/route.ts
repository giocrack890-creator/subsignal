import { NextResponse } from "next/server";
import { TOOLTIP_IDS } from "@/lib/onboarding/preferences";
import { createClient } from "@/lib/supabase/server";

type PreferenceAction =
  | { type: "skip_survey" }
  | { type: "complete_tour" }
  | { type: "reset_tour" }
  | { type: "dismiss_tooltip"; tooltipId: string }
  | { type: "dismiss_setup_celebration" };

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: PreferenceAction;
  try {
    body = (await request.json()) as PreferenceAction;
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  switch (body.type) {
    case "skip_survey": {
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_survey_completed: true })
        .eq("id", user.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      break;
    }

    case "complete_tour": {
      const { error } = await supabase
        .from("profiles")
        .update({ guided_tour_completed: true })
        .eq("id", user.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      break;
    }

    case "reset_tour": {
      const { error } = await supabase
        .from("profiles")
        .update({ guided_tour_completed: false })
        .eq("id", user.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      break;
    }

    case "dismiss_tooltip": {
      if (!TOOLTIP_IDS.includes(body.tooltipId as (typeof TOOLTIP_IDS)[number])) {
        return NextResponse.json({ error: "Tooltip inválido" }, { status: 400 });
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("tooltips_dismissed")
        .eq("id", user.id)
        .single();

      const current = profile?.tooltips_dismissed ?? [];
      if (current.includes(body.tooltipId)) {
        break;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ tooltips_dismissed: [...current, body.tooltipId] })
        .eq("id", user.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      break;
    }

    case "dismiss_setup_celebration": {
      const { error } = await supabase
        .from("profiles")
        .update({ setup_celebration_seen: true })
        .eq("id", user.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      break;
    }

    default:
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
