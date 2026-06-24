"use client";

import { useRouter } from "next/navigation";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RestartTourButton() {
  const router = useRouter();

  async function handleRestart() {
    await fetch("/api/onboarding/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reset_tour" }),
    });
    router.push("/dashboard?welcome=1");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => void handleRestart()}
      className="gap-1.5"
    >
      <Map className="h-3.5 w-3.5" aria-hidden="true" />
      Reiniciar tour guiado
    </Button>
  );
}
