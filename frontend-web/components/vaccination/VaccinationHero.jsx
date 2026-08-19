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

export default function VaccinationHero() {
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
                        <span>Travel &amp; Routine Pharmacy Services</span>
                    </div>
                    
                    <h1 className="vacc_hero_main_title">
                        Pharmacy <span className="vacc_title_highlight">Vaccination Services</span>
                    </h1>
                    
                    <p className="vacc_hero_lead_text">
                        Protect your health at home and abroad. West Chemist offers professional, pharmacist-administered travel vaccines, routine immunisations, and seasonal wellness support in a modern, trusted environment.
                    </p>
                    
                    <div className="vacc_hero_btn_group">
                        <Link href="/book-appointment" className="vacc_btn_cta_primary">
                            <span>Book Consultation</span>
                            <svg className="arrow_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                        
                        <button 
                            className="vacc_btn_cta_secondary"
                            onClick={() => document.getElementById('vacc_grid')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <span>Explore Vaccines</span>
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
                            <span className="vacc_card_badge badge_blue">World Health Approved</span>
                        </div>
                        <h3 className="vacc_card_title">Travel Health Service</h3>
                        <p className="vacc_card_description">
                            Yellow Fever, Rabies, Hep A &amp; B, Meningitis ACWY. Certified travel immunisation with official certificates.
                        </p>
                    </div>

                    <div className="vacc_hero_info_card card_type_seasonal">
                        <div className="vacc_card_header">
                            <div className="vacc_card_icon_box icon_green">
                                <SeasonalIcon />
                            </div>
                            <span className="vacc_card_badge badge_green">NHS &amp; Private</span>
                        </div>
                        <h3 className="vacc_card_title">Seasonal Wellness</h3>
                        <p className="vacc_card_description">
                            Flu and COVID-19 vaccination program to protect your family and workplace during winter seasons.
                        </p>
                    </div>

                    <div className="vacc_hero_info_card card_type_routine">
                        <div className="vacc_card_header">
                            <div className="vacc_card_icon_box icon_purple">
                                <ProtectionIcon />
                            </div>
                            <span className="vacc_card_badge badge_purple">Schedule Support</span>
                        </div>
                        <h3 className="vacc_card_title">Routine Immunisations</h3>
                        <p className="vacc_card_description">
                            Shingles, Chickenpox, HPV, and Pneumonia. Keep your PHARMACY vaccine record up to date under pharmacist care.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

