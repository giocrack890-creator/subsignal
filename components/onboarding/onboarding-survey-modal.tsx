"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Briefcase,
  Building2,
  Check,
  Code2,
  Globe,
  Hammer,
  Megaphone,
  MessageCircle,
  Newspaper,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  User,
  UserPlus,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SurveyAnswers = {
  source: string;
  building: string;
  previous_tool: string;
  role: string;
};

interface SurveyOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface SurveyQuestion {
  key: keyof SurveyAnswers;
  title: string;
  options: SurveyOption[];
}

const QUESTIONS: SurveyQuestion[] = [
  {
    key: "source",
    title: "¿Cómo nos conociste?",
    options: [
      { value: "google_search", label: "Google Search", icon: Search },
      { value: "twitter_x", label: "Twitter / X", icon: MessageCircle },
      { value: "reddit", label: "Reddit", icon: MessageCircle },
      { value: "hacker_news", label: "Hacker News", icon: Newspaper },
      { value: "indie_hackers", label: "Indie Hackers", icon: Users },
      { value: "friend", label: "Amigo o colega", icon: UserPlus },
      { value: "chatgpt_ai", label: "ChatGPT o IA", icon: Bot },
      { value: "other", label: "Otro", icon: Sparkles },
    ],
  },
  {
    key: "building",
    title: "¿Qué estás construyendo?",
    options: [
      { value: "saas_b2b", label: "SaaS B2B", icon: Building2 },
      { value: "saas_b2c", label: "SaaS B2C", icon: Smartphone },
      { value: "agency", label: "Agencia", icon: Briefcase },
      { value: "personal_project", label: "Proyecto personal", icon: Hammer },
      { value: "ecommerce", label: "E-commerce", icon: ShoppingBag },
      { value: "mobile_app", label: "App mobile", icon: Smartphone },
      { value: "other", label: "Otro", icon: Sparkles },
    ],
  },
  {
    key: "previous_tool",
    title: "¿Qué usabas antes para encontrar clientes?",
    options: [
      { value: "manual_reddit", label: "Búsqueda manual en Reddit", icon: Search },
      { value: "manual_hn", label: "Búsqueda manual en HN", icon: Newspaper },
      { value: "signalhunt", label: "SignalHunt", icon: Globe },
      { value: "gummysearch", label: "GummySearch", icon: Globe },
      { value: "nothing", label: "Nada — es mi primer tool", icon: Sparkles },
      { value: "own_scraper", label: "Construí mi propio scraper", icon: Code2 },
      { value: "other", label: "Otro", icon: Wrench },
    ],
  },
  {
    key: "role",
    title: "¿Cuál es tu rol?",
    options: [
      { value: "solo_founder", label: "Solo founder", icon: User },
      { value: "co_founder", label: "Co-founder", icon: Users },
      { value: "dev_startup", label: "Dev en startup", icon: Code2 },
      { value: "marketer", label: "Marketer", icon: Megaphone },
      { value: "growth_hacker", label: "Growth hacker", icon: Sparkles },
      { value: "freelancer", label: "Freelancer", icon: Briefcase },
      { value: "other", label: "Otro", icon: UserPlus },
    ],
  },
];

function SurveyToast({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDone, 4000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl border px-5 py-3 text-sm font-medium text-white shadow-2xl"
      style={{
        backgroundColor: "#111714",
        borderColor: "rgba(52, 211, 153, 0.4)",
        boxShadow: "0 0 32px rgba(52, 211, 153, 0.15)",
      }}
      role="status"
    >
      {message}
    </div>
  );
}

interface OnboardingSurveyModalProps {
  open: boolean;
  onDismiss: () => void;
  onCompleted: () => void;
}

export function OnboardingSurveyModal({
  open,
  onDismiss,
  onCompleted,
}: OnboardingSurveyModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<SurveyAnswers>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const current = QUESTIONS[step];
  const progress = step + 1;
  const allAnswered = QUESTIONS.every((q) => answers[q.key]);

  const selectOption = useCallback(
    (key: keyof SurveyAnswers, value: string) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setError(null);
    },
    []
  );

  async function handleSubmit() {
    if (!allAnswered) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Error al guardar");
      }

      setToast("¡Listo! Tenés 7 días de Starter activados.");
      onCompleted();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return toast ? (
      <SurveyToast message={toast} onDone={() => setToast(null)} />
    ) : null;
  }

  const selected = current ? answers[current.key] : undefined;
  const isLastStep = step === QUESTIONS.length - 1;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="survey-title"
      >
        <div
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl"
          style={{
            backgroundColor: "#0A0A0A",
            border: "1px solid rgba(52, 211, 153, 0.25)",
            boxShadow: "0 0 48px rgba(52, 211, 153, 0.12)",
          }}
        >
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-4 top-4 z-10 cursor-pointer rounded-lg p-1.5 text-[#6B6B6B] transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Ir al dashboard sin completar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="border-b border-[#232323] px-6 pb-5 pt-6 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
              <div>
                <h2
                  id="survey-title"
                  className="text-xl font-bold text-white sm:text-2xl"
                >
                  Contanos sobre vos
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#B4B4B4]">
                  4 preguntas rápidas. Nos ayuda a mejorar ThreadPulse para
                  founders como vos.
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: "rgba(52, 211, 153, 0.1)",
                  color: "#34D399",
                }}
              >
                🎁 +7 días Starter gratis
              </span>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#34D399]">
                <span>Progress</span>
                <span>
                  {progress} / {QUESTIONS.length}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#232323]">
                <div
                  className="h-full rounded-full bg-[#34D399] transition-all duration-300"
                  style={{
                    width: `${(progress / QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <h3 className="text-base font-semibold text-white">
              {current.title}
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {current.options.map((option) => {
                const isSelected = selected === option.value;
                const Icon = option.icon;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption(current.key, option.value)}
                    className={cn(
                      "relative flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200",
                      isSelected
                        ? "border-[#34D399] bg-[rgba(52,211,153,0.08)]"
                        : "border-[#232323] bg-[#111714] hover:border-[#3a3a3a]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        isSelected
                          ? "bg-[rgba(52,211,153,0.15)] text-[#34D399]"
                          : "bg-[#0A0A0A] text-[#6B6B6B]"
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-[#E5E5E5]">
                      {option.label}
                    </span>
                    {isSelected && (
                      <Check
                        className="h-4 w-4 shrink-0 text-[#34D399]"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400">{error}</p>
            )}

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0 || submitting}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-[#6B6B6B] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Atrás
              </button>

              {isLastStep ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="cursor-pointer rounded-[10px] px-5 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    backgroundColor: allAnswered ? "#34D399" : "#232323",
                    color: allAnswered ? "#0A0A0A" : "#6B6B6B",
                  }}
                >
                  {submitting
                    ? "Guardando…"
                    : "Completar y obtener 7 días gratis →"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!selected}
                  className="cursor-pointer rounded-[10px] border px-5 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    borderColor: selected ? "#34D399" : "#232323",
                    color: selected ? "#34D399" : "#6B6B6B",
                  }}
                >
                  Continuar →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <SurveyToast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}

interface OnboardingSurveyGateProps {
  showSurvey: boolean;
}

export function OnboardingSurveyGate({ showSurvey }: OnboardingSurveyGateProps) {
  const [dismissed, setDismissed] = useState(false);
  const [completed, setCompleted] = useState(false);

  const open = showSurvey && !dismissed && !completed;

  return (
    <OnboardingSurveyModal
      open={open}
      onDismiss={() => setDismissed(true)}
      onCompleted={() => setCompleted(true)}
    />
  );
}
