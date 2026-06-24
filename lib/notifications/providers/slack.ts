import { PLATFORM_LABELS } from "@/lib/monitors/types";
import type { NotificationPayload } from "../types";
import type { Platform } from "@/types";

const PLATFORM_EMOJI: Record<Platform, string> = {
  hn: ":large_orange_circle:",
  reddit: ":red_circle:",
  twitter: ":bird:",
  ih: ":rocket:",
};

function truncateTitle(title: string, max = 120): string {
  return title.length > max ? `${title.slice(0, max - 1)}…` : title;
}

function buildSlackBlocks(payload: NotificationPayload) {
  const header =
    payload.signals.length === 1
      ? "Nueva señal de alta intención"
      : `${payload.signals.length} nuevas señales de alta intención`;

  const blocks: Array<Record<string, unknown>> = [
    {
      type: "header",
      text: { type: "plain_text", text: `🎯 ${header}`, emoji: true },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Alertas de intención · ThreadPulse",
        },
      ],
    },
    { type: "divider" },
  ];

  for (const signal of payload.signals) {
    const label = PLATFORM_LABELS[signal.platform as Platform] ?? signal.platform;
    const emoji = PLATFORM_EMOJI[signal.platform as Platform] ?? ":satellite:";
    const title = truncateTitle(signal.title ?? "Sin título");

    blocks.push(
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${emoji} *${label}* · *${signal.score}/10*\n*${title}*\n>${signal.excerpt}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Ver borrador", emoji: true },
            url: signal.draftUrl,
            style: "primary",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Ver post", emoji: true },
            url: signal.originalUrl,
          },
        ],
      }
    );

    if (signal !== payload.signals[payload.signals.length - 1]) {
      blocks.push({ type: "divider" });
    }
  }

  return blocks;
}

export async function sendSlackNotification(
  payload: NotificationPayload,
  webhookUrl: string
): Promise<void> {
  const blocks = buildSlackBlocks(payload);
  const fallback =
    payload.signals.length === 1
      ? `Nueva señal: ${payload.signals[0].title ?? "Sin título"}`
      : `${payload.signals.length} nuevas señales`;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: fallback, blocks }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Slack webhook error ${response.status}: ${body}`);
  }
}
