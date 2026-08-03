"use client";

import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '@/config';
import './AboutFaq.css';

const DEFAULT_FAQS = [
    {
        _id: 'default-faq-1',
        question: "How do I book an appointment online?",
        answer: "You can easily book an appointment through our online patient portal by selecting your required pharmacy service and preferred time slot."
    },
    {
        _id: 'default-faq-2',
        question: "Can I access my booking records digitally?",
        answer: "Yes, all patients can securely access their appointment history, consultation notes, and booking details through our online patient portal."
    },
    {
        _id: 'default-faq-3',
        question: "What pharmacy services do you offer?",
        answer: "We offer NHS & private prescription dispensing, travel health consultations & vaccinations, weight management treatments, ear wax removal, and health checks."
    },
    {
        _id: 'default-faq-4',
        question: "Are consultations available at the pharmacy?",
        answer: "Yes, we offer private, in-person consultations for health advice, weight management, and vaccinations with our qualified pharmacists."
    },
    {
        _id: 'default-faq-5',
        question: "How secure is my personal health data?",
        answer: "Your privacy is our priority. We use industry-standard encryption and fully comply with GDPR regulations to ensure your data is safe."
    },
    {
        _id: 'default-faq-6',
        question: "What if I need to reschedule or cancel my appointment?",
        answer: "You can reschedule or cancel your appointment via the patient portal or by calling our pharmacy directly at least 24 hours in advance."
    }
];

export default function AboutFaq() {
    const [faqs, setFaqs] = useState(DEFAULT_FAQS);
    const [openId, setOpenId] = useState('default-faq-2'); // ID 2 is open by default in screenshot
    const sectionRef = useRef(null);

    useEffect(() => {
        // Fetch FAQs from backend API
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const faqItems = data.data.filter(item => item.type === 'faq');
                    if (faqItems.length > 0) {
                        const formatted = faqItems.map(item => ({
                            _id: item._id,
                            question: item.title,
                            answer: item.content
                        }));
                        setFaqs(formatted);
                        // Open first FAQ by default when loaded
                        if (formatted.length > 0) {
                            setOpenId(formatted[0]._id);
                        }
                    }
                }
            })
            .catch(err => console.error('Error fetching about FAQs:', err));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                entries[0].target.classList.add('med_animate');
                observer.disconnect();
            }
        }, { threshold: 0.2 });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer?.disconnect();
    }, [faqs]);

    const toggleFaq = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="med_faq_bg" ref={sectionRef}>
            <div className="med_faq_container">
                <div className="med_faq_header">
                    <span className="med_faq_badge">FAQs</span>
                    <h2>Frequently Asked Questions</h2>
                    <p>Find quick answers to the most common questions about our services, treatments, and patient care. We're here to make things simple and clear for you.</p>
                </div>

                <div className="med_faq_list">
                    {faqs.map((faq, index) => {
                        const isOpen = openId === faq._id;
                        return (
                            <div 
                                key={faq._id} 
                                className={`med_faq_item ${isOpen ? 'open' : ''}`}
                                style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                                onClick={() => toggleFaq(faq._id)}
                            >
                                <div className="med_faq_q">
                                    <h3>{faq.question}</h3>
                                    <div className="med_faq_icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            {isOpen ? (
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            ) : (
                                                <>
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </>
                                            )}
                                        </svg>
                                    </div>
                                </div>
                                <div className="med_faq_a_wrapper">
                                    <div className="med_faq_a_inner">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
