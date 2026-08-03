import React from 'react';
import WeightLossContent from './WeightLossContent';

export const metadata = {
    title: 'Weight Loss & Medical Management - West Chemist',
    description: 'Achieve sustainable, clinically supervised weight loss at West Chemist. We offer weekly Wegovy and Mounjaro injections with GPhC prescription oversight.',
    keywords: 'weight loss, wegovy, mounjaro, semaglutide, tirzepatide, weight management, west chemist',
};

export default function WeightLossPage() {
    return (
        <div className="min-h-screen">
            <WeightLossContent />
        </div>
    );
}
