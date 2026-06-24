# Guía de configuración de cuentas — SubSignal

Instrucciones paso a paso para dejar operativo el monitoreo de cada plataforma, la IA y los servicios de soporte. Escrito para founders sin necesidad de ser desarrollador.

---

## Antes de empezar

1. Copiá `.env.example` a `.env.local` en la raíz del proyecto.
2. Completá las variables según cada sección.
3. En producción (Vercel), pegá las mismas variables en **Settings → Environment Variables**.
4. Reiniciá el servidor después de cada cambio local: `npm run dev`.

---

## Hacker News

### ¿Necesita credenciales?

**No.** Hacker News funciona desde el día uno sin crear ninguna cuenta de API.

### ¿Qué usa SubSignal?

SubSignal consulta la **API pública de Algolia** que usa el propio Hacker News:

- Endpoint: `https://hn.algolia.com/api/v1/search_by_date`
- Busca posts y comentarios de las últimas **24 horas** que coincidan con tus keywords.
- Es **gratis** y no requiere registro.

### ¿Cómo verificar que funciona?

1. Configurá al menos una keyword en **Keywords** (plan Free alcanza).
2. Ejecutá el pipeline manualmente en local:
   ```bash
   npm run dev          # en una terminal
   npm run cron:local   # en otra
   ```
3. Revisá el dashboard: si hay conversaciones con intención alta, aparecen en **Señales**.
4. En producción, el cron externo (cron-job.org) debe llamar a `/api/cron/process` con el header `Authorization: Bearer TU_CRON_SECRET`.

---

## Reddit

### ¿Necesita credenciales?

**Sí.** Sin ellas, SubSignal sigue funcionando en HN pero Reddit queda deshabilitado.

### Importante (política 2025)

Reddit puede pedirte **aprobar el acceso a la API antes** de poder crear una app en `reddit.com/prefs/apps`. Si no te deja crear la app:

1. Completá el formulario de **Data API Access Request** en el portal de desarrolladores de Reddit.
2. Explicá que construís una herramienta de monitoreo de intención (no spam, no auto-post).
3. Cuando aprueben, seguí los pasos de abajo.

### Paso a paso

