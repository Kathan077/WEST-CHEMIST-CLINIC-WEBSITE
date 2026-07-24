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
    const cat = (s.cat || '').toLowerCase();
    const parentCat = (s.parentCategory || '').toLowerCase();
    const title = (s.title || '').toLowerCase();
    return parentCat.includes('weight') || cat.includes('weight') || slug === 'wegovy' || slug === 'mounjaro' || title.includes('weight') || title.includes('wegovy') || title.includes('mounjaro');
};

const isVaccination = (s) => {
    if (isWeightLoss(s)) return false;
    const slug = (s.slug || '').toLowerCase();
    const cat = (s.cat || '').toLowerCase();
    const parentCat = (s.parentCategory || '').toLowerCase();
    const title = (s.title || '').toLowerCase();
    
    if (slug === 'travel-clinic' || title === 'travel clinic' || slug === 'travel-clinic-service') return false;
    
    return (
        parentCat === 'vaccination services' ||
        parentCat.includes('vacc') ||
        cat.includes('vacc') ||
        cat.includes('immuniz') ||
        title.includes('vaccin') ||
        title.includes('immunis') ||
        title.includes('immuniz') ||
        title.includes('flu') ||
        title.includes('covid') ||
        title.includes('meningitis') ||
        title.includes('shingles') ||
        title.includes('chickenpox') ||
        title.includes('hpv') ||
        title.includes('rabies') ||
        title.includes('hepatitis') ||
        title.includes('typhoid') ||
        title.includes('yellow fever') ||
        title.includes('dengue') ||
        title.includes('chikungunya') ||
        title.includes('encephalitis') ||
        title.includes('dtp') ||
        title.includes('mmr') ||
        title.includes('cholera')
    );
};

export default function ServicesPage() {
    const [customCategories, setCustomCategories] = useState({});

    useEffect(() => {
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
                        // Skip vaccination and weight loss services completely from /services page
                        if (isVaccination(s) || isWeightLoss(s)) return;
                        
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
        fetchCustomServices();
    }, []);

    return (
        <main className="services_page">
            <ServicesHero />
            
            {/* God-Level NHS Services Mega Section */}
            <NHSServices />

            {/* Premium Private Services Section */}
            <PrivateServices />

            {/* Travel Clinic Section */}
            <TravelClinic />

            {/* Custom Category Sections */}
            {Object.keys(customCategories).map(catName => (
                <CustomCategorySection 
                     key={catName} 
                     categoryName={catName} 
                     services={customCategories[catName]} 
                />
            ))}

            {/* Why Choose Us Section */}
            <ServiceBenefits />

            {/* FAQ Section */}
            <ServiceFAQ />

            {/* Reuse Home CTA Section */}
            <CTASection />
        </main>
    );
}
