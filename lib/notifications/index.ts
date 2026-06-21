/** Orquestador de notificaciones — email (Resend) + Slack webhook */

import { canSendEmailAlert, countAlertsToday } from "./limits";
import {
  getEmailProvider,
  isEmailProviderConfigured,
} from "./providers/email";
import { sendSlackNotification } from "./providers/slack";
import { buildEmailDigest } from "./templates/email";
import type {
  NotificationPayload,
  NotificationResult,
} from "./types";

export type { NotificationPayload, NotificationResult } from "./types";

export async function sendNotification(
  payload: NotificationPayload
): Promise<NotificationResult> {
  const result: NotificationResult = {
    emailSent: false,
    slackSent: false,
    consoleLogged: false,
  };

  const wantsEmail = payload.notifyEmail && Boolean(payload.email);
  const wantsSlack =
    payload.notifySlack && Boolean(payload.slackWebhookUrl?.trim());

  if (!wantsEmail && !wantsSlack) {
    return result;
  }

  if (wantsEmail && payload.email) {
    const alertsToday = await countAlertsToday(payload.userId);

    if (!canSendEmailAlert(payload.plan, alertsToday)) {
      result.skippedEmailReason = "Límite diario de alertas email alcanzado";
    } else {
      const digest = buildEmailDigest({ ...payload, email: payload.email });
      const provider = getEmailProvider();

      if (isEmailProviderConfigured()) {
        await provider.send(digest);
        result.emailSent = true;
      } else {
        await provider.send(digest);
        result.consoleLogged = true;
      }
    }
  }

  if (wantsSlack && payload.slackWebhookUrl) {
    await sendSlackNotification(payload, payload.slackWebhookUrl.trim());
    result.slackSent = true;
  }

  return result;
}
