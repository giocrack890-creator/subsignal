"use client";

import { useState, useTransition } from "react";
import { createKeyword, updateKeyword } from "@/lib/actions/keywords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  KeywordPreview,
  PlatformSelector,
} from "@/components/keywords/platform-selector";
import { KeywordSuggestions } from "@/components/keywords/keyword-suggestions";
import type { Keyword, Plan, Platform } from "@/types";

interface KeywordFormProps {
  productId: string;
  plan: Plan;
  keyword?: Keyword | null;
  productName?: string;
  productDescription?: string;
  targetCustomer?: string;
  painPoints?: string;
  websiteUrl?: string;
  activeTwitterCount?: number;
  onSuccess?: () => void;
  submitLabel?: string;
  ctaVariant?: "primary" | "accent";
  showArrow?: boolean;
}

export function KeywordForm({
  productId,
  plan,
  keyword = null,
  productName,
  productDescription,
  targetCustomer,
  painPoints,
  websiteUrl,
  activeTwitterCount = 0,
  onSuccess,
  submitLabel = "Agregar keyword",
  ctaVariant = "primary",
  showArrow = false,
}: KeywordFormProps) {
  const isEdit = Boolean(keyword);
  const [term, setTerm] = useState(keyword?.term ?? "");
  const [platforms, setPlatforms] = useState<Platform[]>(
    keyword?.platforms?.length ? keyword.platforms : ["hn"]
  );
  const [subreddits, setSubreddits] = useState(
    keyword?.subreddits?.join(", ") ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function buildFormData(): FormData {
    const formData = new FormData();
    formData.set("product_id", productId);
    formData.set("term", term);
    formData.set("subreddits", subreddits);

    for (const platform of platforms) {
      formData.set(`platform_${platform}`, "on");
    }

    return formData;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (term.trim().length < 2) {
      setError("La keyword debe tener al menos 2 caracteres");
      return;
    }

    startTransition(async () => {
      const formData = buildFormData();
      const result = isEdit
        ? await updateKeyword(keyword!.id, formData)
        : await createKeyword(formData);

      if (!result.success) {
        setError(result.error ?? "Error al guardar keyword");
        return;
      }

      if (!isEdit) {
        setTerm("");
        setPlatforms(["hn"]);
        setSubreddits("");
      }

      onSuccess?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        {!isEdit && (
          <KeywordSuggestions
            productName={productName}
            description={productDescription}
            targetCustomer={targetCustomer}
            painPoints={painPoints}
            websiteUrl={websiteUrl}
            onSelect={setTerm}
            className="mt-3"
          />
        )}
      </div>

      <PlatformSelector
        plan={plan}
        selectedPlatforms={platforms}
        onPlatformsChange={setPlatforms}
        showSubreddits
        subreddits={subreddits}
        onSubredditsChange={setSubreddits}
        activeTwitterCount={activeTwitterCount}
        editingHasTwitter={Boolean(keyword?.platforms.includes("twitter"))}
      />

      <KeywordPreview term={term} platforms={platforms} />

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
        {isPending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
