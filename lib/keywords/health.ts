/** Keyword health score — 0-100 basado en rendimiento 30d */

export function computeKeywordHealth(perf: {
  signals30d: number;
  avgScore: number | null;
  createdAt: string;
}): { score: number; label: string; suggestion: string | null } {
  const ageDays =
    (Date.now() - new Date(perf.createdAt).getTime()) / (1000 * 60 * 60 * 24);

  if (ageDays < 7) {
    return {
      score: 50,
      label: "Nueva",
      suggestion: "Dale al menos una semana para evaluar",
    };
  }

  if (perf.signals30d === 0) {
    return {
      score: 10,
      label: "Sin señales",
      suggestion: "Esta keyword no dio nada en 30 días — probá sinónimos o cambiala",
    };
  }

  const volumeScore = Math.min(40, perf.signals30d * 4);
  const qualityScore = perf.avgScore ? (perf.avgScore / 10) * 60 : 20;
  const score = Math.round(volumeScore + qualityScore);

  let label: string;
  let suggestion: string | null = null;

  if (score >= 70) label = "Saludable";
  else if (score >= 40) {
    label = "Regular";
    suggestion = "Pocos resultados de calidad — refiná el término";
  } else {
    label = "Baja";
    suggestion = "Considerá pausar o reemplazar esta keyword";
  }

  return { score, label, suggestion };
}
