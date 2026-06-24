"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  getMarketingCopy,
  localeHomePath,
  localePricingPath,
  localeSwitchPath,
  type MarketingLocale,
} from "@/lib/i18n/marketing";

interface LandingNavbarProps {
  locale?: MarketingLocale;
}

function resolveHref(
  href: string,
  pathname: string,
  locale: MarketingLocale,
  isPage?: boolean
): string {
  if (isPage || href.startsWith("/")) {
    if (href === "/pricing") return localePricingPath(locale);
    return href;
  }
  const home = localeHomePath(locale);
  if (pathname !== home && pathname !== "/") return `${home}${href}`;
  return href;
}

export function LandingNavbar({ locale = "es" }: LandingNavbarProps) {
  const pathname = usePathname();
  const copy = getMarketingCopy(locale);
  const [open, setOpen] = useState(false);
  const homeHref = pathname === localeHomePath(locale) ? "#inicio" : localeHomePath(locale);

  const NAV = [
    { href: "#como-funciona", label: copy.navbar.howItWorks },
    { href: "/pricing", label: copy.navbar.pricing, page: true },
    { href: "#plataformas", label: copy.navbar.platforms },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#27272A] bg-[rgba(9,9,11,0.85)] backdrop-blur-[16px]">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link
          href={homeHref}
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]"
        >
          <span className="sf-dot-pulse" aria-hidden="true" />
          <span className="text-lg font-extrabold tracking-tight text-[#FAFAFA]">
            SubSignal
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={resolveHref(item.href, pathname, locale, item.page)}
              className="text-sm text-[#A1A1AA] transition-colors duration-200 hover:text-[#FAFAFA]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Link
            href={localeSwitchPath(locale, pathname)}
            className="text-xs font-semibold uppercase tracking-wide text-[#71717A] transition-colors hover:text-[#FAFAFA]"
            aria-label={`Switch to ${copy.navbar.localeSwitch}`}
          >
            {copy.navbar.localeSwitch}
          </Link>
          <Link href="/login" className="sf-btn-ghost !px-5 !py-2.5 text-sm">
            {copy.navbar.login}
          </Link>
          <Link href="/login" className="sf-btn-primary !px-5 !py-2.5 text-sm">
            {copy.navbar.startFree}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[#A1A1AA] lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#27272A] bg-[#09090B] px-6 py-4 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={resolveHref(item.href, pathname, locale, item.page)}
              className="block py-2.5 text-sm text-[#A1A1AA]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-3 block sf-btn-primary text-center text-sm"
            onClick={() => setOpen(false)}
          >
            {copy.navbar.startFree}
          </Link>
        </div>
      )}
    </header>
  );
}
