import React from 'react';
import VaccinationContent from './VaccinationContent';
import { API_URL } from '@/config';

export const metadata = {
    title: 'Vaccinations - West Chemist',
    description: 'Comprehensive travel and routine vaccination services at West Chemist. Protect your health globally with our qualified pharmacy team.',
};

export default async function VaccinationPage() {
    let initialCMS = null;
    try {
        const res = await fetch(`${API_URL}/api/vaccination-cms?t=${Date.now()}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
                initialCMS = json.data;
            }
        }
    } catch (err) {
        console.error("Error prefetching Vaccination CMS:", err);
    }

    return <VaccinationContent initialCMS={initialCMS} />;
}
