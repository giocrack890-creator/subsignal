import Link from "next/link";
import { Plus, Radio, BarChart3, Sparkles } from "lucide-react";
import type { Plan } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardHomeActionsProps {
  plan: Plan;
  newCount: number;
}

export function DashboardHomeActions({ plan, newCount }: DashboardHomeActionsProps) {
  const pills = [
    {
      href: "/signals?status=new",
      label: "Señales nuevas",
      icon: Radio,
      primary: true,
      badge: newCount > 0 ? newCount : undefined,
    },
    { href: "/keywords", label: "Agregar keyword", icon: Plus },
    { href: "/analytics", label: "Ver analytics", icon: BarChart3 },
    ...(plan === "free"
      ? [{ href: "/pricing", label: "Activar drafts", icon: Sparkles, accent: true }]
      : []),
  ] as const;

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {pills.map((pill) => {
        const Icon = pill.icon;
        const isPrimary = "primary" in pill && pill.primary;
        const isAccent = "accent" in pill && pill.accent;

        return (
          <Link
            key={pill.href}
            href={pill.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
              isPrimary
                ? "border-border-activo bg-[rgba(52,211,153,0.1)] text-accent hover:bg-[rgba(52,211,153,0.15)]"
                : isAccent
                  ? "border-border-sutil bg-nivel-3 text-[#B4B4B4] hover:border-border-medio hover:text-white"
                  : "border-border-sutil bg-nivel-3 text-[#B4B4B4] hover:border-border-medio hover:text-white"
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {pill.label}
            {"badge" in pill && pill.badge !== undefined && (
              <span className="rounded-full bg-accent px-1.5 py-px text-[10px] font-bold text-black">
                {pill.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
