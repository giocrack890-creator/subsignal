"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSignalPanel } from "@/components/dashboard/signal-panel-context";

export function SignalHighlightHandler() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const { openSignal } = useSignalPanel();

  useEffect(() => {
    if (!highlight) return;

    fetch(`/api/signals/${highlight}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { signal?: Parameters<typeof openSignal>[0] } | null) => {
        if (data?.signal) openSignal(data.signal);
      })
      .catch(() => undefined);
  }, [highlight, openSignal]);

  return null;
}
