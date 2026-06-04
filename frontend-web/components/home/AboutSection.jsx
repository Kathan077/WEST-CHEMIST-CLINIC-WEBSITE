"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './AboutSection.css';

const features = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        text: 'Over 20 years of trusted healthcare experience in Northampton, UK',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        text: 'Experienced pharmacists and dedicated healthcare professionals',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
            </svg>
        ),
        text: 'Prescription medicines, travel vaccinations, weight management, and specialist services',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
        ),
        text: 'Patient-focused care designed around your healthcare needs',
    },
];

export default function AboutSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('ab_visible');
                    io.unobserve(e.target);
                }
            }),
            { threshold: 0.12 }
        );
        const els = sectionRef.current?.querySelectorAll('.ab_reveal') ?? [];
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <section className="about_section" ref={sectionRef}>
            {/* decorative orb */}
            <div className="about_orb" aria-hidden="true"></div>

            <div className="about_container">

                {/* ── Left: Image column ── */}
                <div className="about_image_col ab_reveal" style={{ '--delay': '0ms' }}>
                    <div className="about_img_frame">
                        {/* Floating accent badge */}
                        <div className="img_badge">
                            <span className="img_badge_num">20+</span>
                            <span className="img_badge_label">Years<br/>of Care</span>
                        </div>

                        {/* Floating stats card */}
                        <div className="img_stat_card">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <div>
                                <div className="img_stat_num">Open Daily</div>
                                <div className="img_stat_label">Inc. Sat & Sun</div>
                            </div>
                        </div>

                        {/* Decorative ring */}
                        <div className="img_ring img_ring_1"></div>
                        <div className="img_ring img_ring_2"></div>

                        <img
                             src="/images/about-pharmacist.jpg"
                             alt="West Chemist Clinic pharmacist"
                             className="about_img"
                        />

                        {/* Image overlay gradient */}
                        <div className="img_overlay"></div>
                    </div>
                </div>

                {/* ── Right: Content column ── */}
                <div className="about_content_col">
                    <div className="ab_reveal" style={{ '--delay': '80ms' }}>
                        <span className="about_eyebrow">Who We Are</span>
                    </div>

                    <h2 className="about_title ab_reveal" style={{ '--delay': '160ms' }}>
                        Why Choose <span className="about_title_accent">West Chemist Clinic</span>?
                    </h2>

                    <p className="about_desc ab_reveal" style={{ '--delay': '240ms' }}>
                        <strong>West Chemist Clinic</strong> has proudly served the community for over 20 years,
                        providing trusted healthcare services with a strong focus on prescription medicines,
                        vaccinations, and personalized patient care. Our experienced healthcare professionals
                        are committed to delivering timely, reliable, and compassionate support for every patient.
                    </p>

                    <p className="about_desc ab_reveal" style={{ '--delay': '300ms' }}>
                        We understand that managing your health can sometimes feel overwhelming, which is why
                        our team is dedicated to supporting you and your family with expert guidance at every stage of life.
                    </p>

                    {/* Feature list */}
                    <ul className="about_features">
                        {features.map((f, i) => (
                            <li key={i} className="ab_feature ab_reveal" style={{ '--delay': `${380 + i * 80}ms` }}>
                                <div className="feature_icon">{f.icon}</div>
                                <span>{f.text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className="about_cta ab_reveal" style={{ '--delay': '740ms' }}>
                        <Link href="/about" className="about_btn primary_btn">
                            <span>More About Us</span>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </Link>
                        <Link href="/contact" className="about_btn outline_btn">
                            <span>Contact Us</span>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
