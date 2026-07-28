"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
import './WeightLossCTA.css';

const DEFAULT_WL = {
    title: 'Take the First Step Toward Better Health',
    desc: 'Looking to achieve your weight loss goals? Begin your journey today with expert guidance and personalized care from our healthcare professionals.',
    image: '/images/e0dc23d6-3cb0-4a6a-9076-058313605f8d.png',
    ctaText: 'Book Now',
    ctaUrl: '/book-appointment',
    bullets: [
        'Personalized expert support',
        'In-person or secure online consultations available',
        'Flexible appointment options, including evening slots'
    ]
};

export default function WeightLossCTA() {
    const sectionRef = useRef(null);
    const [wlData, setWlData] = useState(DEFAULT_WL);

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
    }, [wlData]);

    useEffect(() => {
        const loadCMS = async () => {
            try {
                const res = await fetch(`${API_URL}/api/homepage`);
                const json = await res.json();
                if (json.success && json.data && json.data.appointmentCta) {
                    const sec = json.data.appointmentCta;
                    setWlData({
                        title: sec.title || DEFAULT_WL.title,
                        desc: sec.desc || DEFAULT_WL.desc,
                        image: sec.image || DEFAULT_WL.image,
                        ctaText: sec.ctaText || DEFAULT_WL.ctaText,
                        ctaUrl: sec.ctaUrl || DEFAULT_WL.ctaUrl,
                        bullets: sec.bullets && sec.bullets.length > 0 ? sec.bullets : DEFAULT_WL.bullets
                    });
                }
            } catch (err) {
                console.error("Failed to load WeightLossCTA CMS details:", err);
            }
        };
        loadCMS();
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
                        {wlData.title?.split('Toward Better Health')[0]}
                        {wlData.title?.includes('Toward Better Health') && (
                            <span className="wl_title_accent">Toward Better Health</span>
                        )}
                        {wlData.title?.split('Toward Better Health')[1]}
                    </h2>
                    
                    <div className="wl_actions wl_reveal" style={{ '--delay': '150ms' }}>
                        <Link href={wlData.ctaUrl || "/book-appointment"} className="wl_btn wl_btn_solid">
                            {wlData.ctaText}
                        </Link>
                    </div>

                    <p className="wl_desc wl_reveal" style={{ '--delay': '300ms' }}>
                        {wlData.desc}
                    </p>

                    {wlData.bullets && wlData.bullets.length > 0 && (
                        <ul className="wl_list wl_reveal" style={{ '--delay': '450ms' }}>
                            {wlData.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                            ))}
                        </ul>
                    )}
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
                            src={getImageUrl(wlData.image) || null} 
                            alt="Weight Loss Consultation" 
                            className="wl_img" 
                        />
                        
                        {/* ── Floating Badges ── */}
                        
                        {/* Book Now Red Badge */}
                        <Link href={wlData.ctaUrl || "/book-appointment"} className="wl_badge red_badge">
                            <span className="red_badge_lg">Book</span>
                            <span className="red_badge_sm">Now</span>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
