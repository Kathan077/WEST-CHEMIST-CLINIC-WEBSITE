"use client";
import React, { useState, useEffect, useRef } from 'react';
import { API_URL, getImageUrl } from '@/config';
import './TravelClinic.css';

const isVaccination = (s) => {
    const slug = (s.slug || '').toLowerCase();
    const cat = (s.cat || '').toLowerCase();
    const parentCat = (s.parentCategory || '').toLowerCase();
    const title = (s.title || '').toLowerCase();
    
    const isWeightLoss = parentCat.includes('weight') || cat.includes('weight') || slug === 'wegovy' || slug === 'mounjaro' || title.includes('weight') || title.includes('wegovy') || title.includes('mounjaro');
    if (isWeightLoss) return false;
    if (slug === 'travel-clinic' || title === 'travel clinic' || slug === 'travel-clinic-service') return false;
    
    return (
        parentCat === 'vaccination services' ||
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

export default function TravelClinic() {
    const listRef = useRef(null);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data)) {
                    // Filter for Travel Clinic category
                    const travelSrvs = json.data.filter(s => (s.parentCategory || '').toLowerCase() === 'travel clinic');
                    setServices(travelSrvs);
                }
            } catch (err) {
                console.error("Failed to fetch Travel Clinic services: ", err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('tc_revealed');
                }
            });
        }, { threshold: 0.1 });

        const cards = listRef.current?.querySelectorAll('.tc_card');
        if (cards) {
            cards.forEach(card => observer.observe(card));
        }

        return () => observer.disconnect();
    }, [services]);

    if (services.length === 0) {
        return null;
    }

    return (
        <section className="tc_section">
            <div className="tc_container">
                <div className="tc_header">
                    <span className="tc_eyebrow">Health Abroad</span>
                    <h2 className="tc_title">Travel Clinic</h2>
                    <p className="tc_desc">Destination-specific travel health advice and essential vaccinations for your safety abroad. Book a private consultation with our travel health experts.</p>
                </div>

                <div className="tc_grid" ref={listRef}>
                    {services.map((s, idx) => (
                        <div 
                            className="tc_card" 
                            key={s._id || idx} 
                            style={{ 
                                '--delay': `${idx * 0.05}s`,
                                '--bg': s.color || '#008473'
                            }}
                        >
                            <div className="tc_img_wrap">
                                <img 
                                    src={getImageUrl(s.img)} 
                                    alt={s.title} 
                                    className="tc_img" 
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1500835595300-478db374780d?w=600&q=80'; }}
                                />
                                <div className="tc_tag">{s.cat || 'Vaccination'}</div>
                            </div>
                            <div className="tc_info">
                                <h3 className="tc_card_title">{s.title}</h3>
                                <p className="tc_card_desc">{s.desc}</p>
                                <div className="tc_actions">
                                    <button 
                                        className="tc_btn_view"
                                        onClick={() => window.location.href = `/services/${s.slug}`}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="tc_btn_book"
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
