import { FEATURE_REGISTRY } from "@/lib/features/registry";
import { LegalPageShell } from "@/components/marketing/legal/legal-page-shell";

export default function ChangelogPage() {
  const shipped = FEATURE_REGISTRY.filter((f) => f.status === "live" || f.status === "beta");

  return (
    <LegalPageShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Changelog</h1>
          <p className="mt-2 text-foreground-secondary">
            Lo que shippeamos en ThreadPulse
          </p>
        </div>
        <p className="text-foreground-secondary">
          Actualizado {new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
        </p>
        <ul className="space-y-3">
          {shipped.map((f) => (
            <li
              key={f.id}
              className="rounded-xl border border-border-medio bg-nivel-2 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{f.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    f.status === "live"
                      ? "bg-accent/20 text-accent"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {f.status === "live" ? "Live" : "Beta"}
                </span>
              </div>
              <p className="mt-1 text-sm text-foreground-secondary">{f.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </LegalPageShell>
  );
}
