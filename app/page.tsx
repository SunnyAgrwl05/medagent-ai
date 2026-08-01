import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { AgentShowcase } from "@/components/landing/agent-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <AgentShowcase />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
