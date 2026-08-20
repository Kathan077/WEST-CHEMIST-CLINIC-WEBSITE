"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
import './WeightLoss.css';

const FAQ_ITEMS = [
    {
        question: "How do Mounjaro and Wegovy differ?",
        answer: "Wegovy (semaglutide) acts as a GLP-1 receptor agonist, mimicking the body's natural satiety hormone to regulate appetite. Mounjaro (tirzepatide) is a dual GIP and GLP-1 receptor agonist, targeting two metabolic pathways. PHARMACY studies show Mounjaro generally yields slightly higher average weight reduction, but both are exceptionally effective options."
    },
    {
        question: "Do I need a GP referral to start the Weight Loss program?",
        answer: "No GP referral is required. Our GPhC-registered PHARMACY pharmacists perform full PHARMACY assessments, prescribe, and dispense the appropriate medication directly within our pharmacy as part of our private weight management service."
    },
    {
        question: "Who is eligible for the Weight Loss injections?",
        answer: "Generally, individuals with a BMI (Body Mass Index) of 30 or above are eligible. Alternatively, individuals with a BMI of 27 or above who have weight-related health conditions (such as high blood pressure, type 2 diabetes, or high cholesterol) may also qualify after a PHARMACY consultation."
    },
    {
        question: "What are the common side effects of these treatments?",
        answer: "Most side effects are mild to moderate and occur during the initial dosage titration phases. They commonly include nausea, diarrhea, vomiting, constipation, and mild stomach discomfort. Our pharmacists provide detailed advice and custom plans to manage and minimize these side effects."
    },
    {
        question: "How are the injections administered and what is the schedule?",
        answer: "Both Wegovy and Mounjaro are administered as a simple once-weekly subcutaneous injection using pre-filled pens (usually in the abdomen, thigh, or upper arm). You will be fully trained on how to self-administer safely. The dosage starts low and is gradually increased monthly to allow your body to adjust."
    }
];

