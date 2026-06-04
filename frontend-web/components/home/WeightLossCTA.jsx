"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './WeightLossCTA.css';

export default function WeightLossCTA() {
    const sectionRef = useRef(null);

    // Initial scroll reveal observers
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('wl_visible');
                    io.unobserve(e.target);
                }
            }),
            { threshold: 0.15 }
        );

        const els = sectionRef.current?.querySelectorAll('.wl_reveal') ?? [];
        els.forEach((el) => io.observe(el));

        return () => io.disconnect();
    }, []);

    // 3D parallax for picture
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 8; 
        const rotateY = ((x - centerX) / centerX) * -8;

        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
    };

    const resetMove = (e) => {
        const card = e.currentTarget;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    };

    return (
        <section className="wl_section" ref={sectionRef}>
            <div className="wl_container">
                
                {/* ── Left Content Box ── */}
                <div className="wl_content">
                    <h2 className="wl_title wl_reveal" style={{ '--delay': '0ms' }}>
                        Take the First Step <span className="wl_title_accent">Toward Better Health</span>
                    </h2>
                    
                    <div className="wl_actions wl_reveal" style={{ '--delay': '150ms' }}>
                        <Link href="/book-appointment" className="wl_btn wl_btn_solid">
                            Book Free Consultation
                        </Link>
                    </div>

                    <p className="wl_desc wl_reveal" style={{ '--delay': '300ms' }}>
                        Looking to achieve your weight loss goals? Begin your journey today with 
                        expert guidance and personalized care from our healthcare professionals.
                    </p>

                    <ul className="wl_list wl_reveal" style={{ '--delay': '450ms' }}>
                        <li>Personalized expert support</li>
                        <li>In-person or secure online consultations available</li>
                        <li>Flexible appointment options, including evening slots</li>
                    </ul>
                </div>

                {/* ── Right Image Box ── */}
                <div 
                    className="wl_image_box wl_reveal" 
                    style={{ '--delay': '200ms' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={resetMove}
                >
                    <div className="wl_image_inner">
                        <img 
                            src="/images/e0dc23d6-3cb0-4a6a-9076-058313605f8d.png" 
                            alt="Weight Loss Consultation" 
                            className="wl_img" 
                        />
                        
                        {/* ── Floating Badges ── */}
                        
                        {/* Dumbbell bubble */}
                        <div className="wl_badge bubble_purple_1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="6" y1="5" x2="6" y2="19"/>
                                <line x1="18" y1="5" x2="18" y2="19"/>
                                <line x1="6" y1="12" x2="18" y2="12"/>
                                <rect x="2" y="8" width="4" height="8" rx="1"/>
                                <rect x="18" y="8" width="4" height="8" rx="1"/>
                            </svg>
                        </div>

                        {/* Weight scale bubble */}
                        <div className="wl_badge bubble_purple_2">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2"/>
                                <path d="M12 9v4"/>
                                <path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                            </svg>
                        </div>

                        {/* Book Now Red Badge */}
                        <Link href="/book-appointment" className="wl_badge red_badge">
                            <span className="red_badge_lg">Book</span>
                            <span className="red_badge_sm">Now</span>
                        </Link>


                        
                    </div>
                </div>

            </div>
        </section>
    );
}
