"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/** Mantiene la sesión de Supabase viva al volver a la pestaña o al montar el dashboard. */
export function SessionRefresh() {
  useEffect(() => {
    const supabase = createClient();

    const refresh = () => {
      void supabase.auth.getSession();
    };

    refresh();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        refresh();
      }
    });

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", refresh);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return null;
}
