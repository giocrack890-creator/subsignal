import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Página no encontrada</h1>
      <p className="mt-3 max-w-md text-foreground-secondary">
        La URL que ingresaste no existe o fue movida.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button variant="outline" size="md">
            Ir al inicio
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="accent" size="md">
            Entrar
          </Button>
        </Link>
      </div>
    </main>
  );
}
