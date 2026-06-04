"use client";

import React, { useEffect, useState, useRef } from 'react';
import './AboutImpact.css';

export default function AboutImpact() {
    const sectionRef = useRef(null);
    const [counts, setCounts] = useState({ years: 0, docs: 0, satisfaction: 0, clients: 0 });

    useEffect(() => {
        let animated = false;
        let timer;

        const animateCounters = () => {
            if (animated) return;
            animated = true;

            const duration = 2000;
            const steps = 50;
            const stepTime = duration / steps;

            let currentStep = 0;
            timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                setCounts({
                    years: Math.floor(15 * easing),
                    docs: Math.floor(50 * easing),
                    satisfaction: Math.floor(99 * easing),
                    clients: Math.floor(2000 * easing),
                });

                if (currentStep >= steps) clearInterval(timer);
            }, stepTime);
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                entries[0].target.classList.add('med_animate');
                animateCounters();
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            observer.disconnect();
            if (timer) clearInterval(timer);
        };
    }, []);

    return (
        <section className="med_impact_bg" ref={sectionRef}>
            <div className="med_impact_container">

                <div className="med_impact_img_col">
                    <img
                        src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=90"
                        alt="Team"
                    />
                </div>

                <div className="med_impact_text_col">
                    <h2>Our Impact in Numbers</h2>
                    <p>At West Chemist Clinic, we go beyond treatment.</p>

                    <div className="med_impact_grid">
                        <div className="med_stat_box">
                            <h3>{counts.years}<span className="med_plus">+</span></h3>
                            <span>Years of Excellence</span>
                        </div>
                        <div className="med_stat_box">
                            <h3>{counts.docs}<span className="med_plus">+</span></h3>
                            <span>Certified Doctors & Specialists</span>
                        </div>
                        <div className="med_stat_box">
                            <h3>{counts.satisfaction}<span className="med_plus">%</span></h3>
                            <span>Patient Satisfaction</span>
                        </div>
                        <div className="med_stat_box">
                            <h3>{counts.clients}<span className="med_plus">+</span></h3>
                            <span>Happy Clients</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}