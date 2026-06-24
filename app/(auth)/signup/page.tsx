import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  redirect(ref ? `/login?ref=${encodeURIComponent(ref)}` : "/login");
}
