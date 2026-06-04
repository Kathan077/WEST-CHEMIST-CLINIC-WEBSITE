"use client";
import React, { useEffect, useRef } from 'react';
import './ServiceBenefits.css';

const benefits = [
    {
        title: "Qualified Pharmacists",
        desc: "Our team consists of highly trained healthcare professionals ready to provide expert advice.",
        icon: "👨‍⚕️"
    },
    {
        title: "No Appointment Needed",
        desc: "Visit our Pharmacy First clinic during opening hours for immediate assessment.",
        icon: "⚡"
    },
    {
        title: "Digital Scripts",
        desc: "Seamless integration with your NHS records for fast and accurate medication management.",
        icon: "📱"
    },
    {
        title: "Private Consultation",
        desc: "Discuss your health in complete confidence in our dedicated private consultation rooms.",
        icon: "🔒"
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
