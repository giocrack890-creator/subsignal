import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#plataformas", label: "Plataformas" },
  { href: "/#faq", label: "FAQ" },
  { href: "/login", label: "Login" },
];

const LEGAL_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/terms", label: "Términos" },
  { href: "/privacy", label: "Privacidad" },
  { href: "/refunds", label: "Reembolsos" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[#27272A] py-12">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="flex items-center gap-2 font-extrabold text-[#FAFAFA]">
              <span className="sf-dot-pulse" />
              SubSignal
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#A1A1AA]">
              Intent monitoring para founders. Encontrá clientes donde ya están
              preguntando.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
              Producto
            </p>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
              Legal
            </p>
            <ul className="mt-4 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
              Status
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#A1A1AA]">
              <span className="sf-dot-pulse" />
              Beta privada — HN activo
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[#27272A] pt-8 text-xs text-[#71717A] sm:flex-row">
          <span>© {new Date().getFullYear()} SubSignal</span>
          <span>Hecho para founders que venden con valor, no con spam.</span>
        </div>
      </div>
    </footer>
  );
}
