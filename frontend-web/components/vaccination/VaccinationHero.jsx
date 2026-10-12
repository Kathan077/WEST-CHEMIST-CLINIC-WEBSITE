"use client";
import React from 'react';
import Link from 'next/link';
import './VaccinationHero.css';

// Clean SVG Icons for the cards
const TravelBadgeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vacc_card_icon">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const SeasonalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vacc_card_icon">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const ProtectionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vacc_card_icon">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const DEFAULT_HERO = {
    pillBadge: 'Travel & Routine Pharmacy Services',
    titlePrefix: 'Pharmacy ',
    titleHighlight: 'Vaccination Services',
    leadText: 'Protect your health at home and abroad. West Chemist offers professional, pharmacist-administered travel vaccines, routine immunisations, and seasonal wellness support in a modern, trusted environment.',
    primaryBtnText: 'Book Consultation',
    primaryBtnLink: '/book-appointment',
    secondaryBtnText: 'Explore Vaccines',
    card1Badge: 'World Health Approved',
    card1Title: 'Travel Health Service',
    card1Desc: 'Yellow Fever, Rabies, Hep A & B, Meningitis ACWY. Certified travel immunisation with official certificates.',
    card2Badge: 'NHS & Private',
    card2Title: 'Seasonal Wellness',
    card2Desc: 'Flu and COVID-19 vaccination program to protect your family and workplace during winter seasons.',
    card3Badge: 'Schedule Support',
    card3Title: 'Routine Immunisations',
    card3Desc: 'Shingles, Chickenpox, HPV, and Pneumonia. Keep your PHARMACY vaccine record up to date under pharmacist care.'
};

export default function VaccinationHero({ initialHero }) {
    const [hero, setHero] = React.useState(() => ({
        ...DEFAULT_HERO,
        ...(initialHero || {})
    }));

    React.useEffect(() => {
        if (initialHero) {
            setHero(prev => ({
                ...prev,
                ...initialHero
            }));
        }
    }, [initialHero]);

    return (
        <section className="vacc_hero_section" aria-label="Vaccination Service Introduction">
            {/* Ambient Background Elements */}
            <div className="vacc_hero_mesh" aria-hidden="true" />
            <div className="vacc_hero_grid_pattern" aria-hidden="true" />
            
            <div className="vacc_hero_main_container">
                {/* Top Row: Heading Content */}
                <div className="vacc_hero_text_row">
                    <div className="vacc_hero_pill_badge">
                        <span className="pill_indicator" />
                        <span>{hero.pillBadge}</span>
                    </div>
                    
                    <h1 className="vacc_hero_main_title">
                        {hero.titlePrefix}<span className="vacc_title_highlight">{hero.titleHighlight}</span>
                    </h1>
                    
                    <p className="vacc_hero_lead_text">
                        {hero.leadText}
                    </p>
                    
                    <div className="vacc_hero_btn_group">
                        <Link href={hero.primaryBtnLink || '/book-appointment'} className="vacc_btn_cta_primary">
                            <span>{hero.primaryBtnText}</span>
                            <svg className="arrow_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                        
                        <button 
                            className="vacc_btn_cta_secondary"
                            onClick={() => document.getElementById('vacc_grid')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <span>{hero.secondaryBtnText}</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Horizontal Cards Grid */}
                <div className="vacc_hero_cards_row">
                    <div className="vacc_hero_info_card card_type_travel">
                        <div className="vacc_card_header">
                            <div className="vacc_card_icon_box icon_blue">
                                <TravelBadgeIcon />
                            </div>
                            <span className="vacc_card_badge badge_blue">{hero.card1Badge}</span>
                        </div>
                        <h3 className="vacc_card_title">{hero.card1Title}</h3>
                        <p className="vacc_card_description">
                            {hero.card1Desc}
                        </p>
                    </div>

                    <div className="vacc_hero_info_card card_type_seasonal">
                        <div className="vacc_card_header">
                            <div className="vacc_card_icon_box icon_green">
                                <SeasonalIcon />
                            </div>
                            <span className="vacc_card_badge badge_green">{hero.card2Badge}</span>
                        </div>
                        <h3 className="vacc_card_title">{hero.card2Title}</h3>
                        <p className="vacc_card_description">
                            {hero.card2Desc}
                        </p>
                    </div>

                    <div className="vacc_hero_info_card card_type_routine">
                        <div className="vacc_card_header">
                            <div className="vacc_card_icon_box icon_purple">
                                <ProtectionIcon />
                            </div>
                            <span className="vacc_card_badge badge_purple">{hero.card3Badge}</span>
                        </div>
                        <h3 className="vacc_card_title">{hero.card3Title}</h3>
                        <p className="vacc_card_description">
                            {hero.card3Desc}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

