import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import WeightLossCTA from "@/components/home/WeightLossCTA";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { API_URL } from '@/config';

const DEFAULT_METADATA = {
  title: "West Chemist Clinic — Expert Pharmaceutical & Health Services",
  description: "West Chemist Clinic offers expert pharmaceutical care, travel vaccinations, weight loss programs, and specialist health advice in WA.",
};

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_URL}/api/homepage`, { next: { revalidate: 60 } });
    const json = await res.json();
    if (json.success && json.data && json.data.seoSettings) {
      const seo = json.data.seoSettings;
      return {
        title: seo.metaTitle || DEFAULT_METADATA.title,
        description: seo.metaDescription || DEFAULT_METADATA.description,
        keywords: seo.metaKeywords || '',
        alternates: {
          canonical: seo.canonicalUrl || ''
        },
        openGraph: {
          title: seo.ogTitle || seo.metaTitle || DEFAULT_METADATA.title,
          description: seo.ogDescription || seo.metaDescription || DEFAULT_METADATA.description,
          images: seo.ogImage ? [{ url: seo.ogImage }] : []
        }
      };
    }
  } catch (err) {
    console.error("Failed to generate dynamic metadata:", err);
  }
  return DEFAULT_METADATA;
}

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
