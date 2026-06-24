interface ProgressRingProps {
  value: number;
  max: number;
  label?: string;
  size?: number;
}

export function ProgressRing({
  value,
  max,
  label = "en uso",
  size = 72,
}: ProgressRingProps) {
  const pct = max === Infinity || max === 0 ? 0 : Math.min(100, (value / max) * 100);
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const maxLabel = max === Infinity ? "∞" : String(max);

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--dash-border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--dash-accent)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
            style={{
              filter: "drop-shadow(0 0 6px rgba(34,197,94,0.5))",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-black text-foreground">{value}</span>
          <span className="text-[9px] text-foreground-muted">/{maxLabel}</span>
        </div>
      </div>
      <div className="text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground-muted">
          Keywords
        </p>
        <p className="text-sm text-foreground-secondary">{label}</p>
      </div>
    </div>
  );
}
