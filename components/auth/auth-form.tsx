"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth/urls";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  errorMessage?: string | null;
}

export function AuthForm({ errorMessage }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorMessage ?? null);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthCallbackUrl(),
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            SS
          </span>
          <span className="text-lg font-semibold text-foreground">SubSignal</span>
        </Link>
      </div>

      <div className="border-glow-card rounded-2xl bg-background-card p-6 sm:p-8">
        <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
          Entrá a SubSignal
        </h1>
        <p className="mt-3 text-center text-[15px] leading-relaxed text-foreground-secondary">
          Un click con Google y empezás a monitorear señales de intención.
        </p>

        <div className="mt-8">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full gap-3"
            disabled={loading}
            onClick={handleGoogleSignIn}
          >
            {loading ? (
              "Redirigiendo a Google..."
            ) : (
              <>
                <GoogleIcon />
                Continuar con Google
              </>
            )}
          </Button>

          {(error || errorMessage) && (
            <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error ?? errorMessage}
            </p>
          )}

          <p className="mt-4 text-center text-xs text-foreground-muted">
            Si no tenés cuenta, se crea automáticamente al ingresar.
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm">
        <Link
          href="/"
          className="text-foreground-muted transition-colors duration-200 hover:text-foreground"
        >
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
