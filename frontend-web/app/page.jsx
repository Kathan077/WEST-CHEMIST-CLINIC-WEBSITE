import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import WeightLossCTA from "@/components/home/WeightLossCTA";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import MedicalBackground from "@/components/Medicalbackground/Medicalbackground";

export const metadata = {
  title: "West Chemist Clinic — Expert Pharmaceutical & Health Services",
  description: "West Chemist Clinic offers expert pharmaceutical care, travel vaccinations, weight loss programs, and specialist health advice in WA.",
};

export default function Home() {
  return (
    <main>
   
      <Hero />
      <ServicesSection />
      <WeightLossCTA />
      <AboutSection />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </main>
  );
}
