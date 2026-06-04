import React from 'react';
import VaccinationHero from '../../components/vaccination/VaccinationHero';
import VaccinationGrid from '../../components/vaccination/VaccinationGrid';
import VaccinationProcess from '../../components/vaccination/VaccinationProcess';
import VaccinationFAQ from '../../components/vaccination/VaccinationFAQ';

export const metadata = {
    title: 'Vaccinations - West Chemist Clinic',
    description: 'Comprehensive travel and routine vaccination services at West Chemist Clinic. Protect your health globally with our expert clinical team.',
};

export default function VaccinationPage() {
    return (
        <div className="min-h-screen">
            <VaccinationHero />
            <VaccinationGrid />
            <VaccinationProcess />
            <VaccinationFAQ />
        </div>
    );
}
