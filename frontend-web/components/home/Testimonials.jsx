"use client";

import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '@/config';
import './Testimonials.css';

const DEFAULT_REVIEWS = [
    {
        id: "1",
        name: "Jennifer",
        role: "Verified Patient • 3 reviews",
        text: "Been with West's for many years, they helped make caring for my grandparents easier and now I'm house bound they help me too. The delivery staff are excellent, genuinely decent human beings, compassionate and friendly, all too rare these days.",
        rating: 5,
        service: "Delivery Service"
    },
    {
        id: "2",
        name: "Charlotte Pattison",
        role: "Verified Patient • 1 review",
        text: "I've been using West Chemist for atleast 8-10 years, and they are probably the best chemist I've ever been to. The care they provide is unmatched, nothing is ever too much trouble. Genuinely great service.",
        rating: 5,
        service: "General Pharmacy"
    },
    {
        id: "3",
        name: "Rushmi Sethi",
        role: "Local Guide • 78 reviews",
        text: "Excellent customer service and spacious. Clean and tidy Chemist that offered an efficient prescription collection service. Highly recommend.",
        rating: 5,
        service: "Travel & Prescriptions"
    }
];

export default function Testimonials() {
    const sectionRef = useRef(null);
    const [testData, setTestData] = useState({
        title: 'Trusted by our Community',
        subtitle: 'Patient Feedback',
        desc: 'Experience clinical excellence delivered with genuine care. Read what our patients say about their experience at West Chemist Clinic.',
        reviews: DEFAULT_REVIEWS
    });

    useEffect(() => {
        const loadCMS = async () => {
            try {
                const res = await fetch(`${API_URL}/api/homepage`);
                const json = await res.json();
                if (json.success && json.data && json.data.testimonials) {
                    const sec = json.data.testimonials;
                    setTestData({
                        title: sec.title || 'Trusted by our Community',
                        subtitle: sec.subtitle || 'Patient Feedback',
                        desc: sec.desc || '',
                        reviews: (sec.reviews && sec.reviews.length > 0) ? sec.reviews : DEFAULT_REVIEWS
                    });
                }
            } catch (err) {
                console.error("Failed to load testimonials CMS data:", err);
            }
        };
        loadCMS();
    }, []);

    // Scroll reveal observer
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('t_visible');
                    io.unobserve(e.target);
                }
            }),
            { threshold: 0.15 }
        );

        const els = sectionRef.current?.querySelectorAll('.t_reveal') ?? [];
        els.forEach((el) => io.observe(el));

        return () => io.disconnect();
    }, [testData]);

    return (
        <section className="testimonials_section" ref={sectionRef}>
            {/* Hospital-style cross background pattern */}
            <div className="t_medical_pattern"></div>
            
            <div className="t_container">
                <div className="t_header t_reveal" style={{ '--delay': '0ms' }}>
                    <div className="t_badge_wrap">
                        <span className="t_medical_cross"></span>
                        <span className="t_eyebrow">{testData.subtitle}</span>
                    </div>
                    <h2 className="t_title">
                        {testData.title?.split('Community')[0]}
                        {testData.title?.includes('Community') && (
                            <span className="t_accent">Community</span>
                        )}
                        {testData.title?.split('Community')[1]}
                    </h2>
                    <p className="t_desc">
                        {testData.desc}
                    </p>
                </div>

                <div className="t_grid">
                    {testData.reviews.map((r, i) => (
                        <div 
                            key={r._id || r.id} 
                            className="t_card t_reveal" 
                            style={{ '--delay': `${150 + i * 150}ms` }}
                        >
                            {/* Top row: stars + service badge */}
                            <div className="t_card_header">
                                <div className="t_stars">
                                    {[...Array(r.rating || 5)].map((_, idx) => (
                                        <svg key={idx} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                    ))}
                                </div>
                                <div className="t_service_tag">{r.service || 'Clinical Service'}</div>
                            </div>

                            <p className="t_review_text">"{r.text}"</p>

                            <div className="t_patient_info">
                                <div className="t_patient_meta">
                                    <div className="t_name">{r.name}</div>
                                    <div className="t_role_wrap">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span className="t_role">{r.role}</span>
                                    </div>
                                </div>
                                {/* Clean abstract quote icon */}
                                <div className="t_quote_icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--primary)" opacity="0.1">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.433.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
