"use client";

import { ErrorMessage } from "@/components/ui/error-message";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="p-6 lg:p-8">
      <ErrorMessage
        title="Error en el dashboard"
        message={error.message || "Ocurrió un error inesperado."}
        onRetry={reset}
      />
    </div>
  );
}
