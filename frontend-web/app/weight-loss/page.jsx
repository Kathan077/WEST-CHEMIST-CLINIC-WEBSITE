import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import WLHero from '../../components/weight-loss/WLHero';
import WLPrograms from '../../components/weight-loss/WLPrograms';
import WLProcess from '../../components/weight-loss/WLProcess';
import WLSuccess from '../../components/weight-loss/WLSuccess';
import WLFAQ from '../../components/weight-loss/WLFAQ';

export const metadata = {
    title: 'Medical Weight Loss - West Chemist Clinic',
    description: 'Transform your health with our doctor-led GLP-1 weight loss programs including Wegovy and Mounjaro. Tailored, safe, and effective.',
};

export default function WeightLossPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <WLHero />
            <WLPrograms />
            <WLProcess />
            <WLSuccess />
            <WLFAQ />
          
        </main>
    );
}