| Paso | Acción |
|------|--------|
| 1 | Creá una cuenta en [reddit.com](https://www.reddit.com) si no tenés una. |
| 2 | Entrá a [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) (logueado). |
| 3 | Clic en **“create another app…”** o **“create app”**. |
| 4 | Tipo de app: **script** (no “web app”). |
| 5 | **name:** `SubSignal` (o el nombre que quieras). |
| 6 | **redirect uri:** `http://localhost:8080` (Reddit lo exige; en apps script casi no se usa). |
| 7 | **Client ID:** es el string corto **debajo del nombre** de la app (no confundir con el secret). |
| 8 | **Client secret:** aparece como **“secret”** en la misma pantalla. |
| 9 | Pegá los valores en `.env.local` y en Vercel (ver tabla de variables abajo). |
| 10 | **User agent:** Reddit lo exige con formato legible, por ejemplo: `SubSignal/1.0 (by /u/tu_usuario_reddit)` |

### Límites del free tier y cómo no superarlos

- Reddit limita la cantidad de requests por minuto para apps OAuth (típicamente ~60 req/min para apps pequeñas; puede variar).
- SubSignal busca en **subreddits configurados** (máx. 10 por keyword) con ventana de **24 horas**.
- **Recomendaciones:**
  - No agregues decenas de subreddits por keyword.
  - Dejá que el cron corra **una vez al día** (como está en Hobby/Vercel), no cada pocos minutos.
  - Si ves errores 429 en logs, reducí subreddits o frecuencia del cron.

### Verificación

Con las 3 variables de Reddit configuradas, corré `npm run cron:local` y revisá que en logs no diga “Reddit no configurado”. Las señales de Reddit aparecen con badge **Reddit** en el dashboard.

---

## Twitter / X

### ¿Necesita credenciales?

**Sí.** Variable `TWITTER_BEARER_TOKEN`.

### Paso a paso

| Paso | Acción |
|------|--------|
| 1 | Entrá a [developer.x.com](https://developer.x.com) (antes developer.twitter.com). |
| 2 | Creá una **cuenta de desarrollador** (gratis registrarse; el uso de la API puede tener costo según el plan). |
| 3 | Creá un **proyecto** y una **app** dentro del proyecto. |
| 4 | En la app, andá a **Keys and tokens**. |
| 5 | Generá un **Bearer Token** (OAuth 2.0). |
| 6 | Copialo en `TWITTER_BEARER_TOKEN` en `.env.local` y Vercel. |

### Limitaciones del plan gratuito / Basic de Twitter API

SubSignal usa el endpoint `GET /2/tweets/search/recent`. En la práctica:

| Límite | Detalle |
|--------|---------|
| Lectura mensual | En planes de pago suele haber cupo de tweets leídos (ej. orden de cientos de miles/mes según tier; el free tier cambió varias veces — revisá el portal actual). |
| Ventana de búsqueda | Solo los **últimos 7 días** (`search/recent`). |
| Rate limit | Aprox. **1 request cada 15 segundos** por app en endpoints de búsqueda (puede variar por tier). |
| Idioma | SubSignal filtra `lang:en` en las búsquedas. |

### Cómo maneja SubSignal estos límites

- Busca como máximo **~20 tweets** por keyword por corrida.
- Usa ventana de **24 horas** (`start_time` en la query).
- Si la API devuelve error, el cron lo registra en `errors` y sigue con otras plataformas (no tumba todo el pipeline).
- **Recomendación:** no actives Twitter hasta tener un plan de API que cubra tu volumen; el costo del tier Basic suele ser **~USD 100/mes** (verificar en developer.x.com).

### Verificación

Con `TWITTER_BEARER_TOKEN` definido y una keyword con plataforma Twitter activa, corré el cron y buscá señales con badge **X**.

---

## Indie Hackers

### ¿Tiene API oficial?

**No.** Indie Hackers no publica una API documentada para terceros.

### ¿Qué usa SubSignal?

SubSignal usa la **misma búsqueda pública de Algolia** que el sitio de Indie Hackers (clave *search-only* expuesta en su frontend). **No hace scraping HTML.**

- Índice: `Post`
- Ventana: posts de las últimas **48 horas**
- **No requiere credenciales** ni variables de entorno adicionales.

### ¿Hay que configurar algo?

**No.** Si Indie Hackers está habilitado en tu keyword (planes de pago con múltiples plataformas), funciona automáticamente junto con el cron.

### Verificación

Agregá `ih` como plataforma en una keyword (cuando tu plan lo permita) y revisá señales con badge **IH** tras una corrida del monitor.

---

## Anthropic (Claude API)

SubSignal usa Claude para:

1. **Scoring de intención** (modelo rápido: Haiku)
2. **Borradores de respuesta** (modelo de calidad: Sonnet) — solo planes de pago y señales con score ≥ 7

### Paso a paso

| Paso | Acción |
|------|--------|
| 1 | Entrá a [console.anthropic.com](https://console.anthropic.com). |
| 2 | Creá cuenta o iniciá sesión. |
| 3 | Andá a **API Keys** → **Create Key**. |
| 4 | Copiá la key en `ANTHROPIC_API_KEY` (local + Vercel). |
| 5 | Opcional: configurá un **límite de gasto mensual** en la consola para evitar sorpresas. |

### Costo aproximado por señal

Precios orientativos (ver [anthropic.com/pricing](https://www.anthropic.com/pricing); pueden cambiar):

| Operación | Modelo | Tokens típicos | Costo aprox. |
|-----------|--------|----------------|--------------|
| Scoring | Claude 3.5 Haiku | ~400 entrada + ~80 salida | **~USD 0.0002** por post |
| Borrador | Claude 3.5 Sonnet | ~600 entrada + ~250 salida | **~USD 0.005** por borrador |

**Ejemplo mensual:**

- 100 señales puntuadas/mes → ~**USD 0.02** solo en scoring.
- 50 borradores generados/mes → ~**USD 0.25** adicionales.
- Total orientativo: **menos de USD 1/mes** con volumen bajo de un founder.

Con más keywords y más plataformas, el costo sube linealmente con la cantidad de posts que pasan el filtro de score.

---

## Otros servicios (no son plataformas de monitoreo)

### Supabase — obligatorio

Base de datos, auth (Google login) y almacenamiento de señales.

- Dashboard → **Settings → API**
- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Ejecutá las migraciones SQL de `supabase/migrations/` en el SQL Editor de Supabase.

### Resend — opcional (emails de alerta)

Sin `RESEND_API_KEY`, las alertas solo se loguean en consola en desarrollo.

- [resend.com](https://resend.com) → API Key + dominio verificado
- Variables: `RESEND_API_KEY`, `EMAIL_FROM`

### Cron en producción — obligatorio en Vercel Hobby

Vercel Hobby no ejecuta crons frecuentes. Usá [cron-job.org](https://cron-job.org):

- URL: `https://tu-dominio.com/api/cron/process`
- Método: GET o POST
- Header: `Authorization: Bearer TU_CRON_SECRET`
- Frecuencia recomendada: **1 vez al día**

Generá el secret: `openssl rand -base64 32` → variable `CRON_SECRET`.

### Stripe — opcional (pagos)

Solo si activás checkout. Ver comentarios en `.env.example`.

---

## Resumen de variables de entorno

| Variable | Obligatoria | Dónde conseguirla |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sí | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sí | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Sí | Supabase → Settings → API (solo servidor) |
| `ANTHROPIC_API_KEY` | ✅ Sí | console.anthropic.com → API Keys |
| `NEXT_PUBLIC_APP_URL` | ✅ Sí | URL de tu app (`http://localhost:3000` o dominio prod) |
| `CRON_SECRET` | ✅ Sí (prod) | Generá con `openssl rand -base64 32` |
| `REDDIT_CLIENT_ID` | Opcional | reddit.com/prefs/apps → app tipo script |
| `REDDIT_CLIENT_SECRET` | Opcional | Misma pantalla de la app Reddit |
| `REDDIT_USER_AGENT` | Opcional | Texto libre con formato `App/1.0 (by /u/usuario)` |
| `TWITTER_BEARER_TOKEN` | Opcional | developer.x.com → App → Bearer Token |
| `RESEND_API_KEY` | Opcional | resend.com → API Keys |
| `EMAIL_FROM` | Opcional | Email con dominio verificado en Resend |
| `STRIPE_SECRET_KEY` | Opcional | dashboard.stripe.com → Developers |
| `STRIPE_WEBHOOK_SECRET` | Opcional | Stripe → Webhooks |
| `STRIPE_CHECKOUT_ENABLED` | Opcional | `true` para activar checkout |
| `STRIPE_PRICE_STARTER` | Opcional | ID de precio mensual en Stripe |
| `STRIPE_PRICE_GROWTH` | Opcional | ID de precio mensual en Stripe |
| `STRIPE_PRICE_PRO` | Opcional | ID de precio mensual en Stripe |
| `PAYMENT_WEBHOOK_SECRET` | Opcional | Webhook genérico de prueba |

**Plataformas sin variable de entorno:** Hacker News, Indie Hackers.

---

## Checklist rápido “¿está todo andando?”

- [ ] Login con Google funciona (`NEXT_PUBLIC_APP_URL` correcta en prod).
- [ ] Keywords activas en el dashboard.
- [ ] `npm run cron:local` crea señales o muestra “0 señales” sin errores fatales.
- [ ] HN: señales con badge naranja **HN**.
- [ ] Reddit: variables configuradas y señales **Reddit** (si aprobó la API).
- [ ] Twitter: `TWITTER_BEARER_TOKEN` y señales **X** (si pagás el tier de API).
- [ ] IH: señales **IH** en keywords con esa plataforma.
- [ ] Plan pago: borradores visibles en signal cards (score ≥ 7).
- [ ] Emails: `RESEND_API_KEY` + dominio verificado (si querés alertas reales).

---

¿Algo no funciona? Revisá los logs del cron en Vercel o la salida de `npm run cron:local` — ahí aparece el detalle por plataforma (fetch, scoring, draft, notificación).
