/** Follow-up reminders — 48h después de responder */

import { createAdminClient } from "@/lib/supabase/admin";

export async function processFollowUpReminders(): Promise<{ reminded: number }> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: due } = await supabase
    .from("signals")
    .select("id, user_id, title, replied_at, profiles!inner(email, notify_email)")
    .eq("status", "replied")
    .not("replied_at", "is", null)
    .lte("follow_up_reminder_at", now)
    .not("follow_up_reminder_at", "is", null);

  let reminded = 0;

  for (const signal of due ?? []) {
    const profile = signal.profiles as { email: string | null; notify_email: boolean };
    if (profile.notify_email && profile.email) {
      console.info(
        `[follow-up] Recordatorio para ${profile.email}: "${signal.title}" — ¿hubo reply?`
      );
      reminded++;
    }

    await supabase
      .from("signals")
      .update({ follow_up_reminder_at: null })
      .eq("id", signal.id);
  }

  return { reminded };
}

export function computeFollowUpReminderAt(repliedAt: Date = new Date()): string {
  const reminder = new Date(repliedAt.getTime() + 48 * 60 * 60 * 1000);
  return reminder.toISOString();
}
