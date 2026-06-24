import { LandingNavbar } from "@/components/marketing/landing/navbar";
import { LandingHero } from "@/components/marketing/landing/hero";
import { LandingWhyReddit } from "@/components/marketing/landing/why-reddit";
import { LandingRedditChallenges } from "@/components/marketing/landing/reddit-challenges";
import { LandingHowItWorks } from "@/components/marketing/landing/how-it-works";
import { LandingProductPreview } from "@/components/marketing/landing/product-preview";
import { LandingPlatforms } from "@/components/marketing/landing/platforms";
import { LandingFeatures } from "@/components/marketing/landing/features";
import { LandingPricing } from "@/components/marketing/landing/pricing";
import { LandingSocialProof } from "@/components/marketing/landing/social-proof";
import { LandingFaq } from "@/components/marketing/landing/faq";
import { LandingCta } from "@/components/marketing/landing/cta";
import { LandingFooter } from "@/components/marketing/landing/footer";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <LandingNavbar />
      <main id="main-content">
        <LandingHero />
        <LandingWhyReddit />
        <LandingRedditChallenges />
        <LandingHowItWorks />
        <LandingProductPreview />
        <LandingPlatforms />
        <LandingFeatures />
        <LandingPricing />
        <LandingSocialProof />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
