"use client";
import React, { useState, useEffect, useRef } from 'react';
import { API_URL, getImageUrl } from '@/config';
import './NHSServices.css';

const isWeightLoss = (s) => {
    const slug = (s.slug || '').toLowerCase();
    return slug === 'wegovy' || slug === 'mounjaro' || slug === 'wegovy-pills';
};

const isVaccination = (s) => {
    if (isWeightLoss(s)) return false;
    const slug = (s.slug || '').toLowerCase();
    const cat = (s.cat || '').toLowerCase();
    const parentCat = (s.parentCategory || '').toLowerCase();
    const title = (s.title || '').toLowerCase();
    
    if (slug === 'travel-clinic' || title === 'travel clinic' || slug === 'travel-clinic-service') return false;
    
    return (
        parentCat === 'vaccination services' ||
        parentCat.includes('vacc') ||
        cat.includes('vacc') ||
        cat.includes('immuniz') ||
        title.includes('vaccin') ||
        title.includes('immunis') ||
        title.includes('immuniz') ||
        title.includes('flu') ||
        title.includes('covid') ||
        title.includes('meningitis') ||
        title.includes('shingles') ||
        title.includes('chickenpox') ||
        title.includes('hpv') ||
        title.includes('rabies') ||
        title.includes('hepatitis') ||
        title.includes('typhoid') ||
        title.includes('yellow fever') ||
        title.includes('dengue') ||
        title.includes('chikungunya') ||
        title.includes('encephalitis') ||
        title.includes('dtp') ||
        title.includes('mmr') ||
        title.includes('cholera')
    );
};

export default function NHSServices() {
    const gridRef = useRef(null);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data)) {
                    const nhs = json.data.filter(s => (s.parentCategory || '').toLowerCase() === 'nhs services (pharmacy first)' && !isWeightLoss(s));
                    setServices(nhs);
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

    if (services.length === 0) {
        return null;
    }

    return (
        <section className="ns_section">
            <div className="ns_container">
                <div className="ns_header">
                    <span className="ns_eyebrow">Professional Pharma Care</span>
                    <h2 className="ns_title">NHS Pharmacy Services</h2>
                    <p className="ns_desc">Explore our NHS Pharmacy First services, vaccination programmes, blood pressure checks, and contraception services — all available without a GP referral.</p>
                </div>

                <div className="ns_grid" ref={gridRef}>
                    {services.map((s, idx) => (
                        <div 
                            className="ns_card" 
                            key={s._id || idx}
                            style={{ 
                                '--bg': idx % 2 === 0 ? '#008473' : '#4B2D71',
                                '--delay': `${idx * 0.1}s`
                            }}
                        >
                            <div className="ns_card_bottom">
                                <img src={getImageUrl(s.img)} alt={s.title} className="ns_image" />
                                <div className="ns_image_gradient" />
                            </div>
                            <div className="ns_card_top">
                                <div className="ns_meta">
                                    <span className="ns_cat">{s.cat}</span>
                                </div>
                                <h3 className="ns_card_title">{s.title}</h3>
                                <p className="ns_card_desc">{s.desc}</p>
                                <div className="ns_actions">
                                    <button 
                                        className="ns_btn_view"
                                        onClick={() => window.location.href = `/services/${s.slug}`}
                                    >
                                        View
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

