"use client";

import { useState } from "react";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { OnboardingSurveyGate } from "@/components/onboarding/onboarding-survey-modal";
import type { Plan, UserProduct } from "@/types";

interface OnboardingEntryProps {
  showSurvey: boolean;
  product: UserProduct | null;
  productId: string | null;
  plan: Plan;
  initialStep: 1 | 2;
  userName?: string;
}

/** Survey una sola vez al inicio; después el wizard de producto + keyword */
export function OnboardingEntry({
  showSurvey,
  product,
  productId,
  plan,
  initialStep,
  userName,
}: OnboardingEntryProps) {
  const [surveyHandled, setSurveyHandled] = useState(!showSurvey);

  return (
    <>
      <OnboardingSurveyGate
        showSurvey={showSurvey && !surveyHandled}
        onHandled={() => setSurveyHandled(true)}
      />
      {surveyHandled && (
        <OnboardingWizard
          product={product}
          productId={productId}
          plan={plan}
          initialStep={initialStep}
          userName={userName}
        />
      )}
    </>
  );
}
