import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-2xl font-bold text-foreground">Página no encontrada</h1>
      <p className="mt-2 max-w-md text-sm text-foreground-secondary">
        La ruta que buscás no existe en SubSignal.
      </p>
      <Link href="/dashboard" className="mt-6 cursor-pointer">
        <Button variant="accent" size="md">
          Volver al dashboard
        </Button>
      </Link>
    </div>
  );
}
