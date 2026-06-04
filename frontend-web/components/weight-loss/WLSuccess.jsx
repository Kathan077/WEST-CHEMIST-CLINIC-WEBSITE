"use client";
import React, { useEffect, useRef } from 'react';
import './WLSuccess.css';

const transformations = [
    {
        name: "Sarah M.",
        loss: "-18% Body Weight",
        quote: "Mounjaro completely changed my relationship with food. The clinical support from West Chemist made the process seamless and safe.",
        time: "Over 6 Months",
        treatment: "Mounjaro"
    },
    {
        name: "James T.",
        loss: "-15% Body Weight",
        quote: "Wegovy gave me the jumpstart I needed. My blood pressure is down and my energy levels have never been higher.",
        time: "Over 8 Months",
        treatment: "Wegovy"
    },
    {
        name: "Elena R.",
        loss: "-21% Body Weight",
        quote: "The personalized dosage plan and constant check-ins made me feel truly cared for. This is medical weight loss done right.",
        time: "Over 10 Months",
        treatment: "Mounjaro"
    }
];

const WLSuccess = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('wls_reveal_active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = sectionRef.current.querySelectorAll('.wls_reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="wl_success_section" ref={sectionRef}>
            <div className="wl_success_container">
                <div className="wls_header wls_reveal">
                    <span className="wls_eyebrow">Proven Results</span>
                    <h2 className="wls_title">Real Transformations.</h2>
                </div>

                <div className="wls_grid">
                    {transformations.map((item, index) => (
                        <div className="wls_card wls_reveal" key={index} style={{ transitionDelay: `${index * 0.2}s` }}>
                            <div className="wls_card_header">
                                <div className="wls_avatar">{item.name.charAt(0)}</div>
                                <div>
                                    <h4 className="wls_name">{item.name}</h4>
                                    <span className="wls_treatment">{item.treatment} Patient</span>
                                </div>
                            </div>
                            
                            <div className="wls_loss_metric">
                                <span className="wls_loss_val">{item.loss}</span>
                                <span className="wls_loss_time">{item.time}</span>
                            </div>

                            <p className="wls_quote">"{item.quote}"</p>
                            
                            <div className="wls_card_bg"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WLSuccess;
