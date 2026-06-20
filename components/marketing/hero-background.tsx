export function HeroBackground() {
  const graffiti = [
    { text: "FIND", top: "32%", left: "12%", rotate: "-8deg", size: "text-6xl" },
    { text: "SIGNALS", top: "38%", left: "55%", rotate: "4deg", size: "text-7xl" },
    { text: "REPLY", top: "48%", left: "22%", rotate: "6deg", size: "text-5xl" },
    { text: "FAST", top: "52%", left: "68%", rotate: "-5deg", size: "text-6xl" },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Grid superior con perspectiva (Ape Terminal) */}
      <div
        className="absolute inset-x-0 top-0 h-[55%] bg-grid-top opacity-80"
        style={{
          transform: "perspective(600px) rotateX(40deg)",
          transformOrigin: "50% 0%",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 85%)",
        }}
      />

      {/* Glow radial central */}
      <div className="absolute inset-0 bg-radial-glow" />

      {/* Grid inferior sutil (Fxology) */}
      <div
        className="absolute inset-0 bg-grid opacity-30"
        style={{
          maskImage: "linear-gradient(to top, black 0%, transparent 40%)",
        }}
      />

      {/* Watermark graffiti detrás del hero */}
      {graffiti.map((g) => (
        <span
          key={g.text}
          className={`graffiti-watermark absolute font-sans ${g.size}`}
          style={{
            top: g.top,
            left: g.left,
            transform: `rotate(${g.rotate})`,
          }}
        >
          {g.text}
        </span>
      ))}

      {/* Partículas verdes */}
      {[
        { top: "22%", left: "48%", size: 5 },
        { top: "30%", left: "62%", size: 3 },
        { top: "18%", left: "35%", size: 4 },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0.5,
            boxShadow: "0 0 16px rgba(57,255,136,0.7)",
          }}
        />
      ))}
    </div>
  );
}
