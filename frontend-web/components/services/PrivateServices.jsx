"use client";
import React, { useState, useEffect, useRef } from 'react';
import './PrivateServices.css';
import { API_URL, getImageUrl } from '@/config';

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

export default function PrivateServices() {
    const listRef = useRef(null);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data)) {
                    const privateSrvs = json.data.filter(s => (s.parentCategory || '').toLowerCase() === 'private services' && !isWeightLoss(s));
                    setServices(privateSrvs);
                }
            } catch (err) {
                console.error("Failed to fetch services: ", err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ps_revealed');
                }
            });
        }, { threshold: 0.1 });

        const cards = listRef.current?.querySelectorAll('.ps_card');
        if (cards) {
            cards.forEach(card => observer.observe(card));
        }

        return () => observer.disconnect();
    }, [services]);

    if (services.length === 0) {
        return null;
    }

    return (
        <section className="ps_section">
            <div className="ps_container">
                <div className="ps_header">
                    <span className="ps_eyebrow">Private Healthcare</span>
                    <h2 className="ps_title">Personalised Pharmacy Solutions</h2>
                    <p className="ps_desc">Period delay, weight loss management, ear wax removal, cryotherapy and travel pharmacy — premium private treatments delivered by qualified pharmacists.</p>
                </div>

                <div className="ps_grid" ref={listRef}>
                    {services.map((s, idx) => (
                        <div
                            className="ps_card"
                            key={s._id || idx}
                            style={{
                                '--delay': `${idx * 0.1}s`,
                                '--bg': s.color || '#4B2D71'
                            }}
                        >
                            <div className="ps_img_wrap">
                                <img
                                    src={getImageUrl(s.img)}
                                    alt={s.title}
                                    className="ps_img"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80'; }}
                                />
                                <div className="ps_tag">{s.cat}</div>
                            </div>
                            <div className="ps_info">
                                <h3 className="ps_card_title">{s.title}</h3>
                                <p className="ps_card_desc">{s.desc}</p>
                                <div className="ps_actions">
                                    <button
                                        className="ps_btn_view"
                                        onClick={() => window.location.href = `/services/${s.slug}`}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="ps_btn_book"
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
