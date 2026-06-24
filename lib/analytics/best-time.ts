import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type Client = SupabaseClient<Database>;

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export interface BestTimeInsight {
  dayLabel: string;
  hourStart: number;
  hourEnd: number;
  avgScore: number;
}

export async function fetchBestTimeInsight(
  supabase: Client,
  userId: string
): Promise<{ insight: BestTimeInsight | null; signalCount: number }> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: signals, error } = await supabase
    .from("signals")
    .select("found_at, intent_score")
    .eq("user_id", userId)
    .gte("found_at", since.toISOString())
    .not("intent_score", "is", null);

  if (error || !signals?.length) {
    return { insight: null, signalCount: 0 };
  }

  if (signals.length < 20) {
    return { insight: null, signalCount: signals.length };
  }

  const buckets = new Map<string, { total: number; count: number }>();

  for (const signal of signals) {
    const date = new Date(signal.found_at);
    const day = date.getUTCDay();
    const hour = date.getUTCHours();
    const key = `${day}-${hour}`;
    const bucket = buckets.get(key) ?? { total: 0, count: 0 };
    bucket.total += signal.intent_score ?? 0;
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  let bestKey: string | null = null;
  let bestAvg = -1;

  for (const [key, bucket] of buckets.entries()) {
    const avg = bucket.total / bucket.count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestKey = key;
    }
  }

  if (!bestKey) {
    return { insight: null, signalCount: signals.length };
  }

  const [dayStr, hourStr] = bestKey.split("-");
  const day = Number(dayStr);
  const hourStart = Number(hourStr);
  const hourEnd = Math.min(hourStart + 2, 23);

  return {
    insight: {
      dayLabel: DAY_NAMES[day] ?? "—",
      hourStart,
      hourEnd,
      avgScore: Math.round(bestAvg * 10) / 10,
    },
    signalCount: signals.length,
  };
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}${period}`;
}

export function formatBestTimeRange(insight: BestTimeInsight): string {
  return `${insight.dayLabel} entre ${formatHour(insight.hourStart)} y ${formatHour(insight.hourEnd)} UTC`;
}
