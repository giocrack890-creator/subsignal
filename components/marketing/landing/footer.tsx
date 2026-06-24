import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";

const FOOTER_LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/pricing", label: "Precios" },
  { href: "/#plataformas", label: "Plataformas" },
  { href: "/#faq", label: "FAQ" },
  { href: "/login", label: "Login" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Términos" },
  { href: "/privacy", label: "Privacidad" },
  { href: "/refunds", label: "Reembolsos" },
];

const SOCIAL: { label: string; href: string; abbr: string }[] = [];

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-marketing mx-auto max-w-5xl px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <AppLogo variant="wordmark" size="sm" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground-secondary">
              ThreadPulse — intent monitoring para founders. Encontrá clientes donde ya están preguntando.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Producto
            </p>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-sm text-foreground-secondary transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Legal
            </p>
            <ul className="mt-4 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-sm text-foreground-secondary transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Seguinos
            </p>
            <div className="mt-4 flex gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-xs font-medium text-foreground-muted transition-colors duration-200 hover:border-border-glow hover:text-foreground"
                >
                  {s.abbr}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-8 text-xs text-foreground-muted sm:flex-row">
          <span>© {new Date().getFullYear()} ThreadPulse</span>
          <span>Hecho para founders que venden con valor, no con spam.</span>
        </div>
      </div>
    </footer>
  );
}
