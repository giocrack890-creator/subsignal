"use client";

import { useEffect, useState } from "react";
import type { KeywordSuggestion } from "@/lib/keywords/suggestions";
import {
  buildKeywordSuggestions,
  getCategoryLabel,
} from "@/lib/keywords/suggestions";
import { cn } from "@/lib/utils";

interface KeywordSuggestionsProps {
  productName?: string;
  description?: string;
  targetCustomer?: string;
  painPoints?: string;
  websiteUrl?: string;
  onSelect: (term: string) => void;
  className?: string;
}

export function KeywordSuggestions({
  productName,
  description,
  targetCustomer,
  painPoints,
  websiteUrl,
  onSelect,
  className,
}: KeywordSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>(() =>
    buildKeywordSuggestions({
      productName,
      description,
      targetCustomer,
      painPoints: painPoints
        ?.split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      websiteUrl,
    })
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasAiInput =
      Boolean(websiteUrl?.trim()) ||
      Boolean(productName?.trim() && description?.trim());
    if (!hasAiInput) {
      setSuggestions(
        buildKeywordSuggestions({
          productName,
          description,
          targetCustomer,
          painPoints: painPoints
            ?.split(",")
            .map((p) => p.trim())
            .filter(Boolean),
          websiteUrl,
        })
      );
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch("/api/suggest-keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        productName,
        description,
        targetCustomer,
        painPoints: painPoints
          ?.split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        websiteUrl,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.suggestions?.length) {
          setSuggestions(data.suggestions);
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [productName, description, targetCustomer, painPoints, websiteUrl]);

  if (suggestions.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-foreground-secondary">
        {loading
          ? "Analizando sitio con IA..."
          : "Sugerencias — marca, competidores e intención"}
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <SuggestionChip
            key={suggestion.term}
            suggestion={suggestion}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestionChip({
  suggestion,
  onSelect,
}: {
  suggestion: KeywordSuggestion;
  onSelect: (term: string) => void;
}) {
  const categoryColors = {
    intent: "border-primary/30 bg-primary/10 text-primary",
    brand: "border-reddit/30 bg-reddit/10 text-reddit",
    competitor: "border-warning/30 bg-warning/10 text-warning",
    problem:
      "border-border-strong bg-background-elevated text-foreground-secondary",
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(suggestion.term)}
      className={cn(
        "cursor-pointer rounded-full border px-2.5 py-1 text-left text-[11px] transition-opacity hover:opacity-80",
        categoryColors[suggestion.category]
      )}
      title={suggestion.description}
    >
      <span className="font-medium">{suggestion.term}</span>
      <span className="ml-1 opacity-70">
        · {getCategoryLabel(suggestion.category)}
      </span>
    </button>
  );
}
