import { NextResponse } from "next/server";
import { backfillDraftsOnUpgrade } from "@/lib/drafts/auto-draft";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const TRIAL_DAYS = 7;

const REQUIRED_FIELDS = [
  "source",
  "building",
  "previous_tool",
  "role",
] as const;

type SurveyField = (typeof REQUIRED_FIELDS)[number];

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: Record<string, string>;
  try {
    body = (await request.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field]?.trim()) {
      return NextResponse.json(
        { error: `Falta el campo ${field}` },
        { status: 400 }
      );
    }
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("onboarding_survey_completed, plan, payment_subscription_id")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_survey_completed) {
    return NextResponse.json(
      { error: "El survey ya fue completado" },
      { status: 409 }
    );
  }

  const trialEndsAt = new Date(
    Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const answers = Object.fromEntries(
    REQUIRED_FIELDS.map((field) => [field, body[field as SurveyField].trim()])
  ) as Record<SurveyField, string>;

  const { error: surveyError } = await admin.from("onboarding_survey").insert({
    user_id: user.id,
    ...answers,
  });

  if (surveyError) {
    console.error("[onboarding/survey]", surveyError);
    return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  }

  const previousPlan = profile?.plan ?? "free";
  const hasPaidSubscription = Boolean(profile?.payment_subscription_id);

  const profileUpdate: {
    onboarding_survey_completed: boolean;
    trial_ends_at: string;
    plan?: string;
  } = {
    onboarding_survey_completed: true,
    trial_ends_at: trialEndsAt,
  };

  if (!hasPaidSubscription) {
    profileUpdate.plan = "starter";
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id);

  if (profileError) {
    console.error("[onboarding/survey] profile", profileError);
    return NextResponse.json({ error: "No se pudo actualizar perfil" }, { status: 500 });
  }

  if (!hasPaidSubscription && previousPlan === "free") {
    try {
      await backfillDraftsOnUpgrade(user.id, "starter");
    } catch {
      // No bloquear si el backfill falla
    }
  }

  return NextResponse.json({
    ok: true,
    trialEndsAt,
    plan: hasPaidSubscription ? previousPlan : "starter",
  });
}
