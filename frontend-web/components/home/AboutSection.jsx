"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
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
    ctaUrl: '/about',
    secondaryCtaText: 'Contact Us',
    secondaryCtaUrl: '/contact'
};

const ICON_PATHS = {
    heart: { paths: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'], vb: '0 0 24 24' },
    activity: { paths: ['M22 12h-4l-3 9L9 3l-3 9H2'], vb: '0 0 24 24' },
    stethoscope: { paths: ['M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3', 'M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4'], vb: '0 0 24 24' },
    thermometer: { paths: ['M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z'], vb: '0 0 24 24' },
    droplet: { paths: ['M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13s-7 8.7-7 13a7 7 0 0 0 7 7z'], vb: '0 0 24 24' },
    eye: { paths: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'], vb: '0 0 24 24' },
    brain: { paths: ['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.73A3 3 0 0 1 3.34 9a2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.84-2.76Z', 'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.73 3 3 0 0 0 2.13-5.27 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.84-2.76Z'], vb: '0 0 24 24' },
    shield: { paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'], vb: '0 0 24 24' },
    cross: { paths: ['M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z'], vb: '0 0 24 24' },
    hospital: { paths: ['M12 6v4', 'M14 14h-4', 'M14 18h-4', 'M14 8h-4', 'M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2', 'M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18'], vb: '0 0 24 24' },
    pill: { paths: ['M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5', 'M2 12H10', 'M22 12H14', 'M13.5 4H20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.5'], vb: '0 0 24 24' },
    syringe: { paths: ['m18 2 4 4', 'm17 7 3-3', 'M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 9'], vb: '0 0 24 24' },
    scale: { paths: ['M12 3a1 1 0 0 1 1 1v7.5a.5.5 0 0 1-1 0V4a1 1 0 0 1-1-1Z', 'M3 14a9 9 0 1 0 18 0'], vb: '0 0 24 24' },
    award: { paths: ['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'M8.21 13.89 7 23l5-3 5 3-1.21-9.12'], vb: '0 0 24 24' },
    medal: { paths: ['M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 3.8A2 2 0 0 1 6 3h12a2 2 0 0 1 1.6.8l1.6 1.14a2 2 0 0 1 .14 2.2L16.79 15', 'M11 12 5.12 2.2', 'M13 12l5.88-9.8', 'M8 7h8', 'M12 15v6', 'M9 18h6'], vb: '0 0 24 24' },
    star: { paths: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'], vb: '0 0 24 24' },
    trophy: { paths: ['M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16', 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 19.75 7 21.24 7 22', 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 19.75 17 21.24 17 22', 'M18 2H6v7a6 6 0 0 0 12 0V2Z'], vb: '0 0 24 24' },
    check_circle: { paths: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M9 11l3 3L22 4'], vb: '0 0 24 24' },
    thumbsup: { paths: ['M7 10v12 M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z'], vb: '0 0 24 24' },
    clock: { paths: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 6v6l4 2'], vb: '0 0 24 24' },
    calendar: { paths: ['M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z'], vb: '0 0 24 24' },
    timer: { paths: ['M10 2h4', 'M12 14l4-4', 'M4.6 11a8 8 0 1 0 16.4 4.7 8 8 0 0 0-16.4-4.7Z'], vb: '0 0 24 24' },
    sunrise: { paths: ['M12 2v8', 'M4.93 10.93l1.41 1.41', 'M2 18h2', 'M20 18h2', 'M19.07 10.93l-1.41 1.41', 'M22 22H2', 'M16 6l-4 4-4-4', 'M12 18a6 6 0 0 0 0-12v0'], vb: '0 0 24 24' },
    dumbbell: { paths: ['M14.4 14.4 9.6 9.6', 'M18.657 5.343a4 4 0 0 1 0 5.657l-1.414 1.414a4 4 0 0 1-5.657-5.657l1.414-1.414a4 4 0 0 1 5.657 0Z', 'M5.343 18.657a4 4 0 0 1 0-5.657l1.414-1.414a4 4 0 0 1 5.657 5.657l-1.414 1.414a4 4 0 0 1-5.657 0Z'], vb: '0 0 24 24' },
    moon: { paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'], vb: '0 0 24 24' },
    sun: { paths: ['M12 2v2', 'M12 20v2', 'm4.93 4.93-1.41 1.41', 'm16.95 16.95-1.41 1.41', 'M2 12h2', 'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41', 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z'], vb: '0 0 24 24' },
    flame: { paths: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'], vb: '0 0 24 24' },
    apple: { paths: ['M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z', 'M10 2c1 .5 2 2 2 5'], vb: '0 0 24 24' },
    leaf: { paths: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'], vb: '0 0 24 24' },
    calculator: { paths: ['M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Z', 'M8 7h8', 'M8 11h8', 'M8 15h5'], vb: '0 0 24 24' },
    zap: { paths: ['M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'], vb: '0 0 24 24' },
    info: { paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 16v-4', 'M12 8h.01'], vb: '0 0 24 24' },
    globe: { paths: ['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'], vb: '0 0 24 24' },
    users: { paths: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'], vb: '0 0 24 24' },
    book: { paths: ['M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20'], vb: '0 0 24 24' }
};

const getFeatureIcon = (iconName) => {
    const item = ICON_PATHS[iconName] || ICON_PATHS.heart;
    return (
        <svg viewBox={item.vb} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {item.paths.map((p, idx) => (
                <path key={idx} d={p} />
            ))}
        </svg>
    );
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
                        ctaUrl: sec.ctaUrl || DEFAULT_ABOUT.ctaUrl,
                        secondaryCtaText: sec.secondaryCtaText || DEFAULT_ABOUT.secondaryCtaText,
                        secondaryCtaUrl: sec.secondaryCtaUrl || DEFAULT_ABOUT.secondaryCtaUrl
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
                             src={getImageUrl(aboutData.image) || aboutData.image || null}
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
                        <Link href={aboutData.secondaryCtaUrl || "/contact"} className="about_btn outline_btn">
                            <span>{aboutData.secondaryCtaText || "Contact Us"}</span>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
