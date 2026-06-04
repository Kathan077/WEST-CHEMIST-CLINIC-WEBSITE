"use client";

import React, { useEffect, useRef } from 'react';
import './Testimonials.css';

const reviews = [
    {
        id: 1,
        name: "Jennifer",
        role: "Verified Patient • 3 reviews",
        text: "Been with West's for many years, they helped make caring for my grandparents easier and now I'm house bound they help me too. The delivery staff are excellent, genuinely decent human beings, compassionate and friendly, all too rare these days.",
        rating: 5,
        service: "Delivery Service"
    },
    {
        id: 2,
        name: "Charlotte Pattison",
        role: "Verified Patient • 1 review",
        text: "I've been using West Chemist for atleast 8-10 years, and they are probably the best chemist I've ever been to. The staff are caring, helpful, dint judge and go that extra mile. Honestly cannot fault them at all. Would never want to change to a different regardless of where I'm living. They deserve a medal!!!",
        rating: 5,
        service: "General Pharmacy"
    },
    {
        id: 3,
        name: "Rushmi Sethi",
        role: "Local Guide • 78 reviews",
        text: "Excellent customer service and spacious. Easy to find anything you need. Clean and tidy Chemist that offered an efficient prescription collection service for vulnerable customers of the local GP surgery at The Crescent, such as for the elderly and disabled after it was refurbished. Also offered a vaccination walk-in service - usually better to phone to check availability so their Travel clinic can offer you the best possible customer service.",
        rating: 5,
        service: "Travel & Prescriptions"
    },
    {
        id: 4,
        name: "Gemma Dearsley",
        role: "Local Guide • 15 reviews",
        text: "I cannot recommend the team at West highly enough. As a palliative care nurse being able to get a multitude of medication for our patients, sometimes at late notice is vital. Nothing is ever too much trouble, and they will always deliver if we ask them too. We have never had anything but gold standard service from the team.",
        rating: 5,
        service: "Palliative Care"
    },
    {
        id: 5,
        name: "Dandy Mae",
        role: "Local Guide • 126 reviews",
        text: "Staff have been supportive and amazingly friendly. They have gone above and beyond. When I was feeling particularly low they supported me and made sure I had everything I needed and helped get the medications the doctor prescribed. Gold standard service.",
        rating: 5,
        service: "Patient Support"
    },
    {
        id: 6,
        name: "Tammy York",
        role: "Verified Patient • 5 reviews",
        text: "I initially used West Chemist due to my normal chemist wasn't able to supply my much needed diabetic sensor. Not only did West Chemist have 1 in stock but they also took my number to let me know that they had a delivery of more. I wouldn't go anywhere else now, they are my chosen chemist for prescriptions, and they're always available to speak to if you need medical advice. West is best.",
        rating: 5,
        service: "Prescription Care"
    }
];

export default function Testimonials() {
    const sectionRef = useRef(null);

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
    }, []);

    return (
        <section className="testimonials_section" ref={sectionRef}>
            {/* Hospital-style cross background pattern */}
            <div className="t_medical_pattern"></div>
            
            <div className="t_container">
                <div className="t_header t_reveal" style={{ '--delay': '0ms' }}>
                    <div className="t_badge_wrap">
                        <span className="t_medical_cross"></span>
                        <span className="t_eyebrow">Patient Feedback</span>
                    </div>
                    <h2 className="t_title">Trusted by our <span className="t_accent">Community</span></h2>
                    <p className="t_desc">
                        Experience clinical excellence delivered with genuine care. Read what our 
                        patients say about their experience at West Chemist Clinic.
                    </p>
                </div>

                <div className="t_grid">
                    {reviews.map((r, i) => (
                        <div 
                            key={r.id} 
                            className="t_card t_reveal" 
                            style={{ '--delay': `${150 + i * 150}ms` }}
                        >
                            {/* Top row: stars + service badge */}
                            <div className="t_card_header">
                                <div className="t_stars">
                                    {[...Array(r.rating)].map((_, idx) => (
                                        <svg key={idx} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                    ))}
                                </div>
                                <div className="t_service_tag">{r.service}</div>
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
                                {/* Clean abstract quote icon instead of initial */}
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
