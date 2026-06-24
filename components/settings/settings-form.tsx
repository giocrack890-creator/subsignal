"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CreditCard,
  HelpCircle,
  ShieldAlert,
  User,
} from "lucide-react";
import { deleteAccount, updateSettings } from "@/lib/actions/settings";
import { RestartTourButton } from "@/components/settings/restart-tour-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getPlanLimits, getPlanCatalog } from "@/lib/payments/plans";
import type { Plan, Profile } from "@/types";

interface SettingsFormProps {
  profile: Profile;
  email: string;
  userId: string;
  avatarUrl?: string | null;
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="dash-settings-section">
      <div className="dash-settings-icon">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-0.5 text-sm text-foreground-secondary">{description}</p>
      </div>
    </div>
  );
}

export function SettingsForm({ profile, email, userId, avatarUrl }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState(profile.notify_email);
  const [notifySlack, setNotifySlack] = useState(profile.notify_slack);

  const plan = profile.plan as Plan;
  const limits = getPlanLimits(plan);
  const planCatalog = getPlanCatalog(plan);
  const hasDraftFeature = limits.aiDraftsPerMonth !== 0;

  function handleSubmit(formData: FormData) {
    setMessage(null);
    setError(null);
    if (notifyEmail) formData.set("notify_email", "on");
    if (notifySlack) formData.set("notify_slack", "on");

    startTransition(async () => {
      const result = await updateSettings(formData);
      if (!result.success) {
        setError(result.error ?? "Error al guardar");
        return;
      }
      setMessage("Cambios guardados");
      router.refresh();
    });
  }

  function handleDeleteAccount() {
    const confirmed = confirm(
      "¿Eliminar tu cuenta permanentemente? Se borrarán todas tus keywords, señales y datos. Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    const typed = prompt('Escribí "ELIMINAR" para confirmar:');
    if (typed !== "ELIMINAR") return;

    startTransition(async () => {
      await deleteAccount();
    });
  }

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="space-y-6">
        <section className="dash-card p-6">
          <SectionHeader
            icon={User}
            title="Perfil"
            description="Información de tu cuenta de Google."
          />
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-12 w-12 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted-bg text-sm font-bold text-primary">
                  {email[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{email}</p>
                <p className="text-xs text-foreground-muted">Email (no editable)</p>
              </div>
            </div>
            <div>
              <Label htmlFor="full_name">Nombre</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name ?? ""}
                placeholder="Tu nombre"
                className="border-white/10"
              />
            </div>
          </div>
        </section>

        <section className="dash-card p-6">
          <SectionHeader
            icon={Bell}
            title="Notificaciones"
            description="Controlá cuándo y cómo te avisamos de nuevas señales."
          />
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Alertas por email</p>
                <p className="text-xs text-foreground-muted">
                  Email cuando aparezca una señal de alta intención.
                </p>
              </div>
              <Switch
                checked={notifyEmail}
                onChange={setNotifyEmail}
                aria-label="Alertas por email"
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Alertas por Slack</p>
                <p className="text-xs text-foreground-muted">
                  Notificaciones a tu webhook de Slack.
                </p>
              </div>
              <Switch
                checked={notifySlack}
                onChange={setNotifySlack}
                aria-label="Alertas por Slack"
              />
            </div>

            {notifySlack && (
              <div>
                <Label htmlFor="slack_webhook_url">Webhook URL de Slack</Label>
                <Input
                  id="slack_webhook_url"
                  name="slack_webhook_url"
                  type="url"
                  defaultValue={profile.slack_webhook_url ?? ""}
                  placeholder="https://hooks.slack.com/services/..."
                  className="border-white/10"
                />
              </div>
            )}

            <div>
              <Label htmlFor="min_intent_score">Score mínimo para alertas</Label>
              <Input
                id="min_intent_score"
                name="min_intent_score"
                type="number"
                min={1}
                max={10}
                defaultValue={profile.min_intent_score}
                className="border-white/10"
              />
              <p className="mt-1.5 text-xs text-foreground-muted">
                Solo alertas con score ≥ este valor (1–10).
              </p>
            </div>
          </div>

          {message && <p className="mt-4 text-sm text-primary">{message}</p>}
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            variant="accent"
            size="md"
            disabled={isPending}
            className="mt-6 dash-btn-neon"
          >
            {isPending ? "Guardando…" : "Guardar cambios"}
          </Button>
        </section>
      </form>

      <section className="dash-card p-6">
        <SectionHeader
          icon={CreditCard}
          title="Plan actual"
          description="Tu suscripción y límites del plan."
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <PlanBadge plan={plan} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">
          {hasDraftFeature
            ? `Con tu plan ${planCatalog.name} cada señal incluye un borrador de respuesta personalizado para tu producto, listo para copiar y publicar desde tu cuenta.`
            : `Con tu plan ${planCatalog.name} las señales no incluyen borrador de respuesta. Actualizá a Starter o superior para desbloquear drafts listos para copiar.`}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
          <li>
            ·{" "}
            {limits.maxKeywords === Infinity
              ? "Keywords ilimitadas"
              : `Hasta ${limits.maxKeywords} keywords activas`}
          </li>
          <li>
            ·{" "}
            {limits.aiDraftsPerMonth === null
              ? "Borradores IA ilimitados"
              : limits.aiDraftsPerMonth === 0
                ? "Sin borradores IA"
                : `${limits.aiDraftsPerMonth} borradores IA / mes`}
          </li>
          <li>
            ·{" "}
            {limits.conversionTracking
              ? "Conversion tracking incluido"
              : "Sin conversion tracking"}
          </li>
        </ul>
        <Link href="/pricing" className="mt-5 inline-block cursor-pointer">
          <Button variant="accent" size="sm" className="dash-btn-neon">
            Upgrade plan
          </Button>
        </Link>
      </section>

      <section className="dash-card p-6">
        <SectionHeader
          icon={HelpCircle}
          title="Ayuda"
          description="Recorré el producto de nuevo si querés refrescar."
        />
        <div className="mt-4">
          <RestartTourButton userId={userId} />
        </div>
      </section>

      <section className="dash-card dash-danger-zone p-6">
        <SectionHeader
          icon={ShieldAlert}
          title="Zona de peligro"
          description="Cerrá sesión o eliminá tu cuenta permanentemente."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <SignOutButton />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleDeleteAccount}
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            Eliminar cuenta
          </Button>
        </div>
      </section>
    </div>
  );
}
