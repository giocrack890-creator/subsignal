export function SignalsSkeleton() {
  return (
    <ul className="mt-6 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="signals-shimmer h-[88px] rounded-xl border border-[#1E1E1E]"
        />
      ))}
    </ul>
  );
}
