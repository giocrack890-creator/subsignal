import type { Metadata } from "next";
import {
  LegalPageShell,
  LegalSection,
} from "@/components/marketing/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo recopilamos, usamos y protegemos tu información. Datos de cuenta, señales, drafts, proveedores y tus derechos.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell>
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          Política de Privacidad
        </h1>
        <p className="mt-3 text-sm text-[#6B6B6B]">
          Última actualización: junio 2026
        </p>
      </header>

      <div className="space-y-6">
        <LegalSection title="Información que recopilamos">
          <p className="font-semibold text-white">
            a) Información que nos das:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Email y nombre al registrarte</li>
            <li>
              Información de pago (procesada por CREEM, no almacenamos datos de
              tarjeta)
            </li>
            <li>Keywords y descripción de tu producto</li>
            <li>Configuraciones de cuenta</li>
          </ul>
          <p className="font-semibold text-white">
            b) Información que generamos automáticamente:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Señales encontradas y sus datos</li>
            <li>Drafts generados</li>
            <li>Historial de uso del servicio</li>
            <li>Logs de acceso (IP, dispositivo, navegador)</li>
          </ul>
        </LegalSection>

        <LegalSection title="Cómo usamos tu información">
          <ul className="list-disc space-y-2 pl-5">
            <li>Para proveer y mejorar el servicio</li>
            <li>Para enviarte alertas de señales encontradas</li>
            <li>Para procesar pagos</li>
            <li>Para comunicaciones sobre el servicio</li>
            <li>Para análisis internos de uso (anonimizados)</li>
          </ul>
          <p className="font-semibold text-white">
            No vendemos tu información a terceros. Nunca.
          </p>
        </LegalSection>

        <LegalSection title="Cómo compartimos tu información">
          <p>Solo con estos proveedores necesarios:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Supabase:</strong> almacenamiento
              de datos
            </li>
            <li>
              <strong className="text-white">Anthropic:</strong> procesamiento de
              IA para scoring y drafts
            </li>
            <li>
              <strong className="text-white">CREEM:</strong> procesamiento de
              pagos
            </li>
            <li>
              <strong className="text-white">Resend:</strong> envío de emails
            </li>
          </ul>
          <p>
            Todos están sujetos a sus propias políticas de privacidad.
          </p>
        </LegalSection>

        <LegalSection title="Cookies y tracking">
          <p>
            Usamos cookies esenciales para autenticación. No usamos cookies de
            publicidad ni tracking de terceros. Podés desactivar cookies en tu
            navegador pero el servicio puede no funcionar correctamente.
          </p>
        </LegalSection>

        <LegalSection title="Retención de datos">
          <ul className="list-disc space-y-2 pl-5">
            <li>Datos de cuenta: mientras tu cuenta esté activa</li>
            <li>Señales y drafts: 12 meses desde su creación</li>
            <li>Logs de acceso: 90 días</li>
            <li>
              Al cerrar tu cuenta, eliminamos tus datos en 30 días
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Tus derechos">
          <p>Tenés derecho a:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Acceder a tus datos personales</li>
            <li>Corregir datos incorrectos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Exportar tus datos</li>
          </ul>
          <p>
            Para ejercer estos derechos:{" "}
            <a
              href="mailto:hello@soporte.io"
              className="text-[#34D399] hover:underline"
            >
              hello@soporte.io
            </a>
          </p>
        </LegalSection>

        <LegalSection title="Seguridad">
          <p>
            Usamos encriptación en tránsito (HTTPS) y en reposo. Acceso a datos
            limitado al equipo necesario. Pero ningún sistema es 100% seguro —
            usá el servicio sabiendo esto.
          </p>
        </LegalSection>

        <LegalSection title="Menores">
          <p>
            La plataforma no está dirigida a menores de 13 años. No recopilamos
            datos de menores conscientemente.
          </p>
        </LegalSection>

        <LegalSection title="Cambios a esta política">
          <p>
            Te avisamos por email con 30 días de anticipación ante cambios
            materiales.
          </p>
        </LegalSection>

        <LegalSection title="Contacto">
          <p>
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
