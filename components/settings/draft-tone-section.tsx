"use client";

import { useState, useTransition } from "react";
import { updateDraftTone } from "@/lib/actions/settings";
import type { DraftTone } from "@/lib/claude/tone";

const TONE_OPTIONS: {
  value: DraftTone;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    value: "technical",
    icon: "⚡",
    title: "Directo y técnico",
    description:
      "Respuestas concisas enfocadas en la solución. Sin relleno.",
  },
  {
    value: "conversational",
    icon: "💬",
    title: "Amigable y conversacional",
    description: "Tono cálido y cercano. Como hablar con un colega.",
  },
  {
    value: "formal",
    icon: "🎯",
    title: "Profesional y formal",
    description: "Lenguaje más estructurado. Ideal para audiencias enterprise.",
  },
];

interface DraftToneSectionProps {
  initialTone: DraftTone;
}

export function DraftToneSection({ initialTone }: DraftToneSectionProps) {
  const [tone, setTone] = useState<DraftTone>(initialTone);
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: DraftTone) {
    setTone(next);
    startTransition(async () => {
      await updateDraftTone(next);
    });
  }

  return (
    <section className="dash-card p-6">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        Preferencias de respuesta
      </h2>
      <p className="mt-1 text-sm text-foreground-secondary">
        Tono de borradores generados por IA.
      </p>

      <div className="mt-5 grid gap-3">
        {TONE_OPTIONS.map((option) => {
          const selected = tone === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(option.value)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                selected
                  ? "border-[#34D399] bg-[rgba(52,211,153,0.08)] shadow-[0_0_20px_rgba(52,211,153,0.12)]"
                  : "border-[#232323] bg-[#111714] hover:border-[#34D399]/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">
                  {option.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{option.title}</p>
                  <p className="mt-1 text-sm text-[#B4B4B4]">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
