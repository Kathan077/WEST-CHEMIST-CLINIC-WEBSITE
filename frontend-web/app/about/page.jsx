import React from 'react';
import Navbar from '../../components/layout/Navbar';
import AboutHero from '../../components/About/Abouthero';
import AboutMission from '../../components/About/AboutMission';
import AboutWhy from '../../components/About/AboutValues'; // using AboutValues.jsx as AboutWhy internally
import AboutImpact from '../../components/About/AboutImpact';
import AboutBranches from '../../components/About/Branches';
import AboutFaq from '../../components/About/AboutFaq';
import { API_URL } from '@/config';

export const metadata = {
    title: 'About Us - West Chemist',
    description: 'Learn more about West Chemist, our mission, and our dedicated community pharmacy services.',
};

export default async function AboutPage() {
    let aboutData = [];
    try {
        const res = await fetch(`${API_URL}/api/about`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            aboutData = json.data;
        }
    } catch (e) {
        // Fallbacks in client components handle errors gracefully
    }

    const heroData = aboutData.find(item => item.type === 'hero');
    const cardItems = aboutData.filter(item => item.type === 'card');
    const branchItems = aboutData.filter(item => item.type === 'branch');
    const impactData = aboutData.find(item => item.type === 'impact');
    const faqItems = aboutData.filter(item => item.type === 'faq');

    return (
        <main className="min-h-screen bg-[#f8fafb]">
            <Navbar />
            <AboutHero initialHero={heroData} />
            <AboutMission initialCards={cardItems} />
            <AboutBranches initialBranches={branchItems} />
            <AboutWhy />
            <AboutImpact initialImpact={impactData} />
            <AboutFaq initialFaqs={faqItems} />
        </main>
    );
}

