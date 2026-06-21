"use client";

import { useState, useTransition } from "react";
import { saveProduct } from "@/lib/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UserProduct } from "@/types";

interface ProductFormProps {
  product?: UserProduct | null;
  onSuccess?: (productId: string) => void;
  submitLabel?: string;
}

export function ProductForm({
  product,
  onSuccess,
  submitLabel = "Guardar producto",
}: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await saveProduct(formData);
      if (!result.success) {
        setError(result.error ?? "Error al guardar");
        return;
      }
      if (result.productId && onSuccess) {
        onSuccess(result.productId);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Nombre del producto</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name ?? ""}
          placeholder="SubSignal"
          required
          minLength={2}
        />
      </div>

      <div>
        <Label htmlFor="description">¿Qué hace? (1-2 oraciones)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          placeholder="Monitorea conversaciones en Reddit y HN donde tu cliente ideal pide ayuda..."
          required
          minLength={10}
        />
      </div>

      <div>
        <Label htmlFor="target_customer">Cliente ideal</Label>
        <Input
          id="target_customer"
          name="target_customer"
          defaultValue={product?.target_customer ?? ""}
          placeholder="Founders SaaS en etapa early-stage"
          required
          minLength={5}
        />
      </div>

      <div>
        <Label htmlFor="pain_points">Problemas que resuelve</Label>
        <Textarea
          id="pain_points"
          name="pain_points"
          rows={2}
          defaultValue={product?.pain_points?.join(", ") ?? ""}
          placeholder="Perder horas buscando leads, no saber dónde responder, respuestas que suenan a spam"
          required
        />
        <p className="mt-1.5 text-xs text-foreground-muted">
          Separá con comas. Esto alimenta los prompts de scoring y drafts.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
        showArrow
        className="w-full sm:w-auto"
      >
        {isPending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
