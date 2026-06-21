import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildSignalsUrl } from "@/lib/signals/query";

interface LoadMoreSignalsProps {
  currentPage: number;
  hasMore: boolean;
  baseParams: Record<string, string | undefined>;
}

export function LoadMoreSignals({
  currentPage,
  hasMore,
  baseParams,
}: LoadMoreSignalsProps) {
  if (!hasMore) return null;

  const href = buildSignalsUrl(baseParams, {
    page: String(currentPage + 1),
  });

  return (
    <div className="mt-8 flex justify-center">
      <Link href={href} className="cursor-pointer">
        <Button variant="outline" size="md">
          Cargar más señales
        </Button>
      </Link>
    </div>
  );
}
