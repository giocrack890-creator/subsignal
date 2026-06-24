export type MarketingLocale = "es" | "en";

export const MARKETING_LOCALES: MarketingLocale[] = ["es", "en"];

export function isMarketingLocale(value: string): value is MarketingLocale {
  return value === "es" || value === "en";
}

export interface MarketingStrings {
  hero: {
    tagline: string;
    titleLine1: string;
    titleLine2: string;
    features: { label: string }[];
    ctaPrimary: string;
    ctaSecondary: string;
    scrollHint: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    compareLink: string;
    compareLinkHref: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  navbar: {
    home: string;
    howItWorks: string;
    pricing: string;
    platforms: string;
    login: string;
    startFree: string;
    viewPricing: string;
    localeSwitch: string;
  };
  productPreview: {
    title: string;
    subtitle: string;
    viewDraft: string;
  };
}

const ES: MarketingStrings = {
  hero: {
    tagline: "Encontrá la conversación y sabé qué responder",
    titleLine1: "Encontrá clientes",
    titleLine2: "y te dice qué responder",
    features: [
      { label: "Monitoreo Reddit 24/7" },
      { label: "Scoring de intención" },
      { label: "Borradores con IA" },
      { label: "Alertas instantáneas" },
    ],
    ctaPrimary: "Empezar gratis",
    ctaSecondary: "Ver precios",
    scrollHint: "Scroll para explorar",
  },
  pricing: {
    title: "Planes simples",
    subtitle: "Empezá gratis. Escalá cuando veas señales que valen la pena.",
    compareLink: "Ver página de pricing completa →",
    compareLinkHref: "/pricing",
  },
  faq: {
    title: "Preguntas frecuentes",
    subtitle: "Lo esencial antes de empezar a monitorear.",
    items: [
      {
        q: "¿Publicamos respuestas automáticamente?",
        a: "No. Generamos borradores para que vos los edites y publiques. Nunca posteamos en tu nombre.",
      },
      {
        q: "¿Qué plataformas están disponibles hoy?",
        a: "Hacker News está activo en el plan Free. Reddit está disponible desde Starter en adelante. Twitter/X e Indie Hackers se irán habilitando próximamente.",
      },
      {
        q: "¿Necesito tarjeta de crédito para empezar?",
        a: "No. El plan Free no requiere tarjeta. Entrás con Google y configurás tu producto en minutos.",
      },
      {
        q: "¿Cómo funciona el scoring de intención?",
        a: "Claude analiza cada post contra tus keywords y contexto de producto. Asigna un puntaje del 1 al 10 según qué tan probable es que la persona esté buscando una solución como la tuya.",
      },
      {
        q: "¿Puedo cancelar cuando quiera?",
        a: "Sí. Los planes de pago son mensuales sin compromiso. Podés bajar de plan o volver al Free en cualquier momento.",
      },
    ],
  },
  cta: {
    title: "Tu próximo cliente ya está preguntando",
    subtitle: "Plan free · Sin tarjeta · Login con Google",
    button: "Empezar gratis",
  },
  navbar: {
    home: "Home",
    howItWorks: "Cómo funciona",
    pricing: "Precios",
    platforms: "Plataformas",
    login: "Login",
    startFree: "Empezar gratis",
    viewPricing: "Ver precios",
    localeSwitch: "EN",
  },
  productPreview: {
    title: "Tu feed de señales, en tiempo real",
    subtitle:
      "Detectamos conversaciones con intención de compra y te preparamos la respuesta. Datos de ejemplo.",
    viewDraft: "Ver borrador",
  },
};

const EN: MarketingStrings = {
  hero: {
    tagline: "Find the thread and know what to say",
    titleLine1: "Find buyers",
    titleLine2: "and tells you what to reply",
    features: [
      { label: "24/7 Reddit monitoring" },
      { label: "Intent scoring" },
      { label: "AI drafts" },
      { label: "Instant alerts" },
    ],
    ctaPrimary: "Start free",
    ctaSecondary: "View pricing",
    scrollHint: "Scroll to explore",
  },
  pricing: {
    title: "Simple plans",
    subtitle: "Start free. Scale when the signals are worth it.",
    compareLink: "See full pricing page →",
    compareLinkHref: "/en/pricing",
  },
  faq: {
    title: "Frequently asked questions",
    subtitle: "The essentials before you start monitoring.",
    items: [
      {
        q: "Does the app post replies automatically?",
        a: "No. We generate drafts for you to edit and publish. We never post on your behalf.",
      },
      {
        q: "Which platforms are available today?",
        a: "Hacker News is active on the Free plan. Reddit is available from Starter and up. Twitter/X and Indie Hackers are coming soon.",
      },
      {
        q: "Do I need a credit card to start?",
        a: "No. The Free plan requires no card. Sign in with Google and set up your product in minutes.",
      },
      {
        q: "How does intent scoring work?",
        a: "Claude analyzes each post against your keywords and product context. It assigns a 1–10 score based on how likely the person is looking for a solution like yours.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. Paid plans are monthly with no commitment. Downgrade or return to Free whenever you want.",
      },
    ],
  },
  cta: {
    title: "Your next customer is already asking",
    subtitle: "Free plan · No card · Sign in with Google",
    button: "Start free",
  },
  navbar: {
    home: "Home",
    howItWorks: "How it works",
    pricing: "Pricing",
    platforms: "Platforms",
    login: "Login",
    startFree: "Start free",
    viewPricing: "View pricing",
    localeSwitch: "ES",
  },
  productPreview: {
    title: "Your signal feed, in real time",
    subtitle:
      "We detect high-intent conversations and prepare your reply. Sample data.",
    viewDraft: "View draft",
  },
};

export const MARKETING_COPY: Record<MarketingLocale, MarketingStrings> = {
  es: ES,
  en: EN,
};

export function getMarketingCopy(locale: MarketingLocale = "es"): MarketingStrings {
  return MARKETING_COPY[locale];
}

export function localeHomePath(locale: MarketingLocale): string {
  return locale === "en" ? "/en" : "/";
}

export function localePricingPath(locale: MarketingLocale): string {
  return locale === "en" ? "/en/pricing" : "/pricing";
}

export function alternateLocale(locale: MarketingLocale): MarketingLocale {
  return locale === "es" ? "en" : "es";
}

export function localeSwitchPath(
  currentLocale: MarketingLocale,
  pathname: string
): string {
  const target = alternateLocale(currentLocale);
  if (pathname === "/" || pathname === "/en") {
    return localeHomePath(target);
  }
  if (pathname === "/pricing" || pathname === "/en/pricing") {
    return localePricingPath(target);
  }
  return localeHomePath(target);
}
