"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { FadeIn } from "@/components/marketing/landing/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

/* ─── Platform icons ─── */

function HackerNewsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="6" fill="#FF6600" />
      <text
        x="14"
        y="19"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        Y
      </text>
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="14" fill="#FF4500" />
      <circle cx="10" cy="13" r="2" fill="white" />
      <circle cx="18" cy="13" r="2" fill="white" />
      <path
        d="M9 17c1.5 2 8.5 2 10 0"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProductHuntIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#DA552F" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        P
      </text>
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#1E1E1E" />
      <path
        d="M13.2 11.2L18.4 5h-1.2l-4.5 5.4L9.2 5H5l5.5 7.9L5 19h1.2l4.8-5.7 3.8 5.7H19l-5.8-8.3z"
        fill="white"
      />
    </svg>
  );
}

function IndieHackersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#6366F1" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        IH
      </text>
    </svg>
  );
}

/* ─── Badges ─── */

function ActiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: "rgba(52, 211, 153, 0.1)", color: "#34D399" }}
    >
      <span
        className="h-[5px] w-[5px] rounded-full bg-[#34D399] opacity-80 animate-pulse"
        aria-hidden="true"
      />
      Activo
    </span>
  );
}

function DevelopmentBadge() {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: "rgba(251, 191, 36, 0.1)", color: "#FBBF24" }}
    >
      En desarrollo
    </span>
  );
}

function SoonBadge() {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: "rgba(107, 107, 107, 0.1)", color: "#6B6B6B" }}
    >
      Próximo
    </span>
  );
}

/* ─── Waitlist modal ─── */

function RedditWaitlistModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState("");
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setAuthEmail(data.user.email);
        setEmail(data.user.email);
      }
    });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      setDone(false);
      setError(null);
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist/reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail ?? email }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Error al guardar");
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[#1E1E1E] bg-[#111714] p-0 text-white shadow-2xl backdrop:bg-black/70"
      onClose={handleClose}
    >
      <div className="p-6">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 text-[#6B6B6B] transition-colors hover:text-white"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="pt-2 text-center">
            <p className="text-lg font-semibold text-white">
              Perfecto. Te avisamos cuando Reddit esté activo.
            </p>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="mt-6 w-full"
              onClick={handleClose}
            >
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white">
              Reddit está en desarrollo
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#B4B4B4]">
              Te avisamos por email cuando el monitoreo de Reddit esté activo.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {!authEmail && (
                <Input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#1E1E1E] bg-[#0D0D0D]"
                />
              )}

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <Button
                type="submit"
                variant="accent"
                size="md"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Guardando…" : "Avisarme"}
              </Button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}

/* ─── Comparison table ─── */

const COMPARISON_ROWS = [
  { feature: "Hacker News", threadpulse: "yes" as const, rival: "no" as const },
  {
    feature: "Reddit",
    threadpulse: "dev" as const,
    rival: "reddit-only" as const,
  },
  { feature: "Product Hunt", threadpulse: "soon" as const, rival: "no" as const },
  { feature: "Twitter / X", threadpulse: "soon" as const, rival: "no" as const },
  {
    feature: "Borradores con IA",
    threadpulse: "yes" as const,
    rival: "no" as const,
  },
  {
    feature: "Scoring de intención",
    threadpulse: "yes" as const,
    rival: "no" as const,
  },
  {
    feature: "Multi-plataforma",
    threadpulse: "yes" as const,
    rival: "no" as const,
  },
] as const;

function CellValue({
  value,
}: {
  value: "yes" | "no" | "dev" | "soon" | "reddit-only";
}) {
  if (value === "yes") {
    return (
      <Check
        className="mx-auto h-4 w-4 text-[#34D399]"
        strokeWidth={2.5}
        aria-label="Sí"
      />
    );
  }

  if (value === "no") {
    return (
      <X
        className="mx-auto h-4 w-4"
        style={{ color: "rgba(239, 68, 68, 0.7)" }}
        strokeWidth={2.5}
        aria-label="No"
      />
    );
  }

  if (value === "dev") {
    return (
      <span className="text-xs font-medium text-[#FBBF24]">En desarrollo</span>
    );
  }

  if (value === "soon") {
    return (
      <span className="text-xs font-medium text-[#6B6B6B]">Próximamente</span>
    );
  }

  return (
    <span className="text-xs font-medium text-[#6B6B6B]">✓ (solo Reddit)</span>
  );
}

/* ─── Main section ─── */

const CARD_HOVER =
  "transition-all duration-200 hover:scale-[1.01] hover:border-[rgba(52,211,153,0.35)]";

export function LandingPlatforms() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <section
      id="plataformas"
      className="landing-section relative scroll-mt-24 border-t border-border"
      aria-labelledby="platforms-heading"
    >
      <div className="container-marketing px-6">
        {/* Header */}
        <FadeIn>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#34D399]">
            Cobertura total
          </p>
          <h2
            id="platforms-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-white"
          >
            Tu cliente habla en más de un lugar.
            <br />
            ThreadPulse escucha todos.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#B4B4B4]">
            Mientras la competencia monitorea solo Reddit, ThreadPulse cubre las 5
            plataformas donde los founders buscan soluciones.
          </p>
          <div className="mt-6 border-t border-[#1E1E1E] pt-4">
            <p className="text-sm text-[#6B6B6B]">
              SignalHunt: 1 plataforma · ThreadPulse: 5 plataformas (y sumando)
            </p>
          </div>
        </FadeIn>

        {/* Row 1 — Active platforms (large cards) */}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <FadeIn delay={0.08}>
            <article
              className={`flex h-full flex-col rounded-2xl border p-6 md:p-8 ${CARD_HOVER}`}
              style={{
                backgroundColor: "#111714",
                borderColor: "rgba(52, 211, 153, 0.4)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <HackerNewsIcon />
                  <h3 className="text-xl font-bold text-white">Hacker News</h3>
                </div>
                <ActiveBadge />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#B4B4B4]">
                La comunidad técnica más influyente. Founders, devs y VCs
                discutiendo problemas reales. El lugar donde nacen los clientes
                de SaaS.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-[#6B6B6B]">
                Escaneamos cada 15 min · Scoring con Claude AI · Borradores
                incluidos
              </p>
            </article>
          </FadeIn>

          <FadeIn delay={0.14}>
            <article
              className={`flex h-full flex-col rounded-2xl border p-6 md:p-8 ${CARD_HOVER}`}
              style={{
                backgroundColor: "#111714",
                borderColor: "rgba(251, 191, 36, 0.3)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <RedditIcon />
                  <h3 className="text-xl font-bold text-white">Reddit</h3>
                </div>
                <DevelopmentBadge />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#B4B4B4]">
                280K+ founders en r/SaaS, r/startups, r/indiehackers. La mayor
                concentración de conversaciones de alta intención del mundo.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-[#6B6B6B]">
                r/SaaS · r/startups · r/Entrepreneur · r/indiehackers · y más
              </p>
              <button
                type="button"
                onClick={() => setWaitlistOpen(true)}
                className="mt-5 cursor-pointer self-start text-sm font-medium text-[#FBBF24] transition-colors hover:text-[#fcd34d]"
              >
                Avisame cuando esté listo →
              </button>
            </article>
          </FadeIn>
        </div>

        {/* Row 2 — Upcoming platforms (medium cards) */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FadeIn delay={0.2}>
            <article
              className={`flex h-full flex-col rounded-2xl border border-[#1E1E1E] p-5 md:p-6 ${CARD_HOVER}`}
              style={{ backgroundColor: "#111714" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ProductHuntIcon />
                  <h3 className="text-lg font-semibold text-white">
                    Product Hunt
                  </h3>
                </div>
                <SoonBadge />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#B4B4B4]">
                Donde los early adopters buscan nuevas herramientas activamente.
                Alta intención, audiencia premium.
              </p>
            </article>
          </FadeIn>

          <FadeIn delay={0.26}>
            <article
              className={`flex h-full flex-col rounded-2xl border border-[#1E1E1E] p-5 md:p-6 ${CARD_HOVER}`}
              style={{ backgroundColor: "#111714" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <TwitterXIcon />
                  <h3 className="text-lg font-semibold text-white">
                    Twitter / X
                  </h3>
                </div>
                <SoonBadge />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#B4B4B4]">
                Founders en tiempo real. Búsquedas de herramientas,
                comparaciones y complaints que son oportunidades directas.
              </p>
            </article>
          </FadeIn>

          <FadeIn delay={0.32} className="sm:col-span-2 lg:col-span-1">
            <article
              className={`flex h-full flex-col rounded-2xl border border-[#1E1E1E] p-5 md:p-6 ${CARD_HOVER}`}
              style={{ backgroundColor: "#111714" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <IndieHackersIcon />
                  <h3 className="text-lg font-semibold text-white">
                    Indie Hackers
                  </h3>
                </div>
                <SoonBadge />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#B4B4B4]">
                La comunidad bootstrapped más concentrada. Preguntas directas
                sobre tools, stacks y problemas de crecimiento.
              </p>
            </article>
          </FadeIn>
        </div>

        {/* Comparison table */}
        <FadeIn delay={0.42} className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#6B6B6B]">
            Comparación
          </p>

          <div
            className="mt-4 overflow-hidden rounded-xl border border-[#1E1E1E]"
            style={{ backgroundColor: "#0D0D0D" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  <th className="px-4 py-3 text-left font-medium text-[#6B6B6B]">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[#34D399]">
                    ThreadPulse
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[#6B6B6B]">
                    Competidor A
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i < COMPARISON_ROWS.length - 1
                        ? "border-b border-[#1E1E1E]"
                        : ""
                    }
                  >
                    <td className="px-4 py-3 text-[#B4B4B4]">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      <CellValue value={row.threadpulse} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CellValue value={row.rival} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-xs text-[#6B6B6B]">
            Comparación basada en funcionalidades públicamente disponibles al 24
            de junio de 2026.
          </p>
        </FadeIn>
      </div>

      <RedditWaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </section>
  );
}
