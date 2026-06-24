import type { Metadata } from "next";
import { LandingFooter } from "@/components/marketing/landing/footer";
import { LandingNavbar } from "@/components/marketing/landing/navbar";
import { PricingPageContent } from "./pricing-content";

export const metadata: Metadata = {
  title: "Precios — SubSignal",
  description:
    "Planes Free, Starter y Pro. Empezá gratis con Hacker News. Upgrades cuando lo necesitás, sin contratos ni períodos de aviso.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <LandingNavbar />
      <PricingPageContent />
      <LandingFooter />
    </div>
  );
}
