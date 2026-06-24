import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export const TOOLTIP_IDS = [
  "keywords_page",
  "signals_page",
  "drafts_page",
  "analytics_page",
] as const;

export type TooltipId = (typeof TOOLTIP_IDS)[number];

export interface OnboardingUiPreferences {
  guidedTourCompleted: boolean;
  tooltipsDismissed: string[];
  setupCelebrationSeen: boolean;
  onboardingSurveyCompleted: boolean;
}

type DbClient = SupabaseClient<Database>;

export function toOnboardingUiPreferences(row: {
  guided_tour_completed: boolean;
  tooltips_dismissed: string[] | null;
  setup_celebration_seen: boolean;
  onboarding_survey_completed: boolean;
}): OnboardingUiPreferences {
  return {
    guidedTourCompleted: row.guided_tour_completed,
    tooltipsDismissed: row.tooltips_dismissed ?? [],
    setupCelebrationSeen: row.setup_celebration_seen,
    onboardingSurveyCompleted: row.onboarding_survey_completed,
  };
}

export async function fetchOnboardingUiPreferences(
  supabase: DbClient,
  userId: string
): Promise<OnboardingUiPreferences> {
  const { data } = await supabase
    .from("profiles")
    .select(
      "guided_tour_completed, tooltips_dismissed, setup_celebration_seen, onboarding_survey_completed"
    )
    .eq("id", userId)
    .single();

  if (!data) {
    return {
      guidedTourCompleted: false,
      tooltipsDismissed: [],
      setupCelebrationSeen: false,
      onboardingSurveyCompleted: false,
    };
  }

  return toOnboardingUiPreferences(data);
}
