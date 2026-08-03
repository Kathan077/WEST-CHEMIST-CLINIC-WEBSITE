import React from 'react';
import VaccinationHero from '../../components/vaccination/VaccinationHero';
import VaccinationGrid from '../../components/vaccination/VaccinationGrid';
import VaccinationProcess from '../../components/vaccination/VaccinationProcess';
import VaccinationFAQ from '../../components/vaccination/VaccinationFAQ';

export const metadata = {
    title: 'Vaccinations - West Chemist',
    description: 'Comprehensive travel and routine vaccination services at West Chemist. Protect your health globally with our qualified pharmacy team.',
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
