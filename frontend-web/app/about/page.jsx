import React from 'react';
import Navbar from '../../components/layout/Navbar';
import AboutHero from '../../components/About/Abouthero';
import AboutMission from '../../components/About/AboutMission';
import AboutWhy from '../../components/About/AboutValues'; // using AboutValues.jsx as AboutWhy internally
import AboutBranches from '../../components/About/Branches';
import AboutFaq from '../../components/About/AboutFaq';
import { API_URL } from '@/config';

export const metadata = {
    title: 'About Us - West Chemist',
    description: 'Learn more about West Chemist, our mission, and our dedicated community pharmacy services.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
    let aboutData = [];
    try {
        const res = await fetch(`${API_URL}/api/about?t=${Date.now()}`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            aboutData = json.data;
        }
    } catch (e) {
        // Fallbacks in client components handle errors gracefully
    }

    const heroData = aboutData.find(item => item.type === 'hero');
    const cardItems = aboutData.filter(item => item.type === 'card');
    const branchHeaderData = aboutData.find(item => item.type === 'branch_header');
    const branchItems = aboutData.filter(item => item.type === 'branch');
    const coreValuesData = aboutData.find(item => item.type === 'core_values');
    const faqHeaderData = aboutData.find(item => item.type === 'faq_header');
    const faqItems = aboutData.filter(item => item.type === 'faq');

    return (
        <main className="min-h-screen bg-[#f8fafb]">
            <Navbar />
            <AboutHero initialHero={heroData} />
            <AboutMission initialCards={cardItems} />
            <AboutBranches initialBranches={branchItems} initialHeader={branchHeaderData} />
            <AboutWhy initialValues={coreValuesData} />
            <AboutFaq initialFaqs={faqItems} initialHeader={faqHeaderData} />
        </main>
    );
}

