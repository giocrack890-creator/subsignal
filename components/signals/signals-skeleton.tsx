export function SignalsSkeleton() {
  return (
    <ul className="mt-6 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="signals-shimmer h-[88px] rounded-[10px] border border-border-medio bg-nivel-3"
        />
      ))}
    </ul>
  );
}
