import { getPlanLimits } from "@/lib/payments/plans";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan } from "@/types";

export async function countAlertsToday(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("signals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("alerted_at", "is", null)
    .gte("alerted_at", startOfDay.toISOString());

  return count ?? 0;
}

export function canSendEmailAlert(plan: Plan, alertsToday: number): boolean {
  const limits = getPlanLimits(plan);
  if (limits.emailAlertsPerDay === null) return true;
  return alertsToday < limits.emailAlertsPerDay;
}
