import { getAppUrl } from "@/lib/auth/urls";
import { PLATFORM_LABELS } from "@/lib/monitors/types";
import type { EmailDigest, NotificationPayload } from "../types";
import type { Platform } from "@/types";

const PLATFORM_EMOJI: Record<Platform, string> = {
  hn: "🟠",
  reddit: "🔴",
  twitter: "🐦",
  ih: "🚀",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncateTitle(title: string, max = 55): string {
  return title.length > max ? `${title.slice(0, max - 1)}…` : title;
}

function buildSubject(payload: NotificationPayload): string {
  const { signals } = payload;

  if (signals.length === 1) {
    const signal = signals[0];
    const label = PLATFORM_LABELS[signal.platform as Platform] ?? signal.platform;
    const title = truncateTitle(signal.title ?? "Nueva señal");
    return `🎯 [Score: ${signal.score}/10] Nueva señal en ${label}: ${title}`;
  }

  return `🎯 ${signals.length} nuevas señales de alta intención en SubSignal`;
}

function renderSignalHtml(signal: NotificationPayload["signals"][number]): string {
  const label = PLATFORM_LABELS[signal.platform as Platform] ?? signal.platform;
  const emoji = PLATFORM_EMOJI[signal.platform as Platform] ?? "📡";
  const title = escapeHtml(signal.title ?? "Sin título");
  const excerpt = escapeHtml(signal.excerpt);

  return `
    <tr>
      <td style="padding:20px 24px;border-top:1px solid #232323;">
        <p style="margin:0 0 8px;font-size:12px;color:#6B6B6B;text-transform:uppercase;letter-spacing:0.05em;">
          ${emoji} ${escapeHtml(label)} · Score ${signal.score}/10
        </p>
        <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#FFFFFF;line-height:1.4;">
          ${title}
        </p>
        <p style="margin:0 0 16px;font-size:14px;color:#B4B4B4;line-height:1.5;">
          ${excerpt}
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:10px;">
              <a href="${signal.draftUrl}" style="display:inline-block;background:#34D399;color:#0A0A0A;text-decoration:none;font-size:13px;font-weight:600;padding:10px 16px;border-radius:999px;">
                Ver borrador
              </a>
            </td>
            <td>
              <a href="${signal.originalUrl}" style="display:inline-block;border:1px solid #232323;color:#B4B4B4;text-decoration:none;font-size:13px;font-weight:500;padding:10px 16px;border-radius:999px;">
                Ver post original
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderSignalText(signal: NotificationPayload["signals"][number]): string {
  const label = PLATFORM_LABELS[signal.platform as Platform] ?? signal.platform;
  const emoji = PLATFORM_EMOJI[signal.platform as Platform] ?? "📡";
  const title = signal.title ?? "Sin título";

  return [
    `${emoji} ${label} · ${signal.score}/10`,
    title,
    signal.excerpt,
    `Ver borrador: ${signal.draftUrl}`,
    `Post original: ${signal.originalUrl}`,
    "",
  ].join("\n");
}

export function buildEmailDigest(payload: NotificationPayload): EmailDigest {
  if (!payload.email) {
    throw new Error("Email requerido para digest");
  }

  const subject = buildSubject(payload);
  const appUrl = getAppUrl();
  const signalBlocks = payload.signals.map(renderSignalHtml).join("");
  const signalText = payload.signals.map(renderSignalText).join("\n---\n");

  const html = `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111714;border:1px solid #232323;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:24px 24px 8px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#34D399;text-transform:uppercase;letter-spacing:0.08em;">
                  SubSignal
                </p>
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#FFFFFF;line-height:1.3;">
                  ${
                    payload.signals.length === 1
                      ? "Nueva señal de alta intención"
                      : `${payload.signals.length} nuevas señales de alta intención`
                  }
                </h1>
                <p style="margin:12px 0 0;font-size:14px;color:#B4B4B4;line-height:1.5;">
                  Encontramos conversaciones relevantes para tu producto. Revisá los borradores y respondé mientras la intención está caliente.
                </p>
              </td>
            </tr>
            ${signalBlocks}
            <tr>
              <td style="padding:20px 24px 24px;border-top:1px solid #232323;">
                <a href="${appUrl}/dashboard" style="color:#34D399;text-decoration:none;font-size:13px;">
                  Abrir dashboard →
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    "SubSignal — alertas de intención",
    "",
    subject,
    "",
    signalText,
    `Dashboard: ${appUrl}/dashboard`,
  ].join("\n");

  return { to: payload.email, subject, html, text };
}
