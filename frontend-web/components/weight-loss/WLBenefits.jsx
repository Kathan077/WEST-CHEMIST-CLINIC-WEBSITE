"use client";
import React, { useEffect, useRef } from 'react';
import './WLBenefits.css';

const benefits = [
    {
        title: "Cardiovascular Health",
        desc: "Significant reduction in blood pressure and improved heart function.",
        icon: "❤️",
        span: "col-span-2 row-span-1",
        bg: "bg-blue"
    },
    {
        title: "Joint Relief",
        desc: "Less mechanical stress on knees and hips.",
        icon: "🦴",
        span: "col-span-1 row-span-1",
        bg: "bg-teal"
    },
    {
        title: "Metabolic Reset",
        desc: "Improved insulin sensitivity and blood sugar regulation.",
        icon: "⚡",
        span: "col-span-1 row-span-2",
        bg: "bg-purple"
    },
    {
        title: "Enhanced Sleep",
        desc: "Reduction in sleep apnea symptoms and better rest.",
        icon: "🌙",
        span: "col-span-1 row-span-1",
        bg: "bg-dark"
    },
    {
        title: "Mental Clarity",
        desc: "Boosted confidence and reduced brain fog.",
        icon: "🧠",
        span: "col-span-1 row-span-1",
        bg: "bg-light"
    }
];

const WLBenefits = () => {
    const gridRef = useRef(null);

    useEffect(() => {
        if (!gridRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('wlb_reveal_active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = gridRef.current.querySelectorAll('.wlb_reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="wl_benefits_section">
            <div className="wl_benefits_container">
                <div className="wlb_header wlb_reveal" ref={gridRef}>
                    <span className="wlb_eyebrow">Holistic Transformation</span>
                    <h2 className="wlb_title">Beyond the Scale.</h2>
                    <p className="wlb_lead">Weight loss is more than aesthetics. It is a fundamental reset of your body's systems, adding healthy years to your life.</p>
                </div>

                <div className="wlb_bento_grid" ref={gridRef}>
                    {benefits.map((benefit, i) => (
                        <div 
                            key={i} 
                            className={`wlb_bento_item wlb_reveal ${benefit.span} ${benefit.bg}`}
                            style={{ transitionDelay: `${i * 0.1}s` }}
                        >
                            <div className="wlb_bento_icon">{benefit.icon}</div>
                            <div className="wlb_bento_content">
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WLBenefits;
