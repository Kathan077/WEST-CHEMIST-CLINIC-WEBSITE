import React from 'react';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesList from '@/components/services/ServicesList';
import NHSServices from '@/components/services/NHSServices';
import PrivateServices from '@/components/services/PrivateServices';
import TravelClinic from '@/components/services/TravelClinic';
import ServiceBenefits from '@/components/services/ServiceBenefits';
import ServiceFAQ from '@/components/services/ServiceFAQ';
import CTASection from '@/components/home/CTASection';

export const metadata = {
    title: 'Professional Clinical Services | West Chemist Clinic',
    description: 'Explore our range of NHS and private clinical services, from vaccinations to chronic condition management.',
};

export default function ServicesPage() {
    return (
        <main className="services_page">
            <ServicesHero />
            
            {/* God-Level NHS Services Mega Section */}
            <NHSServices />

            {/* Premium Private Services Section */}
            <PrivateServices />

            {/* Specialist Travel Clinic Section */}
            <TravelClinic />

            {/* Core Clinical Services Section */}
            <ServicesList />

            {/* Why Choose Us Section */}
            <ServiceBenefits />

            {/* FAQ Section */}
            <ServiceFAQ />

            {/* Reuse Home CTA Section */}
            <CTASection />
        </main>
    );
}
