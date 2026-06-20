import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center">
      <AuthForm mode="signup" />
    </main>
  );
}
