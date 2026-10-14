"use client";
import React, { useState, useEffect, useRef } from 'react';
import './PrivateServices.css';
import { API_URL, getImageUrl } from '@/config';

const DEFAULT_PRIVATE_HEADER = {
    eyebrow: 'Private Healthcare',
    title: 'Personalised Pharmacy Solutions',
    desc: 'Specialist ear care, medical dermatology, women\'s health, and travel protection — premium private clinical treatments delivered by trained practitioners.'
};

const isWeightLoss = (s) => {
    const slug = (s.slug || '').toLowerCase();
    return slug === 'wegovy' || slug === 'mounjaro' || slug === 'wegovy-pills';
};

export default function PrivateServices({ initialHeader }) {
    const listRef = useRef(null);
    const [services, setServices] = useState([]);
    const [header, setHeader] = useState(() => ({ ...DEFAULT_PRIVATE_HEADER, ...(initialHeader || {}) }));

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
                    {header.eyebrow && <span className="ps_eyebrow">{header.eyebrow}</span>}
                    <h2 className="ps_title">{header.title}</h2>
                    <p className="ps_desc">{header.desc}</p>
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
                                        View Details
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
