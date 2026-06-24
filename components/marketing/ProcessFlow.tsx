"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Brain, MessageSquare, Radar, Target } from "lucide-react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  textPosition: "above" | "below";
  iconGlow?: "default" | "intense" | "strong";
  textDelay: number;
  iconDelay: number;
  numberDelay: number;
  desktopOffset: string;
}

const STEPS: ProcessStep[] = [
  {
    number: "1",
    title: "Describís tu producto",
    description:
      "Keywords, cliente ideal y qué problema resolvés. La IA entiende el contexto completo.",
    icon: <Target className="h-5 w-5 text-[#34D399]" strokeWidth={1.75} aria-hidden="true" />,
    textPosition: "above",
    iconGlow: "default",
    textDelay: 0,
    iconDelay: 0,
    numberDelay: 200,
    desktopOffset: "pt-16 lg:pt-20",
  },
  {
    number: "2",
    title: "Monitoreamos 24/7",
    description:
      "Escaneamos Hacker News, Reddit y más buscando conversaciones de alta intención.",
    icon: <Radar className="h-5 w-5 text-[#34D399]" strokeWidth={1.75} aria-hidden="true" />,
    textPosition: "below",
    iconGlow: "intense",
    textDelay: 300,
    iconDelay: 375,
    numberDelay: 400,
    desktopOffset: "pt-32 lg:pt-40",
  },
  {
    number: "3",
    title: "La IA puntúa cada señal",
    description:
      "Claude evalúa la intención de compra real. Solo ves conversaciones que valen la pena.",
    icon: <Brain className="h-5 w-5 text-[#34D399]" strokeWidth={1.75} aria-hidden="true" />,
    textPosition: "above",
    iconGlow: "default",
    textDelay: 600,
    iconDelay: 750,
    numberDelay: 600,
    desktopOffset: "pt-16 lg:pt-20",
  },
  {
    number: "4",
    title: "Respondés en 30 segundos",
    description:
      "Draft listo para copiar y publicar desde tu cuenta. Nunca auto-posteamos.",
    icon: (
      <MessageSquare className="h-5 w-5 text-[#34D399]" strokeWidth={1.75} aria-hidden="true" />
    ),
    textPosition: "below",
    iconGlow: "strong",
    textDelay: 900,
    iconDelay: 1125,
    numberDelay: 800,
    desktopOffset: "pt-8 lg:pt-10",
  },
];

const ICON_GLOW: Record<NonNullable<ProcessStep["iconGlow"]>, string> = {
  default: "0 0 20px rgba(52,211,153,0.3)",
  intense: "0 0 28px rgba(52,211,153,0.45)",
  strong: "0 0 32px rgba(52,211,153,0.55)",
};

const ICON_GLOW_HOVER: Record<NonNullable<ProcessStep["iconGlow"]>, string> = {
  default: "0 0 28px rgba(52,211,153,0.5)",
  intense: "0 0 36px rgba(52,211,153,0.6)",
  strong: "0 0 44px rgba(52,211,153,0.7)",
};

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

function StepText({
  step,
  visible,
  className = "",
}: {
  step: ProcessStep;
  visible: boolean;
  className?: string;
}) {
  return (
    <div
      className={`process-flow-text max-w-[200px] ${className}`}
      style={{
        animationDelay: `${step.textDelay}ms`,
        animationPlayState: visible ? "running" : "paused",
      }}
    >
      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#B4B4B4]">{step.description}</p>
    </div>
  );
}

function StepIcon({
  step,
  visible,
  iconRef,
  sizeClass,
}: {
  step: ProcessStep;
  visible: boolean;
  iconRef: (el: HTMLDivElement | null) => void;
  sizeClass: string;
}) {
  const glow = step.iconGlow ?? "default";

  return (
    <div
      ref={iconRef}
      className={`process-flow-icon group relative z-10 flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#34D399] bg-[#111714] transition-all duration-200 ease-out hover:scale-110 ${sizeClass}`}
      style={{
        boxShadow: ICON_GLOW[glow],
        animationDelay: `${step.iconDelay}ms`,
        animationPlayState: visible ? "running" : "paused",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = ICON_GLOW_HOVER[glow];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = ICON_GLOW[glow];
      }}
    >
      {step.icon}
    </div>
  );
}

function ConnectorLines({
  pathD,
  pathLength,
  pathRef,
  visible,
}: {
  pathD: string;
  pathLength: number;
  pathRef: React.RefObject<SVGPathElement | null>;
  visible: boolean;
}) {
  if (!pathD) return null;

  const style = { "--path-length": pathLength } as CSSProperties;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
      style={style}
    >
      <path
        d={pathD}
        fill="none"
        stroke="rgba(52, 211, 153, 0.15)"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="#34D399"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.7}
        className={`process-flow-line ${visible ? "" : "paused"}`}
        style={style}
      />
    </svg>
  );
}

