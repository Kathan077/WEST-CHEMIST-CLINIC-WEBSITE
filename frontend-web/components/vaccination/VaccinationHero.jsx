"use client";
import React, { useEffect, useRef, useState } from 'react';
import './VaccinationHero.css';

// Premium SVG Icons
const TravelIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#travel-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="travel-grad" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#5eead4"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient></defs>
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8l6.4 5.4-3.5 3.5-2.6-.9-1.3 1.3 4.4 2.8 2.8 4.4 1.3-1.3-.9-2.6 3.5-3.5 5.4 6.4 1.2-1.2c.4-.2.7-.6.6-1.1z"/>
    </svg>
);

const ShieldIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#shield-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="shield-grad" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#5eead4"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient></defs>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);

const FastIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#fast-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <defs><linearGradient id="fast-grad" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#5eead4"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient></defs>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
);

const VaccinationHero = () => {
    const heroRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 150);

        const handleMouseMove = (e) => {
            if (!heroRef.current || window.innerWidth <= 1200) return;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xPos = (clientX / innerWidth - 0.5) * 30; 
            const yPos = (clientY / innerHeight - 0.5) * 30;
            
            heroRef.current.style.setProperty('--mouse-x', `${xPos}px`);
            heroRef.current.style.setProperty('--mouse-y', `${yPos}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const sidebarItems = [
        { icon: <TravelIcon />, title: 'Travel Ready', desc: 'Approved Certificates', delay: '0.9s' },
        { icon: <ShieldIcon />, title: 'Max Protection', desc: '100% Genuine Vaccines', delay: '1.05s' },
        { icon: <FastIcon />, title: 'Fast Track', desc: 'Same-Day Availability', delay: '1.2s', highlight: true }
    ];

    return (
        <section className={`vacc_hero ${isLoaded ? 'pro_loaded' : ''}`} ref={heroRef}>
            <div className="vacc_hero_bg" />
            
            <div className="vacc_particle_layer" />

            <div className="vacc_mesh_network">
                <div className="mesh_blob blob_1"></div>
                <div className="mesh_blob blob_2"></div>
                <div className="mesh_blob blob_3"></div>
                <div className="mesh_blob blob_4"></div>
            </div>

            <div className="vacc_hero_overlay" />
            
            <div className="vacc_hero_container">
                <div className="vacc_hero_content">
                    <div className="vacc_hero_eyebrow pro_reveal" style={{'--delay': '0.1s'}}>
                        <span className="eyebrow_dot"></span>
                        Premium Clinical Protection
                    </div>
                    
                    <h1 className="vacc_hero_title pro_reveal" style={{'--delay': '0.3s'}}>
                        Future-Proof <br/>
                        <div className="vacc_dynamic_text_wrapper">
                            <span className="vacc_gradient_text">Your Immunity.</span>
                        </div>
                    </h1>
                    
                    <p className="vacc_hero_lead pro_reveal" style={{'--delay': '0.5s'}}>
                        From complex travel immunity protocols to routine healthcare, experience comprehensive, doctor-led vaccination services within a state-of-the-art clinical environment.
                    </p>
                    
                    <div className="vacc_hero_actions pro_reveal" style={{'--delay': '0.7s'}}>
                        <button className="vacc_btn_primary" onClick={() => document.getElementById('vacc_grid')?.scrollIntoView({ behavior: 'smooth' })}>
                            <span>Explore Protocols</span>
                            <svg className="btn_arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                        <a href="/book-appointment" className="vacc_btn_secondary">
                            <span>Book Consultation</span>
                        </a>
                    </div>
                </div>

                <div className="vacc_hero_glass_sidebar">
                    {sidebarItems.map((item, i) => (
                        <div 
                            key={i} 
                            className={`vacc_stat_card_pro pro_reveal ${item.highlight ? 'vacc_highlight_card' : ''}`}
                            style={{'--delay': item.delay}}
                        >
                            <div className="vacc_card_glow"></div>
                            <div className="vacc_card_inner">
                                <div className="vacc_stat_icon_pro">
                                    <div className="icon_bg_blur"></div>
                                    {item.icon}
                                </div>
                                <div className="vacc_stat_info_pro">
                                    <strong>{item.title}</strong>
                                    <span>{item.desc}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VaccinationHero;
