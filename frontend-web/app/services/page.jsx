import React from 'react';
import ServicesContent from './ServicesContent';
import { API_URL } from '@/config';

export const metadata = {
    title: 'Pharmacy Services - West Chemist',
    description: 'Explore our NHS Pharmacy First, private clinical treatments, and travel health services at West Chemist.',
};

export default async function ServicesPage() {
    let initialCMS = null;
    try {
        const res = await fetch(`${API_URL}/api/services-cms`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data) {
            initialCMS = json.data;
        }
    } catch (e) {
        // Fallbacks in child components handle gracefully
    }

    return <ServicesContent initialCMS={initialCMS} />;
}
