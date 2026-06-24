"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Radio,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

const NAV = [
  { href: "/dashboard", label: "Dashboard", tourId: "nav-dashboard", icon: LayoutDashboard },
  { href: "/signals", label: "Señales", tourId: "nav-signals", icon: Radio },
  { href: "/keywords", label: "Keywords", tourId: "nav-keywords", icon: Search },
  { href: "/drafts", label: "Borradores", tourId: "nav-drafts", icon: FileText },
  { href: "/analytics", label: "Analytics", tourId: "nav-analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", tourId: "nav-settings", icon: Settings },
] as const;

interface DashboardSidebarProps {
  displayName: string;
  plan: Plan;
}

export function DashboardSidebar({ displayName, plan }: DashboardSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="dash-sidebar hidden w-60 shrink-0 flex-col lg:flex">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-5">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
          SS
          <span
            className="dash-live-dot absolute -right-0.5 -top-0.5"
            aria-hidden="true"
          />
        </span>
        <div>
          <span className="text-sm font-bold tracking-tight text-foreground">
            SubSignal
          </span>
          <p className="text-[10px] font-medium uppercase tracking-widest text-foreground-muted">
            Intent monitor
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-tour={item.tourId}
              className={cn("dash-nav-link", active && "dash-nav-link-active")}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}

        {(plan === "free" || plan === "starter") && (
          <Link href="/pricing" className="dash-nav-link">
            <Sparkles className="h-4 w-4 shrink-0 opacity-80" aria-hidden="true" />
            <span className="flex-1">Upgrades a Pro</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-[#34D399]"
              style={{ backgroundColor: "rgba(52, 211, 153, 0.15)" }}
            >
              Nuevo
            </span>
          </Link>
        )}
      </nav>

      <div className="border-t border-border p-4">
        <div className="dash-card rounded-xl p-3">
          <p className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </p>
          {plan === "free" ? (
            <Link
              href="/pricing"
              className="mt-2 block cursor-pointer rounded-lg border px-3 py-2.5 transition-colors hover:border-[rgba(52,211,153,0.4)]"
              style={{
                backgroundColor: "rgba(52, 211, 153, 0.08)",
                borderColor: "rgba(52, 211, 153, 0.25)",
              }}
            >
              <span className="block text-xs text-[#6B6B6B]">Plan Free</span>
              <span className="mt-0.5 block text-xs font-medium text-[#34D399]">
                Upgrades a Starter →
              </span>
            </Link>
          ) : (
            <p className="mt-0.5 text-xs capitalize text-foreground-muted">
              Plan {plan}
            </p>
          )}
          <div className="mt-3">
            <SignOutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
