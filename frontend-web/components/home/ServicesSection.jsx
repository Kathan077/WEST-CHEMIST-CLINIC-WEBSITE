"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './ServicesSection.css';

const services = [
    {
        id: 'weight-loss',
        title: 'Weight Loss',
        img: '/images/e0dc23d6-3cb0-4a6a-9076-058313605f8d.png',
        color: 'var(--primary)',
        desc: 'Personalised medical weight loss programs.'
    },
    {
        id: 'pharmacy-first',
        title: 'Pharmacy First',
        img: '/images/about-pharmacist.jpg',
        color: 'var(--secondary)',
        desc: 'Immediate expert advice and treatment.'
    },
    {
        id: 'ear-microsuction',
        title: 'Ear Microsuction',
        img: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png',
        color: 'var(--accent)',
        desc: 'Safe and effective ear wax removal.'
    },
    {
        id: 'vaccinations',
        title: 'Vaccinations',
        img: '/images/8df30593-83e5-4551-ab3b-4b82c1684d55.png',
        color: 'var(--highlight-purple)',
        desc: 'Comprehensive immunisation services.'
    },
    {
        id: 'travel-clinic',
        title: 'Travel Clinic',
        img: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png',
        color: 'var(--primary)',
        desc: 'Essential vaccines for worry-free travel.'
    },
    {
        id: 'health-checks',
        title: 'Health Checks',
        img: '/images/8df30593-83e5-4551-ab3b-4b82c1684d55.png',
        color: 'var(--accent)',
        desc: 'Comprehensive blood pressure and health screenings.'
    }
];

export default function ServicesSection() {
    const sectionRef = useRef(null);

    // Scroll reveal system
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('ss_visible');
                    io.unobserve(e.target);
                }
            }),
            { threshold: 0.1 }
        );

        const els = sectionRef.current?.querySelectorAll('.ss_reveal') ?? [];
        els.forEach((el) => io.observe(el));

        return () => io.disconnect();
    }, []);

    // GOD LEVEL 3D PARALLAX
    const handleMouseMove = (e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Tilt based on mouse position
        const rotateX = ((y - centerY) / centerY) * 10; 
        const rotateY = ((x - centerX) / centerX) * -10;

        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
    };

    const resetMove = (card) => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    };

    return (
        <section className="ss_section" ref={sectionRef}>
            {/* ── Subtle Background Design ── */}
            <div className="ss_bg_gradient" aria-hidden="true" />
            <div className="ss_bg_pattern" aria-hidden="true" />

            <div className="ss_container">
                {/* ── Header ── */}
                <div className="ss_header ss_reveal">
                    <span className="ss_eyebrow">Our Services</span>
                    <h2 className="ss_title">
                        Expert Healthcare for <span className="ss_title_accent">Better Care & Healthy Living</span>
                    </h2>
                    <p className="ss_subtitle">
                        Discover top-tier pharmaceutical care, from travel vaccines to personalised weight loss guidance.
                    </p>
                </div>

                {/* ── Services Grid ── */}
                <div className="ss_grid">
                    {services.map((service, i) => (
                        <div
                            key={service.id}
                            className={`ss_card ss_reveal idx_${i}`}
                            style={{ '--delay': `${i * 100}ms`, '--scolor': service.color }}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            onMouseLeave={(e) => resetMove(e.currentTarget)}
                        >
                            {/* Inner Wrap - used for 3D preservation */}
                            <div className="ss_card_inner">
                                <div className="ss_img_wrapper">
                                    <img src={service.img} alt={service.title} className="ss_img" loading="lazy" />
                                    <div className="ss_img_shimmer" />
                                </div>
                                <div className="ss_content">
                                    <h3 className="ss_card_title">{service.title}</h3>
                                    <p className="ss_card_desc">{service.desc}</p>
                                    
                                    <div className="ss_actions">
                                        <Link href={`/services/${service.id}`} className="ss_btn ss_btn_outline">
                                            <span>MORE INFO</span>
                                        </Link>
                                        <Link href="/book-appointment" className="ss_btn ss_btn_solid">
                                            <span>BOOK NOW</span>
                                        </Link>
                                    </div>
                                </div>
                                {/* Dynamic light effect */}
                                <div className="ss_card_glare" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Global CTA ── */}
                <div className="ss_bottom_cta ss_reveal" style={{ '--delay': '500ms' }}>
                    <Link href="/services" className="ss_global_btn">
                        <span>VIEW ALL SERVICES</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
