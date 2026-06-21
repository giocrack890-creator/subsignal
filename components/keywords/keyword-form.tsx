"use client";

import { useState, useTransition } from "react";
import { createKeyword } from "@/lib/actions/keywords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  KeywordPreview,
  PlatformSelector,
} from "@/components/keywords/platform-selector";
import type { Plan } from "@/types";

interface KeywordFormProps {
  productId: string;
  plan: Plan;
  onSuccess?: () => void;
  submitLabel?: string;
  ctaVariant?: "primary" | "accent";
  showArrow?: boolean;
}

export function KeywordForm({
  productId,
  plan,
  onSuccess,
  submitLabel = "Agregar keyword",
  ctaVariant = "primary",
  showArrow = false,
}: KeywordFormProps) {
  const [term, setTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("product_id", productId);

    startTransition(async () => {
      const result = await createKeyword(formData);
      if (!result.success) {
        setError(result.error ?? "Error al crear keyword");
        return;
      }
      setTerm("");
      onSuccess?.();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="product_id" value={productId} />

      <div>
        <Label htmlFor="term">Keyword o frase</Label>
        <Input
          id="term"
          name="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="customer feedback tool"
          required
          minLength={2}
        />
      </div>

      <PlatformSelector plan={plan} showSubreddits />

      <KeywordPreview term={term} />

      {error && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant={ctaVariant}
        disabled={isPending}
        showArrow={showArrow}
        className="w-full sm:w-auto"
      >
        {isPending ? "Agregando..." : submitLabel}
      </Button>
    </form>
  );
}
