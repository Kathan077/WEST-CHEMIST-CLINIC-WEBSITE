import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AboutHero from '../../components/About/Abouthero';
import AboutMission from '../../components/About/AboutMission';
import AboutWhy from '../../components/About/AboutValues'; // using AboutValues.jsx as AboutWhy internally
import AboutImpact from '../../components/About/AboutImpact';
import AboutTeam from '../../components/About/AboutTeam';
import AboutBranches from '../../components/About/Branches';
import AboutFaq from '../../components/About/AboutFaq';

export const metadata = {
    title: 'About Us - West Chemist Clinic',
    description: 'Learn more about West Chemist Clinic, our mission, and our state-of-the-art healthcare facilities.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#f8fafb]">
            <Navbar />
            <AboutHero />
            <AboutMission />
            <AboutBranches />
            <AboutWhy />
            <AboutImpact />
         
            <AboutFaq />
           
        </main>
    );
}
