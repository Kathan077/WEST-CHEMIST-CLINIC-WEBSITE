"use client";
import React, { useEffect, useRef, useState } from 'react';
import './VaccinationProcess.css';

const DEFAULT_PROCESS = {
    eyebrow: "Pharmacy Protocol",
    title: "Seamless Immunity.",
    lead: "Getting protected shouldn't be complicated. Our 3-step streamlined PHARMACY process ensures you get the right vaccines, fast.",
    steps: [
        {
            number: "01",
            title: "PHARMACY Consultation",
            description: "Review your travel itinerary, medical history, and risk factors with our qualified pharmacists to determine the exact vaccines you need."
        },
        {
            number: "02",
            title: "Secure Administration",
            description: "Receive your vaccinations in our sterile, private PHARMACY rooms. We use advanced, painless techniques to ensure maximum comfort."
        },
        {
            number: "03",
            title: "Certification & Aftercare",
            description: "Get immediate official documentation, including Yellow Fever certificates, along with professional advice on managing any minor side effects."
        }
    ]
};

const VaccinationProcess = ({ initialProcess }) => {
    const sectionRef = useRef(null);
    const [processData, setProcessData] = useState(() => ({
        ...DEFAULT_PROCESS,
        ...(initialProcess || {}),
        steps: initialProcess?.steps?.length ? initialProcess.steps : DEFAULT_PROCESS.steps
    }));

    useEffect(() => {
        if (initialProcess) {
            setProcessData({
                ...DEFAULT_PROCESS,
                ...initialProcess,
                steps: initialProcess.steps?.length ? initialProcess.steps : DEFAULT_PROCESS.steps
            });
        }
    }, [initialProcess]);

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
    }, [processData.steps]);

    return (
        <section className="vp_section" ref={sectionRef}>
            <div className="vp_container">
                <div className="vp_header vp_reveal">
                    <span className="vp_eyebrow">{processData.eyebrow}</span>
                    <h2 className="vp_title">{processData.title}</h2>
                    <p className="vp_lead">{processData.lead}</p>
                </div>

                <div className="vp_steps_timeline">
                    {(processData.steps || []).map((step, index) => (
                        <div className="vp_step vp_reveal" key={step._id || index} style={{ transitionDelay: `${index * 0.2}s` }}>
                            <div className="vp_step_number">{step.number || `0${index + 1}`}</div>
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
