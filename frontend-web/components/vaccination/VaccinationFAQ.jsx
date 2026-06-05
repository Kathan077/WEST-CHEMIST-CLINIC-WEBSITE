"use client";
import React, { useState, useEffect, useRef } from 'react';
import './VaccinationFAQ.css';

const faqs = [
    {
        question: "When should I book my travel vaccinations?",
        answer: "We strongly recommend booking your consultation at least 6-8 weeks before your departure. Some vaccines require multiple doses spread across several weeks to build full immunity."
    },
    {
        question: "Are your vaccines authentic and approved?",
        answer: "Absolutely. All our vaccines are strictly sourced from licensed UK medical wholesalers, fully MHRA approved, and administered by highly trained, registered clinical professionals."
    },
    {
        question: "Do I need a prescription from my GP first?",
        answer: "No. Our clinic operates a fully comprehensive service. Our specialist pharmacists are authorized to clinically assess your needs and prescribe the necessary vaccines directly during your consultation."
    },
    {
        question: "How does the travel consultation work?",
        answer: "During your consultation, our specialist pharmacist will review your medical history, immunization records, and travel itinerary to create a personalized travel health plan tailored to your destination."
    }
];

const VaccinationFAQ = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef(null);

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? -1 : index);
    };

    useEffect(() => {
        if (!sectionRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('vf_reveal_active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = sectionRef.current.querySelectorAll('.vf_reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="vf_section" ref={sectionRef}>
            <div className="vf_container">
                <div className="vf_header vf_reveal">
                    <span className="vf_eyebrow">Clinical Knowledge</span>
                    <h2 className="vf_title">Vaccination FAQ.</h2>
                    <p className="vf_lead">Clear answers to your most pressing questions regarding travel immunity and routine clinical protection.</p>
                </div>

                <div className="vf_accordion vf_reveal" style={{ transitionDelay: '0.2s' }}>
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`vf_item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFaq(index)}
                        >
                            <div className="vf_question">
                                <h3>{faq.question}</h3>
                                <div className="vf_toggle">
                                    <span></span><span></span>
                                </div>
                            </div>
                            <div className="vf_answer">
                                <div className="vf_answer_inner">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VaccinationFAQ;
