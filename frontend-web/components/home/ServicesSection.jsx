"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
import './ServicesSection.css';

const DEFAULT_INTRO = {
    title: 'Expert Healthcare for Better Care & Healthy Living',
    subtitle: 'Our Services',
    desc: 'Discover top-tier pharmaceutical care, from travel vaccines to personalised weight loss guidance.'
};

const getServiceColor = (colorName) => {
    switch (colorName) {
        case 'blue':
            return 'var(--primary)';
        case 'emerald':
        case 'teal':
        case 'pine':
            return 'var(--secondary)';
        case 'indigo':
            return 'var(--accent)';
        case 'purple':
            return 'var(--highlight-purple)';
        default:
            return 'var(--primary)';
    }
};

const getServiceLink = (slug) => {
    if (!slug) return '#';
    const s = slug.toLowerCase();
    if (s === 'weight-loss' || s === 'weight-loss-management-service') return '/weight-loss';
    if (s === 'vaccinations' || s === 'travel-clinic') return '/vaccination';
    return `/services/${slug}`;
};

export default function ServicesSection() {
    const sectionRef = useRef(null);
    const [intro, setIntro] = useState(DEFAULT_INTRO);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const loadCMS = async () => {
            try {
                // Load header info
                const resHome = await fetch(`${API_URL}/api/homepage`);
                const jsonHome = await resHome.json();
                if (jsonHome.success && jsonHome.data && jsonHome.data.servicesSection) {
                    setIntro({
                        title: jsonHome.data.servicesSection.title || DEFAULT_INTRO.title,
                        subtitle: jsonHome.data.servicesSection.subtitle || DEFAULT_INTRO.subtitle,
                        desc: jsonHome.data.servicesSection.desc || DEFAULT_INTRO.desc
                    });
                }

                // Load clinical services
                const resSrv = await fetch(`${API_URL}/api/services`);
                const jsonSrv = await resSrv.json();
                if (jsonSrv.success && Array.isArray(jsonSrv.data)) {
                    const homeServices = jsonSrv.data.filter(s => s.onHome);
                    setServices(homeServices);
                }
            } catch (err) {
                console.error("Failed to load services CMS data:", err);
            }
        };
        loadCMS();
    }, []);

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
    }, [services]);

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
                    <span className="ss_eyebrow">{intro.subtitle}</span>
                    <h2 className="ss_title">
                        {intro.title?.includes('Better Care & Healthy Living') ? (
                            <>
                                {intro.title.split('Better Care & Healthy Living')[0]}
                                <span className="ss_title_accent">Better Care & Healthy Living</span>
                                {intro.title.split('Better Care & Healthy Living')[1]}
                            </>
                        ) : intro.title?.includes('We Offer') ? (
                            <>
                                {intro.title.split('We Offer')[0]}
                                <span className="ss_title_accent">We Offer</span>
                                {intro.title.split('We Offer')[1]}
                            </>
                        ) : (
                            intro.title
                        )}
                    </h2>
                    <p className="ss_subtitle">
                        {intro.desc}
                    </p>
                </div>

                {/* ── Services Grid ── */}
                <div className="ss_grid">
                    {services.map((service, i) => (
                        <div
                            key={service._id}
                            className={`ss_card ss_reveal idx_${i}`}
                            style={{ '--delay': `${i * 100}ms`, '--scolor': getServiceColor(service.color) }}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            onMouseLeave={(e) => resetMove(e.currentTarget)}
                        >
                            {/* Inner Wrap - used for 3D preservation */}
                            <div className="ss_card_inner">
                                <div className="ss_img_wrapper">
                                    <img src={getImageUrl(service.img)} alt={service.title} className="ss_img" loading="lazy" />
                                    <div className="ss_img_shimmer" />
                                </div>
                                <div className="ss_content">
                                    <h3 className="ss_card_title">{service.title}</h3>
                                    <p className="ss_card_desc">{service.desc}</p>
                                    
                                    <div className="ss_actions">
                                        <Link href={getServiceLink(service.slug)} className="ss_btn ss_btn_outline">
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
