"use client";

import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#inicio", label: "Home" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "/pricing", label: "Precios", page: true },
  { href: "#plataformas", label: "Plataformas" },
];

function resolveHref(href: string, pathname: string, isPage?: boolean): string {
  if (isPage || href.startsWith("/")) return href;
  if (pathname !== "/") return `/${href}`;
  return href;
}

export function LandingNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const homeHref = pathname === "/" ? "#inicio" : "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-5 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <AppLogo variant="icon" size="md" href={homeHref} />

        <nav
          className="pill-dock hidden items-center gap-0.5 rounded-full px-1.5 py-1 lg:flex"
          aria-label="Principal"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={resolveHref(item.href, pathname, item.page)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors duration-200 hover:text-foreground ${
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="cursor-pointer rounded-full border border-border-strong px-4 py-1.5 text-sm text-foreground-secondary transition-colors duration-200 hover:text-foreground"
          >
            Login
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link href="/login" className="cursor-pointer">
            <Button variant="primary" size="md" showArrow>
              Empezar gratis
            </Button>
          </Link>
          <Link href="/pricing" className="cursor-pointer">
            <Button variant="outline" size="md">
              Ver precios
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-lg p-2 text-foreground-muted lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="pill-dock mx-auto mt-3 max-w-md rounded-2xl p-4 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={resolveHref(item.href, pathname, item.page)}
              className="block cursor-pointer py-2 text-sm text-foreground-secondary"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-2 block cursor-pointer py-2 text-sm text-foreground-secondary"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link href="/login" className="mt-2 block" onClick={() => setOpen(false)}>
            <Button variant="primary" size="md" className="w-full" showArrow>
              Empezar gratis
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
