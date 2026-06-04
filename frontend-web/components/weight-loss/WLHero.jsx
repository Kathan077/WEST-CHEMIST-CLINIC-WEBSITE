"use client";
import React, { useEffect, useRef } from 'react';
import './WLHero.css';

const WLHero = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        if (!heroRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('wlh_reveal_active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = heroRef.current.querySelectorAll('.wlh_reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="wl_hero_section" ref={heroRef}>
            {/* Cinematic Background */}
            <div className="wl_hero_bg">
                <div className="wl_hero_overlay"></div>
            </div>

            <div className="wl_hero_container">
                {/* Top Row: Heading Content */}
                <div className="wl_hero_content_row">
                    <span className="wlh_eyebrow wlh_reveal">Clinical Weight Management</span>
                    <h1 className="wlh_title wlh_reveal" style={{ transitionDelay: '0.1s' }}>
                        Medical Weight Loss. <span className="wlh_highlight">Reimagined.</span>
                    </h1>
                    <p className="wlh_lead wlh_reveal" style={{ transitionDelay: '0.2s' }}>
                        Transform your health with our doctor-led GLP-1 weight loss programs, including Wegovy® and Mounjaro®. Backed by science, tailored to you.
                    </p>

                    <div className="wlh_actions wlh_reveal" style={{ transitionDelay: '0.3s' }}>
                        <a href="#programs" className="wlh_btn_primary">
                            Explore Treatments
                        </a>
                        <a href="/book-appointment" className="wlh_btn_secondary">
                            Start Consultation
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </a>
                    </div>
                </div>

                {/* Bottom Row: Horizontal Glass Stats */}
                <div className="wl_hero_stats_row wlh_reveal" style={{ transitionDelay: '0.4s' }}>
                    <div className="wlh_stat_card">
                        <div className="wlh_icon">🩺</div>
                        <div className="wlh_stat_info">
                            <h4>Doctor Led</h4>
                            <p>Clinical Supervision</p>
                        </div>
                    </div>
                    <div className="wlh_stat_card">
                        <div className="wlh_icon">📉</div>
                        <div className="wlh_stat_info">
                            <h4>Proven Results</h4>
                            <p>GLP-1 Efficacy</p>
                        </div>
                    </div>
                    <div className="wlh_stat_card">
                        <div className="wlh_icon">🛡️</div>
                        <div className="wlh_stat_info">
                            <h4>Safe & Secure</h4>
                            <p>CQC Registered</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WLHero;
