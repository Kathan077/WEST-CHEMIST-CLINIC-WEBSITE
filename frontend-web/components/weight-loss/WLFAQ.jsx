"use client";
import React, { useState, useEffect, useRef } from 'react';
import './WLFAQ.css';

const faqs = [
    {
        question: "Am I eligible for medical weight loss?",
        answer: "Eligibility typically requires a BMI of 30+, or a BMI of 27+ with a weight-related medical condition such as high blood pressure or type 2 diabetes. A clinical consultation is mandatory to confirm suitability."
    },
    {
        question: "What is the difference between Wegovy and Mounjaro?",
        answer: "Wegovy (Semaglutide) is a GLP-1 receptor agonist, while Mounjaro (Tirzepatide) acts on both GIP and GLP-1 receptors. Both are highly effective, but Mounjaro has shown slightly higher average weight reduction in clinical trials."
    },
    {
        question: "Are there any side effects?",
        answer: "Like all medications, GLP-1 treatments can cause side effects, most commonly gastrointestinal issues like nausea, which typically subside as your body adjusts to the medication. Our clinicians will monitor you closely."
    },
    {
        question: "How long do I need to take the medication?",
        answer: "Medical weight loss is a long-term strategy for chronic weight management. The duration varies per individual, but clinical studies suggest ongoing treatment is required to maintain the weight loss achieved."
    }
];

const WLFAQ = () => {
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
                        entry.target.classList.add('wlf_reveal_active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = sectionRef.current.querySelectorAll('.wlf_reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="wl_faq_section" ref={sectionRef}>
            <div className="wl_faq_container">
                <div className="wlf_header wlf_reveal">
                    <span className="wlf_eyebrow">Medical Knowledge</span>
                    <h2 className="wlf_title">Frequently Asked Questions.</h2>
                    <p className="wlf_lead">Find answers to the most common queries regarding our medical weight loss programs.</p>
                </div>

                <div className="wlf_accordion wlf_reveal" style={{ transitionDelay: '0.2s' }}>
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`wlf_item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFaq(index)}
                        >
                            <div className="wlf_question">
                                <h3>{faq.question}</h3>
                                <div className="wlf_toggle">
                                    <span></span><span></span>
                                </div>
                            </div>
                            <div className="wlf_answer">
                                <div className="wlf_answer_inner">
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

export default WLFAQ;
