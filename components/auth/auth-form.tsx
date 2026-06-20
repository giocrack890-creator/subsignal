"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth/urls";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = getAuthCallbackUrl();

  async function handleGoogleSignIn() {
    setLoading("google");
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(null);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading("email");
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Ingresá tu email");
      setLoading(null);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: mode === "signup",
      },
    });

    setLoading(null);

    if (authError) {
      setError(authError.message);
      return;
    }

    setMessage("Te enviamos un link mágico. Revisá tu bandeja de entrada.");
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            SS
          </span>
          <span className="text-lg font-semibold text-foreground">SubSignal</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          {mode === "login" ? "Bienvenido de vuelta" : "Creá tu cuenta gratis"}
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          {mode === "login"
            ? "Ingresá para ver tus señales de intención"
            : "Empezá a monitorear conversaciones en minutos"}
        </p>
      </div>

      <div className="bento-card rounded-2xl p-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={loading !== null}
          onClick={handleGoogleSignIn}
        >
          {loading === "google" ? (
            "Conectando..."
          ) : (
            <>
              <GoogleIcon />
              Continuar con Google
            </>
          )}
        </Button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-foreground-muted">o con magic link</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-foreground-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@startup.com"
              autoComplete="email"
              disabled={loading !== null}
              className={cn(
                "w-full rounded-xl border border-border bg-background-elevated px-4 py-2.5",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              )}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading !== null}
          >
            {loading === "email"
              ? "Enviando..."
              : mode === "login"
                ? "Enviar magic link"
                : "Registrarme con email"}
          </Button>
        </form>

        {message && (
          <p className="mt-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        {mode === "login" ? (
          <>
            ¿No tenés cuenta?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Registrate gratis
            </Link>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Iniciá sesión
            </Link>
          </>
        )}
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
