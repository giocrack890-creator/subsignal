"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MarketingPlanGrid } from "@/components/marketing/pricing/marketing-plan-grid";

const FAQ_ITEMS = [
  {
    question: "¿Puedo cancelar en cualquier momento?",
    answer:
      "Sí. Podés cancelar desde tu cuenta en cualquier momento. No hay períodos mínimos ni penalidades. Al cancelar, tu plan sigue activo hasta el final del período pagado.",
  },
  {
    question: "¿Qué plataformas monitorea SubSignal?",
    answer:
      "Actualmente Hacker News está activo. Reddit está disponible en planes Starter y Pro. Twitter/X e Indie Hackers están disponibles en el plan Pro y se están expandiendo. Avisamos por email cuando agregamos nuevas plataformas.",
  },
  {
    question: "¿Qué es un draft de respuesta?",
    answer:
      "Cuando SubSignal encuentra una conversación donde tu cliente ideal pide exactamente lo que vos vendés, genera un borrador de respuesta genuino y útil listo para copiar. Vos lo revisás, lo ajustás si querés, y lo publicás desde tu cuenta. Nunca publicamos automáticamente — siempre sos vos.",
  },
  {
    question: "¿Cómo cobran? ¿Puedo pagar con tarjeta?",
    answer:
      "Aceptamos tarjetas de crédito y débito de todo el mundo (Visa, Mastercard, Amex). El cobro es mensual y automático. Los pagos son procesados de forma segura.",
  },
  {
    question: "¿Puedo cambiar de plan?",
    answer:
      "Sí, podés upgradear o bajar de plan en cualquier momento desde tu configuración. Los cambios aplican al próximo período de facturación.",
  },
];

function PricingFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`border-b border-[#232323] ${isOpen ? "open" : ""}`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-white">
                {item.question}
              </span>
              <span
                className="shrink-0 text-2xl font-light text-[#6B6B6B]"
                aria-hidden
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-base leading-relaxed text-[#B4B4B4]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CHECKOUT_ERROR_MESSAGES: Record<string, string> = {
  payments:
    "Los pagos no están disponibles en este momento. Volvé a intentar en unos minutos o contactanos si el problema continúa.",
  checkout:
    "No pudimos iniciar el checkout. Intentá de nuevo en unos minutos o contactanos si el problema persiste.",
  checkout_auth:
    "Error de autenticación con Creem. Verificá que CREEM_API_KEY coincida con el entorno: en producción usá CREEM_TEST_MODE=false y la API key live.",
  checkout_product:
    "No encontramos el producto en Creem. Verificá que CREEM_PRODUCT_STARTER y CREEM_PRODUCT_PRO sean los IDs correctos para tu entorno (test vs live).",
};

function PricingCheckoutAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = error ? CHECKOUT_ERROR_MESSAGES[error] : null;

  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-8 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-200"
    >
      {message}
    </div>
  );
}

export function PricingPageContent() {
  return (
    <main id="main-content" className="pt-24 pb-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <Suspense fallback={null}>
          <PricingCheckoutAlert />
        </Suspense>

        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#34D399]">
            Planes simples
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Encontrá a tu próximo cliente todos los días
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#B4B4B4]">
            Empezá gratis. Upgrades cuando lo necesitás. Sin contratos, cancelás
            cuando querés.
          </p>
        </header>

        <div className="mt-14">
          <MarketingPlanGrid variant="page" />
        </div>

        <p className="mt-10 text-center text-sm text-[#6B6B6B]">
          Todos los planes incluyen cancelación inmediata. Sin preguntas, sin
          períodos de aviso.
        </p>

        <section className="mt-20" aria-labelledby="pricing-faq-heading">
          <h2
            id="pricing-faq-heading"
            className="text-center text-2xl font-semibold text-white md:text-3xl"
          >
            Preguntas frecuentes
          </h2>
          <div className="mt-10">
            <PricingFaqAccordion />
          </div>
        </section>
      </div>
    </main>
  );
}
