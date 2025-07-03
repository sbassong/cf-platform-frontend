import Hero from "./landing/Hero";
import Features from "./landing/Features";
import Testimonials from "./landing/Testimonials";
import CTA from "./landing/CTA";
import Footer from "./landing/Footer";

export function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}