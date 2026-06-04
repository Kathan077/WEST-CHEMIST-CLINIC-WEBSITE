"use client";
import React, { useEffect, useRef } from 'react';
import './PharmacyFirst.css';

const pfServices = [
    {
        title: "Sore Throat Service",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>,
        desc: "Expert assessment and treatment for persistent sore throats."
    },
    {
        title: "Sinusitis Service",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
        desc: "Relief and care for sinus pain and congestion."
    },
    {
        title: "Infected Bites",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="M2 12h20"/><path d="m19.07 4.93-14.14 14.14"/></svg>,
        desc: "Professional treatment for insect bites that have become infected."
    },
    {
        title: "Impetigo Service",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18Z"/><path d="M12 8v4l3 3"/></svg>,
        desc: "Specialised care for impetigo skin infections."
    },
    {
        title: "Shingles Service",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
        desc: "Support and treatment options for shingles symptoms."
    },
    {
        title: "Urinary Tract Infection",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
        desc: "Convenient assessment and treatment for UTIs."
    },
    {
        title: "Otitis Media (Ear)",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
        desc: "Diagnosis and care for middle ear infections."
    },
    {
        title: "Blood Pressure",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
        desc: "Regular blood pressure monitoring and health advice."
    },
    {
        title: "Flu Vaccination",
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 11h-3"/><path d="M17 15h-6"/><path d="M11 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-4"/><path d="m10 11-2 2 2 2"/></svg>,
        desc: "Stay protected this season with our flu vaccination service."
    }
];

export default function PharmacyFirst() {
    const listRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('pf_visible');
                }
            });
        }, { threshold: 0.1 });

        const items = listRef.current.querySelectorAll('.pf_item');
        items.forEach(item => observer.observe(item));
        
        return () => observer.disconnect();
    }, []);

    return (
        <section className="pf_section">
            <div className="pf_container">
                <div className="pf_header">
                    <span className="pf_subtitle">NHS Service</span>
                    <h2 className="pf_title">Pharmacy First Services</h2>
                    <p className="pf_desc">Convenient, expert healthcare available directly from your pharmacist. No GP appointment needed for these common conditions.</p>
                </div>

                <div className="pf_grid" ref={listRef}>
                    {pfServices.map((service, idx) => (
                        <div className="pf_item" key={idx} style={{ '--delay': `${idx * 0.1}s` }}>
                            <div className="pf_card">
                                <div className="pf_icon_box">
                                    {service.icon}
                                </div>
                                <h3 className="pf_card_title">{service.title}</h3>
                                <p className="pf_card_desc">{service.desc}</p>
                                <div className="pf_card_action">
                                    <span>Learn More</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
