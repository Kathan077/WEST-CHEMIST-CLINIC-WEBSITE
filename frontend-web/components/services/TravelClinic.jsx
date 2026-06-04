"use client";
import React, { useEffect, useRef } from 'react';
import './TravelClinic.css';

const vaccines = [
    "Diphtheria/Tetanus/Polio",
    "Typhoid",
    "Typhoid Oral",
    "Hepatitis A & Typhoid Combined",
    "Hepatitis A",
    "Hepatitis B",
    "Twinrix (Hepatitis A&B)",
    "Cholera",
    "Rabies",
    "Meningitis ACWY with Certificate",
    "Meningitis Menveo with Certificate",
    "Japanese Encephalitis",
    "Tick-Borne Encephalitis"
];

export default function TravelClinic() {
    const listRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('tc_visible');
                }
            });
        }, { threshold: 0.1 });

        const items = listRef.current.querySelectorAll('.tc_vax_item');
        items.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="tc_section">
            <div className="tc_container">
                <div className="tc_grid">
                    {/* Left: Content */}
                    <div className="tc_content">
                        <span className="tc_eyebrow">Health Abroad</span>
                        <h2 className="tc_title">Travel Clinic</h2>
                        <p className="tc_text">
                            Protect your journey with our comprehensive travel vaccination services. 
                            Our experts provide personalised advice and essential immunisations 
                            for global destinations.
                        </p>
                        <button className="tc_btn">
                            Start Now
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>

                    {/* Right: Vaccination List */}
                    <div className="tc_list_box">
                        <h3 className="tc_list_title">Available Vaccinations</h3>
                        <div className="tc_vax_grid" ref={listRef}>
                            {vaccines.map((v, idx) => (
                                <div className="tc_vax_item" key={idx} style={{ '--delay': `${idx * 0.05}s` }}>
                                    <div className="tc_check">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <span className="tc_vax_name">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Artistic Background Elements */}
            <div className="tc_bg_shape tc_s1" />
            <div className="tc_bg_shape tc_s2" />
        </section>
    );
}
