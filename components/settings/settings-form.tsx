"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteAccount, updateSettings } from "@/lib/actions/settings";
import { RestartTourButton } from "@/components/settings/restart-tour-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getPlanLimits } from "@/lib/payments/plans";
import type { Plan, Profile } from "@/types";

interface SettingsFormProps {
  profile: Profile;
  email: string;
  userId: string;
  avatarUrl?: string | null;
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
    <div className="space-y-8">
      <form action={handleSubmit} className="space-y-8">
        {/* Perfil */}
        <section className="landing-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Información de tu cuenta de Google.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-12 w-12 rounded-full border border-border object-cover"
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
              />
            </div>
          </div>
        </section>

        {/* Notificaciones */}
        <section className="landing-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Controlá cuándo y cómo te avisamos de nuevas señales.
          </p>
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Alertas por email</p>
                <p className="text-xs text-foreground-muted">
                  Recibí un email cuando aparezca una señal de alta intención.
                </p>
              </div>
              <Switch
                checked={notifyEmail}
                onChange={setNotifyEmail}
                aria-label="Alertas por email"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Alertas por Slack</p>
                <p className="text-xs text-foreground-muted">
                  Enviar notificaciones a tu webhook de Slack.
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
              />
              <p className="mt-1.5 text-xs text-foreground-muted">
                Solo recibir alertas de señales con score mayor o igual a este valor (1–10).
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
            className="mt-6"
          >
            {isPending ? "Guardando…" : "Guardar cambios"}
          </Button>
        </section>
      </form>

      {/* Plan — fuera del form */}
      <section className="landing-card rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Plan actual</h2>
          <PlanBadge plan={plan} />
        </div>
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
        <Link href="/pricing" className="mt-4 inline-block cursor-pointer">
          <Button variant="outline" size="sm">
            Ver planes
          </Button>
        </Link>
      </section>

      {/* Ayuda */}
      <section className="landing-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">Ayuda</h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          Volvé a recorrer el producto si querés refrescar cómo funciona cada sección.
        </p>
        <div className="mt-4">
          <RestartTourButton userId={userId} />
        </div>
      </section>

      {/* Cuenta */}
      <section className="landing-card rounded-2xl border-destructive/20 p-6">
        <h2 className="text-lg font-semibold text-foreground">Cuenta</h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          Cerrá sesión o eliminá tu cuenta y todos tus datos.
        </p>
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
