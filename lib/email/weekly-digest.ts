import { getAppUrl } from "@/lib/auth/urls";
import { createAdminClient } from "@/lib/supabase/admin";
import { isEmailProviderConfigured, resendEmailProvider } from "@/lib/notifications/providers/email";

interface WeeklyDigestMetrics {
  totalSignals: number;
  prevWeekSignals: number;
  draftsCopied: number;
  avgScore: number;
  topSignals: {
    id: string;
    title: string | null;
    platform: string;
    intent_score: number | null;
  }[];
}

function comparisonText(current: number, previous: number): string {
  if (previous === 0 && current === 0) return "= Igual que la semana pasada";
  if (previous === 0) return `▲ ${current} más que la semana pasada`;
  const delta = Math.round(((current - previous) / previous) * 100);
  if (delta > 0) return `▲ ${delta}% más que la semana pasada`;
  if (delta < 0) return `▼ ${Math.abs(delta)}% menos que la semana pasada`;
  return "= Igual que la semana pasada";
}

function buildDigestHtml(
  email: string,
  metrics: WeeklyDigestMetrics,
  periodLabel: string,
  unsubscribeUrl: string
): string {
  const appUrl = getAppUrl();
  const comparison = comparisonText(metrics.totalSignals, metrics.prevWeekSignals);
  const comparisonColor = comparison.startsWith("▲")
    ? "#34D399"
    : comparison.startsWith("▼")
      ? "#F87171"
      : "#6B6B6B";

  const topHtml = metrics.topSignals
    .map(
      (signal) => `
      <div style="border:1px solid #232323;border-radius:10px;padding:14px;margin-bottom:10px;background:#111714;">
        <div style="font-size:12px;color:#6B6B6B;text-transform:uppercase;">${signal.platform}</div>
        <div style="font-size:24px;font-weight:bold;color:#34D399;margin:6px 0;">${signal.intent_score ?? "—"}/10</div>
        <div style="font-size:14px;color:#fff;font-weight:600;">${signal.title ?? "Sin título"}</div>
        <a href="${appUrl}/signals?highlight=${signal.id}" style="display:inline-block;margin-top:10px;color:#34D399;text-decoration:none;">Ver señal →</a>
      </div>`
    )
    .join("");

  const motivation =
    metrics.draftsCopied > 0
      ? `<p style="color:#B4B4B4;line-height:1.6;">Respondiste ${metrics.draftsCopied} conversaciones esta semana. Cada respuesta genuina es un potencial cliente que conoció tu producto de la mejor forma posible.</p>`
      : "";

  return `
  <div style="font-family:Arial,sans-serif;background:#0A0A0A;color:#fff;padding:24px;">
    <h1 style="color:#34D399;">ThreadPulse — Resumen semanal</h1>
    <p style="color:#B4B4B4;">Tu resumen semanal — ${periodLabel}</p>
    <div style="display:flex;gap:12px;margin:20px 0;">
      <div style="flex:1;background:#111714;border:1px solid #232323;border-radius:10px;padding:14px;">
        <div style="font-size:12px;color:#6B6B6B;">🎯 Señales</div>
        <div style="font-size:22px;font-weight:bold;">${metrics.totalSignals}</div>
        <div style="font-size:12px;color:${comparisonColor};">${comparison}</div>
      </div>
      <div style="flex:1;background:#111714;border:1px solid #232323;border-radius:10px;padding:14px;">
        <div style="font-size:12px;color:#6B6B6B;">✍️ Drafts copiados</div>
        <div style="font-size:22px;font-weight:bold;">${metrics.draftsCopied}</div>
      </div>
      <div style="flex:1;background:#111714;border:1px solid #232323;border-radius:10px;padding:14px;">
        <div style="font-size:12px;color:#6B6B6B;">📊 Score promedio</div>
        <div style="font-size:22px;font-weight:bold;">${metrics.avgScore}/10</div>
      </div>
    </div>
    <h2 style="font-size:16px;">Las mejores señales de esta semana</h2>
    ${topHtml}
    ${motivation}
    <p style="margin-top:24px;font-size:12px;color:#6B6B6B;">
      <a href="${appUrl}/settings" style="color:#34D399;">Cambiar preferencias de email</a> ·
      <a href="${unsubscribeUrl}" style="color:#34D399;">Cancelar suscripción al digest</a>
    </p>
    <p style="font-size:12px;color:#6B6B6B;">© 2026 ThreadPulse · ${email}</p>
  </div>`;
}

export async function sendWeeklyDigests(): Promise<{
  sent: number;
  skipped: number;
  errors: string[];
}> {
  const result = { sent: 0, skipped: 0, errors: [] as string[] };
  const supabase = createAdminClient();

  if (!isEmailProviderConfigured()) {
    result.errors.push("RESEND_API_KEY o EMAIL_FROM no configurados");
    return result;
  }
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const prevWeekStart = new Date(now);
  prevWeekStart.setDate(now.getDate() - 14);

  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, weekly_digest, notify_email")
    .eq("weekly_digest", true)
    .eq("notify_email", true)
    .not("email", "is", null);

  for (const user of users ?? []) {
    if (!user.email) continue;

    const [{ data: weekSignals }, { data: prevSignals }, { count: draftsCopied }] =
      await Promise.all([
        supabase
          .from("signals")
          .select("id, title, platform, intent_score")
          .eq("user_id", user.id)
          .gte("found_at", weekStart.toISOString()),
        supabase
          .from("signals")
          .select("id")
          .eq("user_id", user.id)
          .gte("found_at", prevWeekStart.toISOString())
          .lt("found_at", weekStart.toISOString()),
        supabase
          .from("signals")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("draft_copied", true)
          .gte("found_at", weekStart.toISOString()),
      ]);

    const totalSignals = weekSignals?.length ?? 0;
    if (totalSignals === 0) {
      result.skipped += 1;
      continue;
    }

    const avgScore =
      totalSignals > 0
        ? Math.round(
            ((weekSignals ?? []).reduce((sum, s) => sum + (s.intent_score ?? 0), 0) /
              totalSignals) *
              10
          ) / 10
        : 0;

    const topSignals = [...(weekSignals ?? [])]
      .sort((a, b) => (b.intent_score ?? 0) - (a.intent_score ?? 0))
      .slice(0, 3);

    const periodLabel = `${weekStart.toLocaleDateString("es-AR")} al ${now.toLocaleDateString("es-AR")}`;
    const unsubscribeUrl = `${getAppUrl()}/api/unsubscribe-digest?userId=${user.id}`;

    try {
      await resendEmailProvider.send({
        to: user.email,
        subject: `📊 [ThreadPulse] Tu semana — ${totalSignals} señales encontradas`,
        html: buildDigestHtml(
          user.email,
          {
            totalSignals,
            prevWeekSignals: prevSignals?.length ?? 0,
            draftsCopied: draftsCopied ?? 0,
            avgScore,
            topSignals,
          },
          periodLabel,
          unsubscribeUrl
        ),
        text: `Tu semana: ${totalSignals} señales encontradas.`,
      });
      result.sent += 1;
    } catch (error) {
      result.errors.push(
        `${user.email}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return result;
}
