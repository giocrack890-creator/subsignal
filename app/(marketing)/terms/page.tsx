import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPageShell,
  LegalSection,
} from "@/components/marketing/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Términos de Servicio — ThreadPulse",
  description:
    "Términos de uso de ThreadPulse. Condiciones de cuenta, planes, uso aceptable, contenido generado por IA y limitación de responsabilidad.",
};

export default function TermsPage() {
  return (
    <LegalPageShell>
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white">Términos de Servicio</h1>
        <p className="mt-3 text-sm text-[#6B6B6B]">
          Última actualización: junio 2026
        </p>
      </header>

      <div className="space-y-6">
        <LegalSection title="Aceptación de términos">
          <p>
            Al usar este servicio aceptás estos términos. Si no estás de acuerdo, no
            uses el servicio.
          </p>
        </LegalSection>

        <LegalSection title="Descripción del servicio">
          <p>
            Esta plataforma es un servicio de monitoreo de conversaciones que
            encuentra menciones de alta intención en plataformas públicas
            (Hacker News, Reddit, Twitter/X, Indie Hackers) y genera borradores
            de respuesta usando inteligencia artificial.
          </p>
        </LegalSection>

        <LegalSection title="Cuentas de usuario">
          <ul className="list-disc space-y-2 pl-5">
            <li>Debés tener 13 años o más para usar el servicio</li>
            <li>Sos responsable de mantener tu contraseña segura</li>
            <li>No podés compartir tu cuenta con terceros</li>
            <li>
              Podemos suspender cuentas que violen estos términos
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Planes y pagos">
          <ul className="list-disc space-y-2 pl-5">
            <li>Los precios están en USD</li>
            <li>El cobro es mensual y automático</li>
            <li>Podés cancelar en cualquier momento</li>
            <li>
              No hacemos reembolsos de períodos ya pagados excepto en los casos
              indicados en nuestra{" "}
              <Link href="/refunds" className="text-[#34D399] hover:underline">
                Política de Reembolsos
              </Link>
            </li>
            <li>
              Nos reservamos el derecho de cambiar precios con 30 días de aviso
              previo
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Uso aceptable">
          <p>El usuario NO puede:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Usar el servicio para spam o comunicaciones no solicitadas
            </li>
            <li>Publicar respuestas automáticas sin revisión humana</li>
            <li>Intentar acceder a datos de otros usuarios</li>
            <li>Usar el servicio para actividades ilegales</li>
            <li>Hacer ingeniería inversa del sistema</li>
            <li>Revender o sublicenciar el servicio</li>
          </ul>
        </LegalSection>

        <LegalSection title="Contenido generado por IA">
          <p>
            Los drafts de respuesta son generados por IA y son sugerencias.
            El contenido generado por IA no garantiza su precisión, idoneidad o resultados. El
            usuario es 100% responsable del contenido que publique en
            plataformas externas.
          </p>
        </LegalSection>

        <LegalSection title="Datos y privacidad">
          <p>
            El uso de tus datos personales está regulado por nuestra{" "}
            <Link href="/privacy" className="text-[#34D399] hover:underline">
              Política de Privacidad
            </Link>
            , disponible en /privacy.
          </p>
        </LegalSection>

        <LegalSection title="Propiedad intelectual">
          <p>
            El servicio y su contenido son propiedad de sus creadores. No te
            transferimos ningún derecho de propiedad intelectual al usar el
            servicio.
          </p>
        </LegalSection>

        <LegalSection title="Limitación de responsabilidad">
          <p>
            El servicio se provee &quot;tal cual&quot;. No garantizamos resultados
            de negocio. Nuestra responsabilidad máxima es el monto pagado en los
            últimos 3 meses.
          </p>
        </LegalSection>

        <LegalSection title="Modificaciones">
          <p>
            Podemos modificar estos términos con aviso de 30 días por email. El
            uso continuado del servicio implica aceptación de los nuevos
            términos.
          </p>
        </LegalSection>

        <LegalSection title="Contacto">
          <p>
            Para preguntas sobre estos términos:{" "}
            <a
              href="mailto:hello@soporte.io"
              className="text-[#34D399] hover:underline"
            >
              hello@soporte.io
            </a>
          </p>
        </LegalSection>
      </div>
    </LegalPageShell>
  );
}
