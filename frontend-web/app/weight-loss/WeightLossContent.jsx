"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
import './WeightLoss.css';

const DEFAULT_FAQS = [
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

const DEFAULT_ROWS = [
    {
        parameter: "Active Ingredient",
        col1: "Tirzepatide",
        col2: "Semaglutide",
        badge1: "",
        badge2: ""
    },
    {
        parameter: "Drug Class / Mechanism",
        col1: "Dual GIP & GLP-1 Receptor Agonist",
        col2: "GLP-1 Receptor Agonist",
        badge1: "",
        badge2: ""
    },
    {
        parameter: "Administration",
        col1: "Once-weekly injection",
        col2: "Once-weekly injection",
        badge1: "",
        badge2: ""
    },
    {
        parameter: "Average Weight Loss Efficacy",
        col1: "Up to 20.9%",
        col2: "Up to 15%",
        badge1: "accent",
        badge2: "purple"
    },
    {
        parameter: "Starting Dose",
        col1: "2.5 mg weekly for 4 weeks",
        col2: "0.25 mg weekly for 4 weeks",
        badge1: "",
        badge2: ""
    },
    {
        parameter: "Maintenance Doses",
        col1: "5mg, 7.5mg, 10mg, 12.5mg, 15mg weekly",
        col2: "2.4 mg weekly",
        badge1: "",
        badge2: ""
    },
    {
        parameter: "Eligibility (BMI)",
        col1: "BMI ≥ 30, or ≥ 27 with complications",
        col2: "BMI ≥ 30, or ≥ 27 with complications",
        badge1: "",
        badge2: ""
    }
];

const DEFAULT_STEPS = [
    {
        stepNumber: "1",
        title: "Book Appointment",
        desc: "Book a private consultation slot with our qualified pharmacist online."
    },
    {
        stepNumber: "2",
        title: "PHARMACY Review",
        desc: "Complete an in-person weight, BMI assessment, and medical history review."
    },
    {
        stepNumber: "3",
        title: "Prescribe & Dispense",
        desc: "If suitable, our pharmacist issues your prescription and dispenses the medication immediately."
    },
    {
        stepNumber: "4",
        title: "Ongoing Reviews",
        desc: "Monthly follow-ups to track weight loss, manage dosage increases, and side effects."
    }
];

export default function WeightLossContent({ initialCMS }) {
    const [faqActive, setFaqActive] = useState({});
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const buildInitialCMS = (data) => ({
        hero: {
            tag: data?.hero?.tag ?? 'Pharmacy Service',
            title: data?.hero?.title ?? 'PHARMACYly Supervised',
            highlight: data?.hero?.highlight ?? 'Weight Loss Program',
            desc: data?.hero?.desc ?? 'Achieve safe, sustainable weight reduction with next-generation medical treatments under professional PHARMACY supervision. We offer tailored Wegovy and Mounjaro programs designed for your biology.',
            btn1Text: data?.hero?.btn1Text ?? 'Book Private Consultation',
            btn1Url: data?.hero?.btn1Url ?? '/book-appointment?service=Weight%20Loss%20Clinic',
            btn2Text: data?.hero?.btn2Text ?? 'Compare Treatments',
            btn2Url: data?.hero?.btn2Url ?? '#comparison'
        },
        treatmentsHeader: {
            subtitle: data?.treatmentsHeader?.subtitle ?? 'PHARMACY Treatments',
            title: data?.treatmentsHeader?.title ?? 'Our Weight Management Options',
            desc: data?.treatmentsHeader?.desc ?? 'We provide MHRA-approved medications and comprehensive health coaching to support your metabolic health journey.'
        },
        comparisonTable: {
            subtitle: data?.comparisonTable?.subtitle ?? 'Head to Head',
            title: data?.comparisonTable?.title ?? 'Mounjaro vs Wegovy Comparison',
            desc: data?.comparisonTable?.desc ?? 'Compare the features, mechanism, and efficacy of the leading medical weight management treatments.',
            col1Name: data?.comparisonTable?.col1Name ?? 'Parameter',
            col2Name: data?.comparisonTable?.col2Name ?? 'Mounjaro® (Tirzepatide)',
            col3Name: data?.comparisonTable?.col3Name ?? 'Wegovy® (Semaglutide)',
            rows: Array.isArray(data?.comparisonTable?.rows) && data.comparisonTable.rows.length > 0
                ? data.comparisonTable.rows
                : DEFAULT_ROWS
        },
        howItWorks: {
            subtitle: data?.howItWorks?.subtitle ?? 'Your Journey',
            title: data?.howItWorks?.title ?? 'How Our Weight Loss Program Works',
            desc: data?.howItWorks?.desc ?? 'A simple, secure, and pharmacist-led process to help you get started safely.',
            steps: Array.isArray(data?.howItWorks?.steps) && data.howItWorks.steps.length > 0
                ? data.howItWorks.steps
                : DEFAULT_STEPS
        },
        faqs: {
            subtitle: data?.faqs?.subtitle ?? 'Support',
            title: data?.faqs?.title ?? 'Frequently Asked Questions',
            desc: data?.faqs?.desc ?? 'Find clear, direct answers about our private weight loss management services.',
            items: Array.isArray(data?.faqs?.items) && data.faqs.items.length > 0
                ? data.faqs.items
                : DEFAULT_FAQS
        },
        cta: {
            eyebrow: data?.cta?.eyebrow ?? 'Start Today',
            title: data?.cta?.title ?? 'Ready to Begin Your Weight Loss Journey?',
            desc: data?.cta?.desc ?? 'Take control of your health. Book an in-person PHARMACY assessment today with our professional team.',
            btnText: data?.cta?.btnText ?? 'Book Your Consultation Now',
            btnUrl: data?.cta?.btnUrl ?? '/book-appointment?service=Weight%20Loss%20Clinic',
            note: data?.cta?.note ?? 'Subject to PHARMACY suitability assessment. Patients must be aged 18 or over.'
        }
    });

    const [cms, setCms] = useState(() => buildInitialCMS(initialCMS));

    const toggleFaq = (index) => {
        setFaqActive(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        // Fetch CMS Data
        const fetchCMS = async () => {
            try {
                const res = await fetch(`${API_URL}/api/weight-loss/cms`, { cache: 'no-store' });
                const json = await res.json();
                if (res.ok && json.success && json.data) {
                    setCms(prev => ({
                        ...prev,
                        hero: { ...prev.hero, ...(json.data.hero || {}) },
                        treatmentsHeader: { ...prev.treatmentsHeader, ...(json.data.treatmentsHeader || {}) },
                        comparisonTable: {
                            ...prev.comparisonTable,
                            ...(json.data.comparisonTable || {}),
                            rows: Array.isArray(json.data.comparisonTable?.rows) && json.data.comparisonTable.rows.length > 0
                                ? json.data.comparisonTable.rows
                                : prev.comparisonTable.rows
                        },
                        howItWorks: {
                            ...prev.howItWorks,
                            ...(json.data.howItWorks || {}),
                            steps: Array.isArray(json.data.howItWorks?.steps) && json.data.howItWorks.steps.length > 0
                                ? json.data.howItWorks.steps
                                : prev.howItWorks.steps
                        },
                        faqs: {
                            ...prev.faqs,
                            ...(json.data.faqs || {}),
                            items: Array.isArray(json.data.faqs?.items) && json.data.faqs.items.length > 0
                                ? json.data.faqs.items
                                : prev.faqs.items
                        },
                        cta: { ...prev.cta, ...(json.data.cta || {}) }
                    }));
                }
            } catch (err) {
                console.error("Error loading dynamic CMS in WeightLossContent:", err);
            }
        };

        // Fetch Services Data
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

        fetchCMS();
        fetchServices();
    }, []);

    const displayServices = services;

    return (
        <div className="wl_page_wrapper">
            {/* ── HERO BANNER ── */}
            <section className="wl_hero_banner">
                <div className="wl_hero_container">
                    <div className="wl_hero_info">
                        {cms.hero.tag && <span className="wl_hero_tag">{cms.hero.tag}</span>}
                        <h1 className="wl_hero_title">
                            {cms.hero.title} {cms.hero.highlight && <span>{cms.hero.highlight}</span>}
                        </h1>
                        <p className="wl_hero_description">
                            {cms.hero.desc}
                        </p>
                        <div className="wl_hero_buttons">
                            <Link href={cms.hero.btn1Url || "/book-appointment?service=Weight%20Loss%20Clinic"} className="wl_btn_primary">
                                {cms.hero.btn1Text || 'Book Private Consultation'}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                            {cms.hero.btn2Text && (
                                <a href={cms.hero.btn2Url || "#comparison"} className="wl_btn_secondary">
                                    {cms.hero.btn2Text}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TREATMENTS SECTION ── */}
            <section className="wl_treatments_section">
                <div className="wl_section_container">
                    <div className="wl_section_header">
                        {cms.treatmentsHeader.subtitle && <span className="wl_section_subtitle">{cms.treatmentsHeader.subtitle}</span>}
                        <h2 className="wl_section_title">{cms.treatmentsHeader.title}</h2>
                        <p className="wl_section_desc">
                            {cms.treatmentsHeader.desc}
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
                        {cms.comparisonTable.subtitle && <span className="wl_section_subtitle">{cms.comparisonTable.subtitle}</span>}
                        <h2 className="wl_section_title">{cms.comparisonTable.title}</h2>
                        <p className="wl_section_desc">
                            {cms.comparisonTable.desc}
                        </p>
                    </div>

                    <div className="wl_table_responsive">
                        <table className="wl_comparison_table">
                            <thead>
                                <tr>
                                    <th>{cms.comparisonTable.col1Name || 'Parameter'}</th>
                                    <th>{cms.comparisonTable.col2Name || 'Mounjaro® (Tirzepatide)'}</th>
                                    <th>{cms.comparisonTable.col3Name || 'Wegovy® (Semaglutide)'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(cms.comparisonTable.rows || []).map((row, idx) => (
                                    <tr key={row._id || idx}>
                                        <td className="wl_table_param">{row.parameter}</td>
                                        <td>
                                            {row.badge1 ? (
                                                <span className={`wl_badge_pill ${row.badge1}`}>{row.col1}</span>
                                            ) : (
                                                row.col1
                                            )}
                                        </td>
                                        <td>
                                            {row.badge2 ? (
                                                <span className={`wl_badge_pill ${row.badge2}`}>{row.col2}</span>
                                            ) : (
                                                row.col2
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="wl_how_it_works_section">
                <div className="wl_section_container">
                    <div className="wl_section_header">
                        {cms.howItWorks.subtitle && <span className="wl_section_subtitle">{cms.howItWorks.subtitle}</span>}
                        <h2 className="wl_section_title">{cms.howItWorks.title}</h2>
                        <p className="wl_section_desc">
                            {cms.howItWorks.desc}
                        </p>
                    </div>

                    <div className="wl_timeline_grid">
                        {(cms.howItWorks.steps || []).map((step, idx) => (
                            <div className="wl_timeline_step" key={step._id || idx}>
                                <div className="wl_step_num">{step.stepNumber || idx + 1}</div>
                                <h3 className="wl_step_title">{step.title}</h3>
                                <p className="wl_step_desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ SECTION ── */}
            <section className="wl_faq_section">
                <div className="wl_section_container">
                    <div className="wl_section_header">
                        {cms.faqs.subtitle && <span className="wl_section_subtitle">{cms.faqs.subtitle}</span>}
                        <h2 className="wl_section_title">{cms.faqs.title}</h2>
                        <p className="wl_section_desc">
                            {cms.faqs.desc}
                        </p>
                    </div>

                    <div className="wl_faq_list">
                        {(cms.faqs.items || []).map((item, idx) => (
                            <div className={`wl_faq_item ${faqActive[idx] ? 'active' : ''}`} key={item._id || idx}>
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
                    {cms.cta.eyebrow && <span className="wl_cta_eyebrow">{cms.cta.eyebrow}</span>}
                    <h2 className="wl_cta_title">{cms.cta.title}</h2>
                    <p className="wl_cta_desc">
                        {cms.cta.desc}
                    </p>
                    <Link href={cms.cta.btnUrl || "/book-appointment?service=Weight%20Loss%20Clinic"} className="wl_cta_btn">
                        {cms.cta.btnText || 'Book Your Consultation Now'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                    {cms.cta.note && <p className="wl_cta_note">{cms.cta.note}</p>}
                </div>
            </section>
        </div>
    );
}
