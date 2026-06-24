import type { Metadata } from "next";
import {
  LegalHighlight,
  LegalPageShell,
  LegalSection,
} from "@/components/marketing/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Política de Reembolsos — SubSignal",
  description:
    "Política de reembolsos de SubSignal. Cancelación, excepciones, período de prueba y cómo solicitar un reembolso.",
};

export default function RefundsPage() {
  return (
    <LegalPageShell>
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          Política de Reembolsos
        </h1>
        <p className="mt-3 text-sm text-[#6B6B6B]">
          Última actualización: junio 2026
        </p>
      </header>

      <div className="space-y-6">
        <LegalHighlight>
          Queremos que estés satisfecho con SubSignal. Si algo no funcionó como
          esperabas, hablanos.
        </LegalHighlight>

        <LegalSection title="Política general">
          <p>
            Los pagos de suscripción no son reembolsables una vez que el
            período comienza. Esto es estándar en la industria SaaS porque el
            acceso al servicio fue provisto.
          </p>
        </LegalSection>

        <LegalSection title="Excepciones — cuándo sí reembolsamos">
          <p>Hacemos reembolso completo del último pago si:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El servicio estuvo inaccesible por más de 48 horas continuas por
              causas de nuestra infraestructura
            </li>
            <li>Hubo un cobro duplicado por error técnico</li>
            <li>
              La solicitud llega dentro de las 48 horas del pago y el usuario no
              usó el servicio en ese período
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Período de prueba">
          <p>
            El plan Free permite explorar SubSignal sin pagar. Te recomendamos
            probarlo antes de suscribirte a un plan pago.
          </p>
        </LegalSection>

        <LegalSection title="Cancelación">
          <p>
            Podés cancelar en cualquier momento desde Configuración → Plan →
            Cancelar suscripción. Al cancelar:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>No se realizan más cobros</li>
            <li>
              Tu acceso al plan pago continúa hasta el final del período ya
              pagado
            </li>
            <li>Después de eso, pasás automáticamente al plan Free</li>
          </ul>
        </LegalSection>

        <LegalSection title="Cómo solicitar un reembolso">
          <p>Si creés que aplica una excepción:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Email a{" "}
              <a
                href="mailto:hello@subsignal.io"
                className="text-[#34D399] hover:underline"
              >
                hello@subsignal.io
              </a>
            </li>
            <li>Asunto: &quot;Solicitud de reembolso&quot;</li>
            <li>Incluí tu email de cuenta y motivo</li>
            <li>Respondemos en menos de 48 horas hábiles</li>
            <li>
              Si aplica, el reembolso llega en 5-10 días hábiles según tu banco
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Contacto">
          <p>
            <a
              href="mailto:hello@subsignal.io"
              className="text-[#34D399] hover:underline"
            >
              hello@subsignal.io
            </a>
          </p>
          <p>Respondemos todas las consultas en menos de 48 horas.</p>
        </LegalSection>
      </div>
    </LegalPageShell>
  );
}
