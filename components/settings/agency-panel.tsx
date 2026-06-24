"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAgencyBranding } from "@/lib/actions/agency";

interface AgencyPanelProps {
  whiteLabelName: string | null;
  whiteLabelLogoUrl: string | null;
  ltdPurchasedAt: string | null;
}

export function AgencyPanel({
  whiteLabelName,
  whiteLabelLogoUrl,
  ltdPurchasedAt,
}: AgencyPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-medio bg-nivel-2 p-4 space-y-4">
        <h3 className="text-lg font-bold text-foreground">White-label (Agency)</h3>
        <p className="text-sm text-foreground-secondary">
          Personalizá la marca para clientes de tu agencia
        </p>
        <form action={updateAgencyBranding} className="space-y-3">
          <div>
            <Label htmlFor="white_label_name">Nombre de marca</Label>
            <Input
              id="white_label_name"
              name="white_label_name"
              defaultValue={whiteLabelName ?? ""}
              placeholder="Tu agencia"
            />
          </div>
          <div>
            <Label htmlFor="white_label_logo_url">Logo URL</Label>
            <Input
              id="white_label_logo_url"
              name="white_label_logo_url"
              defaultValue={whiteLabelLogoUrl ?? ""}
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Guardar branding
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-border-medio bg-nivel-2 p-4">
        <h3 className="font-medium text-foreground">Lifetime deal</h3>
        {ltdPurchasedAt ? (
          <p className="mt-2 text-sm text-accent">
            LTD activo desde {new Date(ltdPurchasedAt).toLocaleDateString("es-AR")}
          </p>
        ) : (
          <p className="mt-2 text-sm text-foreground-secondary">
            Disponible en AppSumo cuando lancemos públicamente. Contactá soporte para early access.
          </p>
        )}
      </div>
    </div>
  );
}
