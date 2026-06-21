import { Check, Minus } from "lucide-react";
import { PLAN_COMPARISON_ROWS } from "@/lib/payments/plan-comparison";
import { PLAN_CATALOG, PLAN_ORDER } from "@/lib/payments/plans";
import type { Plan } from "@/types";

interface PlanComparisonTableProps {
  highlightedPlan?: Plan;
}

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-primary" strokeWidth={2.5} aria-hidden="true" />
    ) : (
      <Minus className="mx-auto h-4 w-4 text-foreground-muted" aria-hidden="true" />
    );
  }

  return <span>{value}</span>;
}

export function PlanComparisonTable({
  highlightedPlan = "growth",
}: PlanComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-background-card">
            <th
              scope="col"
              className="px-4 py-4 text-left font-medium text-foreground-muted"
            >
              Feature
            </th>
            {PLAN_ORDER.map((planId) => {
              const plan = PLAN_CATALOG[planId];
              const highlighted = planId === highlightedPlan;

              return (
                <th
                  key={planId}
                  scope="col"
                  className={`px-4 py-4 text-center font-semibold ${
                    highlighted ? "bg-primary/5 text-primary" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {PLAN_COMPARISON_ROWS.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium text-foreground-secondary"
              >
                <div>{row.label}</div>
                {row.hint && (
                  <div className="mt-0.5 text-xs font-normal text-foreground-muted">
                    {row.hint}
                  </div>
                )}
              </th>
              {PLAN_ORDER.map((planId) => (
                <td
                  key={planId}
                  className={`px-4 py-3 text-center text-foreground-secondary ${
                    planId === highlightedPlan ? "bg-primary/5" : ""
                  }`}
                >
                  <CellValue value={row.values[planId]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
