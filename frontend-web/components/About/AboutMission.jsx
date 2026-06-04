"use client";

import React, { useEffect, useRef } from 'react';
import './AboutMission.css';

export default function AboutMission() {
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('med_animate');
                }
            });
        }, { threshold: 0.2 });

        if (containerRef.current) {
            containerRef.current.querySelectorAll('.med_card_wrapper').forEach(el => observer.observe(el));
        }
        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e, wrapperElem) => {
        const cardElem = wrapperElem.querySelector('.med_card');
        if (!cardElem) return;

        const rect = wrapperElem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        cardElem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = (e, wrapperElem) => {
        const cardElem = wrapperElem.querySelector('.med_card');
        if (cardElem) {
            cardElem.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
    };

    return (
        <section className="med_mission_bg">
            <div className="med_mission_container" ref={containerRef}>

                {/* Card 1 */}
                <div
                    className="med_card_wrapper"
                    onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                    onMouseLeave={(e) => handleMouseLeave(e, e.currentTarget)}
                >
                    <div className="med_card">
                        <div className="med_card_icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                        </div>
                        <h3>Mission</h3>
                        <p>To deliver accessible, high-quality healthcare through expert medical care, innovative solutions, and a patient-first approach that improves lives and promotes healthier communities.</p>
                    </div>
                </div>

                {/* Card 2 : Filled */}
                <div
                    className="med_card_wrapper med_card_wrapper_delayed_1"
                    onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                    onMouseLeave={(e) => handleMouseLeave(e, e.currentTarget)}
                >
                    <div className="med_card med_card_filled">
                        <div className="med_card_icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        </div>
                        <h3>Vision</h3>
                        <p>To become a trusted leader in modern healthcare by delivering exceptional care and transforming the healthcare experience for individuals and families.</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div
                    className="med_card_wrapper med_card_wrapper_delayed_2"
                    onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                    onMouseLeave={(e) => handleMouseLeave(e, e.currentTarget)}
                >
                    <div className="med_card">
                        <div className="med_card_icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        </div>
                        <h3>Our Values</h3>
                        <p>At West Chemist Clinic, we are guided by the values of compassion, trust, excellence, and integrity, ensuring every patient receives personalized care, respect, and support at every step of their healthcare journey.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}