import CallToAction from "../components/landing/CallToAction";
import Faq from "../components/landing/Faq";
import Features from "../components/landing/Features";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import LandingFooter from "../components/landing/LandingFooter";
import LandingHeader from "../components/landing/LandingHeader";
import Modes from "../components/landing/Modes";
import ModesMarquee from "../components/landing/ModesMarquee";
import Pricing from "../components/landing/Pricing";

// Public marketing page at "/" for signed-out visitors. It's designed for the
// dark Midnight palette, so it pins that theme whatever the visitor picked.
export default function Landing() {
  return (
    <div data-theme="midnight" className="min-h-dvh overflow-x-clip bg-bg font-sans text-text">
      <LandingHeader />
      <main>
        <Hero />
        <ModesMarquee />
        <Modes />
        <HowItWorks />
        <Features />
        <Pricing />
        <Faq />
        <CallToAction />
      </main>
      <LandingFooter />
    </div>
  );
}
