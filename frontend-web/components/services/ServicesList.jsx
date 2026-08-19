"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
import './ServicesList.css';

const defaultCoreServices = [
    {
        title: "Weight Loss Clinic",
        tag: "Specialised Clinic",
        img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        desc: "PHARMACYly proven medical weight loss programs including Wegovy and Mounjaro, with full PHARMACY support.",
        color: "var(--primary)",
        link: "/services/wegovy"
    },
    {
        title: "Ear Microsuction",
        tag: "Advanced Care",
        img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
        desc: "Safe, painless, and effective earwax removal using the latest microsuction technology.",
        color: "var(--accent)",
        link: "/services/ear-wax-removal"
    },
    {
        title: "Health Screenings",
        tag: "Prevention",
        img: "https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=800&q=80",
        desc: "Detailed health checks including cholesterol, glucose, and full cardiovascular risk assessments.",
        color: "var(--highlight-purple)",
        link: "/services/nhs-blood-pressure"
    }
];

export default function ServicesList() {
    const sectionRef = useRef(null);
    const [services, setServices] = useState(defaultCoreServices);

    useEffect(() => {
        const fetchLiveServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
                    const dbMap = {};
                    json.data.forEach(s => {
                        if (s.title) dbMap[s.title.toLowerCase().trim()] = s;
                        if (s.slug) dbMap[s.slug.toLowerCase().trim()] = s;
                    });

                    setServices(defaultCoreServices.map(s => {
                        const matchKey = s.title.toLowerCase().includes('weight') ? 'weight-loss-management'
                            : s.title.toLowerCase().includes('vac') ? 'travel-clinic'
                            : s.title.toLowerCase().includes('ear') ? 'ear-wax-removal'
                            : s.title.toLowerCase().includes('health') ? 'nhs-blood-pressure'
                            : s.title.toLowerCase().trim();

                        const match = dbMap[matchKey] || dbMap[s.title.toLowerCase().trim()];
                        return match ? { ...s, img: match.img || s.img, desc: match.desc || s.desc } : s;
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch core services from API:", err);
            }
        };
        fetchLiveServices();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('sl_animate');
                }
            });
        }, { threshold: 0.1 });

        const cards = sectionRef.current?.querySelectorAll('.sl_card_wrapper');
        if (cards) {
            cards.forEach(card => observer.observe(card));
        }

        return () => observer.disconnect();
    }, [services]);

    const getImgUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80';
        return getImageUrl(img) || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80';
    };

    return (
        <section className="sl_section" ref={sectionRef}>
            <div className="sl_container">
                <div className="sl_header">
                    <h2 className="sl_title">Core Pharmacy Services</h2>
                    <p className="sl_subtitle">Advanced pharmaceutical care delivered by experienced healthcare professionals.</p>
                </div>

                <div className="sl_grid">
                    {services.map((service, idx) => (
                        <div className="sl_card_wrapper" key={idx}>
                            <div className="sl_card">
                                <div className="sl_img_side">
                                    <img src={getImgUrl(service.img)} alt={service.title} />
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
                                        <Link href={`/book-appointment?service=${encodeURIComponent(service.title)}`} className="sl_btn_primary">Book Appointment</Link>
                                        <Link href={service.link} className="sl_btn_secondary">View Details</Link>
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

