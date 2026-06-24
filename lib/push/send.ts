import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

function getVapidConfig() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL ?? "hello@subsignal.io";

  if (!publicKey || !privateKey) {
    return null;
  }

  webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
  return { publicKey, privateKey };
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; signalId: string }
): Promise<void> {
  const vapid = getVapidConfig();
  if (!vapid) return;

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("notify_push")
    .eq("id", userId)
    .single();

  if (!profile?.notify_push) return;

  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("id, subscription")
    .eq("user_id", userId);

  if (!subscriptions?.length) return;

  const message = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: "/window.svg",
    data: { signal_id: payload.signalId },
  });

  await Promise.all(
    subscriptions.map(async (row) => {
      try {
        await webpush.sendNotification(
          row.subscription as unknown as webpush.PushSubscription,
          message
        );
      } catch {
        await supabase.from("push_subscriptions").delete().eq("id", row.id);
      }
    })
  );
}
