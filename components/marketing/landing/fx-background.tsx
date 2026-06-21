"use client";

const SYMBOLS = [
  { text: "(12+12)", top: "14%", left: "5%", rotate: -12, boxed: false },
  { text: "−15+6", top: "22%", left: "82%", rotate: 8, boxed: false },
  { text: "3y", top: "68%", left: "6%", rotate: 14, boxed: false },
  { text: "17+6−4", top: "72%", left: "84%", rotate: -5, boxed: false },
  { text: "√5×9/8", top: "48%", left: "4%", rotate: 4, boxed: false },
  { text: "−8", top: "32%", left: "90%", rotate: -16, boxed: false },
  { text: "24", top: "38%", left: "18%", rotate: 0, boxed: true },
  { text: "12", top: "58%", left: "76%", rotate: 0, boxed: true },
];

const PARTICLES = [
  { top: "20%", left: "46%", size: 5 },
  { top: "30%", left: "58%", size: 3 },
  { top: "44%", left: "42%", size: 4 },
  { top: "26%", left: "34%", size: 3 },
  { top: "52%", left: "52%", size: 5 },
];

const SYMBOL_OPACITY = 0.1;

interface FxBackgroundProps {
  /** Más visible en hero; más sutil en login */
  intensity?: "hero" | "subtle";
}

export function FxBackground({ intensity = "hero" }: FxBackgroundProps) {
  const gridOpacity = intensity === "hero" ? 0.85 : 0.55;
  const showSymbols = intensity === "hero";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 fx-grid"
        style={{
          opacity: gridOpacity,
          transform: "perspective(700px) rotateX(52deg) scale(1.8)",
          transformOrigin: "50% 0%",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 72%)",
        }}
      />

      <div className="absolute inset-0 fx-radial-glow" />

      {showSymbols &&
        SYMBOLS.map((s, i) => (
          <span
            key={s.text}
            className={`absolute select-none font-mono text-sm text-white fx-float ${
              s.boxed ? "rounded border border-white/15 px-1.5 py-0.5 text-xs" : ""
            }`}
            style={{
              top: s.top,
              left: s.left,
              ["--rot" as string]: `${s.rotate}deg`,
              opacity: SYMBOL_OPACITY,
              animationDelay: `${i * 0.35}s`,
            }}
          >
            {s.text}
          </span>
        ))}

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary fx-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
    </div>
  );
}
