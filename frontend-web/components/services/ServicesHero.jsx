"use client";
import React, { useEffect, useRef, useState } from 'react';
import { API_URL, getImageUrl } from '@/config';
import './ServicesHero.css';

const DEFAULT_HERO = {
    tag: 'Clinical Pharmacy & Healthcare Hub',
    title: 'Expert Clinical Care,',
    highlight: 'Personalised',
    titleSuffix: 'for You',
    desc: 'From NHS Pharmacy First treatments and travel immunisations to private clinical consultations, our trained practitioners deliver fast, evidence-based healthcare tailored to your wellbeing.',
    badge1: 'Trained Clinical Practitioners',
    badge2: 'Same-Day Consultations & Walk-Ins',
    card1Title: 'Travel & Vaccinations',
    card1Desc: 'Complete immunisation clinic',
    card2Title: 'Trained Practitioners',
    card2Desc: 'NHS & Private consultations',
    image: '/images/service-hero.png'
};

export default function ServicesHero({ initialHero }) {
    const heroRef = useRef(null);
    const [hero, setHero] = useState(() => ({ ...DEFAULT_HERO, ...(initialHero || {}) }));

    useEffect(() => {
        if (initialHero) {
            setHero(prev => ({ ...prev, ...initialHero }));
        }
    }, [initialHero]);

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

    const heroImg = hero.image ? getImageUrl(hero.image) : '/images/service-hero.png';

    return (
        <section className="ser_hero_section" ref={heroRef}>
            {/* Visual Backdrops */}
            <div className="ser_hero_blob ser_blob_1" />
            <div className="ser_hero_blob ser_blob_2" />
            <div className="ser_hero_grid_overlay" />

            <div className="ser_hero_container">
                <div className="ser_hero_content">
                    {hero.tag && <span className="ser_hero_tag">{hero.tag}</span>}
                    <h1 className="ser_hero_title">
                        {hero.title} <br />
                        {hero.highlight && <span className="ser_title_gradient">{hero.highlight} </span>}
                        {hero.titleSuffix || ''}
                    </h1>
                    <p className="ser_hero_description">
                        {hero.desc}
                    </p>
                    <div className="ser_hero_badges">
                        {hero.badge1 && (
                            <div className="ser_badge">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                                <span>{hero.badge1}</span>
                            </div>
                        )}
                        {hero.badge2 && (
                            <div className="ser_badge">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>{hero.badge2}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="ser_hero_visual">
                    {hero.card1Title && (
                        <div className="ser_floating_card ser_card_1">
                            <div className="ser_card_icon icon_purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /><path d="m9.05 12.55 1.5 1.5 4-4" /></svg>
                            </div>
                            <div className="ser_card_text">
                                <h4>{hero.card1Title}</h4>
                                <p>{hero.card1Desc}</p>
                            </div>
                        </div>
                    )}

                    {hero.card2Title && (
                        <div className="ser_floating_card ser_card_2">
                            <div className="ser_card_icon icon_teal">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" /></svg>
                            </div>
                            <div className="ser_card_text">
                                <h4>{hero.card2Title}</h4>
                                <p>{hero.card2Desc}</p>
                            </div>
                        </div>
                    )}

                    <div className="ser_hero_main_img">
                        <div className="ser_img_inner">
                            <img src={heroImg} alt="Clinical Excellence" className="ser_main_pic" />
                        </div>
                        <div className="ser_img_outline" />
                    </div>
                </div>
            </div>
        </section>
    );
}
