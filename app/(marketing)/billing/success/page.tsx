import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/marketing/landing/footer";
import { LandingNavbar } from "@/components/marketing/landing/navbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pago exitoso",
  description: "Tu suscripción fue procesada correctamente.",
};

export default function BillingSuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-24 pb-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-medium text-primary">Pago confirmado</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            ¡Bienvenido!
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground-secondary">
            Tu plan se activa en segundos. Si no ves los cambios al instante,
            recargá el dashboard — el webhook puede tardar un momento.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button variant="accent" size="md">
                Ir al dashboard
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="md">
                Ver mi plan
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
