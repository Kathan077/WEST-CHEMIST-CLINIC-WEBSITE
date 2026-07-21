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
                        'Travel Clinic'
                    ];
                    
                    const groups = {};
                    json.data.forEach(s => {
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

            {/* Specialist Travel Clinic Section */}
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
