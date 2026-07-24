"use client";
import React, { useEffect, useRef } from 'react';
import { API_URL } from '@/config';
import '@/components/services/PrivateServices.css';

export default function CustomCategorySection({ categoryName, services }) {
    const listRef = useRef(null);

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

    if (!services || services.length === 0) return null;

    const getImgUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80';
        if (img.startsWith('/uploads')) return `${API_URL}${img}`;
        return img;
    };

    return (
        <section className="ps_section" style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
            <div className="ps_container">
                <div className="ps_header">
                    <span className="ps_eyebrow">Clinical Services</span>
                    <h2 className="ps_title">{categoryName}</h2>
                    <p className="ps_desc">Explore our professional and certified healthcare solutions under {categoryName}.</p>
                </div>

                <div className="ps_grid" ref={listRef}>
                    {services.map((s, idx) => (
                        <div 
                            className="ps_card" 
                            key={idx} 
                            style={{ 
                                '--delay': `${idx * 0.1}s`,
                                '--bg': s.color || '#4B2D71'
                            }}
                        >
                            <div className="ps_img_wrap">
                                <img src={getImgUrl(s.img)} alt={s.title} className="ps_img" />
                                <div className="ps_tag">{s.cat}</div>
                            </div>
                            <div className="ps_info">
                                <h3 className="ps_card_title">{s.title}</h3>
                                <p className="ps_card_desc">{s.desc}</p>
                                <div className="ps_actions">
                                    <button 
                                        className="ps_btn_view"
                                        onClick={() => window.location.href = `/services/${s.slug || s.title.toLowerCase().replace(/\s+/g, '-')}`}
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
                                <div className="ps_line" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
