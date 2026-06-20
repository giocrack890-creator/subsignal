import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const authError =
    params.error === "auth_callback_failed"
      ? "No pudimos completar el inicio de sesión. Intentá de nuevo."
      : null;

  return (
    <main className="flex flex-col items-center">
      {authError && (
        <p className="mb-4 max-w-md rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
          {authError}
        </p>
      )}
      <AuthForm mode="login" />
    </main>
  );
}
