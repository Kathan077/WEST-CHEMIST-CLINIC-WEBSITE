"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import './Hero.css';

// Fixed particle seed — same on server AND client (no Math.random at render time)
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    x:     `${(i * 5.73 + 3.1) % 100}%`,
    d:     `${4 + (i % 7) * 1.7}s`,
    delay: `${(i * 1.3) % 8}s`,
    size:  `${2 + (i % 4) * 0.9}px`,
    op:    `${0.2 + (i % 5) * 0.1}`,
}));

const slides = [
    {
        id: 1,
        image: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png',
        fallback: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=90',
        badge:   '✦ Expert Healthcare',
        words1:  ['Your', 'Health,'],
        words2:  ['Our', 'Priority.'],
        desc:    'Expert pharmaceutical care and specialist health advice — all in one trusted clinic.',
        cta:     'Book an Appointment',
        overlay: ['rgba(15,4,40,0.70)', 'rgba(15,4,40,0.20)'],
    },
    {
        id: 2,
        image: '/images/8df30593-83e5-4551-ab3b-4b82c1684d55.png',
        fallback: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=1400&q=90',
        badge:   '✈ Travel Vaccinations',
        words1:  ['Worry-Free', 'Travel'],
        words2:  ['Starts', 'Here.'],
        desc:    'Walk in for specialist travel vaccination advice and protect yourself before your next trip.',
        cta:     'Explore Vaccines',
        overlay: ['rgba(4,25,20,0.70)', 'rgba(4,25,20,0.20)'],
    },
    {
        id: 3,
        image: '/images/e0dc23d6-3cb0-4a6a-9076-058313605f8d.png',
        fallback: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=90',
        badge:   '⚡ Weight Loss Programs',
        words1:  ['Transform', 'Your'],
        words2:  ['Life', 'Today.'],
        desc:    'Personalised medically-guided weight loss programs designed to give you lasting results.',
        cta:     'Get Started',
        overlay: ['rgba(4,12,40,0.70)', 'rgba(4,12,40,0.20)'],
    },
];

const DURATION = 6000;

export default function Hero() {
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

    const next = useCallback(() => goTo((active + 1) % slides.length, 'next'), [active, goTo]);
    const prev2 = useCallback(() => goTo((active - 1 + slides.length) % slides.length, 'prev'), [active, goTo]);

    const resetTimer = useCallback(() => {
        clearInterval(timer.current);
        timer.current = setInterval(next, DURATION);
    }, [next]);

    useEffect(() => {
        timer.current = setInterval(next, DURATION);
        return () => clearInterval(timer.current);
    }, [next]);

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
                    <div key={slide.id} className={cls} aria-hidden={!isActive}>
                        <img
                            src={slide.image}
                            alt=""
                            className="slide_img"
                            onError={(e) => { e.target.src = slide.fallback; }}
                        />
                        <div
                            className="slide_overlay"
                            style={{ background: `linear-gradient(110deg, ${slide.overlay[0]} 0%, ${slide.overlay[1]} 100%)` }}
                        />
                    </div>
                );
            })}

            {/* ── CENTERED CONTENT (outside slides so it animates independently) ── */}
            <div className="hero_content" key={key}>
                <div className="c_badge">
                    <span className="badge_dot" />
                    {slides[active].badge}
                </div>

                <h1 className="c_title">
                    <span className="title_row">
                        {slides[active].words1.map((w, i) => (
                            <span key={i} className="word_wrap">
                                <span className="word" style={{ '--wi': i }}>{w}</span>
                            </span>
                        ))}
                    </span>
                    <span className="title_row accent_row">
                        {slides[active].words2.map((w, i) => (
                            <span key={i} className="word_wrap">
                                <span className="word accent_word" style={{ '--wi': slides[active].words1.length + i }}>{w}</span>
                            </span>
                        ))}
                    </span>
                </h1>

                <p className="c_desc">{slides[active].desc}</p>

                <div className="c_cta">
                    <Link href="/book-appointment" className="hero_btn primary_btn">
                        <span>{slides[active].cta}</span>
                        <svg className="btn_arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </Link>
                    <Link href="/services" className="hero_btn outline_btn">
                        <span>Our Services</span>
                    </Link>
                </div>
            </div>

            {/* ── STATS ── */}
            <div className="hero_stats">
                {[['2K+','Happy Patients'],['15+','Years Experience'],['98%','Satisfaction']].map(([n, l], i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <div className="stat_divider" />}
                        <div className="stat_item">
                            <span className="stat_num">{n}</span>
                            <span className="stat_label">{l}</span>
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

            {/* ── DOTS ── */}
          

            {/* ── PROGRESS ── */}
            <div className="progress_bar"><div className="progress_fill" key={active} /></div>

         

        </section>
    );
}
