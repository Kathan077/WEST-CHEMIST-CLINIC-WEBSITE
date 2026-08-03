"use client";
import React, { useEffect, useRef } from 'react';
import './VaccinationProcess.css';

const processSteps = [
    {
        number: "01",
        title: "Clinical Consultation",
        description: "Review your travel itinerary, medical history, and risk factors with our qualified pharmacists to determine the exact vaccines you need."
    },
    {
        number: "02",
        title: "Secure Administration",
        description: "Receive your vaccinations in our sterile, private clinical rooms. We use advanced, painless techniques to ensure maximum comfort."
    },
    {
        number: "03",
        title: "Certification & Aftercare",
        description: "Get immediate official documentation, including Yellow Fever certificates, along with professional advice on managing any minor side effects."
    }
];

const VaccinationProcess = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('vp_reveal_active');
                    }
                });
            },
            { threshold: 0.2 }
        );

        const elements = sectionRef.current.querySelectorAll('.vp_reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="vp_section" ref={sectionRef}>
            <div className="vp_container">
                <div className="vp_header vp_reveal">
                    <span className="vp_eyebrow">Pharmacy Protocol</span>
                    <h2 className="vp_title">Seamless Immunity.</h2>
                    <p className="vp_lead">Getting protected shouldn't be complicated. Our 3-step streamlined clinical process ensures you get the right vaccines, fast.</p>
                </div>

                <div className="vp_steps_timeline">
                    {processSteps.map((step, index) => (
                        <div className="vp_step vp_reveal" key={index} style={{ transitionDelay: `${index * 0.2}s` }}>
                            <div className="vp_step_number">{step.number}</div>
                            <div className="vp_step_content">
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VaccinationProcess;
