"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './ServicesList.css';

const coreServices = [
    {
        title: "Weight Loss Clinic",
        tag: "Specialised Clinic",
        img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        desc: "Clinically proven medical weight loss programs including Wegovy and Mounjaro, with full clinical support.",
        color: "var(--primary)"
    },
    {
        title: "Vaccinations & Travel",
        tag: "Global Health",
        img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
        desc: "Comprehensive travel vaccinations and seasonal immunisations for your family's protection.",
        color: "var(--secondary)"
    },
    {
        title: "Ear Microsuction",
        tag: "Advanced Care",
        img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
        desc: "Safe, painless, and effective earwax removal using the latest microsuction technology.",
        color: "var(--accent)"
    },
    {
        title: "Health Screenings",
        tag: "Prevention",
        img: "https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=800&q=80",
        desc: "Detailed health checks including cholesterol, glucose, and full cardiovascular risk assessments.",
        color: "var(--highlight-purple)"
    }
];

export default function ServicesList() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('sl_animate');
                }
            });
        }, { threshold: 0.1 });

        const cards = sectionRef.current.querySelectorAll('.sl_card_wrapper');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="sl_section" ref={sectionRef}>
            <div className="sl_container">
                <div className="sl_header">
                    <h2 className="sl_title">Core Clinical Services</h2>
                    <p className="sl_subtitle">Advanced medical care delivered by experienced healthcare professionals.</p>
                </div>

                <div className="sl_grid">
                    {coreServices.map((service, idx) => (
                        <div className="sl_card_wrapper" key={idx}>
                            <div className="sl_card">
                                <div className="sl_img_side">
                                    <img src={service.img} alt={service.title} />
                                    <div className="sl_img_overlay" style={{ background: service.color }} />
                                    <span className="sl_tag">{service.tag}</span>
                                </div>
                                <div className="sl_content_side">
                                    <h3>{service.title}</h3>
                                    <p>{service.desc}</p>
                                    <div className="sl_features">
                                        <div className="sl_f_item">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                            <span>Certified Clinicians</span>
                                        </div>
                                        <div className="sl_f_item">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                            <span>Private Consultation</span>
                                        </div>
                                    </div>
                                    <div className="sl_actions">
                                        <Link href="/book-appointment" className="sl_btn_primary">Book Appointment</Link>
                                        <button className="sl_btn_secondary">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
