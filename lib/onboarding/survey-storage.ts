/** Evita que el survey de onboarding se muestre más de una vez por navegador */

export const SURVEY_HANDLED_STORAGE_KEY = "threadpulse_survey_handled";

export function isSurveyHandledLocally(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SURVEY_HANDLED_STORAGE_KEY) === "1";
}

export function markSurveyHandledLocally(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SURVEY_HANDLED_STORAGE_KEY, "1");
}
