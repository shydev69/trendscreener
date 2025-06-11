import { HeroSection } from "./(landing)/_sections/HeroSection";
import { Header } from "./(landing)/header";
import { InfoCardsSection } from "./(landing)/_sections/InfoCardsSection";
import FAQSection from "./(landing)/_sections/FaqSection";
import FooterSection from "./(landing)/footer";

export default function Landing() {
  return (
    <div className="overflow-x-hidden max-w-screen bg-[#000000] min-h-screen geist-class">
      <Header />
      <HeroSection />
      <InfoCardsSection />
      {/* <PricingSection /> */}
      <FAQSection />
      <FooterSection />
    </div>
  );
}
