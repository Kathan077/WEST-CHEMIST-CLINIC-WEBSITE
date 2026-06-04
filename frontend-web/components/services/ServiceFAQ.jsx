"use client";
import React, { useState } from 'react';
import './ServiceFAQ.css';

const faqs = [
    {
        q: "Do I need a GP referral for Pharmacy First services?",
        a: "No, you can walk in or book directly for Pharmacy First conditions. We can assess and treat you without needing to see your GP first."
    },
    {
        q: "Are the vaccinations suitable for children?",
        a: "We offer various vaccinations for adults and children. Please contact us or check individual service details for specific age requirements."
    },
    {
        q: "Is the weight loss program medically supervised?",
        a: "Yes, our weight loss programs are supervised by qualified clinicians who will monitor your progress and provide professional guidance."
    },
    {
        q: "How long does a typical consultation take?",
        a: "Most consultations take between 10 to 20 minutes, depending on the complexity of the service and your individual health needs."
    }
];

export default function ServiceFAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <section className="faq_section">
            <div className="faq_container">
                <div className="faq_header">
                    <h2 className="faq_title">Frequently Asked Questions</h2>
                    <p className="faq_subtitle">Answers to common queries about our clinical services.</p>
                </div>
                <div className="faq_list">
                    {faqs.map((faq, idx) => (
                        <div 
                            className={`faq_item ${activeIndex === idx ? 'faq_active' : ''}`} 
                            key={idx}
                            onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                        >
                            <div className="faq_question">
                                <span>{faq.q}</span>
                                <div className="faq_icon_toggle">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                            <div className="faq_answer">
                                <div className="faq_answer_inner">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
