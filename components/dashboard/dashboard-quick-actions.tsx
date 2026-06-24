import Link from "next/link";
import {
  BarChart3,
  Plus,
  Radio,
  Search,
  Sparkles,
} from "lucide-react";
import type { Plan } from "@/types";

interface DashboardQuickActionsProps {
  plan: Plan;
  keywordCount: number;
  newCount: number;
}

const ACTIONS = [
  {
    href: "/signals",
    label: "Ver todas las señales",
    icon: Radio,
    description: "Historial completo",
  },
  {
    href: "/keywords",
    label: "Gestionar keywords",
    icon: Search,
    description: "Monitoreo activo",
  },
  {
    href: "/analytics",
    label: "Ver analytics",
    icon: BarChart3,
    description: "Métricas del mes",
  },
] as const;

export function DashboardQuickActions({
  plan,
  keywordCount,
  newCount,
}: DashboardQuickActionsProps) {
  return (
    <aside className="space-y-3">
      <div className="rounded-[10px] border border-border-medio bg-nivel-3 p-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#6B6B6B]">
          Acciones rápidas
        </p>
        <ul className="mt-3 space-y-1">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-nivel-4"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border-sutil bg-nivel-4 text-[#6B6B6B] transition-colors group-hover:text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-medium text-white">
                      {action.label}
                    </span>
                    <span className="block text-[11px] text-[#6B6B6B]">
                      {action.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Link
        href="/keywords"
        className="flex items-center gap-3 rounded-[10px] border border-dashed border-border-medio bg-nivel-3/50 px-4 py-3 transition-colors hover:border-border-activo hover:bg-nivel-4"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(52,211,153,0.1)] text-accent">
          <Plus className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-[13px] font-medium text-white">
            Agregar keyword
          </span>
          <span className="block text-[11px] text-[#6B6B6B]">
            {keywordCount} activa{keywordCount !== 1 ? "s" : ""} ahora
          </span>
        </span>
      </Link>

      {plan === "free" && (
        <Link
          href="/pricing"
          className="flex items-center gap-3 rounded-[10px] border border-border-activo bg-[rgba(52,211,153,0.06)] px-4 py-3 transition-colors hover:bg-[rgba(52,211,153,0.1)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(52,211,153,0.12)] text-accent">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[13px] font-medium text-accent">
              Activar drafts
            </span>
            <span className="block text-[11px] text-[#6B6B6B]">
              {newCount > 0
                ? `${newCount} señal${newCount !== 1 ? "es" : ""} esperando`
                : "Starter desde $14.99/mes"}
            </span>
          </span>
        </Link>
      )}
    </aside>
  );
}
