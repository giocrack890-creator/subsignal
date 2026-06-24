import { LandingFooter } from "@/components/marketing/landing/footer";
import { LandingNavbar } from "@/components/marketing/landing/navbar";

interface LegalPageShellProps {
  children: React.ReactNode;
}

export function LegalPageShell({ children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <LandingNavbar />
      <main id="main-content" className="pt-24 pb-20">
        <div className="mx-auto max-w-[800px] px-6 lg:px-10">{children}</div>
      </main>
      <LandingFooter />
    </div>
  );
}

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="rounded-[14px] border border-[#232323] bg-[#111714] p-6 md:p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-[#B4B4B4]">
        {children}
      </div>
    </section>
  );
}

interface LegalHighlightProps {
  children: React.ReactNode;
}

export function LegalHighlight({ children }: LegalHighlightProps) {
  return (
    <div className="rounded-[14px] border border-[rgba(52,211,153,0.4)] bg-[#111714] p-6 md:p-8 shadow-[0_0_40px_rgba(52,211,153,0.08)]">
      <p className="text-base leading-relaxed text-[#B4B4B4]">{children}</p>
    </div>
  );
}
