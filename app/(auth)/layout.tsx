import { HeroBackground } from "@/components/marketing/hero-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <HeroBackground />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