export default function WeightLossContent() {
    const [faqActive, setFaqActive] = useState({});
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleFaq = (index) => {
        setFaqActive(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data)) {
                    const wlSrvs = json.data.filter(s => {
                        const slug = (s.slug || '').toLowerCase();
                        const cat = (s.cat || '').toLowerCase();
                        const parentCat = (s.parentCategory || '').toLowerCase();
                        const title = (s.title || '').toLowerCase();
                        return (
                            slug === 'wegovy' ||
                            slug === 'mounjaro' ||
                            cat.includes('weight') ||
                            parentCat.includes('weight') ||
                            title.includes('weight') ||
                            title.includes('wegovy') ||
                            title.includes('mounjaro') ||
                            title.includes('ozempic') ||
                            title.includes('saxenda') ||
                            title.includes('slimming') ||
                            slug.includes('weight') ||
                            slug.includes('wegovy') ||
                            slug.includes('mounjaro')
                        );
                    });

                    setServices(wlSrvs);
                }
            } catch (err) {
                console.error("Error loading dynamic services in WeightLossContent:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const displayServices = services;

    return (
        <div className="wl_page_wrapper">
            {/* ── HERO BANNER ── */}
            <section className="wl_hero_banner">
                <div className="wl_hero_container">
                    <div className="wl_hero_info">
                        <span className="wl_hero_tag">Pharmacy Service</span>
                        <h1 className="wl_hero_title">
                            PHARMACYly Supervised <span>Weight Loss Program</span>
                        </h1>
                        <p className="wl_hero_description">
                            Achieve safe, sustainable weight reduction with next-generation medical treatments under professional PHARMACY supervision. We offer tailored Wegovy and Mounjaro programs designed for your biology.
                        </p>
                        <div className="wl_hero_buttons">
                            <Link href="/book-appointment?service=Weight%20Loss%20Clinic" className="wl_btn_primary">
                                Book Private Consultation
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                            <a href="#comparison" className="wl_btn_secondary">
                                Compare Treatments
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TREATMENTS SECTION ── */}
            <section className="wl_treatments_section">
                <div className="wl_section_container">
                    <div className="wl_section_header">
                        <span className="wl_section_subtitle">PHARMACY Treatments</span>
                        <h2 className="wl_section_title">Our Weight Management Options</h2>
                        <p className="wl_section_desc">
                            We provide MHRA-approved medications and comprehensive health coaching to support your metabolic health journey.
                        </p>
                    </div>

                    <div className="wl_treatment_grid">
                        {displayServices.map(s => (
                            <div className="wl_treatment_card" key={s._id}>
                                <div className="wl_card_image_wrapper">
                                    <img
                                        src={getImageUrl(s.img)}
                                        alt={s.title}
                                        className="wl_card_image"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80";
                                        }}
                                    />
                                    <span className="wl_card_cat">{s.cat || 'Weight Loss'}</span>
                                </div>
                                <div className="wl_card_content">
                                    <h3 className="wl_card_title">{s.title}</h3>
                                    <p className="wl_card_desc">{s.desc}</p>
                                    {Array.isArray(s.features) && s.features.length > 0 && (
                                        <ul className="wl_card_features">
                                            {s.features.map((feat, idx) => (
                                                <li key={idx}>
                                                    <span className="wl_feature_icon">✓</span> {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div className="wl_card_actions">
                                        <Link href={`/services/${s.slug || s.title.toLowerCase().replace(/\s+/g, '-')}`} className="wl_card_btn_view">Learn More</Link>
                                        <Link href={`/book-appointment?service=${encodeURIComponent(s.title)}`} className="wl_card_btn_book">Book Now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── COMPARISON TABLE ── */}
            <section id="comparison" className="wl_comparison_section">
                <div className="wl_section_container">
                    <div className="wl_section_header">
                        <span className="wl_section_subtitle">Head to Head</span>
                        <h2 className="wl_section_title">Mounjaro vs Wegovy Comparison</h2>
                        <p className="wl_section_desc">
                            Compare the features, mechanism, and efficacy of the leading medical weight management treatments.
                        </p>
                    </div>

                    <div className="wl_table_responsive">
                        <table className="wl_comparison_table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Mounjaro® (Tirzepatide)</th>
                                    <th>Wegovy® (Semaglutide)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="wl_table_param">Active Ingredient</td>
                                    <td>Tirzepatide</td>
                                    <td>Semaglutide</td>
                                </tr>
                                <tr>
                                    <td className="wl_table_param">Drug Class / Mechanism</td>
                                    <td>Dual GIP & GLP-1 Receptor Agonist</td>
                                    <td>GLP-1 Receptor Agonist</td>
                                </tr>
                                <tr>
                                    <td className="wl_table_param">Administration</td>
                                    <td>Once-weekly injection</td>
                                    <td>Once-weekly injection</td>
                                </tr>
                                <tr>
                                    <td className="wl_table_param">Average Weight Loss Efficacy</td>
                                    <td><span className="wl_badge_pill accent">Up to 20.9%</span></td>
                                    <td><span className="wl_badge_pill purple">Up to 15%</span></td>
                                </tr>
                                <tr>
                                    <td className="wl_table_param">Starting Dose</td>
                                    <td>2.5 mg weekly for 4 weeks</td>
                                    <td>0.25 mg weekly for 4 weeks</td>
                                </tr>
                                <tr>
                                    <td className="wl_table_param">Maintenance Doses</td>
                                    <td>5mg, 7.5mg, 10mg, 12.5mg, 15mg weekly</td>
                                    <td>2.4 mg weekly</td>
                                </tr>
                                <tr>
                                    <td className="wl_table_param">Eligibility (BMI)</td>
                                    <td>BMI &ge; 30, or &ge; 27 with complications</td>
                                    <td>BMI &ge; 30, or &ge; 27 with complications</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="wl_how_it_works_section">
                <div className="wl_section_container">
                    <div className="wl_section_header">
                        <span className="wl_section_subtitle">Your Journey</span>
                        <h2 className="wl_section_title">How Our Weight Loss Program Works</h2>
                        <p className="wl_section_desc">
                            A simple, secure, and pharmacist-led process to help you get started safely.
                        </p>
                    </div>

                    <div className="wl_timeline_grid">
                        <div className="wl_timeline_step">
                            <div className="wl_step_num">1</div>
                            <h3 className="wl_step_title">Book Appointment</h3>
                            <p className="wl_step_desc">Book a private consultation slot with our qualified pharmacist online.</p>
                        </div>
                        <div className="wl_timeline_step">
                            <div className="wl_step_num">2</div>
                            <h3 className="wl_step_title">PHARMACY Review</h3>
                            <p className="wl_step_desc">Complete an in-person weight, BMI assessment, and medical history review.</p>
                        </div>
                        <div className="wl_timeline_step">
                            <div className="wl_step_num">3</div>
                            <h3 className="wl_step_title">Prescribe & Dispense</h3>
                            <p className="wl_step_desc">If suitable, our pharmacist issues your prescription and dispenses the medication immediately.</p>
                        </div>
                        <div className="wl_timeline_step">
                            <div className="wl_step_num">4</div>
                            <h3 className="wl_step_title">Ongoing Reviews</h3>
                            <p className="wl_step_desc">Monthly follow-ups to track weight loss, manage dosage increases, and side effects.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ SECTION ── */}
            <section className="wl_faq_section">
                <div className="wl_section_container">
                    <div className="wl_section_header">
                        <span className="wl_section_subtitle">Support</span>
                        <h2 className="wl_section_title">Frequently Asked Questions</h2>
                        <p className="wl_section_desc">
                            Find clear, direct answers about our private weight loss management services.
                        </p>
                    </div>

                    <div className="wl_faq_list">
                        {FAQ_ITEMS.map((item, idx) => (
                            <div className={`wl_faq_item ${faqActive[idx] ? 'active' : ''}`} key={idx}>
                                <button className="wl_faq_question" onClick={() => toggleFaq(idx)}>
                                    <span>{item.question}</span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="wl_faq_arrow"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>
                                <div className="wl_faq_answer">
                                    <div className="wl_faq_answer_inner">
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section className="wl_cta_section">
                <div className="wl_cta_container">
                    <span className="wl_cta_eyebrow">Start Today</span>
                    <h2 className="wl_cta_title">Ready to Begin Your Weight Loss Journey?</h2>
                    <p className="wl_cta_desc">
                        Take control of your health. Book an in-person PHARMACY assessment today with our professional team.
                    </p>
                    <Link href="/book-appointment?service=Weight%20Loss%20Clinic" className="wl_cta_btn">
                        Book Your Consultation Now
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                    <p className="wl_cta_note">Subject to PHARMACY suitability assessment. Patients must be aged 18 or over.</p>
                </div>
            </section>
        </div>
    );
}

