"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
import './Hero.css';

// Fixed particle seed — same on server AND client (no Math.random at render time)
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    x:     `${(i * 5.73 + 3.1) % 100}%`,
    d:     `${4 + (i % 7) * 1.7}s`,
    delay: `${(i * 1.3) % 8}s`,
    size:  `${2 + (i % 4) * 0.9}px`,
    op:    `${0.2 + (i % 5) * 0.1}`,
}));

/* Shared SVG icon renderer — covers every key in the admin picker library */
const TI = (paths, s = 14) => (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        {(Array.isArray(paths) ? paths : [paths]).map((p, i) => <path key={i} d={p} />)}
    </svg>
);

const TOOL_ICONS = {
    heart:        TI('M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'),
    heartbeat:    TI('M22 12h-4l-3 9L9 3l-3 9H2'),
    activity:     TI('M22 12h-4l-3 9L9 3l-3 9H2'),
    stethoscope:  TI(['M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3', 'M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4']),
    thermometer:  TI('M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z'),
    droplet:      TI('M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13s-7 8.7-7 13a7 7 0 0 0 7 7z'),
    brain:        TI(['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.73A3 3 0 0 1 3.34 9a2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.84-2.76Z','M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.73 3 3 0 0 0 2.13-5.27 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.84-2.76Z']),
    eye:          TI(['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z']),
    bone:         TI('M18.5 5.5a4.5 4.5 0 0 1 0 6.364L12 18.364l-1.414-1.414 6.364-6.364a2.5 2.5 0 0 0-3.536-3.536L7 13.364l-1.414-1.414L11.95 5.586a4.5 4.5 0 0 1 6.55-.086zM5.5 18.5a4.5 4.5 0 0 1 0-6.364L12 5.636l1.414 1.414L7.05 13.414a2.5 2.5 0 0 0 3.536 3.536L17 10.636l1.414 1.414L12.05 18.414a4.5 4.5 0 0 1-6.55.086z'),
    lungs:        TI(['M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2', 'M20 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2', 'M12 2v10', 'M6 12a6 6 0 0 0 6 6 6 6 0 0 0 6-6']),
    pill:         TI(['M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5','M2 12H10','M22 12H14','M13.5 4H20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.5']),
    syringe:      TI(['m18 2 4 4','m17 7 3-3','M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 9']),
    bandage:      TI(['M10 10.01V10','M14 14.01V14','m14.5 9.5-5 5','M8.5 8.5A2.5 2.5 0 0 0 6 11v2a2.5 2.5 0 0 0 5 0V11a2.5 2.5 0 0 0-2.5-2.5Z']),
    cross:        TI('M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z'),
    hospital:     TI(['M12 6v4','M14 14h-4','M14 18h-4','M14 8h-4','M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2','M18 22V4a2 2 0 0 0-2 2H8a2 2 0 0 0-2 2v18']),
    clipboard:    TI(['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2','M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z']),
    microscope:   TI(['M6 18h8','M3 22h18','M14 22a7 7 0 1 0 0-14h-1','M9 14h.01','M9 3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z','M9 7l1 3h2l1-3']),
    shield:       TI('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'),
    dna:          TI(['M2 15c6.667-6 13.333 0 20-6','M2 9c6.667 6 13.333 0 20 6','M2 12h20','M2 18h20','M2 6h20']),
    virus:        TI(['M12 8a4 4 0 0 0 0 8 4 4 0 0 0 0-8Z','M12 2v2.5','M12 19.5V22','M4.93 4.93l1.77 1.77','M17.3 17.3l1.77 1.77','M2 12h2.5','M19.5 12H22','M4.93 19.07l1.77-1.77','M17.3 6.7l1.77-1.77']),
    scale:        TI(['M12 3a1 1 0 0 1 1 1v7.5a.5.5 0 0 1-1 0V4a1 1 0 0 1-1-1Z','M3 14a9 9 0 1 0 18 0']),
    dumbbell:     TI(['M14.4 14.4 9.6 9.6','M18.657 5.343a4 4 0 0 1 0 5.657l-1.414 1.414a4 4 0 0 1-5.657-5.657l1.414-1.414a4 4 0 0 1 5.657 0Z','M5.343 18.657a4 4 0 0 1 0-5.657l1.414-1.414a4 4 0 0 1 5.657 5.657l-1.414 1.414a4 4 0 0 1-5.657 0Z']),
    bike:         TI(['M5.5 17a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z','M13 17a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z','M8 17V5l7 3 3 3h1','M8 12H5']),
    footprints:   TI(['M4 16v-2.38C4 11.5 2.97 10.63 3 8c.03-2.69 2.16-4.95 4.85-5A5 5 0 0 1 13 8c0 2.38-1 3.5-1 5.5V16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z','M4 20h9','M9 20v1','M6.5 8.5h1']),
    moon:         TI('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'),
    sun:          TI(['M12 2v2','M12 20v2','m4.93 4.93-1.41 1.41','m16.95 16.95-1.41 1.41','M2 12h2','M20 12h2','m6.34 17.66-1.41 1.41','m19.07 4.93-1.41 1.41','M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z']),
    flame:        TI('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'),
    apple:        TI(['M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z','M10 2c1 .5 2 2 2 5']),
    leaf:         TI('M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'),
    salad:        TI(['M7 21h10','M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z','M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.4 2.4 0 0 1 .45 3.56A7 7 0 0 1 12 12Z']),
    calculator:   TI(['M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Z','M8 7h8','M8 11h8','M8 15h5']),
    search:       TI(['M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0']),
    zap:          TI('M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'),
    chart:        TI(['M3 3v18h18','M7 16v-5','M11 16V7','M15 16v-9','M19 16v-3']),
    beaker:       TI(['M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2','M8.5 2h7','M14.5 16h-5']),
    info:         TI(['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z','M12 16v-4','M12 8h.01']),
    alert:        TI(['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01']),
    book:         TI(['M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20']),
    lightbulb:    TI(['M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5','M9 18h6','M10 22h4']),
    question:     TI(['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z','M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3','M12 17h.01']),
    star:         TI('M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'),
    globe:        TI(['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z','M2 12h20','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'])
};

