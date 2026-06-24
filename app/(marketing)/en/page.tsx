import { LandingNavbar } from "@/components/marketing/landing/navbar";
import { LandingHero } from "@/components/marketing/landing/hero";
import { LandingSteps } from "@/components/marketing/landing/steps";
import { LandingPlatforms } from "@/components/marketing/landing/platforms";
import { LandingFeatures } from "@/components/marketing/landing/features";
import { LandingPricing } from "@/components/marketing/landing/pricing";
import { LandingSocialProof } from "@/components/marketing/landing/social-proof";
import { LandingFaq } from "@/components/marketing/landing/faq";
import { LandingCta } from "@/components/marketing/landing/cta";
import { LandingFooter } from "@/components/marketing/landing/footer";

const LOCALE = "en" as const;

export default function EnglishHomePage() {
  return (
    <>
      <LandingNavbar locale={LOCALE} />
      <main id="main-content">
        <LandingHero locale={LOCALE} />
        <LandingSteps />
        <LandingPlatforms />
        <LandingFeatures />
        <LandingPricing locale={LOCALE} />
        <LandingSocialProof />
        <LandingFaq locale={LOCALE} />
        <LandingCta locale={LOCALE} />
      </main>
      <LandingFooter />
    </>
  );
}
