"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { API_URL } from '@/config';
import './HowItWorks.css';

const DEFAULT_HOW = {
    title: 'How Does It All Work?',
    subtitle: 'Simple Process',
    desc: 'From profile setup to securing your clinical slot in just three simple steps.',
    steps: [
        {
            stepNumber: '01',
            icon: 'search',
            title: 'Patient Profile',
            desc: 'Register your personal details, select your preferred clinic location, and choose the clinical or NHS service you need.'
        },
        {
            stepNumber: '02',
            icon: 'shield',
            title: 'Security Verification',
            desc: 'Complete a secure, GPhC-compliant identity check by uploading your passport or driving licence for automated identity verification.'
        },
        {
            stepNumber: '03',
            icon: 'cal',
            title: 'Appointment Scheduler',
            desc: 'Access our live calendar, choose your preferred time slot, and instantly secure your booking with a verified NHS-standard clinical ticket.'
        }
    ]
};

const getStepIcon = (iconName) => {
    switch (iconName) {
        case 'search':
            return (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M46 50v-2a6 6 0 0 0-6-6H24a6 6 0 0 0-6 6v2" />
                    <circle cx="32" cy="24" r="8" />
                    <rect x="8" y="8" width="48" height="48" rx="4" strokeDasharray="4 4" strokeWidth="1.5" />
                </svg>
            );
        case 'shield':
            return (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M32 6s18 4 18 14v12c0 10-18 16-18 16S14 42 14 32V20c0-10 18-14 18-14z"/>
                    <polyline points="24,28 30,34 40,22"/>
                </svg>
            );
        case 'cal':
        default:
            return (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="10" y="14" width="44" height="38" rx="4"/>
                    <line x1="10" y1="26" x2="54" y2="26"/>
                    <line x1="20" y1="14" x2="20" y2="10"/>
                    <line x1="44" y1="14" x2="44" y2="10"/>
                    <circle cx="32" cy="38" r="6" />
                    <polyline points="32,34 32,38 35,41" />
                </svg>
            );
    }
};

const STEP_COLORS = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];

export default function HowItWorks() {
    const sectionRef = useRef(null);
    const lineRef    = useRef(null);
    const [howData, setHowData] = useState(DEFAULT_HOW);

    useEffect(() => {
        const loadCMS = async () => {
            try {
                const res = await fetch(`${API_URL}/api/homepage`);
                const json = await res.json();
                if (json.success && json.data && json.data.howItWorks) {
                    const sec = json.data.howItWorks;
                    setHowData({
                        title: sec.title || DEFAULT_HOW.title,
                        subtitle: sec.subtitle || DEFAULT_HOW.subtitle,
                        desc: sec.desc || DEFAULT_HOW.desc,
                        steps: (sec.steps && sec.steps.length > 0) ? sec.steps : DEFAULT_HOW.steps
                    });
                }
            } catch (err) {
                console.error("Failed to load howItWorks CMS details:", err);
            }
        };
        loadCMS();
    }, []);

    // Scroll reveal + connector line
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('hw_visible');
                    io.unobserve(e.target);
                }
            }),
            { threshold: 0.15 }
        );

        const els = sectionRef.current?.querySelectorAll('.hw_reveal') ?? [];
        els.forEach((el) => io.observe(el));

        return () => io.disconnect();
    }, [howData]);

    // Parallax Mouse Effect
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * -10;

        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
    };

    const resetMove = (e) => {
        const card = e.currentTarget;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    };

    // Magnetic Button Effect
    const handleMagneticMove = (e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) scale(1.05)`;
        btn.querySelector('span').style.transform = `translate3d(${x * 0.1}px, ${y * 0.1}px, 0)`;
    };

    const resetMagnetic = (e) => {
        const btn = e.currentTarget;
        btn.style.transform = '';
        btn.querySelector('span').style.transform = '';
    };

    return (
        <section className="how_section" ref={sectionRef}>

            {/* ── Background decoration ── */}
            <div className="how_bg_blob blob_1" aria-hidden="true"></div>
            <div className="how_bg_blob blob_2" aria-hidden="true"></div>
            <div className="how_light_ray ray_1" aria-hidden="true"></div>
            <div className="how_light_ray ray_2" aria-hidden="true"></div>

            {/* ── Header ── */}
            <div className="how_header hw_reveal">
                <span className="how_eyebrow">{howData.subtitle}</span>
                <h2 className="how_title">
                    {howData.title?.split(" ").map((word, i) => (
                        <span key={i} className="how_title_word" style={{ '--dw': `${i * 100}ms` }}>
                            {word}&nbsp;
                        </span>
                    ))}
                </h2>
                <p className="how_subtitle">
                    {howData.desc}
                </p>
            </div>

            {/* ── Steps grid ── */}
            <div className="how_steps">
                {/* Connector Line */}
                <div className="how_connector" aria-hidden="true">
                    <div className="connector_line" ref={lineRef}></div>
                    {howData.steps.map((_, i) => (
                        <div key={i} className="connector_dot" style={{ '--ci': i }} />
                    ))}
                </div>

                {howData.steps.map((step, i) => (
                    <Link
                        key={step.stepNumber}
                        href="/book-appointment"
                        className="how_card hw_reveal"
                        style={{ '--delay': `${i * 120}ms`, textDecoration: 'none' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={resetMove}
                    >
                        {/* Icon ring */}
                        <div className="step_icon_wrap" style={{ '--c': STEP_COLORS[i % STEP_COLORS.length] }}>
                            <div className="step_pulse"></div>
                            <div className="step_orbit"></div>
                            <div className="step_icon_ring"></div>
                            <div className="step_icon_bg"></div>
                            <div className="step_icon">{getStepIcon(step.icon)}</div>
                        </div>

                        {/* Content */}
                        <h3 className="step_title">{step.title}</h3>
                        <p  className="step_desc">{step.desc}</p>
                        
                        {/* Spotlight */}
                        <div className="card_spotlight"></div>
                    </Link>
                ))}
            </div>

            {/* ── CTA ── */}
            <div className="how_cta hw_reveal" style={{ '--delay': '520ms' }}>
                <Link 
                    href="/book-appointment" 
                    className="how_btn"
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={resetMagnetic}
                >
                    <span>Book an Appointment</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                    </svg>
                </Link>
            </div>

        </section>
    );
}
