import React from 'react';
import WeightLossContent from './WeightLossContent';

import { API_URL } from '@/config';

export const metadata = {
    title: 'Weight Loss & Medical Management - West Chemist',
    description: 'Achieve sustainable, PHARMACYly supervised weight loss at West Chemist. We offer weekly Wegovy and Mounjaro injections with GPhC prescription oversight.',
    keywords: 'weight loss, wegovy, mounjaro, semaglutide, tirzepatide, weight management, west chemist',
};

export default async function WeightLossPage() {
    let initialCMS = null;
    try {
        const res = await fetch(`${API_URL}/api/weight-loss/cms`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success && json.data) {
            initialCMS = json.data;
        }
    } catch (e) {
        // Fallback handled in WeightLossContent
    }

    return (
        <div className="min-h-screen">
            <WeightLossContent initialCMS={initialCMS} />
        </div>
    );
}

