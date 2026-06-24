"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FeatureSourceConfig, FeatureSourceType } from "@/lib/sources";

const SOURCE_META: {
  type: FeatureSourceType;
  label: string;
  hint: string;
  configKey?: keyof FeatureSourceConfig;
  placeholder?: string;
}[] = [
  {
    type: "google_alerts",
    label: "Google Alerts",
    hint: "Forward email → POST /api/ingest/google-alerts con tu ingest_secret",
    configKey: "ingest_secret",
    placeholder: "tu-secret-seguro",
  },
  {
    type: "rss",
    label: "RSS / blogs",
    hint: "URL del feed (Dev.to, Medium, nicho)",
    configKey: "feed_url",
    placeholder: "https://dev.to/feed/tag/saas",
  },
  {
    type: "github",
    label: "GitHub Issues",
    hint: "Repo opcional (owner/repo)",
    configKey: "github_repo",
    placeholder: "vercel/next.js",
  },
  {
    type: "app_store",
    label: "App Store reviews",
    hint: "App ID numérico de iTunes",
    configKey: "app_id",
    placeholder: "123456789",
  },
  {
    type: "slack_community",
    label: "Slack communities",
    hint: "URL de archivo exportado público",
    configKey: "feed_url",
    placeholder: "https://...",
  },
];

export function IntegrationsPanel() {
  const [sources, setSources] = useState<Record<string, { active: boolean; config: FeatureSourceConfig }>>({});
  const [zapierUrl, setZapierUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/feature-sources")
      .then((r) => r.json())
      .then((data: { sources?: { source_type: string; is_active: boolean; config: FeatureSourceConfig }[] }) => {
        const map: Record<string, { active: boolean; config: FeatureSourceConfig }> = {};
        for (const s of data.sources ?? []) {
          map[s.source_type] = { active: s.is_active, config: s.config ?? {} };
        }
        setSources(map);
      });
    void fetch("/api/integrations/settings")
      .then((r) => r.json())
      .then((data: { zapier_webhook_url?: string | null }) => {
        if (data.zapier_webhook_url) setZapierUrl(data.zapier_webhook_url);
      });
  }, []);

  function saveSource(type: FeatureSourceType, active: boolean, config: FeatureSourceConfig) {
    startTransition(async () => {
      const res = await fetch("/api/feature-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_type: type, is_active: active, config }),
      });
      if (res.ok) setMessage(`${type} guardado`);
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-foreground">Fuentes extra</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          Google Alerts, RSS, GitHub, App Store y Slack communities
        </p>
      </div>

      {SOURCE_META.map((meta) => {
        const row = sources[meta.type] ?? { active: false, config: {} };
        const configVal = meta.configKey ? (row.config[meta.configKey] ?? "") : "";

        return (
          <div
            key={meta.type}
            className="rounded-xl border border-border-medio bg-nivel-2 p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{meta.label}</p>
                <p className="text-xs text-foreground-secondary">{meta.hint}</p>
              </div>
              <Switch
                checked={row.active}
                onChange={(checked) => {
                  const next = { ...row, active: checked };
                  setSources((s) => ({ ...s, [meta.type]: next }));
                  saveSource(meta.type, checked, row.config);
                }}
              />
            </div>
            {meta.configKey && (
              <div>
                <Label>{meta.configKey}</Label>
                <Input
                  defaultValue={String(configVal)}
                  placeholder={meta.placeholder}
                  onBlur={(e) => {
                    const config = {
                      ...row.config,
                      [meta.configKey!]: e.target.value,
                    };
                    setSources((s) => ({ ...s, [meta.type]: { ...row, config } }));
                    saveSource(meta.type, row.active, config);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      <div className="rounded-xl border border-border-medio bg-nivel-2 p-4 space-y-3">
        <p className="font-medium text-foreground">Zapier / Make</p>
        <p className="text-xs text-foreground-secondary">
          Webhook para enviar señales a Notion, HubSpot, Pipedrive
        </p>
        <Input
          value={zapierUrl}
          onChange={(e) => setZapierUrl(e.target.value)}
          placeholder="https://hooks.zapier.com/..."
        />
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const formData = new FormData();
              formData.set("zapier_webhook_url", zapierUrl);
              await fetch("/api/integrations/settings", {
                method: "POST",
                body: JSON.stringify({ zapier_webhook_url: zapierUrl }),
                headers: { "Content-Type": "application/json" },
              });
              setMessage("Webhook Zapier guardado");
            });
          }}
        >
          Guardar webhook
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <a href="/api/export/weekly-pdf" target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="outline" size="sm">
            Exportar standup semanal (PDF)
          </Button>
        </a>
        <a href="/api/export/signals" target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="outline" size="sm">
            Exportar CSV
          </Button>
        </a>
      </div>

      {message && <p className="text-sm text-accent">{message}</p>}
    </div>
  );
}
