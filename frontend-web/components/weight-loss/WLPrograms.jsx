"use client";
import React, { useEffect, useRef } from 'react';
import './WLPrograms.css';

const programsData = [
    {
        id: "wegovy",
        title: "Wegovy® (Semaglutide)",
        tagline: "The Gold Standard GLP-1",
        description: "A weekly injection clinically proven to regulate appetite and significantly reduce body weight when combined with a balanced lifestyle.",
        image: "/images/wegovy_pen.png",
        stats: [
            { label: "Dosage", value: "Once Weekly" },
            { label: "Admin", value: "Pre-filled Pen" },
            { label: "Efficacy", value: "Up to 15% Loss" }
        ],
        features: [
            "Regulates hunger signals",
            "Slows gastric emptying",
            "Doctor-led dosage titration"
        ]
    },
    {
        id: "mounjaro",
        title: "Mounjaro® (Tirzepatide)",
        tagline: "Next-Gen Dual Action",
        description: "The latest breakthrough in weight management. A dual-acting GIP/GLP-1 receptor agonist offering unprecedented efficacy in weight reduction.",
        image: "/images/mounjaro_pen.png",
        stats: [
            { label: "Dosage", value: "Once Weekly" },
            { label: "Admin", value: "Pre-filled Pen" },
            { label: "Efficacy", value: "Up to 22.5% Loss" }
        ],
        features: [
            "Dual hormone action (GLP-1 & GIP)",
            "Superior appetite suppression",
            "Advanced metabolic regulation"
        ]
    }
];

const WLPrograms = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('wlp_reveal_active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = sectionRef.current.querySelectorAll('.wlp_reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="wl_programs_section" ref={sectionRef}>
            <div className="wl_programs_container">
                <div className="wlp_header wlp_reveal">
                    <span className="wlp_eyebrow">Treatment Options</span>
                    <h2 className="wlp_title">Advanced GLP-1 Therapies</h2>
                    <p className="wlp_lead">
                        We offer the most effective, clinically approved treatments to support your weight loss journey. Our medical team will help choose the right path for you.
                    </p>
                </div>

                <div className="wlp_grid">
                    {programsData.map((program, index) => (
                        <div className="wlp_card wlp_reveal" key={program.id} style={{ transitionDelay: `${index * 0.2}s` }}>
                            <div className="wlp_card_visual">
                                <img src={program.image} alt={program.title} className="wlp_card_img" />
                                <div className="wlp_card_overlay"></div>
                                <div className="wlp_card_badge">{program.title.split('®')[0]}</div>
                            </div>
                            
                            <div className="wlp_card_body">
                                <span className="wlp_tagline">{program.tagline}</span>
                                <h3 className="wlp_card_title">{program.title}</h3>
                                <p className="wlp_card_desc">{program.description}</p>
                                
                                <div className="wlp_stats">
                                    {program.stats.map((stat, i) => (
                                        <div className="wlp_stat" key={i}>
                                            <span className="wlp_stat_val">{stat.value}</span>
                                            <span className="wlp_stat_label">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <ul className="wlp_features">
                                    {program.features.map((feature, i) => (
                                        <li key={i}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <a href={`/services/${program.id}`} className="wlp_btn">
                                    Start Consultation
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WLPrograms;
