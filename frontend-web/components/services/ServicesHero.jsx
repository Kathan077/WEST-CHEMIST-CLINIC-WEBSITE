"use client";
import React, { useEffect, useRef } from 'react';
import './ServicesHero.css';

export default function ServicesHero() {
    const heroRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('hero_active');
                }
            });
        }, { threshold: 0.1 });

        if (heroRef.current) observer.observe(heroRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="ser_hero_section" ref={heroRef}>
            {/* Visual Backdrops */}
            <div className="ser_hero_blob ser_blob_1" />
            <div className="ser_hero_blob ser_blob_2" />
            <div className="ser_hero_grid_overlay" />

            <div className="ser_hero_container">
                <div className="ser_hero_content">
                    <span className="ser_hero_tag">Pharmaceutical HUB</span>
                    <h1 className="ser_hero_title">
                        Expert Care, <br />
                        <span className="ser_title_gradient">Personalised</span> for You
                    </h1>
                    <p className="ser_hero_description">
                        From primary health concerns to advanced wellness programs, we provide professional pharmaceutical services with a focus on patient comfort and healthcare excellence.
                    </p>
                    <div className="ser_hero_badges">
                        <div className="ser_badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                            <span>NHS Certified</span>
                        </div>
                        <div className="ser_badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Fast Results</span>
                        </div>
                    </div>
                </div>

                <div className="ser_hero_visual">
                    <div className="ser_floating_card ser_card_1">
                        <div className="ser_card_icon icon_purple">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /><path d="m9.05 12.55 1.5 1.5 4-4" /></svg>
                        </div>
                        <div className="ser_card_text">
                            <h4>Vaccinations</h4>
                            <p>Global protection</p>
                        </div>
                    </div>

                    <div className="ser_floating_card ser_card_2">
                        <div className="ser_card_icon icon_teal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" /></svg>
                        </div>
                        <div className="ser_card_text">
                            <h4>Expert Advice</h4>
                            <p>Professional support</p>
                        </div>
                    </div>

                    <div className="ser_hero_main_img">
                        <div className="ser_img_inner">
                            <img src="/images/service-hero.png" alt="Clinical Excellence" className="ser_main_pic" />
                        </div>
                        <div className="ser_img_outline" />
                    </div>
                </div>
            </div>


        </section>
    );
}