const DEFAULT_SLIDES = [
    {
        id: "1",
        image: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png',
        fallback: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=90',
        badge:   'Expert Healthcare',
        badgeIcon: 'stethoscope',
        words1:  ['Your', 'Health,'],
        words2:  ['Our', 'Priority.'],
        desc:    'Expert pharmaceutical care and professional health advice — all in one trusted pharmacy.',
        cta:     'Book an Appointment',
        ctaUrl:  '/book-appointment',
        secondaryCta: 'Our Services',
        secondaryCtaUrl: '/services',
        overlay: ['rgba(15,4,40,0.70)', 'rgba(15,4,40,0.20)'],
    },
    {
        id: "2",
        image: '/images/8df30593-83e5-4551-ab3b-4b82c1684d55.png',
        fallback: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=1400&q=90',
        badge:   'Travel Vaccinations',
        badgeIcon: 'globe',
        words1:  ['Worry-Free', 'Travel'],
        words2:  ['Starts', 'Here.'],
        desc:    'Walk in for travel vaccination advice and protect yourself before your next trip.',
        cta:     'Explore Vaccines',
        ctaUrl:  '/services',
        secondaryCta: 'Our Services',
        secondaryCtaUrl: '/services',
        overlay: ['rgba(4,25,20,0.70)', 'rgba(4,25,20,0.20)'],
    },
    {
        id: "3",
        image: '/images/e0dc23d6-3cb0-4a6a-9076-058313605f8d.png',
        fallback: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=90',
        badge:   'Weight Loss Programs',
        badgeIcon: 'flame',
        words1:  ['Transform', 'Your'],
        words2:  ['Life', 'Today.'],
        desc:    'Personalised medically-guided weight loss programs designed to give you lasting results.',
        cta:     'Get Started',
        ctaUrl:  '/services',
        secondaryCta: 'Our Services',
        secondaryCtaUrl: '/services',
        overlay: ['rgba(4,12,40,0.70)', 'rgba(4,12,40,0.20)'],
    },
];

