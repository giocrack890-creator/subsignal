import Link from "next/link";
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
      {/* Logo minimalista */}
      <Link href="/" className="flex items-center gap-2.5">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="20"
            height="20"
            rx="4"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
          <path
            d="M6 11h10M11 6v10"
            stroke="#39ff88"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-base font-semibold tracking-tight text-foreground">
          SubSignal
        </span>
      </Link>

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
