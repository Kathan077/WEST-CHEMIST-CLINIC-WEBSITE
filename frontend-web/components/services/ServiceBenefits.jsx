"use client";
import React, { useEffect, useRef } from 'react';
import './ServiceBenefits.css';

const benefits = [
    {
        title: "Qualified Pharmacists",
        desc: "Our team consists of highly trained healthcare professionals ready to provide expert advice.",
        icon: (
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2.5 3-2.5 5h20c0-2-1-3.74-2.5-5" />
                <circle cx="12" cy="7" r="4" />
                <path d="M12 11v6" />
                <path d="M9 14h6" />
            </svg>
        )
    },
    {
        title: "Digital Scripts",
        desc: "Seamless integration with your NHS records for fast and accurate medication management.",
        icon: (
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        )
    },
    {
        title: "Private Consultation",
        desc: "Discuss your health in complete confidence in our dedicated private consultation rooms.",
        icon: (
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="2" />
                <path d="M12 13v3" />
            </svg>
        )
    }
];

export default function ServiceBenefits() {
    const listRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('sb_reveal_visible');
                }
            });
        }, { threshold: 0.1 });

        const cards = listRef.current.querySelectorAll('.sb_card');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * -10;

        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
    };

    const handleMouseLeave = (card) => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    };

    return (
        <section className="sb_section">
            <div className="sb_container">
                <div className="sb_header">
                    <span className="sb_eyebrow">Excellence in Care</span>
                    <h2 className="sb_title">Why Choose Our Clinic?</h2>
                    <p className="sb_subtitle">We combine clinical expertise with patient-first convenience.</p>
                </div>
                <div className="sb_grid" ref={listRef}>
                    {benefits.map((benefit, idx) => (
                        <div 
                            className="sb_card" 
                            key={idx} 
                            style={{ '--delay': `${idx * 0.1}s` }}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                        >
                            <div className="sb_card_inner">
                                <div className="sb_shadow" />
                                <div className="sb_icon">{benefit.icon}</div>
                                <h3 className="sb_card_title">{benefit.title}</h3>
                                <p className="sb_card_desc">{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
