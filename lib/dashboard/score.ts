export type ScoreTier = "high" | "medium" | "low";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 9) return "high";
  if (score >= 7) return "medium";
  return "low";
}

export function scoreTierClass(tier: ScoreTier): string {
  switch (tier) {
    case "high":
      return "dash-score-high";
    case "medium":
      return "dash-score-medium";
    case "low":
      return "dash-score-low";
  }
}
