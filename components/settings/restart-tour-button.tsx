"use client";

import { useRouter } from "next/navigation";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearTourCompleted } from "@/lib/onboarding/tour";

interface RestartTourButtonProps {
  userId: string;
}

export function RestartTourButton({ userId }: RestartTourButtonProps) {
  const router = useRouter();

  function handleRestart() {
    clearTourCompleted(userId);
    router.push("/dashboard?welcome=1");
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleRestart}
      className="gap-1.5"
    >
      <Map className="h-3.5 w-3.5" aria-hidden="true" />
      Reiniciar tour guiado
    </Button>
  );
}
