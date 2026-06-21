import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const authError =
    params.error === "auth_callback_failed"
      ? "No pudimos completar el inicio de sesión con Google. Intentá de nuevo."
      : params.error === "google_not_enabled"
        ? "Google Auth no está habilitado en Supabase. Activá el provider en el dashboard."
        : null;

  return (
    <main className="flex flex-col items-center">
      <AuthForm errorMessage={authError} />
    </main>
  );
}
