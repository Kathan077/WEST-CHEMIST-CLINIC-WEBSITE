"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { API_URL } from '@/config';
import './AboutSection.css';

const DEFAULT_ABOUT = {
    title: 'Why Choose West Chemist Clinic?',
    subtitle: 'WHO WE ARE',
    desc: 'West Chemist Clinic has proudly served the community for over 20 years, providing trusted healthcare services with a strong focus on prescription medicines, vaccinations, and personalized patient care. Our experienced healthcare professionals are committed to delivering timely, reliable, and compassionate support for every patient.',
    image: '/images/about-pharmacist.jpg',
    yearsExperience: '20+',
    experienceLabel: 'Years of Care',
    features: [
        { icon: 'award', title: 'Accredited Experience', desc: 'Over 20 years of trusted healthcare experience in Northampton, UK' },
        { icon: 'users', title: 'Professional Team', desc: 'Experienced pharmacists and dedicated healthcare professionals' },
        { icon: 'check-square', title: 'Broad Offerings', desc: 'Prescription medicines, travel vaccinations, weight management, and specialist services' },
        { icon: 'heart', title: 'Focused Care', desc: 'Patient-focused care designed around your healthcare needs' }
    ],
    ctaText: 'More About Us',
    ctaUrl: '/about'
};

const getFeatureIcon = (iconName) => {
    switch (iconName) {
        case 'award':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            );
        case 'users':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            );
        case 'check-square':
        case 'clock':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                </svg>
            );
        case 'heart':
        case 'shield':
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            );
    }
};

export default function AboutSection() {
    const sectionRef = useRef(null);
    const [aboutData, setAboutData] = useState(DEFAULT_ABOUT);

    useEffect(() => {
        const loadCMS = async () => {
            try {
                const res = await fetch(`${API_URL}/api/homepage`);
                const json = await res.json();
                if (json.success && json.data && json.data.aboutSection) {
                    const sec = json.data.aboutSection;
                    // Format correctly if features fields map to title/desc
                    const formattedFeatures = (sec.features && sec.features.length > 0)
                        ? sec.features.map(f => ({ icon: f.icon, text: f.desc || f.title }))
                        : DEFAULT_ABOUT.features;

                    setAboutData({
                        title: sec.title || DEFAULT_ABOUT.title,
                        subtitle: sec.subtitle || DEFAULT_ABOUT.subtitle,
                        desc: sec.desc || DEFAULT_ABOUT.desc,
                        image: sec.image || DEFAULT_ABOUT.image,
                        yearsExperience: sec.yearsExperience || DEFAULT_ABOUT.yearsExperience,
                        experienceLabel: sec.experienceLabel || DEFAULT_ABOUT.experienceLabel,
                        features: formattedFeatures,
                        ctaText: sec.ctaText || DEFAULT_ABOUT.ctaText,
                        ctaUrl: sec.ctaUrl || DEFAULT_ABOUT.ctaUrl
                    });
                }
            } catch (err) {
                console.error("Failed to load about CMS details:", err);
            }
        };
        loadCMS();
    }, []);

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
    }, [aboutData]);

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
                            <span className="img_badge_num">{aboutData.yearsExperience}</span>
                            <span className="img_badge_label">{aboutData.experienceLabel?.split(' ').slice(0,2).join(' ')}<br/>{aboutData.experienceLabel?.split(' ').slice(2).join(' ')}</span>
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
                             src={aboutData.image}
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
                        <span className="about_eyebrow">{aboutData.subtitle}</span>
                    </div>

                    <h2 className="about_title ab_reveal" style={{ '--delay': '160ms' }}>
                        {aboutData.title?.split('West Chemist Clinic')[0]}
                        {aboutData.title?.includes('West Chemist Clinic') && (
                            <span className="about_title_accent">West Chemist Clinic</span>
                        )}
                        {aboutData.title?.split('West Chemist Clinic')[1]}
                    </h2>

                    <p className="about_desc ab_reveal" style={{ '--delay': '240ms' }}>
                        {aboutData.desc}
                    </p>

                    {/* Feature list */}
                    <ul className="about_features">
                        {aboutData.features.map((f, i) => (
                            <li key={i} className="ab_feature ab_reveal" style={{ '--delay': `${380 + i * 80}ms` }}>
                                <div className="feature_icon">{getFeatureIcon(f.icon)}</div>
                                <span>{f.text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className="about_cta ab_reveal" style={{ '--delay': '740ms' }}>
                        <Link href={aboutData.ctaUrl || "/about"} className="about_btn primary_btn">
                            <span>{aboutData.ctaText}</span>
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
