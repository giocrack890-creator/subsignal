# SubSignal

Intent monitoring para founders SaaS. Detecta conversaciones con intención de compra en Hacker News, las puntúa con IA y ayuda a responder con borradores editables.

## Stack

- Next.js 15 · React 19 · Tailwind CSS 4
- Supabase (auth, Postgres, RLS)
- Anthropic Claude (scoring y borradores)
- Resend (alertas email) · Vercel Cron

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Completar variables en .env.local
npm run dev
```

Variables requeridas: ver `.env.example`.

Migraciones de base de datos en `supabase/migrations/`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run cron:local` | Ejecutar pipeline de señales en local |

## Licencia

Todos los derechos reservados.
