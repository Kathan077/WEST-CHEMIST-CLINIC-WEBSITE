"use client";
import React, { useState, useEffect } from 'react';
import ServicesHero from '@/components/services/ServicesHero';
import NHSServices from '@/components/services/NHSServices';
import PrivateServices from '@/components/services/PrivateServices';
import TravelClinic from '@/components/services/TravelClinic';
import CustomCategorySection from '@/components/services/CustomCategorySection';
import ServiceBenefits from '@/components/services/ServiceBenefits';
import ServiceFAQ from '@/components/services/ServiceFAQ';
import CTASection from '@/components/home/CTASection';
import { API_URL } from '@/config';

const isWeightLoss = (s) => {
    const slug = (s.slug || '').toLowerCase();
    return slug === 'wegovy' || slug === 'mounjaro' || slug === 'wegovy-pills';
};

export default function ServicesContent({ initialCMS }) {
    const [customCategories, setCustomCategories] = useState({});
    const [cms, setCms] = useState(() => initialCMS || null);

    useEffect(() => {
        // Fetch CMS data to ensure live synchronization
        const fetchCMS = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services-cms`, { cache: 'no-store' });
                const json = await res.json();
                if (res.ok && json.success && json.data) {
                    setCms(json.data);
                }
            } catch (err) {
                console.error("Failed to load Services CMS:", err);
            }
        };

        // Fetch custom category services
        const fetchCustomServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && json.data.length > 0) {
                    const standardCats = [
                        'NHS Services (Pharmacy First)',
                        'Private Services',
                        'Travel Clinic',
                        'Vaccination Services',
                        'Weight Management'
                    ];
                    
                    const groups = {};
                    json.data.forEach(s => {
                        // Skip weight loss services completely from custom categories on /services page
                        if (isWeightLoss(s)) return;
                        
                        const parent = s.parentCategory || 'Private Services';
                        if (!standardCats.includes(parent)) {
                            if (!groups[parent]) {
                                groups[parent] = [];
                            }
                            groups[parent].push(s);
                        }
                    });
                    setCustomCategories(groups);
                }
            } catch (err) {
                console.error("Failed to fetch custom services:", err);
            }
        };

        fetchCMS();
        fetchCustomServices();
    }, []);

    return (
        <main className="services_page">
            <ServicesHero initialHero={cms?.hero} />
            
            {/* God-Level NHS Services Mega Section */}
            <NHSServices initialHeader={cms?.sectionHeaders?.nhs} />

            {/* Premium Private Services Section */}
            <PrivateServices initialHeader={cms?.sectionHeaders?.privateServices} />

            {/* Travel Clinic Section */}
            <TravelClinic initialHeader={cms?.sectionHeaders?.travelClinic} />

            {/* Custom Category Sections */}
            {Object.keys(customCategories).map(catName => (
                <CustomCategorySection 
                     key={catName} 
                     categoryName={catName} 
                     services={customCategories[catName]} 
                />
            ))}

            {/* Why Choose Us Section */}
            <ServiceBenefits initialBenefits={cms?.benefits} />

            {/* FAQ Section */}
            <ServiceFAQ initialFaqs={cms?.faqs} />

            {/* Reuse Home CTA Section */}
            <CTASection initialCTA={cms?.cta} />
        </main>
    );
}
