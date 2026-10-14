"use client";
import React, { useState, useEffect, useRef } from 'react';
import { API_URL, getImageUrl } from '@/config';
import './NHSServices.css';

const DEFAULT_NHS_HEADER = {
    eyebrow: 'Official NHS Healthcare Partner',
    title: 'NHS Pharmacy First Services',
    desc: 'Get convenient access to NHS-funded clinical consultations and eligible treatments for selected common conditions through our Pharmacy First service. Our trained pharmacy team can assess your symptoms, provide professional advice, and recommend appropriate treatment, helping you access care without always needing a GP appointment.',
    logo: '/images/nhs-logo.svg'
};

const isWeightLoss = (s) => {
    const slug = (s.slug || '').toLowerCase();
    return slug === 'wegovy' || slug === 'mounjaro' || slug === 'wegovy-pills';
};

export default function NHSServices({ initialHeader }) {
    const gridRef = useRef(null);
    const [services, setServices] = useState([]);
    const [header, setHeader] = useState(() => ({ ...DEFAULT_NHS_HEADER, ...(initialHeader || {}) }));

    useEffect(() => {
        if (initialHeader) {
            setHeader(prev => ({ ...prev, ...initialHeader }));
        }
    }, [initialHeader]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data)) {
                    const nhs = json.data.filter(s => (s.parentCategory || '').toLowerCase().includes('nhs') && !isWeightLoss(s));
                    if (nhs.length > 0) {
                        setServices(nhs);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch NHS services: ", err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ns_revealed');
                }
            });
        }, { threshold: 0.1 });

        const items = gridRef.current?.querySelectorAll('.ns_card');
        if (items) {
            items.forEach(item => observer.observe(item));
        }

        return () => observer.disconnect();
    }, [services]);

    const rawLogo = header.logo ? getImageUrl(header.logo) : '/images/nhs-logo.svg';
    const logoSrc = (!rawLogo || rawLogo === '/images/passport.jpg') ? '/images/nhs-logo.svg' : rawLogo;

    return (
        <section className="ns_section">
            <div className="ns_container">
                <div className="ns_header">
                    <div className="ns_branding_bar">
                        <img 
                            src={logoSrc} 
                            alt="NHS Logo" 
                            className="ns_nhs_logo" 
                        />
                    </div>
                    {header.eyebrow && <span className="ns_eyebrow">{header.eyebrow}</span>}
                    <h2 className="ns_title">{header.title}</h2>
                    <p className="ns_desc">
                        {header.desc}
                    </p>
                </div>

                <div className="ns_grid" ref={gridRef}>
                    {services.map((s, idx) => (
                        <div 
                            className="ns_card ns_revealed" 
                            key={s._id || idx}
                            style={{ 
                                '--bg': '#4B2D71',
                                '--delay': `${idx * 0.1}s`
                            }}
                        >
                            <div className="ns_card_bottom">
                                <img 
                                    src={getImageUrl(s.img) || s.img} 
                                    alt={s.title} 
                                    className="ns_image" 
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80'; }}
                                />
                                <div className="ns_image_gradient" />
                            </div>
                            <div className="ns_card_top">
                                <div className="ns_meta">
                                    <span className="ns_cat">{s.cat || 'NHS Pharmacy First'}</span>
                                </div>
                                <h3 className="ns_card_title">{s.title}</h3>
                                <p className="ns_card_desc">{s.desc}</p>
                                <div className="ns_actions">
                                    <button 
                                        className="ns_btn_view"
                                        onClick={() => window.location.href = `/services/${s.slug}`}
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        className="ns_btn_book"
                                        onClick={() => window.location.href = `/book-appointment?service=${encodeURIComponent(s.title)}`}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
