# SubSignal

Plataforma de intent monitoring para founders SaaS. Monitorea Hacker News, Reddit y más; puntúa conversaciones por intención de compra y genera borradores de respuesta.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Supabase** (auth, DB, RLS)
- **Anthropic Claude** (scoring y drafts)
- **Vercel** (deploy + cron jobs)

## Setup local

### 1. Dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Completá las variables marcadas como "usar desde el día 1" en `.env.example`.

### 3. Supabase

**Opción A — Supabase Cloud**

1. Creá un proyecto en [supabase.com](https://supabase.com)
2. Ejecutá la migración en SQL Editor:

```bash
# Contenido de supabase/migrations/20250620000000_initial_schema.sql
```

**Opción B — Supabase local**

```bash
npx supabase start
npx supabase db reset
```

### 4. Desarrollo

```bash
npm run dev
```

Si ves errores de módulos webpack (`Cannot find module './611.js'`), limpiá el cache:

```bash
npm run dev:clean
```

Abrí [http://localhost:3000](http://localhost:3000).

### 5. Auth (Supabase)

En el dashboard de Supabase → **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/callback`

Para Google OAuth: **Authentication → Providers → Google** (habilitar y configurar credenciales de Google Cloud Console).

## Estructura del proyecto

```
/app          → Rutas (marketing, auth, dashboard, API)
/components   → UI y componentes por feature
/lib          → Lógica de negocio (monitors, scoring, notificaciones, pagos)
/types        → Tipos TypeScript compartidos
/supabase     → Migraciones y config local
```

## Scripts

| Comando        | Descripción              |
|----------------|--------------------------|
| `npm run dev`  | Servidor de desarrollo   |
| `npm run build`| Build de producción      |
| `npm run start`| Servidor de producción   |
| `npm run lint` | ESLint                   |
