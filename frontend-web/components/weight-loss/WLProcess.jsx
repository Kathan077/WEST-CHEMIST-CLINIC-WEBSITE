"use client";
import React, { useEffect, useRef } from 'react';
import './WLProcess.css';

const processSteps = [
    {
        number: "01",
        title: "Clinical Consultation",
        description: "Begin with a comprehensive assessment by our medical experts to ensure suitability, discuss targeted goals, and evaluate your health profile."
    },
    {
        number: "02",
        title: "Personalized Prescription",
        description: "Receive a tailored GLP-1 treatment plan. We handle the secure dispensing of your exact dosage directly from our registered pharmacy."
    },
    {
        number: "03",
        title: "Ongoing Monitoring",
        description: "Weight loss is a journey. We provide continuous support, dosage titrations, and routine check-ins to maximize your clinical outcomes."
    }
];

const WLProcess = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('wlc_reveal_active');
                    }
                });
            },
            { threshold: 0.2 }
        );

        const elements = sectionRef.current.querySelectorAll('.wlc_reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="wl_process_section" ref={sectionRef}>
            <div className="wl_process_container">
                <div className="wlc_header wlc_reveal">
                    <span className="wlc_eyebrow">How It Works</span>
                    <h2 className="wlc_title">Your Journey to Better Health.</h2>
                </div>

                <div className="wlc_steps">
                    {processSteps.map((step, index) => (
                        <div className="wlc_step wlc_reveal" key={index} style={{ transitionDelay: `${index * 0.2}s` }}>
                            <div className="wlc_step_number">{step.number}</div>
                            <div className="wlc_step_content">
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="wlc_cta_box wlc_reveal" style={{ transitionDelay: '0.6s' }}>
                    <div className="wlc_cta_content">
                        <h3>Ready to Transform?</h3>
                        <p>Take the first step towards a healthier you with our proven clinical programs.</p>
                    </div>
                    <a href="/book-appointment" className="wlc_btn_primary">
                        Book Your Assessment
                    </a>
                </div>
            </div>
        </section>
    );
};

export default WLProcess;