export function ProcessFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [visible, setVisible] = useState(false);
  const [pathD, setPathD] = useState("");
  const [pathLength, setPathLength] = useState(1000);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const updateLayout = useCallback(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setIsMobile(mobile);

    const container = flowRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const points = iconRefs.current
      .map((ref) => {
        if (!ref) return null;
        const rect = ref.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      })
      .filter((point): point is { x: number; y: number } => point !== null);

    if (points.length < 2) return;

    setPathD(buildSmoothPath(points));

    requestAnimationFrame(() => {
      if (pathRef.current) {
        setPathLength(pathRef.current.getTotalLength() || 1000);
      }
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    updateLayout();
    const onResize = () => updateLayout();
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => updateLayout());
    if (flowRef.current) ro.observe(flowRef.current);

    document.fonts?.ready.then(updateLayout).catch(() => undefined);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [mounted, isMobile, updateLayout]);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(updateLayout, 80);
    return () => window.clearTimeout(timer);
  }, [visible, updateLayout]);

  const setIconRef = (index: number) => (el: HTMLDivElement | null) => {
    iconRefs.current[index] = el;
  };

  return (
    <>
      <style>{`
        @keyframes processDrawLine {
          from { stroke-dashoffset: var(--path-length, 1000); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes processFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes processHeaderFade {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes processIconPop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes processNumberFade {
          from { opacity: 0; }
          to { opacity: 0.08; }
        }
        .process-flow-header {
          animation: processHeaderFade 400ms ease-out forwards;
          opacity: 0;
        }
        .process-flow-header.paused { animation-play-state: paused; }
        .process-flow-line {
          stroke-dasharray: var(--path-length, 1000);
          stroke-dashoffset: var(--path-length, 1000);
          animation: processDrawLine 1.5s ease-in-out forwards;
        }
        .process-flow-line.paused { animation-play-state: paused; }
        .process-flow-text {
          animation: processFadeUp 500ms ease-out forwards;
          opacity: 0;
        }
        .process-flow-icon {
          animation: processIconPop 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
          transform: scale(0);
        }
        .process-flow-number {
          animation: processNumberFade 600ms ease-out forwards;
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .process-flow-header,
          .process-flow-line,
          .process-flow-text,
          .process-flow-icon,
          .process-flow-number {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="como-funciona"
        className="scroll-mt-24 bg-[#0A0A0A] py-20 md:py-[100px] lg:py-[120px]"
        aria-labelledby="process-flow-heading"
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <header
            className={`process-flow-header text-center ${visible ? "" : "paused"}`}
          >
            <p className="text-sm font-medium tracking-[0.12em] text-[#34D399] uppercase">
              Cómo funciona
            </p>
            <h2
              id="process-flow-heading"
              className="mt-3 text-3xl font-bold text-white md:text-4xl"
            >
              De la señal al cliente en minutos
            </h2>
            <p className="mt-3 text-base text-[#6B6B6B] md:text-lg">
              Sin scraping manual. Sin horas perdidas.
            </p>
          </header>

          {mounted && (
            <div
              ref={flowRef}
              className={`relative mt-16 ${
                isMobile ? "flex flex-col gap-10" : "min-h-[340px] lg:min-h-[380px]"
              }`}
            >
              <ConnectorLines
                pathD={pathD}
                pathLength={pathLength}
                pathRef={pathRef}
                visible={visible}
              />

              {isMobile ? (
                <ol className="relative flex flex-col gap-10">
                  {STEPS.map((step, index) => (
                    <li key={step.number} className="relative flex items-start gap-4">
                      <span
                        className="process-flow-number pointer-events-none absolute -top-2 left-8 text-[72px] font-bold text-[#1A1A1A] select-none"
                        style={{
                          animationDelay: `${step.numberDelay}ms`,
                          animationPlayState: visible ? "running" : "paused",
                        }}
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>

                      <StepIcon
                        step={step}
                        visible={visible}
                        sizeClass="h-11 w-11"
                        iconRef={setIconRef(index)}
                      />

                      <StepText step={step} visible={visible} className="pt-1 text-left" />
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="relative grid grid-cols-4 gap-3 lg:gap-6">
                  {STEPS.map((step, index) => (
                    <div
                      key={step.number}
                      className={`relative flex flex-col items-center ${step.desktopOffset}`}
                    >
                      <span
                        className="process-flow-number pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[80px] font-bold text-[#1A1A1A] select-none lg:text-[120px]"
                        style={{
                          animationDelay: `${step.numberDelay}ms`,
                          animationPlayState: visible ? "running" : "paused",
                        }}
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>

                      {step.textPosition === "above" && (
                        <StepText
                          step={step}
                          visible={visible}
                          className="mb-6 text-center lg:mb-8"
                        />
                      )}

                      <StepIcon
                        step={step}
                        visible={visible}
                        sizeClass="h-11 w-11 lg:h-[52px] lg:w-[52px]"
                        iconRef={setIconRef(index)}
                      />

                      {step.textPosition === "below" && (
                        <StepText
                          step={step}
                          visible={visible}
                          className="mt-6 text-center lg:mt-8"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
