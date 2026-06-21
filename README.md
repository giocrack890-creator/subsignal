# SubSignal

**Intent monitoring para founders SaaS.** Encontrá conversaciones con intención de compra en Hacker News, puntualas con IA y respondé con borradores genuinos — sin spam.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase)](https://supabase.com/)
[![Claude](https://img.shields.io/badge/Claude-Scoring%20%2B%20Drafts-D97757)](https://anthropic.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Qué hace

SubSignal monitorea comunidades donde tu ICP ya está preguntando, detecta señales de alta intención y te ayuda a responder con valor:

1. **Keywords** — Definís qué buscar (ej. `crm for startups`, `alternative to X`).
2. **Monitor** — Un cron escanea Hacker News cada 15 min (Reddit/Twitter en roadmap).
3. **Scoring** — Claude puntúa cada post del 1 al 10 según intención de compra.
4. **Alertas** — Email (Resend) y Slack cuando aparece una señal relevante.
5. **Borradores IA** — Respuestas editables listas para publicar, generadas con Claude.

Pensado para indie hackers y founders que venden participando en conversaciones reales, no haciendo cold outreach.

---

## Features

| Área | Detalle |
|------|---------|
| **Plataformas** | Hacker News ✅ · Reddit ⏳ · Twitter/X ⏳ · Indie Hackers ⏳ |
| **Auth** | Google OAuth vía Supabase |
| **Onboarding** | 2 pasos: perfil + primera keyword |
| **Dashboard** | Señales, keywords, borradores, analytics, settings |
| **Notificaciones** | Digest agrupado por email + webhook Slack |
| **Planes** | Free · Starter ($29) · Growth ($49) · Pro ($79) |
| **Marketing** | Landing + `/pricing` con tabla comparativa y FAQ |
| **UX** | Tour guiado, skeletons, error boundaries |

---

## Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Estilos:** Tailwind CSS 4
- **Backend:** Supabase (Postgres, Auth, RLS)
- **IA:** Anthropic Claude (scoring + borradores)
- **Email:** Resend
- **Deploy:** Vercel + Cron Jobs

---

## Quick start

### Requisitos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com)
- API key de [Anthropic](https://console.anthropic.com)

### 1. Clonar e instalar

```bash
git clone https://github.com/TU_USUARIO/subsignal.git
cd subsignal
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completá al menos:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=                    # openssl rand -base64 32
```

Opcionales (alertas y pagos):

```env
RESEND_API_KEY=
EMAIL_FROM=SubSignal <alertas@tudominio.com>
PAYMENT_WEBHOOK_SECRET=
```

### 3. Base de datos

En Supabase SQL Editor, ejecutá las migraciones en orden:

```
supabase/migrations/20250620000000_initial_schema.sql
supabase/migrations/20250620100000_processed_posts_user_id.sql
```

O con Supabase CLI local:

```bash
npx supabase start
npx supabase db reset
```

### 4. Auth con Google

**Supabase → Authentication → URL Configuration**

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/callback`

**Supabase → Providers → Google**

1. Activá Google OAuth
2. Creá credenciales en [Google Cloud Console](https://console.cloud.google.com/)
3. Redirect URI: la URL que muestra Supabase (`https://<project>.supabase.co/auth/v1/callback`)
4. Pegá Client ID y Client Secret en Supabase

Login en `/login` — un solo botón **Continuar con Google**.

### 5. Correr en local

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Si ves errores de cache webpack:

```bash
npm run dev:clean
```

### 6. Probar el pipeline

Con el dev server corriendo:

```bash
# Monitor HN manual
curl -H "Authorization: Bearer $CRON_SECRET" \
  "http://localhost:3000/api/monitors/hackernews?keyword=saas"

# Pipeline completo (fetch → score → guardar → notificar)
npm run cron:local
```

En producción, Vercel Cron llama `/api/cron/process` cada 15 minutos.

---

## Deploy en Vercel

1. Importá el repo en [vercel.com](https://vercel.com)
2. Agregá todas las variables de `.env.local`
3. Seteá `NEXT_PUBLIC_APP_URL` a tu dominio de producción
4. Actualizá las redirect URLs en Supabase con el dominio real
5. Deploy — el cron de `vercel.json` se activa automáticamente

---

## Estructura del proyecto

```
app/
├── (marketing)/     Landing, pricing
├── (dashboard)/     Dashboard, signals, keywords, drafts, analytics, settings
├── (onboarding)/    Flujo de alta
├── (auth)/          Login / callback
└── api/             Monitors, cron, drafts, webhooks

components/          UI, marketing, billing, dashboard
lib/
├── monitors/        Adapters por plataforma (HN activo)
├── scoring/         Prompts y lógica Claude
├── drafts/          Generación de borradores
├── notifications/   Resend + Slack
├── payments/        Planes, límites, checkout, webhook
└── cron/            Pipeline process-signals

supabase/migrations/ Schema Postgres + RLS
types/               Tipos compartidos
```

---

## Planes y límites

| Plan | Precio | Keywords | Borradores IA | Alertas email |
|------|--------|----------|---------------|---------------|
| Free | $0 | 2 | — | 5 / día |
| Starter | $29/mes | 5 | 20 / mes | Ilimitadas |
| Growth | $49/mes | 15 | Ilimitados | Ilimitadas |
| Pro | $79/mes | ∞ | Ilimitados | Ilimitadas |

Lógica centralizada en `lib/payments/checks.ts`. Webhook genérico en `POST /api/webhooks/payments` (compatible con Paddle, Creem, etc.).

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run dev:clean` | Dev con cache limpio |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run cron:local` | Ejecutar pipeline de señales en local |

---

## Roadmap

- [x] Auth Google + onboarding
- [x] Monitor Hacker News + scoring Claude
- [x] Borradores IA + límites por plan
- [x] Notificaciones email + Slack
- [x] Landing + pricing + tour
- [ ] Reddit (adapter stub listo)
- [ ] Twitter/X (evaluar costo API)
- [ ] Checkout Paddle / Creem
- [ ] Páginas legales (terms, privacy, refund)

---

## Licencia

Proyecto privado. Todos los derechos reservados.

---

## Autor

Built by a founder, for founders who sell with value — not spam.
