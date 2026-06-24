"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Radio,
  Search,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UPGRADE_BANNER_DISMISSED_KEY } from "@/components/dashboard/upgrade-top-banner";
import { AppLogo } from "@/components/brand/app-logo";
import { CronStatusIndicator } from "@/components/dashboard/cron-status-indicator";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

const NAV = [
  { href: "/dashboard", label: "Dashboard", shortcut: "1", icon: LayoutDashboard },
  { href: "/signals", label: "Señales", shortcut: "2", icon: Radio },
  { href: "/keywords", label: "Keywords", shortcut: "3", icon: Search },
  { href: "/drafts", label: "Borradores", shortcut: "4", icon: FileText },
  { href: "/analytics", label: "Analytics", shortcut: "5", icon: BarChart3 },
  { href: "/settings", label: "Settings", shortcut: ",", icon: Settings },
] as const;

const SHORTCUT_MAP: Record<string, string> = {
  "1": "/dashboard",
  "2": "/signals",
  "3": "/keywords",
  "4": "/drafts",
  "5": "/analytics",
  ",": "/settings",
};

interface DashboardSidebarProps {
  displayName: string;
  email: string;
  plan: Plan;
}

export function DashboardSidebar({ displayName, email, plan }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = (displayName[0] ?? email[0] ?? "U").toUpperCase();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const href = SHORTCUT_MAP[e.key];
      if (href) {
        e.preventDefault();
        router.push(href);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleSignOut() {
    localStorage.removeItem(UPGRADE_BANNER_DISMISSED_KEY);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="dash-sidebar hidden w-[220px] shrink-0 flex-col lg:flex">
      <div className="border-b border-border-sutil px-4 py-4">
        <Link href="/dashboard" className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          <AppLogo variant="sidebar" showMonitoring />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {NAV.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const shortcutLabel =
            item.shortcut === ","
              ? "⌘,"
              : `⌘${item.shortcut}`;

          return (
            <Tooltip key={item.href} content={shortcutLabel} side="right">
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium tracking-[-0.01em] transition-[background,color] duration-150",
                  active
                    ? "border-l-2 border-accent bg-nivel-4 pl-[calc(0.625rem-2px)] text-white"
                    : "border-l-2 border-transparent text-[#6B6B6B] hover:bg-nivel-4 hover:text-[#B4B4B4]"
                )}
              >
                <Icon
                  className={cn(
                    "h-[15px] w-[15px] shrink-0",
                    active ? "opacity-100 text-white" : "opacity-50"
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1">{item.label}</span>
                {item.href === "/signals" && <CronStatusIndicator />}
                <span className="font-mono text-[10px] text-[#6B6B6B] opacity-0 transition-opacity group-hover:opacity-100">
                  {shortcutLabel}
                </span>
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      <div className="border-t border-border-sutil p-3" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-nivel-4"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nivel-5 text-[10px] font-semibold text-white">
            {initial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium text-white">
              {displayName}
            </span>
            <span className="block truncate text-[10px] capitalize text-[#6B6B6B]">
              Plan {plan}
            </span>
          </span>
        </button>

        {menuOpen && (
          <div className="mt-1 overflow-hidden rounded-lg border border-border-medio bg-nivel-4 py-1">
            <Link
              href="/settings"
              className="block px-3 py-1.5 text-[12px] text-[#B4B4B4] hover:bg-nivel-5 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              type="button"
              className="block w-full px-3 py-1.5 text-left text-[12px] text-[#B4B4B4] hover:bg-nivel-5 hover:text-white"
              onClick={handleSignOut}
            >
              Cerrar sesión
            </button>
          </div>
        )}

        {plan === "free" && (
          <Link
            href="/pricing"
            className="mt-2 block cursor-pointer text-[10px] text-accent opacity-70 transition-opacity hover:opacity-100"
          >
            ↑ Starter — drafts ilimitados
          </Link>
        )}
      </div>
    </aside>
  );
}
