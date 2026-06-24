/** Registro de features — estado de implementación */

export type FeatureStatus = "live" | "beta" | "coming_soon" | "blocked";

export interface FeatureEntry {
  id: string;
  name: string;
  status: FeatureStatus;
  description: string;
  blocker?: string;
}

export const FEATURE_REGISTRY: FeatureEntry[] = [
  { id: "competitor_radar", name: "Radar competidores", status: "live", description: "Monitoreá rivales y alertas negativas" },
  { id: "signal_merge", name: "Señales fusionadas", status: "live", description: "Mismo tema HN+Reddit = 1 tarjeta" },
  { id: "buyers_only", name: "Modo solo compradores", status: "live", description: "Filtrar frases de intención" },
  { id: "reply_window", name: "Reply window", status: "live", description: "Urgencia de respuesta por plataforma" },
  { id: "dynamic_threshold", name: "Umbral dinámico", status: "live", description: "Sube score mínimo con ruido" },
  { id: "author_history", name: "Historial autor", status: "live", description: "Usuarios recurrentes" },
  { id: "churn_detection", name: "Detección churn", status: "live", description: "Quejas de competidores" },
  { id: "semantic_clusters", name: "Clusters semánticos", status: "live", description: "Agrupar por tema" },
  { id: "hot_feed", name: "Feed caliente", status: "live", description: "Ordenar por velocidad + score" },
  { id: "platform_templates", name: "Plantillas plataforma", status: "live", description: "HN ≠ Reddit ≠ X" },
  { id: "follow_up", name: "Follow-up reminder", status: "live", description: "Recordatorio 48h post-reply" },
  { id: "crm_lite", name: "CRM lite", status: "live", description: "Lead, etapa, notas" },
  { id: "utm_auto", name: "UTM automático", status: "live", description: "Tracking al copiar draft" },
  { id: "winning_library", name: "Biblioteca ganadoras", status: "live", description: "Respuestas que convirtieron" },
  { id: "anonymous_draft", name: "Founder anónimo", status: "live", description: "Drafts sin marketing" },
  { id: "negative_kw", name: "Keyword negativa", status: "live", description: "Excluir falsos positivos" },
  { id: "synonyms", name: "Sinónimos", status: "live", description: "Expandir términos" },
  { id: "import_landing", name: "Import desde landing", status: "live", description: "Scrape H1/meta" },
  { id: "keyword_health", name: "Keyword health", status: "live", description: "Score de rendimiento" },
  { id: "language_filter", name: "Alertas por idioma", status: "live", description: "EN / ES / ambos" },
  { id: "geo_intent", name: "Geo-intent", status: "live", description: "Detectar región" },
  { id: "ph_launch", name: "Product Hunt mode", status: "beta", description: "Scan intensivo 24h" },
  { id: "ih_groups", name: "IH groups", status: "blocked", description: "Foros IH", blocker: "Algolia 404" },
  { id: "slack_communities", name: "Slack communities", status: "coming_soon", description: "Comunidades públicas" },
  { id: "google_alerts", name: "Google Alerts", status: "coming_soon", description: "Forward email → señales" },
  { id: "rss_blogs", name: "RSS / blogs", status: "coming_soon", description: "Dev.to, Medium" },
  { id: "github_issues", name: "GitHub Issues", status: "coming_soon", description: "Alternatives to X" },
  { id: "app_store", name: "App Store reviews", status: "coming_soon", description: "Quejas competidores" },
  { id: "team_inbox", name: "Inbox compartido", status: "beta", description: "Asignar a co-founder" },
  { id: "team_roles", name: "Roles equipo", status: "beta", description: "Viewer / responder / admin" },
  { id: "weekly_pdf", name: "Standup export PDF", status: "coming_soon", description: "PDF semanal" },
  { id: "public_api", name: "API pública", status: "beta", description: "Webhook out score ≥ 9" },
  { id: "zapier", name: "Zapier / Make", status: "coming_soon", description: "Notion, HubSpot" },
  { id: "roi_keyword", name: "ROI por keyword", status: "live", description: "Trials por término" },
  { id: "heatmap", name: "Heatmap hora/día", status: "live", description: "Mejor momento HN" },
  { id: "benchmark", name: "Benchmark anónimo", status: "coming_soon", description: "Comparar con founders" },
  { id: "streak", name: "Leaderboard personal", status: "live", description: "Racha de respuestas" },
  { id: "csv_export", name: "Export CSV", status: "live", description: "Señales a CSV" },
  { id: "monthly_report", name: "Reporte mensual", status: "coming_soon", description: "Email auto" },
  { id: "chrome_ext", name: "Chrome extension", status: "coming_soon", description: "Overlay HN/Reddit" },
  { id: "pwa", name: "PWA mejorada", status: "beta", description: "Push + quick reply" },
  { id: "focus_mode", name: "Modo foco", status: "live", description: "3 señales top/día" },
  { id: "vertical_onboarding", name: "Onboarding vertical", status: "beta", description: "SaaS / agency / indie" },
  { id: "hn_theme", name: "Tema HN orange", status: "beta", description: "Easter egg" },
  { id: "keyboard", name: "Atajos teclado", status: "live", description: "j/k/c navegar" },
  { id: "widget", name: "Widget embebible", status: "coming_soon", description: "Status page" },
  { id: "undo_dismiss", name: "Undo dismiss", status: "live", description: "Restaurar señal" },
  { id: "shill", name: "Detección shill", status: "live", description: "Astroturfing" },
  { id: "tweet_thread", name: "Thread 3 tweets", status: "coming_soon", description: "Desde señal HN" },
  { id: "translate", name: "Traducción auto", status: "coming_soon", description: "Otros idiomas" },
  { id: "skip_reason", name: "Por qué NO responder", status: "live", description: "Reasoning IA" },
  { id: "signal_chat", name: "Chat con señales", status: "beta", description: "Pain points semana" },
  { id: "agency", name: "Plan Agency", status: "coming_soon", description: "10 productos" },
  { id: "white_label", name: "White-label", status: "coming_soon", description: "Agencias" },
  { id: "marketplace", name: "Marketplace playbooks", status: "coming_soon", description: "Templates nicho" },
  { id: "twitter_credits", name: "Credits Twitter", status: "live", description: "Packs GetXAPI" },
  { id: "referral", name: "Referral", status: "beta", description: "1 mes Pro por invitar" },
  { id: "ltd", name: "Lifetime deal", status: "coming_soon", description: "AppSumo-style" },
  { id: "usage_tier", name: "Usage-based", status: "coming_soon", description: "Por señales ≥8" },
  { id: "creem_upgrade", name: "Upgrade desde email", status: "live", description: "Link Creem en alertas" },
  { id: "status_page", name: "Status page", status: "live", description: "/api/cron/status" },
  { id: "rate_limits", name: "Rate limit dashboard", status: "beta", description: "Cuotas APIs" },
  { id: "sandbox", name: "Modo sandbox", status: "beta", description: "Probar sin gastar API" },
  { id: "account_merge", name: "Merge accounts", status: "coming_soon", description: "Google login edge" },
  { id: "2fa", name: "2FA", status: "coming_soon", description: "Cuentas agency" },
  { id: "changelog", name: "Public changelog", status: "live", description: "/changelog" },
  { id: "community_lb", name: "Founder leaderboard", status: "coming_soon", description: "Opt-in comunidad" },
];

export function getLiveFeatures(): FeatureEntry[] {
  return FEATURE_REGISTRY.filter((f) => f.status === "live");
}

export function getFeatureById(id: string): FeatureEntry | undefined {
  return FEATURE_REGISTRY.find((f) => f.id === id);
}
