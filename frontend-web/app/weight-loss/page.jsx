import React from 'react';
import WeightLossContent from './WeightLossContent';

export const metadata = {
    title: 'Weight Loss Clinic & Medical Management - West Chemist Clinic',
    description: 'Achieve sustainable, clinically supervised weight loss at West Chemist Clinic. We offer weekly Wegovy and Mounjaro injections with GPhC prescription oversight.',
    keywords: 'weight loss clinic, wegovy, mounjaro, semaglutide, tirzepatide, medical weight loss, weight management, west chemist clinic',
};

export default function WeightLossPage() {
    return (
        <div className="min-h-screen">
            <WeightLossContent />
        </div>
    );
}
