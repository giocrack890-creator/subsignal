export function RadarIcon({ className }: { className?: string }) {
  return (
    <div className={`dash-radar-wrap ${className ?? ""}`} aria-hidden="true">
      <div className="dash-radar-ring dash-radar-ring-1" />
      <div className="dash-radar-ring dash-radar-ring-2" />
      <div className="dash-radar-ring dash-radar-ring-3" />
      <div className="dash-radar-sweep" />
      <div className="dash-radar-dot" />
    </div>
  );
}
