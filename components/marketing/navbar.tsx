import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home", active: true },
  { href: "/#how-it-works", label: "Cómo funciona" },
  { href: "/pricing", label: "Precios" },
  { href: "/#platforms", label: "Plataformas" },
];

export function MarketingNavbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-10">
      <AppLogo variant="wordmark" size="md" href="/" />

      {/* Nav pill central (Ape Terminal style) */}
      <nav className="pill-dock hidden items-center gap-0.5 rounded-full px-1.5 py-1 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              link.active
                ? "pill-nav-active text-foreground"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <Link href="/login">
        <Button variant="outline" size="md" showArrow>
          Entrar
        </Button>
      </Link>
    </header>
  );
}
