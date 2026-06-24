"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/marketing/landing/motion";
import { SectionHeading } from "@/components/marketing/landing/section-heading";

const FAQ_ITEMS = [
  {
    q: "¿Publicamos respuestas automáticamente?",
    a: "No. Generamos borradores para que vos los edites y publiques. Nunca posteamos en tu nombre — así evitás baneos y sonás auténtico.",
  },
  {
    q: "¿Puedo monitorear mi marca y competidores?",
    a: "Sí. Agregá keywords con el nombre de tu producto, competidores o frases como 'alternative to X'. Recibís alertas cuando aparecen en Reddit o Hacker News.",
  },
  {
    q: "¿Cómo detectan cuentas sospechosas o shills?",
    a: "Analizamos patrones del autor y del contenido (cuentas nuevas, lenguaje promocional coordinado, etc.) y marcamos señales de riesgo para que priorices conversaciones reales.",
  },
  {
    q: "¿Qué plataformas están disponibles?",
    a: "Hacker News está activo en el plan Free. Reddit desde Starter. Twitter/X e Indie Hackers en planes superiores.",
  },
  {
    q: "¿Necesito tarjeta de crédito para empezar?",
    a: "No. El plan Free no requiere tarjeta. Entrás con Google y configurás tu producto en minutos.",
  },
  {
    q: "¿Cómo funciona el scoring de intención?",
    a: "Claude analiza cada post contra tus keywords y contexto de producto. Asigna un puntaje del 1 al 10 según qué tan probable es que la persona busque una solución como la tuya.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. Los planes de pago son mensuales sin compromiso. Podés bajar de plan o volver al Free en cualquier momento.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="landing-section relative scroll-mt-24 border-t border-border"
      aria-labelledby="faq-heading"
    >
      <div className="container-marketing px-6">
        <SectionHeading
          id="faq-heading"
          title="Preguntas frecuentes"
          subtitle="Lo esencial antes de empezar a monitorear Reddit y Hacker News."
        />

        <div className="mx-auto mt-12 max-w-2xl divide-y divide-border rounded-2xl border border-border bg-background-card">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeIn key={item.q} delay={i * 0.04}>
                <div>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-background-card-hover"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className="text-[15px] font-semibold text-foreground">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-foreground-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-4 text-[15px] leading-relaxed text-foreground-secondary">
                      {item.a}
                    </p>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