const DEFAULT_STATS = [
    { number: '2K+', label: 'Happy Patients' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Satisfaction' }
];

const DURATION = 6000;

export default function Hero() {
    const [slides, setSlides]       = useState(DEFAULT_SLIDES);
    const [stats, setStats]         = useState(DEFAULT_STATS);
    const [active, setActive]       = useState(0);
    const [prev, setPrev]           = useState(null);
    const [dir, setDir]             = useState('next');
    const [animating, setAnimating] = useState(false);
    const [key, setKey]             = useState(0); // re-trigger content anim
    const timer = useRef(null);

    const goTo = useCallback((idx, d = 'next') => {
        if (animating || idx === active) return;
        setAnimating(true);
        setDir(d);
        setPrev(active);
        setActive(idx);
        setKey(k => k + 1);
        setTimeout(() => { setPrev(null); setAnimating(false); }, 1000);
    }, [active, animating]);

    const next = useCallback(() => goTo((active + 1) % slides.length, 'next'), [active, goTo, slides.length]);
    const prev2 = useCallback(() => goTo((active - 1 + slides.length) % slides.length, 'prev'), [active, goTo, slides.length]);

    const resetTimer = useCallback(() => {
        clearInterval(timer.current);
        timer.current = setInterval(next, DURATION);
    }, [next]);

    useEffect(() => {
        timer.current = setInterval(next, DURATION);
        return () => clearInterval(timer.current);
    }, [next]);

    useEffect(() => {
        const loadCMS = async () => {
            try {
                const res = await fetch(`${API_URL}/api/homepage`);
                const json = await res.json();
                if (json.success && json.data) {
                    if (json.data.heroSlides && json.data.heroSlides.length > 0) {
                        setSlides(json.data.heroSlides);
                    }
                    if (json.data.heroStats && json.data.heroStats.length > 0) {
                        setStats(json.data.heroStats);
                    }
                }
            } catch (err) {
                console.error("Failed to load hero CMS data:", err);
            }
        };
        loadCMS();
    }, []);

    // Touch swipe
    const touchX = useRef(null);
    const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
    const onTouchEnd   = (e) => {
        if (touchX.current === null) return;
        const dx = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) { dx > 0 ? next() : prev2(); resetTimer(); }
        touchX.current = null;
    };

    return (
        <section className="hero" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-label="Hero slider">

            {/* ── PARTICLES ── */}
            <div className="hero_particles" aria-hidden="true">
            {PARTICLES.map((p, i) => (
                    <span key={i} className="particle" style={{
                        '--x':     p.x,
                        '--d':     p.d,
                        '--delay': p.delay,
                        '--size':  p.size,
                        '--op':    p.op,
                    }} />
                ))}
            </div>

            {/* ── SLIDES ── */}
            {slides.map((slide, i) => {
                const isActive = i === active;
                const isPrev   = i === prev;
                let cls = 'hero_slide';
                if (isActive) cls += ` slide_in_${dir}`;
                else if (isPrev) cls += ` slide_out_${dir}`;
                else cls += ' slide_hidden';
                return (
                    <div key={slide._id || slide.id} className={cls} aria-hidden={!isActive}>
                        <img
                            src={getImageUrl(slide.image) || slide.fallback || null}
                            alt=""
                            className="slide_img"
                            onError={(e) => { e.target.src = slide.fallback; }}
                        />
                        <div
                            className="slide_overlay"
                            style={{ background: `linear-gradient(110deg, ${slide.overlay?.[0] || 'rgba(15,4,40,0.70)'} 0%, ${slide.overlay?.[1] || 'rgba(15,4,40,0.20)'} 100%)` }}
                        />
                    </div>
                );
            })}

            {/* ── CENTERED CONTENT (outside slides so it animates independently) ── */}
            {slides[active] && (
                <div className="hero_content" key={key}>
                    <div className="c_badge">
                        {slides[active].badgeIcon && TOOL_ICONS[slides[active].badgeIcon] ? (
                            <span style={{ color: '#00e0b8', display: 'flex', alignItems: 'center' }}>
                                {TOOL_ICONS[slides[active].badgeIcon]}
                            </span>
                        ) : (
                            <span className="badge_dot" />
                        )}
                        {slides[active].badge}
                    </div>

                    <h1 className="c_title">
                        <span className="title_row">
                            {slides[active].words1?.map((w, i) => (
                                <span key={i} className="word_wrap">
                                    <span className="word" style={{ '--wi': i }}>{w}</span>
                                </span>
                            ))}
                        </span>
                        <span className="title_row accent_row">
                            {slides[active].words2?.map((w, i) => (
                                <span key={i} className="word_wrap">
                                    <span className="word accent_word" style={{ '--wi': (slides[active].words1?.length || 0) + i }}>{w}</span>
                                </span>
                            ))}
                        </span>
                    </h1>

                    <p className="c_desc">{slides[active].desc}</p>

                    <div className="c_cta">
                        <Link href={slides[active].ctaUrl || "/book-appointment"} className="hero_btn primary_btn">
                            <span>{slides[active].cta}</span>
                            <svg className="btn_arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>
                        <Link href={slides[active].secondaryCtaUrl || "/services"} className="hero_btn outline_btn">
                            <span>{slides[active].secondaryCta || "Our Services"}</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* ── STATS ── */}
            <div className="hero_stats">
                {stats.map((st, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <div className="stat_divider" />}
                        <div className="stat_item">
                            <span className="stat_num">{st.number}</span>
                            <span className="stat_label">{st.label}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {/* ── ARROWS ── */}
            <button className="slider_btn btn_prev" onClick={() => { prev2(); resetTimer(); }} aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="slider_btn btn_next" onClick={() => { next(); resetTimer(); }} aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            {/* ── PROGRESS ── */}
            <div className="progress_bar"><div className="progress_fill" key={active} /></div>

        </section>
    );
}
