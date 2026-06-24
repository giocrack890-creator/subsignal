/** Umbral dinámico — sube min score si hay mucho ruido */

export function computeEffectiveMinScore(
  baseMinScore: number,
  scoreAdjustment: number,
  recentSignalCount24h: number
): number {
  let adjustment = scoreAdjustment;

  if (recentSignalCount24h > 30) adjustment += 1;
  else if (recentSignalCount24h > 15) adjustment += 0;

  const effective = baseMinScore + adjustment;
  return Math.min(10, Math.max(1, effective));
}

export function shouldSuggestThresholdBump(recentSignalCount24h: number): boolean {
  return recentSignalCount24h > 20;
}
